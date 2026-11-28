import { m } from "#/paraglide/messages.js";

export const JSON_RESUME_SCHEMA_VERSION = "1.11.0";

// The official "iso8601" definition: YYYY, YYYY-MM or YYYY-MM-DD.
export const PARTIAL_DATE_PATTERN =
  /^([1-2][0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])|[1-2][0-9]{3}-(0[1-9]|1[0-2])|[1-2][0-9]{3})$/;

export const FULL_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
export const DATE_PART_SEPARATOR = "-";
// How far from this year a resume date can be before it looks like a typo.
export const DATE_RANGE_YEARS = 100;

export const WARNING_MESSAGES = {
  email: () => m.resume_warning_email(),
  url: () => m.resume_warning_url(),
  date: () => m.resume_warning_date(),
  nonexistentDate: () => m.resume_warning_nonexistent_date(),
  futureDate: () => m.resume_warning_future_date(),
  endBeforeStart: () => m.resume_warning_end_before_start(),
  dateTooOld: () => m.resume_warning_date_too_old({ years: DATE_RANGE_YEARS }),
  dateTooFar: () => m.resume_warning_date_too_far({ years: DATE_RANGE_YEARS }),
  location: () => m.resume_warning_location(),
  markdownBlock: () => m.resume_warning_markdown_block(),
  notAnObject: () => m.resume_warning_not_an_object(),
  unknownKey: (key: string) => m.resume_warning_unknown_key({ key }),
} as const;

// A line the CV prints as typed because it starts like a Markdown heading,
// list item or table row.
export const MARKDOWN_BLOCK_LINE =
  /^ {0,3}(?:#{1,6}(?:\s|$)|[-*+]\s|\d{1,9}[.)]\s|\|)/m;

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

export const TEMPLATE_IDS = ["default"] as const;
export const DEFAULT_TEMPLATE_ID = TEMPLATE_IDS[0];
// The form `<input type="color">` gives its value in.
export const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/i;
// Tailwind's blue-600. Kept here, not in the template's tokens, so the
// settings don't load the PDF styling library.
export const DEFAULT_ACCENT_COLOR = "#2563eb";
// react-pdf's own page size names.
export const PAGE_SIZES = ["LETTER", "A4"] as const;
export const DEFAULT_PAGE_SIZE = PAGE_SIZES[0];
