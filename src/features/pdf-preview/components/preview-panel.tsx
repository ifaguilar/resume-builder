import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

import type { Resume } from "#/features/resume/resume-schema";

const PdfPreview = lazy(
  () => import("#/features/pdf-preview/components/pdf-preview"),
);

function PreviewSkeleton() {
  return (
    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
      Loading preview…
    </div>
  );
}

export function PreviewPanel({ resume }: { resume: Resume }) {
  return (
    <div className="h-full bg-muted">
      <ClientOnly fallback={<PreviewSkeleton />}>
        <Suspense fallback={<PreviewSkeleton />}>
          <PdfPreview resume={resume} />
        </Suspense>
      </ClientOnly>
    </div>
  );
}
