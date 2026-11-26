import { useStore } from "@tanstack/react-form";

import { ColorSchemeField } from "#/features/color-scheme/color-scheme-field";
import { CvLanguageField } from "#/features/languages/components/cv-language-field";
import { UiLanguageField } from "#/features/languages/components/ui-language-field";
import {
  cvLanguage,
  unsupportedCvLanguage,
} from "#/features/languages/cv-language";
import type { ResumeForm } from "#/features/resume-form/use-resume-form";
import { m } from "#/paraglide/messages.js";
import { ScrollArea } from "#/shared/components/ui/scroll-area";

export function SettingsPanel({ form }: { form: ResumeForm }) {
  const meta = useStore(form.store, (state) => state.values.meta);

  return (
    <ScrollArea className="@container/form h-full bg-background">
      <div className="flex flex-col gap-4 p-2 @lg/form:p-4">
        <section className="flex flex-col gap-4 px-3 py-4 @lg/form:px-5">
          <h2 className="text-base font-semibold">
            {m.settings_document_title()}
          </h2>
          <CvLanguageField
            value={cvLanguage({ meta })}
            unsupported={unsupportedCvLanguage({ meta })}
            onChange={(next) => form.setFieldValue("meta.language", next)}
          />
        </section>
        <section className="flex flex-col gap-4 px-3 py-4 @lg/form:px-5">
          <h2 className="text-base font-semibold">{m.settings_app_title()}</h2>
          <UiLanguageField />
          <ColorSchemeField />
        </section>
      </div>
    </ScrollArea>
  );
}
