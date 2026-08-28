import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";

interface FakeRow extends Record<string, unknown> {}

const harness = vi.hoisted(() => {
  const state: { rows: FakeRow[]; failNext: boolean } = { rows: [], failNext: false };

  function makeBuilder() {
    const filters: Array<{ column: string; value: unknown }> = [];
    let payloads: FakeRow[] = [];
    let maxLimit: number | null = null;
    let orderColumn: string | null = null;
    const builder: Record<string, unknown> = {
      select() {
        return builder;
      },
      eq(column: string, value: unknown) {
        filters.push({ column, value });
        return builder;
      },
      order(column: string) {
        orderColumn = column;
        return builder;
      },
      limit(count: number) {
        maxLimit = count;
        return builder;
      },
      update(patch: FakeRow) {
        payloads = [patch];
        return builder;
      },
      insert(rows: FakeRow[]) {
        payloads = rows;
        return builder;
      },
      maybeSingle(): Promise<{ data: unknown; error: unknown }> {
        if (state.failNext) {
          state.failNext = false;
          return Promise.resolve({ data: null, error: { code: "XX000" } });
        }
        const filter = filters[0];
        const found = filter ? (state.rows.find((row) => row[filter.column] === filter.value) ?? null) : null;
        return Promise.resolve({ data: found, error: null });
      },
      then(
        onFulfilled?: (value: { data: unknown; error: unknown }) => unknown,
        onRejected?: (reason: unknown) => unknown
      ): Promise<unknown> {
        const execute = (): { data: unknown; error: unknown } => {
          if (state.failNext) {
            state.failNext = false;
            return { data: null, error: { code: "XX000" } };
          }
          if (payloads.length > 0 && "length" in builder === false) {
            const isInsert = filters.length === 0 || payloads.length > 1;
            if (isInsert || !("updated_at" in payloads[0])) {
              for (const row of payloads) state.rows.push({ ...row });
              return { data: payloads, error: null };
            }
            for (const row of state.rows) {
              if (filters.every((f) => row[f.column] === f.value)) Object.assign(row, payloads[0]);
            }
            return { data: null, error: null };
          }
          let result = state.rows.filter((row) => filters.every((f) => row[f.column] === f.value));
          if (orderColumn !== null) {
            const column = orderColumn;
            result = [...result].sort((a, b) => String(b[column]).localeCompare(String(a[column])));
          }
          if (maxLimit !== null) result = result.slice(0, maxLimit);
          return { data: result, error: null };
        };
        return Promise.resolve(execute()).then(onFulfilled, onRejected);
      }
    };
    return builder;
  }

  const client = {
    from(_table: string) {
      return makeBuilder();
    }
  };

  return { state, client };
});

vi.mock("./supabase", () => ({
  StoreError: class StoreError extends Error {},
  createClaimStore: () => harness.client
}));

import { StoreError } from "./supabase";
import { createOrUpdateClaim, getClaimByAccount, listClaims, updateClaimResult } from "./claims";

function seedRow(overrides: Partial<FakeRow> = {}): void {
  harness.state.rows.push({
    id: 1,
    name: "Budi Santoso",
    email: "budi@example.com",
    telegram: "budi_01",
    account: "12345678",
    status: "pending",
    reason: null,
    checks: [],
    created_at: "2026-08-26T00:00:00.000Z",
    updated_at: "2026-08-26T01:00:00.000Z",
    ...overrides
  });
}

beforeEach(() => {
  harness.state.rows = [];
  harness.state.failNext = false;
});

describe("createOrUpdateClaim", () => {
  it("akun baru → INSERT status pending", async () => {
    const result = await createOrUpdateClaim({
      name: "Budi",
      email: "budi@example.com",
      telegram: "budi_01",
      account: "12345678"
    });

    expect(result).toEqual({ account: "12345678" });
    expect(harness.state.rows).toHaveLength(1);
    expect(harness.state.rows[0]).toMatchObject({ account: "12345678", status: "pending" });
  });

  it("akun sudah ada → UPDATE kontak saja, status/reason/checks lama dipertahankan", async () => {
    seedRow({
      id: 7,
      email: "lama@example.com",
      status: "approved",
      reason: "deposit_ok",
      checks: [{ at: "2026-08-26T01:00:00.000Z", approved: true, reason: "deposit_ok" }],
      updated_at: "2026-08-26T01:00:00.000Z"
    });

    const result = await createOrUpdateClaim({
      name: "Budi Baru",
      email: "baru@example.com",
      telegram: "budi_baru",
      account: "12345678"
    });

    expect(result).toEqual({ account: "12345678" });
    expect(harness.state.rows).toHaveLength(1);
    const row = harness.state.rows[0];
    expect(row["email"]).toBe("baru@example.com");
    expect(row["name"]).toBe("Budi Baru");
    expect(row["status"]).toBe("approved");
    expect(row["reason"]).toBe("deposit_ok");
    expect(Array.isArray(row["checks"]) ? (row["checks"] as unknown[]).length : -1).toBe(1);
    expect(row["updated_at"]).not.toBe("2026-08-26T01:00:00.000Z");
  });
});

describe("getClaimByAccount", () => {
  it("ditemukan → ClaimRow dengan mapping snake_case ke camelCase", async () => {
    seedRow();
    const row = await getClaimByAccount("12345678");

    expect(row).not.toBeNull();
    expect(row?.id).toBe(1);
    expect(row?.record).toMatchObject({
      name: "Budi Santoso",
      account: "12345678",
      createdAt: "2026-08-26T00:00:00.000Z",
      updatedAt: "2026-08-26T01:00:00.000Z",
      status: "pending"
    });
  });

  it("tidak ada → null", async () => {
    const row = await getClaimByAccount("87654321");
    expect(row).toBeNull();
  });

  it("error supabase → StoreError tanpa detail sensitif", async () => {
    harness.state.failNext = true;
    await expect(getClaimByAccount("12345678")).rejects.toThrow(StoreError);
  });
});

describe("listClaims", () => {
  it("urut updated_at desc dan hormati limit serta filter status", async () => {
    seedRow({ id: 1, account: "11111111", updated_at: "2026-08-25T00:00:00.000Z" });
    seedRow({ id: 2, account: "22222222", status: "approved", updated_at: "2026-08-26T03:00:00.000Z" });
    seedRow({ id: 3, account: "33333333", updated_at: "2026-08-26T02:00:00.000Z" });

    const all = await listClaims({ limit: 2 });
    expect(all.map((row) => row.id)).toEqual([2, 3]);

    const pending = await listClaims({});
    expect(pending.map((row) => row.record.account)).toEqual(["22222222", "33333333", "11111111"]);

    const approved = await listClaims({ status: "approved" });
    expect(approved.map((row) => row.record.status)).toEqual(["approved"]);
  });
});

describe("updateClaimResult", () => {
  it("append checks + metrics + ubah status jadi approved", async () => {
    seedRow();

    const updated = await updateClaimResult("12345678", {
      approved: true,
      reason: "deposit_ok",
      metrics: { depositBand: 4, balanceBand: 2, requiredDepositBand: 4, requiredBalanceBand: 3 }
    });

    expect(updated).toBe(true);
    const checks = harness.state.rows[0]["checks"] as Array<Record<string, unknown>>;
    expect(checks).toHaveLength(1);
    expect(checks[0]).toEqual({
      at: expect.any(String),
      approved: true,
      reason: "deposit_ok",
      depositBand: 4,
      balanceBand: 2,
      requiredDepositBand: 4,
      requiredBalanceBand: 3
    });
    expect(harness.state.rows[0]["status"]).toBe("approved");
  });

  it("tanpa metrics entri checks tidak punya field angka", async () => {
    seedRow();

    const updated = await updateClaimResult("12345678", { approved: false, reason: "insufficient" });

    expect(updated).toBe(true);
    const checks = harness.state.rows[0]["checks"] as Array<Record<string, unknown>>;
    expect(checks[0]).toEqual({ at: expect.any(String), approved: false, reason: "insufficient" });
  });

  it("akun tidak ada → false tanpa menulis", async () => {
    const updated = await updateClaimResult("99999999", { approved: true, reason: "deposit_ok" });
    expect(updated).toBe(false);
    expect(harness.state.rows).toHaveLength(0);
  });
});
