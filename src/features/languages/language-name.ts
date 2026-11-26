import type { Locale } from "#/paraglide/runtime.js";

// A language's name in that language, capitalized for a title: Intl writes
// "español" and "français" in lowercase.
export function languageName(language: Locale): string {
  const name =
    new Intl.DisplayNames([language], { type: "language" }).of(language) ??
    language;
  return name.charAt(0).toLocaleUpperCase(language) + name.slice(1);
}
