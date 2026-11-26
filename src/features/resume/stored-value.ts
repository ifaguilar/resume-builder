import { isRecord } from "#/shared/lib/is-record";

// Imported drafts can hold values of the wrong type: validation only warns.
// Numbers (like a year typed as 2030) read as typed; anything else reads as
// nothing instead of breaking the editor or the preview.
export function textValue(value: unknown): string {
  if (typeof value === "number") return String(value);
  return typeof value === "string" ? value : "";
}

export function cleanText(value: unknown): string {
  return textValue(value).trim();
}

export function listValue(value: unknown): readonly unknown[] {
  return Array.isArray(value) ? value : [];
}

// Entries that aren't objects carry nothing a template can draw.
export function entriesOf<T extends object>(
  value: readonly T[] | undefined,
): T[] {
  return listValue(value).filter((entry): entry is T => isRecord(entry));
}

// What the form's list editors can work on.
export function isListOrMissing(value: unknown): boolean {
  return value === undefined || Array.isArray(value);
}

// Only text the user cleared counts as empty; a number or an object stays.
export function isBlankText(value: unknown): boolean {
  return typeof value === "string" && value.trim() === "";
}

// What the form's entry fields can work on: setting a field under any other
// value would replace it with a new object.
export function isRecordOrMissing(value: unknown): boolean {
  return value === undefined || isRecord(value);
}
