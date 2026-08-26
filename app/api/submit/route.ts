import { NextResponse } from "next/server";
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
  if (!process.env.GITHUB_TOKEN || !process.env.GITHUB_REPO) {
    return jsonError(503, "Layanan klaim belum dikonfigurasi.");
  }

  if (!checkRateLimit(clientIp(request))) {
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

  const { name, whatsapp, account } = result.value;
  const issueBody = [
    `Nama: ${name}`,
    `WhatsApp: ${whatsapp}`,
    `Nomor Akun: ${account}`,
    `Waktu (UTC): ${new Date().toISOString()}`,
    `User-Agent: ${request.headers.get("user-agent") ?? "-"}`
  ].join("\n");

  try {
    const response = await fetch(`https://api.github.com/repos/${process.env.GITHUB_REPO}/issues`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: `[CLAIM] ${name} — ${account}`,
        body: issueBody,
        labels: ["claim"]
      }),
      signal: AbortSignal.timeout(10_000)
    });

    if (!response.ok) {
      console.error(`github issue failed with status ${response.status}`);
      return jsonError(502, "Gagal menyimpan klaim. Silakan coba lagi.");
    }
  } catch {
    console.error("github issue request threw");
    return jsonError(502, "Gagal menyimpan klaim. Silakan coba lagi.");
  }

  return NextResponse.json({ ok: true });
}
