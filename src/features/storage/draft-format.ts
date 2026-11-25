import type { Resume } from "#/features/resume/resume-schema";
import {
  DEFAULT_SETTINGS,
  type Settings,
  settingsSchema,
} from "#/features/resume/settings-schema";
import { DRAFT_FORMAT_VERSION } from "#/features/storage/constants";

export type Draft = { resume: Resume; settings: Settings };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Drafts saved before settings existed have none, and later settings are
// missing from older drafts, so whatever is absent or unreadable gets its
// default.
function parseSettings(value: unknown): Settings {
  const result = settingsSchema.partial().safeParse(value);
  return { ...DEFAULT_SETTINGS, ...(result.success ? result.data : {}) };
}

export function serializeDraft(draft: Draft): string {
  return JSON.stringify({
    version: DRAFT_FORMAT_VERSION,
    resume: draft.resume,
    settings: draft.settings,
  });
}

// Only the envelope is checked. A resume that breaks schema rules still
// loads, and validateResume shows its warnings.
export function parseDraft(text: string): Draft | undefined {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return undefined;
  }
  if (!isRecord(parsed) || parsed.version !== DRAFT_FORMAT_VERSION) {
    return undefined;
  }
  if (!isRecord(parsed.resume)) return undefined;
  return { resume: parsed.resume, settings: parseSettings(parsed.settings) };
}
