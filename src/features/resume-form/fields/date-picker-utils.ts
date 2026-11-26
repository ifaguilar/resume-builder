import {
  ARROW_DOWN_KEY,
  ARROW_LEFT_KEY,
  ARROW_RIGHT_KEY,
  ARROW_UP_KEY,
  END_KEY,
  HOME_KEY,
  MAX_PICKER_YEAR,
  MIN_PICKER_YEAR,
  MONTH_DIGITS,
  MONTH_GRID_COLUMNS,
  MONTH_NAMES_REFERENCE_YEAR,
  MONTHS_PER_YEAR,
  YEAR_GRID_COLUMNS,
  YEARS_PER_PAGE,
} from "#/features/resume-form/constants";
import { DATE_PART_SEPARATOR } from "#/features/resume/constants";
import {
  type PartialDate,
  parsePartialDate,
} from "#/features/resume/partial-date";
import { getLocale } from "#/paraglide/runtime.js";

const shortMonthNames = new Map<string, readonly string[]>();
const formattedDates = new Map<string, string>();

// Formatting a Temporal date with Intl is slow (tens of µs), so every result
// is kept. Intl can't format a PlainYearMonth without an explicit calendar,
// hence the day.
function shortMonthName(month: number): string {
  const locale = getLocale();
  let names = shortMonthNames.get(locale);
  if (!names) {
    names = Array.from({ length: MONTHS_PER_YEAR }, (_, index) =>
      Temporal.PlainDate.from({
        year: MONTH_NAMES_REFERENCE_YEAR,
        month: index + 1,
        day: 1,
      }).toLocaleString(locale, { month: "short" }),
    );
    shortMonthNames.set(locale, names);
  }
  return names[month - 1] ?? String(month);
}

// The UI language decides the word order and joiners: "September 2023",
// "septiembre de 2023", "5. Sept. 2023".
function formatDate(
  date: { year: number; month: number; day?: number },
  monthWidth: "short" | "long",
): string {
  const locale = getLocale();
  const key = `${locale} ${monthWidth} ${date.year}-${date.month}-${date.day ?? ""}`;
  let text = formattedDates.get(key);
  if (text === undefined) {
    text = Temporal.PlainDate.from({
      ...date,
      day: date.day ?? 1,
    }).toLocaleString(
      locale,
      date.day === undefined
        ? { year: "numeric", month: monthWidth }
        : { year: "numeric", month: monthWidth, day: "numeric" },
    );
    formattedDates.set(key, text);
  }
  return text;
}

export function initialFocusMonth(
  date: PartialDate | undefined,
  shownYear: number,
  today: Temporal.PlainDate,
): number {
  if (date?.year === shownYear && date.month !== undefined) return date.month;
  if (today.year === shownYear) return today.month;
  return 1;
}

const MONTH_STEP_BY_KEY: Record<string, number> = {
  [ARROW_LEFT_KEY]: -1,
  [ARROW_RIGHT_KEY]: 1,
  [ARROW_UP_KEY]: -MONTH_GRID_COLUMNS,
  [ARROW_DOWN_KEY]: MONTH_GRID_COLUMNS,
};

export function moveMonth(
  year: number,
  month: number,
  key: string,
  {
    minYear = MIN_PICKER_YEAR,
    maxYear = MAX_PICKER_YEAR,
  }: { minYear?: number; maxYear?: number } = {},
): { year: number; month: number } | undefined {
  if (key === HOME_KEY) return { year, month: 1 };
  if (key === END_KEY) return { year, month: MONTHS_PER_YEAR };
  const step = MONTH_STEP_BY_KEY[key];
  if (step === undefined) return undefined;
  const index = year * MONTHS_PER_YEAR + (month - 1) + step;
  const next = {
    year: Math.floor(index / MONTHS_PER_YEAR),
    month: (index % MONTHS_PER_YEAR) + 1,
  };
  if (next.year < minYear || next.year > maxYear) {
    return undefined;
  }
  return next;
}

export function toMonthValue(year: number, month: number): string {
  const paddedMonth = String(month).padStart(MONTH_DIGITS, "0");
  return `${year}${DATE_PART_SEPARATOR}${paddedMonth}`;
}

export function formatShortMonth(month: number): string {
  return shortMonthName(month);
}

export function formatLongMonthYear(year: number, month: number): string {
  return formatDate({ year, month }, "long");
}

export function formatDisplayDate(value: string): string {
  const date = parsePartialDate(value);
  if (!date) return value;
  const { year, month, day } = date;
  if (month === undefined) return String(year);
  return formatDate({ year, month, day }, "short");
}

// Pages end on the current year, so the first page a work date opens on has
// no future years.
export function yearPageStart(year: number, anchorYear: number): number {
  const firstOfAnchorPage = anchorYear - YEARS_PER_PAGE + 1;
  const pages = Math.floor((year - firstOfAnchorPage) / YEARS_PER_PAGE);
  return firstOfAnchorPage + pages * YEARS_PER_PAGE;
}

const YEAR_STEP_BY_KEY: Record<string, number> = {
  [ARROW_LEFT_KEY]: -1,
  [ARROW_RIGHT_KEY]: 1,
  [ARROW_UP_KEY]: -YEAR_GRID_COLUMNS,
  [ARROW_DOWN_KEY]: YEAR_GRID_COLUMNS,
};

export function moveYear(
  year: number,
  key: string,
  {
    anchorYear,
    minYear,
    maxYear,
  }: { anchorYear: number; minYear: number; maxYear: number },
): number | undefined {
  const pageStart = yearPageStart(year, anchorYear);
  let next: number | undefined;
  if (key === HOME_KEY) next = pageStart;
  else if (key === END_KEY) next = pageStart + YEARS_PER_PAGE - 1;
  else {
    const step = YEAR_STEP_BY_KEY[key];
    next = step === undefined ? undefined : year + step;
  }
  if (next === undefined) return undefined;
  return Math.min(Math.max(next, minYear), maxYear);
}
