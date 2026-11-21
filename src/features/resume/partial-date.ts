import {
  DATE_PART_SEPARATOR,
  FULL_DATE_PATTERN,
  PARTIAL_DATE_PATTERN,
} from "#/features/resume/constants";

export type PartialDate = { year: number; month?: number; day?: number };

// Temporal's string parsing also accepts times, offsets and calendar
// annotations, so the pattern decides the format and only the parts go in.
export function isRealCalendarDate(value: string): boolean {
  const match = FULL_DATE_PATTERN.exec(value);
  if (!match) return true;
  const [, year, month, day] = match.map(Number);
  if (year === undefined || month === undefined || day === undefined)
    return true;
  try {
    Temporal.PlainDate.from({ year, month, day }, { overflow: "reject" });
    return true;
  } catch (error) {
    if (error instanceof RangeError) return false;
    throw error;
  }
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

// "2024" and "2024-05" compare as equal: a date is only as precise as its
// least precise side. Temporal has no year-only type.
export function compareDates(a: PartialDate, b: PartialDate): number {
  if (a.month === undefined || b.month === undefined) {
    return Math.sign(a.year - b.year);
  }
  if (a.day === undefined || b.day === undefined) {
    return Temporal.PlainYearMonth.compare(
      { year: a.year, month: a.month },
      { year: b.year, month: b.month },
    );
  }
  return Temporal.PlainDate.compare(
    { year: a.year, month: a.month, day: a.day },
    { year: b.year, month: b.month, day: b.day },
  );
}
