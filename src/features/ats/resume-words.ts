import { toWords } from "#/features/ats/extract-text";
import type { Resume } from "#/features/resume/resume-schema";
import type { Settings } from "#/features/resume/settings-schema";
import { LABEL_SUFFIX } from "#/features/templates/constants";
import {
  type ResumeSection,
  resumeContent,
} from "#/features/templates/resume-content";

function labeled(label: string, value: string): string {
  if (!label) return value;
  return value ? label + LABEL_SUFFIX + value : label;
}

function sectionTexts(section: ResumeSection): string[] {
  switch (section.id) {
    case "summary":
      return [section.text];
    case "skills":
      return section.items.map((item) => labeled(item.label, item.value));
    default:
      return section.entries.flatMap((entry) => [
        entry.title,
        entry.date,
        entry.subtitle,
        entry.aside?.text ?? "",
        ...entry.highlights,
      ]);
  }
}

// Every word the CV draws, in its reading order. Headings are upper-cased
// like the drawn ones, so a parser should read exactly these words.
export function expectedWords(resume: Resume, settings: Settings): string[] {
  const { header, sections } = resumeContent(resume, settings);
  return [
    header.name,
    header.label,
    ...header.contacts.map((contact) => contact.text),
    ...sections.flatMap((section) =>
      [section.title.toUpperCase()].concat(sectionTexts(section)),
    ),
  ].flatMap(toWords);
}
