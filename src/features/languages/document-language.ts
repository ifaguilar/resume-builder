import { getLocale } from "#/paraglide/runtime.js";

// The server shell says "en"; the editor renders only in the browser, where
// the UI language is known.
export function applyDocumentLanguage(): void {
  document.documentElement.lang = getLocale();
}
