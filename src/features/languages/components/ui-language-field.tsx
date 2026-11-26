import { useId } from "react";

import { UI_LANGUAGE_LEGEND } from "#/features/languages/constants";
import { languageName } from "#/features/languages/language-name";
import { getLocale, locales, setLocale } from "#/paraglide/runtime.js";
import {
  Field,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "#/shared/components/ui/field";
import { RadioGroup, RadioGroupItem } from "#/shared/components/ui/radio-group";

// Every message is compiled for one language per page load, so a switch
// reloads the page; the draft is saved on `pagehide` and the tab is in the URL.
export function UiLanguageField() {
  const id = useId();

  return (
    <FieldSet>
      <FieldLegend variant="label">{UI_LANGUAGE_LEGEND}</FieldLegend>
      <RadioGroup
        value={getLocale()}
        onValueChange={(next) => {
          const locale = locales.find((item) => item === next);
          if (locale) void setLocale(locale);
        }}
        className="grid-cols-1 @lg/form:grid-cols-2"
      >
        {locales.map((locale) => (
          <FieldLabel key={locale} htmlFor={`${id}-${locale}`}>
            <Field orientation="horizontal">
              <FieldTitle lang={locale} className="flex-1">
                {languageName(locale)}
              </FieldTitle>
              <RadioGroupItem value={locale} id={`${id}-${locale}`} />
            </Field>
          </FieldLabel>
        ))}
      </RadioGroup>
    </FieldSet>
  );
}
