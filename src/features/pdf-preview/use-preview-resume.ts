import { useEffect, useState } from "react";

import { PREVIEW_DEBOUNCE_MS } from "#/features/editor/constants";
import { createDebouncedSave } from "#/features/editor/debounced-save";
import type { ResumeForm } from "#/features/resume-form/use-resume-form";
import type { Resume } from "#/features/resume/resume-schema";

// The form's values once typing settles, so the PDF isn't rebuilt on every
// keystroke.
export function usePreviewResume(form: ResumeForm): Resume {
  const [resume, setResume] = useState(() => form.state.values);

  useEffect(() => {
    let lastValues = form.state.values;
    const update = createDebouncedSave<Resume>({
      save: setResume,
      delayMs: PREVIEW_DEBOUNCE_MS,
    });

    // Same as the draft autosave: only a new values object is an edit.
    const subscription = form.store.subscribe(() => {
      const { values } = form.state;
      if (values === lastValues) return;
      lastValues = values;
      update.schedule(values);
    });

    // Leaving a changed field shows the edit at once. This document listener
    // runs after React's root onBlur, so a value trimmed on blur is included.
    document.addEventListener("focusout", update.flush);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener("focusout", update.flush);
      update.cancel();
    };
  }, [form]);

  return resume;
}
