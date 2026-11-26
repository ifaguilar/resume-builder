import { describe, expect, it } from "vitest";

import { SETTINGS_META_KEY } from "#/features/export/constants";
import { IMPORT_ERROR_MESSAGES } from "#/features/import/constants";
import { fromJson } from "#/features/import/json-import";
import { WARNING_MESSAGES } from "#/features/resume/constants";
import { DEFAULT_SETTINGS } from "#/features/resume/settings-schema";
import { validateResume } from "#/features/resume/validate-resume";

function json(value: unknown): string {
  return JSON.stringify(value);
}

describe("fromJson", () => {
  it.each(["{", "", "not json", "{'a': 1}"])(
    "rejects invalid JSON %j",
    (text) => {
      expect(fromJson(text)).toEqual({
        ok: false,
        message: IMPORT_ERROR_MESSAGES.notJson(),
      });
    },
  );

  it.each([[], null, "resume", 1, true])(
    "rejects %j, which isn't a resume object",
    (value) => {
      expect(fromJson(json(value))).toEqual({
        ok: false,
        message: IMPORT_ERROR_MESSAGES.notAResume(),
      });
    },
  );

  it("keeps unknown keys, which validation reports", () => {
    const result = fromJson(json({ basics: { name: "Ada" }, hobby: "chess" }));
    if (!result.ok) throw new Error("expected an import");
    expect(result.draft.resume).toEqual({
      basics: { name: "Ada" },
      hobby: "chess",
    });
    expect(validateResume(result.draft.resume).warnings).toContainEqual({
      path: ["hobby"],
      message: WARNING_MESSAGES.unknownKey("hobby"),
    });
  });

  it("uses the default settings when the file has none", () => {
    const result = fromJson(json({ basics: { name: "Ada" } }));
    expect(result).toEqual({
      ok: true,
      draft: {
        resume: { basics: { name: "Ada" } },
        settings: DEFAULT_SETTINGS,
      },
    });
  });

  it("reads saved settings, filling in missing ones", () => {
    const result = fromJson(
      json({ meta: { [SETTINGS_META_KEY]: { settings: { pageSize: "A4" } } } }),
    );
    expect(result).toEqual({
      ok: true,
      draft: { resume: {}, settings: { ...DEFAULT_SETTINGS, pageSize: "A4" } },
    });
  });

  it("resets only the setting that is invalid", () => {
    const result = fromJson(
      json({
        meta: {
          [SETTINGS_META_KEY]: {
            settings: { pageSize: "A4", templateId: "nope" },
          },
        },
      }),
    );
    expect(result).toEqual({
      ok: true,
      draft: { resume: {}, settings: { ...DEFAULT_SETTINGS, pageSize: "A4" } },
    });
  });

  it.each([null, "A4", [], { settings: "A4" }])(
    "ignores an unreadable settings entry %j",
    (entry) => {
      const result = fromJson(json({ meta: { [SETTINGS_META_KEY]: entry } }));
      expect(result).toEqual({
        ok: true,
        draft: { resume: {}, settings: DEFAULT_SETTINGS },
      });
    },
  );

  it("keeps the other meta fields", () => {
    const result = fromJson(
      json({
        meta: {
          version: "v1.0.0",
          [SETTINGS_META_KEY]: { settings: DEFAULT_SETTINGS },
        },
      }),
    );
    if (!result.ok) throw new Error("expected an import");
    expect(result.draft.resume).toEqual({ meta: { version: "v1.0.0" } });
  });

  it("keeps a meta that isn't an object as it is", () => {
    const result = fromJson(json({ meta: "v1" }));
    if (!result.ok) throw new Error("expected an import");
    expect(result.draft.resume).toEqual({ meta: "v1" });
  });
});
