import { createContext } from "react";

import {
  type ColorScheme,
  DEFAULT_COLOR_SCHEME,
} from "#/features/color-scheme/constants";

export type ColorSchemeState = {
  scheme: ColorScheme;
  setScheme: (scheme: ColorScheme) => void;
};

export const ColorSchemeContext = createContext<ColorSchemeState>({
  scheme: DEFAULT_COLOR_SCHEME,
  setScheme: () => {},
});
