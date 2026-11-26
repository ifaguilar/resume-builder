import {
  COLOR_SCHEME_STORAGE_KEY,
  COLOR_SCHEMES,
  DARK_CLASS,
  DARK_SCHEME_QUERY,
  DEFAULT_COLOR_SCHEME,
} from "#/features/color-scheme/constants";

// Runs before the first paint, ahead of any bundle, so it can't import the
// helpers in color-scheme.ts and repeats their logic. Storage can be blocked
// (private windows, site settings), which leaves the default.
export const colorSchemeScript = `(() => {
  let scheme = ${JSON.stringify(DEFAULT_COLOR_SCHEME)};
  try {
    const stored = localStorage.getItem(${JSON.stringify(COLOR_SCHEME_STORAGE_KEY)});
    if (${JSON.stringify(COLOR_SCHEMES)}.includes(stored)) scheme = stored;
  } catch {}
  const resolved =
    scheme === "system"
      ? matchMedia(${JSON.stringify(DARK_SCHEME_QUERY)}).matches ? "dark" : "light"
      : scheme;
  const root = document.documentElement;
  root.classList.toggle(${JSON.stringify(DARK_CLASS)}, resolved === "dark");
  root.style.colorScheme = resolved;
})()`;
