// Turns a warning path into a TanStack Form field name:
// ["work", 1, "startDate"] becomes "work[1].startDate".
export function toFieldName(path: readonly (string | number)[]): string {
  return path.reduce<string>((name, segment) => {
    if (typeof segment === "number") return `${name}[${segment}]`;
    return name === "" ? segment : `${name}.${segment}`;
  }, "");
}
