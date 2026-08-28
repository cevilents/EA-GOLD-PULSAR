import type { SupabaseClient } from "@supabase/supabase-js";
import type { ClaimFields } from "./validation";
import { StoreError, createClaimStore } from "./supabase";

export interface ClaimCheck {
  at: string;
  approved: boolean;
  reason: string;
  depositBand?: number;
  balanceBand?: number;
  requiredDepositBand?: number;
  requiredBalanceBand?: number;
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

export interface ClaimRow {
  id: number;
  record: ClaimRecord;
}

export interface VerdictMetrics {
  depositBand?: number;
  balanceBand?: number;
  requiredDepositBand?: number;
  requiredBalanceBand?: number;
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
}

interface ClaimDbRow {
  id?: unknown;
  name?: unknown;
  email?: unknown;
  telegram?: unknown;
  account?: unknown;
  status?: unknown;
  reason?: unknown;
  checks?: unknown;
  created_at?: unknown;
  updated_at?: unknown;
}

function wrapStoreError(error: { code?: unknown }): StoreError {
  const code = typeof error.code === "string" && error.code.length > 0 ? error.code : "unknown";
  return new StoreError(`supabase_${code}`);
}

function asChecks(value: unknown): ClaimCheck[] {
  if (!Array.isArray(value)) return [];
  const checks: ClaimCheck[] = [];
  for (const item of value) {
    const record = asRecord(item);
    if (!record) continue;
    const at = record["at"];
    const reason = record["reason"];
    if (typeof at !== "string" || typeof reason !== "string") continue;
    const check: ClaimCheck = { at, approved: record["approved"] === true, reason };
    for (const key of ["depositBand", "balanceBand", "requiredDepositBand", "requiredBalanceBand"] as const) {
      const metric = record[key];
      if (typeof metric === "number" && Number.isFinite(metric)) {
        check[key] = metric;
      }
    }
    checks.push(check);
  }
  return checks;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function normalizeStatus(value: unknown): ClaimStatus {
  if (value === "approved" || value === "rejected") return value;
  return "pending";
}

function str(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function toRecord(row: ClaimDbRow): ClaimRecord {
  return {
    name: str(row.name),
    email: str(row.email),
    telegram: str(row.telegram),
    account: str(row.account),
    createdAt: str(row.created_at),
    updatedAt: str(row.updated_at),
    status: normalizeStatus(row.status),
    reason: typeof row.reason === "string" ? row.reason : null,
    checks: asChecks(row.checks)
  };
}

async function fetchByAccount(
  client: SupabaseClient,
  account: string,
  columns: string
): Promise<ClaimDbRow | null> {
  const { data, error } = await client.from("claims").select(columns).eq("account", account).maybeSingle();
  if (error) throw wrapStoreError(asRecord(error) ?? {});
  if (data === null || data === undefined) return null;
  return asRecord(data) ?? null;
}

export async function createOrUpdateClaim(fields: ClaimFields): Promise<{ account: string }> {
  const client = createClaimStore();
  const existing = await fetchByAccount(client, fields.account, "id");
  const now = new Date().toISOString();
  if (existing) {
    const { error } = await client
      .from("claims")
      .update({
        name: fields.name,
        email: fields.email,
        telegram: fields.telegram,
        updated_at: now
      })
      .eq("account", fields.account);
    if (error) throw wrapStoreError(asRecord(error) ?? {});
    return { account: fields.account };
  }
  const { error } = await client.from("claims").insert([
    {
      name: fields.name,
      email: fields.email,
      telegram: fields.telegram,
      account: fields.account,
      status: "pending"
    }
  ]);
  if (error) throw wrapStoreError(asRecord(error) ?? {});
  return { account: fields.account };
}

export async function getClaimByAccount(account: string): Promise<ClaimRow | null> {
  const client = createClaimStore();
  const row = await fetchByAccount(client, account, "*");
  if (row === null) return null;
  return { id: typeof row.id === "number" ? row.id : 0, record: toRecord(row) };
}

export async function listClaims(options: ListClaimsOptions = {}): Promise<ClaimRow[]> {
  const client = createClaimStore();
  let query = client.from("claims").select("*");
  if (options.status !== undefined) {
    query = query.eq("status", options.status);
  }
  const { data, error } = await query
    .order("updated_at", { ascending: false })
    .limit(options.limit ?? 50);
  if (error) throw wrapStoreError(asRecord(error) ?? {});
  if (!Array.isArray(data)) return [];
  const rows: ClaimRow[] = [];
  for (const item of data) {
    const record = asRecord(item);
    if (!record) continue;
    rows.push({
      id: typeof record["id"] === "number" ? record["id"] : 0,
      record: toRecord(record)
    });
  }
  return rows;
}

export async function updateClaimResult(
  account: string,
  result: ClaimResultInput
): Promise<boolean> {
  const client = createClaimStore();
  const existing = await fetchByAccount(client, account, "checks");
  if (existing === null) return false;
  const previous = asChecks(existing.checks);
  const now = new Date().toISOString();
  const check: ClaimCheck = { at: now, approved: result.approved, reason: result.reason };
  if (result.metrics?.depositBand !== undefined) {
    check.depositBand = result.metrics.depositBand;
  }
  if (result.metrics?.balanceBand !== undefined) {
    check.balanceBand = result.metrics.balanceBand;
  }
  if (result.metrics?.requiredDepositBand !== undefined) {
    check.requiredDepositBand = result.metrics.requiredDepositBand;
  }
  if (result.metrics?.requiredBalanceBand !== undefined) {
    check.requiredBalanceBand = result.metrics.requiredBalanceBand;
  }
  const { error } = await client
    .from("claims")
    .update({
      status: result.approved ? ("approved" as const) : ("rejected" as const),
      reason: result.reason,
      checks: [...previous, check],
      updated_at: now
    })
    .eq("account", account);
  if (error) throw wrapStoreError(asRecord(error) ?? {});
  return true;
}
