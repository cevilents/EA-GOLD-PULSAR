import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExnessError } from "@/lib/exness";
import { createSessionValue } from "@/lib/admin-auth";

vi.mock("@/lib/exness", () => ({
  exnessFetch: vi.fn(),
  ExnessError: class extends Error {}
}));

import { GET } from "./route";
import { exnessFetch } from "@/lib/exness";

const exnessMock = vi.mocked(exnessFetch);

function authCookie(): string {
  return `gp_admin=${createSessionValue()}`;
}

function get(cookie?: string): Promise<Response> {
  return GET(
    new Request("http://localhost/api/admin/clients", {
      headers: cookie === undefined ? {} : { cookie }
    })
  );
}

describe("GET /api/admin/clients", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.ADMIN_SESSION_SECRET = "secret-session-value";
  });

  it("tanpa cookie → 401 tanpa memanggil exness", async () => {
    const res = await get(undefined);
    expect(res.status).toBe(401);
    expect(exnessMock).not.toHaveBeenCalled();
  });

  it("cookie sampah → 401", async () => {
    const res = await get("gp_admin=garbage");
    expect(res.status).toBe(401);
  });

  it("auth valid → mapping baris clients ke bentuk UI", async () => {
    exnessMock.mockResolvedValue({
      data: [
        {
          client_uid: "100500",
          country: "Indonesia",
          reg_date: "2026-08-01",
          deposit_amount: 150,
          client_balance: 75.5,
          ftd_received: true,
          volume_mln_usd: 1.25,
          client_status: "Active"
        },
        {
          client_uid: "100501",
          country: "Malaysia",
          reg_date: "2026-08-02",
          deposit_amount: 0,
          client_balance: 0,
          ftd_received: false,
          volume_mln_usd: 0,
          client_status: "New"
        }
      ]
    });
    const res = await get(authCookie());
    const json = (await res.json()) as {
      ok: boolean;
      clients: Array<Record<string, unknown>>;
    };
    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(exnessMock).toHaveBeenCalledWith("/api/v2/reports/clients/?limit=100");
    expect(json.clients[0]).toEqual({
      uid: "100500",
      country: "Indonesia",
      regDate: "2026-08-01",
      depositAmount: 150,
      balance: 75.5,
      ftdReceived: true,
      volumeMlnUsd: 1.25,
      status: "Active"
    });
    expect(json.clients[1].ftdReceived).toBe(false);
  });

  it("ExnessError → 502 dengan pesan Indonesia", async () => {
    exnessMock.mockRejectedValue(new ExnessError("http_500"));
    const res = await get(authCookie());
    const json = (await res.json()) as { error: string };
    expect(res.status).toBe(502);
    expect(json.error).toBe("Gagal mengambil data Exness.");
  });
});
