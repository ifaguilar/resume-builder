import { LabeledGroup } from "#/features/resume-form/components/labeled-group";
import { FieldWarnings } from "#/features/resume-form/fields/field-warnings";
import type { FieldWarning } from "#/features/resume-form/resume-warnings-validator";
import { m } from "#/paraglide/messages.js";
import { Button } from "#/shared/components/ui/button";

// An imported value the form can't edit (a list that isn't a list, an entry
// that isn't an object), shown as stored until the user converts or clears it.
export function StoredValue({ value }: { value: unknown }) {
  return (
    <p className="line-clamp-3 font-mono text-xs break-words whitespace-pre-line text-muted-foreground">
      {typeof value === "string" ? value : JSON.stringify(value)}
    </p>
  );
}

const NO_WARNINGS: FieldWarning[] = [];

type StoredValueCardProps = {
  // A whole section needs none: its heading names it.
  label?: string;
  value: unknown;
  warnings?: FieldWarning[];
  onConvert?: () => void;
  onClear: () => void;
};

export function StoredValueCard({
  label,
  value,
  warnings = NO_WARNINGS,
  onConvert,
  onClear,
}: StoredValueCardProps) {
  const content = (
    <>
      <StoredValue value={value} />
      <div className="flex flex-wrap gap-2">
        {onConvert ? (
          <Button variant="outline" size="sm" onClick={onConvert}>
            {m.form_stored_value_convert()}
          </Button>
        ) : null}
        <Button variant="outline" size="sm" onClick={onClear}>
          {m.form_stored_value_clear()}
        </Button>
      </div>
      <FieldWarnings warnings={warnings} />
    </>
  );

  return label === undefined ? (
    <div className="flex flex-col gap-1.5">{content}</div>
  ) : (
    <LabeledGroup
      variant="field"
      title={label}
      className="flex flex-col gap-1.5"
    >
      {content}
    </LabeledGroup>
  );
}
