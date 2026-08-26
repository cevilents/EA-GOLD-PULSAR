import { describe, expect, it } from "vitest";
import { encodeClaimBody, parseClaimBody, type ClaimRecord } from "./claims";

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
