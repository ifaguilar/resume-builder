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
  if (!item || item.count < MIN_SORTABLE_ITEMS) return null;

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
