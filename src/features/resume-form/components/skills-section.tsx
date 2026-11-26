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
import type { Skill } from "#/features/resume/resume-schema";

const EMPTY_SKILL: Skill = {};

const SkillFields = withFieldGroup({
  defaultValues: EMPTY_SKILL,
  render: function SkillFields({ group }) {
    return (
      <>
        <group.AppField name="name">
          {(field) => (
            <field.TextField label="Category" placeholder="e.g. Frontend" />
          )}
        </group.AppField>
        <group.AppField name="keywords">
          {(field) => (
            <field.KeywordsField
              label="Skills"
              placeholder="e.g. React, TypeScript, CSS"
              description="Use the same words as the job posting."
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
            const entries = field.state.value ?? [];
            return (
              <EntryList
                count={entries.length}
                emptyText="No skills yet."
                addLabel="Add skill"
                entryLabel="skill"
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
                            title={entryTitle([entry?.name], "New skill")}
                            entry={entry}
                            entryLabel="skill"
                            onRemove={remove}
                          />
                        )}
                      </form.Subscribe>
                    }
                  >
                    {/* useFieldGroup keeps its first path, so remount when the entry moves. */}
                    <SkillFields
                      key={index}
                      form={form}
                      fields={`skills[${index}]`}
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
