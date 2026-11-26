import { useEffect, useRef, useState } from "react";

import { SECTION_TITLE_DEBOUNCE_MS } from "#/features/design/constants";
import { createDebouncedSave } from "#/features/editor/debounced-save";
import { Input } from "#/shared/components/ui/input";

type DebouncedSave = ReturnType<typeof createDebouncedSave<string>>;

// Typing stays local and reaches the settings after a pause, so the preview
// doesn't re-render on every key.
export function SectionTitleInput({
  value,
  placeholder,
  label,
  onCommit,
}: {
  value: string | undefined;
  placeholder: string;
  label: string;
  onCommit: (text: string) => void;
}) {
  const [text, setText] = useState(value ?? "");
  const commitRef = useRef(onCommit);
  const saverRef = useRef<DebouncedSave | null>(null);
  useEffect(() => {
    commitRef.current = onCommit;
  });
  useEffect(() => () => saverRef.current?.flush(), []);

  function saver(): DebouncedSave {
    saverRef.current ??= createDebouncedSave<string>({
      save: (next) => commitRef.current(next),
      delayMs: SECTION_TITLE_DEBOUNCE_MS,
    });
    return saverRef.current;
  }

  return (
    <Input
      value={text}
      placeholder={placeholder}
      aria-label={label}
      // Below @md the longest default title ("Formación académica") doesn't
      // fit beside the section name, so the field takes its own line.
      className="min-w-0 basis-full @md/form:flex-1 @md/form:basis-0"
      onChange={(event) => {
        setText(event.target.value);
        saver().schedule(event.target.value);
      }}
      onBlur={() => {
        saver().flush();
        // The placeholder is the default title, which is never stored.
        setText((current) => {
          const trimmed = current.trim();
          return trimmed === placeholder ? "" : trimmed;
        });
      }}
    />
  );
}
