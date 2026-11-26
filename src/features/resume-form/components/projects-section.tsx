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
import type { Project } from "#/features/resume/resume-schema";
import { m } from "#/paraglide/messages.js";

const EMPTY_PROJECT: Project = {};

const ProjectFields = withFieldGroup({
  defaultValues: EMPTY_PROJECT,
  render: function ProjectFields({ group }) {
    return (
      <>
        <group.AppField name="name">
          {(field) => (
            <field.TextField
              label={m.form_project_name_label()}
              placeholder={m.form_project_name_placeholder()}
            />
          )}
        </group.AppField>
        <group.AppField name="description">
          {(field) => (
            <field.TextareaField
              label={m.form_project_description_label()}
              placeholder={m.form_project_description_placeholder()}
              description={m.form_project_description_tip()}
            />
          )}
        </group.AppField>
        <group.AppField name="url">
          {(field) => (
            <field.TextField
              label={m.form_project_url_label()}
              type="url"
              placeholder={m.form_project_url_placeholder()}
            />
          )}
        </group.AppField>
        <group.AppField name="highlights">
          {(field) => (
            <field.HighlightsField
              label={m.form_achievements_label()}
              addLabel={m.form_add_bullet()}
              placeholder={m.form_project_achievements_placeholder()}
              description={m.form_project_achievements_tip()}
            />
          )}
        </group.AppField>
        <group.AppField name="keywords">
          {(field) => (
            <field.KeywordsField
              label={m.form_technologies_label()}
              placeholder={m.form_technologies_placeholder()}
            />
          )}
        </group.AppField>
      </>
    );
  },
});

export const ProjectsSection = withForm({
  ...resumeFormOptions,
  render: function ProjectsSection({ form }) {
    return (
      <div className="flex flex-col gap-6">
        <SectionWarnings store={form.store} section="projects" />
        <form.Field name="projects" mode="array">
          {(field) => {
            const entries = field.state.value ?? [];
            return (
              <EntryList
                count={entries.length}
                messages={ENTRY_MESSAGES.project}
                onAdd={() => field.pushValue({})}
                onRemove={(index) => field.removeValue(index)}
                onMove={(from, to) => field.moveValue(from, to)}
              >
                {({ index, remove }) => (
                  <EntryCard
                    header={
                      <form.Subscribe
                        selector={(state) => state.values.projects?.[index]}
                      >
                        {(entry) => (
                          <EntryHeader
                            title={entryTitle(
                              [entry?.name],
                              ENTRY_MESSAGES.project.untitled(),
                            )}
                            entry={entry}
                            messages={ENTRY_MESSAGES.project}
                            onRemove={remove}
                          />
                        )}
                      </form.Subscribe>
                    }
                  >
                    {/* useFieldGroup keeps its first path, so remount when the entry moves. */}
                    <ProjectFields
                      key={index}
                      form={form}
                      fields={`projects[${index}]`}
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
