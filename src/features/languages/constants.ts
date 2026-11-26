import type { CvSectionId } from "#/features/resume/constants";

// The languages a CV can be written in, as `meta.language` stores them.
export const CV_LANGUAGES = ["en", "es"] as const;
export type CvLanguage = (typeof CV_LANGUAGES)[number];
export const DEFAULT_CV_LANGUAGE: CvLanguage = "en";

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

export const CV_LANGUAGE_LEGEND = "CV language";
export const CV_LANGUAGE_TIP =
  "Write your CV in the language of the job posting.";
// Matches no option, so none is selected while the stored language is one
// the CV can't use.
export const NO_CV_LANGUAGE = "";

export const CV_LANGUAGE_OPTIONS = [
  { value: "en", title: "English", sample: "Sep 2023 - Present" },
  { value: "es", title: "Español", sample: "sept 2023 - actualidad" },
] as const satisfies readonly {
  value: CvLanguage;
  title: string;
  sample: string;
}[];

export function unsupportedLanguage(value: string): string {
  return `This resume's language is "${value}"; the CV uses English.`;
}
