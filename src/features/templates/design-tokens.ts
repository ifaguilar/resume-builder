import { createTw } from "@react-pdf/tailwind";

import {
  BODY_SIZE_PT,
  KEEP_WITH_NEXT_LINES,
  PT_PER_REM,
} from "#/features/templates/constants";
import { FONT_FAMILY } from "#/features/templates/fonts/constants";

// The library keeps Tailwind's palette as hex internally without exporting
// it, and tailwindcss/colors is OKLCH, which react-pdf can't parse.
const palette = createTw({});
const colorOf = (className: string) => String(palette(className).color);

export const THEME_COLORS = {
  foreground: colorOf("text-slate-950"),
  muted: colorOf("text-slate-500"),
  accent: colorOf("text-blue-600"),
};

export const tw = createTw(
  { fontFamily: { sans: [FONT_FAMILY] }, colors: THEME_COLORS },
  { ptPerRem: PT_PER_REM },
);

export const BODY_LEADING = "leading-relaxed";
export const KEEP_WITH_NEXT_PT =
  KEEP_WITH_NEXT_LINES * BODY_SIZE_PT * Number(tw(BODY_LEADING).lineHeight);
