import { describe, it, expect } from "vitest";
import { computeRemainingAmount } from "./splits";

describe("computeRemainingAmount", () => {
  it("returns total minus sum of paidAmount", () => {
    const split = {
      totalAmount: 1000,
      participants: [
        { id: "a", paidAmount: 200 },
        { id: "b", paidAmount: 300 },
        { id: "c", paidAmount: 0 },
      ],
    };

    expect(computeRemainingAmount(split)).toBe(500);
  });

  it("never returns negative", () => {
    const split = { totalAmount: 200, participants: [{ paidAmount: 300 }] };
    expect(computeRemainingAmount(split)).toBe(0);
  });

  it("handles missing participants gracefully", () => {
    const split = { totalAmount: 150 };
    expect(computeRemainingAmount(split)).toBe(150);
  });
});
