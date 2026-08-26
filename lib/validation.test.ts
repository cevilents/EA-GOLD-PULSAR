import { describe, expect, it } from "vitest";
import { validateClaim } from "./validation";

const base = {
  name: "Budi",
  email: "Budi@Example.COM",
  telegram: "",
  account: "12345678"
};

describe("validateClaim", () => {
  it("menerima klaim valid dan lowercase email", () => {
    const r = validateClaim(base);
    expect(r).toEqual({
      ok: true,
      value: { name: "Budi", email: "budi@example.com", telegram: "", account: "12345678" }
    });
  });

  it("menerima telegram kosong sebagai opsional", () => {
    const r = validateClaim({ ...base, telegram: "   " });
    expect(r.ok && r.value.telegram).toBe("");
  });

  it("menerima telegram tanpa @ dan membuang @ awal", () => {
    const r1 = validateClaim({ ...base, telegram: "@budi_santoso" });
    expect(r1.ok && r1.value.telegram).toBe("budi_santoso");
    const r2 = validateClaim({ ...base, telegram: " budi_01 " });
    expect(r2.ok && r2.value.telegram).toBe("budi_01");
  });

  it("menolak email tidak valid", () => {
    const r1 = validateClaim({ ...base, email: "bukan-email" });
    const r2 = validateClaim({ ...base, email: "a@b" });
    expect(!r1.ok && r1.errors.email).toBeTruthy();
    expect(!r2.ok && r2.errors.email).toBeTruthy();
  });

  it("menolak telegram 3 karakter", () => {
    const r = validateClaim({ ...base, telegram: "abc" });
    expect(!r.ok && r.errors.telegram).toBeTruthy();
  });

  it("mengganti karakter kontrol pada nama dengan spasi", () => {
    const r = validateClaim({ ...base, name: "Budi\n\tSantoso" });
    expect(r.ok && r.value.name).toBe("Budi Santoso");
  });

  it("menolak nama terlalu pendek/panjang", () => {
    const r1 = validateClaim({ ...base, name: "B" });
    const r2 = validateClaim({ ...base, name: "B".repeat(61) });
    expect(!r1.ok && r1.errors.name).toBeTruthy();
    expect(!r2.ok && r2.errors.name).toBeTruthy();
  });

  it("menolak nomor akun non-numerik atau salah panjang", () => {
    const r1 = validateClaim({ ...base, account: "12ab" });
    const r2 = validateClaim({ ...base, account: "12345678901234" });
    expect(!r1.ok && r1.errors.account).toBeTruthy();
    expect(!r2.ok && r2.errors.account).toBeTruthy();
  });

  it("menolak honeypot terisi", () => {
    const r = validateClaim({ ...base, website: "spam" });
    expect(r.ok).toBe(false);
  });

  it("menolak jika bukan objek", () => {
    expect(validateClaim(null).ok).toBe(false);
    expect(validateClaim("x").ok).toBe(false);
  });
});
