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
  StoredValue,
  StoredValueCard,
} from "#/features/resume-form/fields/stored-value-card";
import {
  resumeFormOptions,
  withFieldGroup,
  withForm,
} from "#/features/resume-form/use-resume-form";
import type { Language } from "#/features/resume/resume-schema";
import {
  isListOrMissing,
  isRecordOrMissing,
} from "#/features/resume/stored-value";
import { m } from "#/paraglide/messages.js";

const EMPTY_LANGUAGE: Language = {};

type SuggestionProps = { suggestions: readonly string[]; placeholder: string };
const NO_SUGGESTIONS: SuggestionProps = { suggestions: [], placeholder: "" };

const LanguageFields = withFieldGroup({
  defaultValues: EMPTY_LANGUAGE,
  props: NO_SUGGESTIONS,
  render: function LanguageFields({ group, suggestions, placeholder }) {
    return (
      <div className="grid grid-cols-1 gap-x-4 gap-y-6 @2xl/form:grid-cols-[1fr_2fr]">
        <group.AppField name="language">
          {(field) => (
            <field.TextField
              label={m.form_language_label()}
              placeholder={m.form_language_placeholder()}
            />
          )}
        </group.AppField>
        <group.AppField name="fluency">
          {(field) => (
            <field.AutocompleteField
              label={m.form_fluency_label()}
              placeholder={placeholder}
              suggestions={suggestions}
            />
          )}
        </group.AppField>
      </div>
    );
  },
});

export const LanguagesSection = withForm({
  ...resumeFormOptions,
  render: function LanguagesSection({ form }) {
    // Fluency is printed on the CV, so it's suggested in the CV's language.
    const meta = useStore(form.store, (state) => state.values.meta);
    const words = cvWords(cvLanguage({ meta }));
    return (
      <div className="flex flex-col gap-6">
        <SectionWarnings store={form.store} section="languages" />
        <form.Field name="languages" mode="array">
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
                messages={ENTRY_MESSAGES.language}
                onAdd={() => field.pushValue({})}
                onRemove={(index) => field.removeValue(index)}
                onMove={(from, to) => field.moveValue(from, to)}
              >
                {({ index, remove }) => (
                  <EntryCard
                    header={
                      <form.Subscribe
                        selector={(state) => state.values.languages?.[index]}
                      >
                        {(entry) => (
                          <EntryHeader
                            title={entryTitle(
                              [entry?.language],
                              ENTRY_MESSAGES.language.untitled(),
                            )}
                            entry={entry}
                            messages={ENTRY_MESSAGES.language}
                            onRemove={remove}
                          />
                        )}
                      </form.Subscribe>
                    }
                  >
                    {/* useFieldGroup keeps its first path, so remount when the entry moves. */}
                    {isRecordOrMissing(entries[index]) ? (
                      <LanguageFields
                        key={index}
                        form={form}
                        fields={`languages[${index}]`}
                        suggestions={words.fluencySuggestions}
                        placeholder={m.form_example({
                          text: words.fluencyExample,
                        })}
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
