import { ENTRY_TITLE_SEPARATOR } from "#/features/resume-form/constants";

export function entryTitle(
  parts: readonly (string | undefined)[],
  fallback: string,
): string {
  const filled = parts
    .map((part) => part?.trim() ?? "")
    .filter((part) => part !== "");
  return filled.length > 0 ? filled.join(ENTRY_TITLE_SEPARATOR) : fallback;
}
