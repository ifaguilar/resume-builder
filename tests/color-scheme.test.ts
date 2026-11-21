import { runInNewContext } from "node:vm";

import { describe, expect, it } from "vitest";

import {
  parseColorScheme,
  resolveColorScheme,
} from "#/features/color-scheme/color-scheme";
import { colorSchemeScript } from "#/features/color-scheme/color-scheme-script";
import { COLOR_SCHEME_STORAGE_KEY } from "#/features/color-scheme/constants";

describe("parseColorScheme", () => {
  it.each(["light", "dark", "system"])("keeps %s", (value) => {
    expect(parseColorScheme(value)).toBe(value);
  });

  it.each([null, undefined, "", "blue", "Dark", 1])(
    "falls back to system for %j",
    (value) => {
      expect(parseColorScheme(value)).toBe("system");
    },
  );
});

describe("resolveColorScheme", () => {
  it.each([
    ["light", true, "light"],
    ["light", false, "light"],
    ["dark", true, "dark"],
    ["dark", false, "dark"],
    ["system", true, "dark"],
    ["system", false, "light"],
  ] as const)("%s with a dark OS %s is %s", (scheme, prefersDark, expected) => {
    expect(resolveColorScheme(scheme, prefersDark)).toBe(expected);
  });
});

function runScript({
  stored,
  prefersDark = false,
  storageThrows = false,
}: {
  stored?: string;
  prefersDark?: boolean;
  storageThrows?: boolean;
}) {
  const classes = new Set<string>();
  const root = {
    classList: {
      toggle: (name: string, force: boolean) =>
        force ? classes.add(name) : classes.delete(name),
    },
    style: { colorScheme: "" },
  };
  runInNewContext(colorSchemeScript, {
    localStorage: {
      getItem: (key: string) => {
        if (storageThrows) throw new Error("blocked");
        return key === COLOR_SCHEME_STORAGE_KEY ? (stored ?? null) : null;
      },
    },
    matchMedia: () => ({ matches: prefersDark }),
    document: { documentElement: root },
  });
  return { isDark: classes.has("dark"), colorScheme: root.style.colorScheme };
}

describe("color scheme script", () => {
  it.each([
    [{ stored: "dark" }, true],
    [{ stored: "light", prefersDark: true }, false],
    [{ stored: "system", prefersDark: true }, true],
    [{ stored: "system" }, false],
    [{ prefersDark: true }, true],
    [{ stored: "blue", prefersDark: true }, true],
    [{ stored: "dark", storageThrows: true }, false],
  ])("applies %j as dark: %s", (options, isDark) => {
    expect(runScript(options)).toEqual({
      isDark,
      colorScheme: isDark ? "dark" : "light",
    });
  });
});
