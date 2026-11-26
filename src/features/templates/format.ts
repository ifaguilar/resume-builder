import type { CvWords } from "#/features/languages/constants";
import { countryName } from "#/features/languages/countries";
import { parsePartialDate } from "#/features/resume/partial-date";
import type { Location } from "#/features/resume/resume-schema";
import { cleanText } from "#/features/resume/stored-value";
import {
  DATE_RANGE_SEPARATOR,
  LIST_SEPARATOR,
  PLACE_SEPARATOR,
} from "#/features/templates/constants";
import { isRecord } from "#/shared/lib/is-record";

const URL_SCHEME = /^https?:\/\//i;
const TRAILING_SLASH = /\/$/;
const FIRST_DAY = 1;

// Formatting a Temporal date through Intl is slow, so dates are cached.
const monthDates = new Map<string, string>();

// Month and year together: a month alone gets its stand-alone form, which in
// German is "Mär" and "Jun" instead of "März 2024" and "Juni 2024".
function monthDate(year: number, month: number, locale: string): string {
  const key = `${locale}-${year}-${month}`;
  const cached = monthDates.get(key);
  if (cached !== undefined) return cached;
  const text = Temporal.PlainDate.from({
    year,
    month,
    day: FIRST_DAY,
  }).toLocaleString(locale, { month: "short", year: "numeric" });
  monthDates.set(key, text);
  return text;
}

export function formatDate(value: unknown, locale: string): string {
  const text = cleanText(value);
  const date = parsePartialDate(text);
  if (date === undefined) return text;
  if (date.month === undefined) return String(date.year);
  return monthDate(date.year, date.month, locale);
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
  if (!isRecord(location)) return cleanText(location);
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
