export const sections = [
  { id: "basics", title: "Basics" },
  { id: "work", title: "Work" },
  { id: "education", title: "Education" },
  { id: "skills", title: "Skills" },
  { id: "projects", title: "Projects" },
  { id: "languages", title: "Languages" },
] as const;

export type SectionId = (typeof sections)[number]["id"];

export const DEFAULT_OPEN_SECTIONS: readonly SectionId[] = ["basics"];
