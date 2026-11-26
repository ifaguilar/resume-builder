import { TriangleAlertIcon } from "lucide-react";

import { m } from "#/paraglide/messages.js";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "#/shared/components/ui/alert-dialog";

export type Notice = { title: string; message: string };

export function NoticeDialog({
  notice,
  onClose,
}: {
  notice: Notice | null;
  onClose: () => void;
}) {
  return (
    <AlertDialog
      open={notice !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-warning/10 text-warning">
            <TriangleAlertIcon />
          </AlertDialogMedia>
          <AlertDialogTitle>{notice?.title}</AlertDialogTitle>
          <AlertDialogDescription>{notice?.message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="default">
            {m.shared_ok()}
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
