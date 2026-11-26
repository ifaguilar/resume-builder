import { useStore } from "@tanstack/react-form";
import type { Dispatch, SetStateAction } from "react";

import { PageSizeField } from "#/features/design/components/page-size-field";
import { SectionsField } from "#/features/design/components/sections-field";
import {
  LANGUAGE_GROUP_TITLE,
  PAGE_GROUP_TITLE,
  SECTIONS_GROUP_TITLE,
} from "#/features/design/constants";
import { CvLanguageField } from "#/features/languages/components/cv-language-field";
import {
  cvLanguage,
  cvWords,
  unsupportedCvLanguage,
} from "#/features/languages/cv-language";
import type { ResumeForm } from "#/features/resume-form/use-resume-form";
import type { Settings } from "#/features/resume/settings-schema";
import { LiveAnnouncer } from "#/shared/components/live-announcer";
import { ScrollArea } from "#/shared/components/ui/scroll-area";

export function DesignPanel({
  form,
  settings,
  onSettingsChange,
}: {
  form: ResumeForm;
  settings: Settings;
  onSettingsChange: Dispatch<SetStateAction<Settings>>;
}) {
  const meta = useStore(form.store, (state) => state.values.meta);
  const language = cvLanguage({ meta });
  const unsupported = unsupportedCvLanguage({ meta });

  return (
    <LiveAnnouncer>
      <ScrollArea className="@container/form h-full bg-background">
        <div className="flex flex-col gap-4 p-2 @lg/form:p-4">
          <section className="flex flex-col gap-4 px-3 py-4 @lg/form:px-5">
            <h2 className="text-base font-semibold">{LANGUAGE_GROUP_TITLE}</h2>
            <CvLanguageField
              value={language}
              unsupported={unsupported}
              onChange={(next) => form.setFieldValue("meta.language", next)}
            />
          </section>
          <section className="flex flex-col gap-4 px-3 py-4 @lg/form:px-5">
            <h2 className="text-base font-semibold">{SECTIONS_GROUP_TITLE}</h2>
            <SectionsField
              sections={settings.sections}
              defaultTitles={cvWords(language).sectionTitles}
              onChange={(change) =>
                onSettingsChange((current) => {
                  const sections = change(current.sections);
                  return sections === current.sections
                    ? current
                    : { ...current, sections };
                })
              }
            />
          </section>
          <section className="flex flex-col gap-4 px-3 py-4 @lg/form:px-5">
            <h2 className="text-base font-semibold">{PAGE_GROUP_TITLE}</h2>
            <PageSizeField
              value={settings.pageSize}
              onChange={(pageSize) =>
                onSettingsChange((current) => ({ ...current, pageSize }))
              }
            />
          </section>
        </div>
      </ScrollArea>
    </LiveAnnouncer>
  );
}
