import { countryName } from "#/features/resume/countries";
import { parsePartialDate } from "#/features/resume/partial-date";
import type { Location } from "#/features/resume/resume-schema";
import {
  type CvWords,
  DATE_RANGE_SEPARATOR,
  LIST_SEPARATOR,
  PLACE_SEPARATOR,
} from "#/features/templates/constants";

const URL_SCHEME = /^https?:\/\//i;
const TRAILING_SLASH = /\/$/;
const FIRST_DAY = 1;

// Imported drafts can hold values of the wrong type. Numbers (like a year
// typed as 2030) render as typed; anything else renders as nothing instead of
// breaking the whole preview.
export function cleanText(value: unknown): string {
  if (typeof value === "number") return String(value);
  return typeof value === "string" ? value.trim() : "";
}

// Formatting a Temporal date through Intl is slow, so names are cached.
const monthNames = new Map<string, string>();

function monthName(year: number, month: number, locale: string): string {
  const key = `${locale}-${month}`;
  const cached = monthNames.get(key);
  if (cached !== undefined) return cached;
  const name = Temporal.PlainDate.from({
    year,
    month,
    day: FIRST_DAY,
  }).toLocaleString(locale, { month: "short" });
  monthNames.set(key, name);
  return name;
}

export function formatDate(value: unknown, locale: string): string {
  const text = cleanText(value);
  const date = parsePartialDate(text);
  if (date === undefined) return text;
  if (date.month === undefined) return String(date.year);
  return `${monthName(date.year, date.month, locale)} ${date.year}`;
}

export function formatYear(value: unknown): string {
  const text = cleanText(value);
  const date = parsePartialDate(text);
  return date === undefined ? text : String(date.year);
}

export function formatDateRange(
  start: unknown,
  end: unknown,
  words: CvWords,
): string {
  const from = formatDate(start, words.locale);
  const to = formatDate(end, words.locale);
  if (from === "") return to;
  return [from, to === "" ? words.present : to].join(DATE_RANGE_SEPARATOR);
}

// Street address and postal code stay off the CV on purpose.
export function formatPlace(
  location: Location | string | undefined,
  locale: string,
): string {
  if (typeof location === "string") return location.trim();
  if (typeof location !== "object") return "";
  const code = cleanText(location.countryCode);
  return [
    cleanText(location.city),
    cleanText(location.region),
    code === "" ? "" : countryName(code, locale),
  ]
    .filter((part) => part !== "")
    .join(PLACE_SEPARATOR);
}

export function displayUrl(url: unknown): string {
  return cleanText(url).replace(URL_SCHEME, "").replace(TRAILING_SLASH, "");
}

export function cleanList(items: unknown): string[] {
  if (!Array.isArray(items)) return [];
  return items.map(cleanText).filter((item) => item !== "");
}

export function formatList(items: unknown): string {
  return cleanList(items).join(LIST_SEPARATOR);
}
