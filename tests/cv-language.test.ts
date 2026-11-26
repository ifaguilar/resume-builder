import { describe, expect, it } from "vitest";

import { CV_LANGUAGES, CV_WORDS } from "#/features/languages/constants";
import {
  cvLanguage,
  cvLanguageSample,
  documentWord,
  languageName,
  unsupportedCvLanguage,
} from "#/features/languages/cv-language";
import type { Resume } from "#/features/resume/resume-schema";

describe("cvLanguage", () => {
  it.each([
    [undefined, "en"],
    ["", "en"],
    ["en", "en"],
    ["en-GB", "en"],
    ["es", "es"],
    ["es-MX", "es"],
    [" ES ", "es"],
    ["fr", "fr"],
    ["fr-CA", "fr"],
    ["de", "de"],
    ["de-AT", "de"],
    ["pt-BR", "en"],
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
    ["fr", undefined],
    ["de-CH", undefined],
    ["it", "it"],
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
    ["fr", "LETTER", "CV"],
    ["fr", "A4", "CV"],
    ["de", "LETTER", "Lebenslauf"],
    ["de", "A4", "Lebenslauf"],
  ] as const)("%s on %s is a %s", (language, pageSize, expected) => {
    expect(documentWord(language, pageSize)).toBe(expected);
  });
});

describe("languageName", () => {
  it.each([
    ["en", "English"],
    ["es", "Español"],
    ["fr", "Français"],
    ["de", "Deutsch"],
  ] as const)("names %s as %s", (language, expected) => {
    expect(languageName(language)).toBe(expected);
  });
});

describe("cvLanguageSample", () => {
  it.each([
    ["en", "Work Experience · Sep 2023 - Present"],
    ["es", "Experiencia laboral · sept 2023 - actualidad"],
    ["fr", "Expérience professionnelle · sept. 2023 - aujourd'hui"],
    ["de", "Berufserfahrung · Sept. 2023 - heute"],
  ] as const)("writes %s as %s", (language, expected) => {
    expect(cvLanguageSample(language)).toBe(expected);
  });
});

describe("CV languages", () => {
  it("has CV words for every language in project.inlang", () => {
    expect(Object.keys(CV_WORDS)).toEqual([...CV_LANGUAGES]);
  });
});
