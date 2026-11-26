import { z } from "zod";

import {
  CV_SECTION_IDS,
  FIXED_SECTION_ID,
  DEFAULT_PAGE_SIZE,
  DEFAULT_TEMPLATE_ID,
  DEFAULT_THEME_ID,
  PAGE_SIZES,
  TEMPLATE_IDS,
  THEME_IDS,
} from "#/features/resume/constants";
import { isRecord } from "#/shared/lib/is-record";

// No title means the CV language's default one.
export const sectionSettingSchema = z.strictObject({
  id: z.enum(CV_SECTION_IDS),
  visible: z.boolean(),
  title: z.string().optional(),
});

export const settingsSchema = z.strictObject({
  templateId: z.enum(TEMPLATE_IDS),
  themeId: z.enum(THEME_IDS),
  pageSize: z.enum(PAGE_SIZES),
  sections: z.array(sectionSettingSchema),
});

export type SectionSetting = z.infer<typeof sectionSettingSchema>;
export type Settings = z.infer<typeof settingsSchema>;
export type PageSize = Settings["pageSize"];

function defaultSections(): SectionSetting[] {
  return CV_SECTION_IDS.map((id) => ({ id, visible: true }));
}

export const DEFAULT_SETTINGS: Settings = {
  templateId: DEFAULT_TEMPLATE_ID,
  themeId: DEFAULT_THEME_ID,
  pageSize: DEFAULT_PAGE_SIZE,
  sections: defaultSections(),
};

function parseOr<T>(schema: z.ZodType<T>, value: unknown, fallback: T): T {
  const result = schema.safeParse(value);
  return result.success ? result.data : fallback;
}

function parseSection(value: unknown): SectionSetting | undefined {
  const result = sectionSettingSchema.safeParse(value);
  if (!result.success) return undefined;
  const { id, visible } = result.data;
  const section: SectionSetting = { id, visible };
  const title = result.data.title?.trim();
  if (title) section.title = title;
  return section;
}

// A broken entry resets only its own section; a section missing from a saved
// order (one added in a later version, say) goes back after the section it
// follows by default. Summary always stays first, under the header.
export function parseSections(value: unknown): SectionSetting[] {
  if (!Array.isArray(value)) return defaultSections();
  const sections: SectionSetting[] = [];
  for (const item of value) {
    const section = parseSection(item);
    if (section && !sections.some(({ id }) => id === section.id)) {
      sections.push(section);
    }
  }
  const has = (id: string) => sections.some((section) => section.id === id);
  for (const [index, id] of CV_SECTION_IDS.entries()) {
    if (has(id)) continue;
    const previous = CV_SECTION_IDS.slice(0, index).findLast(has);
    const at =
      previous === undefined
        ? 0
        : sections.findIndex((section) => section.id === previous) + 1;
    sections.splice(at, 0, { id, visible: true });
  }
  return sections.toSorted(
    (a, b) =>
      Number(b.id === FIXED_SECTION_ID) - Number(a.id === FIXED_SECTION_ID),
  );
}

// Drafts and files saved before a setting existed lack it, and an invalid one
// resets only itself.
export function parseSettings(value: unknown): Settings {
  const input = isRecord(value) ? value : {};
  const { shape } = settingsSchema;
  return {
    templateId: parseOr(
      shape.templateId,
      input.templateId,
      DEFAULT_SETTINGS.templateId,
    ),
    themeId: parseOr(shape.themeId, input.themeId, DEFAULT_SETTINGS.themeId),
    pageSize: parseOr(
      shape.pageSize,
      input.pageSize,
      DEFAULT_SETTINGS.pageSize,
    ),
    sections: parseSections(input.sections),
  };
}
