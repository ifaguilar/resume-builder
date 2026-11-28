import { describe, expect, it } from "vitest";

import { contrastOnWhite } from "#/features/templates/color-contrast";

const PRECISION = 2;

describe("contrastOnWhite", () => {
  it.each([
    ["#ffffff", 1],
    ["#000000", 21],
    ["#2563eb", 5.17],
    ["#16a34a", 3.3],
    ["#ff0000", 4],
    ["#767676", 4.54],
  ])("gives %s a ratio of %s", (color, ratio) => {
    expect(contrastOnWhite(color)).toBeCloseTo(ratio, PRECISION);
  });
});
