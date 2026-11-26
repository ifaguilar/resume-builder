import { describe, expect, it } from "vitest";

import type { Resume } from "#/features/resume/resume-schema";
import {
  cvLanguage,
  documentWord,
  unsupportedCvLanguage,
} from "#/features/templates/cv-language";

describe("cvLanguage", () => {
  it.each([
    [undefined, "en"],
    ["", "en"],
    ["en", "en"],
    ["en-GB", "en"],
    ["es", "es"],
    ["es-MX", "es"],
    [" ES ", "es"],
    ["fr", "en"],
  ])("reads %j as %s", (language, expected) => {
    expect(cvLanguage({ meta: { language } })).toBe(expected);
  });

  it("is English without meta or with a value that isn't text", () => {
    expect(cvLanguage({})).toBe("en");
    const imported: Resume = JSON.parse('{ "meta": { "language": 42 } }');
    expect(cvLanguage(imported)).toBe("en");
  });
});

describe("unsupportedCvLanguage", () => {
  it.each([
    [undefined, undefined],
    ["", undefined],
    ["en", undefined],
    ["es-419", undefined],
    ["fr", "fr"],
    [" pt-BR ", "pt-BR"],
  ])("reports %j as %j", (language, expected) => {
    expect(unsupportedCvLanguage({ meta: { language } })).toBe(expected);
  });
});

describe("documentWord", () => {
  it.each([
    ["en", "LETTER", "Resume"],
    ["en", "A4", "CV"],
    ["es", "LETTER", "CV"],
    ["es", "A4", "CV"],
  ] as const)("%s on %s is a %s", (language, pageSize, expected) => {
    expect(documentWord(language, pageSize)).toBe(expected);
  });
});
