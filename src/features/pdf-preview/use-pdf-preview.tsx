import { pdf } from "@react-pdf/renderer";
import { useEffect, useRef, useState } from "react";

import { createLatestRender } from "#/features/pdf-preview/latest-render";
import type { Resume } from "#/features/resume/resume-schema";
import type { Settings } from "#/features/resume/settings-schema";
import { DefaultTemplate } from "#/features/templates/default/default-template";

type PreviewInput = { resume: Resume; settings: Settings };
type PreviewRender = ReturnType<typeof createLatestRender<PreviewInput, Blob>>;

// Each update renders a new document, as Export PDF does. usePDF keeps one
// react-pdf tree between updates, and react-pdf 4.9 adds a moved child at its
// new place without removing it from the old one, so reordered sections and
// entries showed twice.
export function usePdfPreview(resume: Resume, settings: Settings) {
  const [url, setUrl] = useState<string | undefined>(undefined);
  const [error, setError] = useState(false);
  const renderRef = useRef<PreviewRender | null>(null);

  useEffect(() => {
    const preview = createLatestRender<PreviewInput, Blob>({
      render: (input) => pdf(<DefaultTemplate {...input} />).toBlob(),
      onResult: (blob) => {
        setUrl(URL.createObjectURL(blob));
        setError(false);
      },
      onError: () => setError(true),
    });
    renderRef.current = preview;
    return () => preview.dispose();
  }, []);

  useEffect(() => {
    renderRef.current?.request({ resume, settings });
  }, [resume, settings]);

  useEffect(
    () => () => {
      if (url) URL.revokeObjectURL(url);
    },
    [url],
  );

  return { url, error };
}
