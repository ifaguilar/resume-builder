import { config } from "zod";

import { getLocale, type Locale } from "#/paraglide/runtime.js";

type ValidationLocale = { default: () => Parameters<typeof config>[0] };

// Zod's own messages (a number where text belongs) are English by default.
// Each language loads in its own chunk, only when the UI uses it.
const VALIDATION_LOCALES = {
  en: undefined,
  es: () => import("zod/v4/locales/es.js"),
  fr: () => import("zod/v4/locales/fr.js"),
  de: () => import("zod/v4/locales/de.js"),
} satisfies Record<Locale, (() => Promise<ValidationLocale>) | undefined>;

// The server shell says "en"; the editor renders only in the browser, where
// the UI language is known. Runs before the draft is loaded and validated.
export async function applyUiLanguage(): Promise<void> {
  const locale = getLocale();
  document.documentElement.lang = locale;
  const load = VALIDATION_LOCALES[locale];
  if (load) config((await load()).default());
}
