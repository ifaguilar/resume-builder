import { useStore } from "@tanstack/react-form";

import {
  EntryCard,
  EntryHeader,
} from "#/features/resume-form/components/entry-card";
import { EntryList } from "#/features/resume-form/components/entry-list";
import { LabeledGroup } from "#/features/resume-form/components/labeled-group";
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
import type { Profile } from "#/features/resume/resume-schema";
import {
  isListOrMissing,
  isRecordOrMissing,
} from "#/features/resume/stored-value";
import { m } from "#/paraglide/messages.js";
import { FieldGroup } from "#/shared/components/ui/field";

const EMPTY_PROFILE: Profile = {};

const ProfileFields = withFieldGroup({
  defaultValues: EMPTY_PROFILE,
  render: function ProfileFields({ group }) {
    return (
      <div className="grid grid-cols-1 gap-x-4 gap-y-6 @xl/form:grid-cols-[1fr_2fr]">
        <group.AppField name="network">
          {(field) => (
            <field.TextField
              label={m.form_network_label()}
              placeholder={m.form_network_placeholder()}
            />
          )}
        </group.AppField>
        <group.AppField name="url">
          {(field) => (
            <field.TextField
              label={m.form_profile_url_label()}
              type="url"
              placeholder={m.form_profile_url_placeholder()}
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
    const basics: unknown = useStore(
      form.store,
      (state) => state.values.basics,
    );
    // Typing into a field would replace a `basics` that isn't an object.
    if (!isRecordOrMissing(basics)) {
      return (
        <FieldGroup className="flex flex-col gap-6">
          <SectionWarnings store={form.store} section="basics" />
          <StoredValueCard
            value={basics}
            onClear={() => form.setFieldValue("basics", undefined)}
          />
        </FieldGroup>
      );
    }

    return (
      <FieldGroup className="flex flex-col gap-6">
        <SectionWarnings store={form.store} section="basics" />
        <form.AppField name="basics.name">
          {(field) => (
            <field.TextField
              label={m.form_name_label()}
              placeholder={m.form_name_placeholder()}
              autoComplete="name"
            />
          )}
        </form.AppField>
        <form.AppField name="basics.label">
          {(field) => (
            <field.TextField
              label={m.form_headline_label()}
              placeholder={m.form_headline_placeholder()}
              description={m.form_headline_tip()}
            />
          )}
        </form.AppField>
        <div className="grid grid-cols-1 gap-x-4 gap-y-6 @lg/form:grid-cols-2">
          <form.AppField name="basics.email">
            {(field) => (
              <field.TextField
                label={m.form_email_label()}
                placeholder={m.form_email_placeholder()}
                type="email"
                autoComplete="email"
              />
            )}
          </form.AppField>
          <form.AppField name="basics.phone">
            {(field) => (
              <field.TextField
                label={m.form_phone_label()}
                type="tel"
                placeholder={m.form_phone_placeholder()}
                autoComplete="tel"
              />
            )}
          </form.AppField>
        </div>
        <form.AppField name="basics.url">
          {(field) => (
            <field.TextField
              label={m.form_website_label()}
              type="url"
              placeholder={m.form_website_placeholder()}
              autoComplete="url"
            />
          )}
        </form.AppField>
        <form.AppField name="basics.summary">
          {(field) => (
            <field.TextareaField
              label={m.form_summary_label()}
              placeholder={m.form_summary_placeholder()}
              description={m.form_summary_tip()}
            />
          )}
        </form.AppField>

        {/* The divider is on a wrapper: on a fieldset, the browser draws the
            border through the legend. */}
        <div className="border-t pt-6">
          <LabeledGroup title={m.form_location_title()}>
            <div className="grid grid-cols-1 gap-x-4 gap-y-6 @lg/form:grid-cols-2 @2xl/form:grid-cols-3 @lg/form:[&>:last-child]:col-span-2 @2xl/form:[&>:last-child]:col-span-1">
              <form.AppField name="basics.location.city">
                {(field) => (
                  <field.TextField
                    label={m.form_city_label()}
                    placeholder={m.form_city_placeholder()}
                  />
                )}
              </form.AppField>
              <form.AppField name="basics.location.region">
                {(field) => (
                  <field.TextField
                    label={m.form_region_label()}
                    placeholder={m.form_region_placeholder()}
                  />
                )}
              </form.AppField>
              <form.AppField name="basics.location.countryCode">
                {(field) => (
                  <field.CountryField
                    label={m.form_country_label()}
                    placeholder={m.form_country_placeholder()}
                  />
                )}
              </form.AppField>
            </div>
          </LabeledGroup>
        </div>

        <div className="border-t pt-6">
          <LabeledGroup title={m.form_profiles_title()}>
            <form.Field name="basics.profiles" mode="array">
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
                const profiles = field.state.value ?? [];
                return (
                  <EntryList
                    count={profiles.length}
                    messages={ENTRY_MESSAGES.profile}
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
                                  ENTRY_MESSAGES.profile.untitled(),
                                )}
                                entry={profile}
                                messages={ENTRY_MESSAGES.profile}
                                onRemove={remove}
                              />
                            )}
                          </form.Subscribe>
                        }
                      >
                        {/* useFieldGroup keeps its first path, so remount when the entry moves. */}
                        {isRecordOrMissing(profiles[index]) ? (
                          <ProfileFields
                            key={index}
                            form={form}
                            fields={`basics.profiles[${index}]`}
                          />
                        ) : (
                          <StoredValue value={profiles[index]} />
                        )}
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
