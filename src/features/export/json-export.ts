import {
  JSON_FINAL_NEWLINE,
  JSON_INDENT,
  SETTINGS_META_KEY,
} from "#/features/export/constants";
import type { Resume } from "#/features/resume/resume-schema";
import type { Settings } from "#/features/resume/settings-schema";

export function toJson(resume: Resume, settings: Settings): string {
  const file = {
    ...resume,
    meta: { ...resume.meta, [SETTINGS_META_KEY]: { settings } },
  };
  return JSON.stringify(file, null, JSON_INDENT) + JSON_FINAL_NEWLINE;
}
