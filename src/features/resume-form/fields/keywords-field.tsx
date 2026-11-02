import { XIcon } from "lucide-react";
import { type KeyboardEvent, useId, useState } from "react";

import {
  BACKSPACE_KEY,
  KEYWORD_COMMIT_KEYS,
  KEYWORD_SEPARATOR,
} from "#/features/resume-form/constants";
import { FieldWarnings } from "#/features/resume-form/fields/field-warnings";
import { addKeywords } from "#/features/resume-form/fields/keyword-list";
import { useVisibleWarnings } from "#/features/resume-form/fields/use-visible-warnings";
import { useFieldContext } from "#/features/resume-form/form-context";
import { IconTooltip } from "#/shared/components/icon-tooltip";
import { Badge } from "#/shared/components/ui/badge";
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "#/shared/components/ui/field";
import {
  InputGroup,
  InputGroupInput,
} from "#/shared/components/ui/input-group";

type KeywordsFieldProps = {
  label: string;
  placeholder?: string;
  description?: string;
};

export function KeywordsField({
  label,
  placeholder,
  description,
}: KeywordsFieldProps) {
  const field = useFieldContext<string[] | undefined>();
  const { warnings, isInvalid, focusProps } = useVisibleWarnings(field);
  const id = useId();
  const [draft, setDraft] = useState("");
  const keywords = field.state.value ?? [];

  function commit(candidates: string[]) {
    const next = addKeywords(keywords, candidates);
    if (next.length !== keywords.length) field.handleChange(next);
  }

  function handleChange(text: string) {
    const parts = text.split(KEYWORD_SEPARATOR);
    const last = parts.pop() ?? "";
    if (parts.length > 0) commit(parts);
    setDraft(last);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (KEYWORD_COMMIT_KEYS.includes(event.key)) {
      event.preventDefault();
      commit([draft]);
      setDraft("");
    } else if (
      event.key === BACKSPACE_KEY &&
      draft === "" &&
      keywords.length > 0
    ) {
      field.handleChange(keywords.slice(0, -1));
    }
  }

  return (
    <Field
      data-invalid={isInvalid || undefined}
      className="gap-1.5 data-[invalid=true]:text-warning"
    >
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <InputGroup className="h-auto min-h-9 flex-wrap gap-1 border-foreground/15 bg-background px-1.5 py-1 shadow-xs hover:bg-background has-[[data-slot][aria-invalid=true]]:border-warning has-[[data-slot][aria-invalid=true]]:ring-warning/20 dark:bg-input/30 dark:hover:bg-input/50 dark:has-[[data-slot][aria-invalid=true]]:ring-warning/40">
        {keywords.map((keyword) => (
          <Badge
            key={keyword}
            variant="secondary"
            className="h-6 max-w-full pr-1"
            title={keyword}
          >
            <span className="truncate">{keyword}</span>
            <IconTooltip label={`Remove ${keyword}`}>
              <button
                type="button"
                className="shrink-0 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive focus-visible:text-destructive"
                onClick={() =>
                  field.handleChange(
                    keywords.filter((item) => item !== keyword),
                  )
                }
              >
                <XIcon className="size-3" />
              </button>
            </IconTooltip>
          </Badge>
        ))}
        <InputGroupInput
          id={id}
          name={field.name}
          value={draft}
          placeholder={keywords.length === 0 ? placeholder : undefined}
          aria-invalid={isInvalid || undefined}
          className="h-7 min-w-24 px-1.5"
          onChange={(event) => handleChange(event.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={focusProps.onFocus}
          onBlur={() => {
            commit([draft]);
            setDraft("");
            focusProps.onBlur();
          }}
        />
      </InputGroup>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      <FieldWarnings warnings={warnings} />
    </Field>
  );
}
