import { fileURLToPath } from "node:url";

import { Font, renderToBuffer } from "@react-pdf/renderer";
import { beforeAll, describe, expect, it } from "vitest";

import {
  findDetachedBullets,
  findMissingWords,
  findSplitWords,
} from "#/features/ats/ats-checks";
import {
  extractText,
  pagesToText,
  pagesToWords,
} from "#/features/ats/extract-text";
import { expectedWords } from "#/features/ats/resume-words";
import { PAGE_SIZES } from "#/features/resume/constants";
import type { Resume } from "#/features/resume/resume-schema";
import {
  DEFAULT_SETTINGS,
  type PageSize,
} from "#/features/resume/settings-schema";
import { ClassicTemplate } from "#/features/templates/classic/classic-template";
import { FONT_FAMILY, FONT_FILES } from "#/features/templates/fonts/constants";

const PUBLIC_DIR = new URL("../public", import.meta.url);
const FIXTURE_NAME = /([^/]+)\.json$/;
// The fixture that must run past one page, so page breaks stay tested.
const MULTI_PAGE_FIXTURE = "senior";
const MULTI_PAGE_FIXTURE_PATH = `/tests/fixtures/${MULTI_PAGE_FIXTURE}.json`;

const fixtures = import.meta.glob<Resume>("/tests/fixtures/*.json", {
  eager: true,
  import: "default",
});

async function renderPages(resume: Resume, pageSize: PageSize) {
  const pdf = await renderToBuffer(
    <ClassicTemplate
      resume={resume}
      settings={{ ...DEFAULT_SETTINGS, pageSize }}
    />,
  );
  return extractText(pdf);
}

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

describe("ClassicTemplate text layer", () => {
  const cases = Object.entries(fixtures).flatMap(([path, resume]) =>
    PAGE_SIZES.map(
      (pageSize) =>
        [path.match(FIXTURE_NAME)?.[1] ?? path, pageSize, resume] as const,
    ),
  );

  it.each(cases)(
    "%s on %s reads every word whole and in order",
    async (name, pageSize, resume) => {
      const pages = await renderPages(resume, pageSize);
      const expected = expectedWords(resume);
      const extracted = pagesToWords(pages);

      expect([
        ...findSplitWords(expected, extracted),
        ...findMissingWords(expected, extracted),
        ...findDetachedBullets(pages),
      ]).toEqual([]);
      await expect(pagesToText(pages)).toMatchFileSnapshot(
        `./__snapshots__/ats/${name}-${pageSize.toLowerCase()}.txt`,
      );
    },
  );

  it.each(PAGE_SIZES)(
    `${MULTI_PAGE_FIXTURE} runs past one page on %s`,
    async (pageSize) => {
      const resume = fixtures[MULTI_PAGE_FIXTURE_PATH];
      expect(resume).toBeDefined();
      const pages = await renderPages(resume ?? {}, pageSize);
      expect(pages.length).toBeGreaterThan(1);
    },
  );
});
