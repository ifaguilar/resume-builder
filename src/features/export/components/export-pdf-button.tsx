import { FileDown } from "lucide-react";
import { use, useState } from "react";

import { downloadFile } from "#/features/export/download";
import { pdfFileName } from "#/features/export/file-name";
import { cvLanguage, documentWord } from "#/features/languages/cv-language";
import type { ResumeForm } from "#/features/resume-form/use-resume-form";
import type { Settings } from "#/features/resume/settings-schema";
import { m } from "#/paraglide/messages.js";
import { AnnounceContext } from "#/shared/components/announce-context";
import { type Notice, NoticeDialog } from "#/shared/components/notice-dialog";
import { StatusIcon } from "#/shared/components/status-icon";
import { Button } from "#/shared/components/ui/button";
import { useFeedback } from "#/shared/lib/use-feedback";

export function ExportPdfButton({
  form,
  settings,
}: {
  form: ResumeForm;
  settings: Settings;
}) {
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const done = useFeedback();
  const announce = use(AnnounceContext);

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
      done.show();
      announce(m.export_pdf_done());
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
        <StatusIcon
          status={busy ? "busy" : done.shown ? "done" : "idle"}
          icon={<FileDown />}
        />
        {m.export_pdf_button()}
      </Button>
      <NoticeDialog notice={notice} onClose={() => setNotice(null)} />
    </>
  );
}
