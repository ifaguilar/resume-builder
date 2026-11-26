import { createContext } from "react";

export type SortableItemState = {
  ref: (element: Element | null) => void;
  handleRef: (element: Element | null) => void;
  isDragging: boolean;
  index: number;
  count: number;
  move: (to: number) => void;
};

export const SortableItemContext = createContext<SortableItemState | null>(
  null,
);
