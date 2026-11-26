import { WORD_SEPARATOR } from "#/features/ats/constants";
import { toWords } from "#/features/ats/extract-text";
import type { Resume } from "#/features/resume/resume-schema";
import {
  DEGREE_AREA_JOINER,
  LABEL_SUFFIX,
  LANGUAGES_LABEL,
  LIST_SEPARATOR,
  SECTION_TITLES,
} from "#/features/templates/constants";
import {
  cleanList,
  cleanText,
  displayUrl,
  formatDateRange,
  formatList,
  formatPlace,
  formatYear,
} from "#/features/templates/format";

function labeled(label: string, value: string): string {
  if (!label) return value;
  return value ? label + LABEL_SUFFIX + value : label;
}

function section(title: string, texts: string[]): string[] {
  const words = texts.flatMap(toWords);
  return words.length === 0 ? [] : [title.toUpperCase(), ...words];
}

function header(resume: Resume): string[] {
  const basics = resume.basics ?? {};
  return [
    cleanText(basics.name),
    cleanText(basics.label),
    formatPlace(basics.location),
    cleanText(basics.phone),
    cleanText(basics.email),
    displayUrl(basics.url),
    ...(basics.profiles ?? []).map((profile) => displayUrl(profile.url)),
  ].flatMap(toWords);
}

function skills(resume: Resume): string[] {
  const groups = (resume.skills ?? []).map((skill) =>
    labeled(cleanText(skill.name), formatList(skill.keywords)),
  );
  const languages = (resume.languages ?? [])
    .map((entry) => {
      const language = cleanText(entry.language);
      const fluency = cleanText(entry.fluency);
      return language && fluency ? `${language} (${fluency})` : language;
    })
    .filter((language) => language !== "")
    .join(LIST_SEPARATOR);
  return section(SECTION_TITLES.skills, [
    ...groups,
    languages ? labeled(LANGUAGES_LABEL, languages) : "",
  ]);
}

function experience(resume: Resume): string[] {
  return section(
    SECTION_TITLES.experience,
    (resume.work ?? []).flatMap((work) => [
      cleanText(work.position),
      formatDateRange(work.startDate, work.endDate),
      cleanText(work.name),
      formatPlace(work.location),
      cleanList(work.highlights).join(WORD_SEPARATOR),
    ]),
  );
}

function projects(resume: Resume): string[] {
  return section(
    SECTION_TITLES.projects,
    (resume.projects ?? []).flatMap((project) => [
      cleanText(project.name),
      formatDateRange(project.startDate, project.endDate),
      cleanText(project.description),
      displayUrl(project.url),
      cleanList(project.highlights).join(WORD_SEPARATOR),
    ]),
  );
}

function education(resume: Resume): string[] {
  return section(
    SECTION_TITLES.education,
    (resume.education ?? []).flatMap((entry) => [
      [cleanText(entry.studyType), cleanText(entry.area)]
        .filter((part) => part !== "")
        .join(DEGREE_AREA_JOINER),
      formatYear(entry.endDate),
      cleanText(entry.institution),
    ]),
  );
}

// Every word the classic template draws, in its reading order. Built with the
// template's own formatters, so a parser should read exactly these words.
export function expectedWords(resume: Resume): string[] {
  return [
    ...header(resume),
    ...section(SECTION_TITLES.summary, [cleanText(resume.basics?.summary)]),
    ...skills(resume),
    ...experience(resume),
    ...projects(resume),
    ...education(resume),
  ];
}
