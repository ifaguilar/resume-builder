import { FileDown } from "lucide-react";
import { useState } from "react";

import { downloadFile } from "#/features/export/download";
import { pdfFileName } from "#/features/export/file-name";
import { cvLanguage, documentWord } from "#/features/languages/cv-language";
import type { ResumeForm } from "#/features/resume-form/use-resume-form";
import type { Settings } from "#/features/resume/settings-schema";
import { m } from "#/paraglide/messages.js";
import { type Notice, NoticeDialog } from "#/shared/components/notice-dialog";
import { Button } from "#/shared/components/ui/button";

export function ExportPdfButton({
  form,
  settings,
}: {
  form: ResumeForm;
  settings: Settings;
}) {
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  // Rendered from the live values: the preview's are debounced and can miss
  // the last keystroke.
  async function exportPdf() {
    if (busy) return;
    setBusy(true);
    const resume = form.state.values;
    try {
      const { toPdf } = await import("#/features/export/pdf-export");
      const blob = await toPdf(resume, settings);
      downloadFile(
        blob,
        pdfFileName(
          resume.basics?.name,
          documentWord(cvLanguage(resume), settings.pageSize),
        ),
      );
    } catch {
      setNotice({
        title: m.export_pdf_error_title(),
        message: m.export_pdf_error_message(),
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {/* aria-disabled, not disabled: Base UI's disabled drops focus. */}
      <Button
        size="sm"
        aria-disabled={busy}
        aria-busy={busy}
        onClick={() => void exportPdf()}
      >
        <FileDown data-icon="inline-start" aria-hidden />
        {m.export_pdf_button()}
      </Button>
      <NoticeDialog notice={notice} onClose={() => setNotice(null)} />
    </>
  );
}
