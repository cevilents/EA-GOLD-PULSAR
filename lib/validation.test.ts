import { describe, expect, it } from "vitest";
import { validateClaim } from "./validation";

describe("validateClaim", () => {
  it("menerima klaim valid", () => {
    const r = validateClaim({ name: "Budi", whatsapp: "+628123456789", account: "12345678" });
    expect(r).toEqual({
      ok: true,
      value: { name: "Budi", whatsapp: "+628123456789", account: "12345678" }
    });
  });

  it("membersihkan spasi pada whatsapp", () => {
    const r = validateClaim({ name: " Budi ", whatsapp: "6281 2345-6789", account: "12345678" });
    expect(r.ok && r.value.whatsapp).toBe("+628123456789");
  });

  it("tolak jika bukan objek", () => {
    expect(validateClaim(null).ok).toBe(false);
    expect(validateClaim("x").ok).toBe(false);
  });

  it("tolak nama terlalu pendek/panjang", () => {
    const r = validateClaim({ name: "B", whatsapp: "628123456789", account: "12345678" });
    expect(!r.ok && r.errors.name).toBeTruthy();
  });

  it("tolak whatsapp tanpa digit cukup", () => {
    const r = validateClaim({ name: "Budi", whatsapp: "12345", account: "12345678" });
    expect(!r.ok && r.errors.whatsapp).toBeTruthy();
  });

  it("tolak whatsapp berisi huruf", () => {
    const r = validateClaim({ name: "Budi", whatsapp: "08abc123456", account: "12345678" });
    expect(!r.ok && r.errors.whatsapp).toBeTruthy();
  });

  it("tolak nomor akun non-numerik atau salah panjang", () => {
    const r1 = validateClaim({ name: "Budi", whatsapp: "628123456789", account: "12ab" });
    const r2 = validateClaim({ name: "Budi", whatsapp: "628123456789", account: "12345678901234" });
    expect(!r1.ok && r1.errors.account).toBeTruthy();
    expect(!r2.ok && r2.errors.account).toBeTruthy();
  });

  it("tolak honeypot terisi", () => {
    const r = validateClaim({ name: "Budi", whatsapp: "628123456789", account: "12345678", website: "spam" });
    expect(r.ok).toBe(false);
  });
});
