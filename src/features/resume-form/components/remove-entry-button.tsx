import { Trash2Icon } from "lucide-react";
import { use, useState } from "react";

import { AddEntryButtonContext } from "#/features/resume-form/components/entry-list-context";
import { hasContent } from "#/features/resume-form/has-content";
import { IconTooltip } from "#/shared/components/icon-tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "#/shared/components/ui/alert-dialog";
import { Button } from "#/shared/components/ui/button";

type RemoveEntryButtonProps = {
  entry: unknown;
  entryName: string;
  entryLabel: string;
  onRemove: () => void;
};

export function RemoveEntryButton({
  entry,
  entryName,
  entryLabel,
  onRemove,
}: RemoveEntryButtonProps) {
  const label = `Remove ${entryLabel}`;
  const addButtonRef = use(AddEntryButtonContext);
  const [isOpen, setIsOpen] = useState(false);

  // The card (and the dialog inside it) unmounts on removal, so wait a frame
  // for React and the dialog's own focus handling to finish.
  function removeAndMoveFocus() {
    onRemove();
    requestAnimationFrame(() => addButtonRef?.current?.focus());
  }

  if (!hasContent(entry)) {
    return (
      <IconTooltip label={label}>
        <Button
          variant="destructive"
          size="icon-sm"
          onClick={removeAndMoveFocus}
        >
          <Trash2Icon />
        </Button>
      </IconTooltip>
    );
  }

  // Entries are keyed by index, so after a removal the next entry takes this
  // one's place and this dialog stays mounted. Close it explicitly, or a
  // second click would remove that entry too.
  function confirmRemove() {
    setIsOpen(false);
    removeAndMoveFocus();
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <IconTooltip label={label}>
        <AlertDialogTrigger
          render={<Button variant="destructive" size="icon-sm" />}
        >
          <Trash2Icon />
        </AlertDialogTrigger>
      </IconTooltip>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Remove this {entryLabel}?</AlertDialogTitle>
          <AlertDialogDescription>
            “{entryName}” and everything in it will be deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={confirmRemove}>
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
