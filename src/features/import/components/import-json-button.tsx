import { FileUpIcon, Upload } from "lucide-react";
import { type ChangeEvent, useRef, useState } from "react";

import {
  IMPORT_ERROR_MESSAGES,
  IMPORT_ERROR_TITLE,
  JSON_FILE_ACCEPT,
} from "#/features/import/constants";
import { fromJson, type ImportResult } from "#/features/import/json-import";
import { hasContent } from "#/features/resume-form/has-content";
import type { ResumeForm } from "#/features/resume-form/use-resume-form";
import type { Draft } from "#/features/storage/draft-format";
import { type Notice, NoticeDialog } from "#/shared/components/notice-dialog";
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
} from "#/shared/components/ui/alert-dialog";
import { Button } from "#/shared/components/ui/button";

async function readImport(file: File): Promise<ImportResult> {
  try {
    return fromJson(await file.text());
  } catch {
    return { ok: false, message: IMPORT_ERROR_MESSAGES.unreadable };
  }
}

export function ImportJsonButton({
  form,
  onImport,
}: {
  form: ResumeForm;
  onImport: (draft: Draft) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<Draft | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    // Cleared so picking the same file again still fires a change.
    input.value = "";
    if (!file) return;

    const result = await readImport(file);
    if (!result.ok) {
      setNotice({ title: IMPORT_ERROR_TITLE, message: result.message });
    } else if (hasContent(form.state.values)) {
      setPending(result.draft);
    } else {
      onImport(result.draft);
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
      >
        <Upload data-icon="inline-start" aria-hidden />
        Import JSON
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept={JSON_FILE_ACCEPT}
        className="hidden"
        tabIndex={-1}
        aria-hidden
        onChange={(event) => void handleFile(event)}
      />
      <AlertDialog
        open={pending !== null}
        onOpenChange={(open) => {
          if (!open) setPending(null);
        }}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-warning/10 text-warning">
              <FileUpIcon />
            </AlertDialogMedia>
            <AlertDialogTitle>Replace your current resume?</AlertDialogTitle>
            <AlertDialogDescription>
              Everything in the editor will be replaced by the imported file.
              Export JSON first if you want to keep it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pending) onImport(pending);
                setPending(null);
              }}
            >
              Replace
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <NoticeDialog notice={notice} onClose={() => setNotice(null)} />
    </>
  );
}
