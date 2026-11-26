import type { CvSectionId } from "#/features/resume/constants";
import type { SectionSetting } from "#/features/resume/settings-schema";

// A title that only repeats the default isn't kept, so it can't hold the old
// language's word after the CV language changes.
export function sectionTitleSetting(
  text: string,
  defaultTitle: string,
): string | undefined {
  const title = text.trim();
  return title === "" || title === defaultTitle ? undefined : title;
}

export function sectionSetting(
  id: CvSectionId,
  visible: boolean,
  title: string | undefined,
): SectionSetting {
  const section: SectionSetting = { id, visible };
  if (title !== undefined) section.title = title;
  return section;
}

export function updateSection(
  sections: SectionSetting[],
  id: CvSectionId,
  change: (section: SectionSetting) => SectionSetting,
): SectionSetting[] {
  const index = sections.findIndex((section) => section.id === id);
  const section = sections[index];
  if (section === undefined) return sections;
  const next = change(section);
  // Returning the same list lets React skip an edit that changed nothing.
  if (next.visible === section.visible && next.title === section.title) {
    return sections;
  }
  return sections.with(index, next);
}

// Moves within the sections after the fixed first one.
export function moveSection(
  sections: SectionSetting[],
  from: number,
  to: number,
): SectionSetting[] {
  const [fixed, ...movable] = sections;
  const moved = movable.toSpliced(from, 1);
  const item = movable[from];
  if (fixed === undefined || item === undefined) return sections;
  return [fixed, ...moved.toSpliced(to, 0, item)];
}
