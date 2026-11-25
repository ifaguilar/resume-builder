import { fileURLToPath } from "node:url";

import { Font, renderToBuffer } from "@react-pdf/renderer";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import type { Resume } from "#/features/resume/resume-schema";
import { ClassicTemplate } from "#/features/templates/classic/classic-template";
import { FONT_FAMILY, FONT_FILES } from "#/features/templates/fonts/constants";

const PDF_SIGNATURE = "%PDF";
const PUBLIC_DIR = new URL("../public", import.meta.url);

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

describe("ClassicTemplate", () => {
  it.each([...Object.entries(fixtures), ["empty", {}] as const])(
    "renders %s without warnings or errors",
    async (_name, resume) => {
      const warn = vi.spyOn(console, "warn");
      const error = vi.spyOn(console, "error");
      const pdf = await renderToBuffer(<ClassicTemplate resume={resume} />);
      expect(pdf.subarray(0, PDF_SIGNATURE.length).toString()).toBe(
        PDF_SIGNATURE,
      );
      expect(warn).not.toHaveBeenCalled();
      expect(error).not.toHaveBeenCalled();
    },
  );
});
