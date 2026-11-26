import type { CvLanguage, CvWords } from "#/features/languages/constants";
import { cvLanguage, cvWords } from "#/features/languages/cv-language";
import type { CvSectionId } from "#/features/resume/constants";
import type { Resume } from "#/features/resume/resume-schema";
import type { Settings } from "#/features/resume/settings-schema";
import { cleanText, entriesOf } from "#/features/resume/stored-value";
import {
  LIST_SEPARATOR,
  MAILTO_PREFIX,
  TEL_PREFIX,
} from "#/features/templates/constants";
import {
  cleanList,
  displayUrl,
  formatDateRange,
  formatList,
  formatPlace,
  formatYear,
} from "#/features/templates/format";
import { isRecord } from "#/shared/lib/is-record";

const PHONE_LINK_JUNK = /[^\d+]/g;

// Text the CV draws, with the link it carries when there is one.
export type LinkedText = { text: string; href?: string };

export type LabeledItem = { label: string; value: string };

export type EntryContent = {
  title: string;
  date: string;
  subtitle: string;
  aside?: LinkedText;
  highlights: string[];
};

type EntrySectionId = Extract<
  CvSectionId,
  "experience" | "projects" | "education"
>;

export type ResumeSection =
  | { id: "summary"; title: string; text: string }
  | { id: "skills"; title: string; items: LabeledItem[] }
  | { id: EntrySectionId; title: string; entries: EntryContent[] };

export type ResumeHeader = {
  name: string;
  label: string;
  contacts: LinkedText[];
};

export type ResumeContent = {
  language: CvLanguage;
  header: ResumeHeader;
  sections: ResumeSection[];
};

function basicsOf(resume: Resume): NonNullable<Resume["basics"]> {
  return isRecord(resume.basics) ? resume.basics : {};
}

function header(resume: Resume, words: CvWords): ResumeHeader {
  const basics = basicsOf(resume);
  const place = formatPlace(basics.location, words.locale);
  const phone = cleanText(basics.phone);
  const email = cleanText(basics.email);
  const website = cleanText(basics.url);
  const profileUrls = entriesOf(basics.profiles)
    .map((profile) => cleanText(profile.url))
    .filter((url) => url !== "");

  const contacts: LinkedText[] = [];
  if (place) contacts.push({ text: place });
  if (phone) {
    contacts.push({
      text: phone,
      href: TEL_PREFIX + phone.replace(PHONE_LINK_JUNK, ""),
    });
  }
  if (email) contacts.push({ text: email, href: MAILTO_PREFIX + email });
  for (const url of website ? [website, ...profileUrls] : profileUrls) {
    contacts.push({ text: displayUrl(url), href: url });
  }

  return {
    name: cleanText(basics.name),
    label: cleanText(basics.label),
    contacts,
  };
}

function hasContent(entry: EntryContent): boolean {
  return Boolean(
    entry.title ||
    entry.date ||
    entry.subtitle ||
    entry.aside ||
    entry.highlights.length > 0,
  );
}

function entrySection(
  id: EntrySectionId,
  title: string,
  entries: EntryContent[],
): ResumeSection | null {
  const filled = entries.filter(hasContent);
  return filled.length === 0 ? null : { id, title, entries: filled };
}

function summary(resume: Resume, title: string): ResumeSection | null {
  const text = cleanText(basicsOf(resume).summary);
  return text ? { id: "summary", title, text } : null;
}

function skills(
  resume: Resume,
  title: string,
  words: CvWords,
): ResumeSection | null {
  const items = entriesOf(resume.skills)
    .map((skill) => ({
      label: cleanText(skill.name),
      value: formatList(skill.keywords),
    }))
    .filter((item) => item.label || item.value);
  const languages = entriesOf(resume.languages)
    .map((entry) => {
      const language = cleanText(entry.language);
      const fluency = cleanText(entry.fluency);
      return language && fluency ? `${language} (${fluency})` : language;
    })
    .filter((language) => language !== "")
    .join(LIST_SEPARATOR);
  if (languages) items.push({ label: words.languagesLabel, value: languages });

  return items.length === 0 ? null : { id: "skills", title, items };
}

function experience(
  resume: Resume,
  title: string,
  words: CvWords,
): ResumeSection | null {
  return entrySection(
    "experience",
    title,
    entriesOf(resume.work).map((work) => {
      const place = formatPlace(work.location, words.locale);
      return {
        title: cleanText(work.position),
        date: formatDateRange(work.startDate, work.endDate, words),
        subtitle: cleanText(work.name),
        aside: place ? { text: place } : undefined,
        highlights: cleanList(work.highlights),
      };
    }),
  );
}

function projects(
  resume: Resume,
  title: string,
  words: CvWords,
): ResumeSection | null {
  return entrySection(
    "projects",
    title,
    entriesOf(resume.projects).map((project) => {
      const url = cleanText(project.url);
      return {
        title: cleanText(project.name),
        date: formatDateRange(project.startDate, project.endDate, words),
        subtitle: cleanText(project.description),
        aside: url ? { text: displayUrl(url), href: url } : undefined,
        highlights: cleanList(project.highlights),
      };
    }),
  );
}

function education(
  resume: Resume,
  title: string,
  words: CvWords,
): ResumeSection | null {
  return entrySection(
    "education",
    title,
    entriesOf(resume.education).map((entry) => ({
      title: [cleanText(entry.studyType), cleanText(entry.area)]
        .filter((part) => part !== "")
        .join(words.degreeAreaJoiner),
      date: formatYear(entry.endDate),
      subtitle: cleanText(entry.institution),
      highlights: [],
    })),
  );
}

const SECTION_BUILDERS = {
  summary,
  skills,
  experience,
  projects,
  education,
} satisfies Record<
  CvSectionId,
  (resume: Resume, title: string, words: CvWords) => ResumeSection | null
>;

// Everything a CV draws, already formatted, in the order and with the titles
// the settings choose, and with hidden and empty parts left out. Templates
// only decide how it looks, so every template reads the same.
export function resumeContent(
  resume: Resume,
  settings: Settings,
): ResumeContent {
  const language = cvLanguage(resume);
  const words = cvWords(language);
  return {
    language,
    header: header(resume, words),
    sections: settings.sections
      .filter((section) => section.visible)
      .map((section) =>
        SECTION_BUILDERS[section.id](
          resume,
          section.title ?? words.sectionTitles[section.id],
          words,
        ),
      )
      .filter((section) => section !== null),
  };
}
