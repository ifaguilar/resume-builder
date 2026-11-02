import { useId } from "react";

import { FieldWarnings } from "#/features/resume-form/fields/field-warnings";
import { useVisibleWarnings } from "#/features/resume-form/fields/use-visible-warnings";
import { useFieldContext } from "#/features/resume-form/form-context";
import {
  toOptionalText,
  toTrimmedText,
} from "#/features/resume-form/to-optional-text";
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "#/shared/components/ui/field";
import { Textarea } from "#/shared/components/ui/textarea";

type TextareaFieldProps = {
  label: string;
  description?: string;
  placeholder?: string;
};

export function TextareaField({
  label,
  description,
  placeholder,
}: TextareaFieldProps) {
  const field = useFieldContext<string | undefined>();
  const { warnings, isInvalid, focusProps } = useVisibleWarnings(field);
  const id = useId();

  return (
    <Field
      data-invalid={isInvalid || undefined}
      className="gap-1.5 data-[invalid=true]:text-warning"
    >
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Textarea
        id={id}
        name={field.name}
        value={field.state.value ?? ""}
        placeholder={placeholder}
        aria-invalid={isInvalid || undefined}
        className="border-foreground/15 bg-background shadow-xs hover:bg-background aria-invalid:border-warning aria-invalid:ring-warning/20 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-warning/50 dark:aria-invalid:ring-warning/40"
        onChange={(event) =>
          field.handleChange(toOptionalText(event.target.value))
        }
        onFocus={focusProps.onFocus}
        onBlur={() => {
          field.handleChange(toTrimmedText(field.state.value));
          focusProps.onBlur();
        }}
      />
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      <FieldWarnings warnings={warnings} />
    </Field>
  );
}
