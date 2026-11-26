import { createContext } from "react";

export const AnnounceContext = createContext<(message: string) => void>(
  () => {},
);
