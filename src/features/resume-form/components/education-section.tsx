import {
  EntryCard,
  EntryHeader,
} from "#/features/resume-form/components/entry-card";
import { EntryList } from "#/features/resume-form/components/entry-list";
import { SectionWarnings } from "#/features/resume-form/components/section-warnings";
import { DEGREE_SUGGESTIONS } from "#/features/resume-form/constants";
import { entryTitle } from "#/features/resume-form/entry-title";
import {
  resumeFormOptions,
  withFieldGroup,
  withForm,
} from "#/features/resume-form/use-resume-form";
import type { EducationEntry } from "#/features/resume/resume-schema";

const EMPTY_EDUCATION_ENTRY: EducationEntry = {};

const EducationEntryFields = withFieldGroup({
  defaultValues: EMPTY_EDUCATION_ENTRY,
  render: function EducationEntryFields({ group }) {
    return (
      <>
        <group.AppField name="institution">
          {(field) => (
            <field.TextField
              label="Institution"
              placeholder="e.g. University of Texas"
            />
          )}
        </group.AppField>
        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          <group.AppField name="studyType">
            {(field) => (
              <field.AutocompleteField
                label="Degree"
                placeholder="e.g. Bachelor's degree"
                suggestions={DEGREE_SUGGESTIONS}
              />
            )}
          </group.AppField>
          <group.AppField name="area">
            {(field) => (
              <field.TextField
                label="Field of study"
                placeholder="e.g. Computer Science"
              />
            )}
          </group.AppField>
        </div>
        <group.AppField name="endDate">
          {(field) => (
            <field.DateField
              label="Graduation date (or expected)"
              kind="single"
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
    return (
      <div className="flex flex-col gap-6">
        <SectionWarnings store={form.store} section="education" />
        <form.Field name="education" mode="array">
          {(field) => {
            const entries = field.state.value ?? [];
            return (
              <EntryList
                isEmpty={entries.length === 0}
                emptyText="No education yet."
                addLabel="Add education"
                onAdd={() => field.pushValue({})}
              >
                {entries.map((_, index) => (
                  <EntryCard
                    // Index keys until entries get stable ids.
                    // oxlint-disable-next-line react/no-array-index-key
                    key={index}
                    header={
                      <form.Subscribe
                        selector={(state) => state.values.education?.[index]}
                      >
                        {(entry) => (
                          <EntryHeader
                            title={entryTitle(
                              [entry?.studyType, entry?.institution],
                              "New education",
                            )}
                            entry={entry}
                            entryLabel="education entry"
                            onRemove={() => field.removeValue(index)}
                          />
                        )}
                      </form.Subscribe>
                    }
                  >
                    <EducationEntryFields
                      form={form}
                      fields={`education[${index}]`}
                    />
                  </EntryCard>
                ))}
              </EntryList>
            );
          }}
        </form.Field>
      </div>
    );
  },
});
