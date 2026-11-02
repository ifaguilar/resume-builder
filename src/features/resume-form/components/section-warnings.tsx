import { TriangleAlertIcon } from "lucide-react";

import { useFormWarnings } from "#/features/resume-form/components/use-form-warnings";
import type { SectionId } from "#/features/resume-form/sections";
import { toFieldName } from "#/features/resume-form/to-field-name";
import type { ResumeForm } from "#/features/resume-form/use-resume-form";
import { hasInput, sectionOf } from "#/features/resume-form/warning-paths";

type SectionWarningsProps = {
  store: ResumeForm["store"];
  section: SectionId;
};

export function SectionWarnings({ store, section }: SectionWarningsProps) {
  const warnings = useFormWarnings(store).filter(
    (warning) => sectionOf(warning) === section && !hasInput(warning),
  );
  if (warnings.length === 0) return null;

  return (
    <div className="flex gap-2 rounded-xl border border-warning/30 bg-warning/5 p-3 text-sm">
      <TriangleAlertIcon className="mt-0.5 size-4 shrink-0 text-warning" />
      <ul className="flex flex-col gap-1">
        {warnings.map((warning) => {
          const name = toFieldName(warning.path);
          return (
            <li key={`${name}:${warning.message}`}>
              <code className="font-mono text-xs">{name}</code>:{" "}
              {warning.message}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
