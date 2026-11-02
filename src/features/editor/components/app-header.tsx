import { Download, FileDown, Upload } from "lucide-react";

import { Button } from "#/shared/components/ui/button";
import { ButtonGroup } from "#/shared/components/ui/button-group";

export function AppHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b px-4">
      <h1 className="text-base font-semibold">Resume Builder</h1>
      <div className="flex items-center gap-2">
        <ButtonGroup>
          <Button variant="outline" size="sm" disabled>
            <Upload data-icon="inline-start" aria-hidden />
            Import JSON
          </Button>
          <Button variant="outline" size="sm" disabled>
            <Download data-icon="inline-start" aria-hidden />
            Export JSON
          </Button>
        </ButtonGroup>
        <Button size="sm" disabled>
          <FileDown data-icon="inline-start" aria-hidden />
          Export PDF
        </Button>
      </div>
    </header>
  );
}
