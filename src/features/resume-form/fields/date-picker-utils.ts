import {
  ARROW_DOWN_KEY,
  ARROW_LEFT_KEY,
  ARROW_RIGHT_KEY,
  ARROW_UP_KEY,
  DATE_PART_SEPARATOR,
  DISPLAY_LOCALE,
  END_KEY,
  HOME_KEY,
  MAX_PICKER_YEAR,
  MIN_PICKER_YEAR,
  MONTH_DIGITS,
  MONTH_GRID_COLUMNS,
  MONTHS_PER_YEAR,
} from "#/features/resume-form/constants";
import { PARTIAL_DATE_PATTERN } from "#/features/resume/constants";

export type PartialDate = { year: number; month?: number; day?: number };

const shortMonth = new Intl.DateTimeFormat(DISPLAY_LOCALE, {
  month: "short",
  timeZone: "UTC",
});
const longMonthYear = new Intl.DateTimeFormat(DISPLAY_LOCALE, {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

function utcDate(year: number, month: number): Date {
  return new Date(Date.UTC(year, month - 1));
}

export function parsePartialDate(
  value: string | undefined,
): PartialDate | undefined {
  if (value === undefined || !PARTIAL_DATE_PATTERN.test(value)) {
    return undefined;
  }
  const [year, month, day] = value.split(DATE_PART_SEPARATOR).map(Number);
  if (year === undefined) return undefined;
  return { year, month, day };
}

export function initialFocusMonth(
  date: PartialDate | undefined,
  shownYear: number,
  today: Date,
): number {
  if (date?.year === shownYear && date.month !== undefined) return date.month;
  if (today.getFullYear() === shownYear) return today.getMonth() + 1;
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
  if (next.year < MIN_PICKER_YEAR || next.year > MAX_PICKER_YEAR) {
    return undefined;
  }
  return next;
}

export function toMonthValue(year: number, month: number): string {
  const paddedMonth = String(month).padStart(MONTH_DIGITS, "0");
  return `${year}${DATE_PART_SEPARATOR}${paddedMonth}`;
}

export function formatShortMonth(year: number, month: number): string {
  return shortMonth.format(utcDate(year, month));
}

export function formatLongMonthYear(year: number, month: number): string {
  return longMonthYear.format(utcDate(year, month));
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
