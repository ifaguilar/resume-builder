// The JSON Resume spec version the Zod schema mirrors (@jsonresume/schema).
export const JSON_RESUME_SCHEMA_VERSION = "1.7.0";

// The official "iso8601" definition: YYYY, YYYY-MM or YYYY-MM-DD.
export const PARTIAL_DATE_PATTERN =
  /^([1-2][0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])|[1-2][0-9]{3}-(0[1-9]|1[0-2])|[1-2][0-9]{3})$/;

// A full YYYY-MM-DD date, captured as year, month and day.
export const FULL_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export const WARNING_MESSAGES = {
  email: "Enter a valid email address, like name@example.com",
  url: "Use a full web address starting with https://",
  date: "Use YYYY, YYYY-MM or YYYY-MM-DD",
  nonexistentDate: "This date doesn't exist",
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

export const TEMPLATE_IDS = ["classic"] as const;
export const THEME_IDS = ["default"] as const;
export const DEFAULT_TEMPLATE_ID = TEMPLATE_IDS[0];
export const DEFAULT_THEME_ID = THEME_IDS[0];
