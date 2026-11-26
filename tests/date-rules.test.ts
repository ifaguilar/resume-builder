import { describe, expect, it } from "vitest";

import { WARNING_MESSAGES } from "#/features/resume/constants";
import {
  compareDates,
  isRealCalendarDate,
  parsePartialDate,
} from "#/features/resume/partial-date";
import { validateResume } from "#/features/resume/validate-resume";

const TODAY = Temporal.PlainDate.from({ year: 2026, month: 11, day: 21 });

function warningsOf(input: unknown) {
  return validateResume(input, { today: TODAY }).warnings;
}

function future(path: (string | number)[]) {
  return { path, message: WARNING_MESSAGES.futureDate() };
}

function endBeforeStart(section: string, index: number) {
  return {
    path: [section, index, "endDate"],
    message: WARNING_MESSAGES.endBeforeStart(),
  };
}

describe("parsePartialDate", () => {
  it.each([
    ["2023", { year: 2023, month: undefined, day: undefined }],
    ["2023-09", { year: 2023, month: 9, day: undefined }],
    ["2023-09-15", { year: 2023, month: 9, day: 15 }],
    ["", undefined],
    ["Sept 2023", undefined],
    ["2023-13", undefined],
    [undefined, undefined],
    [2030, { year: 2030, month: undefined, day: undefined }],
    [{ year: 2020 }, undefined],
    [null, undefined],
  ])("parses %j", (value, expected) => {
    expect(parsePartialDate(value)).toEqual(expected);
  });
});

describe("isRealCalendarDate", () => {
  it.each([
    ["2024-02-29", true],
    ["2023-02-28", true],
    ["2023", true],
    ["2023-09", true],
    ["2023-02-29", false],
    ["2023-02-30", false],
    ["2023-04-31", false],
  ])("%s is %j", (value, expected) => {
    expect(isRealCalendarDate(value)).toBe(expected);
  });
});

describe("compareDates", () => {
  it.each([
    [{ year: 2024 }, { year: 2023 }, 1],
    [{ year: 2024, month: 3 }, { year: 2024, month: 5 }, -1],
    [{ year: 2024 }, { year: 2024, month: 5 }, 0],
    [{ year: 2024, month: 5 }, { year: 2024, month: 5, day: 9 }, 0],
    [{ year: 2024, month: 5, day: 2 }, { year: 2024, month: 5, day: 9 }, -1],
  ])("%j vs %j is %i", (a, b, expected) => {
    expect(compareDates(a, b)).toBe(expected);
  });
});

describe("future dates", () => {
  it.each(["2026", "2026-11", "2026-11-30", "2025-12", "2010"])(
    "accepts the work date %s",
    (startDate) => {
      expect(warningsOf({ work: [{ startDate }] })).toEqual([]);
    },
  );

  it.each(["2026-12", "2026-12-01", "2027", "2031-05"])(
    "warns about the work date %s",
    (startDate) => {
      expect(warningsOf({ work: [{ startDate }] })).toEqual([
        future(["work", 0, "startDate"]),
      ]);
    },
  );

  it("checks work and project start and end dates", () => {
    const resume = {
      work: [{ startDate: "2025-01", endDate: "2027-01" }],
      projects: [{}, { startDate: "2027-02", endDate: "2027-03" }],
    };
    expect(warningsOf(resume)).toEqual([
      future(["work", 0, "endDate"]),
      future(["projects", 1, "startDate"]),
      future(["projects", 1, "endDate"]),
    ]);
  });

  it("allows an expected graduation date but not a future start", () => {
    const resume = {
      education: [
        { startDate: "2024-09", endDate: "2028-06" },
        { startDate: "2027-09", endDate: "2031-06" },
      ],
    };
    expect(warningsOf(resume)).toEqual([future(["education", 1, "startDate"])]);
  });

  it("ignores sections the form doesn't edit", () => {
    const resume = {
      volunteer: [{ startDate: "2030" }],
      awards: [{ date: "2030" }],
      certificates: [{ expiryDate: "2030" }],
    };
    expect(warningsOf(resume)).toEqual([]);
  });
});

describe("end date before start date", () => {
  it("warns on the end date", () => {
    const resume = {
      work: [{ startDate: "2024-05", endDate: "2023-01" }],
      education: [{ startDate: "2020", endDate: "2019" }],
      projects: [{ startDate: "2024-05-10", endDate: "2024-05-02" }],
    };
    expect(warningsOf(resume)).toEqual([
      endBeforeStart("work", 0),
      endBeforeStart("education", 0),
      endBeforeStart("projects", 0),
    ]);
  });

  it.each([
    ["2024", "2024-03"],
    ["2024-03", "2024"],
    ["2024-03", "2024-03"],
    ["2024-03", undefined],
    ["2024-03", ""],
    [undefined, "2020"],
  ])("accepts %j to %j", (startDate, endDate) => {
    expect(warningsOf({ work: [{ startDate, endDate }] })).toEqual([]);
  });

  it("can warn twice about one end date", () => {
    expect(
      warningsOf({ work: [{ startDate: "2028", endDate: "2027" }] }),
    ).toEqual([
      future(["work", 0, "startDate"]),
      future(["work", 0, "endDate"]),
      endBeforeStart("work", 0),
    ]);
  });
});

function tooOld(path: (string | number)[]) {
  return { path, message: WARNING_MESSAGES.dateTooOld() };
}

function tooFar(path: (string | number)[]) {
  return { path, message: WARNING_MESSAGES.dateTooFar() };
}

describe("dates more than 100 years away", () => {
  it("accepts the edges of the range", () => {
    const resume = {
      work: [{ startDate: "1926-01" }],
      education: [{ startDate: "1926", endDate: "2126-12" }],
    };
    expect(warningsOf(resume)).toEqual([]);
  });

  it("warns about dates outside the range", () => {
    const resume = {
      work: [{ startDate: "1925-12" }, { startDate: "1023-05" }],
      education: [{ startDate: "2020", endDate: "2127" }],
    };
    expect(warningsOf(resume)).toEqual([
      tooOld(["work", 0, "startDate"]),
      tooOld(["work", 1, "startDate"]),
      tooFar(["education", 0, "endDate"]),
    ]);
  });

  it("says only that a date is out of range", () => {
    const resume = {
      work: [
        { startDate: "2203-01" },
        { startDate: "2023-01", endDate: "1023-01" },
      ],
    };
    expect(warningsOf(resume)).toEqual([
      tooFar(["work", 0, "startDate"]),
      tooOld(["work", 1, "endDate"]),
    ]);
  });

  it("ignores sections the form doesn't edit", () => {
    expect(warningsOf({ volunteer: [{ startDate: "1023" }] })).toEqual([]);
  });
});

describe("malformed input", () => {
  it("leaves malformed and nonexistent dates to the format warnings", () => {
    expect(
      warningsOf({ work: [{ startDate: "2030-13", endDate: "2023-02-30" }] }),
    ).toEqual([
      { path: ["work", 0, "startDate"], message: WARNING_MESSAGES.date() },
      {
        path: ["work", 0, "endDate"],
        message: WARNING_MESSAGES.nonexistentDate(),
      },
    ]);
  });

  it.each([
    { work: "not a list" },
    { work: [null, "job", 1] },
    { work: [{ startDate: 2030 }] },
  ])("doesn't add date warnings for %j", (input) => {
    expect(
      warningsOf(input).filter(
        (warning) =>
          warning.message === WARNING_MESSAGES.futureDate() ||
          warning.message === WARNING_MESSAGES.endBeforeStart() ||
          warning.message === WARNING_MESSAGES.dateTooOld() ||
          warning.message === WARNING_MESSAGES.dateTooFar(),
      ),
    ).toEqual([]);
  });
});
