import type { ClaimFields } from "./validation";

export interface ClaimCheck {
  at: string;
  approved: boolean;
  reason: string;
  depositAmount?: number;
  balance?: number;
  requiredDeposit?: number;
  requiredBalance?: number;
}

export interface ClaimRecord {
  name: string;
  email: string;
  telegram: string;
  account: string;
  createdAt: string;
  updatedAt: string;
  status: "pending" | "approved" | "rejected";
  reason: string | null;
  checks: ClaimCheck[];
}

export interface StoredClaim {
  issueNumber: number;
  record: ClaimRecord;
}

export interface VerdictMetrics {
  depositAmount?: number;
  balance?: number;
  requiredDeposit?: number;
  requiredBalance?: number;
}

export interface ClaimResultInput {
  approved: boolean;
  reason: string;
  metrics?: VerdictMetrics;
}

export type ClaimStatus = ClaimRecord["status"];

export interface ListClaimsOptions {
  limit?: number;
  status?: ClaimStatus;
  maxPages?: number;
}

interface IssueSummary {
  number: number;
  title: string;
  body: string | null;
}

const ISSUES_PER_PAGE = 100;
const MAX_PAGES = 3;
const CLAIM_PREFIX = "[CLAIM]";

function requireRepo(): string {
  const repo = process.env.GITHUB_REPO;
  if (!repo) throw new Error("github_not_configured");
  return repo;
}

async function githubFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = process.env.GITHUB_TOKEN;
  return fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      Authorization: `Bearer ${token ?? ""}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28"
    },
    signal: AbortSignal.timeout(10_000)
  });
}

async function githubJson(path: string, init?: RequestInit): Promise<unknown> {
  const response = await githubFetch(path, init);
  if (!response.ok) {
    throw new Error(`github_http_${response.status}`);
  }
  return response.json();
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

export function encodeClaimBody(record: ClaimRecord): string {
  return `\`\`\`json\n${JSON.stringify(record, null, 2)}\n\`\`\``;
}

export function parseClaimBody(body: string): ClaimRecord | null {
  const match = body.match(/```json\s*([\s\S]*?)```/);
  if (!match) return null;
  try {
    const parsed: unknown = JSON.parse(match[1]);
    const record = asRecord(parsed);
    if (!record) return null;
    const account = record["account"];
    const status = record["status"];
    if (typeof account !== "string" || account.length === 0) return null;
    if (status !== "pending" && status !== "approved" && status !== "rejected") return null;
    return record as unknown as ClaimRecord;
  } catch {
    return null;
  }
}

async function listIssues(repo: string, state: "open" | "all", page: number): Promise<IssueSummary[]> {
  const payload = await githubJson(
    `/repos/${repo}/issues?state=${state}&per_page=${ISSUES_PER_PAGE}&page=${page}`
  );
  if (!Array.isArray(payload)) return [];
  const issues: IssueSummary[] = [];
  for (const item of payload) {
    const record = asRecord(item);
    if (!record || typeof record["title"] !== "string") continue;
    issues.push({
      number: Number(record["number"]),
      title: record["title"],
      body: typeof record["body"] === "string" ? record["body"] : null
    });
  }
  return issues;
}

interface ScannedClaim extends StoredClaim {
  account: string;
}

async function scanClaims(state: "open" | "all"): Promise<ScannedClaim[]> {
  const repo = requireRepo();
  const found: ScannedClaim[] = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const issues = await listIssues(repo, state, page);
    for (const issue of issues) {
      if (!issue.title.startsWith(CLAIM_PREFIX) || issue.body === null) continue;
      const record = parseClaimBody(issue.body);
      if (!record) continue;
      found.push({ issueNumber: issue.number, record, account: record.account });
    }
    if (issues.length < ISSUES_PER_PAGE) break;
  }
  return found;
}

async function patchIssueBody(repo: string, issueNumber: number, body: string): Promise<void> {
  await githubJson(`/repos/${repo}/issues/${issueNumber}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body })
  });
}

export async function createOrUpdateClaim(fields: ClaimFields): Promise<StoredClaim> {
  const repo = requireRepo();
  const scanned = await scanClaims("open");
  const existing = scanned.find((claim) => claim.account === fields.account);
  const now = new Date().toISOString();

  if (existing) {
    const merged: ClaimRecord = {
      ...fields,
      createdAt: existing.record.createdAt,
      updatedAt: now,
      status: existing.record.status,
      reason: existing.record.reason,
      checks: existing.record.checks
    };
    await patchIssueBody(repo, existing.issueNumber, encodeClaimBody(merged));
    return { issueNumber: existing.issueNumber, record: merged };
  }

  const created: ClaimRecord = {
    ...fields,
    createdAt: now,
    updatedAt: now,
    status: "pending",
    reason: null,
    checks: []
  };
  const payload = asRecord(
    await githubJson(`/repos/${repo}/issues`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: `${CLAIM_PREFIX} ${fields.name} — ${fields.account}`,
        body: encodeClaimBody(created)
      })
    })
  );
  return { issueNumber: Number(payload?.["number"] ?? 0), record: created };
}

export async function getClaimByAccount(account: string): Promise<StoredClaim | null> {
  const scanned = await scanClaims("open");
  const found = scanned.find((claim) => claim.account === account);
  if (!found) return null;
  return { issueNumber: found.issueNumber, record: found.record };
}

export async function listClaims(options: ListClaimsOptions = {}): Promise<StoredClaim[]> {
  const limit = options.limit ?? 50;
  const status = options.status;
  const maxPages = options.maxPages ?? MAX_PAGES;
  const repo = requireRepo();
  const found: ScannedClaim[] = [];
  outer: for (let page = 1; page <= maxPages; page++) {
    const issues = await listIssues(repo, "all", page);
    for (const issue of issues) {
      if (!issue.title.startsWith(CLAIM_PREFIX) || issue.body === null) continue;
      const record = parseClaimBody(issue.body);
      if (!record) continue;
      if (status !== undefined && record.status !== status) continue;
      found.push({ issueNumber: issue.number, record, account: record.account });
      if (status !== undefined && found.length >= limit) break outer;
    }
    if (issues.length < ISSUES_PER_PAGE) break;
  }
  return found
    .sort((a, b) => {
      if (a.record.updatedAt === b.record.updatedAt) return 0;
      return a.record.updatedAt < b.record.updatedAt ? 1 : -1;
    })
    .slice(0, limit)
    .map(({ issueNumber, record }) => ({ issueNumber, record }));
}

export async function updateClaimResult(
  account: string,
  result: ClaimResultInput
): Promise<boolean> {
  const repo = requireRepo();
  const scanned = await scanClaims("open");
  const existing = scanned.find((claim) => claim.account === account);
  if (!existing) return false;
  const now = new Date().toISOString();
  const check: ClaimCheck = { at: now, approved: result.approved, reason: result.reason };
  if (result.metrics?.depositAmount !== undefined) {
    check.depositAmount = result.metrics.depositAmount;
  }
  if (result.metrics?.balance !== undefined) {
    check.balance = result.metrics.balance;
  }
  if (result.metrics?.requiredDeposit !== undefined) {
    check.requiredDeposit = result.metrics.requiredDeposit;
  }
  if (result.metrics?.requiredBalance !== undefined) {
    check.requiredBalance = result.metrics.requiredBalance;
  }
  const updated: ClaimRecord = {
    ...existing.record,
    updatedAt: now,
    status: result.approved ? "approved" : "rejected",
    reason: result.reason,
    checks: [...existing.record.checks, check]
  };
  await patchIssueBody(repo, existing.issueNumber, encodeClaimBody(updated));
  return true;
}
