import { fileURLToPath } from "node:url";

import { Font, renderToBuffer } from "@react-pdf/renderer";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { expectedWords } from "#/features/ats/resume-words";
import { PAGE_SIZES } from "#/features/resume/constants";
import type { Resume } from "#/features/resume/resume-schema";
import { DEFAULT_SETTINGS } from "#/features/resume/settings-schema";
import { DefaultTemplate } from "#/features/templates/default/default-template";
import { FONT_FAMILY, FONT_FILES } from "#/features/templates/fonts/constants";
import { resumeContent } from "#/features/templates/resume-content";

const PDF_SIGNATURE = "%PDF";
const PUBLIC_DIR = new URL("../public", import.meta.url);

// Validation only warns, so an imported file can hold anything. Two resumes,
// because a `basics` that isn't an object can't also hold wrong fields.
const WRONG_FIELDS = {
  basics: {
    name: 42,
    label: { text: "Engineer" },
    location: { city: "Madrid", countryCode: "Spain" },
    profiles: [{ network: 5, url: "https://example.com/me" }, null],
  },
  work: [
    { name: 42, position: "Lead", startDate: 2030, highlights: "one line" },
    null,
    "text",
    { name: "Acme", startDate: { y: 2020 }, location: null },
  ],
  skills: [null, { name: "Tools", keywords: [1, {}, "Git"] }],
  projects: [{ name: "Probe", highlights: [5, null] }],
  education: {},
  languages: { a: 1 },
};

const WRONG_CONTAINERS = {
  basics: "x",
  work: {},
  skills: "Git, Docker",
  meta: "x",
};

// Read back the way an import reads a file, so no type is asserted.
function imported(value: object): Resume {
  return JSON.parse(JSON.stringify(value));
}

const cases = [
  ["wrong fields", imported(WRONG_FIELDS)],
  ["wrong containers", imported(WRONG_CONTAINERS)],
] as const;

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

describe("values of the wrong type", () => {
  it("draws numbers as typed and skips what can't be drawn", () => {
    const words = expectedWords(cases[0][1], DEFAULT_SETTINGS);
    expect(words).toEqual(
      expect.arrayContaining(["42", "Madrid,", "Spain", "2030", "Git", "5"]),
    );
    expect(words).not.toContain("[object");
  });

  it.each(cases)("builds the content of %s", (_name, resume) => {
    expect(() => resumeContent(resume, DEFAULT_SETTINGS)).not.toThrow();
    expect(() => expectedWords(resume, DEFAULT_SETTINGS)).not.toThrow();
  });

  it.each(
    cases.flatMap(([name, resume]) =>
      PAGE_SIZES.map((pageSize) => [name, pageSize, resume] as const),
    ),
  )("renders %s on %s without warnings or errors", async (_n, size, resume) => {
    const warn = vi.spyOn(console, "warn");
    const error = vi.spyOn(console, "error");
    const pdf = await renderToBuffer(
      <DefaultTemplate
        resume={resume}
        settings={{ ...DEFAULT_SETTINGS, pageSize: size }}
      />,
    );
    expect(pdf.subarray(0, PDF_SIGNATURE.length).toString()).toBe(
      PDF_SIGNATURE,
    );
    expect(warn).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
  });
});
