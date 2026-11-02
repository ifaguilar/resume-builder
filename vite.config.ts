import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vitest/config";

// Vitest runs Vite in this mode.
const VITEST_MODE = "test";

const config = defineConfig(({ mode }) => ({
  server: { port: 3000 },
  plugins: [
    devtools(),
    // Nitro only builds the server. Under Vitest it breaks imports of JSON
    // files from node_modules, so it is left out there.
    mode === VITEST_MODE ? [] : nitro(),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
  test: { passWithNoTests: true },
}));

export default config;
