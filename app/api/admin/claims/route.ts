import { NextResponse } from "next/server";
import { listClaims, updateClaimResult } from "@/lib/claims";
import { readAdminCookie, verifySessionValue } from "@/lib/admin-auth";

const ACCOUNT_PATTERN = /^\d{5,12}$/;
const STATUSES = ["pending", "approved", "rejected"] as const;
type StatusFilter = (typeof STATUSES)[number];

function unauthorized(): NextResponse {
  return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
}

interface PatchInput {
  account: string;
  action: "approve" | "reject";
  note: string;
}

function parsePatch(body: unknown): PatchInput | null {
  if (typeof body !== "object" || body === null || Array.isArray(body)) return null;
  const record = body as Record<string, unknown>;
  if (typeof record["account"] !== "string" || !ACCOUNT_PATTERN.test(record["account"])) {
    return null;
  }
  const action = record["action"];
  if (action !== "approve" && action !== "reject") return null;
  const note = record["note"];
  if (note !== undefined && typeof note !== "string") return null;
  if (typeof note === "string" && note.length > 200) return null;
  return { account: record["account"], action, note: typeof note === "string" ? note : "" };
}

export async function GET(request: Request): Promise<NextResponse> {
  if (!verifySessionValue(readAdminCookie(request))) return unauthorized();

  const filter = new URL(request.url).searchParams.get("status");
  let claims;
  try {
    claims = await listClaims(100);
    if (filter !== null && (STATUSES as readonly string[]).includes(filter)) {
      const wanted = filter as StatusFilter;
      claims = claims.filter((item) => item.record.status === wanted);
    }
  } catch {
    return NextResponse.json({ error: "Gagal memuat klaim." }, { status: 502 });
  }

  return NextResponse.json({
    ok: true,
    claims: claims.map(({ issueNumber, record }) => ({ issueNumber, ...record }))
  });
}

export async function PATCH(request: Request): Promise<NextResponse> {
  if (!verifySessionValue(readAdminCookie(request))) return unauthorized();

  let parsed: PatchInput | null = null;
  try {
    parsed = parsePatch(await request.json());
  } catch {
    parsed = null;
  }
  if (!parsed) {
    return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });
  }

  const reason = parsed.note
    ? `manual_${parsed.action}: ${parsed.note}`
    : `manual_${parsed.action}`;

  let updated: boolean;
  try {
    updated = await updateClaimResult(parsed.account, {
      approved: parsed.action === "approve",
      reason
    });
  } catch {
    return NextResponse.json({ error: "Gagal memperbarui klaim." }, { status: 502 });
  }

  if (!updated) {
    return NextResponse.json({ error: "Klaim tidak ditemukan." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
