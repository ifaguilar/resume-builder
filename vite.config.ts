import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vitest/config";

const config = defineConfig({
  server: { port: 3000 },
  plugins: [devtools(), nitro(), tailwindcss(), tanstackStart(), viteReact()],
  test: { passWithNoTests: true },
});

export default config;
