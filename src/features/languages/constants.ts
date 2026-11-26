import type { CvSectionId } from "#/features/resume/constants";
import type { PageSize } from "#/features/resume/settings-schema";
import { baseLocale, type Locale, locales } from "#/paraglide/runtime.js";

// One list for the CV and the UI: the locales in project.inlang/settings.json.
// A CV language is stored in `meta.language` by its base subtag.
export const CV_LANGUAGES = locales;
export type CvLanguage = Locale;
export const DEFAULT_CV_LANGUAGE: CvLanguage = baseLocale;

export type CvWords = {
  locale: string;
  // The document's name in the PDF file name and title, by paper size.
  documentWord: Record<PageSize, string>;
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
    // US and Canadian recruiters call the job document a resume and expect a
    // CV to be the long academic kind; Letter means the CV goes there.
    documentWord: { LETTER: "Resume", A4: "CV" },
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
    documentWord: { LETTER: "CV", A4: "CV" },
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
  fr: {
    locale: "fr",
    documentWord: { LETTER: "CV", A4: "CV" },
    sectionTitles: {
      summary: "Profil",
      skills: "Compétences",
      experience: "Expérience professionnelle",
      projects: "Projets",
      education: "Formation",
    },
    // A straight apostrophe, the form parsers match for an open-ended date.
    present: "aujourd'hui",
    degreeAreaJoiner: " en ",
    languagesLabel: "Langues",
    fluencySuggestions: [
      "Notions",
      "Intermédiaire",
      "Courant",
      "Bilingue",
      "Langue maternelle",
    ],
    fluencyExample: "Courant",
    degreeSuggestions: [
      "Baccalauréat",
      "BTS",
      "BUT",
      "Licence",
      "Master",
      "MBA",
      "Doctorat",
      "Certificat professionnel",
    ],
    degreeExample: "Licence",
  },
  de: {
    locale: "de",
    documentWord: { LETTER: "Lebenslauf", A4: "Lebenslauf" },
    sectionTitles: {
      summary: "Profil",
      skills: "Kenntnisse",
      experience: "Berufserfahrung",
      projects: "Projekte",
      education: "Ausbildung",
    },
    present: "heute",
    degreeAreaJoiner: " in ",
    languagesLabel: "Sprachen",
    fluencySuggestions: [
      "Grundkenntnisse",
      "Gute Kenntnisse",
      "Fließend",
      "Verhandlungssicher",
      "Muttersprache",
    ],
    fluencyExample: "Fließend",
    degreeSuggestions: [
      "Abitur",
      "Berufsausbildung",
      "Bachelor",
      "Master",
      "MBA",
      "Promotion",
      "Zertifikat",
    ],
    degreeExample: "Bachelor",
  },
} as const satisfies Record<CvLanguage, CvWords>;

export const CV_LANGUAGE_LEGEND = "CV language";
export const CV_LANGUAGE_TIP =
  "Write your CV in the language of the job posting.";
// Matches no option, so none is selected while the stored language is one
// the CV can't use.
export const NO_CV_LANGUAGE = "";

// A card's sample line: the Experience title and an open range from this
// month, in the CV's own words.
export const CV_LANGUAGE_SAMPLE_START = "2023-09";
export const CV_LANGUAGE_SAMPLE_SEPARATOR = " · ";

export function unsupportedLanguage(value: string): string {
  return `This resume's language is "${value}"; the CV uses English.`;
}
