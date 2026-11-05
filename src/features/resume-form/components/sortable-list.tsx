import {
  Accessibility,
  PointerActivationConstraints,
  PointerSensor,
} from "@dnd-kit/dom";
import { isSortable } from "@dnd-kit/dom/sortable";
import { DragDropProvider } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import type { ReactNode } from "react";

import { SortableItemContext } from "#/features/resume-form/components/sortable-item-context";
import {
  DRAG_ACTIVATION_DISTANCE_PX,
  MIN_SORTABLE_ITEMS,
  TOUCH_DRAG_DELAY_MS,
  TOUCH_DRAG_TOLERANCE_PX,
  TOUCH_POINTER_TYPE,
} from "#/features/resume-form/constants";

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
      {children}
    </DragDropProvider>
  );
}

type SortableItemProps = {
  id: number;
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
  const { ref, handleRef, isDragging } = useSortable({
    id,
    index,
    // A single item has no grip, and without one the whole item would drag.
    disabled: count < MIN_SORTABLE_ITEMS,
  });

  return (
    <SortableItemContext
      value={{
        ref,
        handleRef,
        isDragging,
        index,
        count,
        move: (to) => onMove(index, to),
      }}
    >
      {children}
    </SortableItemContext>
  );
}
