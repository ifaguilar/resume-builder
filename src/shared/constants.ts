// A plain click on a grip opens its menu; only a real movement starts a drag.
export const DRAG_ACTIVATION_DISTANCE_PX = 4;
export const TOUCH_DRAG_DELAY_MS = 250;
export const TOUCH_DRAG_TOLERANCE_PX = 5;
export const TOUCH_POINTER_TYPE = "touch";
export const MIN_SORTABLE_ITEMS = 2;

export const MS_PER_SECOND = 1000;
// dnd-kit's own sortable transition, so every list move feels the same.
export const LIST_DURATION_MS = 250;
const LIST_EASING_X1 = 0.25;
const LIST_EASING_X2 = 0.5;
// A cubic Bézier's control points: x1, y1, x2, y2.
export const LIST_EASING = [LIST_EASING_X1, 1, LIST_EASING_X2, 1] as const;
export const FADE_DURATION_MS = 150;
export const FEEDBACK_DURATION_MS = 1500;
export const ICON_POP_SCALE = 0.5;
export const VIEW_ENTER_SCALE = 0.96;
