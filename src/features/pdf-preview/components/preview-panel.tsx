import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

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

export function PreviewPanel() {
  return (
    <div className="h-full bg-muted">
      <ClientOnly fallback={<PreviewSkeleton />}>
        <Suspense fallback={<PreviewSkeleton />}>
          <PdfPreview />
        </Suspense>
      </ClientOnly>
    </div>
  );
}
