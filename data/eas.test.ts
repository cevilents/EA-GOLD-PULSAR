import { describe, expect, it } from "vitest";
import { EAS, WALLET_PARTNER } from "./eas";

describe("data eas", () => {
  it("wallet partner benar", () => {
    expect(WALLET_PARTNER).toBe("1149206011366637938");
  });

  it("berisi 6 ea lengkap", () => {
    expect(EAS).toHaveLength(6);
    for (const ea of EAS) {
      expect(ea.id).toMatch(/^[a-z0-9-]+$/);
      expect(ea.file).toMatch(/\.(ex4|ex5)$/);
      expect(ea.tags.length).toBeGreaterThan(0);
    }
  });
});
