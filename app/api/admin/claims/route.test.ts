import { beforeEach, describe, expect, it, vi } from "vitest";
import type { StoredClaim } from "@/lib/claims";
import { createSessionValue } from "@/lib/admin-auth";

vi.mock("@/lib/claims", () => ({
  listClaims: vi.fn(),
  updateClaimResult: vi.fn()
}));

import { GET, PATCH } from "./route";
import { listClaims, updateClaimResult } from "@/lib/claims";

const listClaimsMock = vi.mocked(listClaims);
const updateMock = vi.mocked(updateClaimResult);

function claim(account: string, status: "pending" | "approved" | "rejected", updatedAt: string): StoredClaim {
  return {
    issueNumber: 11,
    record: {
      name: "Budi",
      email: "budi@example.com",
      telegram: "@budi",
      account,
      createdAt: "2026-08-26T00:00:00.000Z",
      updatedAt,
      status,
      reason: null,
      checks: []
    }
  };
}

function authCookie(): string {
  return `gp_admin=${createSessionValue()}`;
}

function get(cookie?: string, query = ""): Promise<Response> {
  return GET(
    new Request(`http://localhost/api/admin/claims${query}`, {
      headers: cookie === undefined ? {} : { cookie }
    })
  );
}

async function patch(body: unknown, rawCookie?: string): Promise<Response> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (rawCookie !== undefined) headers.cookie = rawCookie;
  return PATCH(
    new Request("http://localhost/api/admin/claims", {
      method: "PATCH",
      headers,
      body: JSON.stringify(body)
    })
  );
}

describe("GET /api/admin/claims", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.ADMIN_SESSION_SECRET = "secret-session-value";
    listClaimsMock.mockResolvedValue([
      claim("12345678", "pending", "2026-08-26T02:00:00.000Z"),
      claim("87654321", "approved", "2026-08-26T01:00:00.000Z")
    ]);
  });

  it("tanpa cookie → 401 dan listClaims tidak dipanggil", async () => {
    const res = await get(undefined);
    expect(res.status).toBe(401);
    expect(listClaimsMock).not.toHaveBeenCalled();
  });

  it("cookie sampah → 401", async () => {
    const res = await get("gp_admin=garbage");
    expect(res.status).toBe(401);
    expect(listClaimsMock).not.toHaveBeenCalled();
  });

  it("auth valid → daftar klaim dengan bentuk {issueNumber,...record}", async () => {
    const res = await get(authCookie());
    const json = (await res.json()) as { ok: boolean; claims: Array<Record<string, unknown>> };
    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(json.claims[0]).toMatchObject({
      issueNumber: 11,
      account: "12345678",
      status: "pending",
      name: "Budi"
    });
    expect(json.claims).toHaveLength(2);
    expect(listClaimsMock).toHaveBeenCalledWith({ limit: 100 });
  });

  it("filter status=approved → hanya approved", async () => {
    const res = await get(authCookie(), "?status=approved");
    const json = (await res.json()) as { claims: Array<{ status: string }> };
    expect(json.claims).toHaveLength(1);
    expect(json.claims[0].status).toBe("approved");
  });
});

describe("PATCH /api/admin/claims", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.ADMIN_SESSION_SECRET = "secret-session-value";
    updateMock.mockResolvedValue(true);
  });

  it("guard tanpa cookie → 401 tanpa memanggil update", async () => {
    const res = await patch({ account: "12345678", action: "approve" });
    expect(res.status).toBe(401);
    expect(updateMock).not.toHaveBeenCalled();
  });

  it("body tidak valid → 400", async () => {
    const res = await patch({ account: "abc", action: "approve" }, authCookie());
    expect(res.status).toBe(400);
    expect(updateMock).not.toHaveBeenCalled();
  });

  it("note terlalu panjang → 400", async () => {
    const res = await patch({ account: "12345678", action: "approve", note: "x".repeat(201) }, authCookie());
    expect(res.status).toBe(400);
  });

  it("approve → updateClaimResult dengan approved true + reason manual_approve", async () => {
    const res = await patch({ account: "12345678", action: "approve" }, authCookie());
    const json = (await res.json()) as { ok: boolean };
    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true });
    expect(updateMock).toHaveBeenCalledWith("12345678", {
      approved: true,
      reason: "manual_approve"
    });
  });

  it("reject + note → approved false + reason manual_reject: note", async () => {
    await patch({ account: "12345678", action: "reject", note: "akun lama" }, authCookie());
    expect(updateMock).toHaveBeenCalledWith("12345678", {
      approved: false,
      reason: "manual_reject: akun lama"
    });
  });

  it("klaim tidak ada → 404", async () => {
    updateMock.mockResolvedValue(false);
    const res = await patch({ account: "99999999", action: "approve" }, authCookie());
    expect(res.status).toBe(404);
  });
});
