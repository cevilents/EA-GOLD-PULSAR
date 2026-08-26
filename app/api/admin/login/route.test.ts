import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const fetchMock = vi.fn();

async function post(password: unknown, ip = "1.1.1.1"): Promise<Response> {
  const { POST } = await import("./route");
  return POST(
    new Request("http://localhost/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
      body: JSON.stringify({ password })
    })
  );
}

async function postRaw(body: string, ip = "1.1.1.1"): Promise<Response> {
  const { POST } = await import("./route");
  return POST(
    new Request("http://localhost/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
      body
    })
  );
}

describe("POST /api/admin/login", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.ADMIN_PASSWORD = "rahasia-panjang";
    process.env.ADMIN_SESSION_SECRET = "secret-session-value";
    fetchMock.mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    delete process.env.ADMIN_PASSWORD;
    delete process.env.ADMIN_SESSION_SECRET;
  });

  it("password benar → ok + cookie HttpOnly Path SameSite Max-Age", async () => {
    const res = await post("rahasia-panjang");
    const json = (await res.json()) as { ok: boolean };
    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true });
    const cookie = res.headers.get("set-cookie") ?? "";
    expect(cookie).toContain("gp_admin=");
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("Path=/");
    expect(cookie).toContain("SameSite=Lax");
    expect(cookie).toContain("Max-Age=28800");
  });

  it("password salah → 401 tanpa cookie", async () => {
    const res = await post("salah");
    expect(res.status).toBe(401);
    expect(res.headers.get("set-cookie")).toBeNull();
  });

  it("body bukan JSON → 401", async () => {
    const res = await postRaw("not-json");
    expect(res.status).toBe(401);
  });

  it("env ADMIN_PASSWORD kosong → selalu 401", async () => {
    delete process.env.ADMIN_PASSWORD;
    const res = await post("rahasia-panjang");
    expect(res.status).toBe(401);
    expect(res.headers.get("set-cookie")).toBeNull();
  });

  it("percobaan ke-11 → 429", async () => {
    for (let i = 0; i < 10; i++) {
      const res = await post("salah");
      expect(res.status).toBe(401);
    }
    const eleventh = await post("salah");
    expect(eleventh.status).toBe(429);
  });

  it("production menambah flag Secure", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const res = await post("rahasia-panjang");
    expect((res.headers.get("set-cookie") ?? "")).toContain("Secure");
    vi.unstubAllEnvs();
  });
});
