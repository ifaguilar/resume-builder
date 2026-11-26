import { fileURLToPath } from "node:url";

import { Font, renderToBuffer } from "@react-pdf/renderer";
import { beforeAll, expect, it } from "vitest";

import { findMissingWords, findSplitWords } from "#/features/ats/ats-checks";
import { extractText, pagesToWords } from "#/features/ats/extract-text";
import { expectedWords } from "#/features/ats/resume-words";
import type { Resume } from "#/features/resume/resume-schema";
import { DEFAULT_SETTINGS } from "#/features/resume/settings-schema";
import { DefaultTemplate } from "#/features/templates/default/default-template";
import { FONT_FAMILY, FONT_FILES } from "#/features/templates/fonts/constants";

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

async function findings(resume: Resume) {
  const pdf = await renderToBuffer(
    <DefaultTemplate resume={resume} settings={DEFAULT_SETTINGS} />,
  );
  const extracted = pagesToWords(await extractText(pdf));
  const expected = expectedWords(resume, DEFAULT_SETTINGS);
  return [
    ...findSplitWords(expected, extracted),
    ...findMissingWords(expected, extracted),
  ];
}

// The app renders many PDFs with the same fonts (every preview update, then
// Export PDF). With fontkit 2, a letter first drawn inside an accented one
// ("n" in "ñ") lost its text in every later PDF ("Morga\u0006 Achterberg").
// This file renders on a fresh font cache, accented fixtures first.
it("keeps every later PDF's text after accented names were rendered", async () => {
  const resumes = Object.values(fixtures);
  const accentedFirst = [
    ...resumes.filter((resume) => resume.meta?.language),
    ...resumes.filter((resume) => !resume.meta?.language),
  ];
  // One after another, never in parallel: the bug depends on render order.
  const all = await accentedFirst.reduce<
    Promise<Awaited<ReturnType<typeof findings>>>
  >(
    async (previous, resume) => [
      ...(await previous),
      ...(await findings(resume)),
    ],
    Promise.resolve([]),
  );
  expect(all).toEqual([]);
});
