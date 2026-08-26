import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ClaimRow } from "@/lib/claims";

const exnessMocks = vi.hoisted(() => ({
  findClientAccount: vi.fn(),
  getClientStats: vi.fn(),
  evaluateRule: vi.fn()
}));

vi.mock("@/lib/exness", () => ({
  ExnessError: class ExnessError extends Error {},
  ...exnessMocks
}));

const claimsMocks = vi.hoisted(() => ({
  listClaims: vi.fn(),
  updateClaimResult: vi.fn()
}));

vi.mock("@/lib/claims", () => ({ ...claimsMocks }));

const licenceMocks = vi.hoisted(() => ({
  appendLicensedAccount: vi.fn()
}));

vi.mock("@/lib/licence", () => ({ ...licenceMocks }));

function pendingRow(id: number, account: string): ClaimRow {
  return {
    id,
    record: {
      name: `Trader ${account}`,
      email: `${account}@example.com`,
      telegram: "",
      account,
      createdAt: "2026-08-26T00:00:00.000Z",
      updatedAt: "2026-08-26T01:00:00.000Z",
      status: "pending",
      reason: null,
      checks: []
    }
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
    process.env.CRON_SECRET = "cron-secret";
    claimsMocks.listClaims.mockReset().mockResolvedValue([]);
    claimsMocks.updateClaimResult.mockReset().mockResolvedValue(true);
    licenceMocks.appendLicensedAccount.mockReset().mockResolvedValue("appended");
    exnessMocks.findClientAccount.mockReset();
    exnessMocks.getClientStats.mockReset();
    exnessMocks.evaluateRule.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("secret salah → 401 tanpa proses apa pun", async () => {
    const res = await callGet("Bearer nope");

    expect(res.status).toBe(401);
    expect(claimsMocks.listClaims).not.toHaveBeenCalled();
    expect(exnessMocks.findClientAccount).not.toHaveBeenCalled();
  });

  it("env CRON_SECRET kosong → 401", async () => {
    delete process.env.CRON_SECRET;
    const res = await callGet("Bearer cron-secret");
    expect(res.status).toBe(401);
  });

  it("dua pending satu memenuhi → checked 2 approved 1 + lisensi", async () => {
    claimsMocks.listClaims.mockResolvedValue([pendingRow(1, "11111111"), pendingRow(2, "22222222")]);
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
    expect(claimsMocks.updateClaimResult).toHaveBeenCalledTimes(1);
    expect(claimsMocks.updateClaimResult).toHaveBeenCalledWith(
      "11111111",
      expect.objectContaining({ approved: true })
    );
    expect(licenceMocks.appendLicensedAccount).toHaveBeenCalledTimes(1);
    expect(licenceMocks.appendLicensedAccount).toHaveBeenCalledWith("11111111");
    expect(claimsMocks.listClaims).toHaveBeenCalledWith({ limit: 20, status: "pending" });
  });

  it("lisensi failed → tetap dihitung approved dengan catatan console", async () => {
    claimsMocks.listClaims.mockResolvedValue([pendingRow(1, "11111111")]);
    exnessMocks.findClientAccount.mockResolvedValue({
      underPartner: true,
      clientUid: "uid-a",
      accountType: "Standard"
    });
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
    licenceMocks.appendLicensedAccount.mockResolvedValue("failed");
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const res = await callGet("Bearer cron-secret");
    const json = (await res.json()) as { ok: boolean; checked: number; approved: number };

    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true, checked: 1, approved: 1 });
    expect(errorSpy).toHaveBeenCalledWith("license file append failed");
  });

  it("listClaims gagal → 502", async () => {
    claimsMocks.listClaims.mockRejectedValue(new Error("supabase_XX000"));
    vi.spyOn(console, "error").mockImplementation(() => {});

    const res = await callGet("Bearer cron-secret");
    expect(res.status).toBe(502);
  });
});
