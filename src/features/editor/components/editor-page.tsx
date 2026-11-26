import { useEffect, useState } from "react";

import { Editor } from "#/features/editor/components/editor";
import type { Draft } from "#/features/storage/draft-format";
import { storage } from "#/features/storage/storage";

export function EditorPage({ draft }: { draft: Draft | undefined }) {
  const [current, setCurrent] = useState({ draft, importCount: 0 });

  // An effect, not the click handler: the old editor's autosave flushes on
  // unmount, and React runs every unmount cleanup before mount effects, so
  // this save comes last and the imported draft wins.
  useEffect(() => {
    if (current.importCount > 0 && current.draft) {
      void storage.saveDraft(current.draft);
    }
  }, [current]);

  // A new key gives the import a fresh form: list keys, field state and
  // warnings all start from the imported resume.
  return (
    <Editor
      key={current.importCount}
      draft={current.draft}
      imported={current.importCount > 0}
      onImport={(imported) =>
        setCurrent(({ importCount }) => ({
          draft: imported,
          importCount: importCount + 1,
        }))
      }
    />
  );
}
