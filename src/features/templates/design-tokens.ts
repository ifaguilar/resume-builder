import { createTw } from "@react-pdf/tailwind";

import { DEFAULT_ACCENT_COLOR } from "#/features/resume/constants";
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

const BASE_COLORS = {
  foreground: colorOf("text-neutral-950"),
  muted: colorOf("text-neutral-500"),
};

export type TemplateTw = ReturnType<typeof createTw>;

export function createTemplateTw(accentColor: string): TemplateTw {
  return createTw(
    {
      fontFamily: { sans: [FONT_FAMILY] },
      colors: { ...BASE_COLORS, accent: accentColor },
    },
    { ptPerRem: PT_PER_REM },
  );
}

export const DEFAULT_TEMPLATE_TW = createTemplateTw(DEFAULT_ACCENT_COLOR);

export const BODY_LEADING = "leading-relaxed";
export const KEEP_WITH_NEXT_PT =
  KEEP_WITH_NEXT_LINES *
  BODY_SIZE_PT *
  Number(DEFAULT_TEMPLATE_TW(BODY_LEADING).lineHeight);
