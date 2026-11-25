import { useId } from "react";

import {
  PAGE_SIZE_LEGEND,
  PAGE_SIZE_OPTIONS,
  PAGE_SIZE_TIP,
} from "#/features/design/constants";
import type { PageSize } from "#/features/resume/settings-schema";
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

export function PageSizeField({
  value,
  onChange,
}: {
  value: PageSize;
  onChange: (value: PageSize) => void;
}) {
  const id = useId();

  return (
    <FieldSet>
      <FieldLegend variant="label">{PAGE_SIZE_LEGEND}</FieldLegend>
      <FieldDescription>{PAGE_SIZE_TIP}</FieldDescription>
      <RadioGroup
        value={value}
        onValueChange={(next) => {
          const option = PAGE_SIZE_OPTIONS.find((item) => item.value === next);
          if (option) onChange(option.value);
        }}
        className="grid-cols-1 @lg/form:grid-cols-2"
      >
        {PAGE_SIZE_OPTIONS.map((option) => (
          <FieldLabel key={option.value} htmlFor={`${id}-${option.value}`}>
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>{option.title}</FieldTitle>
                <FieldDescription className="tabular-nums">
                  {option.dimensions}
                </FieldDescription>
                <FieldDescription>{option.regions}</FieldDescription>
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
