import {
  CONTRAST_FLARE,
  HEX_CHANNEL_LENGTH,
  HEX_RADIX,
  LUMINANCE_WEIGHTS,
  SRGB_CHANNEL_MAX,
  SRGB_GAMMA,
  SRGB_GAMMA_DIVISOR,
  SRGB_GAMMA_OFFSET,
  SRGB_LINEAR_DIVISOR,
  SRGB_LINEAR_LIMIT,
  WHITE_LUMINANCE,
} from "#/features/templates/constants";

function linearChannel(hex: string): number {
  const value = Number.parseInt(hex, HEX_RADIX) / SRGB_CHANNEL_MAX;
  return value <= SRGB_LINEAR_LIMIT
    ? value / SRGB_LINEAR_DIVISOR
    : ((value + SRGB_GAMMA_OFFSET) / SRGB_GAMMA_DIVISOR) ** SRGB_GAMMA;
}

// For a "#rrggbb" color, as the settings store it.
export function contrastOnWhite(color: string): number {
  const luminance = LUMINANCE_WEIGHTS.reduce((sum, weight, index) => {
    const start = 1 + index * HEX_CHANNEL_LENGTH;
    const channel = color.slice(start, start + HEX_CHANNEL_LENGTH);
    return sum + weight * linearChannel(channel);
  }, 0);
  return (WHITE_LUMINANCE + CONTRAST_FLARE) / (luminance + CONTRAST_FLARE);
}
