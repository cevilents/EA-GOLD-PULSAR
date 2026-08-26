import { createHmac } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ADMIN_COOKIE, createSessionValue, verifySessionValue } from "./admin-auth";

const SECRET = "test-secret-value";

function manualToken(expiresAt: number, secret: string = SECRET): string {
  const payload = String(expiresAt);
  return `${payload}.${createHmac("sha256", secret).update(payload).digest("hex")}`;
}

describe("lib/admin-auth", () => {
  beforeEach(() => {
    process.env.ADMIN_SESSION_SECRET = SECRET;
  });

  afterEach(() => {
    delete process.env.ADMIN_SESSION_SECRET;
  });

  it("ADMIN_COOKIE bernama gp_admin", () => {
    expect(ADMIN_COOKIE).toBe("gp_admin");
  });

  it("round-trip valid → true", () => {
    expect(verifySessionValue(createSessionValue())).toBe(true);
  });

  it("expired → false", () => {
    expect(verifySessionValue(manualToken(Date.now() - 1_000))).toBe(false);
  });

  it("payload dirusak → false", () => {
    const [payload, sig] = createSessionValue().split(".");
    expect(verifySessionValue(`${String(Number(payload) + 1)}.${sig}`)).toBe(false);
  });

  it("signature dirusak → false", () => {
    const [payload, sig] = createSessionValue().split(".");
    const flipped = sig[0] === "0" ? `1${sig.slice(1)}` : `0${sig.slice(1)}`;
    expect(verifySessionValue(`${payload}.${flipped}`)).toBe(false);
  });

  it("input sampah → false", () => {
    expect(verifySessionValue(undefined)).toBe(false);
    expect(verifySessionValue("")).toBe(false);
    expect(verifySessionValue("garbage")).toBe(false);
    expect(verifySessionValue("a.b.c")).toBe(false);
    expect(verifySessionValue(".sig")).toBe(false);
    expect(verifySessionValue("1234567.")).toBe(false);
    expect(verifySessionValue("abc.def")).toBe(false);
  });

  it("secret hilang → verify false dan create melempar admin_not_configured", () => {
    delete process.env.ADMIN_SESSION_SECRET;
    expect(verifySessionValue(manualToken(Date.now() + 3_600_000))).toBe(false);
    expect(() => createSessionValue()).toThrow("admin_not_configured");
  });
});
