import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "gp_admin";

const SESSION_TTL_MS = 8 * 3_600_000;

function secret(): string | undefined {
  const value = process.env.ADMIN_SESSION_SECRET;
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function sign(payload: string, key: string): string {
  return createHmac("sha256", key).update(payload).digest("hex");
}

export function createSessionValue(): string {
  const key = secret();
  if (key === undefined) throw new Error("admin_not_configured");
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = String(expiresAt);
  return `${payload}.${sign(payload, key)}`;
}

export function verifySessionValue(value: string | undefined): boolean {
  const key = secret();
  if (key === undefined || typeof value !== "string") return false;
  const parts = value.split(".");
  if (parts.length !== 2) return false;
  const [payload, signature] = parts;
  if (payload.length === 0 || signature.length === 0) return false;
  const expiresAt = Number(payload);
  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) return false;
  const expected = createHash("sha256").update(signature).digest();
  const actual = createHash("sha256").update(sign(payload, key)).digest();
  return timingSafeEqual(expected, actual);
}

export function readAdminCookie(request: Request): string | undefined {
  const header = request.headers.get("cookie");
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === ADMIN_COOKIE) return rest.join("=");
  }
  return undefined;
}
