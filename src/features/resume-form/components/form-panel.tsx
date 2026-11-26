import { TriangleAlertIcon } from "lucide-react";
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-m";

import { BasicsSection } from "#/features/resume-form/components/basics-section";
import { EducationSection } from "#/features/resume-form/components/education-section";
import { LanguagesSection } from "#/features/resume-form/components/languages-section";
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
import { m } from "#/paraglide/messages.js";
import { LiveAnnouncer } from "#/shared/components/live-announcer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "#/shared/components/ui/accordion";
import { Badge } from "#/shared/components/ui/badge";
import { ScrollArea } from "#/shared/components/ui/scroll-area";
import { popInOut } from "#/shared/lib/motion-transitions";

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
      {/* A container query can't style its own element, and the padding
          below depends on the width. */}
      <ScrollArea className="@container/form h-full bg-background">
        <div className="flex flex-col p-2 @lg/form:p-4">
          <Accordion
            multiple
            // A closed panel would unmount its fields, and TanStack Form clears
            // an unmounted field's warnings.
            keepMounted
            defaultValue={[...DEFAULT_OPEN_SECTIONS]}
            // shadcn's AccordionContent pads its panel element, which its
            // className doesn't reach.
            className="[&_[data-slot=accordion-content]]:px-2 @lg/form:[&_[data-slot=accordion-content]]:px-4"
          >
            {sections.map((section) => {
              const Section = SECTION_COMPONENTS[section.id];
              const count = warnings.filter(
                (warning) => sectionOf(warning) === section.id,
              ).length;
              return (
                <AccordionItem key={section.id} value={section.id}>
                  <AccordionTrigger className="items-center px-3 py-4 hover:no-underline @lg/form:px-5">
                    <span className="flex flex-col gap-1">
                      <span className="flex items-center gap-2">
                        <span className="text-base font-semibold">
                          {section.title()}
                        </span>
                        <AnimatePresence initial={false}>
                          {count > 0 ? (
                            <motion.span
                              key="warnings"
                              className="inline-flex"
                              {...popInOut}
                            >
                              <Badge
                                variant="outline"
                                className="border-warning/40 bg-warning/10 text-warning"
                              >
                                <TriangleAlertIcon aria-hidden />
                                {m.form_warning_count({ count })}
                              </Badge>
                            </motion.span>
                          ) : null}
                        </AnimatePresence>
                      </span>
                      <span className="text-sm font-normal text-muted-foreground">
                        {section.intro()}
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
