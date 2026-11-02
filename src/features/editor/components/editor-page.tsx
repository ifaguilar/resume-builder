import { AppHeader } from "#/features/editor/components/app-header";
import { PanelDivider } from "#/features/editor/components/panel-divider";
import {
  FORM_PANEL_DEFAULT_SIZE_PERCENT,
  FORM_PANEL_MIN_SIZE_PX,
  RESIZE_TARGET_COARSE_PX,
  RESIZE_TARGET_FINE_PX,
  PREVIEW_PANEL_DEFAULT_SIZE_PERCENT,
  PREVIEW_PANEL_MIN_SIZE_PX,
} from "#/features/editor/constants";
import { PreviewPanel } from "#/features/pdf-preview/components/preview-panel";
import { FormPanel } from "#/features/resume-form/components/form-panel";
import { useResumeForm } from "#/features/resume-form/use-resume-form";
import {
  ResizablePanel,
  ResizablePanelGroup,
} from "#/shared/components/ui/resizable";
import { TooltipProvider } from "#/shared/components/ui/tooltip";

export function EditorPage() {
  const form = useResumeForm();

  return (
    <TooltipProvider>
      <div className="flex h-dvh flex-col">
        <AppHeader />
        <ResizablePanelGroup
          orientation="horizontal"
          // The PDF preview is an iframe, which swallows pointer events and
          // would stop a drag that moves over it.
          className="min-h-0 flex-1 has-data-[separator=active]:[&_iframe]:pointer-events-none"
          resizeTargetMinimumSize={{
            fine: RESIZE_TARGET_FINE_PX,
            coarse: RESIZE_TARGET_COARSE_PX,
          }}
        >
          <ResizablePanel
            defaultSize={FORM_PANEL_DEFAULT_SIZE_PERCENT}
            minSize={FORM_PANEL_MIN_SIZE_PX}
          >
            <FormPanel form={form} />
          </ResizablePanel>
          <PanelDivider />
          <ResizablePanel
            defaultSize={PREVIEW_PANEL_DEFAULT_SIZE_PERCENT}
            minSize={PREVIEW_PANEL_MIN_SIZE_PX}
          >
            <PreviewPanel />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </TooltipProvider>
  );
}
