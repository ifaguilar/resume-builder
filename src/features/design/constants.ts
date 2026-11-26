import type { CvSectionId } from "#/features/resume/constants";
import type { PageSize } from "#/features/resume/settings-schema";
import { m } from "#/paraglide/messages.js";

export const PAGE_SIZE_OPTIONS = [
  {
    value: "LETTER",
    title: m.design_letter_title,
    dimensions: m.design_letter_dimensions,
    regions: m.design_letter_regions,
  },
  {
    value: "A4",
    title: m.design_a4_title,
    dimensions: m.design_a4_dimensions,
    regions: m.design_a4_regions,
  },
] as const satisfies readonly {
  value: PageSize;
  title: () => string;
  dimensions: () => string;
  regions: () => string;
}[];

export const SECTION_NAMES = {
  summary: m.design_section_summary,
  skills: m.design_section_skills,
  experience: m.design_section_experience,
  projects: m.design_section_projects,
  education: m.design_section_education,
} as const satisfies Record<CvSectionId, () => string>;
