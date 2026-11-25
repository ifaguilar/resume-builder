import { useEffect, useRef } from "react";

import { DRAFT_SAVE_DEBOUNCE_MS } from "#/features/editor/constants";
import { createDebouncedSave } from "#/features/editor/debounced-save";
import type { ResumeForm } from "#/features/resume-form/use-resume-form";
import type { Settings } from "#/features/resume/settings-schema";
import type { Draft } from "#/features/storage/draft-format";
import { storage } from "#/features/storage/storage";

export function useDraftAutosave(form: ResumeForm, settings: Settings) {
  const settingsRef = useRef(settings);
  const draftSaveRef = useRef<ReturnType<
    typeof createDebouncedSave<Draft>
  > | null>(null);

  useEffect(() => {
    let lastValues = form.state.values;
    const draftSave = createDebouncedSave<Draft>({
      save: (draft) => void storage.saveDraft(draft),
      delayMs: DRAFT_SAVE_DEBOUNCE_MS,
    });
    draftSaveRef.current = draftSave;

    // The store also changes for meta such as focus and warnings, so only a
    // new values object counts. This catches every write, including array
    // moves and imports, which form listeners would miss.
    const subscription = form.store.subscribe(() => {
      const { values } = form.state;
      if (values === lastValues) return;
      lastValues = values;
      draftSave.schedule({ resume: values, settings: settingsRef.current });
    });

    // The page may be gone before the debounce ends.
    function flushWhenHidden() {
      if (document.visibilityState === "hidden") draftSave.flush();
    }
    window.addEventListener("pagehide", draftSave.flush);
    document.addEventListener("visibilitychange", flushWhenHidden);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("pagehide", draftSave.flush);
      document.removeEventListener("visibilitychange", flushWhenHidden);
      draftSave.flush();
      draftSaveRef.current = null;
    };
  }, [form]);

  useEffect(() => {
    // Loading a draft isn't an edit, so it never writes.
    if (settingsRef.current === settings) return;
    settingsRef.current = settings;
    draftSaveRef.current?.schedule({ resume: form.state.values, settings });
  }, [form, settings]);
}
