import { z } from "zod";

import {
  DEFAULT_TEMPLATE_ID,
  DEFAULT_THEME_ID,
  TEMPLATE_IDS,
  THEME_IDS,
} from "#/features/resume/constants";

// Presentation only. Resume data lives in resume-schema.ts.
export const settingsSchema = z.strictObject({
  templateId: z.enum(TEMPLATE_IDS),
  themeId: z.enum(THEME_IDS),
});

export type Settings = z.infer<typeof settingsSchema>;

export const DEFAULT_SETTINGS: Settings = {
  templateId: DEFAULT_TEMPLATE_ID,
  themeId: DEFAULT_THEME_ID,
};
