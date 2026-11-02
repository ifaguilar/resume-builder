import { AppHeader } from "#/features/editor/components/app-header";
import {
  FORM_PANEL_DEFAULT_SIZE_PERCENT,
  FORM_PANEL_MIN_SIZE_PX,
  PREVIEW_PANEL_DEFAULT_SIZE_PERCENT,
  PREVIEW_PANEL_MIN_SIZE_PX,
} from "#/features/editor/constants";
import { PreviewPanel } from "#/features/pdf-preview/components/preview-panel";
import { FormPanel } from "#/features/resume-form/components/form-panel";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "#/shared/components/ui/resizable";

export function EditorPage() {
  return (
    <div className="flex h-dvh flex-col">
      <AppHeader />
      <ResizablePanelGroup orientation="horizontal" className="min-h-0 flex-1">
        <ResizablePanel
          defaultSize={FORM_PANEL_DEFAULT_SIZE_PERCENT}
          minSize={FORM_PANEL_MIN_SIZE_PX}
        >
          <FormPanel />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          defaultSize={PREVIEW_PANEL_DEFAULT_SIZE_PERCENT}
          minSize={PREVIEW_PANEL_MIN_SIZE_PX}
        >
          <PreviewPanel />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
