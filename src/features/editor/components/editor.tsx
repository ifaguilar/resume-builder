import { useState } from "react";

import { DesignPanel } from "#/features/design/components/design-panel";
import { AppHeader } from "#/features/editor/components/app-header";
import { EditorTabs } from "#/features/editor/components/editor-tabs";
import { PanelDivider } from "#/features/editor/components/panel-divider";
import {
  FORM_PANEL_DEFAULT_SIZE_PERCENT,
  FORM_PANEL_MIN_SIZE_PX,
  RESIZE_TARGET_COARSE_PX,
  RESIZE_TARGET_FINE_PX,
  PREVIEW_PANEL_DEFAULT_SIZE_PERCENT,
  PREVIEW_PANEL_MIN_SIZE_PX,
} from "#/features/editor/constants";
import { useDraftAutosave } from "#/features/editor/use-draft-autosave";
import { PreviewPanel } from "#/features/pdf-preview/components/preview-panel";
import { usePreviewResume } from "#/features/pdf-preview/use-preview-resume";
import { FormPanel } from "#/features/resume-form/components/form-panel";
import { useResumeForm } from "#/features/resume-form/use-resume-form";
import { DEFAULT_SETTINGS } from "#/features/resume/settings-schema";
import type { Draft } from "#/features/storage/draft-format";
import {
  ResizablePanel,
  ResizablePanelGroup,
} from "#/shared/components/ui/resizable";
import { TooltipProvider } from "#/shared/components/ui/tooltip";

export function Editor({
  draft,
  onImport,
}: {
  draft: Draft | undefined;
  onImport: (draft: Draft) => void;
}) {
  const form = useResumeForm(draft?.resume);
  const [settings, setSettings] = useState(draft?.settings ?? DEFAULT_SETTINGS);
  useDraftAutosave(form, settings);
  const previewResume = usePreviewResume(form);

  return (
    <TooltipProvider>
      <div className="flex h-dvh flex-col">
        <AppHeader form={form} settings={settings} onImport={onImport} />
        <ResizablePanelGroup
          orientation="horizontal"
          // The PDF preview is an embedded document, which swallows pointer
          // events and would stop a drag that moves over it.
          className="min-h-0 flex-1 has-data-[separator=active]:[&_object]:pointer-events-none"
          resizeTargetMinimumSize={{
            fine: RESIZE_TARGET_FINE_PX,
            coarse: RESIZE_TARGET_COARSE_PX,
          }}
        >
          <ResizablePanel
            defaultSize={FORM_PANEL_DEFAULT_SIZE_PERCENT}
            minSize={FORM_PANEL_MIN_SIZE_PX}
          >
            <EditorTabs
              panels={{
                content: <FormPanel form={form} />,
                design: (
                  <DesignPanel
                    form={form}
                    settings={settings}
                    onSettingsChange={setSettings}
                  />
                ),
              }}
            />
          </ResizablePanel>
          <PanelDivider />
          <ResizablePanel
            defaultSize={PREVIEW_PANEL_DEFAULT_SIZE_PERCENT}
            minSize={PREVIEW_PANEL_MIN_SIZE_PX}
          >
            <PreviewPanel resume={previewResume} settings={settings} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </TooltipProvider>
  );
}
