import { m } from "#/paraglide/messages.js";

// react-resizable-panels: numbers are pixels. Percentages need the "%" unit,
// or the server renders an invalid flex-basis and the layout jumps on load.
export const FORM_PANEL_DEFAULT_SIZE_PERCENT = "45%";
export const FORM_PANEL_MIN_SIZE_PX = 360;
export const PREVIEW_PANEL_DEFAULT_SIZE_PERCENT = "55%";
export const PREVIEW_PANEL_MIN_SIZE_PX = 400;
export const RESIZE_TARGET_FINE_PX = 16;
export const RESIZE_TARGET_COARSE_PX = 28;
export const DRAFT_SAVE_DEBOUNCE_MS = 500;
export const PREVIEW_DEBOUNCE_MS = 1000;
export const EDITOR_TABS = ["content", "design", "settings"] as const;
export type EditorTab = (typeof EDITOR_TABS)[number];
export const EDITOR_TAB_LABELS = {
  content: m.editor_tab_content,
  design: m.editor_tab_design,
  settings: m.editor_tab_settings,
} satisfies Record<EditorTab, () => string>;
// A placeholder until the project is named, so it isn't translated.
export const APP_NAME = "Resume Builder";
export const DEFAULT_EDITOR_TAB: EditorTab = "content";
