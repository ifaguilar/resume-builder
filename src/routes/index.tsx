import { createFileRoute } from "@tanstack/react-router";

import { EditorPage } from "#/features/editor/components/editor-page";
import { storage } from "#/features/storage/storage";

export const Route = createFileRoute("/")({
  // The draft lives in the browser, so the editor renders there, starting
  // from the draft instead of swapping it in after an empty server render.
  ssr: false,
  loader: () => storage.loadDraft(),
  component: EditorRoute,
});

function EditorRoute() {
  return <EditorPage draft={Route.useLoaderData()} />;
}
