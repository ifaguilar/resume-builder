import { Download } from "lucide-react";
import { use } from "react";

import { JSON_FILE_NAME, JSON_MIME_TYPE } from "#/features/export/constants";
import { downloadFile } from "#/features/export/download";
import { toJson } from "#/features/export/json-export";
import type { ResumeForm } from "#/features/resume-form/use-resume-form";
import type { Settings } from "#/features/resume/settings-schema";
import { m } from "#/paraglide/messages.js";
import { AnnounceContext } from "#/shared/components/announce-context";
import { StatusIcon } from "#/shared/components/status-icon";
import { Button } from "#/shared/components/ui/button";
import { useFeedback } from "#/shared/lib/use-feedback";

export function ExportJsonButton({
  form,
  settings,
}: {
  form: ResumeForm;
  settings: Settings;
}) {
  const done = useFeedback();
  const announce = use(AnnounceContext);

  function exportJson() {
    const json = toJson(form.state.values, settings);
    downloadFile(new Blob([json], { type: JSON_MIME_TYPE }), JSON_FILE_NAME);
    done.show();
    announce(m.export_json_done());
  }

  return (
    <Button variant="outline" size="sm" onClick={exportJson}>
      <StatusIcon status={done.shown ? "done" : "idle"} icon={<Download />} />
      {m.export_json_button()}
    </Button>
  );
}
