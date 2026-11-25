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
