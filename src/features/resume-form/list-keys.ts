let lastKey = 0;

export function createKeys(count: number): number[] {
  return Array.from({ length: count }, () => {
    lastKey += 1;
    return lastKey;
  });
}

export function syncKeys(
  keys: readonly number[],
  length: number,
): readonly number[] {
  return keys.length === length ? keys : createKeys(length);
}

export function moveItem<T>(
  items: readonly T[],
  from: number,
  to: number,
): T[] {
  if (from === to || !(from in items) || !(to in items)) return [...items];
  return insertItems(removeItem(items, from), to, items.slice(from, from + 1));
}

export function insertItems<T>(
  items: readonly T[],
  index: number,
  newItems: readonly T[],
): T[] {
  return [...items.slice(0, index), ...newItems, ...items.slice(index)];
}

export function removeItem<T>(items: readonly T[], index: number): T[] {
  return items.filter((_, itemIndex) => itemIndex !== index);
}
