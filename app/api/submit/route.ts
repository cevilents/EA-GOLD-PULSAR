import { NextResponse } from "next/server";
import { createOrUpdateClaim, updateClaimResult } from "@/lib/claims";
import { appendLicensedAccount } from "@/lib/licence";
import { evaluateRule, findClientAccount, getClientStats } from "@/lib/exness";
import { checkRateLimit } from "@/lib/rateLimit";
import { validateClaim } from "@/lib/validation";

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

function jsonError(status: number, error: string, fields?: unknown): NextResponse {
  return NextResponse.json(fields ? { error, fields } : { error }, { status });
}

export async function POST(request: Request): Promise<NextResponse> {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return jsonError(503, "Layanan klaim belum dikonfigurasi.");
  }

  if (!checkRateLimit(`submit:${clientIp(request)}`)) {
    return jsonError(429, "Terlalu banyak percobaan. Coba lagi nanti.");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "Format permintaan tidak valid.");
  }

  const result = validateClaim(body);
  if (!result.ok) {
    return jsonError(400, "Periksa kembali isian formulir.", result.errors);
  }

  try {
    await createOrUpdateClaim(result.value);
  } catch {
    console.error("claim storage failed");
    return jsonError(502, "Gagal menyimpan klaim. Silakan coba lagi.");
  }

  let finalStatus: "approved" | "pending" = "pending";
  try {
    const lookup = await findClientAccount(result.value.account);
    if (lookup.underPartner && typeof lookup.clientUid === "string" && lookup.clientUid.length > 0) {
      const stats = await getClientStats(lookup.clientUid);
      const verdict = evaluateRule(lookup.accountType, stats);
      if (verdict.approved) {
        await updateClaimResult(result.value.account, {
          approved: true,
          reason: verdict.reason,
          metrics: stats
            ? {
                depositBand: stats.depositBand,
                balanceBand: stats.balanceBand,
                requiredDepositBand: verdict.requiredDepositBand,
                requiredBalanceBand: verdict.requiredBalanceBand
              }
            : undefined
        });
        const licence = await appendLicensedAccount(result.value.account);
        if (licence === "failed") console.error("license file append failed");
        finalStatus = "approved";
      }
    }
  } catch {
    console.error("exness verification deferred to cron");
  }

  return NextResponse.json({ ok: true, status: finalStatus });
}