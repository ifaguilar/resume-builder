import type { CvLanguage, CvSectionId } from "#/features/resume/constants";
import { PDF_FONT_FEATURES } from "#/features/templates/fonts/constants";

export const BODY_SIZE_PT = 10;
// A section heading moves to the next page unless this many body lines of
// space remain after it: room for an entry's two-line header and a
// three-line first bullet, which never split.
export const KEEP_WITH_NEXT_LINES = 5;
const TEXT_XS_REM = 0.75;
// Makes Tailwind's text-xs exactly 10 pt, the body size of the original CV,
// so every other size and spacing step scales from it.
export const PT_PER_REM = BODY_SIZE_PT / TEXT_XS_REM;

export const BULLET = "•";
export const DATE_RANGE_SEPARATOR = " - ";
export const LIST_SEPARATOR = ", ";
export const PLACE_SEPARATOR = ", ";
export const LABEL_SUFFIX = ": ";
export const DOCUMENT_TITLE_SEPARATOR = " ";
export const TEL_PREFIX = "tel:";
export const MAILTO_PREFIX = "mailto:";

// US and Canadian recruiters call the job document a resume and expect a CV
// to be the long academic kind; most other countries, Spanish included, say CV.
export const RESUME_WORD = "Resume";
export const CV_WORD = "CV";

export type CvWords = {
  locale: string;
  sectionTitles: Record<CvSectionId, string>;
  present: string;
  degreeAreaJoiner: string;
  languagesLabel: string;
  fluencySuggestions: readonly string[];
  fluencyExample: string;
  degreeSuggestions: readonly string[];
  degreeExample: string;
};

// The words a CV draws, by its language. Regional locales are avoided on
// purpose: en-GB writes "Sept", es-MX "sep" where es writes "sept".
export const CV_WORDS = {
  en: {
    locale: "en-US",
    sectionTitles: {
      summary: "Summary",
      skills: "Skills",
      experience: "Work Experience",
      projects: "Projects",
      education: "Education",
    },
    present: "Present",
    degreeAreaJoiner: " in ",
    languagesLabel: "Languages",
    fluencySuggestions: [
      "Elementary proficiency",
      "Limited working proficiency",
      "Professional working proficiency",
      "Full professional proficiency",
      "Native or bilingual proficiency",
    ],
    fluencyExample: "Professional working proficiency",
    degreeSuggestions: [
      "High school diploma",
      "Associate degree",
      "Bachelor's degree",
      "Master's degree",
      "MBA",
      "Doctorate (PhD)",
      "Professional certificate",
    ],
    degreeExample: "Bachelor's degree",
  },
  es: {
    locale: "es",
    sectionTitles: {
      summary: "Perfil profesional",
      skills: "Habilidades",
      experience: "Experiencia laboral",
      projects: "Proyectos",
      education: "Formación académica",
    },
    present: "actualidad",
    degreeAreaJoiner: " en ",
    languagesLabel: "Idiomas",
    fluencySuggestions: [
      "Competencia básica",
      "Competencia básica limitada",
      "Competencia básica profesional",
      "Competencia profesional completa",
      "Competencia bilingüe o nativa",
    ],
    fluencyExample: "Competencia profesional completa",
    degreeSuggestions: [
      "Bachillerato",
      "Técnico superior",
      "Grado",
      "Licenciatura",
      "Máster",
      "MBA",
      "Doctorado",
      "Certificado profesional",
    ],
    degreeExample: "Grado",
  },
} as const satisfies Record<CvLanguage, CvWords>;

// A child's fontFeatureSettings replaces the Page's instead of merging, so
// tabular-nums (['tnum']) alone would turn calt back on for dates.
export const PDF_DATE_FEATURES = { ...PDF_FONT_FEATURES, tnum: 1 };
