import { describe, expect, it } from "vitest";

import { SETTINGS_META_KEY } from "#/features/export/constants";
import { pdfFileName } from "#/features/export/file-name";
import { toJson } from "#/features/export/json-export";
import { fromJson } from "#/features/import/json-import";
import { PAGE_SIZES } from "#/features/resume/constants";
import type { Resume } from "#/features/resume/resume-schema";
import { DEFAULT_SETTINGS } from "#/features/resume/settings-schema";
import { CV_WORD, RESUME_WORD } from "#/features/templates/constants";

const fixtures = import.meta.glob<Resume>("/tests/fixtures/*.json", {
  eager: true,
  import: "default",
});

const cases = Object.entries(fixtures).flatMap(([name, resume]) =>
  PAGE_SIZES.map((pageSize) => ({ name, resume, pageSize })),
);

describe("toJson", () => {
  it.each(cases)(
    "$name ($pageSize) round-trips through fromJson",
    ({ resume, pageSize }) => {
      const settings = { ...DEFAULT_SETTINGS, pageSize };
      expect(fromJson(toJson(resume, settings))).toEqual({
        ok: true,
        draft: { resume, settings },
      });
    },
  );

  it("puts the settings under meta and keeps the other meta fields", () => {
    const resume: Resume = { meta: { version: "v1.0.0" } };
    const file = JSON.parse(toJson(resume, DEFAULT_SETTINGS));
    expect(file.meta).toEqual({
      version: "v1.0.0",
      [SETTINGS_META_KEY]: { settings: DEFAULT_SETTINGS },
    });
  });

  it("keeps unknown keys", () => {
    const resume = { basics: { name: "Ada" }, extra: { a: 1 } } as Resume;
    expect(JSON.parse(toJson(resume, DEFAULT_SETTINGS)).extra).toEqual({
      a: 1,
    });
  });

  it("ends with a newline", () => {
    expect(toJson({}, DEFAULT_SETTINGS).endsWith("\n")).toBe(true);
  });
});

describe("pdfFileName", () => {
  it.each([
    ["Morgan Achterberg", "Morgan-Achterberg-Resume.pdf"],
    ["  Ana   María  López ", "Ana-María-López-Resume.pdf"],
    ['Jo "JJ" O/Neil: Dev?', "Jo-JJ-ONeil-Dev-Resume.pdf"],
    ["", "Resume.pdf"],
    ['  <>:"/\\|?*  ', "Resume.pdf"],
    [undefined, "Resume.pdf"],
    [{ first: "Ada" }, "Resume.pdf"],
  ])("%j → %s", (name, expected) => {
    expect(pdfFileName(name, RESUME_WORD)).toBe(expected);
  });

  it("uses the word it is given", () => {
    expect(pdfFileName("Lucía Peñalosa", CV_WORD)).toBe(
      "Lucía-Peñalosa-CV.pdf",
    );
    expect(pdfFileName("", CV_WORD)).toBe("CV.pdf");
  });
});
