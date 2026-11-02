import type {
  Basics,
  EducationEntry,
  Language,
  Location,
  Profile,
  Project,
  Resume,
  Skill,
  WorkEntry,
} from "#/features/resume/resume-schema";

export const EMPTY_RESUME: Resume = {};

export const ENTER_KEY = "Enter";
export const ESCAPE_KEY = "Escape";
export const BACKSPACE_KEY = "Backspace";
export const ARROW_LEFT_KEY = "ArrowLeft";
export const ARROW_RIGHT_KEY = "ArrowRight";
export const ARROW_UP_KEY = "ArrowUp";
export const ARROW_DOWN_KEY = "ArrowDown";
export const HOME_KEY = "Home";
export const END_KEY = "End";

export const KEYWORD_COMMIT_KEYS: readonly string[] = [ENTER_KEY, ","];
export const KEYWORD_SEPARATOR = ",";

export const ENTRY_TITLE_SEPARATOR = " · ";

export const HTTPS_PREFIX = "https://";

export const MONTHS_PER_YEAR = 12;
export const MONTH_GRID_COLUMNS = 3;
export const MONTH_DIGITS = 2;
// The years PARTIAL_DATE_PATTERN accepts.
export const MIN_PICKER_YEAR = 1000;
export const MAX_PICKER_YEAR = 2999;
export const DATE_PART_SEPARATOR = "-";
export const DISPLAY_LOCALE = "en";

export const POPUP_SIDE_OFFSET_PX = 6;

export const FLUENCY_SUGGESTIONS = [
  "Elementary proficiency",
  "Limited working proficiency",
  "Professional working proficiency",
  "Full professional proficiency",
  "Native or bilingual proficiency",
] as const;

export const DEGREE_SUGGESTIONS = [
  "High school diploma",
  "Associate degree",
  "Bachelor's degree",
  "Master's degree",
  "MBA",
  "Doctorate (PhD)",
  "Professional certificate",
] as const;

// Path lengths of the inputs the form binds: basics.email,
// work[0].startDate or basics.location.city, basics.profiles[0].url.
export const BASICS_FIELD_DEPTH = 2;
export const NESTED_FIELD_DEPTH = 3;
export const PROFILE_FIELD_DEPTH = 4;

// Keys left out (address, GPA, skill level, ...) stay in the data; their
// warnings show in the section's list.
export const EDITED_BASICS_KEYS = [
  "name",
  "label",
  "email",
  "phone",
  "url",
  "summary",
] as const satisfies readonly (keyof Basics)[];

export const EDITED_LOCATION_KEYS = [
  "city",
  "region",
  "countryCode",
] as const satisfies readonly (keyof Location)[];

export const EDITED_PROFILE_KEYS = [
  "network",
  "url",
] as const satisfies readonly (keyof Profile)[];

const EDITED_WORK_KEYS = [
  "name",
  "position",
  "location",
  "startDate",
  "endDate",
  "highlights",
] as const satisfies readonly (keyof WorkEntry)[];

const EDITED_EDUCATION_KEYS = [
  "institution",
  "studyType",
  "area",
  "endDate",
] as const satisfies readonly (keyof EducationEntry)[];

const EDITED_SKILL_KEYS = [
  "name",
  "keywords",
] as const satisfies readonly (keyof Skill)[];

const EDITED_PROJECT_KEYS = [
  "name",
  "description",
  "url",
  "highlights",
  "keywords",
] as const satisfies readonly (keyof Project)[];

const EDITED_LANGUAGE_KEYS = [
  "language",
  "fluency",
] as const satisfies readonly (keyof Language)[];

export const EDITED_ENTRY_KEYS = {
  work: EDITED_WORK_KEYS,
  education: EDITED_EDUCATION_KEYS,
  skills: EDITED_SKILL_KEYS,
  projects: EDITED_PROJECT_KEYS,
  languages: EDITED_LANGUAGE_KEYS,
} as const;

export type EntrySectionId = keyof typeof EDITED_ENTRY_KEYS;
