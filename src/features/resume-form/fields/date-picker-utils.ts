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
  MONTHS_PER_YEAR,
} from "#/features/resume-form/constants";
import { DATE_PART_SEPARATOR } from "#/features/resume/constants";
import {
  type PartialDate,
  parsePartialDate,
} from "#/features/resume/partial-date";

// Intl can't format a PlainYearMonth without an explicit calendar, so
// months are formatted from their first day.
function firstDayOf(year: number, month: number): Temporal.PlainDate {
  return Temporal.PlainDate.from({ year, month, day: 1 });
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
  maxYear = MAX_PICKER_YEAR,
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
  if (next.year < MIN_PICKER_YEAR || next.year > maxYear) {
    return undefined;
  }
  return next;
}

export function toMonthValue(year: number, month: number): string {
  const paddedMonth = String(month).padStart(MONTH_DIGITS, "0");
  return `${year}${DATE_PART_SEPARATOR}${paddedMonth}`;
}

export function formatShortMonth(year: number, month: number): string {
  return firstDayOf(year, month).toLocaleString(DISPLAY_LOCALE, {
    month: "short",
  });
}

export function formatLongMonthYear(year: number, month: number): string {
  return firstDayOf(year, month).toLocaleString(DISPLAY_LOCALE, {
    month: "long",
    year: "numeric",
  });
}

export function formatDisplayDate(value: string): string {
  const date = parsePartialDate(value);
  if (!date) return value;
  const { year, month, day } = date;
  if (month === undefined) return String(year);
  const monthName = formatShortMonth(year, month);
  return day === undefined
    ? `${monthName} ${year}`
    : `${monthName} ${day}, ${year}`;
}
