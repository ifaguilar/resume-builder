import { defineConfig } from "@inlang/paraglide-js";

// Read by both the Vite plugin and `paraglide-js compile` (the lint script),
// so both write the same files.
export default defineConfig({
  outdir: "./src/paraglide",
  outputStructure: "message-modules",
  // The Vite plugin only emits declarations for its virtual-modules layout.
  emitTsDeclarations: true,
  // No cookie: it would reach the host on every request.
  strategy: ["localStorage", "preferredLanguage", "baseLocale"],
  localStorageKey: "ui-language",
});
