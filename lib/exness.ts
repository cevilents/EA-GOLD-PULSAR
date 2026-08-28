export class ExnessError extends Error {}

export async function exnessFetch(path: string): Promise<unknown> {
  let token = await currentToken();
  let response = await requestWithFallback(path, token);
  if (response.status === 401) {
    tokenCache = null;
    token = await authenticate();
    response = await requestWithFallback(path, token);
  }
  if (!response.ok) {
    throw new ExnessError(`http_${response.status}`);
  }
  return response.json();
}

export const EXNESS_BASE_PRIMARY = "https://my.xsspartners.com";
export const EXNESS_BASE_FALLBACK = "https://my.exnessaffiliates.com";
export const MIN_DEPOSIT_USD = 100;
export const MIN_BALANCE_USD = 50;
export const CENT_FACTOR = 100;

const REQUEST_TIMEOUT_MS = 15_000;
const TOKEN_TTL_MS = 23 * 3_600_000;
const CLIENT_MAP_TTL_MS = 5 * 60_000;
const EXNESS_UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36";

interface TokenCache {
  value: string;
  expiresAt: number;
}

interface ClientMapCache {
  map: Map<string, { depositAmount: number; balance: number; ftdReceived: boolean }>;
  expiresAt: number;
}

let tokenCache: TokenCache | null = null;
let clientMapCache: ClientMapCache | null = null;

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function dataArray(payload: unknown): Array<Record<string, unknown>> {
  const data = asRecord(payload)?.data;
  if (!Array.isArray(data)) return [];
  const rows: Array<Record<string, unknown>> = [];
  for (const item of data) {
    const row = asRecord(item);
    if (row) rows.push(row);
  }
  return rows;
}

function bases(): string[] {
  return [EXNESS_BASE_PRIMARY, EXNESS_BASE_FALLBACK];
}

async function requestWithFallback(path: string, token: string): Promise<Response> {
  for (const base of bases()) {
    try {
      const response = await fetch(`${base}${path}`, {
        headers: { Authorization: `JWT ${token}`, Accept: "application/json", "User-Agent": EXNESS_UA },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
      });
      if (response.ok || response.status === 401) return response;
    } catch {
      continue;
    }
  }
  return new Response(null, { status: 502, statusText: "unreachable" });
}

async function tryAuthOnBase(base: string): Promise<string | null> {
  const login = process.env.EXNESS_LOGIN;
  const password = process.env.EXNESS_PASSWORD;
  if (!login || !password) return null;

  const paths = ["/api/auth/", "/api/v2/auth/token/"];
  for (const path of paths) {
    try {
      const response = await fetch(`${base}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json", "User-Agent": EXNESS_UA },
        body: JSON.stringify({ login, password }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
      });
      if (!response.ok) continue;
      const payload = asRecord(await response.json());
      const token = payload?.token ?? payload?.access_token ?? payload?.accessToken ?? payload?.jwt ?? payload?.key;
      if (typeof token === "string" && token.length > 0) return token;
    } catch {
      continue;
    }
  }
  return null;
}

async function authenticate(): Promise<string> {
  for (const base of bases()) {
    const token = await tryAuthOnBase(base);
    if (token) {
      tokenCache = { value: token, expiresAt: Date.now() + TOKEN_TTL_MS };
      return token;
    }
  }
  throw new ExnessError("not_configured");
}

async function currentToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt) {
    return tokenCache.value;
  }
  return authenticate();
}

async function fetchAllV2Clients(): Promise<Map<string, { depositAmount: number; balance: number; ftdReceived: boolean }>> {
  if (clientMapCache && Date.now() < clientMapCache.expiresAt) {
    return clientMapCache.map;
  }

  const token = await currentToken();
  const map = new Map<string, { depositAmount: number; balance: number; ftdReceived: boolean }>();
  const limit = 500;
  let offset = 0;

  for (let page = 0; page < 60; page++) {
    const path = `/api/v2/reports/clients/?limit=${limit}&offset=${offset}`;
    const payload = await exnessFetch(path);
    const rows = dataArray(payload);
    if (rows.length === 0) break;

    for (const row of rows) {
      const fullUid = String(row["client_uid"] ?? "");
      if (fullUid.length >= 8) {
        const short = fullUid.slice(0, 8).toLowerCase();
        map.set(short, {
          depositAmount: Number(row["deposit_amount"] ?? 0),
          balance: Number(row["client_balance"] ?? 0),
          ftdReceived: Boolean(row["ftd_received"])
        });
      }
    }

    if (rows.length < limit) break;
    offset += limit;
  }

  clientMapCache = { map, expiresAt: Date.now() + CLIENT_MAP_TTL_MS };
  return map;
}

export interface AccountLookup {
  underPartner: boolean;
  clientUid: string | null;
  accountType: string | null;
}

export async function findClientAccount(account: string): Promise<AccountLookup> {
  const payload = await exnessFetch(
    `/api/reports/clients/accounts/?client_account=${encodeURIComponent(account)}&limit=10`
  );
  const row =
    dataArray(payload).find((item) => String(item["client_account"]) === account) ?? null;
  if (!row) {
    return { underPartner: false, clientUid: null, accountType: null };
  }
  const clientUid = row["client_uid"];
  const accountType = row["client_account_type"];
  return {
    underPartner: true,
    clientUid: typeof clientUid === "string" ? clientUid : String(clientUid ?? ""),
    accountType: typeof accountType === "string" ? accountType : null
  };
}

function bandToMinUsd(band: number): number {
  const map = [0, 0, 10, 50, 250, 1000, 5000];
  return map[band] ?? 0;
}

function requiredBandForUsd(usd: number): number {
  if (usd <= 0) return 0;
  const bandMins = [0, 0, 10, 50, 250, 1000, 5000];
  let band = 0;
  for (let b = 1; b < bandMins.length; b++) {
    if (bandMins[b] <= usd) band = b;
    else break;
  }
  return band;
}

export interface ClientStats {
  depositBand: number;
  balanceBand: number;
  ftdReceived: boolean;
}

export async function getClientStats(clientUid: string): Promise<ClientStats | null> {
  const shortUid = clientUid.slice(0, 8).toLowerCase();
  const clientMap = await fetchAllV2Clients();
  const stats = clientMap.get(shortUid);
  if (!stats) return null;
  return {
    depositBand: stats.depositAmount,
    balanceBand: stats.balance,
    ftdReceived: stats.ftdReceived
  };
}

export interface RuleEvaluation {
  approved: boolean;
  reason: string;
  requiredDepositBand: number;
  requiredBalanceBand: number;
  depositMinUsd: number;
  balanceMinUsd: number;
}

export function evaluateRule(
  accountType: string | null,
  stats: ClientStats | null
): RuleEvaluation {
  const isCent = accountType !== null && accountType.toLowerCase().includes("cent");
  const requiredDepositUsd = MIN_DEPOSIT_USD;
  const requiredBalanceUsd = MIN_BALANCE_USD;
  const requiredDepositBand = requiredBandForUsd(requiredDepositUsd);
  const requiredBalanceBand = requiredBandForUsd(requiredBalanceUsd);

  if (!stats) {
    return {
      approved: false,
      reason: "no_stats",
      requiredDepositBand,
      requiredBalanceBand,
      depositMinUsd: requiredDepositUsd,
      balanceMinUsd: requiredBalanceUsd
    };
  }

  if (stats.depositBand >= requiredDepositBand) {
    return {
      approved: true,
      reason: "deposit_ok",
      requiredDepositBand,
      requiredBalanceBand,
      depositMinUsd: requiredDepositUsd,
      balanceMinUsd: requiredBalanceUsd
    };
  }

  if (stats.balanceBand >= requiredBalanceBand) {
    return {
      approved: true,
      reason: "balance_ok",
      requiredDepositBand,
      requiredBalanceBand,
      depositMinUsd: requiredDepositUsd,
      balanceMinUsd: requiredBalanceUsd
    };
  }

  return {
    approved: false,
    reason: "insufficient",
    requiredDepositBand,
    requiredBalanceBand,
    depositMinUsd: requiredDepositUsd,
    balanceMinUsd: requiredBalanceUsd
  };
}