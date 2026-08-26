import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  encodeClaimBody,
  parseClaimBody,
  updateClaimResult,
  type ClaimRecord
} from "./claims";

const sample: ClaimRecord = {
  name: "Budi Santoso",
  email: "budi@example.com",
  telegram: "budi_01",
  account: "12345678",
  createdAt: "2026-08-26T00:00:00.000Z",
  updatedAt: "2026-08-26T01:00:00.000Z",
  status: "pending",
  reason: null,
  checks: [{ at: "2026-08-26T01:00:00.000Z", approved: false, reason: "insufficient" }]
};

describe("claim body codec", () => {
  it("round-trip encode lalu parse menghasilkan record yang sama", () => {
    expect(parseClaimBody(encodeClaimBody(sample))).toEqual(sample);
  });

  it("body tanpa blok json menghasilkan null", () => {
    expect(parseClaimBody("Nama: Budi\nAkun: 12345678")).toBeNull();
  });

  it("json rusak dalam blok menghasilkan null", () => {
    expect(parseClaimBody("```json\n{broken\n```")).toBeNull();
  });

  it("record tanpa account atau status menghasilkan null", () => {
    const broken = encodeClaimBody({ ...sample, account: "", status: "pending" });
    expect(parseClaimBody(broken)).toBeNull();
    const noStatus = encodeClaimBody({ ...sample, status: undefined as unknown as ClaimRecord["status"] });
    expect(parseClaimBody(noStatus)).toBeNull();
  });
});

describe("updateClaimResult", () => {
  beforeEach(() => {
    process.env.GITHUB_TOKEN = "test-token";
    process.env.GITHUB_REPO = "me/claims";
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  function stubRepo(patched: { body: string }): void {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: unknown, init?: RequestInit): Promise<Response> => {
        const method = (init?.method ?? "GET").toUpperCase();
        if (method === "PATCH") {
          patched.body = String(init?.body ?? "");
          return new Response(JSON.stringify({}), { status: 200 });
        }
        return new Response(
          JSON.stringify([
            {
              number: 1,
              title: `[CLAIM] ${sample.name} — ${sample.account}`,
              body: encodeClaimBody(sample)
            }
          ]),
          { status: 200 }
        );
      })
    );
  }

  it("menulis metrics ke entri checks terakhir saat patch", async () => {
    const patched = { body: "" };
    stubRepo(patched);
    const updated = await updateClaimResult("12345678", {
      approved: true,
      reason: "deposit_ok",
      metrics: { depositAmount: 150, balance: 30, requiredDeposit: 100, requiredBalance: 50 }
    });
    expect(updated).toBe(true);
    const issueBody = (JSON.parse(patched.body) as { body?: string }).body ?? "";
    const parsed = parseClaimBody(issueBody);
    expect(parsed?.checks.at(-1)).toEqual({
      at: expect.any(String),
      approved: true,
      reason: "deposit_ok",
      depositAmount: 150,
      balance: 30,
      requiredDeposit: 100,
      requiredBalance: 50
    });
  });

  it("tanpa metrics entri checks tidak punya field angka", async () => {
    const patched = { body: "" };
    stubRepo(patched);
    await updateClaimResult("12345678", { approved: false, reason: "insufficient" });
    const issueBody = (JSON.parse(patched.body) as { body?: string }).body ?? "";
    const parsed = parseClaimBody(issueBody);
    expect(parsed?.checks.at(-1)).toEqual({
      at: expect.any(String),
      approved: false,
      reason: "insufficient"
    });
  });
});
