import { Trash2Icon } from "lucide-react";
import { use } from "react";

import { AddEntryButtonContext } from "#/features/resume-form/components/entry-list-context";
import { RemoveButton } from "#/features/resume-form/components/remove-button";
import type { EntryMessages } from "#/features/resume-form/constants";
import { hasContent } from "#/features/resume-form/has-content";
import { m } from "#/paraglide/messages.js";
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

type RemoveEntryButtonProps = {
  entry: unknown;
  entryName: string;
  messages: EntryMessages;
  onRemove: () => void;
};

export function RemoveEntryButton({
  entry,
  entryName,
  messages,
  onRemove,
}: RemoveEntryButtonProps) {
  const label = messages.remove();
  const addButtonRef = use(AddEntryButtonContext);

  // The card (and the dialog inside it) unmounts on removal, so wait a frame
  // for React and the dialog's own focus handling to finish.
  function removeAndMoveFocus() {
    onRemove();
    requestAnimationFrame(() => addButtonRef?.current?.focus());
  }

  if (!hasContent(entry)) {
    return (
      <IconTooltip label={label}>
        <RemoveButton onClick={removeAndMoveFocus}>
          <Trash2Icon />
        </RemoveButton>
      </IconTooltip>
    );
  }

  return (
    <AlertDialog>
      <IconTooltip label={label}>
        <AlertDialogTrigger render={<RemoveButton />}>
          <Trash2Icon />
        </AlertDialogTrigger>
      </IconTooltip>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>{messages.removeTitle()}</AlertDialogTitle>
          <AlertDialogDescription>
            {m.form_remove_entry_description({ name: entryName })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{m.shared_cancel()}</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={removeAndMoveFocus}>
            {m.form_remove_entry_confirm()}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
