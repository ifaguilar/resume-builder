import { z } from "zod";

import {
  FULL_DATE_PATTERN,
  PARTIAL_DATE_PATTERN,
  WARNING_MESSAGES,
} from "#/features/resume/constants";

// A strict copy of JSON Resume v1.7.0 (see JSON_RESUME_SCHEMA_VERSION).
// Every field is optional, and unknown keys are reported (never removed).

function isRealCalendarDate(value: string): boolean {
  const match = FULL_DATE_PATTERN.exec(value);
  if (!match) return true;
  const [, year, month, day] = match.map(Number);
  if (year === undefined || month === undefined || day === undefined)
    return true;
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

// An empty string means "not filled in yet", so it never warns.
function optionalFormat<T extends z.ZodType<string>>(schema: T) {
  return z.union([z.literal(""), schema]).optional();
}

const text = z.string().optional();
const textList = z.array(z.string()).optional();
const email = optionalFormat(z.email({ error: WARNING_MESSAGES.email }));
const url = optionalFormat(z.httpUrl({ error: WARNING_MESSAGES.url }));
const partialDate = optionalFormat(
  z
    .string()
    .regex(PARTIAL_DATE_PATTERN, { error: WARNING_MESSAGES.date })
    .refine(isRealCalendarDate, { error: WARNING_MESSAGES.nonexistentDate }),
);
// Free-form tool data; preserved unchanged and never rendered.
const custom = z.record(z.string(), z.unknown()).optional();

export const locationSchema = z.strictObject({
  address: text,
  postalCode: text,
  city: text,
  countryCode: text,
  region: text,
});

const entryLocation = z
  .union([z.string(), locationSchema], { error: WARNING_MESSAGES.location })
  .optional();

export const profileSchema = z.strictObject({
  network: text,
  username: text,
  url,
});

export const basicsSchema = z.strictObject({
  name: text,
  label: text,
  pronouns: text,
  image: text,
  email,
  phone: text,
  url,
  summary: text,
  location: locationSchema.optional(),
  profiles: z.array(profileSchema).optional(),
  custom,
});

export const workSchema = z.strictObject({
  name: text,
  location: entryLocation,
  description: text,
  position: text,
  url,
  startDate: partialDate,
  endDate: partialDate,
  summary: text,
  highlights: textList,
  keywords: textList,
  custom,
});

export const volunteerSchema = z.strictObject({
  organization: text,
  location: entryLocation,
  position: text,
  url,
  startDate: partialDate,
  endDate: partialDate,
  summary: text,
  highlights: textList,
  custom,
});

export const educationSchema = z.strictObject({
  institution: text,
  location: entryLocation,
  url,
  area: text,
  studyType: text,
  startDate: partialDate,
  endDate: partialDate,
  score: text,
  courses: textList,
  summary: text,
  custom,
});

export const awardSchema = z.strictObject({
  title: text,
  date: partialDate,
  awarder: text,
  summary: text,
  custom,
});

export const certificateSchema = z.strictObject({
  name: text,
  date: partialDate,
  url,
  credentialId: text,
  issuer: text,
  expiryDate: partialDate,
  summary: text,
  custom,
});

export const publicationSchema = z.strictObject({
  name: text,
  authors: textList,
  publisher: text,
  releaseDate: partialDate,
  volume: text,
  issue: text,
  pages: text,
  // The spec allows any extra string identifier, so these don't warn.
  identifiers: z
    .object({ doi: text, isbn: text, arxiv: text })
    .catchall(z.string())
    .optional(),
  url,
  summary: text,
  type: text,
  custom,
});

export const skillSchema = z.strictObject({
  name: text,
  level: text,
  keywords: textList,
  custom,
});

export const languageSchema = z.strictObject({
  language: text,
  fluency: text,
  custom,
});

export const interestSchema = z.strictObject({
  name: text,
  keywords: textList,
  custom,
});

export const referenceSchema = z.strictObject({
  name: text,
  reference: text,
  relationship: text,
  organization: text,
  date: partialDate,
  availableOnRequest: z.boolean().optional(),
  custom,
});

export const projectSchema = z.strictObject({
  name: text,
  summary: text,
  description: text,
  highlights: textList,
  keywords: textList,
  startDate: partialDate,
  endDate: partialDate,
  url,
  roles: textList,
  entity: text,
  type: text,
  custom,
});

export const metaSchema = z.strictObject({
  canonical: url,
  version: text,
  lastModified: text,
});

export const resumeSchema = z.strictObject({
  $schema: url,
  basics: basicsSchema.optional(),
  objective: text,
  work: z.array(workSchema).optional(),
  volunteer: z.array(volunteerSchema).optional(),
  education: z.array(educationSchema).optional(),
  awards: z.array(awardSchema).optional(),
  certificates: z.array(certificateSchema).optional(),
  publications: z.array(publicationSchema).optional(),
  skills: z.array(skillSchema).optional(),
  languages: z.array(languageSchema).optional(),
  interests: z.array(interestSchema).optional(),
  references: z.array(referenceSchema).optional(),
  projects: z.array(projectSchema).optional(),
  meta: metaSchema.optional(),
  custom,
});

export type Resume = z.infer<typeof resumeSchema>;
export type Basics = z.infer<typeof basicsSchema>;
export type Location = z.infer<typeof locationSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type WorkEntry = z.infer<typeof workSchema>;
export type VolunteerEntry = z.infer<typeof volunteerSchema>;
export type EducationEntry = z.infer<typeof educationSchema>;
export type Award = z.infer<typeof awardSchema>;
export type Certificate = z.infer<typeof certificateSchema>;
export type Publication = z.infer<typeof publicationSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type Language = z.infer<typeof languageSchema>;
export type Interest = z.infer<typeof interestSchema>;
export type Reference = z.infer<typeof referenceSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Meta = z.infer<typeof metaSchema>;
