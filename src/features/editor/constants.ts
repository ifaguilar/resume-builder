// react-resizable-panels: numbers are pixels. Percentages need the "%" unit,
// or the server renders an invalid flex-basis and the layout jumps on load.
export const FORM_PANEL_DEFAULT_SIZE_PERCENT = "45%";
export const FORM_PANEL_MIN_SIZE_PX = 360;
export const PREVIEW_PANEL_DEFAULT_SIZE_PERCENT = "55%";
export const PREVIEW_PANEL_MIN_SIZE_PX = 400;
export const RESIZE_TARGET_FINE_PX = 16;
export const RESIZE_TARGET_COARSE_PX = 28;
export const DRAFT_SAVE_DEBOUNCE_MS = 500;
export const PREVIEW_DEBOUNCE_MS = 300;
export const EDITOR_TABS = ["content", "design"] as const;
export type EditorTab = (typeof EDITOR_TABS)[number];
export const EDITOR_TAB_LABELS: Record<EditorTab, string> = {
  content: "Content",
  design: "Design",
};
export const DEFAULT_EDITOR_TAB: EditorTab = "content";
