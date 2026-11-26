import { CV_SECTION_IDS, type CvSectionId } from "#/features/resume/constants";
import type { Resume } from "#/features/resume/resume-schema";
import {
  DEGREE_AREA_JOINER,
  LANGUAGES_LABEL,
  LIST_SEPARATOR,
  MAILTO_PREFIX,
  SECTION_TITLES,
  TEL_PREFIX,
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
  header: ResumeHeader;
  sections: ResumeSection[];
};

function header(resume: Resume): ResumeHeader {
  const basics = resume.basics ?? {};
  const place = formatPlace(basics.location);
  const phone = cleanText(basics.phone);
  const email = cleanText(basics.email);
  const website = cleanText(basics.url);
  const profileUrls = (basics.profiles ?? [])
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
  entries: EntryContent[],
): ResumeSection | null {
  const filled = entries.filter(hasContent);
  return filled.length === 0
    ? null
    : { id, title: SECTION_TITLES[id], entries: filled };
}

function summary(resume: Resume): ResumeSection | null {
  const text = cleanText(resume.basics?.summary);
  return text ? { id: "summary", title: SECTION_TITLES.summary, text } : null;
}

function skills(resume: Resume): ResumeSection | null {
  const items = (resume.skills ?? [])
    .map((skill) => ({
      label: cleanText(skill.name),
      value: formatList(skill.keywords),
    }))
    .filter((item) => item.label || item.value);
  const languages = (resume.languages ?? [])
    .map((entry) => {
      const language = cleanText(entry.language);
      const fluency = cleanText(entry.fluency);
      return language && fluency ? `${language} (${fluency})` : language;
    })
    .filter((language) => language !== "")
    .join(LIST_SEPARATOR);
  if (languages) items.push({ label: LANGUAGES_LABEL, value: languages });

  return items.length === 0
    ? null
    : { id: "skills", title: SECTION_TITLES.skills, items };
}

function experience(resume: Resume): ResumeSection | null {
  return entrySection(
    "experience",
    (resume.work ?? []).map((work) => {
      const place = formatPlace(work.location);
      return {
        title: cleanText(work.position),
        date: formatDateRange(work.startDate, work.endDate),
        subtitle: cleanText(work.name),
        aside: place ? { text: place } : undefined,
        highlights: cleanList(work.highlights),
      };
    }),
  );
}

function projects(resume: Resume): ResumeSection | null {
  return entrySection(
    "projects",
    (resume.projects ?? []).map((project) => {
      const url = cleanText(project.url);
      return {
        title: cleanText(project.name),
        date: formatDateRange(project.startDate, project.endDate),
        subtitle: cleanText(project.description),
        aside: url ? { text: displayUrl(url), href: url } : undefined,
        highlights: cleanList(project.highlights),
      };
    }),
  );
}

function education(resume: Resume): ResumeSection | null {
  return entrySection(
    "education",
    (resume.education ?? []).map((entry) => ({
      title: [cleanText(entry.studyType), cleanText(entry.area)]
        .filter((part) => part !== "")
        .join(DEGREE_AREA_JOINER),
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
} satisfies Record<CvSectionId, (resume: Resume) => ResumeSection | null>;

// Everything a CV draws, already formatted and with empty parts left out.
// Templates only decide how it looks, so every template reads the same.
export function resumeContent(resume: Resume): ResumeContent {
  return {
    header: header(resume),
    sections: CV_SECTION_IDS.map((id) => SECTION_BUILDERS[id](resume)).filter(
      (section) => section !== null,
    ),
  };
}
