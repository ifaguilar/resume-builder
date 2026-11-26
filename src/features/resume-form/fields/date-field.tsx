import { cn } from "cn";
import {
  CalendarIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { PresenceContext } from "motion/react";
import * as motion from "motion/react-m";
import {
  type ComponentProps,
  type KeyboardEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import {
  MAX_PICKER_YEAR,
  MIN_PICKER_YEAR,
  MONTHS_PER_YEAR,
  YEAR_RANGE_SEPARATOR,
  YEARS_PER_PAGE,
} from "#/features/resume-form/constants";
import {
  formatDisplayDate,
  formatLongMonthYear,
  formatShortMonth,
  initialFocusMonth,
  moveMonth,
  moveYear,
  toMonthValue,
  yearPageStart,
} from "#/features/resume-form/fields/date-picker-utils";
import { FieldWarnings } from "#/features/resume-form/fields/field-warnings";
import { useVisibleWarnings } from "#/features/resume-form/fields/use-visible-warnings";
import { useFieldContext } from "#/features/resume-form/form-context";
import { DATE_RANGE_YEARS } from "#/features/resume/constants";
import { parsePartialDate } from "#/features/resume/partial-date";
import { textValue } from "#/features/resume/stored-value";
import { m } from "#/paraglide/messages.js";
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
import { viewEnter } from "#/shared/lib/motion-transitions";

const MONTHS = Array.from({ length: MONTHS_PER_YEAR }, (_, index) => index + 1);

type View = "months" | "years";

type DateFieldProps = {
  label: string;
  // An empty "end" date means "Present" in JSON Resume.
  kind: "start" | "end" | "single";
  description?: string;
  allowFuture?: boolean;
};

function currentYear(): number {
  return Temporal.Now.plainDateISO().year;
}

export function DateField({
  label,
  kind,
  description,
  allowFuture = false,
}: DateFieldProps) {
  const field = useFieldContext<string | undefined>();
  const { warnings, isInvalid, focusProps } = useVisibleWarnings(field, {
    hideWhileFocused: false,
  });
  const id = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<View>("months");
  const [viewSwitched, setViewSwitched] = useState(false);
  const value = textValue(field.state.value);
  const date = parsePartialDate(value);
  const [shownYear, setShownYear] = useState(() => date?.year ?? currentYear());

  // Set when the picker opens: reading the clock during render isn't pure,
  // and year navigation shouldn't move the focus.
  const [activeMonth, setActiveMonth] = useState(1);
  const [activeYear, setActiveYear] = useState(shownYear);
  const [today, setToday] = useState<Temporal.PlainDate>();
  const monthButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const yearButtons = useRef(new Map<number, HTMLButtonElement | null>());
  const pendingFocus = useRef<View | null>(null);

  useEffect(() => {
    const target = pendingFocus.current;
    if (!target) return;
    pendingFocus.current = null;
    if (target === "months") monthButtons.current[activeMonth - 1]?.focus();
    else yearButtons.current.get(activeYear)?.focus();
  });

  const isEnd = kind === "end";
  // The stored year stays reachable even outside the range, so an imported
  // date still opens on its own month.
  const minYear = today
    ? Math.min(today.year - DATE_RANGE_YEARS, date?.year ?? today.year)
    : MIN_PICKER_YEAR;
  const maxYear = today
    ? Math.max(
        allowFuture ? today.year + DATE_RANGE_YEARS : today.year,
        date?.year ?? today.year,
      )
    : MAX_PICKER_YEAR;
  const anchorYear = today?.year ?? shownYear;
  const pageStart = yearPageStart(activeYear, anchorYear);
  const pageEnd = pageStart + YEARS_PER_PAGE - 1;
  const pageYears = Array.from(
    { length: YEARS_PER_PAGE },
    (_, index) => pageStart + index,
  );

  function isFutureMonth(month: number): boolean {
    if (allowFuture || !today) return false;
    return (
      shownYear > today.year ||
      (shownYear === today.year && month > today.month)
    );
  }

  function handleOpenChange(open: boolean) {
    if (open) {
      const now = Temporal.Now.plainDateISO();
      const current = parsePartialDate(field.state.value);
      const year = current?.year ?? now.year;
      setShownYear(year);
      setActiveMonth(initialFocusMonth(current, year, now));
      setToday(now);
      setView("months");
      setViewSwitched(false);
    }
    setIsOpen(open);
  }

  function handleMonthKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const next = moveMonth(shownYear, activeMonth, event.key, {
      minYear,
      maxYear,
    });
    if (!next) return;
    event.preventDefault();
    setShownYear(next.year);
    setActiveMonth(next.month);
    pendingFocus.current = "months";
  }

  function handleYearKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const next = moveYear(activeYear, event.key, {
      anchorYear,
      minYear,
      maxYear,
    });
    if (next === undefined) return;
    event.preventDefault();
    setActiveYear(next);
    pendingFocus.current = "years";
  }

  function showYears() {
    setActiveYear(shownYear);
    setView("years");
    setViewSwitched(true);
    pendingFocus.current = "years";
  }

  function showMonths(year: number) {
    setShownYear(year);
    if (today) setActiveMonth(initialFocusMonth(date, year, today));
    setView("months");
    setViewSwitched(true);
    pendingFocus.current = "months";
  }

  function turnYearPage(direction: -1 | 1) {
    setActiveYear((year) =>
      Math.min(Math.max(year + direction * YEARS_PER_PAGE, minYear), maxYear),
    );
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
              className="justify-between border-foreground/15 bg-background font-normal tabular-nums shadow-xs hover:bg-background aria-invalid:border-warning aria-invalid:ring-warning/20 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-warning/50 dark:aria-invalid:ring-warning/40"
              aria-invalid={isInvalid || undefined}
              {...focusProps}
            />
          }
        >
          <span className={value ? undefined : "text-muted-foreground"}>
            {value
              ? formatDisplayDate(value)
              : isEnd
                ? m.form_date_present()
                : m.form_date_pick()}
          </span>
          <CalendarIcon className="text-muted-foreground" />
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-72 gap-0 p-0"
          initialFocus={() => monthButtons.current[activeMonth - 1] ?? true}
        >
          {view === "months" ? (
            <div className="flex items-center justify-between p-2">
              <IconTooltip label={m.form_date_previous_year()}>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={shownYear <= minYear}
                  onClick={() => setShownYear((year) => year - 1)}
                >
                  <ChevronLeftIcon />
                </Button>
              </IconTooltip>
              <Button
                variant="ghost"
                size="sm"
                className="font-semibold tabular-nums"
                aria-label={m.form_date_choose_year({ year: shownYear })}
                onClick={showYears}
              >
                <span aria-live="polite">{shownYear}</span>
                <ChevronDownIcon className="text-muted-foreground" />
              </Button>
              <IconTooltip label={m.form_date_next_year()}>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={shownYear >= maxYear}
                  onClick={() => setShownYear((year) => year + 1)}
                >
                  <ChevronRightIcon />
                </Button>
              </IconTooltip>
            </div>
          ) : (
            <div className="flex items-center justify-between p-2">
              <IconTooltip label={m.form_date_previous_years()}>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={pageStart <= minYear}
                  onClick={() => turnYearPage(-1)}
                >
                  <ChevronLeftIcon />
                </Button>
              </IconTooltip>
              <Button
                variant="ghost"
                size="sm"
                className="font-semibold tabular-nums"
                aria-label={m.form_date_back_to_months()}
                onClick={() => showMonths(shownYear)}
              >
                <span aria-live="polite">
                  {pageStart}
                  {YEAR_RANGE_SEPARATOR}
                  {pageEnd}
                </span>
              </Button>
              <IconTooltip label={m.form_date_next_years()}>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={pageEnd >= maxYear}
                  onClick={() => turnYearPage(1)}
                >
                  <ChevronRightIcon />
                </Button>
              </IconTooltip>
            </div>
          )}
          <Separator />
          {/* Inside a list row, the list's AnimatePresence initial={false}
              would block this grid's enter animation; null lifts it. */}
          <PresenceContext value={null}>
            {/* A click on a disabled cell or a gap would move focus to the
              popup and leave the arrow keys with no cell to start from. */}
            <motion.div
              key={view}
              {...viewEnter}
              // The popup animates its own opening; only a switch animates here.
              initial={viewSwitched ? viewEnter.initial : false}
              role="presentation"
              className="grid grid-cols-3 gap-1 p-2"
              onMouseDown={(event) => event.preventDefault()}
            >
              {view === "months"
                ? MONTHS.map((month) => {
                    const isSelected =
                      date?.year === shownYear && date.month === month;
                    const isThisMonth =
                      today?.year === shownYear && today.month === month;
                    const isDisabled = isFutureMonth(month) && !isSelected;
                    return (
                      <GridCell
                        key={month}
                        ref={(element) => {
                          monthButtons.current[month - 1] = element;
                        }}
                        tabIndex={month === activeMonth ? 0 : -1}
                        onFocus={() => setActiveMonth(month)}
                        onKeyDown={handleMonthKeyDown}
                        isDisabled={isDisabled}
                        isSelected={isSelected}
                        isCurrent={isThisMonth}
                        aria-label={formatLongMonthYear(shownYear, month)}
                        onClick={() => {
                          if (!isDisabled)
                            select(toMonthValue(shownYear, month));
                        }}
                      >
                        {formatShortMonth(month)}
                      </GridCell>
                    );
                  })
                : pageYears.map((year) => {
                    const isSelected = date?.year === year;
                    const isThisYear = today?.year === year;
                    const isDisabled = year < minYear || year > maxYear;
                    return (
                      <GridCell
                        key={year}
                        ref={(element) => {
                          yearButtons.current.set(year, element);
                        }}
                        tabIndex={year === activeYear ? 0 : -1}
                        onFocus={() => setActiveYear(year)}
                        onKeyDown={handleYearKeyDown}
                        isDisabled={isDisabled}
                        isSelected={isSelected}
                        isCurrent={isThisYear}
                        className="tabular-nums"
                        onClick={() => {
                          if (!isDisabled) showMonths(year);
                        }}
                      >
                        {year}
                      </GridCell>
                    );
                  })}
            </motion.div>
          </PresenceContext>
          <Separator />
          <div className="flex items-center justify-between p-2">
            <Button variant="ghost" size="sm" onClick={() => select(undefined)}>
              {isEnd ? m.form_date_present() : m.form_date_clear()}
            </Button>
            {today ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => select(toMonthValue(today.year, today.month))}
              >
                {m.form_date_this_month()}
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

type GridCellProps = ComponentProps<typeof Button> & {
  isSelected: boolean;
  isCurrent: boolean;
  isDisabled: boolean;
};

function GridCell({
  isSelected,
  isCurrent,
  isDisabled,
  className,
  ...props
}: GridCellProps) {
  return (
    <Button
      // Not Base UI's `disabled`: it skips our onKeyDown on a disabled
      // button, so arrow keys would stop on it.
      aria-disabled={isDisabled || undefined}
      aria-pressed={isSelected}
      variant={isSelected ? "default" : "ghost"}
      // The popup focuses a cell even when opened by a click, where
      // :focus-visible would hide where the arrow keys start.
      className={cn(
        "focus:border-ring focus:ring-[3px] focus:ring-ring/50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
        isCurrent && !isSelected && "font-semibold text-primary",
        className,
      )}
      {...props}
    />
  );
}
