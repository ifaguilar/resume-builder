import { useId } from "react";

import { FieldWarnings } from "#/features/resume-form/fields/field-warnings";
import { useVisibleWarnings } from "#/features/resume-form/fields/use-visible-warnings";
import { useFieldContext } from "#/features/resume-form/form-context";
import {
  toOptionalText,
  toTrimmedText,
} from "#/features/resume-form/to-optional-text";
import { withHttps } from "#/features/resume-form/with-https";
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "#/shared/components/ui/field";
import { Input } from "#/shared/components/ui/input";

type TextFieldProps = {
  label: string;
  description?: string;
  placeholder?: string;
  type?: "text" | "email" | "tel" | "url";
  autoComplete?: string;
};

export function TextField({
  label,
  description,
  placeholder,
  type = "text",
  autoComplete,
}: TextFieldProps) {
  const field = useFieldContext<string | undefined>();
  const { warnings, isInvalid, focusProps } = useVisibleWarnings(field);
  const id = useId();

  return (
    <Field
      data-invalid={isInvalid || undefined}
      className="gap-1.5 data-[invalid=true]:text-warning"
    >
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        id={id}
        name={field.name}
        type={type}
        value={field.state.value ?? ""}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={isInvalid || undefined}
        className="border-foreground/15 bg-background shadow-xs hover:bg-background aria-invalid:border-warning aria-invalid:ring-warning/20 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-warning/50 dark:aria-invalid:ring-warning/40"
        onChange={(event) =>
          field.handleChange(toOptionalText(event.target.value))
        }
        onFocus={focusProps.onFocus}
        onBlur={() => {
          const value = toTrimmedText(field.state.value);
          field.handleChange(
            type === "url" && value ? withHttps(value) : value,
          );
          focusProps.onBlur();
        }}
      />
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      <FieldWarnings warnings={warnings} />
    </Field>
  );
}
