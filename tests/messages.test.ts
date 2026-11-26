import { describe, expect, it } from "vitest";

import { locales } from "#/paraglide/runtime.js";
import { isRecord } from "#/shared/lib/is-record";

const SCHEMA_KEY = "$schema";
const PARAMETER = /\{(\w+)\}/g;
const INPUT_DECLARATION = /^input (\w+)$/;

const catalogs = import.meta.glob<Record<string, unknown>>(
  "/src/features/languages/messages/*.json",
  { eager: true, import: "default" },
);

function catalog(locale: string): Record<string, unknown> {
  const messages = catalogs[`/src/features/languages/messages/${locale}.json`];
  if (!messages) throw new Error(`No catalog for ${locale}`);
  return messages;
}

function keys(locale: string): string[] {
  return Object.keys(catalog(locale))
    .filter((key) => key !== SCHEMA_KEY)
    .toSorted();
}

// A message is a string, or a list of variants whose inputs are declared.
function parameters(message: unknown): string[] {
  const names = new Set<string>();
  const texts: string[] = [];
  if (typeof message === "string") texts.push(message);
  if (Array.isArray(message)) {
    for (const variant of message) {
      if (!isRecord(variant)) continue;
      const { declarations, match } = variant;
      for (const declaration of Array.isArray(declarations)
        ? declarations
        : []) {
        const input = INPUT_DECLARATION.exec(String(declaration))?.[1];
        if (input) names.add(input);
      }
      if (isRecord(match)) texts.push(...Object.values(match).map(String));
    }
  }
  for (const text of texts) {
    for (const match of text.matchAll(PARAMETER)) {
      if (match[1]) names.add(match[1]);
    }
  }
  return [...names].toSorted();
}

const BASE_LOCALE = "en";
const otherLocales = locales.filter((locale) => locale !== BASE_LOCALE);

describe("message catalogs", () => {
  it.each(otherLocales)("%s has the same keys as English", (locale) => {
    expect(keys(locale)).toEqual(keys(BASE_LOCALE));
  });

  it.each(otherLocales)("%s uses the same parameters as English", (locale) => {
    const english = catalog(BASE_LOCALE);
    const translated = catalog(locale);
    const mismatches = keys(BASE_LOCALE).filter(
      (key) =>
        parameters(translated[key]).join() !== parameters(english[key]).join(),
    );
    expect(mismatches).toEqual([]);
  });
});
