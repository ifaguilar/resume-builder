import { pdf } from "@react-pdf/renderer";

import type { Resume } from "#/features/resume/resume-schema";
import type { Settings } from "#/features/resume/settings-schema";
import { ClassicTemplate } from "#/features/templates/classic/classic-template";
import { registerFonts } from "#/features/templates/fonts/register-fonts";

registerFonts();

// Loaded only through a dynamic import, so react-pdf stays out of the main
// bundle.
export function toPdf(resume: Resume, settings: Settings): Promise<Blob> {
  return pdf(<ClassicTemplate resume={resume} settings={settings} />).toBlob();
}
