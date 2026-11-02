import {
  BASICS_FIELD_DEPTH,
  EDITED_BASICS_KEYS,
  EDITED_ENTRY_KEYS,
  EDITED_LOCATION_KEYS,
  EDITED_PROFILE_KEYS,
  type EntrySectionId,
  NESTED_FIELD_DEPTH,
  PROFILE_FIELD_DEPTH,
} from "#/features/resume-form/constants";
import type { SectionId } from "#/features/resume-form/sections";
import type { Basics } from "#/features/resume/resume-schema";
import type { ResumeWarning } from "#/features/resume/validate-resume";

const BASICS_SECTION: SectionId = "basics";
const LOCATION_KEY = "location" satisfies keyof Basics;
const PROFILES_KEY = "profiles" satisfies keyof Basics;

function isOneOf(keys: readonly string[], key: unknown): boolean {
  return typeof key === "string" && keys.includes(key);
}

function isEntrySection(section: unknown): section is EntrySectionId {
  return (
    typeof section === "string" && Object.hasOwn(EDITED_ENTRY_KEYS, section)
  );
}

export function sectionOf(warning: ResumeWarning): string | undefined {
  const [section] = warning.path;
  return typeof section === "string" ? section : undefined;
}

export function hasInput(warning: ResumeWarning): boolean {
  const { path } = warning;
  const [section, second, third, fourth] = path;

  if (section === BASICS_SECTION) {
    if (second === LOCATION_KEY) {
      return (
        path.length === NESTED_FIELD_DEPTH &&
        isOneOf(EDITED_LOCATION_KEYS, third)
      );
    }
    if (second === PROFILES_KEY) {
      return (
        path.length === PROFILE_FIELD_DEPTH &&
        typeof third === "number" &&
        isOneOf(EDITED_PROFILE_KEYS, fourth)
      );
    }
    return (
      path.length === BASICS_FIELD_DEPTH && isOneOf(EDITED_BASICS_KEYS, second)
    );
  }

  if (isEntrySection(section)) {
    return (
      path.length === NESTED_FIELD_DEPTH &&
      typeof second === "number" &&
      isOneOf(EDITED_ENTRY_KEYS[section], third)
    );
  }

  return false;
}
