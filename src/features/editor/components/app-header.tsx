import { ColorSchemeMenu } from "#/features/color-scheme/color-scheme-menu";
import { ExportJsonButton } from "#/features/export/components/export-json-button";
import { ExportPdfButton } from "#/features/export/components/export-pdf-button";
import { ImportJsonButton } from "#/features/import/components/import-json-button";
import type { ResumeForm } from "#/features/resume-form/use-resume-form";
import type { Settings } from "#/features/resume/settings-schema";
import type { Draft } from "#/features/storage/draft-format";
import { ButtonGroup } from "#/shared/components/ui/button-group";

export function AppHeader({
  form,
  settings,
  onImport,
}: {
  form: ResumeForm;
  settings: Settings;
  onImport: (draft: Draft) => void;
}) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b px-4">
      <h1 className="text-base font-semibold">Resume Builder</h1>
      <div className="flex items-center gap-2">
        <ButtonGroup>
          <ImportJsonButton form={form} onImport={onImport} />
          <ExportJsonButton form={form} settings={settings} />
        </ButtonGroup>
        <ExportPdfButton form={form} settings={settings} />
        <ColorSchemeMenu />
      </div>
    </header>
  );
}
