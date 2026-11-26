export const COLOR_SCHEMES = ["light", "dark", "system"] as const;
export type ColorScheme = (typeof COLOR_SCHEMES)[number];
export type ResolvedColorScheme = Exclude<ColorScheme, "system">;

export const DEFAULT_COLOR_SCHEME: ColorScheme = "system";
export const COLOR_SCHEME_STORAGE_KEY = "color-scheme";
export const DARK_SCHEME_QUERY = "(prefers-color-scheme: dark)";
export const DARK_CLASS = "dark";
export const COLOR_SCHEME_LEGEND = "Appearance";
