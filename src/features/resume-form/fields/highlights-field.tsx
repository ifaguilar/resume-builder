import { PlusIcon, XIcon } from "lucide-react";
import {
  type ClipboardEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
} from "react";

import { LabeledGroup } from "#/features/resume-form/components/labeled-group";
import { BACKSPACE_KEY, ENTER_KEY } from "#/features/resume-form/constants";
import {
  pasteBullets,
  removeBullet,
  splitBullet,
  toBulletLines,
} from "#/features/resume-form/fields/bullet-list";
import { FieldWarnings } from "#/features/resume-form/fields/field-warnings";
import { useVisibleWarnings } from "#/features/resume-form/fields/use-visible-warnings";
import { useFieldContext } from "#/features/resume-form/form-context";
import { IconTooltip } from "#/shared/components/icon-tooltip";
import { Button } from "#/shared/components/ui/button";
import { Textarea } from "#/shared/components/ui/textarea";

type HighlightsFieldProps = {
  label: string;
  addLabel: string;
  description?: string;
  placeholder?: string;
};

type PendingFocus = { index: number; caret: "start" | "end" };

export function HighlightsField({
  label,
  addLabel,
  description,
  placeholder,
}: HighlightsFieldProps) {
  const field = useFieldContext<string[] | undefined>();
  const { warnings, focusProps } = useVisibleWarnings(field);
  const items = field.state.value ?? [];
  const textareas = useRef<(HTMLTextAreaElement | null)[]>([]);
  const pendingFocus = useRef<PendingFocus | null>(null);

  // The bullet to focus only exists after the list re-renders.
  useEffect(() => {
    const pending = pendingFocus.current;
    if (!pending) return;
    pendingFocus.current = null;
    const textarea = textareas.current[pending.index];
    if (!textarea) return;
    textarea.focus();
    const caret = pending.caret === "start" ? 0 : textarea.value.length;
    textarea.setSelectionRange(caret, caret);
  });

  function update(index: number, text: string) {
    field.handleChange(
      items.map((item, itemIndex) => (itemIndex === index ? text : item)),
    );
  }

  function add() {
    pendingFocus.current = { index: items.length, caret: "start" };
    field.handleChange([...items, ""]);
  }

  function handleKeyDown(
    index: number,
    event: KeyboardEvent<HTMLTextAreaElement>,
  ) {
    const { selectionStart, selectionEnd, value } = event.currentTarget;
    if (event.key === ENTER_KEY) {
      event.preventDefault();
      pendingFocus.current = { index: index + 1, caret: "start" };
      field.handleChange(splitBullet(items, index, selectionStart));
    } else if (
      event.key === BACKSPACE_KEY &&
      value === "" &&
      selectionStart === selectionEnd &&
      index > 0
    ) {
      event.preventDefault();
      pendingFocus.current = { index: index - 1, caret: "end" };
      field.handleChange(removeBullet(items, index));
    }
  }

  function handlePaste(
    index: number,
    event: ClipboardEvent<HTMLTextAreaElement>,
  ) {
    const pasted = event.clipboardData.getData("text/plain");
    if (toBulletLines(pasted).length <= 1) return;
    event.preventDefault();
    const { selectionStart, selectionEnd } = event.currentTarget;
    const result = pasteBullets(
      items,
      index,
      { start: selectionStart, end: selectionEnd },
      pasted,
    );
    pendingFocus.current = { index: result.lastIndex, caret: "end" };
    field.handleChange(result.items);
  }

  return (
    <LabeledGroup
      variant="field"
      title={label}
      description={description}
      className="flex flex-col gap-2"
    >
      {items.map((item, index) => (
        // Positions are the identity until the reorder wave adds stable ids.
        // oxlint-disable-next-line react/no-array-index-key
        <div key={index} className="flex items-start gap-2">
          <Textarea
            ref={(element) => {
              textareas.current[index] = element;
            }}
            aria-label={`${label} ${index + 1}`}
            value={item}
            placeholder={placeholder}
            className="border-foreground/15 bg-background shadow-xs dark:bg-input/30"
            onChange={(event) => update(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={(event) => handlePaste(index, event)}
            {...focusProps}
          />
          <IconTooltip label={`Remove bullet ${index + 1}`}>
            <Button
              variant="ghost"
              className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive focus-visible:text-destructive"
              size="icon-sm"
              onClick={() => field.handleChange(removeBullet(items, index))}
            >
              <XIcon />
            </Button>
          </IconTooltip>
        </div>
      ))}
      <Button variant="outline" size="sm" className="self-start" onClick={add}>
        <PlusIcon data-icon="inline-start" />
        {addLabel}
      </Button>
      <FieldWarnings warnings={warnings} />
    </LabeledGroup>
  );
}
