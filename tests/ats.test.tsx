import { fileURLToPath } from "node:url";

import { Font, renderToBuffer } from "@react-pdf/renderer";
import { getDocument, OPS } from "pdfjs-dist/legacy/build/pdf.mjs";
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
  type Settings,
} from "#/features/resume/settings-schema";
import { DefaultTemplate } from "#/features/templates/default/default-template";
import { FONT_FAMILY, FONT_FILES } from "#/features/templates/fonts/constants";

const PUBLIC_DIR = new URL("../public", import.meta.url);
const FIXTURE_NAME = /([^/]+)\.json$/;
// The fixture that must run past one page, so page breaks stay tested.
const MULTI_PAGE_FIXTURE = "senior";
const MULTI_PAGE_FIXTURE_PATH = `/tests/fixtures/${MULTI_PAGE_FIXTURE}.json`;

// A layout far from the default: Education first, a hidden section and a
// custom title, so order, visibility and titles stay tested.
const CUSTOM_SECTIONS: Settings["sections"] = [
  { id: "summary", visible: true },
  { id: "education", visible: true },
  { id: "skills", visible: true },
  { id: "experience", visible: true, title: "Work History" },
  { id: "projects", visible: false },
];

const CUSTOM_ACCENT_COLOR = "#c0392b";
const FIRST_PAGE = 1;

const fixtures = import.meta.glob<Resume>("/tests/fixtures/*.json", {
  eager: true,
  import: "default",
});

function renderPdf(resume: Resume, settings: Settings) {
  return renderToBuffer(
    <DefaultTemplate resume={resume} settings={settings} />,
  );
}

async function renderPages(resume: Resume, settings: Settings) {
  return extractText(await renderPdf(resume, settings));
}

// Every fill color the PDF draws with, read back through pdf.js.
async function fillColors(pdf: Uint8Array): Promise<Set<unknown>> {
  const task = getDocument({ data: new Uint8Array(pdf) });
  try {
    const document = await task.promise;
    const pages = await Promise.all(
      Array.from({ length: document.numPages }, async (_, index) => {
        const page = await document.getPage(index + FIRST_PAGE);
        const { fnArray, argsArray } = await page.getOperatorList();
        return fnArray.flatMap((fn, at) =>
          fn === OPS.setFillRGBColor ? [argsArray[at]?.[0]] : [],
        );
      }),
    );
    return new Set(pages.flat());
  } finally {
    await task.destroy();
  }
}

async function readTextLayer(resume: Resume, settings: Settings) {
  const pages = await renderPages(resume, settings);
  const expected = expectedWords(resume, settings);
  const extracted = pagesToWords(pages);
  return {
    findings: [
      ...findSplitWords(expected, extracted),
      ...findMissingWords(expected, extracted),
      ...findDetachedBullets(pages),
    ],
    text: pagesToText(pages),
  };
}

function snapshotPath(name: string, pageSize: PageSize): string {
  return `./__snapshots__/ats/${name}-${pageSize.toLowerCase()}.txt`;
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

describe("DefaultTemplate text layer", () => {
  const cases = Object.entries(fixtures).flatMap(([path, resume]) =>
    PAGE_SIZES.map(
      (pageSize) =>
        [path.match(FIXTURE_NAME)?.[1] ?? path, pageSize, resume] as const,
    ),
  );

  it.each(cases)(
    "%s on %s reads every word whole and in order",
    async (name, pageSize, resume) => {
      const { findings, text } = await readTextLayer(resume, {
        ...DEFAULT_SETTINGS,
        pageSize,
      });
      expect(findings).toEqual([]);
      await expect(text).toMatchFileSnapshot(snapshotPath(name, pageSize));
    },
  );

  it.each(PAGE_SIZES)(
    `${MULTI_PAGE_FIXTURE} with custom sections on %s reads every word`,
    async (pageSize) => {
      const { findings, text } = await readTextLayer(
        fixtures[MULTI_PAGE_FIXTURE_PATH] ?? {},
        { ...DEFAULT_SETTINGS, pageSize, sections: CUSTOM_SECTIONS },
      );
      expect(findings).toEqual([]);
      await expect(text).toMatchFileSnapshot(
        snapshotPath(`${MULTI_PAGE_FIXTURE}-custom-sections`, pageSize),
      );
    },
  );

  it.each(PAGE_SIZES)(
    `${MULTI_PAGE_FIXTURE} with a custom accent color on %s draws it and keeps the text`,
    async (pageSize) => {
      const resume = fixtures[MULTI_PAGE_FIXTURE_PATH] ?? {};
      const settings = { ...DEFAULT_SETTINGS, pageSize };
      const custom = { ...settings, accentColor: CUSTOM_ACCENT_COLOR };
      const pdf = await renderPdf(resume, custom);
      expect(await fillColors(pdf)).toContain(CUSTOM_ACCENT_COLOR);
      expect(await fillColors(await renderPdf(resume, settings))).not.toContain(
        CUSTOM_ACCENT_COLOR,
      );
      expect(pagesToText(await extractText(pdf))).toBe(
        pagesToText(await renderPages(resume, settings)),
      );
    },
  );

  it.each(PAGE_SIZES)(
    `${MULTI_PAGE_FIXTURE} runs past one page on %s`,
    async (pageSize) => {
      const resume = fixtures[MULTI_PAGE_FIXTURE_PATH];
      expect(resume).toBeDefined();
      const pages = await renderPages(resume ?? {}, {
        ...DEFAULT_SETTINGS,
        pageSize,
      });
      expect(pages.length).toBeGreaterThan(1);
    },
  );
});
