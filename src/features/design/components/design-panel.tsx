import { PageSizeField } from "#/features/design/components/page-size-field";
import { PAGE_GROUP_TITLE } from "#/features/design/constants";
import type { Settings } from "#/features/resume/settings-schema";
import { ScrollArea } from "#/shared/components/ui/scroll-area";

export function DesignPanel({
  settings,
  onSettingsChange,
}: {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}) {
  return (
    <ScrollArea className="@container/form h-full bg-background">
      <div className="flex flex-col gap-4 p-2 @lg/form:p-4">
        <section className="flex flex-col gap-4 px-3 py-4 @lg/form:px-5">
          <h2 className="text-base font-semibold">{PAGE_GROUP_TITLE}</h2>
          <PageSizeField
            value={settings.pageSize}
            onChange={(pageSize) => onSettingsChange({ ...settings, pageSize })}
          />
        </section>
      </div>
    </ScrollArea>
  );
}
