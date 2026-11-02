import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { relative, resolve, sep } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const { tool_input } = JSON.parse(readFileSync(0, "utf8"));
const file = relative(root, resolve(tool_input.file_path)).replaceAll(sep, "/");

for (const script of ["lint:fix", "format"]) {
  spawnSync(`pnpm ${script} --no-error-on-unmatched-pattern "${file}"`, {
    cwd: root,
    shell: true,
    stdio: "inherit",
  });
}
