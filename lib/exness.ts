export class ExnessError extends Error {}

export const EXNESS_BASE = "https://my.exnessaffiliates.com";
export const MIN_DEPOSIT_USD = 100;
export const MIN_BALANCE_USD = 50;
export const CENT_FACTOR = 100;

const REQUEST_TIMEOUT_MS = 15_000;
const TOKEN_TTL_MS = 23 * 3_600_000;

interface TokenCache {
  value: string;
  expiresAt: number;
}

let tokenCache: TokenCache | null = null;

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

async function authenticate(): Promise<string> {
  const login = process.env.EXNESS_LOGIN;
  const password = process.env.EXNESS_PASSWORD;
  if (!login || !password) {
    throw new ExnessError("not_configured");
  }
  const response = await fetch(`${EXNESS_BASE}/api/v2/auth/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ login, password }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
  });
  if (!response.ok) {
    throw new ExnessError(`http_${response.status}`);
  }
  const payload = asRecord(await response.json());
  const token = payload?.token;
  if (typeof token !== "string" || token.length === 0) {
    throw new ExnessError("auth_failed");
  }
  tokenCache = { value: token, expiresAt: Date.now() + TOKEN_TTL_MS };
  return token;
}

async function currentToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt) {
    return tokenCache.value;
  }
  return authenticate();
}

async function requestWith(path: string, token: string): Promise<Response> {
  return fetch(`${EXNESS_BASE}${path}`, {
    headers: { Authorization: `JWT ${token}`, Accept: "application/json" },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
  });
}

export async function exnessFetch(path: string): Promise<unknown> {
  let token = await currentToken();
  let response = await requestWith(path, token);
  if (response.status === 401) {
    tokenCache = null;
    token = await authenticate();
    response = await requestWith(path, token);
  }
  if (!response.ok) {
    throw new ExnessError(`http_${response.status}`);
  }
  return response.json();
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

export interface ClientStats {
  depositAmount: number;
  balance: number;
  ftdReceived: boolean;
}

export async function getClientStats(clientUid: string): Promise<ClientStats | null> {
  const payload = await exnessFetch(
    `/api/v2/reports/clients/?client_uid=${encodeURIComponent(clientUid)}&limit=1`
  );
  const first = dataArray(payload)[0];
  if (!first) return null;
  return {
    depositAmount: Number(first["deposit_amount"] ?? 0),
    balance: Number(first["client_balance"] ?? 0),
    ftdReceived: Boolean(first["ftd_received"])
  };
}

export interface RuleEvaluation {
  approved: boolean;
  reason: string;
  requiredDeposit: number;
  requiredBalance: number;
}

export function evaluateRule(
  accountType: string | null,
  stats: ClientStats | null
): RuleEvaluation {
  const isCent = accountType !== null && accountType.toLowerCase().includes("cent");
  const factor = isCent ? CENT_FACTOR : 1;
  const requiredDeposit = MIN_DEPOSIT_USD * factor;
  const requiredBalance = MIN_BALANCE_USD * factor;
  if (!stats) {
    return { approved: false, reason: "no_stats", requiredDeposit, requiredBalance };
  }
  if (stats.depositAmount >= requiredDeposit) {
    return { approved: true, reason: "deposit_ok", requiredDeposit, requiredBalance };
  }
  if (stats.balance >= requiredBalance) {
    return { approved: true, reason: "balance_ok", requiredDeposit, requiredBalance };
  }
  return { approved: false, reason: "insufficient", requiredDeposit, requiredBalance };
}
