export function toOptionalText(value: string): string | undefined {
  return value === "" ? undefined : value;
}
