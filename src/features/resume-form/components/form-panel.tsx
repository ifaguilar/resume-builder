import {
  DEFAULT_OPEN_SECTIONS,
  sections,
} from "#/features/resume-form/sections";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "#/shared/components/ui/accordion";

export function FormPanel() {
  return (
    <div className="h-full overflow-y-auto p-4">
      <Accordion multiple defaultValue={[...DEFAULT_OPEN_SECTIONS]}>
        {sections.map((section) => (
          <AccordionItem key={section.id} value={section.id}>
            <AccordionTrigger>{section.title}</AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">
                Fields for this section arrive in the next wave.
              </p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
