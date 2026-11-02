import { useStore } from "@tanstack/react-form";

import { isResumeWarningList } from "#/features/resume-form/resume-warnings-validator";
import type { ResumeForm } from "#/features/resume-form/use-resume-form";
import type { ResumeWarning } from "#/features/resume/validate-resume";

const NO_WARNINGS: ResumeWarning[] = [];

export function useFormWarnings(store: ResumeForm["store"]): ResumeWarning[] {
  const formError: unknown = useStore(
    store,
    (state) => state.errorMap.onChange,
  );
  return isResumeWarningList(formError) ? formError : NO_WARNINGS;
}
