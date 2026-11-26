import { describe, expect, it } from "vitest";

import {
  cleanText,
  entriesOf,
  isBlankText,
  isListOrMissing,
  isRecordOrMissing,
  listValue,
  textValue,
} from "#/features/resume/stored-value";

const WRONG_TYPES = [true, null, {}, ["a"]];

describe("textValue", () => {
  it("keeps text as typed and reads numbers as text", () => {
    expect(textValue(" Acme ")).toBe(" Acme ");
    expect(textValue(2030)).toBe("2030");
    expect(textValue(undefined)).toBe("");
  });

  it.each(WRONG_TYPES)("reads %j as nothing", (value) => {
    expect(textValue(value)).toBe("");
  });
});

describe("cleanText", () => {
  it("trims text and numbers", () => {
    expect(cleanText(" Acme ")).toBe("Acme");
    expect(cleanText(42)).toBe("42");
    expect(cleanText({})).toBe("");
  });
});

describe("listValue", () => {
  it("keeps arrays and reads anything else as empty", () => {
    expect(listValue([1, "a"])).toEqual([1, "a"]);
    expect(listValue("a, b")).toEqual([]);
    expect(listValue({})).toEqual([]);
    expect(listValue(undefined)).toEqual([]);
  });
});

describe("entriesOf", () => {
  it("keeps only object entries", () => {
    const entries: { name: string }[] = JSON.parse(
      '[{ "name": "A" }, null, "text", 5, ["x"], { "name": "B" }]',
    );
    const notAList: { name: string }[] = JSON.parse("{}");
    expect(entriesOf(entries)).toEqual([{ name: "A" }, { name: "B" }]);
    expect(entriesOf(notAList)).toEqual([]);
    expect(entriesOf(undefined)).toEqual([]);
  });
});

describe("isListOrMissing", () => {
  it.each([
    [undefined, true],
    [[], true],
    [["a"], true],
    ["a", false],
    [{}, false],
    [null, false],
    [5, false],
  ])("%j → %j", (value, expected) => {
    expect(isListOrMissing(value)).toBe(expected);
  });
});

describe("isRecordOrMissing", () => {
  it.each([
    [undefined, true],
    [{}, true],
    [{ name: "A" }, true],
    [null, false],
    ["text", false],
    [[], false],
    [5, false],
  ])("%j → %j", (value, expected) => {
    expect(isRecordOrMissing(value)).toBe(expected);
  });
});

describe("isBlankText", () => {
  it.each([
    ["", true],
    ["  ", true],
    ["a", false],
    [0, false],
    [{}, false],
    [null, false],
    [undefined, false],
  ])("%j → %j", (value, expected) => {
    expect(isBlankText(value)).toBe(expected);
  });
});
