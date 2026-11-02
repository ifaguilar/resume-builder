import { cn } from "cn";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { type KeyboardEvent, useEffect, useId, useRef, useState } from "react";

import {
  MAX_PICKER_YEAR,
  MIN_PICKER_YEAR,
  MONTHS_PER_YEAR,
} from "#/features/resume-form/constants";
import {
  formatDisplayDate,
  formatLongMonthYear,
  formatShortMonth,
  initialFocusMonth,
  moveMonth,
  parsePartialDate,
  toMonthValue,
} from "#/features/resume-form/fields/date-picker-utils";
import { FieldWarnings } from "#/features/resume-form/fields/field-warnings";
import { useVisibleWarnings } from "#/features/resume-form/fields/use-visible-warnings";
import { useFieldContext } from "#/features/resume-form/form-context";
import { IconTooltip } from "#/shared/components/icon-tooltip";
import { Button } from "#/shared/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "#/shared/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "#/shared/components/ui/popover";
import { Separator } from "#/shared/components/ui/separator";

const MONTHS = Array.from({ length: MONTHS_PER_YEAR }, (_, index) => index + 1);

type DateFieldProps = {
  label: string;
  // An empty "end" date means "Present" in JSON Resume.
  kind: "start" | "end" | "single";
  description?: string;
};

function currentYear(): number {
  return new Date().getFullYear();
}

export function DateField({ label, kind, description }: DateFieldProps) {
  const field = useFieldContext<string | undefined>();
  const { warnings, isInvalid, focusProps } = useVisibleWarnings(field);
  const id = useId();
  const [isOpen, setIsOpen] = useState(false);
  const value = field.state.value;
  const date = parsePartialDate(value);
  const [shownYear, setShownYear] = useState(() => date?.year ?? currentYear());

  // Set when the picker opens: reading the clock during render isn't pure,
  // and year navigation shouldn't move the focus.
  const [activeMonth, setActiveMonth] = useState(1);
  const [today, setToday] = useState<{ year: number; month: number }>();
  const monthButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const focusActiveMonth = useRef(false);

  useEffect(() => {
    if (!focusActiveMonth.current) return;
    focusActiveMonth.current = false;
    monthButtons.current[activeMonth - 1]?.focus();
  });

  const isEnd = kind === "end";

  function handleOpenChange(open: boolean) {
    if (open) {
      const now = new Date();
      const current = parsePartialDate(field.state.value);
      const year = current?.year ?? now.getFullYear();
      setShownYear(year);
      setActiveMonth(initialFocusMonth(current, year, now));
      setToday({ year: now.getFullYear(), month: now.getMonth() + 1 });
    }
    setIsOpen(open);
  }

  function handleMonthKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const next = moveMonth(shownYear, activeMonth, event.key);
    if (!next) return;
    event.preventDefault();
    setShownYear(next.year);
    setActiveMonth(next.month);
    focusActiveMonth.current = true;
  }

  function select(next: string | undefined) {
    field.handleChange(next);
    setIsOpen(false);
  }

  return (
    <Field
      data-invalid={isInvalid || undefined}
      className="gap-1.5 data-[invalid=true]:text-warning"
    >
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger
          render={
            <Button
              id={id}
              variant="outline"
              className="justify-between border-foreground/15 bg-background font-normal shadow-xs hover:bg-background aria-invalid:border-warning aria-invalid:ring-warning/20 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-warning/50 dark:aria-invalid:ring-warning/40"
              aria-invalid={isInvalid || undefined}
              {...focusProps}
            />
          }
        >
          <span className={value ? undefined : "text-muted-foreground"}>
            {value
              ? formatDisplayDate(value)
              : isEnd
                ? "Present"
                : "Pick a date"}
          </span>
          <CalendarIcon className="text-muted-foreground" />
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-72 gap-0 p-0"
          initialFocus={() => monthButtons.current[activeMonth - 1] ?? true}
        >
          <div className="flex items-center justify-between p-2">
            <IconTooltip label="Previous year">
              <Button
                variant="ghost"
                size="icon-sm"
                disabled={shownYear <= MIN_PICKER_YEAR}
                onClick={() => setShownYear((year) => year - 1)}
              >
                <ChevronLeftIcon />
              </Button>
            </IconTooltip>
            <span className="font-semibold tabular-nums" aria-live="polite">
              {shownYear}
            </span>
            <IconTooltip label="Next year">
              <Button
                variant="ghost"
                size="icon-sm"
                disabled={shownYear >= MAX_PICKER_YEAR}
                onClick={() => setShownYear((year) => year + 1)}
              >
                <ChevronRightIcon />
              </Button>
            </IconTooltip>
          </div>
          <Separator />
          <div className="grid grid-cols-3 gap-1 p-2">
            {MONTHS.map((month) => {
              const isSelected =
                date?.year === shownYear && date.month === month;
              const isThisMonth =
                today?.year === shownYear && today.month === month;
              return (
                <Button
                  key={month}
                  ref={(element) => {
                    monthButtons.current[month - 1] = element;
                  }}
                  tabIndex={month === activeMonth ? 0 : -1}
                  onFocus={() => setActiveMonth(month)}
                  onKeyDown={handleMonthKeyDown}
                  variant={isSelected ? "default" : "ghost"}
                  className={cn(
                    isThisMonth && !isSelected && "font-semibold text-primary",
                  )}
                  aria-label={formatLongMonthYear(shownYear, month)}
                  aria-pressed={isSelected}
                  onClick={() => select(toMonthValue(shownYear, month))}
                >
                  {formatShortMonth(shownYear, month)}
                </Button>
              );
            })}
          </div>
          <Separator />
          <div className="flex items-center justify-between p-2">
            <Button variant="ghost" size="sm" onClick={() => select(undefined)}>
              {isEnd ? "Present" : "Clear"}
            </Button>
            {today ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => select(toMonthValue(today.year, today.month))}
              >
                This month
              </Button>
            ) : null}
          </div>
        </PopoverContent>
      </Popover>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      <FieldWarnings warnings={warnings} />
    </Field>
  );
}
