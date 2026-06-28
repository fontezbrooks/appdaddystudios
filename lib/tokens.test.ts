import { describe, it, expect } from "vitest";
import { duration, ease } from "./tokens";

describe("duration tokens", () => {
  it("exposes the documented motion durations", () => {
    expect(Object.keys(duration)).toEqual([
      "instant",
      "fast",
      "base",
      "slow",
      "entrance",
    ]);
  });

  it("uses 0 as the reduced-motion fallback", () => {
    expect(duration.instant).toBe(0);
  });

  it("increases monotonically from fast to entrance", () => {
    const ordered = [
      duration.fast,
      duration.base,
      duration.slow,
      duration.entrance,
    ];
    const sorted = [...ordered].sort((a, b) => a - b);
    expect(ordered).toEqual(sorted);
  });

  it("expresses durations in seconds (framer-motion convention)", () => {
    // All sub-second except the deliberate 0; sanity-check the unit.
    for (const value of Object.values(duration)) {
      expect(value).toBeLessThanOrEqual(1);
      expect(value).toBeGreaterThanOrEqual(0);
    }
  });
});

describe("ease tokens", () => {
  it("provides outSoft and inOutSoft curves", () => {
    expect(Object.keys(ease)).toEqual(["outSoft", "inOutSoft"]);
  });

  it("expresses each curve as a 4-point cubic-bezier tuple", () => {
    for (const curve of Object.values(ease)) {
      expect(curve).toHaveLength(4);
      for (const n of curve) {
        expect(typeof n).toBe("number");
      }
    }
  });

  it("matches the documented exponential-out curve", () => {
    expect(ease.outSoft).toEqual([0.16, 1, 0.3, 1]);
  });
});
