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

const claimsMocks = vi.hoisted(() => ({
  createOrUpdateClaim: vi.fn(),
  updateClaimResult: vi.fn()
}));

vi.mock("@/lib/claims", () => ({ ...claimsMocks }));

const licenceMocks = vi.hoisted(() => ({
  appendLicensedAccount: vi.fn()
}));

vi.mock("@/lib/licence", () => ({ ...licenceMocks }));

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

const validBody = {
  name: "Budi",
  email: "budi@example.com",
  telegram: "@budi",
  account: "12345678"
};

describe("POST /api/submit", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-key";
    claimsMocks.createOrUpdateClaim.mockReset().mockResolvedValue({ account: validBody.account });
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

  it("rule approved → updateClaimResult + lisensi ditambahkan + respons approved", async () => {
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
    expect(claimsMocks.createOrUpdateClaim).toHaveBeenCalledWith({
      ...validBody,
      telegram: "budi"
    });
    expect(claimsMocks.updateClaimResult).toHaveBeenCalledWith(
      "12345678",
      expect.objectContaining({ approved: true, reason: "deposit_ok" })
    );
    expect(licenceMocks.appendLicensedAccount).toHaveBeenCalledWith("12345678");
  });

  it("lisensi failed → tetap approved dengan catatan console", async () => {
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
    licenceMocks.appendLicensedAccount.mockResolvedValue("failed");
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const res = await post(validBody, "2.2.2.2");
    const json = (await res.json()) as { ok: boolean; status: string };

    expect(json).toEqual({ ok: true, status: "approved" });
    expect(errorSpy).toHaveBeenCalledWith("license file append failed");
  });

  it("underPartner tapi rule gagal → pending tanpa update/lisensi", async () => {
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

    const res = await post(validBody, "3.3.3.3");
    const json = (await res.json()) as { ok: boolean; status: string };

    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true, status: "pending" });
    expect(claimsMocks.updateClaimResult).not.toHaveBeenCalled();
    expect(licenceMocks.appendLicensedAccount).not.toHaveBeenCalled();
  });

  it("exness error → tetap pending", async () => {
    exnessMocks.findClientAccount.mockRejectedValue(new Error("boom"));
    vi.spyOn(console, "error").mockImplementation(() => {});

    const res = await post(validBody, "4.4.4.4");
    const json = (await res.json()) as { ok: boolean; status: string };

    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true, status: "pending" });
    expect(exnessMocks.getClientStats).not.toHaveBeenCalled();
    expect(claimsMocks.updateClaimResult).not.toHaveBeenCalled();
  });

  it("penyimpanan klaim gagal → 502", async () => {
    claimsMocks.createOrUpdateClaim.mockRejectedValue(new Error("supabase_XX000"));
    vi.spyOn(console, "error").mockImplementation(() => {});

    const res = await post(validBody, "5.5.5.5");

    expect(res.status).toBe(502);
    expect(exnessMocks.findClientAccount).not.toHaveBeenCalled();
  });

  it("payload tidak valid → 400 tanpa panggil store/exness", async () => {
    const res = await post({ name: "", email: "x", telegram: "", account: "1" }, "6.6.6.6");

    expect(res.status).toBe(400);
    expect(claimsMocks.createOrUpdateClaim).not.toHaveBeenCalled();
    expect(exnessMocks.findClientAccount).not.toHaveBeenCalled();
  });

  it("honeypot terisi → 400", async () => {
    const res = await post({ ...validBody, website: "spam" }, "7.7.7.7");

    expect(res.status).toBe(400);
    expect(claimsMocks.createOrUpdateClaim).not.toHaveBeenCalled();
  });

  it("env supabase kosong → 503 tanpa menyentuh store", async () => {
    delete process.env.SUPABASE_URL;
    const res = await post(validBody, "8.8.8.8");

    expect(res.status).toBe(503);
    expect(claimsMocks.createOrUpdateClaim).not.toHaveBeenCalled();
  });
});
