import { ENTRY_TITLE_SEPARATOR } from "#/features/resume-form/constants";
import { cleanText } from "#/features/resume/stored-value";

export function entryTitle(
  parts: readonly unknown[],
  fallback: string,
): string {
  const filled = parts.map(cleanText).filter((part) => part !== "");
  return filled.length > 0 ? filled.join(ENTRY_TITLE_SEPARATOR) : fallback;
}
