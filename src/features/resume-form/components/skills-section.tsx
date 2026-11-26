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
import type { Skill } from "#/features/resume/resume-schema";
import {
  isListOrMissing,
  isRecordOrMissing,
} from "#/features/resume/stored-value";
import { m } from "#/paraglide/messages.js";

const EMPTY_SKILL: Skill = {};

const SkillFields = withFieldGroup({
  defaultValues: EMPTY_SKILL,
  render: function SkillFields({ group }) {
    return (
      <>
        <group.AppField name="name">
          {(field) => (
            <field.TextField
              label={m.form_category_label()}
              placeholder={m.form_category_placeholder()}
            />
          )}
        </group.AppField>
        <group.AppField name="keywords">
          {(field) => (
            <field.KeywordsField
              label={m.form_skills_label()}
              placeholder={m.form_skills_placeholder()}
              description={m.form_skills_tip()}
            />
          )}
        </group.AppField>
      </>
    );
  },
});

export const SkillsSection = withForm({
  ...resumeFormOptions,
  render: function SkillsSection({ form }) {
    return (
      <div className="flex flex-col gap-6">
        <SectionWarnings store={form.store} section="skills" />
        <form.Field name="skills" mode="array">
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
                messages={ENTRY_MESSAGES.category}
                onAdd={() => field.pushValue({})}
                onRemove={(index) => field.removeValue(index)}
                onMove={(from, to) => field.moveValue(from, to)}
              >
                {({ index, remove }) => (
                  <EntryCard
                    header={
                      <form.Subscribe
                        selector={(state) => state.values.skills?.[index]}
                      >
                        {(entry) => (
                          <EntryHeader
                            title={entryTitle(
                              [entry?.name],
                              ENTRY_MESSAGES.category.untitled(),
                            )}
                            entry={entry}
                            messages={ENTRY_MESSAGES.category}
                            onRemove={remove}
                          />
                        )}
                      </form.Subscribe>
                    }
                  >
                    {/* useFieldGroup keeps its first path, so remount when the entry moves. */}
                    {isRecordOrMissing(entries[index]) ? (
                      <SkillFields
                        key={index}
                        form={form}
                        fields={`skills[${index}]`}
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
