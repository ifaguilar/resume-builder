import { cn } from "cn";
import { PlusIcon, XIcon } from "lucide-react";
import {
  type ClipboardEvent,
  type KeyboardEvent,
  type Ref,
  use,
  useEffect,
  useRef,
} from "react";

import { AnnounceContext } from "#/features/resume-form/components/announce-context";
import { LabeledGroup } from "#/features/resume-form/components/labeled-group";
import { ReorderMenu } from "#/features/resume-form/components/reorder-menu";
import { SortableItemContext } from "#/features/resume-form/components/sortable-item-context";
import {
  SortableItem,
  SortableList,
} from "#/features/resume-form/components/sortable-list";
import { BACKSPACE_KEY, ENTER_KEY } from "#/features/resume-form/constants";
import {
  pasteBullets,
  splitBullet,
  toBulletLines,
} from "#/features/resume-form/fields/bullet-list";
import { FieldWarnings } from "#/features/resume-form/fields/field-warnings";
import { useVisibleWarnings } from "#/features/resume-form/fields/use-visible-warnings";
import { useFieldContext } from "#/features/resume-form/form-context";
import { moveItem, removeItem } from "#/features/resume-form/list-keys";
import { useListKeys } from "#/features/resume-form/use-list-keys";
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
  const keys = useListKeys(items.length);
  const announce = use(AnnounceContext);
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
    keys.insert(items.length);
  }

  function remove(index: number) {
    field.handleChange(removeItem(items, index));
    keys.remove(index);
  }

  function move(from: number, to: number) {
    field.handleChange(moveItem(items, from, to));
    keys.move(from, to);
    announce(`Moved bullet to position ${to + 1} of ${items.length}.`);
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
      keys.insert(index + 1);
    } else if (
      event.key === BACKSPACE_KEY &&
      value === "" &&
      selectionStart === selectionEnd &&
      index > 0
    ) {
      event.preventDefault();
      pendingFocus.current = { index: index - 1, caret: "end" };
      remove(index);
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
    keys.insert(index + 1, result.items.length - items.length);
  }

  return (
    <LabeledGroup
      variant="field"
      title={label}
      description={description}
      className="flex flex-col gap-2"
    >
      <SortableList onMove={move}>
        {keys.keys.map((key, index) => (
          <SortableItem
            key={key}
            id={key}
            index={index}
            count={items.length}
            onMove={move}
          >
            <BulletRow
              textareaRef={(element) => {
                textareas.current[index] = element;
              }}
              label={`${label} ${index + 1}`}
              position={index + 1}
              value={items[index] ?? ""}
              placeholder={placeholder}
              onChange={(text) => update(index, text)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              onPaste={(event) => handlePaste(index, event)}
              onRemove={() => remove(index)}
              {...focusProps}
            />
          </SortableItem>
        ))}
      </SortableList>
      <Button variant="outline" size="sm" className="self-start" onClick={add}>
        <PlusIcon data-icon="inline-start" />
        {addLabel}
      </Button>
      <FieldWarnings warnings={warnings} />
    </LabeledGroup>
  );
}

type BulletRowProps = {
  textareaRef: Ref<HTMLTextAreaElement>;
  label: string;
  position: number;
  value: string;
  placeholder?: string;
  onChange: (text: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  onPaste: (event: ClipboardEvent<HTMLTextAreaElement>) => void;
  onRemove: () => void;
  onFocus: () => void;
  onBlur: () => void;
};

function BulletRow({
  textareaRef,
  label,
  position,
  value,
  placeholder,
  onChange,
  onKeyDown,
  onPaste,
  onRemove,
  onFocus,
  onBlur,
}: BulletRowProps) {
  const item = use(SortableItemContext);

  return (
    <div
      ref={item?.ref}
      className={cn(
        "flex items-start gap-1",
        item?.isDragging && "relative z-10",
      )}
    >
      <ReorderMenu label={`Reorder bullet ${position}`} />
      <Textarea
        ref={textareaRef}
        aria-label={label}
        value={value}
        placeholder={placeholder}
        className={cn(
          "border-foreground/15 bg-background shadow-xs dark:bg-input/30",
          item?.isDragging && "shadow-lg",
        )}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      <IconTooltip label={`Remove bullet ${position}`}>
        <Button
          variant="ghost"
          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive focus-visible:text-destructive"
          size="icon-sm"
          onClick={onRemove}
        >
          <XIcon />
        </Button>
      </IconTooltip>
    </div>
  );
}
