import { createContext, type RefObject } from "react";

export const AddEntryButtonContext =
  createContext<RefObject<HTMLButtonElement | null> | null>(null);
