import { ChevronDownIcon } from "lucide-react";
import { useId } from "react";

import { DISPLAY_LOCALE } from "#/features/resume-form/constants";
import { FieldWarnings } from "#/features/resume-form/fields/field-warnings";
import { useVisibleWarnings } from "#/features/resume-form/fields/use-visible-warnings";
import { useFieldContext } from "#/features/resume-form/form-context";
import {
  type Country,
  countryName,
  listCountries,
} from "#/features/resume/countries";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "#/shared/components/ui/combobox";
import { Field, FieldLabel } from "#/shared/components/ui/field";

const COUNTRIES = listCountries(DISPLAY_LOCALE);

type CountryFieldProps = { label: string; placeholder?: string };

export function CountryField({ label, placeholder }: CountryFieldProps) {
  const field = useFieldContext<string | undefined>();
  const { warnings, isInvalid, focusProps } = useVisibleWarnings(field);
  const id = useId();
  const code = field.state.value;
  const selected: Country | null = code
    ? (COUNTRIES.find((country) => country.code === code) ?? {
        code,
        name: countryName(code, DISPLAY_LOCALE),
      })
    : null;

  return (
    <Field
      data-invalid={isInvalid || undefined}
      className="gap-1.5 data-[invalid=true]:text-warning"
    >
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Combobox
        items={COUNTRIES}
        value={selected}
        onValueChange={(country) => field.handleChange(country?.code)}
        itemToStringLabel={(country) => country.name}
        isItemEqualToValue={(a, b) => a.code === b.code}
        autoHighlight
      >
        <ComboboxInput
          id={id}
          name={field.name}
          placeholder={placeholder}
          aria-invalid={isInvalid || undefined}
          className="w-full border-foreground/15 bg-background shadow-xs has-[[data-slot][aria-invalid=true]]:border-warning has-[[data-slot][aria-invalid=true]]:ring-warning/20 dark:bg-input/30 dark:has-[[data-slot][aria-invalid=true]]:ring-warning/40 [&_input]:pr-9"
          showTrigger={false}
          {...focusProps}
        >
          <ChevronDownIcon
            aria-hidden
            className="pointer-events-none absolute right-3 size-4 text-muted-foreground transition-transform group-has-data-popup-open/input-group:rotate-180"
          />
        </ComboboxInput>
        <ComboboxContent>
          <ComboboxEmpty>No countries found.</ComboboxEmpty>
          <ComboboxList>
            {(country: Country) => (
              <ComboboxItem key={country.code} value={country}>
                {country.name}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <FieldWarnings warnings={warnings} />
    </Field>
  );
}
