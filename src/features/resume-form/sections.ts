export const sections = [
  {
    id: "basics",
    title: "Basics",
    intro: "Who you are and how recruiters reach you.",
  },
  {
    id: "work",
    title: "Work",
    intro: "Most recent first. Focus on the last 10 years.",
  },
  {
    id: "education",
    title: "Education",
    intro: "Your highest degree first.",
  },
  {
    id: "skills",
    title: "Skills",
    intro: "The tools and methods the job asks for.",
  },
  {
    id: "projects",
    title: "Projects",
    intro: "Work that shows your skills, especially early in your career.",
  },
  {
    id: "languages",
    title: "Languages",
    intro: "Languages you could use at work.",
  },
] as const;

export type SectionId = (typeof sections)[number]["id"];

export const DEFAULT_OPEN_SECTIONS: readonly SectionId[] = ["basics"];
