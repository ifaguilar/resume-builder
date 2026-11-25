import { useEffect } from "react";

import { DRAFT_SAVE_DEBOUNCE_MS } from "#/features/editor/constants";
import { createDebouncedSave } from "#/features/editor/debounced-save";
import type { ResumeForm } from "#/features/resume-form/use-resume-form";
import type { Resume } from "#/features/resume/resume-schema";
import { storage } from "#/features/storage/storage";

export function useDraftAutosave(form: ResumeForm) {
  useEffect(() => {
    let lastValues = form.state.values;
    const draftSave = createDebouncedSave<Resume>({
      save: (resume) => void storage.saveDraft({ resume }),
      delayMs: DRAFT_SAVE_DEBOUNCE_MS,
    });

    // The store also changes for meta such as focus and warnings, so only a
    // new values object counts. This catches every write, including array
    // moves and imports, which form listeners would miss.
    const subscription = form.store.subscribe(() => {
      const { values } = form.state;
      if (values === lastValues) return;
      lastValues = values;
      draftSave.schedule(values);
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
    };
  }, [form]);
}
