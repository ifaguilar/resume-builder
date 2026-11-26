import { TriangleAlertIcon } from "lucide-react";
import { useId } from "react";

import {
  CV_LANGUAGE_LEGEND,
  CV_LANGUAGE_TIP,
  CV_LANGUAGES,
  type CvLanguage,
  NO_CV_LANGUAGE,
  unsupportedLanguage,
} from "#/features/languages/constants";
import {
  cvLanguageSample,
  languageName,
} from "#/features/languages/cv-language";
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
          const language = CV_LANGUAGES.find((item) => item === next);
          if (language) onChange(language);
        }}
        className="grid-cols-1 @lg/form:grid-cols-2"
      >
        {CV_LANGUAGES.map((language) => (
          <FieldLabel key={language} htmlFor={`${id}-${language}`}>
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle lang={language}>
                  {languageName(language)}
                </FieldTitle>
                <FieldDescription lang={language} className="tabular-nums">
                  {cvLanguageSample(language)}
                </FieldDescription>
              </FieldContent>
              <RadioGroupItem value={language} id={`${id}-${language}`} />
            </Field>
          </FieldLabel>
        ))}
      </RadioGroup>
    </FieldSet>
  );
}
