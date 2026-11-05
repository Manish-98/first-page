import { describe, expect, it } from "vitest";
import { A4_CONTENT_HEIGHT, calculatePageCount } from "./pagination";
describe("calculatePageCount", () => {
  it("keeps empty and invalid measurements on one page", () => {
    expect(calculatePageCount(0)).toBe(1);
    expect(calculatePageCount(-10)).toBe(1);
    expect(calculatePageCount(Number.NaN)).toBe(1);
    expect(calculatePageCount(Number.POSITIVE_INFINITY)).toBe(1);
  });
  it("keeps exact fits on one page", () => { expect(calculatePageCount(A4_CONTENT_HEIGHT)).toBe(1); });
  it("flows overflow onto subsequent pages", () => {
    expect(calculatePageCount(A4_CONTENT_HEIGHT + 1)).toBe(2);
    expect(calculatePageCount(A4_CONTENT_HEIGHT * 2)).toBe(2);
    expect(calculatePageCount(A4_CONTENT_HEIGHT * 2 + 1)).toBe(3);
  });
});
