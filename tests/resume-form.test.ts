import { describe, expect, it } from "vitest";

import {
  COUNTRY_CODES,
  countryName,
  listCountries,
} from "#/features/languages/countries";
import { ENTRY_TITLE_SEPARATOR } from "#/features/resume-form/constants";
import { entryTitle } from "#/features/resume-form/entry-title";
import {
  filledBulletIndexes,
  pasteBullets,
  splitBullet,
  toBulletLines,
} from "#/features/resume-form/fields/bullet-list";
import { commitIfChanged } from "#/features/resume-form/fields/commit-if-changed";
import {
  formatDisplayDate,
  formatLongMonthYear,
  formatShortMonth,
  initialFocusMonth,
  moveMonth,
  moveYear,
  toMonthValue,
  yearPageStart,
} from "#/features/resume-form/fields/date-picker-utils";
import {
  addKeywords,
  replaceKeyword,
} from "#/features/resume-form/fields/keyword-list";
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
import { toOptionalText } from "#/features/resume-form/to-optional-text";
import { hasInput, sectionOf } from "#/features/resume-form/warning-paths";
import { withHttps } from "#/features/resume-form/with-https";
import { WARNING_MESSAGES } from "#/features/resume/constants";
import { formatLocation } from "#/features/resume/format-location";
import type { Resume } from "#/features/resume/resume-schema";
import { m } from "#/paraglide/messages.js";

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
      "basics.email": [{ message: WARNING_MESSAGES.email() }],
      "work[1].startDate": [{ message: WARNING_MESSAGES.date() }],
    });
    expect(result?.form).toEqual([
      { path: ["basics", "email"], message: WARNING_MESSAGES.email() },
      { path: ["work", 1, "startDate"], message: WARNING_MESSAGES.date() },
    ]);
  });

  it("keeps every warning when one field has several", () => {
    // Fails both the format check and the real-calendar check.
    const value: Resume = { work: [{ startDate: "2023-13-45" }] };
    const result = resumeWarningsValidator({ value });

    expect(result?.fields["work[0].startDate"]).toEqual([
      { message: WARNING_MESSAGES.date() },
      { message: WARNING_MESSAGES.nonexistentDate() },
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
  it("focuses the selected month, else this month, else January", () => {
    const today = Temporal.PlainDate.from({ year: 2026, month: 11, day: 2 });
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

  it("names each month in the grid", () => {
    expect(formatShortMonth(5)).toBe("May");
    expect(formatShortMonth(12)).toBe("Dec");
    expect(formatLongMonthYear(2023, 9)).toBe("September 2023");
    expect(formatLongMonthYear(1999, 1)).toBe("January 1999");
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

  it("keeps a code that isn't a region as typed", () => {
    expect(countryName("Spain", "en")).toBe("Spain");
    expect(countryName("34", "en")).toBe("34");
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

  it("stops at the last year allowed", () => {
    const bounds = { maxYear: 2026 };
    expect(moveMonth(2026, 12, "ArrowRight", bounds)).toBeUndefined();
    expect(moveMonth(2026, 11, "ArrowDown", bounds)).toBeUndefined();
    expect(moveMonth(2026, 8, "ArrowDown", bounds)).toEqual({
      year: 2026,
      month: 11,
    });
  });

  it("stops at the first year allowed", () => {
    const bounds = { minYear: 1926 };
    expect(moveMonth(1926, 1, "ArrowLeft", bounds)).toBeUndefined();
    expect(moveMonth(1926, 2, "ArrowUp", bounds)).toBeUndefined();
    expect(moveMonth(1926, 5, "ArrowUp", bounds)).toEqual({
      year: 1926,
      month: 2,
    });
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

  it.each([
    ["an edit in place", 1, "Redis", ["Go", "Redis", "SQL"], 1],
    ["a comma split in place", 1, "Rust, Zig", ["Go", "Rust", "Zig", "SQL"], 2],
    ["a repeat of another keyword", 1, " sql ", ["Go", "SQL"], 0],
    ["a cleared keyword", 1, "  ", ["Go", "SQL"], 0],
    ["a new case of itself", 1, "RUST", ["Go", "RUST", "SQL"], 1],
    [
      "a split with a repeat",
      0,
      "Go, sql, Kotlin",
      ["Go", "Kotlin", "Rust", "SQL"],
      2,
    ],
  ])("replaces with %s", (_, index, text, items, count) => {
    expect(replaceKeyword(["Go", "Rust", "SQL"], index, text)).toEqual({
      items,
      count,
    });
  });
});

describe("yearPageStart", () => {
  it.each([
    [2026, 2015],
    [2015, 2015],
    [2014, 2003],
    [2027, 2027],
    [2038, 2027],
    [1926, 1919],
  ])("puts %i on the page starting at %i", (year, start) => {
    expect(yearPageStart(year, 2026)).toBe(start);
  });
});

describe("moveYear", () => {
  const bounds = { anchorYear: 2026, minYear: 1926, maxYear: 2026 };

  it.each([
    [2020, "ArrowRight", 2021],
    [2020, "ArrowLeft", 2019],
    [2020, "ArrowDown", 2023],
    [2020, "ArrowUp", 2017],
    [2015, "ArrowLeft", 2014],
    [2016, "ArrowUp", 2013],
    [2020, "Home", 2015],
    [2020, "End", 2026],
    [2026, "ArrowRight", 2026],
    [2025, "ArrowDown", 2026],
    [1927, "ArrowUp", 1926],
    [2020, "Tab", undefined],
  ])("%i %s", (year, key, expected) => {
    expect(moveYear(year, key, bounds)).toBe(expected);
  });
});

// What a text field holds after leaving it, and whether anything was written.
function leave(value: unknown, transform?: (text: string) => string) {
  const field = {
    state: { value },
    handleChange(next: string | undefined) {
      field.state.value = next;
      writes += 1;
    },
  };
  let writes = 0;
  commitIfChanged(field, transform);
  return { value: field.state.value, writes };
}

describe("commitIfChanged", () => {
  it.each([
    ["  Ana  ", "Ana", 1],
    ["Ana", "Ana", 0],
    ["   ", undefined, 1],
    ["", undefined, 1],
    [undefined, undefined, 0],
  ])("%j becomes %j", (value, expected, writes) => {
    expect(leave(value)).toEqual({ value: expected, writes });
  });

  it.each([42, { city: "Madrid" }, null, true])(
    "keeps %j as stored",
    (value) => {
      expect(leave(value)).toEqual({ value, writes: 0 });
    },
  );

  it("applies the transform to edited text only", () => {
    expect(leave(" example.com ", withHttps).value).toBe("https://example.com");
    expect(leave("   ", withHttps).value).toBeUndefined();
    expect(leave(42, withHttps)).toEqual({ value: 42, writes: 0 });
  });
});

describe("values of the wrong type in lists", () => {
  // Read the way an imported file is read, so no type is asserted.
  const items: string[] = JSON.parse('["Lead", 5, {}, null, "  ", ""]');

  it("titles an entry with numbers as typed", () => {
    expect(entryTitle([42, " Acme "], "Untitled")).toBe(
      ["42", "Acme"].join(ENTRY_TITLE_SEPARATOR),
    );
    expect(entryTitle([{}, null], "Untitled")).toBe("Untitled");
  });

  it("drops only blank text bullets", () => {
    expect(filledBulletIndexes(items)).toEqual([0, 1, 2, 3]);
  });

  it("splits a number bullet as text", () => {
    const numbers: string[] = JSON.parse("[2030]");
    expect(splitBullet(numbers, 0, 2)).toEqual(["20", "30"]);
  });

  it("adds keywords next to items of the wrong type, keeping them", () => {
    const keywords: string[] = JSON.parse('[1, {}, "Git"]');
    expect(addKeywords(keywords, ["1", "git", "Docker"])).toEqual([
      1,
      {},
      "Git",
      "Docker",
    ]);
    expect(replaceKeyword(keywords, 2, "Git, Docker")).toEqual({
      items: [1, {}, "Git", "Docker"],
      count: 2,
    });
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

describe("form_warning_count", () => {
  it.each([
    [0, "0 warnings"],
    [1, "1 warning"],
    [2, "2 warnings"],
  ])("writes %i as %s", (count, text) => {
    expect(m.form_warning_count({ count })).toBe(text);
  });
});
