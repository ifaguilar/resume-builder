import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

import { PREVIEW_LOADING_MESSAGE } from "#/features/pdf-preview/constants";
import type { Resume } from "#/features/resume/resume-schema";
import type { Settings } from "#/features/resume/settings-schema";

const PdfPreview = lazy(
  () => import("#/features/pdf-preview/components/pdf-preview"),
);

function PreviewSkeleton() {
  return (
    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
      {PREVIEW_LOADING_MESSAGE}
    </div>
  );
}

export function PreviewPanel({
  resume,
  settings,
}: {
  resume: Resume;
  settings: Settings;
}) {
  return (
    <div className="h-full bg-muted">
      <ClientOnly fallback={<PreviewSkeleton />}>
        <Suspense fallback={<PreviewSkeleton />}>
          <PdfPreview
            resume={resume}
            settings={settings}
            fallback={<PreviewSkeleton />}
          />
        </Suspense>
      </ClientOnly>
    </div>
  );
}
