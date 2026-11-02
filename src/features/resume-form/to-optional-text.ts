export function toOptionalText(value: string): string | undefined {
  return value === "" ? undefined : value;
}

export function toTrimmedText(value: string | undefined): string | undefined {
  return value === undefined ? undefined : toOptionalText(value.trim());
}
