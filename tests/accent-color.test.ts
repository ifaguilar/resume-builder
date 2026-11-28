import { describe, expect, it } from "vitest";

import { parseHexColor } from "#/features/design/accent-color";

describe("parseHexColor", () => {
  it.each([
    ["#C0392B", "#c0392b"],
    ["c0392b", "#c0392b"],
    ["  #2563eb ", "#2563eb"],
  ])("reads %j as %s", (text, color) => {
    expect(parseHexColor(text)).toBe(color);
  });

  it.each([[""], ["#abc"], ["red"], ["#c0392g"], ["##c0392b"]])(
    "rejects %j",
    (text) => {
      expect(parseHexColor(text)).toBeUndefined();
    },
  );
});
