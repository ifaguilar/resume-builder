import { SETTINGS_META_KEY } from "#/features/export/constants";
import { IMPORT_ERROR_MESSAGES } from "#/features/import/constants";
import { parseSettings } from "#/features/resume/settings-schema";
import type { Draft } from "#/features/storage/draft-format";
import { isRecord } from "#/shared/lib/is-record";

export type ImportResult =
  | { ok: true; draft: Draft }
  | { ok: false; message: string };

// Only the file's shape is checked here. A resume that breaks schema rules
// still imports, and the form shows its warnings.
export function fromJson(text: string): ImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, message: IMPORT_ERROR_MESSAGES.notJson };
  }
  if (!isRecord(parsed)) {
    return { ok: false, message: IMPORT_ERROR_MESSAGES.notAResume };
  }

  const { meta, ...rest } = parsed;
  if (!isRecord(meta)) {
    return {
      ok: true,
      draft: { resume: parsed, settings: parseSettings(undefined) },
    };
  }

  // The settings come back out of `meta`, so they aren't stored twice.
  const { [SETTINGS_META_KEY]: toolMeta, ...otherMeta } = meta;
  const settings = parseSettings(
    isRecord(toolMeta) ? toolMeta.settings : undefined,
  );
  const resume =
    Object.keys(otherMeta).length > 0 ? { ...rest, meta: otherMeta } : rest;
  return { ok: true, draft: { resume, settings } };
}
