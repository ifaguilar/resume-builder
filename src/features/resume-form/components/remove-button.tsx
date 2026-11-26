import { cn } from "cn";
import type { ComponentProps } from "react";

import { Button } from "#/shared/components/ui/button";

export function RemoveButton({
  className,
  ...props
}: ComponentProps<typeof Button>) {
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className={cn(
        "text-muted-foreground hover:bg-destructive/10 hover:text-destructive focus-visible:text-destructive",
        className,
      )}
      {...props}
    />
  );
}
