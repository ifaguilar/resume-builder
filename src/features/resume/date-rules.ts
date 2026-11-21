import { WARNING_MESSAGES } from "#/features/resume/constants";
import {
  compareDates,
  isRealCalendarDate,
  type PartialDate,
  parsePartialDate,
} from "#/features/resume/partial-date";
import type {
  EducationEntry,
  Project,
  Resume,
  WorkEntry,
} from "#/features/resume/resume-schema";
import type { ResumeWarning } from "#/features/resume/validate-resume";

type DatedEntry = WorkEntry | EducationEntry | Project;
type DateKey = keyof DatedEntry & ("startDate" | "endDate");

const START_KEY = "startDate" satisfies DateKey;
const END_KEY = "endDate" satisfies DateKey;

// Only the sections recruiters read get date rules. An education end date
// is a graduation date, which can be expected.
const DATE_RULES: readonly {
  section: keyof Resume;
  pastOnly: readonly DateKey[];
}[] = [
  { section: "work", pastOnly: [START_KEY, END_KEY] },
  { section: "education", pastOnly: [START_KEY] },
  { section: "projects", pastOnly: [START_KEY, END_KEY] },
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function dateAt(entry: Record<string, unknown>, key: DateKey) {
  const value = entry[key];
  // Malformed and nonexistent dates already have their own warning.
  if (typeof value !== "string" || !isRealCalendarDate(value)) return undefined;
  return parsePartialDate(value);
}

// Month precision at most, because the picker works in months.
function isFutureDate(date: PartialDate, today: Temporal.PlainDate): boolean {
  const thisMonth = { year: today.year, month: today.month };
  return compareDates({ year: date.year, month: date.month }, thisMonth) > 0;
}

export function dateWarnings(
  input: unknown,
  today: Temporal.PlainDate,
): ResumeWarning[] {
  if (!isRecord(input)) return [];
  const warnings: ResumeWarning[] = [];

  for (const { section, pastOnly } of DATE_RULES) {
    const entries = input[section];
    if (!Array.isArray(entries)) continue;

    entries.forEach((entry: unknown, index) => {
      if (!isRecord(entry)) return;
      for (const key of pastOnly) {
        const date = dateAt(entry, key);
        if (date && isFutureDate(date, today)) {
          warnings.push({
            path: [section, index, key],
            message: WARNING_MESSAGES.futureDate,
          });
        }
      }
      const start = dateAt(entry, START_KEY);
      const end = dateAt(entry, END_KEY);
      if (start && end && compareDates(end, start) < 0) {
        warnings.push({
          path: [section, index, END_KEY],
          message: WARNING_MESSAGES.endBeforeStart,
        });
      }
    });
  }
  return warnings;
}
