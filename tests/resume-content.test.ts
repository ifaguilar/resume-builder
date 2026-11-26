import { describe, expect, it } from "vitest";

import { CV_WORDS } from "#/features/languages/constants";
import { CV_SECTION_IDS } from "#/features/resume/constants";
import type { Resume } from "#/features/resume/resume-schema";
import {
  DEFAULT_SETTINGS,
  type Settings,
} from "#/features/resume/settings-schema";
import {
  type ResumeSection,
  resumeContent,
} from "#/features/templates/resume-content";

const SECTION_TITLES = CV_WORDS.en.sectionTitles;

function section(resume: Resume, id: ResumeSection["id"]) {
  return resumeContent(resume, DEFAULT_SETTINGS).sections.find(
    (item) => item.id === id,
  );
}

const FULL_RESUME: Resume = {
  basics: { name: "Ana", summary: "Builds things." },
  work: [{ position: "Engineer" }],
  projects: [{ name: "Tool" }],
  education: [{ institution: "University" }],
  skills: [{ name: "Languages", keywords: ["Go"] }],
};

describe("resumeContent", () => {
  it("gives an empty resume an empty header and no sections", () => {
    expect(resumeContent({}, DEFAULT_SETTINGS)).toEqual({
      language: "en",
      header: { name: "", label: "", contacts: [] },
      sections: [],
    });
  });

  it("orders sections and titles them", () => {
    const { sections } = resumeContent(FULL_RESUME, DEFAULT_SETTINGS);
    expect(sections.map(({ id, title }) => [id, title])).toEqual(
      CV_SECTION_IDS.map((id) => [id, SECTION_TITLES[id]]),
    );
  });

  it("lists contacts in order with their links", () => {
    const { header } = resumeContent(
      {
        basics: {
          name: " Ana Pérez ",
          label: "Engineer",
          location: { city: "Austin", countryCode: "US" },
          phone: "+1 (555) 010-2000",
          email: "ana@example.com",
          url: "https://ana.example/",
          profiles: [
            { network: "GitHub", url: "https://github.com/ana" },
            { network: "LinkedIn", url: "" },
          ],
        },
      },
      DEFAULT_SETTINGS,
    );
    expect(header).toEqual({
      name: "Ana Pérez",
      label: "Engineer",
      contacts: [
        { text: "Austin, United States" },
        { text: "+1 (555) 010-2000", href: "tel:+15550102000" },
        { text: "ana@example.com", href: "mailto:ana@example.com" },
        { text: "ana.example", href: "https://ana.example/" },
        { text: "github.com/ana", href: "https://github.com/ana" },
      ],
    });
  });

  it("drops entries whose fields are all empty", () => {
    expect(
      section(
        { work: [{}, { position: " " }, { startDate: "2023-09" }] },
        "experience",
      ),
    ).toEqual({
      id: "experience",
      title: SECTION_TITLES.experience,
      entries: [
        {
          title: "",
          date: "Sep 2023 - Present",
          subtitle: "",
          highlights: [],
        },
      ],
    });
    expect(section({ work: [{}], projects: [{}] }, "projects")).toBeUndefined();
  });

  it("shows a work place as plain text and a project URL as a link", () => {
    expect(
      section({ work: [{ name: "Acme", location: "Remote" }] }, "experience"),
    ).toMatchObject({ entries: [{ aside: { text: "Remote" } }] });
    expect(
      section(
        { projects: [{ name: "Tool", url: "https://tool.example/" }] },
        "projects",
      ),
    ).toMatchObject({
      entries: [
        { aside: { text: "tool.example", href: "https://tool.example/" } },
      ],
    });
  });

  it.each([
    [{ studyType: "Bachelor", area: "Physics" }, "Bachelor in Physics"],
    [{ studyType: "Bachelor" }, "Bachelor"],
    [{ area: "Physics" }, "Physics"],
  ])("titles education %j as %j", (entry, title) => {
    expect(section({ education: [entry] }, "education")).toMatchObject({
      entries: [{ title }],
    });
  });

  it("adds languages as the last skills item", () => {
    expect(
      section(
        {
          skills: [{ name: "Tools", keywords: ["Git", "Docker"] }, {}],
          languages: [
            { language: "English", fluency: "Native" },
            { language: "Spanish" },
            { fluency: "Basic" },
          ],
        },
        "skills",
      ),
    ).toEqual({
      id: "skills",
      title: SECTION_TITLES.skills,
      items: [
        { label: "Tools", value: "Git, Docker" },
        { label: "Languages", value: "English (Native), Spanish" },
      ],
    });
  });

  it("keeps the skills section when it only has languages", () => {
    expect(section({ languages: [{ language: "German" }] }, "skills")).toEqual({
      id: "skills",
      title: SECTION_TITLES.skills,
      items: [{ label: "Languages", value: "German" }],
    });
  });
});

function sectionsWith(sections: Settings["sections"]): Settings {
  return { ...DEFAULT_SETTINGS, sections };
}

describe("resumeContent with section settings", () => {
  it("follows the saved order", () => {
    const settings = sectionsWith([
      { id: "summary", visible: true },
      { id: "education", visible: true },
      { id: "skills", visible: true },
      { id: "projects", visible: true },
      { id: "experience", visible: true },
    ]);
    expect(
      resumeContent(FULL_RESUME, settings).sections.map(({ id }) => id),
    ).toEqual(["summary", "education", "skills", "projects", "experience"]);
  });

  it("leaves hidden sections out, the summary included", () => {
    const settings = sectionsWith(
      CV_SECTION_IDS.map((id) => ({
        id,
        visible: id !== "summary" && id !== "projects",
      })),
    );
    expect(
      resumeContent(FULL_RESUME, settings).sections.map(({ id }) => id),
    ).toEqual(["skills", "experience", "education"]);
  });

  it("uses a custom title, in any CV language", () => {
    const settings = sectionsWith(
      CV_SECTION_IDS.map((id) =>
        id === "experience"
          ? { id, visible: true, title: "Work History" }
          : { id, visible: true },
      ),
    );
    for (const language of ["en", "es"]) {
      const { sections } = resumeContent(
        { ...FULL_RESUME, meta: { language } },
        settings,
      );
      expect(sections.find(({ id }) => id === "experience")?.title).toBe(
        "Work History",
      );
    }
  });
});

describe("resumeContent in Spanish", () => {
  const SPANISH: Resume = {
    basics: { location: { city: "Logroño", countryCode: "ES" } },
    work: [{ position: "Desarrolladora", startDate: "2023-09" }],
    education: [{ studyType: "Grado", area: "Ingeniería Informática" }],
    skills: [{ name: "Web", keywords: ["React"] }],
    languages: [{ language: "Inglés", fluency: "C1" }],
    meta: { language: "es-MX" },
  };
  const content = resumeContent(SPANISH, DEFAULT_SETTINGS);

  it("says it is Spanish", () => {
    expect(content.language).toBe("es");
  });

  it("titles sections in Spanish", () => {
    expect(content.sections.map(({ title }) => title)).toEqual([
      "Habilidades",
      "Experiencia laboral",
      "Formación académica",
    ]);
  });

  it("writes dates, places, degrees and labels in Spanish", () => {
    expect(content.header.contacts).toEqual([{ text: "Logroño, España" }]);
    expect(content.sections).toMatchObject([
      { items: [{ label: "Web" }, { label: "Idiomas", value: "Inglés (C1)" }] },
      { entries: [{ date: "sept 2023 - actualidad" }] },
      { entries: [{ title: "Grado en Ingeniería Informática" }] },
    ]);
  });
});
