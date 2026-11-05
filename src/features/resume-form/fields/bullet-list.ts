const LIST_MARKER = /^\s*(?:[•·▪◦‣∙*-]|\d+[.)])\s+/;
const LINE_BREAK = /\r?\n/;

export function splitBullet(
  items: readonly string[],
  index: number,
  caret: number,
): string[] {
  const text = items[index] ?? "";
  return [
    ...items.slice(0, index),
    text.slice(0, caret).trimEnd(),
    text.slice(caret).trimStart(),
    ...items.slice(index + 1),
  ];
}

export function filledBulletIndexes(items: readonly string[]): number[] {
  return items.flatMap((item, index) => (item.trim() === "" ? [] : [index]));
}

export function toBulletLines(pasted: string): string[] {
  return pasted
    .split(LINE_BREAK)
    .map((line) => line.replace(LIST_MARKER, "").trim())
    .filter((line) => line !== "");
}

export function pasteBullets(
  items: readonly string[],
  index: number,
  selection: { start: number; end: number },
  pasted: string,
): { items: string[]; lastIndex: number } {
  const lines = toBulletLines(pasted);
  const text = items[index] ?? "";
  const before = text.slice(0, selection.start);
  const after = text.slice(selection.end);
  if (before.trim() !== "" && after.trim() === "") {
    return {
      items: [
        ...items.slice(0, index),
        before.trimEnd(),
        ...lines,
        ...items.slice(index + 1),
      ],
      lastIndex: index + lines.length,
    };
  }
  const [first = "", ...rest] = lines;
  const merged = [before + first, ...rest];
  const lastIndex = index + merged.length - 1;
  merged[merged.length - 1] += after;
  return {
    items: [...items.slice(0, index), ...merged, ...items.slice(index + 1)],
    lastIndex,
  };
}
