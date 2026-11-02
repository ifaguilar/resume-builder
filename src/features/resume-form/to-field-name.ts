export function toFieldName(path: readonly (string | number)[]): string {
  return path.reduce<string>((name, segment) => {
    if (typeof segment === "number") return `${name}[${segment}]`;
    return name === "" ? segment : `${name}.${segment}`;
  }, "");
}
