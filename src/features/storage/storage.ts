import type { Draft } from "#/features/storage/draft-format";
import { localDraftStorage } from "#/features/storage/local-storage";

// Async so the backend can move to IndexedDB without touching callers.
export type DraftStorage = {
  loadDraft(): Promise<Draft | undefined>;
  saveDraft(draft: Draft): Promise<void>;
};

export const storage: DraftStorage = localDraftStorage;
