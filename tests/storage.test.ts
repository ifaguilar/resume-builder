import { afterEach, describe, expect, it, vi } from "vitest";

import type { Resume } from "#/features/resume/resume-schema";
import {
  DRAFT_BACKUP_STORAGE_KEY,
  DRAFT_STORAGE_KEY,
} from "#/features/storage/constants";
import { parseDraft, serializeDraft } from "#/features/storage/draft-format";
import { localDraftStorage } from "#/features/storage/local-storage";

const fixtures = import.meta.glob<Resume>("/tests/fixtures/*.json", {
  eager: true,
  import: "default",
});

function stubStorage({
  items = {},
  readThrows = false,
  writeThrows = false,
}: {
  items?: Record<string, string>;
  readThrows?: boolean;
  writeThrows?: boolean;
} = {}) {
  const store = new Map(Object.entries(items));
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => {
      if (readThrows) throw new DOMException("blocked", "SecurityError");
      return store.get(key) ?? null;
    },
    setItem: (key: string, value: string) => {
      if (writeThrows) throw new DOMException("full", "QuotaExceededError");
      store.set(key, value);
    },
    removeItem: (key: string) => store.delete(key),
  });
  return store;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("parseDraft", () => {
  it("reads a saved draft", () => {
    const resume = { basics: { name: "Ana Torres" } };
    expect(parseDraft(serializeDraft({ resume }))).toEqual({ resume });
  });

  it("keeps a resume that breaks schema rules", () => {
    const resume = { basics: { email: "ana@" }, extra: true };
    expect(parseDraft(serializeDraft({ resume }))).toEqual({ resume });
  });

  it.each([
    ["broken JSON", "{"],
    ["null", "null"],
    ["an array", "[]"],
    ["no resume", '{"version":1}'],
    ["a resume that isn't an object", '{"version":1,"resume":[]}'],
    ["another version", '{"version":2,"resume":{}}'],
  ])("rejects %s", (_, text) => {
    expect(parseDraft(text)).toBeUndefined();
  });

  it.each(Object.entries(fixtures))("round-trips %s", (_, resume) => {
    expect(parseDraft(serializeDraft({ resume }))).toEqual({ resume });
  });
});

describe("localDraftStorage", () => {
  it("saves and loads a draft", async () => {
    stubStorage();
    const resume = { basics: { name: "Ana Torres" } };
    await localDraftStorage.saveDraft({ resume });
    await expect(localDraftStorage.loadDraft()).resolves.toEqual({ resume });
  });

  it("loads nothing when there's no draft", async () => {
    stubStorage();
    await expect(localDraftStorage.loadDraft()).resolves.toBeUndefined();
  });

  it("backs up an unreadable draft and clears it", async () => {
    const store = stubStorage({ items: { [DRAFT_STORAGE_KEY]: "{broken" } });
    await expect(localDraftStorage.loadDraft()).resolves.toBeUndefined();
    expect(store.get(DRAFT_BACKUP_STORAGE_KEY)).toBe("{broken");
    expect(store.has(DRAFT_STORAGE_KEY)).toBe(false);
  });

  it("never overwrites an existing backup", async () => {
    const store = stubStorage({
      items: {
        [DRAFT_STORAGE_KEY]: "second",
        [DRAFT_BACKUP_STORAGE_KEY]: "first",
      },
    });
    await localDraftStorage.loadDraft();
    expect(store.get(DRAFT_BACKUP_STORAGE_KEY)).toBe("first");
    expect(store.has(DRAFT_STORAGE_KEY)).toBe(false);
  });

  it("loads nothing when storage is blocked", async () => {
    stubStorage({ readThrows: true });
    await expect(localDraftStorage.loadDraft()).resolves.toBeUndefined();
  });

  it("skips a save when storage is full", async () => {
    stubStorage({ writeThrows: true });
    await expect(
      localDraftStorage.saveDraft({ resume: {} }),
    ).resolves.toBeUndefined();
  });
});
