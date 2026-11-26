import { createContext } from "react";

export type SortableItemState = {
  ref: (element: Element | null) => void;
  handleRef: (element: Element | null) => void;
  isDragging: boolean;
  // False while the row plays its exit animation after a removal.
  isPresent: boolean;
  index: number;
  count: number;
  move: (to: number) => void;
};

export const SortableItemContext = createContext<SortableItemState | null>(
  null,
);
