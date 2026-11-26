import { describe, expect, it } from "vitest";

import { CV_WORDS } from "#/features/templates/constants";
import {
  cleanList,
  displayUrl,
  formatDate,
  formatDateRange,
  formatList,
  formatPlace,
  formatYear,
} from "#/features/templates/format";

const EN = CV_WORDS.en;
const ES = CV_WORDS.es;

describe("formatDate", () => {
  it.each([
    ["2023", "2023"],
    ["2023-09", "Sep 2023"],
    ["2023-09-15", "Sep 2023"],
    ["2025-05", "May 2025"],
    ["", ""],
    [" Sept 2023 ", "Sept 2023"],
    [undefined, ""],
    [2030, "2030"],
    [{}, ""],
  ])("formats %j", (value, expected) => {
    expect(formatDate(value, EN.locale)).toBe(expected);
  });

  it("writes Spanish month names", () => {
    expect(formatDate("2023-09", ES.locale)).toBe("sept 2023");
    expect(formatDate("2024-01", ES.locale)).toBe("ene 2024");
  });

  it("keeps month names apart by language", () => {
    expect(formatDate("2023-09", EN.locale)).toBe("Sep 2023");
    expect(formatDate("2023-09", ES.locale)).toBe("sept 2023");
    expect(formatDate("2023-09", EN.locale)).toBe("Sep 2023");
  });
});

describe("formatYear", () => {
  it.each([
    ["2024-06", "2024"],
    ["2024", "2024"],
    ["soon", "soon"],
    [undefined, ""],
  ])("formats %j", (value, expected) => {
    expect(formatYear(value)).toBe(expected);
  });
});

describe("formatDateRange", () => {
  it.each([
    ["2023-09", "2025-05", "Sep 2023 - May 2025"],
    ["2025-05", undefined, "May 2025 - Present"],
    ["2025-05", "", "May 2025 - Present"],
    [undefined, "2025-05", "May 2025"],
    [undefined, undefined, ""],
  ])("formats %j to %j", (start, end, expected) => {
    expect(formatDateRange(start, end, EN)).toBe(expected);
  });

  it("writes an open range in Spanish", () => {
    expect(formatDateRange("2022-02", undefined, ES)).toBe(
      "feb 2022 - actualidad",
    );
  });
});

describe("formatPlace", () => {
  it("joins city, region and the country name", () => {
    expect(
      formatPlace(
        {
          address: "100 Example Street",
          postalCode: "94000",
          city: "Sample City",
          region: "California",
          countryCode: "US",
        },
        EN.locale,
      ),
    ).toBe("Sample City, California, United States");
  });

  it("skips empty parts", () => {
    expect(formatPlace({ city: " ", countryCode: "HN" }, EN.locale)).toBe(
      "Honduras",
    );
  });

  it("names the country in the CV language", () => {
    expect(formatPlace({ city: "Logroño", countryCode: "ES" }, ES.locale)).toBe(
      "Logroño, España",
    );
  });

  it("keeps text locations as typed", () => {
    expect(formatPlace(" Remote ", EN.locale)).toBe("Remote");
    expect(formatPlace(undefined, EN.locale)).toBe("");
  });
});

describe("displayUrl", () => {
  it.each([
    ["https://www.linkedin.com/in/johndoe/", "www.linkedin.com/in/johndoe"],
    ["http://example.org", "example.org"],
    ["example.org/path", "example.org/path"],
    [undefined, ""],
  ])("shows %j as %j", (url, expected) => {
    expect(displayUrl(url)).toBe(expected);
  });
});

describe("lists", () => {
  it("drops empty items and adds no final period", () => {
    expect(formatList(["React", " ", " Git "])).toBe("React, Git");
    expect(cleanList("React")).toEqual([]);
  });
});
