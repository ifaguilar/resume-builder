import { type ReactNode, useEffect, useSyncExternalStore } from "react";

import {
  applyColorScheme,
  parseColorScheme,
  resolveColorScheme,
} from "#/features/color-scheme/color-scheme";
import { ColorSchemeContext } from "#/features/color-scheme/color-scheme-context";
import {
  COLOR_SCHEME_STORAGE_KEY,
  type ColorScheme,
  DARK_SCHEME_QUERY,
  DEFAULT_COLOR_SCHEME,
} from "#/features/color-scheme/constants";

const listeners = new Set<() => void>();
// Used when storage is blocked, so a choice still applies until reload.
let unsavedScheme: ColorScheme | null = null;

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Fires when another tab changes the choice.
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function getSnapshot(): ColorScheme {
  try {
    return parseColorScheme(localStorage.getItem(COLOR_SCHEME_STORAGE_KEY));
  } catch {
    return unsavedScheme ?? DEFAULT_COLOR_SCHEME;
  }
}

// The server can't read the device's choice. Null means "not read yet", so
// nothing is applied over what the inline script set before paint.
function getServerSnapshot(): ColorScheme | null {
  return null;
}

function setScheme(scheme: ColorScheme) {
  unsavedScheme = scheme;
  try {
    localStorage.setItem(COLOR_SCHEME_STORAGE_KEY, scheme);
  } catch {
    // Blocked storage: unsavedScheme keeps the choice for this page.
  }
  for (const listener of listeners) listener();
}

export function ColorSchemeProvider({ children }: { children: ReactNode }) {
  const stored = useSyncExternalStore<ColorScheme | null>(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  useEffect(() => {
    if (stored === null) return undefined;
    const query = matchMedia(DARK_SCHEME_QUERY);
    const apply = () =>
      applyColorScheme(resolveColorScheme(stored, query.matches));
    apply();
    if (stored !== "system") return undefined;
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, [stored]);

  return (
    <ColorSchemeContext
      value={{ scheme: stored ?? DEFAULT_COLOR_SCHEME, setScheme }}
    >
      {children}
    </ColorSchemeContext>
  );
}
