import { cn } from "cn";
import * as motion from "motion/react-m";
import { type ReactNode, use } from "react";

import { RemoveEntryButton } from "#/features/resume-form/components/remove-entry-button";
import type { EntryMessages } from "#/features/resume-form/constants";
import { ReorderMenu } from "#/shared/components/reorder-menu";
import { SortableItemContext } from "#/shared/components/sortable-item-context";
import { fadeIn } from "#/shared/lib/motion-transitions";

type EntryHeaderProps = {
  title: string;
  entry: unknown;
  messages: EntryMessages;
  onRemove: () => void;
};

// Sections render this inside a form.Subscribe for the entry: an array field
// in "array" mode re-renders only when entries are added, removed or moved.
export function EntryHeader({
  title,
  entry,
  messages,
  onRemove,
}: EntryHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-2 border-b pb-3">
      <div className="flex min-w-0 items-center gap-1">
        <ReorderMenu label={messages.reorder()} />
        <h3 className="truncate font-semibold">{title}</h3>
      </div>
      <RemoveEntryButton
        entry={entry}
        entryName={title}
        messages={messages}
        onRemove={onRemove}
      />
    </div>
  );
}

type EntryCardProps = { header: ReactNode; children: ReactNode };

export function EntryCard({ header, children }: EntryCardProps) {
  const item = use(SortableItemContext);

  return (
    <motion.section
      ref={item?.ref}
      {...fadeIn}
      // During a drag, dnd-kit leaves a hidden copy of this card where it will
      // land; the data-dnd-placeholder styles turn that copy into a drop slot.
      className={cn(
        "flex flex-col gap-5 rounded-xl border bg-background px-3 py-4 shadow-xs data-dnd-placeholder:visible! data-dnd-placeholder:border-transparent data-dnd-placeholder:bg-primary/5 data-dnd-placeholder:shadow-none data-dnd-placeholder:ring-0 data-dnd-placeholder:outline-2 data-dnd-placeholder:-outline-offset-2 data-dnd-placeholder:outline-primary/50 data-dnd-placeholder:outline-dashed data-dnd-placeholder:*:invisible @lg/form:px-4",
        item?.isDragging && "relative z-10 shadow-xl ring-2 ring-primary/30",
      )}
    >
      {header}
      <div className="flex flex-col gap-6">{children}</div>
    </motion.section>
  );
}
