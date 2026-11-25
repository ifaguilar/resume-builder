import { PDFViewer } from "@react-pdf/renderer";

import type { Resume } from "#/features/resume/resume-schema";
import { ClassicTemplate } from "#/features/templates/classic/classic-template";
import { registerFonts } from "#/features/templates/fonts/register-fonts";

registerFonts();

// Loaded only through React.lazy in preview-panel.tsx, so react-pdf never
// runs on the server and stays out of the main bundle.
export default function PdfPreview({ resume }: { resume: Resume }) {
  return (
    <PDFViewer width="100%" height="100%" showToolbar className="border-0">
      <ClassicTemplate resume={resume} />
    </PDFViewer>
  );
}
