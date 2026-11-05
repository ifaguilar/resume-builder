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
import type { Project } from "#/features/resume/resume-schema";

const EMPTY_PROJECT: Project = {};

const ProjectFields = withFieldGroup({
  defaultValues: EMPTY_PROJECT,
  render: function ProjectFields({ group }) {
    return (
      <>
        <group.AppField name="name">
          {(field) => (
            <field.TextField label="Name" placeholder="e.g. Budget tracker" />
          )}
        </group.AppField>
        <group.AppField name="description">
          {(field) => (
            <field.TextareaField
              label="Description"
              placeholder="e.g. A web app that helps students track monthly spending."
              description="One sentence: what it is and who it's for."
            />
          )}
        </group.AppField>
        <group.AppField name="url">
          {(field) => (
            <field.TextField
              label="URL"
              type="url"
              placeholder="e.g. https://github.com/ana-torres/project"
            />
          )}
        </group.AppField>
        <group.AppField name="highlights">
          {(field) => (
            <field.HighlightsField
              label="Achievements"
              addLabel="Add bullet"
              placeholder="e.g. Grew to 2,000 monthly users in six months"
              description="What you built and what it achieved, with numbers when you can."
            />
          )}
        </group.AppField>
        <group.AppField name="keywords">
          {(field) => (
            <field.KeywordsField
              label="Technologies"
              placeholder="e.g. React, Node.js"
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
                emptyText="No projects yet."
                addLabel="Add project"
                entryLabel="project"
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
                            title={entryTitle([entry?.name], "New project")}
                            entry={entry}
                            entryLabel="project"
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
