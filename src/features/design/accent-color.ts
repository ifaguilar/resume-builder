import { HEX_COLOR_PATTERN } from "#/features/resume/constants";

const HASH = "#";

// Accepts what people paste from design tools: "#C0392B", "c0392b".
export function parseHexColor(text: string): string | undefined {
  const trimmed = text.trim();
  const color = trimmed.startsWith(HASH) ? trimmed : HASH + trimmed;
  return HEX_COLOR_PATTERN.test(color) ? color.toLowerCase() : undefined;
}
