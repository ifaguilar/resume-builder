import { describe, expect, it } from "vitest";

import {
  moveSection,
  sectionSetting,
  sectionTitleSetting,
  updateSection,
} from "#/features/design/section-settings";
import {
  DEFAULT_SETTINGS,
  parseSections,
  parseSettings,
} from "#/features/resume/settings-schema";

function ids(sections: { id: string }[]): string[] {
  return sections.map(({ id }) => id);
}

describe("parseSettings", () => {
  it("gives every setting its default when there are none", () => {
    expect(parseSettings(undefined)).toEqual(DEFAULT_SETTINGS);
  });

  it("keeps the valid settings when one is invalid", () => {
    expect(
      parseSettings({ pageSize: "A4", templateId: "fancy", sections: 3 }),
    ).toEqual({ ...DEFAULT_SETTINGS, pageSize: "A4" });
  });

  it.each([["red"], ["#abc"], [12], [null]])(
    "falls back to the default accent color for %j",
    (accentColor) => {
      expect(parseSettings({ pageSize: "A4", accentColor })).toEqual({
        ...DEFAULT_SETTINGS,
        pageSize: "A4",
      });
    },
  );

  it("stores the accent color in lowercase", () => {
    expect(parseSettings({ accentColor: "#C0392B" }).accentColor).toBe(
      "#c0392b",
    );
  });

  it("drops the old themeId", () => {
    expect(parseSettings({ themeId: "default" })).toEqual(DEFAULT_SETTINGS);
  });
});

describe("parseSections", () => {
  it("uses the default order for a value that isn't a list", () => {
    expect(parseSections("skills")).toEqual(DEFAULT_SETTINGS.sections);
  });

  it("keeps a saved order, visibility and title", () => {
    const saved = [
      { id: "summary", visible: false },
      { id: "education", visible: true, title: "Studies" },
      { id: "skills", visible: true },
      { id: "projects", visible: false },
      { id: "experience", visible: true },
    ];
    expect(parseSections(saved)).toEqual(saved);
  });

  it("drops unknown, repeated and broken entries", () => {
    expect(
      ids(
        parseSections([
          { id: "summary", visible: true },
          { id: "awards", visible: true },
          { id: "education", visible: true },
          { id: "education", visible: false },
          { id: "skills", visible: "yes" },
          { id: "projects", visible: true, extra: 1 },
          { id: "experience", visible: true },
        ]),
      ),
    ).toEqual(["summary", "skills", "education", "experience", "projects"]);
  });

  it("puts a missing section after the one it follows by default", () => {
    expect(
      ids(
        parseSections([
          { id: "summary", visible: true },
          { id: "education", visible: true },
          { id: "skills", visible: true },
          { id: "experience", visible: true },
        ]),
      ),
    ).toEqual(["summary", "education", "skills", "experience", "projects"]);
  });

  it("keeps the summary first", () => {
    expect(
      ids(
        parseSections([
          { id: "skills", visible: true },
          { id: "summary", visible: true },
        ]),
      ),
    ).toEqual(["summary", "skills", "experience", "projects", "education"]);
  });

  it("trims titles and drops blank ones", () => {
    expect(
      parseSections([
        { id: "summary", visible: true, title: "  Profile " },
        { id: "skills", visible: true, title: "   " },
      ]).slice(0, 2),
    ).toEqual([
      { id: "summary", visible: true, title: "Profile" },
      { id: "skills", visible: true },
    ]);
  });
});

describe("sectionTitleSetting", () => {
  it.each([
    ["Work History", "Experience", "Work History"],
    ["  Work History  ", "Experience", "Work History"],
    ["", "Experience", undefined],
    ["   ", "Experience", undefined],
    ["Experience", "Experience", undefined],
    [" Experience ", "Experience", undefined],
  ])("%j with default %j stores %j", (text, defaultTitle, expected) => {
    expect(sectionTitleSetting(text, defaultTitle)).toBe(expected);
  });
});

describe("section helpers", () => {
  it("leaves out an absent title", () => {
    expect(sectionSetting("skills", true, undefined)).toEqual({
      id: "skills",
      visible: true,
    });
  });

  it("moves sections after the summary", () => {
    expect(ids(moveSection(DEFAULT_SETTINGS.sections, 3, 0))).toEqual([
      "summary",
      "education",
      "skills",
      "experience",
      "projects",
    ]);
  });

  it("keeps the same list when a change leaves the section as it was", () => {
    const sections = DEFAULT_SETTINGS.sections;
    expect(
      updateSection(sections, "skills", (section) =>
        sectionSetting(section.id, section.visible, undefined),
      ),
    ).toBe(sections);
  });

  it("returns a new list with the changed section", () => {
    const sections = DEFAULT_SETTINGS.sections;
    const next = updateSection(sections, "skills", (section) =>
      sectionSetting(section.id, false, "Tools"),
    );
    expect(next).not.toBe(sections);
    expect(next.find(({ id }) => id === "skills")).toEqual({
      id: "skills",
      visible: false,
      title: "Tools",
    });
    expect(sections.find(({ id }) => id === "skills")).toEqual({
      id: "skills",
      visible: true,
    });
  });
});
