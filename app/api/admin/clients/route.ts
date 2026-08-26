import { NextResponse } from "next/server";
import { ExnessError, exnessFetch } from "@/lib/exness";
import { readAdminCookie, verifySessionValue } from "@/lib/admin-auth";

export interface AdminClientRow {
  uid: string;
  country: string;
  regDate: string;
  depositAmount: number;
  balance: number;
  ftdReceived: boolean;
  volumeMlnUsd: number;
  status: string;
}

function rows(payload: unknown): Array<Record<string, unknown>> {
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) return [];
  const data = (payload as Record<string, unknown>)["data"];
  if (!Array.isArray(data)) return [];
  const result: Array<Record<string, unknown>> = [];
  for (const item of data) {
    if (typeof item === "object" && item !== null && !Array.isArray(item)) {
      result.push(item as Record<string, unknown>);
    }
  }
  return result;
}

function toStr(value: unknown): string {
  return typeof value === "string" ? value : String(value ?? "");
}

function toNum(value: unknown): number {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function mapRow(row: Record<string, unknown>): AdminClientRow {
  return {
    uid: toStr(row["client_uid"]),
    country: toStr(row["country"]),
    regDate: toStr(row["reg_date"]),
    depositAmount: toNum(row["deposit_amount"]),
    balance: toNum(row["client_balance"]),
    ftdReceived: Boolean(row["ftd_received"]),
    volumeMlnUsd: toNum(row["volume_mln_usd"]),
    status: toStr(row["client_status"])
  };
}

export async function GET(request: Request): Promise<NextResponse> {
  if (!verifySessionValue(readAdminCookie(request))) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await exnessFetch("/api/v2/reports/clients/?limit=100");
  } catch (error) {
    if (!(error instanceof ExnessError)) throw error;
    return NextResponse.json({ error: "Gagal mengambil data Exness." }, { status: 502 });
  }

  return NextResponse.json({ ok: true, clients: rows(payload).map(mapRow) });
}
