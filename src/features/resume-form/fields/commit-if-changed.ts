import { toOptionalText } from "#/features/resume-form/to-optional-text";
import { textValue } from "#/features/resume/stored-value";

type TextField = {
  state: { value: unknown };
  handleChange: (value: string | undefined) => void;
};

const unchanged = (text: string) => text;

// TanStack Form builds a new values object on every write, even an equal one,
// which re-renders the preview and saves the draft. An imported value of the
// wrong type (a number, an object) stays as stored until the user edits it.
export function commitIfChanged(
  field: TextField,
  transform: (text: string) => string = unchanged,
) {
  const stored = field.state.value;
  const shown = textValue(stored);
  const trimmed = shown.trim();
  const next = toOptionalText(trimmed === "" ? "" : transform(trimmed));
  const current = typeof stored === "string" ? stored : toOptionalText(shown);
  if (next !== current) field.handleChange(next);
}
