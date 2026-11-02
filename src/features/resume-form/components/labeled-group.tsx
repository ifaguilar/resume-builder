import { cn } from "cn";
import type { ReactNode } from "react";

type LabeledGroupProps = {
  title: string;
  description?: string;
  variant?: "group" | "field";
  className?: string;
  children: ReactNode;
};

// A legend isn't a flex item of its fieldset, so the space below it is a
// margin, not a gap.
export function LabeledGroup({
  title,
  description,
  variant = "group",
  className,
  children,
}: LabeledGroupProps) {
  const isGroup = variant === "group";

  return (
    <fieldset className={className}>
      <legend
        className={cn("flex w-full flex-col gap-1", isGroup ? "mb-4" : "mb-2")}
      >
        <span
          className={cn("text-sm", isGroup ? "font-semibold" : "font-medium")}
        >
          {title}
        </span>
        {description ? (
          <span className="text-sm text-muted-foreground">{description}</span>
        ) : null}
      </legend>
      {children}
    </fieldset>
  );
}
