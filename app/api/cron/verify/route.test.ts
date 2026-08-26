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
    const pageMatch = urlStr.match(/[?&]page=(\d+)/);
    const page = pageMatch ? Number(pageMatch[1]) : 1;
    const start = (page - 1) * 100;
    return new Response(JSON.stringify(state.issues.slice(start, start + 100)), { status: 200 });
  }
  if (method === "PATCH") {
    const parts = urlStr.split("/");
    const numStr = parts[parts.length - 1];
    const found = state.issues.find((issue) => String(issue.number) === numStr);
    if (found) {
      const payload: unknown = JSON.parse(String(init?.body ?? "{}"));
      const record = payload as { body?: unknown };
      found.body = String(record.body ?? "");
    }
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }
  return new Response(null, { status: 200 });
});

function pendingRecord(account: string, updatedAt: string): Record<string, unknown> {
  return {
    name: `Trader ${account}`,
    email: `${account}@example.com`,
    telegram: "",
    account,
    createdAt: "2026-08-26T00:00:00.000Z",
    updatedAt,
    status: "pending",
    reason: null,
    checks: []
  };
}

async function callGet(secret: string): Promise<Response> {
  const { GET } = await import("./route");
  return GET(
    new Request("http://localhost/api/cron/verify", {
      headers: { authorization: secret }
    })
  );
}

describe("GET /api/cron/verify", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal("fetch", fetchMock);
    process.env.CRON_SECRET = "cron-secret";
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

  it("secret salah → 401 tanpa proses apa pun", async () => {
    const res = await callGet("Bearer nope");
    expect(res.status).toBe(401);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(exnessMocks.findClientAccount).not.toHaveBeenCalled();
  });

  it("env CRON_SECRET kosong → 401", async () => {
    delete process.env.CRON_SECRET;
    const res = await callGet("Bearer cron-secret");
    expect(res.status).toBe(401);
  });

  it("dua pending satu memenuhi → checked 2 approved 1 dan patch approved", async () => {
    state.issues.push(
      { number: 1, title: "[CLAIM] A — 11111111", body: "```json\n" + JSON.stringify(pendingRecord("11111111", "2026-08-26T02:00:00.000Z"), null, 2) + "\n```" },
      { number: 2, title: "[CLAIM] B — 22222222", body: "```json\n" + JSON.stringify(pendingRecord("22222222", "2026-08-26T01:00:00.000Z"), null, 2) + "\n```" },
      { number: 3, title: "[CLAIM] C — 33333333", body: "```json\n" + JSON.stringify({ ...pendingRecord("33333333", "2026-08-26T00:00:00.000Z"), status: "approved" }, null, 2) + "\n```" }
    );
    exnessMocks.findClientAccount
      .mockResolvedValueOnce({ underPartner: true, clientUid: "uid-a", accountType: "Standard" })
      .mockResolvedValueOnce({ underPartner: false, clientUid: null, accountType: null });
    exnessMocks.getClientStats.mockResolvedValue({
      depositAmount: 150,
      balance: 0,
      ftdReceived: true
    });
    exnessMocks.evaluateRule.mockReturnValue({
      approved: true,
      reason: "deposit_ok",
      requiredDeposit: 100,
      requiredBalance: 50
    });

    const res = await callGet("Bearer cron-secret");
    const json = (await res.json()) as { ok: boolean; checked: number; approved: number };

    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true, checked: 2, approved: 1 });
    expect(exnessMocks.evaluateRule).toHaveBeenCalledTimes(1);
    const patched = state.issues.find((issue) => issue.number === 1);
    expect(patched?.body).toContain('"approved"');
    expect(state.issues.find((issue) => issue.number === 2)?.body).toContain('"pending"');
  });

  it("pending di halaman lama tetap terjangkau lewat paginasi status", async () => {
    const issues: IssueState[] = [];
    for (let i = 1; i <= 100; i++) {
      const account = String(10000000 + i);
      issues.push({
        number: i,
        title: `[CLAIM] Lama ${account}`,
        body:
          "```json\n" +
          JSON.stringify(
            { ...pendingRecord(account, "2026-08-25T00:00:00.000Z"), status: "approved" },
            null,
            2
          ) +
          "\n```"
      });
    }
    for (let i = 101; i <= 120; i++) {
      const account = String(20000000 + i);
      issues.push({
        number: i,
        title: `[CLAIM] Baru ${account}`,
        body:
          "```json\n" +
          JSON.stringify(pendingRecord(account, "2026-08-26T03:00:00.000Z"), null, 2) +
          "\n```"
      });
    }
    state.issues = issues;
    exnessMocks.findClientAccount.mockResolvedValue({
      underPartner: false,
      clientUid: null,
      accountType: null
    });

    const res = await callGet("Bearer cron-secret");
    const json = (await res.json()) as { ok: boolean; checked: number; approved: number };

    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true, checked: 20, approved: 0 });
    expect(exnessMocks.findClientAccount).toHaveBeenCalledTimes(20);
  });
});
