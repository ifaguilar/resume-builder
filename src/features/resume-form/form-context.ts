import { createFormHookContexts } from "@tanstack/react-form";

// Kept apart from use-resume-form.ts so field components can read the field
// context without importing the hook that registers them.
export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();
