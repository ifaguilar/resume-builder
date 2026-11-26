type WritableField<T> = {
  state: { value: T };
  handleChange: (value: T) => void;
};

// TanStack Form builds a new values object on every write, even an equal one,
// which re-renders the preview and saves the draft.
export function commitIfChanged<T>(field: WritableField<T>, value: T) {
  if (value !== field.state.value) field.handleChange(value);
}
