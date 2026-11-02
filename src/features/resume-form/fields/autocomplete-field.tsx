import { Autocomplete } from "@base-ui/react/autocomplete";
import { ChevronDownIcon } from "lucide-react";
import { useId } from "react";

import {
  ESCAPE_KEY,
  POPUP_SIDE_OFFSET_PX,
} from "#/features/resume-form/constants";
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
import {
  InputGroup,
  InputGroupInput,
} from "#/shared/components/ui/input-group";

type AutocompleteFieldProps = {
  label: string;
  suggestions: readonly string[];
  placeholder?: string;
  description?: string;
};

export function AutocompleteField({
  label,
  suggestions,
  placeholder,
  description,
}: AutocompleteFieldProps) {
  const field = useFieldContext<string | undefined>();
  const { warnings, isInvalid, focusProps } = useVisibleWarnings(field);
  const id = useId();

  return (
    <Field
      data-invalid={isInvalid || undefined}
      className="gap-1.5 data-[invalid=true]:text-warning"
    >
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Autocomplete.Root
        items={suggestions}
        value={field.state.value ?? ""}
        onValueChange={(value) => field.handleChange(toOptionalText(value))}
        openOnInputClick
      >
        <Autocomplete.InputGroup
          render={
            <InputGroup className="border-foreground/15 bg-background shadow-xs has-[[data-slot][aria-invalid=true]]:border-warning has-[[data-slot][aria-invalid=true]]:ring-warning/20 dark:bg-input/30 dark:has-[[data-slot][aria-invalid=true]]:ring-warning/40" />
          }
        >
          <Autocomplete.Input
            id={id}
            name={field.name}
            placeholder={placeholder}
            aria-invalid={isInvalid || undefined}
            render={<InputGroupInput className="pr-9" />}
            onKeyDown={(event) => {
              // With the list closed, Base UI's Escape clears the input,
              // which would erase free text the user typed.
              if (
                event.key === ESCAPE_KEY &&
                !event.currentTarget.hasAttribute("data-popup-open")
              ) {
                event.preventBaseUIHandler();
              }
            }}
            onFocus={focusProps.onFocus}
            onBlur={() => {
              field.handleChange(toTrimmedText(field.state.value));
              focusProps.onBlur();
            }}
          />
          <ChevronDownIcon
            aria-hidden
            className="pointer-events-none absolute right-3 size-4 text-muted-foreground transition-transform group-has-data-popup-open/input-group:rotate-180"
          />
        </Autocomplete.InputGroup>
        <Autocomplete.Portal>
          <Autocomplete.Positioner
            sideOffset={POPUP_SIDE_OFFSET_PX}
            align="start"
            className="isolate z-50"
          >
            <Autocomplete.Popup className="relative max-h-(--available-height) w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) overflow-hidden rounded-2xl bg-popover text-popover-foreground shadow-2xl ring-1 ring-foreground/5 duration-100 data-empty:hidden data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
              <Autocomplete.List className="no-scrollbar max-h-[min(--spacing(72),var(--available-height))] scroll-py-1 overflow-y-auto overscroll-contain p-1">
                {(suggestion: string) => (
                  <Autocomplete.Item
                    key={suggestion}
                    value={suggestion}
                    className="relative flex w-full cursor-default items-center gap-2.5 rounded-xl py-2 pr-8 pl-3 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground"
                  >
                    {suggestion}
                  </Autocomplete.Item>
                )}
              </Autocomplete.List>
            </Autocomplete.Popup>
          </Autocomplete.Positioner>
        </Autocomplete.Portal>
      </Autocomplete.Root>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      <FieldWarnings warnings={warnings} />
    </Field>
  );
}
