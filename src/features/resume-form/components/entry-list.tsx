import { PlusIcon } from "lucide-react";
import { type ReactNode, use, useEffect, useRef } from "react";

import { AnnounceContext } from "#/features/resume-form/components/announce-context";
import { AddEntryButtonContext } from "#/features/resume-form/components/entry-list-context";
import {
  SortableItem,
  SortableList,
} from "#/features/resume-form/components/sortable-list";
import { useListKeys } from "#/features/resume-form/use-list-keys";
import { Button } from "#/shared/components/ui/button";

type EntryListProps = {
  count: number;
  emptyText: string;
  addLabel: string;
  entryLabel: string;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onMove: (from: number, to: number) => void;
  children: (entry: { index: number; remove: () => void }) => ReactNode;
};

export function EntryList({
  count,
  emptyText,
  addLabel,
  entryLabel,
  onAdd,
  onRemove,
  onMove,
  children,
}: EntryListProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const focusNewEntry = useRef(false);
  const keys = useListKeys(count);
  const announce = use(AnnounceContext);

  // The new entry's card only exists after the list re-renders.
  useEffect(() => {
    if (!focusNewEntry.current) return;
    focusNewEntry.current = false;
    const cards = listRef.current?.querySelectorAll("section");
    cards?.[cards.length - 1]
      ?.querySelector<HTMLElement>("input, textarea")
      ?.focus();
  });

  function add() {
    focusNewEntry.current = true;
    onAdd();
    keys.insert(count);
  }

  function remove(index: number) {
    onRemove(index);
    keys.remove(index);
  }

  function move(from: number, to: number) {
    onMove(from, to);
    keys.move(from, to);
    announce(`Moved ${entryLabel} to position ${to + 1} of ${count}.`);
  }

  return (
    <AddEntryButtonContext value={addButtonRef}>
      <div ref={listRef} className="flex flex-col gap-4">
        {count === 0 ? (
          <p className="text-muted-foreground">{emptyText}</p>
        ) : (
          <SortableList onMove={move}>
            {keys.keys.map((key, index) => (
              <SortableItem
                key={key}
                id={key}
                index={index}
                count={count}
                onMove={move}
              >
                {children({ index, remove: () => remove(index) })}
              </SortableItem>
            ))}
          </SortableList>
        )}
        <Button
          ref={addButtonRef}
          variant="outline"
          size="sm"
          className="self-start"
          onClick={add}
        >
          <PlusIcon data-icon="inline-start" />
          {addLabel}
        </Button>
      </div>
    </AddEntryButtonContext>
  );
}
