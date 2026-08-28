import { NextResponse } from "next/server";
import {
  evaluateRule,
  findClientAccount,
  getClientStats
} from "@/lib/exness";
import { checkRateLimit } from "@/lib/rateLimit";

const ACCOUNT_PATTERN = /^\d{5,12}$/;

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

function isCentType(accountType: string | null): boolean {
  return accountType !== null && accountType.toLowerCase().includes("cent");
}

function bandToMinUsd(band: number): number {
  const map = [0, 0, 10, 50, 250, 1000, 5000];
  return map[band] ?? 0;
}

export async function GET(request: Request): Promise<NextResponse> {
  if (!checkRateLimit(`check:${clientIp(request)}`)) {
    return NextResponse.json(
      { error: "Terlalu banyak percobaan. Coba lagi nanti." },
      { status: 429 }
    );
  }

  const account = new URL(request.url).searchParams.get("account") ?? "";
  if (!ACCOUNT_PATTERN.test(account)) {
    return NextResponse.json(
      { error: "Nomor akun harus 5–12 angka tanpa karakter lain." },
      { status: 400 }
    );
  }

  try {
    const lookup = await findClientAccount(account);
    if (!lookup.underPartner) {
      return NextResponse.json({ ok: true, state: "not_found" });
    }

    const stats = await getClientStats(lookup.clientUid ?? "");
    const evaluation = evaluateRule(lookup.accountType, stats);

    if (evaluation.approved) {
      return NextResponse.json({ ok: true, state: "active" });
    }

    return NextResponse.json({
      ok: true,
      state: "below",
      detail: {
        depositBand: stats?.depositBand ?? 0,
        balanceBand: stats?.balanceBand ?? 0,
        depositMinUsd: bandToMinUsd(stats?.depositBand ?? 0),
        balanceMinUsd: bandToMinUsd(stats?.balanceBand ?? 0),
        requiredDepositBand: evaluation.requiredDepositBand,
        requiredBalanceBand: evaluation.requiredBalanceBand,
        requiredDepositUsd: evaluation.depositMinUsd,
        requiredBalanceUsd: evaluation.balanceMinUsd,
        isCent: isCentType(lookup.accountType)
      }
    });
  } catch {
    return NextResponse.json({ error: "Gagal memeriksa akun. Coba lagi." }, { status: 502 });
  }
}