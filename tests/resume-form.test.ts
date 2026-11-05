import { describe, expect, it } from "vitest";

import { entryTitle } from "#/features/resume-form/entry-title";
import {
  filledBulletIndexes,
  pasteBullets,
  splitBullet,
  toBulletLines,
} from "#/features/resume-form/fields/bullet-list";
import {
  formatDisplayDate,
  initialFocusMonth,
  moveMonth,
  parsePartialDate,
  toMonthValue,
} from "#/features/resume-form/fields/date-picker-utils";
import { addKeywords } from "#/features/resume-form/fields/keyword-list";
import { hasContent } from "#/features/resume-form/has-content";
import {
  createKeys,
  insertItems,
  moveItem,
  removeItem,
  syncKeys,
} from "#/features/resume-form/list-keys";
import { resumeWarningsValidator } from "#/features/resume-form/resume-warnings-validator";
import { toFieldName } from "#/features/resume-form/to-field-name";
import {
  toOptionalText,
  toTrimmedText,
} from "#/features/resume-form/to-optional-text";
import { hasInput, sectionOf } from "#/features/resume-form/warning-paths";
import { withHttps } from "#/features/resume-form/with-https";
import { WARNING_MESSAGES } from "#/features/resume/constants";
import {
  COUNTRY_CODES,
  countryName,
  listCountries,
} from "#/features/resume/countries";
import { formatLocation } from "#/features/resume/format-location";
import type { Resume } from "#/features/resume/resume-schema";

const fixtures = import.meta.glob<Resume>("/tests/fixtures/*.json", {
  eager: true,
  import: "default",
});

function warningAt(path: (string | number)[]) {
  return { path, message: "" };
}

describe("toFieldName", () => {
  it.each([
    [[], ""],
    [["basics"], "basics"],
    [["basics", "email"], "basics.email"],
    [["basics", "location", "city"], "basics.location.city"],
    [["work", 1, "startDate"], "work[1].startDate"],
    [["work", 0, "highlights", 2], "work[0].highlights[2]"],
    [["basics", "profiles", 0, "url"], "basics.profiles[0].url"],
  ] as const)("%j becomes %s", (path, name) => {
    expect(toFieldName(path)).toBe(name);
  });
});

describe("resumeWarningsValidator", () => {
  it.each(Object.entries(fixtures))("%s has no warnings", (_, resume) => {
    expect(resumeWarningsValidator({ value: resume })).toBeUndefined();
  });

  it("puts each warning on its field and keeps the full list", () => {
    const value: Resume = {
      basics: { email: "not-an-email" },
      work: [{}, { startDate: "2024-13" }],
    };
    const result = resumeWarningsValidator({ value });

    expect(result?.fields).toEqual({
      "basics.email": [{ message: WARNING_MESSAGES.email }],
      "work[1].startDate": [{ message: WARNING_MESSAGES.date }],
    });
    expect(result?.form).toEqual([
      { path: ["basics", "email"], message: WARNING_MESSAGES.email },
      { path: ["work", 1, "startDate"], message: WARNING_MESSAGES.date },
    ]);
  });

  it("keeps every warning when one field has several", () => {
    // Fails both the format check and the real-calendar check.
    const value: Resume = { work: [{ startDate: "2023-13-45" }] };
    const result = resumeWarningsValidator({ value });

    expect(result?.fields["work[0].startDate"]).toEqual([
      { message: WARNING_MESSAGES.date },
      { message: WARNING_MESSAGES.nonexistentDate },
    ]);
  });

  it("gives each unknown key its own field name", () => {
    const value = { basics: { extra: 1, other: 2 } };
    const result = resumeWarningsValidator({ value });

    expect(Object.keys(result?.fields ?? {})).toEqual([
      "basics.extra",
      "basics.other",
    ]);
  });
});

describe("warning paths", () => {
  it("finds the section", () => {
    expect(sectionOf(warningAt(["work", 0, "url"]))).toBe("work");
    expect(sectionOf(warningAt([]))).toBeUndefined();
  });

  it.each([
    [["basics", "email"], true],
    [["basics", "location", "city"], true],
    [["basics", "profiles", 0, "url"], true],
    [["work", 1, "startDate"], true],
    [["education", 0, "endDate"], true],
    [["languages", 0, "fluency"], true],
    // Kept in the data, but left out of the form on purpose.
    [["basics", "location", "address"], false],
    [["basics", "profiles", 0, "username"], false],
    [["work", 0, "url"], false],
    [["education", 0, "score"], false],
    [["education", 0, "courses"], false],
    [["education", 0, "startDate"], false],
    [["skills", 0, "level"], false],
    [["projects", 0, "startDate"], false],
    [["basics", "image"], false],
    [["basics", "nickname"], false],
    [["basics", "custom", "theme"], false],
    [["basics", "location"], false],
    [["work", 0, "nickname"], false],
    [["work", 0, "location", "city"], false],
    [["work", 0, "highlights", 2], false],
    [["projects", 0, "roles"], false],
    [["volunteer", 0, "url"], false],
    [["custom", "foo"], false],
  ] as const)("%j has an input: %s", (path, expected) => {
    expect(hasInput(warningAt([...path]))).toBe(expected);
  });
});

describe("date picker", () => {
  it.each([
    ["2023", { year: 2023, month: undefined, day: undefined }],
    ["2023-09", { year: 2023, month: 9, day: undefined }],
    ["2023-09-15", { year: 2023, month: 9, day: 15 }],
    ["", undefined],
    ["Sept 2023", undefined],
    ["2023-13", undefined],
    [undefined, undefined],
  ])("parses %j", (value, expected) => {
    expect(parsePartialDate(value)).toEqual(expected);
  });

  it("focuses the selected month, else this month, else January", () => {
    const today = new Date(2026, 10, 2);
    expect(initialFocusMonth({ year: 2023, month: 9 }, 2023, today)).toBe(9);
    expect(initialFocusMonth({ year: 2023, month: 9 }, 2026, today)).toBe(11);
    expect(initialFocusMonth({ year: 2019 }, 2019, today)).toBe(1);
    expect(initialFocusMonth(undefined, 2026, today)).toBe(11);
    expect(initialFocusMonth(undefined, 2020, today)).toBe(1);
  });

  it("zero-pads the month", () => {
    expect(toMonthValue(2023, 9)).toBe("2023-09");
    expect(toMonthValue(2023, 12)).toBe("2023-12");
  });

  it.each([
    ["2023-09", "Sep 2023"],
    ["2019", "2019"],
    ["2023-09-15", "Sep 15, 2023"],
    ["2023-01", "Jan 2023"],
    ["Sept 2023", "Sept 2023"],
  ])("shows %s as %s", (value, display) => {
    expect(formatDisplayDate(value)).toBe(display);
  });
});

describe("helpers", () => {
  it("stores an emptied input as undefined", () => {
    expect(toOptionalText("")).toBeUndefined();
    expect(toOptionalText(" ")).toBe(" ");
    expect(toOptionalText("Ana")).toBe("Ana");
  });

  it.each([
    [{}, false],
    [{ name: "" }, false],
    [{ highlights: [""] }, false],
    [{ name: "   ", keywords: [] }, false],
    [{ location: { city: "Lima" } }, true],
    [{ highlights: ["", "Shipped it"] }, true],
    [{ custom: { rank: 1 } }, true],
  ])("%j has content: %s", (entry, expected) => {
    expect(hasContent(entry)).toBe(expected);
  });

  it("formats a structured location", () => {
    expect(
      formatLocation({ city: "Lima", region: " ", countryCode: "PE" }),
    ).toBe("Lima, PE");
    expect(formatLocation({})).toBe("");
  });

  it("titles an entry from its filled-in parts", () => {
    expect(entryTitle(["Developer", "Acme"], "New")).toBe("Developer · Acme");
    expect(entryTitle([undefined, "Acme"], "New")).toBe("Acme");
    expect(entryTitle(["", " "], "New")).toBe("New");
  });
});

describe("countries", () => {
  it("lists every ISO 3166-1 alpha-2 code once", () => {
    expect(COUNTRY_CODES).toHaveLength(249);
    expect(new Set(COUNTRY_CODES).size).toBe(COUNTRY_CODES.length);
  });

  it("names every code from offline browser data", () => {
    const unnamed = COUNTRY_CODES.filter(
      (code) => countryName(code, "en") === code,
    );
    expect(unnamed).toEqual([]);
  });

  it("names a code in the given locale, and keeps unknown codes", () => {
    expect(countryName("MX", "en")).toBe("Mexico");
    expect(countryName("MX", "es")).toBe("México");
    expect(countryName("QQ", "en")).toBe("QQ");
  });

  it("sorts countries by name", () => {
    const names = listCountries("en").map((country) => country.name);
    expect(names).toEqual(names.toSorted((a, b) => a.localeCompare(b, "en")));
    expect(names[0]).toBe("Afghanistan");
  });
});

describe("bullets", () => {
  it("finds the bullets that have text", () => {
    expect(filledBulletIndexes(["a", "", "  ", "b"])).toEqual([0, 3]);
    expect(filledBulletIndexes(["", " "])).toEqual([]);
  });

  it("splits a bullet at the caret", () => {
    expect(splitBullet(["Led the redesign Built it", "Other"], 0, 17)).toEqual([
      "Led the redesign",
      "Built it",
      "Other",
    ]);
  });

  it("adds an empty bullet when the caret is at the end", () => {
    expect(splitBullet(["Done"], 0, 4)).toEqual(["Done", ""]);
  });

  it("removes a bullet", () => {
    expect(removeItem(["a", "", "c"], 1)).toEqual(["a", "c"]);
  });
});

describe("withHttps", () => {
  it.each([
    ["diego.dev", "https://diego.dev"],
    ["linkedin.com/in/diego-ramirez", "https://linkedin.com/in/diego-ramirez"],
    ["www.example.com", "https://www.example.com"],
    ["https://diego.dev", "https://diego.dev"],
    ["http://old.example.com", "http://old.example.com"],
    ["mailto:diego@example.com", "mailto:diego@example.com"],
    ["not a url", "not a url"],
    ["localhost", "localhost"],
  ])("%s becomes %s", (value, expected) => {
    expect(withHttps(value)).toBe(expected);
  });
});

describe("moveMonth", () => {
  it.each([
    [2023, 5, "ArrowRight", { year: 2023, month: 6 }],
    [2023, 5, "ArrowLeft", { year: 2023, month: 4 }],
    [2023, 5, "ArrowDown", { year: 2023, month: 8 }],
    [2023, 5, "ArrowUp", { year: 2023, month: 2 }],
    [2023, 1, "ArrowLeft", { year: 2022, month: 12 }],
    [2023, 12, "ArrowRight", { year: 2024, month: 1 }],
    [2023, 2, "ArrowUp", { year: 2022, month: 11 }],
    [2023, 7, "Home", { year: 2023, month: 1 }],
    [2023, 7, "End", { year: 2023, month: 12 }],
    [2023, 7, "Tab", undefined],
    [1000, 1, "ArrowLeft", undefined],
  ])("%i-%i %s", (year, month, key, expected) => {
    expect(moveMonth(year, month, key)).toEqual(expected);
  });
});

describe("pasting bullets", () => {
  it("drops list markers and empty lines", () => {
    expect(
      toBulletLines(
        "• Shipped the app\n- Cut churn\n\n* Hired 3\n1. Led\n2) Ran",
      ),
    ).toEqual(["Shipped the app", "Cut churn", "Hired 3", "Led", "Ran"]);
  });

  it("keeps a hyphen that isn't a list marker", () => {
    expect(toBulletLines("Built a real-time dashboard")).toEqual([
      "Built a real-time dashboard",
    ]);
  });

  it("adds the pasted lines after a filled bullet", () => {
    const result = pasteBullets(
      ["Led the redesign", "Last"],
      0,
      { start: 16, end: 16 },
      "\n• Shipped the app\n- Cut churn",
    );
    expect(result).toEqual({
      items: ["Led the redesign", "Shipped the app", "Cut churn", "Last"],
      lastIndex: 2,
    });
  });

  it("fills an empty bullet with the first pasted line", () => {
    expect(pasteBullets([""], 0, { start: 0, end: 0 }, "• One\n• Two")).toEqual(
      { items: ["One", "Two"], lastIndex: 1 },
    );
  });

  it("keeps the text after the caret on the last pasted bullet", () => {
    expect(pasteBullets(["ab"], 0, { start: 1, end: 1 }, "x\ny").items).toEqual(
      ["ax", "yb"],
    );
  });
});

describe("keywords", () => {
  it("ignores case-insensitive duplicates and keeps the first spelling", () => {
    expect(
      addKeywords(["React"], ["react", "REACT", " Vue ", "vue", ""]),
    ).toEqual(["React", "Vue"]);
  });
});

describe("toTrimmedText", () => {
  it.each([
    ["  Ana  ", "Ana"],
    ["   ", undefined],
    ["", undefined],
    [undefined, undefined],
  ])("%j becomes %j", (value, expected) => {
    expect(toTrimmedText(value)).toBe(expected);
  });
});

describe("list keys", () => {
  it.each([
    [0, 2, ["b", "c", "a", "d"]],
    [3, 1, ["a", "d", "b", "c"]],
    [1, 0, ["b", "a", "c", "d"]],
    [2, 3, ["a", "b", "d", "c"]],
    [1, 1, ["a", "b", "c", "d"]],
    [0, 9, ["a", "b", "c", "d"]],
  ])("moves index %i to %i", (from, to, expected) => {
    const items = ["a", "b", "c", "d"];
    expect(moveItem(items, from, to)).toEqual(expected);
    expect(items).toEqual(["a", "b", "c", "d"]);
  });

  it("inserts items at the start, middle and end", () => {
    expect(insertItems(["a", "b"], 0, ["x"])).toEqual(["x", "a", "b"]);
    expect(insertItems(["a", "b"], 1, ["x", "y"])).toEqual([
      "a",
      "x",
      "y",
      "b",
    ]);
    expect(insertItems(["a", "b"], 2, [])).toEqual(["a", "b"]);
  });

  it("removes only the given index", () => {
    expect(removeItem(["a", "b", "c"], 0)).toEqual(["b", "c"]);
    expect(removeItem(["a", "b", "c"], 5)).toEqual(["a", "b", "c"]);
  });

  it("never repeats a key", () => {
    const keys = [...createKeys(3), ...createKeys(3)];
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("keeps keys that match the list and replaces keys that don't", () => {
    const keys = createKeys(2);
    expect(syncKeys(keys, 2)).toBe(keys);
    const replaced = syncKeys(keys, 3);
    expect(replaced).toHaveLength(3);
    expect(replaced.some((key) => keys.includes(key))).toBe(false);
  });

  it("adds one key per new bullet from a split or a paste", () => {
    const items = ["Led a team", "Shipped"];
    expect(splitBullet(items, 0, 3).length - items.length).toBe(1);
    const pasted = pasteBullets(items, 1, { start: 7, end: 7 }, "- One\n- Two");
    expect(pasted.items.length - items.length).toBe(2);
  });
});
