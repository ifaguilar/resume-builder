import {
  Accessibility,
  PointerActivationConstraints,
  PointerSensor,
} from "@dnd-kit/dom";
import { isSortable } from "@dnd-kit/dom/sortable";
import { DragDropProvider } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { AnimatePresence, useIsPresent } from "motion/react";
import type { ReactNode } from "react";

import { SortableItemContext } from "#/shared/components/sortable-item-context";
import {
  DRAG_ACTIVATION_DISTANCE_PX,
  LIST_DURATION_MS,
  LIST_EASING,
  MIN_SORTABLE_ITEMS,
  TOUCH_DRAG_DELAY_MS,
  TOUCH_DRAG_TOLERANCE_PX,
  TOUCH_POINTER_TYPE,
} from "#/shared/constants";
import { cssEasing } from "#/shared/lib/motion-transitions";

// idle: a move from the grip's menu slides too, not only a drag.
const SORTABLE_TRANSITION = {
  duration: LIST_DURATION_MS,
  easing: cssEasing(LIST_EASING),
  idle: true,
};

// No keyboard sensor: keyboard users reorder through the grip's menu, which
// needs Enter and Space to open.
const SENSORS = [
  PointerSensor.configure({
    activationConstraints: (event) =>
      event.pointerType === TOUCH_POINTER_TYPE
        ? [
            new PointerActivationConstraints.Delay({
              value: TOUCH_DRAG_DELAY_MS,
              tolerance: TOUCH_DRAG_TOLERANCE_PX,
            }),
          ]
        : [
            new PointerActivationConstraints.Distance({
              value: DRAG_ACTIVATION_DISTANCE_PX,
            }),
          ],
  }),
];

// Its announcements read out internal ids and describe keyboard dragging;
// lists announce their moves themselves.
function withoutAccessibility<T>(plugins: T[]): T[] {
  return plugins.filter((plugin) => plugin !== Accessibility);
}

type SortableListProps = {
  onMove: (from: number, to: number) => void;
  children: ReactNode;
};

export function SortableList({ onMove, children }: SortableListProps) {
  return (
    <DragDropProvider
      sensors={SENSORS}
      plugins={withoutAccessibility}
      onDragEnd={(event) => {
        const { source } = event.operation;
        if (event.canceled || !isSortable(source)) return;
        if (source.initialIndex !== source.index) {
          onMove(source.initialIndex, source.index);
        }
      }}
    >
      {/* initial={false}: rows already there when a list mounts don't grow in. */}
      <AnimatePresence initial={false}>{children}</AnimatePresence>
    </DragDropProvider>
  );
}

type SortableItemProps = {
  id: number | string;
  index: number;
  count: number;
  onMove: (from: number, to: number) => void;
  children: ReactNode;
};

export function SortableItem({
  id,
  index,
  count,
  onMove,
  children,
}: SortableItemProps) {
  const isPresent = useIsPresent();
  const { ref, handleRef, isDragging } = useSortable({
    id,
    index,
    transition: SORTABLE_TRANSITION,
    // A single item has no grip, and without one the whole item would drag.
    // A removed item still on screen keeps its old index, so it leaves the
    // sorting at once.
    disabled: count < MIN_SORTABLE_ITEMS || !isPresent,
  });

  return (
    <SortableItemContext
      value={{
        ref,
        handleRef,
        isDragging,
        isPresent,
        index,
        count,
        move: (to) => onMove(index, to),
      }}
    >
      {children}
    </SortableItemContext>
  );
}
