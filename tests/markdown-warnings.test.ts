import { describe, expect, it } from "vitest";

import { WARNING_MESSAGES } from "#/features/resume/constants";
import { markdownWarnings } from "#/features/resume/markdown-warnings";
import { validateResume } from "#/features/resume/validate-resume";

const MESSAGE = WARNING_MESSAGES.markdownBlock();

function pathsFor(input: unknown) {
  return markdownWarnings(input).map((warning) => warning.path);
}

describe("markdownWarnings", () => {
  it.each([
    "# Heading",
    "### Heading",
    "#",
    "- item",
    "* item",
    "+ item",
    "1. item",
    "12) item",
    "| a | b |",
    "   - indented item",
  ])("flags %j", (line) => {
    expect(pathsFor({ basics: { summary: line } })).toEqual([
      ["basics", "summary"],
    ]);
  });

  it.each([
    "#hashtag",
    "C# and F#",
    "-5% churn",
    "2024 - 2025",
    "1.5x faster",
    "*bold* start",
    "    - four spaces",
    "Grew revenue. - Then left",
  ])("leaves %j alone", (line) => {
    expect(pathsFor({ basics: { summary: line } })).toEqual([]);
  });

  it("flags a match on any line", () => {
    expect(
      pathsFor({ basics: { summary: "Builds things.\n- Led a team" } }),
    ).toEqual([["basics", "summary"]]);
  });

  it("warns once per field, on the bullet list", () => {
    expect(
      pathsFor({
        work: [{ highlights: ["Fine", "- one", "# two"] }, { highlights: [] }],
        projects: [
          { description: "Fine" },
          { description: "| table |", highlights: ["1. step"] },
        ],
      }),
    ).toEqual([
      ["work", 0, "highlights"],
      ["projects", 1, "description"],
      ["projects", 1, "highlights"],
    ]);
  });

  it("skips values of the wrong type and fields the CV doesn't parse", () => {
    expect(
      pathsFor({
        basics: { summary: 12, label: "# Title" },
        work: [null, { highlights: [3, { x: "- a" }] }, { summary: "- a" }],
        projects: "- a",
        education: [{ courses: ["- a"] }],
      }),
    ).toEqual([]);
    expect(pathsFor(null)).toEqual([]);
  });

  it("is part of the resume warnings", () => {
    expect(
      validateResume({ basics: { summary: "- item" } }).warnings,
    ).toContainEqual({ path: ["basics", "summary"], message: MESSAGE });
  });
});
