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
        depositAmount: stats?.depositAmount ?? 0,
        balance: stats?.balance ?? 0,
        requiredDeposit: evaluation.requiredDeposit,
        requiredBalance: evaluation.requiredBalance,
        isCent: isCentType(lookup.accountType)
      }
    });
  } catch {
    return NextResponse.json({ error: "Gagal memeriksa akun. Coba lagi." }, { status: 502 });
  }
}
