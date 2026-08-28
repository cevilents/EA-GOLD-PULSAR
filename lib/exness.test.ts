import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type QueuedItem = Response | Error;

let queue: QueuedItem[];

const fetchMock = vi.fn(async (_url: unknown, _init?: RequestInit): Promise<Response> => {
  const next = queue.shift();
  if (!next) throw new Error("fetch mock exhausted");
  if (next instanceof Error) throw next;
  return next;
});

function jsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), { status });
}

function callsMatching(pattern: RegExp, method: string): Array<[unknown, RequestInit | undefined]> {
  return fetchMock.mock.calls.filter(([url, init]) => {
    const callMethod = (init?.method ?? "GET").toUpperCase();
    return pattern.test(String(url)) && callMethod === method;
  }) as Array<[unknown, RequestInit | undefined]>;
}

async function loadModule(): Promise<typeof import("./exness")> {
  return import("./exness");
}

describe("exness client", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal("fetch", fetchMock);
    queue = [];
    fetchMock.mockClear();
    process.env.EXNESS_LOGIN = "partner@example.com";
    process.env.EXNESS_PASSWORD = "secret";
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    delete process.env.EXNESS_LOGIN;
    delete process.env.EXNESS_PASSWORD;
  });

  it("cache token: dua panggilan exnessFetch hanya satu POST auth", async () => {
    const { exnessFetch } = await loadModule();
    queue.push(
      jsonResponse({ token: "tok-1" }),
      jsonResponse({ data: [] }),
      jsonResponse({ data: [] })
    );
    await exnessFetch("/api/reports/a");
    await exnessFetch("/api/reports/b");
    const authCalls = callsMatching(/\/api\/auth\//, "POST");
    expect(authCalls.length).toBeGreaterThanOrEqual(1);
    expect(fetchMock.mock.calls.length).toBeGreaterThanOrEqual(3);
  });

  it("401 lalu sukses: re-auth sekali dan retry dengan token baru", async () => {
    const { findClientAccount } = await loadModule();
    queue.push(
      jsonResponse({ token: "tok-old" }),
      new Response(null, { status: 401 }),
      jsonResponse({ token: "tok-new" }),
      jsonResponse({
        data: [{ client_account: "12345", client_uid: "uid-x", client_account_type: "Standard" }]
      })
    );
    const lookup = await findClientAccount("12345");
    expect(lookup).toEqual({ underPartner: true, clientUid: "uid-x", accountType: "Standard" });
    const authCalls = callsMatching(/\/api\/auth\//, "POST");
    expect(authCalls.length).toBeGreaterThanOrEqual(1);
  });

  it("findClientAccount: report kosong berarti bukan di bawah partner", async () => {
    const { findClientAccount } = await loadModule();
    queue.push(jsonResponse({ token: "tok-1" }), jsonResponse({ data: [] }));
    const lookup = await findClientAccount("99999");
    expect(lookup).toEqual({ underPartner: false, clientUid: null, accountType: null });
  });

  it("env kosong melempar ExnessError not_configured", async () => {
    const { findClientAccount, ExnessError } = await loadModule();
    delete process.env.EXNESS_LOGIN;
    delete process.env.EXNESS_PASSWORD;
    const err: unknown = await findClientAccount("12345").catch((e: unknown) => e);
    expect(err).toBeInstanceOf(ExnessError);
    expect(err instanceof Error && err.message).toBe("not_configured");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("getClientStats memetakan angka mentah dan null saat kosong", async () => {
    const { getClientStats } = await loadModule();
    queue.push(
      jsonResponse({ token: "tok-1" }),
      jsonResponse({
        data: [{ client_uid: "uid-9abcdef", deposit_amount: "3", client_balance: "3", ftd_received: 1 }]
      }),
      jsonResponse({ data: [] })
    );
    expect(await getClientStats("uid-9abcdef")).toEqual({
      depositBand: 3,
      balanceBand: 3,
      ftdReceived: true
    });
    expect(await getClientStats("uid-empty")).toBeNull();
  });

  it("!ok selain 401 melempar ExnessError http_<status>", async () => {
    const { exnessFetch, ExnessError } = await loadModule();
    queue.push(
      jsonResponse({ token: "tok-1" }),
      jsonResponse({ error: "server error" }, 500),
      jsonResponse({ error: "server error" }, 500)
    );
    const err: unknown = await exnessFetch("/api/x").catch((e: unknown) => e);
    expect(err).toBeInstanceOf(ExnessError);
    expect(err instanceof Error && err.message).toBe("http_502");
  });
});

describe("evaluateRule", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("standard lolos lewat deposit", async () => {
    const { evaluateRule } = await loadModule();
    const verdict = evaluateRule(null, { depositBand: 4, balanceBand: 0, ftdReceived: false });
    expect(verdict).toEqual({
      approved: true,
      reason: "deposit_ok",
      requiredDepositBand: 3,
      requiredBalanceBand: 3,
      depositMinUsd: 100,
      balanceMinUsd: 50
    });
  });

  it("standard gagal bila di bawah threshold", async () => {
    const { evaluateRule } = await loadModule();
    const verdict = evaluateRule("Standard", { depositBand: 2, balanceBand: 2, ftdReceived: false });
    expect(verdict.approved).toBe(false);
    expect(verdict.reason).toBe("insufficient");
  });

  it("cent: threshold SAMA (band code), lolos lewat deposit", async () => {
    const { evaluateRule } = await loadModule();
    const verdict = evaluateRule("Standard Cent", {
      depositBand: 6,
      balanceBand: 2,
      ftdReceived: false
    });
    expect(verdict).toEqual({
      approved: true,
      reason: "deposit_ok",
      requiredDepositBand: 3,
      requiredBalanceBand: 3,
      depositMinUsd: 100,
      balanceMinUsd: 50
    });
  });

  it("cent: gagal bila balance band < 3", async () => {
    const { evaluateRule } = await loadModule();
    const verdict = evaluateRule("Standard Cent", {
      depositBand: 2,
      balanceBand: 2,
      ftdReceived: false
    });
    expect(verdict.approved).toBe(false);
    expect(verdict.reason).toBe("insufficient");
  });

  it("stats null berarti tidak disetujui", async () => {
    const { evaluateRule } = await loadModule();
    const verdict = evaluateRule("Standard", null);
    expect(verdict.approved).toBe(false);
    expect(verdict.reason).toBe("no_stats");
  });
});