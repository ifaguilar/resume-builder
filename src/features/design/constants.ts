import type { CvLanguage, CvSectionId } from "#/features/resume/constants";
import type { PageSize } from "#/features/resume/settings-schema";

export const PAGE_GROUP_TITLE = "Page";
export const PAGE_SIZE_LEGEND = "Page size";
export const PAGE_SIZE_TIP =
  "Use the paper size of the country where you're applying.";

export const PAGE_SIZE_OPTIONS = [
  {
    value: "LETTER",
    title: "US Letter",
    dimensions: "8.5 × 11 in",
    regions: "US, Canada, Mexico and Central America",
  },
  {
    value: "A4",
    title: "A4",
    dimensions: "210 × 297 mm",
    regions: "Most other countries",
  },
] as const satisfies readonly {
  value: PageSize;
  title: string;
  dimensions: string;
  regions: string;
}[];

export const LANGUAGE_GROUP_TITLE = "Language";
export const CV_LANGUAGE_LEGEND = "CV language";
export const CV_LANGUAGE_TIP =
  "Write your CV in the language of the job posting.";
// Matches no option, so none is selected while the stored language is one
// the CV can't use.
export const NO_CV_LANGUAGE = "";

export const CV_LANGUAGE_OPTIONS = [
  { value: "en", title: "English", sample: "Sep 2023 - Present" },
  { value: "es", title: "Español", sample: "sept 2023 - actualidad" },
] as const satisfies readonly {
  value: CvLanguage;
  title: string;
  sample: string;
}[];

export function unsupportedLanguage(value: string): string {
  return `This resume's language is "${value}"; the CV uses English.`;
}

export const SECTIONS_GROUP_TITLE = "Sections";
export const SECTIONS_TIP = "Recent graduates: put Education first.";

export const SECTION_NAMES = {
  summary: "Summary",
  skills: "Skills",
  experience: "Experience",
  projects: "Projects",
  education: "Education",
} as const satisfies Record<CvSectionId, string>;

export function showSectionLabel(name: string): string {
  return `Show ${name} on the CV`;
}

export function sectionTitleLabel(name: string): string {
  return `${name} title`;
}

export function reorderSectionLabel(name: string): string {
  return `Reorder ${name}`;
}

export function sectionMoved(
  name: string,
  position: number,
  count: number,
): string {
  return `Moved ${name} to position ${position} of ${count}.`;
}
