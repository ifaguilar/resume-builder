import { TriangleAlertIcon } from "lucide-react";
import { useId } from "react";

import {
  CV_LANGUAGE_LEGEND,
  CV_LANGUAGE_OPTIONS,
  CV_LANGUAGE_TIP,
  type CvLanguage,
  NO_CV_LANGUAGE,
  unsupportedLanguage,
} from "#/features/languages/constants";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "#/shared/components/ui/field";
import { RadioGroup, RadioGroupItem } from "#/shared/components/ui/radio-group";

export function CvLanguageField({
  value,
  unsupported,
  onChange,
}: {
  value: CvLanguage;
  unsupported: string | undefined;
  onChange: (value: CvLanguage) => void;
}) {
  const id = useId();

  return (
    <FieldSet>
      <FieldLegend variant="label">{CV_LANGUAGE_LEGEND}</FieldLegend>
      <FieldDescription>{CV_LANGUAGE_TIP}</FieldDescription>
      {unsupported === undefined ? null : (
        <p className="flex items-center gap-2 text-sm text-warning">
          <TriangleAlertIcon className="size-4 shrink-0" aria-hidden />
          {unsupportedLanguage(unsupported)}
        </p>
      )}
      <RadioGroup
        value={unsupported === undefined ? value : NO_CV_LANGUAGE}
        onValueChange={(next) => {
          const option = CV_LANGUAGE_OPTIONS.find(
            (item) => item.value === next,
          );
          if (option) onChange(option.value);
        }}
        className="grid-cols-1 @lg/form:grid-cols-2"
      >
        {CV_LANGUAGE_OPTIONS.map((option) => (
          <FieldLabel key={option.value} htmlFor={`${id}-${option.value}`}>
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle lang={option.value}>{option.title}</FieldTitle>
                <FieldDescription lang={option.value} className="tabular-nums">
                  {option.sample}
                </FieldDescription>
              </FieldContent>
              <RadioGroupItem
                value={option.value}
                id={`${id}-${option.value}`}
              />
            </Field>
          </FieldLabel>
        ))}
      </RadioGroup>
    </FieldSet>
  );
}
