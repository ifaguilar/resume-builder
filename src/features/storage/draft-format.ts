import type { Resume } from "#/features/resume/resume-schema";
import {
  parseSettings,
  type Settings,
} from "#/features/resume/settings-schema";
import { DRAFT_FORMAT_VERSION } from "#/features/storage/constants";
import { isRecord } from "#/shared/lib/is-record";

export type Draft = { resume: Resume; settings: Settings };

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
