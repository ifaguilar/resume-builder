import {
  DRAFT_BACKUP_STORAGE_KEY,
  DRAFT_STORAGE_KEY,
} from "#/features/storage/constants";
import {
  type Draft,
  parseDraft,
  serializeDraft,
} from "#/features/storage/draft-format";
import type { DraftStorage } from "#/features/storage/storage";

// Moves an unreadable draft aside so the next save can't destroy it. The
// first backup is kept: it's the one most likely to hold real work.
function backUp(text: string) {
  if (localStorage.getItem(DRAFT_BACKUP_STORAGE_KEY) === null) {
    localStorage.setItem(DRAFT_BACKUP_STORAGE_KEY, text);
  }
  localStorage.removeItem(DRAFT_STORAGE_KEY);
}

// Storage can be blocked (SecurityError) or full (QuotaExceededError). The
// app keeps working either way: nothing loads, or a save is skipped and the
// next change tries again.
export const localDraftStorage: DraftStorage = {
  async loadDraft(): Promise<Draft | undefined> {
    try {
      const text = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (text === null) return undefined;
      const draft = parseDraft(text);
      if (!draft) backUp(text);
      return draft;
    } catch {
      return undefined;
    }
  },

  async saveDraft(draft: Draft): Promise<void> {
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, serializeDraft(draft));
    } catch {
      // See above.
    }
  },
};
