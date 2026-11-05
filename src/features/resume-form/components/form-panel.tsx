import { BasicsSection } from "#/features/resume-form/components/basics-section";
import { EducationSection } from "#/features/resume-form/components/education-section";
import { LanguagesSection } from "#/features/resume-form/components/languages-section";
import { LiveAnnouncer } from "#/features/resume-form/components/live-announcer";
import { ProjectsSection } from "#/features/resume-form/components/projects-section";
import { SkillsSection } from "#/features/resume-form/components/skills-section";
import { useFormWarnings } from "#/features/resume-form/components/use-form-warnings";
import { WorkSection } from "#/features/resume-form/components/work-section";
import {
  DEFAULT_OPEN_SECTIONS,
  type SectionId,
  sections,
} from "#/features/resume-form/sections";
import type { ResumeForm } from "#/features/resume-form/use-resume-form";
import { sectionOf } from "#/features/resume-form/warning-paths";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "#/shared/components/ui/accordion";
import { Badge } from "#/shared/components/ui/badge";
import { ScrollArea } from "#/shared/components/ui/scroll-area";

const SECTION_COMPONENTS = {
  basics: BasicsSection,
  work: WorkSection,
  education: EducationSection,
  skills: SkillsSection,
  projects: ProjectsSection,
  languages: LanguagesSection,
} satisfies Record<SectionId, unknown>;

export function FormPanel({ form }: { form: ResumeForm }) {
  const warnings = useFormWarnings(form.store);

  return (
    <LiveAnnouncer>
      <ScrollArea className="h-full bg-background">
        <div className="flex flex-col p-4">
          <Accordion multiple defaultValue={[...DEFAULT_OPEN_SECTIONS]}>
            {sections.map((section) => {
              const Section = SECTION_COMPONENTS[section.id];
              const count = warnings.filter(
                (warning) => sectionOf(warning) === section.id,
              ).length;
              return (
                <AccordionItem key={section.id} value={section.id}>
                  <AccordionTrigger className="items-center px-5 py-4 hover:no-underline">
                    <span className="flex flex-col gap-1">
                      <span className="flex items-center gap-2">
                        <span className="text-base font-semibold">
                          {section.title}
                        </span>
                        {count > 0 ? (
                          <Badge
                            variant="outline"
                            className="border-warning/40 bg-warning/10 text-warning"
                          >
                            {count}
                            <span className="sr-only">
                              {count === 1 ? " warning" : " warnings"}
                            </span>
                          </Badge>
                        ) : null}
                      </span>
                      <span className="text-sm font-normal text-muted-foreground">
                        {section.intro}
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-1 pt-2 pb-6">
                    <Section form={form} />
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </ScrollArea>
    </LiveAnnouncer>
  );
}
