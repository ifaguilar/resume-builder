import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { z } from "zod";

import { EditorPage } from "#/features/editor/components/editor-page";
import { DEFAULT_EDITOR_TAB, EDITOR_TABS } from "#/features/editor/constants";
import { applyDocumentLanguage } from "#/features/languages/document-language";
import { storage } from "#/features/storage/storage";

const editorSearchSchema = z.object({
  tab: z.enum(EDITOR_TABS).catch(DEFAULT_EDITOR_TAB),
});

export const Route = createFileRoute("/")({
  // The draft lives in the browser, so the editor renders there, starting
  // from the draft instead of swapping it in after an empty server render.
  ssr: false,
  validateSearch: editorSearchSchema,
  search: { middlewares: [stripSearchParams({ tab: DEFAULT_EDITOR_TAB })] },
  // The editor owns the draft after the first load, so a tab change must not
  // read it again.
  shouldReload: false,
  beforeLoad: applyDocumentLanguage,
  loader: () => storage.loadDraft(),
  component: EditorRoute,
});

function EditorRoute() {
  return <EditorPage draft={Route.useLoaderData()} />;
}
