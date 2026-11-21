import {
  COLOR_SCHEMES,
  type ColorScheme,
  DARK_CLASS,
  DEFAULT_COLOR_SCHEME,
  type ResolvedColorScheme,
} from "#/features/color-scheme/constants";

export function parseColorScheme(value: unknown): ColorScheme {
  return (
    COLOR_SCHEMES.find((scheme) => scheme === value) ?? DEFAULT_COLOR_SCHEME
  );
}

export function resolveColorScheme(
  scheme: ColorScheme,
  prefersDark: boolean,
): ResolvedColorScheme {
  if (scheme !== "system") return scheme;
  return prefersDark ? "dark" : "light";
}

export function applyColorScheme(resolved: ResolvedColorScheme): void {
  const root = document.documentElement;
  root.classList.toggle(DARK_CLASS, resolved === "dark");
  root.style.colorScheme = resolved;
}
