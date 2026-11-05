import {
  EntryCard,
  EntryHeader,
} from "#/features/resume-form/components/entry-card";
import { EntryList } from "#/features/resume-form/components/entry-list";
import { LabeledGroup } from "#/features/resume-form/components/labeled-group";
import { SectionWarnings } from "#/features/resume-form/components/section-warnings";
import { entryTitle } from "#/features/resume-form/entry-title";
import {
  resumeFormOptions,
  withFieldGroup,
  withForm,
} from "#/features/resume-form/use-resume-form";
import type { Profile } from "#/features/resume/resume-schema";
import { FieldGroup } from "#/shared/components/ui/field";

const EMPTY_PROFILE: Profile = {};

const ProfileFields = withFieldGroup({
  defaultValues: EMPTY_PROFILE,
  render: function ProfileFields({ group }) {
    return (
      <div className="grid grid-cols-[1fr_2fr] gap-x-4 gap-y-6">
        <group.AppField name="network">
          {(field) => (
            <field.TextField label="Network" placeholder="e.g. LinkedIn" />
          )}
        </group.AppField>
        <group.AppField name="url">
          {(field) => (
            <field.TextField
              label="URL"
              type="url"
              placeholder="e.g. https://linkedin.com/in/ana-torres"
            />
          )}
        </group.AppField>
      </div>
    );
  },
});

export const BasicsSection = withForm({
  ...resumeFormOptions,
  render: function BasicsSection({ form }) {
    return (
      <FieldGroup className="flex flex-col gap-6">
        <SectionWarnings store={form.store} section="basics" />
        <form.AppField name="basics.name">
          {(field) => (
            <field.TextField
              label="Full name"
              placeholder="e.g. Ana Torres"
              autoComplete="name"
            />
          )}
        </form.AppField>
        <form.AppField name="basics.label">
          {(field) => (
            <field.TextField
              label="Headline"
              placeholder="e.g. Frontend Developer"
              description="The role you're targeting, in the words recruiters search for."
            />
          )}
        </form.AppField>
        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          <form.AppField name="basics.email">
            {(field) => (
              <field.TextField
                label="Email"
                placeholder="e.g. ana@example.com"
                type="email"
                autoComplete="email"
              />
            )}
          </form.AppField>
          <form.AppField name="basics.phone">
            {(field) => (
              <field.TextField
                label="Phone"
                type="tel"
                placeholder="e.g. +1 512 555 0142"
                autoComplete="tel"
              />
            )}
          </form.AppField>
        </div>
        <form.AppField name="basics.url">
          {(field) => (
            <field.TextField
              label="Website"
              type="url"
              placeholder="e.g. https://example.com"
              autoComplete="url"
            />
          )}
        </form.AppField>
        <form.AppField name="basics.summary">
          {(field) => (
            <field.TextareaField
              label="Summary"
              placeholder="e.g. Frontend developer with 5 years of experience building accessible web apps…"
              description="Two or three sentences: who you are, your strongest result, and what you want next."
            />
          )}
        </form.AppField>

        {/* The divider is on a wrapper: on a fieldset, the browser draws the
            border through the legend. */}
        <div className="border-t pt-6">
          <LabeledGroup title="Location">
            <div className="grid grid-cols-3 gap-x-4 gap-y-6">
              <form.AppField name="basics.location.city">
                {(field) => (
                  <field.TextField label="City" placeholder="e.g. Austin" />
                )}
              </form.AppField>
              <form.AppField name="basics.location.region">
                {(field) => (
                  <field.TextField label="Region" placeholder="e.g. TX" />
                )}
              </form.AppField>
              <form.AppField name="basics.location.countryCode">
                {(field) => (
                  <field.CountryField
                    label="Country"
                    placeholder="e.g. United States"
                  />
                )}
              </form.AppField>
            </div>
          </LabeledGroup>
        </div>

        <div className="border-t pt-6">
          <LabeledGroup title="Online profiles">
            <form.Field name="basics.profiles" mode="array">
              {(field) => {
                const profiles = field.state.value ?? [];
                return (
                  <EntryList
                    count={profiles.length}
                    emptyText="No profiles yet."
                    addLabel="Add profile"
                    entryLabel="profile"
                    onAdd={() => field.pushValue({})}
                    onRemove={(index) => field.removeValue(index)}
                    onMove={(from, to) => field.moveValue(from, to)}
                  >
                    {({ index, remove }) => (
                      <EntryCard
                        header={
                          <form.Subscribe
                            selector={(state) =>
                              state.values.basics?.profiles?.[index]
                            }
                          >
                            {(profile) => (
                              <EntryHeader
                                title={entryTitle(
                                  [profile?.network],
                                  "New profile",
                                )}
                                entry={profile}
                                entryLabel="profile"
                                onRemove={remove}
                              />
                            )}
                          </form.Subscribe>
                        }
                      >
                        {/* useFieldGroup keeps its first path, so remount when the entry moves. */}
                        <ProfileFields
                          key={index}
                          form={form}
                          fields={`basics.profiles[${index}]`}
                        />
                      </EntryCard>
                    )}
                  </EntryList>
                );
              }}
            </form.Field>
          </LabeledGroup>
        </div>
      </FieldGroup>
    );
  },
});
