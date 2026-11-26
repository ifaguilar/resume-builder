import { cn } from "cn";
import { PlusIcon, Trash2Icon } from "lucide-react";
import {
  type KeyboardEvent,
  type Ref,
  use,
  useEffect,
  useRef,
  useState,
} from "react";

import { LabeledGroup } from "#/features/resume-form/components/labeled-group";
import { RemoveButton } from "#/features/resume-form/components/remove-button";
import {
  ENTER_KEY,
  ESCAPE_KEY,
  KEYWORD_COMMIT_KEYS,
  KEYWORD_SEPARATOR,
} from "#/features/resume-form/constants";
import { FieldWarnings } from "#/features/resume-form/fields/field-warnings";
import {
  addKeywords,
  replaceKeyword,
} from "#/features/resume-form/fields/keyword-list";
import { useVisibleWarnings } from "#/features/resume-form/fields/use-visible-warnings";
import { useFieldContext } from "#/features/resume-form/form-context";
import { moveItem, removeItem } from "#/features/resume-form/list-keys";
import { useListKeys } from "#/features/resume-form/use-list-keys";
import { m } from "#/paraglide/messages.js";
import { AnnounceContext } from "#/shared/components/announce-context";
import { IconTooltip } from "#/shared/components/icon-tooltip";
import { ReorderMenu } from "#/shared/components/reorder-menu";
import { SortableItemContext } from "#/shared/components/sortable-item-context";
import { SortableItem, SortableList } from "#/shared/components/sortable-list";
import { Input } from "#/shared/components/ui/input";

type KeywordsFieldProps = {
  label: string;
  placeholder?: string;
  description?: string;
};

function findExisting(
  current: readonly string[],
  candidates: readonly string[],
): string | undefined {
  const keys = new Set(current.map((keyword) => keyword.toLowerCase()));
  return candidates
    .map((candidate) => candidate.trim())
    .find((keyword) => keys.has(keyword.toLowerCase()));
}

export function KeywordsField({
  label,
  placeholder,
  description,
}: KeywordsFieldProps) {
  const field = useFieldContext<string[] | undefined>();
  const { warnings, isInvalid, focusProps } = useVisibleWarnings(field);
  const items = field.state.value ?? [];
  const keys = useListKeys(items.length);
  const announce = use(AnnounceContext);
  const [draft, setDraft] = useState("");
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const addInput = useRef<HTMLInputElement>(null);
  // The row to focus after a keyboard edit or a removal unmounts the focused
  // input; past the last row, it's the add input.
  const pendingFocus = useRef<number | null>(null);

  useEffect(() => {
    const index = pendingFocus.current;
    if (index === null) return;
    pendingFocus.current = null;
    const target =
      index < items.length ? inputs.current[index] : addInput.current;
    target?.focus();
  });

  function add(candidates: string[]) {
    const existing = findExisting(items, candidates);
    if (existing) announce(m.form_keyword_exists({ keyword: existing }));
    const next = addKeywords(items, candidates);
    if (next.length === items.length) return;
    field.handleChange(next);
    keys.insert(items.length, next.length - items.length);
  }

  function handleDraftChange(text: string) {
    const parts = text.split(KEYWORD_SEPARATOR);
    const last = parts.pop() ?? "";
    if (parts.length > 0) add(parts);
    setDraft(last);
  }

  function handleDraftKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!KEYWORD_COMMIT_KEYS.includes(event.key)) return;
    event.preventDefault();
    add([draft]);
    setDraft("");
  }

  function edit(index: number, text: string, refocus: boolean) {
    if (text.trim() === items[index]) return;
    const { items: next, count } = replaceKeyword(items, index, text);
    if (count === 0 && text.trim() !== "") {
      announce(m.form_keyword_exists({ keyword: text.trim() }));
    }
    field.handleChange(next.length > 0 ? next : undefined);
    if (count === 1) return;
    if (refocus) pendingFocus.current = count > 1 ? index + count - 1 : index;
    keys.remove(index);
    if (count > 1) keys.insert(index, count);
  }

  function remove(index: number) {
    const next = removeItem(items, index);
    pendingFocus.current = index;
    field.handleChange(next.length > 0 ? next : undefined);
    keys.remove(index);
  }

  function move(from: number, to: number) {
    field.handleChange(moveItem(items, from, to));
    keys.move(from, to);
    announce(
      m.form_keyword_moved({
        keyword: items[from] ?? "",
        position: to + 1,
        count: items.length,
      }),
    );
  }

  return (
    <LabeledGroup
      variant="field"
      title={label}
      description={description}
      className="flex flex-col gap-1.5"
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
            <KeywordRow
              inputRef={(element) => {
                inputs.current[index] = element;
              }}
              label={m.form_keyword_label({ list: label, position: index + 1 })}
              value={items[index] ?? ""}
              onCommit={(text, refocus) => edit(index, text, refocus)}
              onRemove={() => remove(index)}
              onFocus={focusProps.onFocus}
              onBlur={focusProps.onBlur}
            />
          </SortableItem>
        ))}
      </SortableList>
      <div className="flex items-center gap-1">
        <span className="flex size-8 shrink-0 items-center justify-center text-muted-foreground">
          <PlusIcon className="size-4" />
        </span>
        <Input
          ref={addInput}
          aria-label={m.form_add_keyword({ list: label })}
          aria-invalid={isInvalid || undefined}
          value={draft}
          placeholder={placeholder}
          className="h-8 min-w-0 border-foreground/15 bg-background shadow-xs aria-invalid:border-warning aria-invalid:ring-warning/20 dark:bg-input/30 dark:aria-invalid:border-warning/50 dark:aria-invalid:ring-warning/40"
          onChange={(event) => handleDraftChange(event.target.value)}
          onKeyDown={handleDraftKeyDown}
          onFocus={focusProps.onFocus}
          onBlur={() => {
            add([draft]);
            setDraft("");
            focusProps.onBlur();
          }}
        />
        <span className="size-8 shrink-0" />
      </div>
      <FieldWarnings warnings={warnings} />
    </LabeledGroup>
  );
}

type KeywordRowProps = {
  inputRef: Ref<HTMLInputElement>;
  label: string;
  value: string;
  onCommit: (text: string, refocus: boolean) => void;
  onRemove: () => void;
  onFocus: () => void;
  onBlur: () => void;
};

function KeywordRow({
  inputRef,
  label,
  value,
  onCommit,
  onRemove,
  onFocus,
  onBlur,
}: KeywordRowProps) {
  const item = use(SortableItemContext);
  const [text, setText] = useState(value);
  // A saved edit stores the trimmed text, which the input then shows.
  const [shownValue, setShownValue] = useState(value);
  if (shownValue !== value) {
    setShownValue(value);
    setText(value);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === ENTER_KEY) {
      event.preventDefault();
      onCommit(text, true);
    } else if (event.key === ESCAPE_KEY) {
      setText(value);
    }
  }

  return (
    <div
      ref={item?.ref}
      // During a drag, dnd-kit leaves a hidden copy of this row where it will
      // land; the data-dnd-placeholder styles turn that copy into a drop slot.
      className={cn(
        "flex items-center gap-1 rounded-lg data-dnd-placeholder:visible! data-dnd-placeholder:bg-primary/5 data-dnd-placeholder:outline-2 data-dnd-placeholder:-outline-offset-2 data-dnd-placeholder:outline-primary/50 data-dnd-placeholder:outline-dashed data-dnd-placeholder:*:invisible",
        item?.isDragging &&
          "relative z-10 bg-background shadow-lg ring-1 ring-primary/30",
      )}
    >
      <ReorderMenu label={m.form_reorder_keyword({ keyword: value })} />
      <Input
        ref={inputRef}
        aria-label={label}
        value={text}
        className={cn(
          "h-8 min-w-0 border-foreground/15 bg-background shadow-xs dark:bg-input/30",
          item?.isDragging && "border-transparent shadow-none",
        )}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
        onBlur={() => {
          onCommit(text, false);
          onBlur();
        }}
      />
      <IconTooltip label={m.form_remove_keyword({ keyword: value })}>
        <RemoveButton onClick={onRemove}>
          <Trash2Icon />
        </RemoveButton>
      </IconTooltip>
    </div>
  );
}
