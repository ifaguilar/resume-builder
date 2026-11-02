import type { FieldWarning } from "#/features/resume-form/resume-warnings-validator";
import { FieldError } from "#/shared/components/ui/field";

export function FieldWarnings({ warnings }: { warnings: FieldWarning[] }) {
  return <FieldError errors={warnings} className="text-warning" />;
}
