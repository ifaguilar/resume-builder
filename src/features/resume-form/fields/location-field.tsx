import { useId } from "react";

import { FieldWarnings } from "#/features/resume-form/fields/field-warnings";
import { useVisibleWarnings } from "#/features/resume-form/fields/use-visible-warnings";
import { useFieldContext } from "#/features/resume-form/form-context";
import {
  toOptionalText,
  toTrimmedText,
} from "#/features/resume-form/to-optional-text";
import { formatLocation } from "#/features/resume/format-location";
import type { Location } from "#/features/resume/resume-schema";
import { Button } from "#/shared/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "#/shared/components/ui/field";
import { Input } from "#/shared/components/ui/input";

type LocationFieldProps = {
  label: string;
  placeholder?: string;
  description?: string;
};

export function LocationField({
  label,
  placeholder,
  description,
}: LocationFieldProps) {
  const field = useFieldContext<string | Location | undefined>();
  const { warnings, isInvalid, focusProps } = useVisibleWarnings(field);
  const id = useId();
  const value = field.state.value;

  if (typeof value === "object") {
    const text = formatLocation(value);
    return (
      <Field
        data-invalid={isInvalid || undefined}
        className="gap-1.5 data-[invalid=true]:text-warning"
      >
        <FieldTitle>{label}</FieldTitle>
        <p>{text || "Empty address"}</p>
        <FieldDescription>Saved as a structured address.</FieldDescription>
        <Button
          variant="outline"
          size="sm"
          className="self-start"
          onClick={() => field.handleChange(toOptionalText(text))}
          {...focusProps}
        >
          Convert to text
        </Button>
        <FieldWarnings warnings={warnings} />
      </Field>
    );
  }

  return (
    <Field
      data-invalid={isInvalid || undefined}
      className="gap-1.5 data-[invalid=true]:text-warning"
    >
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        id={id}
        name={field.name}
        value={value ?? ""}
        placeholder={placeholder}
        aria-invalid={isInvalid || undefined}
        className="border-foreground/15 bg-background shadow-xs hover:bg-background aria-invalid:border-warning aria-invalid:ring-warning/20 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-warning/50 dark:aria-invalid:ring-warning/40"
        onChange={(event) =>
          field.handleChange(toOptionalText(event.target.value))
        }
        onFocus={focusProps.onFocus}
        onBlur={() => {
          field.handleChange(toTrimmedText(value));
          focusProps.onBlur();
        }}
      />
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      <FieldWarnings warnings={warnings} />
    </Field>
  );
}
