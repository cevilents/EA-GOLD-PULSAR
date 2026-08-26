import { NextResponse } from "next/server";
import { getClaimByAccount } from "@/lib/claims";
import { checkRateLimit } from "@/lib/rateLimit";

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

const ACCOUNT_PATTERN = /^\d{5,12}$/;

export async function GET(request: Request): Promise<NextResponse> {
  if (!process.env.GITHUB_TOKEN || !process.env.GITHUB_REPO) {
    return NextResponse.json({ error: "Layanan klaim belum dikonfigurasi." }, { status: 503 });
  }

  if (!checkRateLimit(`status:${clientIp(request)}`)) {
    return NextResponse.json({ error: "Terlalu banyak percobaan. Coba lagi nanti." }, { status: 429 });
  }

  const account = new URL(request.url).searchParams.get("account") ?? "";
  if (!ACCOUNT_PATTERN.test(account)) {
    return NextResponse.json(
      { error: "Nomor akun harus 5–12 angka tanpa karakter lain." },
      { status: 400 }
    );
  }

  let claim;
  try {
    claim = await getClaimByAccount(account);
  } catch {
    return NextResponse.json({ error: "Gagal memeriksa status klaim." }, { status: 502 });
  }

  if (!claim) {
    return NextResponse.json({ ok: true, status: "none" });
  }
  return NextResponse.json({
    ok: true,
    status: claim.record.status,
    reason: claim.record.reason
  });
}
