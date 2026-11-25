export const FONT_FAMILY = "Inter";

// Keep in sync with the @font-face rules in styles.css.
export const FONT_REGULAR_URL = "/fonts/Inter-Regular.ttf";
export const FONT_FILES = [
  { fontWeight: 400, src: FONT_REGULAR_URL },
  { fontWeight: 500, src: "/fonts/Inter-Medium.ttf" },
  { fontWeight: 600, src: "/fonts/Inter-SemiBold.ttf" },
  { fontWeight: 700, src: "/fonts/Inter-Bold.ttf" },
];

// Inter has no liga or clig, but its calt turns "->" into an arrow glyph that
// ATS parsers read as a different character. liga and clig stay listed so the
// rule holds if the template font changes.
export const PDF_FONT_FEATURES = { liga: 0, clig: 0, calt: 0 };
