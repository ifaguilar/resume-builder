import {
  CV_LANGUAGES,
  type CvLanguage,
  DEFAULT_CV_LANGUAGE,
} from "#/features/resume/constants";
import type { Resume } from "#/features/resume/resume-schema";
import type { PageSize } from "#/features/resume/settings-schema";
import {
  CV_WORD,
  CV_WORDS,
  type CvWords,
  RESUME_WORD,
} from "#/features/templates/constants";

const SUBTAG_SEPARATOR = "-";

function primarySubtag(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const subtag = value.trim().split(SUBTAG_SEPARATOR)[0]?.toLowerCase();
  return subtag || undefined;
}

function isCvLanguage(value: string | undefined): value is CvLanguage {
  return CV_LANGUAGES.some((language) => language === value);
}

// `meta.language` is a BCP 47 tag, so "es-MX" is Spanish too.
export function cvLanguage(resume: Resume): CvLanguage {
  const subtag = primarySubtag(resume.meta?.language);
  return isCvLanguage(subtag) ? subtag : DEFAULT_CV_LANGUAGE;
}

// A stored language the CV can't be drawn in, so the UI can say so.
export function unsupportedCvLanguage(resume: Resume): string | undefined {
  const value: unknown = resume.meta?.language;
  const subtag = primarySubtag(value);
  return subtag === undefined || isCvLanguage(subtag)
    ? undefined
    : String(value).trim();
}

export function cvWords(language: CvLanguage): CvWords {
  return CV_WORDS[language];
}

// The paper size already says where the CV is going: Letter means the US,
// Canada or Mexico, where an English one is a resume.
export function documentWord(language: CvLanguage, pageSize: PageSize): string {
  return language === "en" && pageSize === "LETTER" ? RESUME_WORD : CV_WORD;
}
