import { TriangleAlertIcon } from "lucide-react";
import type { ReactNode } from "react";

import {
  PDF_MIME_TYPE,
  PREVIEW_ERROR_MESSAGE,
  PREVIEW_TITLE,
} from "#/features/pdf-preview/constants";
import { usePdfPreview } from "#/features/pdf-preview/use-pdf-preview";
import type { Resume } from "#/features/resume/resume-schema";
import type { Settings } from "#/features/resume/settings-schema";
import { registerFonts } from "#/features/templates/fonts/register-fonts";

registerFonts();

function PreviewError() {
  return (
    <output className="flex items-center gap-2 rounded-xl border border-warning/30 bg-background p-3 text-sm shadow-sm">
      <TriangleAlertIcon className="size-4 shrink-0 text-warning" aria-hidden />
      {PREVIEW_ERROR_MESSAGE}
    </output>
  );
}

// Loaded only through React.lazy in preview-panel.tsx, so react-pdf never
// runs on the server and stays out of the main bundle.
export default function PdfPreview({
  resume,
  settings,
  fallback,
}: {
  resume: Resume;
  settings: Settings;
  fallback: ReactNode;
}) {
  const pdf = usePdfPreview(resume, settings);

  // A failed render keeps the last good PDF on screen.
  if (!pdf.url) {
    return pdf.error ? (
      <div className="flex h-full items-center justify-center p-4">
        <PreviewError />
      </div>
    ) : (
      fallback
    );
  }

  return (
    <div className="relative h-full">
      {/* Not an iframe: browsers refuse to show a PDF in a sandboxed one. */}
      <object
        data={pdf.url}
        type={PDF_MIME_TYPE}
        aria-label={PREVIEW_TITLE}
        className="size-full"
      />
      {pdf.error ? (
        <div className="absolute inset-x-4 bottom-4 flex justify-center">
          <PreviewError />
        </div>
      ) : null}
    </div>
  );
}
