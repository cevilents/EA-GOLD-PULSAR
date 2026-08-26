import { describe, expect, it } from "vitest";
import { checkRateLimit } from "./rateLimit";

describe("checkRateLimit", () => {
  it("mengizinkan sampai batas lalu menolak", () => {
    let t = 1000;
    const now = () => t;
    const key = "ip-test-1";
    for (let i = 0; i < 10; i++) {
      expect(checkRateLimit(key, now())).toBe(true);
    }
    expect(checkRateLimit(key, now())).toBe(false);
  });

  it("mengizinkan lagi setelah jendela waktu lewat", () => {
    let t = 5000;
    const now = () => t;
    const key = "ip-test-2";
    for (let i = 0; i < 10; i++) checkRateLimit(key, now());
    t += 3_600_001;
    expect(checkRateLimit(key, now())).toBe(true);
  });
});
