import {
  EntryCard,
  EntryHeader,
} from "#/features/resume-form/components/entry-card";
import { EntryList } from "#/features/resume-form/components/entry-list";
import { SectionWarnings } from "#/features/resume-form/components/section-warnings";
import { ENTRY_MESSAGES } from "#/features/resume-form/constants";
import { entryTitle } from "#/features/resume-form/entry-title";
import {
  StoredValue,
  StoredValueCard,
} from "#/features/resume-form/fields/stored-value-card";
import {
  resumeFormOptions,
  withFieldGroup,
  withForm,
} from "#/features/resume-form/use-resume-form";
import type { WorkEntry } from "#/features/resume/resume-schema";
import {
  isListOrMissing,
  isRecordOrMissing,
} from "#/features/resume/stored-value";
import { m } from "#/paraglide/messages.js";

const EMPTY_WORK_ENTRY: WorkEntry = {};

const WorkEntryFields = withFieldGroup({
  defaultValues: EMPTY_WORK_ENTRY,
  render: function WorkEntryFields({ group }) {
    return (
      <>
        <group.AppField name="position">
          {(field) => (
            <field.TextField
              label={m.form_position_label()}
              placeholder={m.form_position_placeholder()}
            />
          )}
        </group.AppField>
        <group.AppField name="name">
          {(field) => (
            <field.TextField
              label={m.form_company_label()}
              placeholder={m.form_company_placeholder()}
            />
          )}
        </group.AppField>
        <group.AppField name="location">
          {(field) => (
            <field.LocationField
              label={m.form_work_location_label()}
              placeholder={m.form_work_location_placeholder()}
            />
          )}
        </group.AppField>
        <div className="grid grid-cols-1 gap-x-4 gap-y-6 @lg/form:grid-cols-2">
          <group.AppField name="startDate">
            {(field) => (
              <field.DateField label={m.form_start_date_label()} kind="start" />
            )}
          </group.AppField>
          <group.AppField name="endDate">
            {(field) => (
              <field.DateField label={m.form_end_date_label()} kind="end" />
            )}
          </group.AppField>
        </div>
        <group.AppField name="highlights">
          {(field) => (
            <field.HighlightsField
              label={m.form_achievements_label()}
              addLabel={m.form_add_bullet()}
              placeholder={m.form_work_achievements_placeholder()}
              description={m.form_work_achievements_tip()}
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
            const value: unknown = field.state.value;
            if (!isListOrMissing(value)) {
              return (
                <StoredValueCard
                  value={value}
                  onClear={() => field.handleChange(undefined)}
                />
              );
            }
            const entries = field.state.value ?? [];
            return (
              <EntryList
                count={entries.length}
                messages={ENTRY_MESSAGES.work}
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
                              ENTRY_MESSAGES.work.untitled(),
                            )}
                            entry={entry}
                            messages={ENTRY_MESSAGES.work}
                            onRemove={remove}
                          />
                        )}
                      </form.Subscribe>
                    }
                  >
                    {/* useFieldGroup keeps its first path, so remount when the entry moves. */}
                    {isRecordOrMissing(entries[index]) ? (
                      <WorkEntryFields
                        key={index}
                        form={form}
                        fields={`work[${index}]`}
                      />
                    ) : (
                      <StoredValue value={entries[index]} />
                    )}
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
