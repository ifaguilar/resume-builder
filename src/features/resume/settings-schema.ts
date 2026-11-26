import { z } from "zod";

import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_TEMPLATE_ID,
  DEFAULT_THEME_ID,
  PAGE_SIZES,
  TEMPLATE_IDS,
  THEME_IDS,
} from "#/features/resume/constants";

export const settingsSchema = z.strictObject({
  templateId: z.enum(TEMPLATE_IDS),
  themeId: z.enum(THEME_IDS),
  pageSize: z.enum(PAGE_SIZES),
});

export type Settings = z.infer<typeof settingsSchema>;
export type PageSize = Settings["pageSize"];

export const DEFAULT_SETTINGS: Settings = {
  templateId: DEFAULT_TEMPLATE_ID,
  themeId: DEFAULT_THEME_ID,
  pageSize: DEFAULT_PAGE_SIZE,
};

// Drafts and files saved before a setting existed lack it, so whatever is
// absent or unreadable gets its default.
export function parseSettings(value: unknown): Settings {
  const result = settingsSchema.partial().safeParse(value);
  return { ...DEFAULT_SETTINGS, ...(result.success ? result.data : {}) };
}
