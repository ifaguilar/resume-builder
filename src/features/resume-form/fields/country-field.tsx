import { ChevronDownIcon } from "lucide-react";
import { useId } from "react";

import {
  type Country,
  countryName,
  listCountries,
} from "#/features/languages/countries";
import { FieldWarnings } from "#/features/resume-form/fields/field-warnings";
import { useVisibleWarnings } from "#/features/resume-form/fields/use-visible-warnings";
import { useFieldContext } from "#/features/resume-form/form-context";
import { textValue } from "#/features/resume/stored-value";
import { m } from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
} from "#/shared/components/ui/combobox";
import { Field, FieldLabel } from "#/shared/components/ui/field";

// The UI language is fixed for the page's life: switching it reloads.
const COUNTRIES = listCountries(getLocale());

type CountryFieldProps = { label: string; placeholder?: string };

export function CountryField({ label, placeholder }: CountryFieldProps) {
  const field = useFieldContext<string | undefined>();
  const { warnings, isInvalid, focusProps } = useVisibleWarnings(field);
  const id = useId();
  const anchor = useComboboxAnchor();
  const code = textValue(field.state.value);
  const selected: Country | null = code
    ? (COUNTRIES.find((country) => country.code === code) ?? {
        code,
        name: countryName(code, getLocale()),
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
        {/* The popup anchors to this box; the input inside it is narrower. */}
        <div ref={anchor}>
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
        </div>
        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>{m.form_country_empty()}</ComboboxEmpty>
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
