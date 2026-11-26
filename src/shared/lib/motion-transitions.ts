import type { MotionProps, Transition } from "motion/react";

import {
  FADE_DURATION_MS,
  ICON_POP_SCALE,
  LIST_DURATION_MS,
  LIST_EASING,
  MS_PER_SECOND,
  VIEW_ENTER_SCALE,
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

// For entry cards: a new card's first field gets focus at once, and a card
// still growing would make that scroll jump.
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: listTransition,
} satisfies MotionProps;

// Reorders are animated by dnd-kit, not here.
const listItemEnter = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: "auto" },
  transition: listTransition,
} satisfies MotionProps;

// Only for rows whose content comes from props, which stay frozen while the
// row leaves. A row that reads the form by index would show the next entry.
// The margin collapses too, so the rows below slide instead of jumping.
export const listItemPresence = {
  ...listItemEnter,
  exit: { opacity: 0, height: 0, marginBottom: 0, overflow: "hidden" },
} satisfies MotionProps;

// A view replacing another in the same place, such as a picker's grid.
export const viewEnter = {
  initial: { opacity: 0, scale: VIEW_ENTER_SCALE },
  animate: { opacity: 1, scale: 1 },
  transition: fadeTransition,
} satisfies MotionProps;

export const popInOut = {
  initial: { opacity: 0, scale: ICON_POP_SCALE },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: ICON_POP_SCALE },
  transition: fadeTransition,
} satisfies MotionProps;
