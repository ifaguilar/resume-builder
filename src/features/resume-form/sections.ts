import { m } from "#/paraglide/messages.js";

export const sections = [
  { id: "basics", title: m.form_basics_title, intro: m.form_basics_intro },
  { id: "skills", title: m.form_skills_title, intro: m.form_skills_intro },
  {
    id: "languages",
    title: m.form_languages_title,
    intro: m.form_languages_intro,
  },
  { id: "work", title: m.form_work_title, intro: m.form_work_intro },
  {
    id: "projects",
    title: m.form_projects_title,
    intro: m.form_projects_intro,
  },
  {
    id: "education",
    title: m.form_education_title,
    intro: m.form_education_intro,
  },
] as const;

export type SectionId = (typeof sections)[number]["id"];

export const DEFAULT_OPEN_SECTIONS: readonly SectionId[] = ["basics"];
