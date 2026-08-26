import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ExnessError } from "@/lib/exness";

const exnessMocks = vi.hoisted(() => ({
  findClientAccount: vi.fn(),
  getClientStats: vi.fn()
}));

vi.mock("@/lib/exness", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/exness")>();
  return {
    ...actual,
    findClientAccount: exnessMocks.findClientAccount,
    getClientStats: exnessMocks.getClientStats
  };
});

interface DetailJson {
  depositAmount: number;
  balance: number;
  requiredDeposit: number;
  requiredBalance: number;
  isCent: boolean;
}

type ResponseJson = {
  ok: boolean;
  state: string;
  error?: string;
  detail?: DetailJson;
};

async function get(account: string, ip: string): Promise<Response> {
  const { GET } = await import("./route");
  return GET(
    new Request(`http://localhost/api/verify/account?account=${account}`, {
      headers: { "x-forwarded-for": ip }
    })
  );
}

describe("GET /api/verify/account", () => {
  beforeEach(() => {
    vi.resetModules();
    exnessMocks.findClientAccount.mockReset().mockResolvedValue({
      underPartner: false,
      clientUid: null,
      accountType: null
    });
    exnessMocks.getClientStats.mockReset().mockResolvedValue(null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("akun tidak under partner → state not_found", async () => {
    const res = await get("12345678", "1.1.1.1");
    const json = (await res.json()) as ResponseJson;

    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true, state: "not_found" });
    expect(exnessMocks.findClientAccount).toHaveBeenCalledWith("12345678");
    expect(exnessMocks.getClientStats).not.toHaveBeenCalled();
  });

  it("under partner dan syarat terpenuhi → state active", async () => {
    exnessMocks.findClientAccount.mockResolvedValue({
      underPartner: true,
      clientUid: "uid-a",
      accountType: "Standard"
    });
    exnessMocks.getClientStats.mockResolvedValue({
      depositAmount: 150,
      balance: 60,
      ftdReceived: true
    });

    const res = await get("12345678", "2.2.2.2");
    const json = (await res.json()) as ResponseJson;

    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true, state: "active" });
    expect(exnessMocks.getClientStats).toHaveBeenCalledWith("uid-a");
  });

  it("under partner tapi di bawah syarat → state below dengan detail", async () => {
    exnessMocks.findClientAccount.mockResolvedValue({
      underPartner: true,
      clientUid: "uid-b",
      accountType: "Standard"
    });
    exnessMocks.getClientStats.mockResolvedValue({
      depositAmount: 40,
      balance: 30,
      ftdReceived: false
    });

    const res = await get("23456789", "3.3.3.3");
    const json = (await res.json()) as ResponseJson;

    expect(res.status).toBe(200);
    expect(json).toEqual({
      ok: true,
      state: "below",
      detail: {
        depositAmount: 40,
        balance: 30,
        requiredDeposit: 100,
        requiredBalance: 50,
        isCent: false
      }
    });
  });

  it("akun cent → required dikalikan faktor cent dan isCent true", async () => {
    exnessMocks.findClientAccount.mockResolvedValue({
      underPartner: true,
      clientUid: "uid-c",
      accountType: "Financial Cent"
    });
    exnessMocks.getClientStats.mockResolvedValue({
      depositAmount: 5000,
      balance: 20,
      ftdReceived: true
    });

    const res = await get("34567890", "4.4.4.4");
    const json = (await res.json()) as ResponseJson;

    expect(res.status).toBe(200);
    expect(json).toEqual({
      ok: true,
      state: "below",
      detail: {
        depositAmount: 5000,
        balance: 20,
        requiredDeposit: 10000,
        requiredBalance: 5000,
        isCent: true
      }
    });
  });

  it("stats null → below dengan angka nol", async () => {
    exnessMocks.findClientAccount.mockResolvedValue({
      underPartner: true,
      clientUid: "uid-d",
      accountType: "Standard"
    });
    exnessMocks.getClientStats.mockResolvedValue(null);

    const res = await get("45678901", "5.5.5.5");
    const json = (await res.json()) as ResponseJson;

    expect(res.status).toBe(200);
    expect(json).toEqual({
      ok: true,
      state: "below",
      detail: {
        depositAmount: 0,
        balance: 0,
        requiredDeposit: 100,
        requiredBalance: 50,
        isCent: false
      }
    });
  });

  it("parameter account tidak valid → 400 tanpa memanggil exness", async () => {
    const res = await get("abc", "6.6.6.6");

    expect(res.status).toBe(400);
    expect(exnessMocks.findClientAccount).not.toHaveBeenCalled();
  });

  it("melebihi batas rate limit → 429", async () => {
    for (let i = 0; i < 10; i += 1) {
      const limited = await get("abc", "7.7.7.7");
      expect(limited.status).toBe(400);
    }

    const res = await get("12345678", "7.7.7.7");

    expect(res.status).toBe(429);
    expect(exnessMocks.findClientAccount).not.toHaveBeenCalled();
  });

  it("ExnessError not_configured → 502", async () => {
    exnessMocks.findClientAccount.mockRejectedValue(new ExnessError("not_configured"));

    const res = await get("12345678", "8.8.8.8");
    const json = (await res.json()) as ResponseJson;

    expect(res.status).toBe(502);
    expect(json).toEqual({ error: "Gagal memeriksa akun. Coba lagi." });
  });

  it("getClientStats gagal → 502", async () => {
    exnessMocks.findClientAccount.mockResolvedValue({
      underPartner: true,
      clientUid: "uid-e",
      accountType: "Standard"
    });
    exnessMocks.getClientStats.mockRejectedValue(new Error("http_500"));

    const res = await get("12345678", "9.9.9.9");

    expect(res.status).toBe(502);
  });
});
