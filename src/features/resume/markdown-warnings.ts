import {
  MARKDOWN_BLOCK_LINE,
  WARNING_MESSAGES,
} from "#/features/resume/constants";
import type { ResumeWarning } from "#/features/resume/validate-resume";
import { isRecord } from "#/shared/lib/is-record";

type WarningPath = ResumeWarning["path"];

// The entry fields the CV reads as inline Markdown.
const ENTRY_MARKDOWN_FIELDS = [
  { section: "work", key: "highlights" },
  { section: "projects", key: "description" },
  { section: "projects", key: "highlights" },
] as const;
const SUMMARY_PATH = ["basics", "summary"] as const;

function hasBlockLine(value: unknown): boolean {
  const texts = Array.isArray(value) ? value : [value];
  return texts.some(
    (text) => typeof text === "string" && MARKDOWN_BLOCK_LINE.test(text),
  );
}

// One warning per field, on the whole bullet list, where the form shows it.
export function markdownWarnings(input: unknown): ResumeWarning[] {
  if (!isRecord(input)) return [];
  const paths: WarningPath[] = [];

  const [basicsKey, summaryKey] = SUMMARY_PATH;
  const basics = input[basicsKey];
  if (isRecord(basics) && hasBlockLine(basics[summaryKey])) {
    paths.push([...SUMMARY_PATH]);
  }

  for (const { section, key } of ENTRY_MARKDOWN_FIELDS) {
    const entries = input[section];
    if (!Array.isArray(entries)) continue;
    entries.forEach((entry: unknown, index) => {
      if (isRecord(entry) && hasBlockLine(entry[key])) {
        paths.push([section, index, key]);
      }
    });
  }

  return paths.map((path) => ({
    path,
    message: WARNING_MESSAGES.markdownBlock(),
  }));
}
