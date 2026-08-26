import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, createSessionValue } from "@/lib/admin-auth";
import { checkRateLimit } from "@/lib/rateLimit";

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

function sha256(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

function matches(expected: string, supplied: string): boolean {
  return timingSafeEqual(sha256(expected), sha256(supplied));
}

export async function POST(request: Request): Promise<NextResponse> {
  const password = process.env.ADMIN_PASSWORD;
  if (password === undefined || password.length === 0) {
    return NextResponse.json({ error: "Password salah." }, { status: 401 });
  }

  if (!checkRateLimit(`admin:${clientIp(request)}`)) {
    return NextResponse.json({ error: "Terlalu banyak percobaan. Coba lagi nanti." }, { status: 429 });
  }

  const supplied = await readSuppliedPassword(request);
  if (supplied === null || !matches(password, supplied)) {
    return NextResponse.json({ error: "Password salah." }, { status: 401 });
  }

  let value: string;
  try {
    value = createSessionValue();
  } catch {
    return NextResponse.json({ error: "Layanan admin belum dikonfigurasi." }, { status: 503 });
  }

  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  const response = NextResponse.json({ ok: true });
  response.headers.append(
    "Set-Cookie",
    `${ADMIN_COOKIE}=${value}; HttpOnly; Path=/; SameSite=Lax; Max-Age=28800${secure}`
  );
  return response;
}

async function readSuppliedPassword(request: Request): Promise<string | null> {
  try {
    const body: unknown = await request.json();
    if (typeof body !== "object" || body === null || Array.isArray(body)) return null;
    const value = (body as Record<string, unknown>)["password"];
    return typeof value === "string" ? value : null;
  } catch {
    return null;
  }
}
