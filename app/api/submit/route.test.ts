import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const fetchMock = vi.fn();

async function post(body: unknown, ip = "1.2.3.4"): Promise<Response> {
  const { POST } = await import("./route");
  return POST(
    new Request("http://localhost/api/submit", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": ip },
      body: JSON.stringify(body)
    })
  );
}

describe("POST /api/submit", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal("fetch", fetchMock);
    process.env.GITHUB_TOKEN = "test-token";
    process.env.GITHUB_REPO = "me/claims";
    fetchMock.mockResolvedValue(new Response(null, { status: 201 }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("sukses membuat issue github dengan payload benar", async () => {
    const res = await post({ name: "Budi", whatsapp: "628123456789", account: "12345678" });
    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.github.com/repos/me/claims/issues");
    expect(init.headers).toMatchObject({ Authorization: "Bearer test-token" });
    const payload = JSON.parse(String(init.body));
    expect(payload.title).toBe("[CLAIM] Budi — 12345678");
    expect(payload.body).toContain("+628123456789");
    expect(payload.labels).toEqual(["claim"]);
  });

  it("400 untuk payload tidak valid", async () => {
    const res = await post({ name: "", whatsapp: "xx", account: "1" });
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("503 saat env belum diset", async () => {
    delete process.env.GITHUB_TOKEN;
    const res = await post({ name: "Budi", whatsapp: "628123456789", account: "12345678" }, "5.6.7.8");
    expect(res.status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("502 saat github gagal", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 500 }));
    const res = await post({ name: "Budi", whatsapp: "628123456789", account: "12345678" }, "9.9.9.9");
    expect(res.status).toBe(502);
  });

  it("429 saat melebihi rate limit", async () => {
    const body = { name: "Budi", whatsapp: "628123456789", account: "12345678" };
    for (let i = 0; i < 10; i++) {
      await post(body, "7.7.7.7");
    }
    const res = await post(body, "7.7.7.7");
    expect(res.status).toBe(429);
    expect(fetchMock.mock.calls.length).toBeLessThanOrEqual(10);
  });
});
