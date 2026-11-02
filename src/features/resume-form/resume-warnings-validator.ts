import { toFieldName } from "#/features/resume-form/to-field-name";
import {
  type ResumeWarning,
  validateResume,
} from "#/features/resume/validate-resume";

export type FieldWarning = { message: string };

export type ResumeWarnings = {
  form: ResumeWarning[];
  fields: Record<string, FieldWarning[]>;
};

export function isFieldWarning(value: unknown): value is FieldWarning {
  return (
    typeof value === "object" &&
    value !== null &&
    "message" in value &&
    typeof value.message === "string"
  );
}

function isResumeWarning(value: unknown): value is ResumeWarning {
  return isFieldWarning(value) && "path" in value && Array.isArray(value.path);
}

export function isResumeWarningList(value: unknown): value is ResumeWarning[] {
  return Array.isArray(value) && value.every(isResumeWarning);
}

export function resumeWarningsValidator({
  value,
}: {
  value: unknown;
}): ResumeWarnings | undefined {
  const { warnings } = validateResume(value);
  if (warnings.length === 0) return undefined;

  const fields: Record<string, FieldWarning[]> = {};
  for (const warning of warnings) {
    const name = toFieldName(warning.path);
    fields[name] = [...(fields[name] ?? []), { message: warning.message }];
  }
  return { form: warnings, fields };
}
