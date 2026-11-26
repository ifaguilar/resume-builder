import { describe, expect, it } from "vitest";

import { CV_SECTION_IDS } from "#/features/resume/constants";
import type { Resume } from "#/features/resume/resume-schema";
import { SECTION_TITLES } from "#/features/templates/constants";
import {
  type ResumeSection,
  resumeContent,
} from "#/features/templates/resume-content";

function section(resume: Resume, id: ResumeSection["id"]) {
  return resumeContent(resume).sections.find((item) => item.id === id);
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
    expect(resumeContent({})).toEqual({
      header: { name: "", label: "", contacts: [] },
      sections: [],
    });
  });

  it("orders sections and titles them", () => {
    const { sections } = resumeContent(FULL_RESUME);
    expect(sections.map(({ id, title }) => [id, title])).toEqual(
      CV_SECTION_IDS.map((id) => [id, SECTION_TITLES[id]]),
    );
  });

  it("lists contacts in order with their links", () => {
    const { header } = resumeContent({
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
    });
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
