import { type LucideIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { use, useId } from "react";

import { parseColorScheme } from "#/features/color-scheme/color-scheme";
import { ColorSchemeContext } from "#/features/color-scheme/color-scheme-context";
import {
  COLOR_SCHEME_LEGEND,
  COLOR_SCHEMES,
  type ColorScheme,
} from "#/features/color-scheme/constants";
import {
  Field,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "#/shared/components/ui/field";
import { RadioGroup, RadioGroupItem } from "#/shared/components/ui/radio-group";

const SCHEME_OPTIONS = {
  light: { label: "Light", Icon: SunIcon },
  dark: { label: "Dark", Icon: MoonIcon },
  system: { label: "System", Icon: MonitorIcon },
} satisfies Record<ColorScheme, { label: string; Icon: LucideIcon }>;

export function ColorSchemeField() {
  const { scheme, setScheme } = use(ColorSchemeContext);
  const id = useId();

  return (
    <FieldSet>
      <FieldLegend variant="label">{COLOR_SCHEME_LEGEND}</FieldLegend>
      <RadioGroup
        value={scheme}
        onValueChange={(next) => setScheme(parseColorScheme(next))}
        className="grid-cols-1 @lg/form:grid-cols-3"
      >
        {COLOR_SCHEMES.map((option) => {
          const { label, Icon } = SCHEME_OPTIONS[option];
          return (
            <FieldLabel key={option} htmlFor={`${id}-${option}`}>
              <Field orientation="horizontal">
                <Icon className="size-4 text-muted-foreground" aria-hidden />
                <FieldTitle className="flex-1">{label}</FieldTitle>
                <RadioGroupItem value={option} id={`${id}-${option}`} />
              </Field>
            </FieldLabel>
          );
        })}
      </RadioGroup>
    </FieldSet>
  );
}
