import { PDF_FONT_FEATURES } from "#/features/templates/fonts/constants";

export const BODY_SIZE_PT = 10;
// A section heading moves to the next page unless this many body lines of
// space remain after it: room for an entry's two-line header and a
// three-line first bullet, which never split.
export const KEEP_WITH_NEXT_LINES = 5;
const TEXT_XS_REM = 0.75;
// Makes Tailwind's text-xs exactly 10 pt, the body size of the original CV,
// so every other size and spacing step scales from it.
export const PT_PER_REM = BODY_SIZE_PT / TEXT_XS_REM;

export const BULLET = "•";
export const DATE_RANGE_SEPARATOR = " - ";
export const LIST_SEPARATOR = ", ";
export const PLACE_SEPARATOR = ", ";
export const LABEL_SUFFIX = ": ";
export const DOCUMENT_TITLE_SEPARATOR = " ";
export const TEL_PREFIX = "tel:";
export const MAILTO_PREFIX = "mailto:";

// A child's fontFeatureSettings replaces the Page's instead of merging, so
// tabular-nums (['tnum']) alone would turn calt back on for dates.
export const PDF_DATE_FEATURES = { ...PDF_FONT_FEATURES, tnum: 1 };

// Section headings are 11.7 pt bold, under WCAG's 14 pt bold "large text",
// so they need the normal text contrast against the white page.
export const MIN_HEADING_CONTRAST = 4.5;
// WCAG 2 relative luminance and contrast ratio.
export const SRGB_CHANNEL_MAX = 255;
export const SRGB_LINEAR_LIMIT = 0.04045;
export const SRGB_LINEAR_DIVISOR = 12.92;
export const SRGB_GAMMA_OFFSET = 0.055;
export const SRGB_GAMMA_DIVISOR = 1.055;
export const SRGB_GAMMA = 2.4;
const RED_WEIGHT = 0.2126;
const GREEN_WEIGHT = 0.7152;
const BLUE_WEIGHT = 0.0722;
export const LUMINANCE_WEIGHTS = [
  RED_WEIGHT,
  GREEN_WEIGHT,
  BLUE_WEIGHT,
] as const;
export const CONTRAST_FLARE = 0.05;
export const WHITE_LUMINANCE = 1;
export const HEX_RADIX = 16;
export const HEX_CHANNEL_LENGTH = 2;
