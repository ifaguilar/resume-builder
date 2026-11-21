import {
  ARROW_DOWN_KEY,
  ARROW_LEFT_KEY,
  ARROW_RIGHT_KEY,
  ARROW_UP_KEY,
  DISPLAY_LOCALE,
  END_KEY,
  HOME_KEY,
  MAX_PICKER_YEAR,
  MIN_PICKER_YEAR,
  MONTH_DIGITS,
  MONTH_GRID_COLUMNS,
  MONTH_NAMES_REFERENCE_YEAR,
  MONTHS_PER_YEAR,
} from "#/features/resume-form/constants";
import { DATE_PART_SEPARATOR } from "#/features/resume/constants";
import {
  type PartialDate,
  parsePartialDate,
} from "#/features/resume/partial-date";

type MonthWidth = "short" | "long";

const monthNamesByWidth = new Map<MonthWidth, readonly string[]>();

// Formatting a Temporal date with Intl is slow (tens of µs), and a month's
// name doesn't depend on its year, so the names are formatted once, on first
// use. Intl can't format a PlainYearMonth without an explicit calendar,
// hence the day.
function nameOfMonth(width: MonthWidth, month: number): string {
  let names = monthNamesByWidth.get(width);
  if (!names) {
    names = Array.from({ length: MONTHS_PER_YEAR }, (_, index) =>
      Temporal.PlainDate.from({
        year: MONTH_NAMES_REFERENCE_YEAR,
        month: index + 1,
        day: 1,
      }).toLocaleString(DISPLAY_LOCALE, { month: width }),
    );
    monthNamesByWidth.set(width, names);
  }
  return names[month - 1] ?? String(month);
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
  return nameOfMonth("short", month);
}

export function formatLongMonthYear(year: number, month: number): string {
  return `${nameOfMonth("long", month)} ${year}`;
}

export function formatDisplayDate(value: string): string {
  const date = parsePartialDate(value);
  if (!date) return value;
  const { year, month, day } = date;
  if (month === undefined) return String(year);
  const monthName = formatShortMonth(month);
  return day === undefined
    ? `${monthName} ${year}`
    : `${monthName} ${day}, ${year}`;
}
