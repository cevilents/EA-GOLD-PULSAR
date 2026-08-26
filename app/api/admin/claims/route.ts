import { NextResponse } from "next/server";
import { listClaims, updateClaimResult } from "@/lib/claims";
import { appendLicensedAccount } from "@/lib/licence";
import { readAdminCookie, verifySessionValue } from "@/lib/admin-auth";

const ACCOUNT_PATTERN = /^\d{5,12}$/;
const STATUSES = ["pending", "approved", "rejected"] as const;

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
  const wanted = STATUSES.find((status) => status === filter);
  let claims;
  try {
    claims =
      wanted === undefined
        ? await listClaims({ limit: 100 })
        : await listClaims({ limit: 100, status: wanted });
  } catch {
    console.error("admin list claims failed");
    return NextResponse.json({ error: "Gagal memuat klaim." }, { status: 502 });
  }

  return NextResponse.json({
    ok: true,
    claims: claims.map(({ id, record }) => ({ issueNumber: id, ...record }))
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

  if (parsed.action === "approve") {
    const licenseFile = await appendLicensedAccount(parsed.account);
    if (licenseFile === "failed") console.error("license file append failed");
    return NextResponse.json({ ok: true, licenseFile });
  }
  return NextResponse.json({ ok: true });
}
