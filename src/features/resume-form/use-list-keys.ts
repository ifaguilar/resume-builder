import { useState } from "react";

import {
  createKeys,
  insertItems,
  moveItem,
  removeItem,
  syncKeys,
} from "#/features/resume-form/list-keys";

// React keys for a form array, kept outside the form so they never reach the
// resume data. Every change to the array's length or order must go through
// one of these, in the same event as the value change.
export function useListKeys(length: number) {
  const [keys, setKeys] = useState<readonly number[]>(() => createKeys(length));

  // The array was replaced from outside (an import, a restored draft).
  const synced = syncKeys(keys, length);
  if (synced !== keys) setKeys(synced);

  return {
    keys: synced,
    insert: (index: number, count = 1) =>
      setKeys((current) => insertItems(current, index, createKeys(count))),
    remove: (index: number) => setKeys((current) => removeItem(current, index)),
    move: (from: number, to: number) =>
      setKeys((current) => moveItem(current, from, to)),
  };
}
