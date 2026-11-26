import type { CvSectionId } from "#/features/resume/constants";
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
    regions: "US, Canada, Mexico and parts of Latin America",
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
