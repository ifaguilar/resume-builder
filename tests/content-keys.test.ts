import { describe, expect, it } from "vitest";

import { withContentKeys } from "#/features/templates/content-keys";

describe("withContentKeys", () => {
  it("keeps items in order and gives repeated content unique keys", () => {
    const keyed = withContentKeys(["React", "Git", "React"]);
    expect(keyed.map(({ item }) => item)).toEqual(["React", "Git", "React"]);
    expect(new Set(keyed.map(({ key }) => key)).size).toBe(keyed.length);
  });

  it("can't collide with content that looks like a numbered key", () => {
    const first = withContentKeys(["a", "a"])[1]?.key;
    const lookalike = withContentKeys([JSON.stringify(["a", 1])])[0]?.key;
    expect(first).not.toBe(lookalike);
  });

  it("keys objects by their content", () => {
    const [a, b] = withContentKeys([{ title: "A" }, { title: "B" }]);
    expect(a?.key).not.toBe(b?.key);
  });
});
