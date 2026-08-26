import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const exnessMocks = vi.hoisted(() => ({
  findClientAccount: vi.fn(),
  getClientStats: vi.fn(),
  evaluateRule: vi.fn()
}));

vi.mock("@/lib/exness", () => ({
  ExnessError: class ExnessError extends Error {},
  ...exnessMocks
}));

interface IssueState {
  number: number;
  title: string;
  body: string;
}

const state: { issues: IssueState[] } = { issues: [] };

const fetchMock = vi.fn(async (url: unknown, init?: RequestInit): Promise<Response> => {
  const method = (init?.method ?? "GET").toUpperCase();
  const urlStr = String(url);
  if (method === "GET" && urlStr.includes("/issues?")) {
    return new Response(JSON.stringify(state.issues), { status: 200 });
  }
  const payload: unknown = JSON.parse(String(init?.body ?? "{}"));
  if (method === "POST") {
    const record = payload as { title?: unknown; body?: unknown };
    const issue: IssueState = {
      number: state.issues.length + 1,
      title: String(record.title ?? ""),
      body: String(record.body ?? "")
    };
    state.issues.push(issue);
    return new Response(JSON.stringify(issue), { status: 201 });
  }
  if (method === "PATCH") {
    const parts = urlStr.split("/");
    const numStr = parts[parts.length - 1];
    const found = state.issues.find((issue) => String(issue.number) === numStr);
    if (found) {
      const record = payload as { body?: unknown };
      found.body = String(record.body ?? "");
    }
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }
  return new Response(null, { status: 200 });
});

async function post(body: unknown, ip: string): Promise<Response> {
  const { POST } = await import("./route");
  return POST(
    new Request("http://localhost/api/submit", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": ip },
      body: JSON.stringify(body)
    })
  );
}

function patchCalls(): number {
  return fetchMock.mock.calls.filter(
    ([, init]) => String(init?.method ?? "GET").toUpperCase() === "PATCH"
  ).length;
}

const validBody = {
  name: "Budi",
  email: "budi@example.com",
  telegram: "@budi",
  account: "12345678"
};

describe("POST /api/submit", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal("fetch", fetchMock);
    process.env.GITHUB_TOKEN = "test-token";
    process.env.GITHUB_REPO = "me/claims";
    exnessMocks.findClientAccount.mockReset();
    exnessMocks.getClientStats.mockReset();
    exnessMocks.evaluateRule.mockReset();
    state.issues = [];
    fetchMock.mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("rule approved → respons approved dan issue dipatch berisi approved", async () => {
    exnessMocks.findClientAccount.mockResolvedValue({
      underPartner: true,
      clientUid: "uid-1",
      accountType: "Standard"
    });
    exnessMocks.getClientStats.mockResolvedValue({
      depositAmount: 150,
      balance: 20,
      ftdReceived: true
    });
    exnessMocks.evaluateRule.mockReturnValue({
      approved: true,
      reason: "deposit_ok",
      requiredDeposit: 100,
      requiredBalance: 50
    });

    const res = await post(validBody, "1.2.3.4");
    const json = (await res.json()) as { ok: boolean; status: string };

    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true, status: "approved" });
    const patched = state.issues.find((issue) => issue.body.includes('"approved"'));
    expect(patched).toBeTruthy();
    expect(patchCalls()).toBeGreaterThanOrEqual(1);
  });

  it("underPartner tapi rule gagal → pending tanpa patch", async () => {
    exnessMocks.findClientAccount.mockResolvedValue({
      underPartner: true,
      clientUid: "uid-1",
      accountType: "Standard"
    });
    exnessMocks.getClientStats.mockResolvedValue({
      depositAmount: 0,
      balance: 0,
      ftdReceived: false
    });
    exnessMocks.evaluateRule.mockReturnValue({
      approved: false,
      reason: "insufficient",
      requiredDeposit: 100,
      requiredBalance: 50
    });

    const res = await post(validBody, "2.2.2.2");
    const json = (await res.json()) as { ok: boolean; status: string };

    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true, status: "pending" });
    expect(patchCalls()).toBe(0);
    expect(state.issues[0]?.body).toContain('"pending"');
  });

  it("exness error → tetap pending", async () => {
    exnessMocks.findClientAccount.mockRejectedValue(new Error("boom"));

    const res = await post(validBody, "3.3.3.3");
    const json = (await res.json()) as { ok: boolean; status: string };

    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true, status: "pending" });
    expect(exnessMocks.getClientStats).not.toHaveBeenCalled();
    expect(patchCalls()).toBe(0);
  });

  it("payload tidak valid → 400 tanpa panggil github/exness", async () => {
    const res = await post({ name: "", email: "x", telegram: "", account: "1" }, "4.4.4.4");

    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(exnessMocks.findClientAccount).not.toHaveBeenCalled();
  });

  it("honeypot terisi → 400", async () => {
    const res = await post({ ...validBody, website: "spam" }, "5.5.5.5");

    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("env github kosong → 503", async () => {
    delete process.env.GITHUB_TOKEN;
    const res = await post(validBody, "6.6.6.6");
    expect(res.status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
