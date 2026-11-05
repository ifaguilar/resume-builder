import {
  EntryCard,
  EntryHeader,
} from "#/features/resume-form/components/entry-card";
import { EntryList } from "#/features/resume-form/components/entry-list";
import { SectionWarnings } from "#/features/resume-form/components/section-warnings";
import { entryTitle } from "#/features/resume-form/entry-title";
import {
  resumeFormOptions,
  withFieldGroup,
  withForm,
} from "#/features/resume-form/use-resume-form";
import type { WorkEntry } from "#/features/resume/resume-schema";

const EMPTY_WORK_ENTRY: WorkEntry = {};

const WorkEntryFields = withFieldGroup({
  defaultValues: EMPTY_WORK_ENTRY,
  render: function WorkEntryFields({ group }) {
    return (
      <>
        <group.AppField name="position">
          {(field) => (
            <field.TextField
              label="Position"
              placeholder="e.g. Frontend Developer"
            />
          )}
        </group.AppField>
        <group.AppField name="name">
          {(field) => (
            <field.TextField label="Company" placeholder="e.g. Acme Inc." />
          )}
        </group.AppField>
        <group.AppField name="location">
          {(field) => (
            <field.LocationField
              label="Location"
              placeholder="e.g. Austin, TX or Remote"
            />
          )}
        </group.AppField>
        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          <group.AppField name="startDate">
            {(field) => <field.DateField label="Start date" kind="start" />}
          </group.AppField>
          <group.AppField name="endDate">
            {(field) => <field.DateField label="End date" kind="end" />}
          </group.AppField>
        </div>
        <group.AppField name="highlights">
          {(field) => (
            <field.HighlightsField
              label="Achievements"
              addLabel="Add bullet"
              placeholder="e.g. Cut page load time by 40% by moving images to a CDN"
              description="Three to five bullets. Start with a verb and show the result, with a number when you can."
            />
          )}
        </group.AppField>
      </>
    );
  },
});

export const WorkSection = withForm({
  ...resumeFormOptions,
  render: function WorkSection({ form }) {
    return (
      <div className="flex flex-col gap-6">
        <SectionWarnings store={form.store} section="work" />
        <form.Field name="work" mode="array">
          {(field) => {
            const entries = field.state.value ?? [];
            return (
              <EntryList
                count={entries.length}
                emptyText="No work experience yet."
                addLabel="Add work entry"
                entryLabel="work entry"
                onAdd={() => field.pushValue({})}
                onRemove={(index) => field.removeValue(index)}
                onMove={(from, to) => field.moveValue(from, to)}
              >
                {({ index, remove }) => (
                  <EntryCard
                    header={
                      <form.Subscribe
                        selector={(state) => state.values.work?.[index]}
                      >
                        {(entry) => (
                          <EntryHeader
                            title={entryTitle(
                              [entry?.position, entry?.name],
                              "New work entry",
                            )}
                            entry={entry}
                            entryLabel="work entry"
                            onRemove={remove}
                          />
                        )}
                      </form.Subscribe>
                    }
                  >
                    {/* useFieldGroup keeps the path it was created with, so the fields remount when the entry's index changes. */}
                    <WorkEntryFields
                      key={index}
                      form={form}
                      fields={`work[${index}]`}
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
