import type { Transition } from "motion/react";

import {
  FADE_DURATION_MS,
  LIST_DURATION_MS,
  LIST_EASING,
  MS_PER_SECOND,
} from "#/shared/constants";

export const listTransition: Transition = {
  duration: LIST_DURATION_MS / MS_PER_SECOND,
  ease: [...LIST_EASING],
};

export const fadeTransition: Transition = {
  duration: FADE_DURATION_MS / MS_PER_SECOND,
  ease: "easeOut",
};

export function cssEasing(curve: readonly number[]): string {
  return `cubic-bezier(${curve.join(", ")})`;
}
