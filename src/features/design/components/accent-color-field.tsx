import { TriangleAlertIcon } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { parseHexColor } from "#/features/design/accent-color";
import { PREVIEW_DEBOUNCE_MS } from "#/features/editor/constants";
import { createDebouncedSave } from "#/features/editor/debounced-save";
import { contrastOnWhite } from "#/features/templates/color-contrast";
import { MIN_HEADING_CONTRAST } from "#/features/templates/constants";
import { m } from "#/paraglide/messages.js";
import { IconTooltip } from "#/shared/components/icon-tooltip";
import { Button } from "#/shared/components/ui/button";
import { FieldLegend, FieldSet } from "#/shared/components/ui/field";
import { Input } from "#/shared/components/ui/input";

type DebouncedSave = ReturnType<typeof createDebouncedSave<string>>;

// Dragging in the picker updates the swatch at once; the CV follows after a
// pause or when the picker closes, so the preview doesn't flash per step.
export function AccentColorField({
  value,
  defaultValue,
  onChange,
}: {
  value: string;
  defaultValue: string;
  onChange: (color: string) => void;
}) {
  const noteId = useId();
  const [color, setColor] = useState(value);
  const [text, setText] = useState(value);
  const hexRef = useRef<HTMLInputElement>(null);
  const commitRef = useRef(onChange);
  const saverRef = useRef<DebouncedSave | null>(null);
  useEffect(() => {
    commitRef.current = onChange;
  });
  useEffect(() => () => saverRef.current?.flush(), []);

  function saver(): DebouncedSave {
    saverRef.current ??= createDebouncedSave<string>({
      save: (next) => commitRef.current(next),
      delayMs: PREVIEW_DEBOUNCE_MS,
    });
    return saverRef.current;
  }

  function show(next: string) {
    setColor(next);
    setText(next);
  }

  function commitNow(next: string) {
    show(next);
    saver().cancel();
    commitRef.current(next);
  }

  function commitText() {
    const parsed = parseHexColor(text);
    if (parsed) commitNow(parsed);
    else setText(color);
  }

  // React's onChange is the input event; the native change event fires when
  // the picker closes.
  const listenForPickerClose = useCallback((node: HTMLInputElement | null) => {
    if (!node) return undefined;
    const flush = () => saverRef.current?.flush();
    node.addEventListener("change", flush);
    return () => node.removeEventListener("change", flush);
  }, []);

  const lowContrast = contrastOnWhite(color) < MIN_HEADING_CONTRAST;

  return (
    <FieldSet>
      <FieldLegend variant="label">{m.design_accent_legend()}</FieldLegend>
      <div className="flex flex-wrap items-center gap-2">
        <IconTooltip label={m.design_accent_picker_label()}>
          <label
            className="size-9 shrink-0 cursor-pointer rounded-4xl border border-input has-focus-visible:border-ring has-focus-visible:ring-3 has-focus-visible:ring-ring/50"
            style={{ backgroundColor: color }}
          >
            <input
              type="color"
              className="sr-only"
              value={color}
              aria-label={m.design_accent_picker_label()}
              aria-describedby={lowContrast ? noteId : undefined}
              onChange={(event) => {
                show(event.target.value);
                saver().schedule(event.target.value);
              }}
              ref={listenForPickerClose}
            />
          </label>
        </IconTooltip>
        <Input
          ref={hexRef}
          value={text}
          spellCheck={false}
          autoComplete="off"
          aria-label={m.design_accent_hex_label()}
          aria-describedby={lowContrast ? noteId : undefined}
          className="w-28 tabular-nums"
          onChange={(event) => setText(event.target.value)}
          onBlur={commitText}
          onKeyDown={(event) => {
            if (event.key === "Enter") commitText();
            if (event.key === "Escape") setText(color);
          }}
        />
        {color === defaultValue ? null : (
          <Button
            variant="ghost"
            onClick={() => {
              commitNow(defaultValue);
              hexRef.current?.focus();
            }}
          >
            {m.design_accent_default()}
          </Button>
        )}
      </div>
      {lowContrast ? (
        <p id={noteId} className="flex items-center gap-2 text-sm text-warning">
          <TriangleAlertIcon className="size-4 shrink-0" aria-hidden />
          {m.design_accent_low_contrast()}
        </p>
      ) : null}
    </FieldSet>
  );
}
