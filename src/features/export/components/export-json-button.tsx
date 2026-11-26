import { Download } from "lucide-react";

import { JSON_FILE_NAME, JSON_MIME_TYPE } from "#/features/export/constants";
import { downloadFile } from "#/features/export/download";
import { toJson } from "#/features/export/json-export";
import type { ResumeForm } from "#/features/resume-form/use-resume-form";
import type { Settings } from "#/features/resume/settings-schema";
import { m } from "#/paraglide/messages.js";
import { Button } from "#/shared/components/ui/button";

export function ExportJsonButton({
  form,
  settings,
}: {
  form: ResumeForm;
  settings: Settings;
}) {
  function exportJson() {
    const json = toJson(form.state.values, settings);
    downloadFile(new Blob([json], { type: JSON_MIME_TYPE }), JSON_FILE_NAME);
  }

  return (
    <Button variant="outline" size="sm" onClick={exportJson}>
      <Download data-icon="inline-start" aria-hidden />
      {m.export_json_button()}
    </Button>
  );
}
