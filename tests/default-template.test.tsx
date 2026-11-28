import { fileURLToPath } from "node:url";

import { Font, renderToBuffer } from "@react-pdf/renderer";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { PAGE_SIZES } from "#/features/resume/constants";
import type { Resume } from "#/features/resume/resume-schema";
import { DEFAULT_SETTINGS } from "#/features/resume/settings-schema";
import { DefaultTemplate } from "#/features/templates/default/default-template";
import { FONT_FAMILY, FONT_FILES } from "#/features/templates/fonts/constants";

const PDF_SIGNATURE = "%PDF";
const PUBLIC_DIR = new URL("../public", import.meta.url);
const SENIOR_FIXTURE_PATH = "/tests/fixtures/senior.json";
const CUSTOM_ACCENT_COLOR = "#c0392b";

const fixtures = import.meta.glob<Resume>("/tests/fixtures/*.json", {
  eager: true,
  import: "default",
});

beforeAll(() => {
  // Node can't fetch the browser's /fonts/… URLs, so read the same files.
  Font.register({
    family: FONT_FAMILY,
    fonts: FONT_FILES.map(({ fontWeight, src }) => ({
      fontWeight,
      src: fileURLToPath(new URL(`.${src}`, `${PUBLIC_DIR.href}/`)),
    })),
  });
  Font.registerHyphenationCallback((word) => [word]);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("DefaultTemplate", () => {
  const cases = [
    ...Object.entries(fixtures),
    ["empty", {}] as const,
    ["empty Spanish", { meta: { language: "es" } }] as const,
    ["empty French", { meta: { language: "fr" } }] as const,
    ["empty German", { meta: { language: "de" } }] as const,
  ].flatMap(([name, resume]) =>
    PAGE_SIZES.map(
      (pageSize) =>
        [name, pageSize, resume, DEFAULT_SETTINGS.accentColor] as const,
    ),
  );
  const colorCases = PAGE_SIZES.map(
    (pageSize) =>
      [
        "senior with a custom accent color",
        pageSize,
        fixtures[SENIOR_FIXTURE_PATH] ?? {},
        CUSTOM_ACCENT_COLOR,
      ] as const,
  );

  it.each([...cases, ...colorCases])(
    "renders %s on %s without warnings or errors",
    async (_name, pageSize, resume, accentColor) => {
      const warn = vi.spyOn(console, "warn");
      const error = vi.spyOn(console, "error");
      const pdf = await renderToBuffer(
        <DefaultTemplate
          resume={resume}
          settings={{ ...DEFAULT_SETTINGS, pageSize, accentColor }}
        />,
      );
      expect(pdf.subarray(0, PDF_SIGNATURE.length).toString()).toBe(
        PDF_SIGNATURE,
      );
      expect(warn).not.toHaveBeenCalled();
      expect(error).not.toHaveBeenCalled();
    },
  );
});
