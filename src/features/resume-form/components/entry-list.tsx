import { PlusIcon } from "lucide-react";
import { type ReactNode, useEffect, useRef } from "react";

import { AddEntryButtonContext } from "#/features/resume-form/components/entry-list-context";
import { Button } from "#/shared/components/ui/button";

type EntryListProps = {
  isEmpty: boolean;
  emptyText: string;
  addLabel: string;
  onAdd: () => void;
  children: ReactNode;
};

export function EntryList({
  isEmpty,
  emptyText,
  addLabel,
  onAdd,
  children,
}: EntryListProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const focusNewEntry = useRef(false);

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
  }

  return (
    <AddEntryButtonContext value={addButtonRef}>
      <div ref={listRef} className="flex flex-col gap-4">
        {isEmpty ? (
          <p className="text-muted-foreground">{emptyText}</p>
        ) : (
          children
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
