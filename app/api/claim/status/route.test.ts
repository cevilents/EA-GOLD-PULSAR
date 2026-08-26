import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ClaimRow } from "@/lib/claims";

const claimsMocks = vi.hoisted(() => ({
  getClaimByAccount: vi.fn()
}));

vi.mock("@/lib/claims", () => ({ ...claimsMocks }));

function row(account: string, status: ClaimRow["record"]["status"], reason: string | null): ClaimRow {
  return {
    id: 11,
    record: {
      name: "Budi",
      email: "budi@example.com",
      telegram: "",
      account,
      createdAt: "2026-08-26T00:00:00.000Z",
      updatedAt: "2026-08-26T01:00:00.000Z",
      status,
      reason,
      checks: []
    }
  };
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
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-key";
    claimsMocks.getClaimByAccount.mockReset().mockResolvedValue(null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("klaim tidak ada → status none", async () => {
    const res = await get("12345678", "1.1.1.1");
    const json = (await res.json()) as { ok: boolean; status: string };

    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true, status: "none" });
    expect(claimsMocks.getClaimByAccount).toHaveBeenCalledWith("12345678");
  });

  it("klaim pending → status pending dengan reason null", async () => {
    claimsMocks.getClaimByAccount.mockResolvedValue(row("12345678", "pending", null));

    const res = await get("12345678", "2.2.2.2");
    const json = (await res.json()) as { ok: boolean; status: string; reason: string | null };

    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true, status: "pending", reason: null });
  });

  it("klaim approved → status approved dengan reason utuh", async () => {
    claimsMocks.getClaimByAccount.mockResolvedValue(row("87654321", "approved", "deposit_ok"));

    const res = await get("87654321", "3.3.3.3");
    const json = (await res.json()) as { ok: boolean; status: string; reason: string | null };

    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true, status: "approved", reason: "deposit_ok" });
  });

  it("reason manual disanitasi", async () => {
    claimsMocks.getClaimByAccount.mockResolvedValue(row("11223344", "rejected", "manual_reject: kasar"));

    const res = await get("11223344", "4.4.4.4");
    const json = (await res.json()) as { ok: boolean; status: string; reason: string | null };

    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true, status: "rejected", reason: "manual_reject" });
  });

  it("parameter account tidak valid → 400 tanpa memanggil store", async () => {
    const res = await get("abc", "5.5.5.5");

    expect(res.status).toBe(400);
    expect(claimsMocks.getClaimByAccount).not.toHaveBeenCalled();
  });

  it("env supabase kosong → 503", async () => {
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    const res = await get("12345678", "6.6.6.6");

    expect(res.status).toBe(503);
    expect(claimsMocks.getClaimByAccount).not.toHaveBeenCalled();
  });

  it("store gagal → 502", async () => {
    claimsMocks.getClaimByAccount.mockRejectedValue(new Error("supabase_XX000"));
    const res = await get("12345678", "7.7.7.7");

    expect(res.status).toBe(502);
  });
});
