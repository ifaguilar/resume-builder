import { useStore } from "@tanstack/react-form";

import { cvLanguage, cvWords } from "#/features/languages/cv-language";
import {
  EntryCard,
  EntryHeader,
} from "#/features/resume-form/components/entry-card";
import { EntryList } from "#/features/resume-form/components/entry-list";
import { SectionWarnings } from "#/features/resume-form/components/section-warnings";
import { ENTRY_MESSAGES } from "#/features/resume-form/constants";
import { entryTitle } from "#/features/resume-form/entry-title";
import {
  resumeFormOptions,
  withFieldGroup,
  withForm,
} from "#/features/resume-form/use-resume-form";
import type { EducationEntry } from "#/features/resume/resume-schema";
import { m } from "#/paraglide/messages.js";

const EMPTY_EDUCATION_ENTRY: EducationEntry = {};

type SuggestionProps = { suggestions: readonly string[]; placeholder: string };
const NO_SUGGESTIONS: SuggestionProps = { suggestions: [], placeholder: "" };

const EducationEntryFields = withFieldGroup({
  defaultValues: EMPTY_EDUCATION_ENTRY,
  props: NO_SUGGESTIONS,
  render: function EducationEntryFields({ group, suggestions, placeholder }) {
    return (
      <>
        <group.AppField name="institution">
          {(field) => (
            <field.TextField
              label={m.form_institution_label()}
              placeholder={m.form_institution_placeholder()}
            />
          )}
        </group.AppField>
        <div className="grid grid-cols-1 gap-x-4 gap-y-6 @2xl/form:grid-cols-2">
          <group.AppField name="studyType">
            {(field) => (
              <field.AutocompleteField
                label={m.form_degree_label()}
                placeholder={placeholder}
                suggestions={suggestions}
              />
            )}
          </group.AppField>
          <group.AppField name="area">
            {(field) => (
              <field.TextField
                label={m.form_study_area_label()}
                placeholder={m.form_study_area_placeholder()}
              />
            )}
          </group.AppField>
        </div>
        <group.AppField name="endDate">
          {(field) => (
            <field.DateField
              label={m.form_graduation_date_label()}
              kind="single"
              allowFuture
            />
          )}
        </group.AppField>
      </>
    );
  },
});

export const EducationSection = withForm({
  ...resumeFormOptions,
  render: function EducationSection({ form }) {
    // The degree is printed on the CV, so it's suggested in the CV's language.
    const meta = useStore(form.store, (state) => state.values.meta);
    const words = cvWords(cvLanguage({ meta }));
    return (
      <div className="flex flex-col gap-6">
        <SectionWarnings store={form.store} section="education" />
        <form.Field name="education" mode="array">
          {(field) => {
            const entries = field.state.value ?? [];
            return (
              <EntryList
                count={entries.length}
                messages={ENTRY_MESSAGES.education}
                onAdd={() => field.pushValue({})}
                onRemove={(index) => field.removeValue(index)}
                onMove={(from, to) => field.moveValue(from, to)}
              >
                {({ index, remove }) => (
                  <EntryCard
                    header={
                      <form.Subscribe
                        selector={(state) => state.values.education?.[index]}
                      >
                        {(entry) => (
                          <EntryHeader
                            title={entryTitle(
                              [entry?.studyType, entry?.institution],
                              ENTRY_MESSAGES.education.untitled(),
                            )}
                            entry={entry}
                            messages={ENTRY_MESSAGES.education}
                            onRemove={remove}
                          />
                        )}
                      </form.Subscribe>
                    }
                  >
                    {/* useFieldGroup keeps its first path, so remount when the entry moves. */}
                    <EducationEntryFields
                      key={index}
                      form={form}
                      fields={`education[${index}]`}
                      suggestions={words.degreeSuggestions}
                      placeholder={m.form_example({
                        text: words.degreeExample,
                      })}
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
