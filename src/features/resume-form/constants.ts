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
import { m } from "#/paraglide/messages.js";

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
// Any Gregorian year works: month names don't depend on it.
export const MONTH_NAMES_REFERENCE_YEAR = 2000;

export const POPUP_SIDE_OFFSET_PX = 6;

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

export const YEARS_PER_PAGE = 12;
export const YEAR_GRID_COLUMNS = 3;
export const YEAR_RANGE_SEPARATOR = " – ";

// Entry kinds get whole sentences of their own: other languages inflect the
// words around the entry's name.
export type EntryMessages = {
  empty: () => string;
  add: () => string;
  untitled: () => string;
  reorder: () => string;
  remove: () => string;
  removeTitle: () => string;
  moved: (inputs: { position: number; count: number }) => string;
};

export const ENTRY_MESSAGES = {
  profile: {
    empty: m.form_profile_empty,
    add: m.form_profile_add,
    untitled: m.form_profile_untitled,
    reorder: m.form_profile_reorder,
    remove: m.form_profile_remove,
    removeTitle: m.form_profile_remove_title,
    moved: m.form_profile_moved,
  },
  category: {
    empty: m.form_category_empty,
    add: m.form_category_add,
    untitled: m.form_category_untitled,
    reorder: m.form_category_reorder,
    remove: m.form_category_remove,
    removeTitle: m.form_category_remove_title,
    moved: m.form_category_moved,
  },
  language: {
    empty: m.form_language_empty,
    add: m.form_language_add,
    untitled: m.form_language_untitled,
    reorder: m.form_language_reorder,
    remove: m.form_language_remove,
    removeTitle: m.form_language_remove_title,
    moved: m.form_language_moved,
  },
  work: {
    empty: m.form_work_empty,
    add: m.form_work_add,
    untitled: m.form_work_untitled,
    reorder: m.form_work_reorder,
    remove: m.form_work_remove,
    removeTitle: m.form_work_remove_title,
    moved: m.form_work_moved,
  },
  project: {
    empty: m.form_project_empty,
    add: m.form_project_add,
    untitled: m.form_project_untitled,
    reorder: m.form_project_reorder,
    remove: m.form_project_remove,
    removeTitle: m.form_project_remove_title,
    moved: m.form_project_moved,
  },
  education: {
    empty: m.form_education_empty,
    add: m.form_education_add,
    untitled: m.form_education_untitled,
    reorder: m.form_education_reorder,
    remove: m.form_education_remove,
    removeTitle: m.form_education_remove_title,
    moved: m.form_education_moved,
  },
} as const satisfies Record<string, EntryMessages>;
