import { useDragDropMonitor } from "@dnd-kit/react";
import {
  ArrowDownIcon,
  ArrowDownToLineIcon,
  ArrowUpIcon,
  ArrowUpToLineIcon,
  GripVerticalIcon,
} from "lucide-react";
import { use, useState } from "react";

import { SortableItemContext } from "#/features/resume-form/components/sortable-item-context";
import { MIN_SORTABLE_ITEMS } from "#/features/resume-form/constants";
import { IconTooltip } from "#/shared/components/icon-tooltip";
import { Button } from "#/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "#/shared/components/ui/dropdown-menu";

export function ReorderMenu({ label }: { label: string }) {
  const item = use(SortableItemContext);
  const [isOpen, setIsOpen] = useState(false);

  // A drag can start from the grip of an open menu, which would otherwise
  // stay open and follow the moving item.
  useDragDropMonitor({ onDragStart: () => setIsOpen(false) });

  if (!item) return null;

  // Still shown for a single item, so the title doesn't shift when a second
  // one is added.
  if (item.count < MIN_SORTABLE_ITEMS) {
    return (
      <Button
        variant="ghost"
        size="icon-sm"
        className="shrink-0 text-muted-foreground"
        aria-label={label}
        disabled
      >
        <GripVerticalIcon />
      </Button>
    );
  }

  const { handleRef, index, count, move } = item;
  const isFirst = index === 0;
  const isLast = index === count - 1;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <IconTooltip label={label}>
        <DropdownMenuTrigger
          ref={handleRef}
          // Base UI opens menus on press, so every drag would open it too.
          // Open on click instead, which a drag never fires.
          onMouseDown={(event) => event.preventBaseUIHandler()}
          onClick={() => setIsOpen(true)}
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="shrink-0 cursor-grab touch-none text-muted-foreground"
            />
          }
        >
          <GripVerticalIcon />
        </DropdownMenuTrigger>
      </IconTooltip>
      <DropdownMenuContent className="w-auto">
        <DropdownMenuItem disabled={isFirst} onClick={() => move(index - 1)}>
          <ArrowUpIcon />
          Move up
        </DropdownMenuItem>
        <DropdownMenuItem disabled={isLast} onClick={() => move(index + 1)}>
          <ArrowDownIcon />
          Move down
        </DropdownMenuItem>
        <DropdownMenuItem disabled={isFirst} onClick={() => move(0)}>
          <ArrowUpToLineIcon />
          Move to top
        </DropdownMenuItem>
        <DropdownMenuItem disabled={isLast} onClick={() => move(count - 1)}>
          <ArrowDownToLineIcon />
          Move to bottom
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
