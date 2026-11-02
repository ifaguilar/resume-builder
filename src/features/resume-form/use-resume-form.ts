import { createFormHook, formOptions } from "@tanstack/react-form";
import { useEffect } from "react";

import { EMPTY_RESUME } from "#/features/resume-form/constants";
import { AutocompleteField } from "#/features/resume-form/fields/autocomplete-field";
import { CountryField } from "#/features/resume-form/fields/country-field";
import { DateField } from "#/features/resume-form/fields/date-field";
import { HighlightsField } from "#/features/resume-form/fields/highlights-field";
import { KeywordsField } from "#/features/resume-form/fields/keywords-field";
import { LocationField } from "#/features/resume-form/fields/location-field";
import { TextField } from "#/features/resume-form/fields/text-field";
import { TextareaField } from "#/features/resume-form/fields/textarea-field";
import { fieldContext, formContext } from "#/features/resume-form/form-context";
import { resumeWarningsValidator } from "#/features/resume-form/resume-warnings-validator";

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    TextareaField,
    DateField,
    LocationField,
    HighlightsField,
    KeywordsField,
    AutocompleteField,
    CountryField,
  },
  formComponents: {},
});

export const resumeFormOptions = formOptions({
  defaultValues: EMPTY_RESUME,
  validators: { onChange: resumeWarningsValidator },
});

export function useResumeForm() {
  const form = useAppForm(resumeFormOptions);

  // Validate the starting data too. An onMount validator would leave stale
  // warnings on fields after they're fixed, so run the onChange one instead.
  useEffect(() => {
    void form.validate("change");
  }, [form]);

  return form;
}

export type ResumeForm = ReturnType<typeof useResumeForm>;
