export function hasContent(value: unknown): boolean {
  if (typeof value === "string") return value.trim() !== "";
  if (typeof value === "number") return true;
  if (typeof value === "boolean") return value;
  if (Array.isArray(value)) return value.some(hasContent);
  if (typeof value === "object" && value !== null) {
    return Object.values(value).some(hasContent);
  }
  return false;
}
