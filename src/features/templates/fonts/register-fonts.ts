import { Font } from "@react-pdf/renderer";

import { FONT_FAMILY, FONT_FILES } from "#/features/templates/fonts/constants";

export function registerFonts() {
  Font.register({ family: FONT_FAMILY, fonts: FONT_FILES });

  // A word split across lines extracts as two words in ATS parsers.
  Font.registerHyphenationCallback((word) => [word]);
}
