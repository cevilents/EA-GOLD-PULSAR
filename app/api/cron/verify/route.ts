import { NextResponse } from "next/server";
import { listClaims, updateClaimResult, type StoredClaim } from "@/lib/claims";
import { evaluateRule, findClientAccount, getClientStats } from "@/lib/exness";

export async function GET(request: Request): Promise<NextResponse> {
  const secret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");
  if (!secret || authorization !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let pending: StoredClaim[];
  try {
    pending = await listClaims({ limit: 20, status: "pending", maxPages: 10 });
  } catch {
    console.error("cron list claims failed");
    return NextResponse.json({ error: "Gagal memuat klaim." }, { status: 502 });
  }

  let approvedCount = 0;
  for (const claim of pending) {
    try {
      const lookup = await findClientAccount(claim.record.account);
      if (!lookup.underPartner || lookup.clientUid === null || lookup.clientUid.length === 0) {
        continue;
      }
      const stats = await getClientStats(lookup.clientUid);
      const verdict = evaluateRule(lookup.accountType, stats);
      if (verdict.approved) {
        const updated = await updateClaimResult(claim.record.account, {
          approved: true,
          reason: verdict.reason,
          metrics: stats
            ? {
                depositAmount: stats.depositAmount,
                balance: stats.balance,
                requiredDeposit: verdict.requiredDeposit,
                requiredBalance: verdict.requiredBalance
              }
            : undefined
        });
        if (updated) approvedCount++;
      }
    } catch {
      continue;
    }
  }

  return NextResponse.json({ ok: true, checked: pending.length, approved: approvedCount });
}
