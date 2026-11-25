export type Keyed<T> = { key: string; item: T };

// Resume list items have no ids, so a key comes from the item's content.
// Repeated content gets its occurrence number, so keys stay unique.
export function withContentKeys<T>(items: T[]): Keyed<T>[] {
  const seen = new Map<string, number>();
  return items.map((item) => {
    const content = JSON.stringify(item);
    const occurrence = seen.get(content) ?? 0;
    seen.set(content, occurrence + 1);
    return { key: JSON.stringify([content, occurrence]), item };
  });
}
