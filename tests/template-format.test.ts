import { describe, expect, it } from "vitest";

import {
  cleanList,
  displayUrl,
  formatDate,
  formatDateRange,
  formatList,
  formatPlace,
  formatYear,
} from "#/features/templates/format";

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
    expect(formatDate(value)).toBe(expected);
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
    expect(formatDateRange(start, end)).toBe(expected);
  });
});

describe("formatPlace", () => {
  it("joins city, region and the country name", () => {
    expect(
      formatPlace({
        address: "100 Example Street",
        postalCode: "94000",
        city: "Sample City",
        region: "California",
        countryCode: "US",
      }),
    ).toBe("Sample City, California, United States");
  });

  it("skips empty parts", () => {
    expect(formatPlace({ city: " ", countryCode: "HN" })).toBe("Honduras");
  });

  it("keeps text locations as typed", () => {
    expect(formatPlace(" Remote ")).toBe("Remote");
    expect(formatPlace(undefined)).toBe("");
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
