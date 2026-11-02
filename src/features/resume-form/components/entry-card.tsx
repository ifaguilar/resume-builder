import type { ReactNode } from "react";

import { RemoveEntryButton } from "#/features/resume-form/components/remove-entry-button";

type EntryHeaderProps = {
  title: string;
  entry: unknown;
  entryLabel: string;
  onRemove: () => void;
};

// Sections render this inside a form.Subscribe for the entry: an array field
// in "array" mode re-renders only when entries are added or removed.
export function EntryHeader({
  title,
  entry,
  entryLabel,
  onRemove,
}: EntryHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-2 border-b pb-3">
      <h3 className="truncate font-semibold">{title}</h3>
      <RemoveEntryButton
        entry={entry}
        entryName={title}
        entryLabel={entryLabel}
        onRemove={onRemove}
      />
    </div>
  );
}

type EntryCardProps = { header: ReactNode; children: ReactNode };

export function EntryCard({ header, children }: EntryCardProps) {
  return (
    <section className="flex flex-col gap-5 rounded-xl border bg-background p-4 shadow-xs">
      {header}
      <div className="flex flex-col gap-6">{children}</div>
    </section>
  );
}
