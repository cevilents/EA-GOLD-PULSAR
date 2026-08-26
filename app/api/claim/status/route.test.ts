import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

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
  return new Response(null, { status: 200 });
});

type RecordInput = Record<string, unknown>;

function makeIssue(number: number, record: RecordInput): void {
  state.issues.push({
    number,
    title: `[CLAIM] ${String(record.name)} — ${String(record.account)}`,
    body: "```json\n" + JSON.stringify(record, null, 2) + "\n```"
  });
}

async function get(account: string, ip: string): Promise<Response> {
  const { GET } = await import("./route");
  return GET(
    new Request(`http://localhost/api/claim/status?account=${account}`, {
      headers: { "x-forwarded-for": ip }
    })
  );
}

describe("GET /api/claim/status", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal("fetch", fetchMock);
    process.env.GITHUB_TOKEN = "test-token";
    process.env.GITHUB_REPO = "me/claims";
    state.issues = [];
    fetchMock.mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("klaim tidak ada → status none", async () => {
    const res = await get("12345678", "1.1.1.1");
    const json = (await res.json()) as { ok: boolean; status: string };
    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true, status: "none" });
  });

  it("klaim pending → status pending dengan reason null", async () => {
    makeIssue(1, {
      name: "Budi",
      email: "budi@example.com",
      telegram: "",
      account: "12345678",
      createdAt: "2026-08-26T00:00:00.000Z",
      updatedAt: "2026-08-26T00:00:00.000Z",
      status: "pending",
      reason: null,
      checks: []
    });
    const res = await get("12345678", "2.2.2.2");
    const json = (await res.json()) as { ok: boolean; status: string; reason: string | null };
    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true, status: "pending", reason: null });
  });

  it("klaim approved → status approved dengan reason", async () => {
    makeIssue(7, {
      name: "Budi",
      email: "budi@example.com",
      telegram: "",
      account: "87654321",
      createdAt: "2026-08-26T00:00:00.000Z",
      updatedAt: "2026-08-26T01:00:00.000Z",
      status: "approved",
      reason: "deposit_ok",
      checks: []
    });
    const res = await get("87654321", "3.3.3.3");
    const json = (await res.json()) as { ok: boolean; status: string; reason: string | null };
    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true, status: "approved", reason: "deposit_ok" });
  });

  it("parameter account tidak valid → 400 tanpa panggil github", async () => {
    const res = await get("abc", "4.4.4.4");
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("env github kosong → 503", async () => {
    delete process.env.GITHUB_REPO;
    const res = await get("12345678", "5.5.5.5");
    expect(res.status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
