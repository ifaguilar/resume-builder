export const JSON_RESUME_SCHEMA_VERSION = "1.11.0";

// The official "iso8601" definition: YYYY, YYYY-MM or YYYY-MM-DD.
export const PARTIAL_DATE_PATTERN =
  /^([1-2][0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])|[1-2][0-9]{3}-(0[1-9]|1[0-2])|[1-2][0-9]{3})$/;

export const FULL_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
export const DATE_PART_SEPARATOR = "-";
// How far from this year a resume date can be before it looks like a typo.
export const DATE_RANGE_YEARS = 100;

export const WARNING_MESSAGES = {
  email: "Enter a valid email address, like name@example.com",
  url: "Use a full web address starting with https://",
  date: "Use YYYY, YYYY-MM or YYYY-MM-DD",
  nonexistentDate: "This date doesn't exist",
  futureDate: "This date is in the future",
  endBeforeStart: "The end date is before the start date",
  dateTooOld: `This date is more than ${DATE_RANGE_YEARS} years ago`,
  dateTooFar: `This date is more than ${DATE_RANGE_YEARS} years from now`,
  location: "Use text or an address",
  notAnObject: "A resume must be a JSON object",
  unknownKey: (key: string) =>
    `"${key}" is not part of JSON Resume. It will be kept; consider moving it under "custom".`,
} as const;

export const LOCATION_PART_KEYS = [
  "address",
  "city",
  "region",
  "postalCode",
  "countryCode",
] as const;
export const LOCATION_PART_SEPARATOR = ", ";

// The sections a CV draws under its header, in their default order.
export const CV_SECTION_IDS = [
  "summary",
  "skills",
  "experience",
  "projects",
  "education",
] as const;
export type CvSectionId = (typeof CV_SECTION_IDS)[number];
// Stays right under the header; the other sections can be reordered.
export const FIXED_SECTION_ID = "summary" satisfies CvSectionId;

// The languages a CV can be written in, as `meta.language` stores them.
export const CV_LANGUAGES = ["en", "es"] as const;
export type CvLanguage = (typeof CV_LANGUAGES)[number];
export const DEFAULT_CV_LANGUAGE: CvLanguage = "en";

export const TEMPLATE_IDS = ["default"] as const;
export const THEME_IDS = ["default"] as const;
export const DEFAULT_TEMPLATE_ID = TEMPLATE_IDS[0];
export const DEFAULT_THEME_ID = THEME_IDS[0];
// react-pdf's own page size names.
export const PAGE_SIZES = ["LETTER", "A4"] as const;
export const DEFAULT_PAGE_SIZE = PAGE_SIZES[0];
