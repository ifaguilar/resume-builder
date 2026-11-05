import {
  EntryCard,
  EntryHeader,
} from "#/features/resume-form/components/entry-card";
import { EntryList } from "#/features/resume-form/components/entry-list";
import { SectionWarnings } from "#/features/resume-form/components/section-warnings";
import { FLUENCY_SUGGESTIONS } from "#/features/resume-form/constants";
import { entryTitle } from "#/features/resume-form/entry-title";
import {
  resumeFormOptions,
  withFieldGroup,
  withForm,
} from "#/features/resume-form/use-resume-form";
import type { Language } from "#/features/resume/resume-schema";

const EMPTY_LANGUAGE: Language = {};

const LanguageFields = withFieldGroup({
  defaultValues: EMPTY_LANGUAGE,
  render: function LanguageFields({ group }) {
    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-6">
        <group.AppField name="language">
          {(field) => (
            <field.TextField label="Language" placeholder="e.g. Spanish" />
          )}
        </group.AppField>
        <group.AppField name="fluency">
          {(field) => (
            <field.AutocompleteField
              label="Fluency"
              placeholder="e.g. Professional working proficiency"
              suggestions={FLUENCY_SUGGESTIONS}
            />
          )}
        </group.AppField>
      </div>
    );
  },
});

export const LanguagesSection = withForm({
  ...resumeFormOptions,
  render: function LanguagesSection({ form }) {
    return (
      <div className="flex flex-col gap-6">
        <SectionWarnings store={form.store} section="languages" />
        <form.Field name="languages" mode="array">
          {(field) => {
            const entries = field.state.value ?? [];
            return (
              <EntryList
                count={entries.length}
                emptyText="No languages yet."
                addLabel="Add language"
                entryLabel="language"
                onAdd={() => field.pushValue({})}
                onRemove={(index) => field.removeValue(index)}
                onMove={(from, to) => field.moveValue(from, to)}
              >
                {({ index, remove }) => (
                  <EntryCard
                    header={
                      <form.Subscribe
                        selector={(state) => state.values.languages?.[index]}
                      >
                        {(entry) => (
                          <EntryHeader
                            title={entryTitle(
                              [entry?.language],
                              "New language",
                            )}
                            entry={entry}
                            entryLabel="language"
                            onRemove={remove}
                          />
                        )}
                      </form.Subscribe>
                    }
                  >
                    {/* useFieldGroup keeps the path it was created with, so the fields remount when the entry's index changes. */}
                    <LanguageFields
                      key={index}
                      form={form}
                      fields={`languages[${index}]`}
                    />
                  </EntryCard>
                )}
              </EntryList>
            );
          }}
        </form.Field>
      </div>
    );
  },
});
