import { NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/admin-auth";

export async function POST(): Promise<NextResponse> {
  const response = NextResponse.json({ ok: true });
  response.headers.append(
    "Set-Cookie",
    ADMIN_COOKIE + "=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0"
  );
  return response;
}
