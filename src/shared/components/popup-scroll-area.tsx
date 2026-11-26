import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";
import { cn } from "cn";
import type { ReactNode } from "react";

import { ScrollBar } from "#/shared/components/ui/scroll-area";

// The viewport takes the max height: the shadcn ScrollArea sizes its viewport
// to the root, which never scrolls when the root only has a max height.
export function PopupScrollArea({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <ScrollAreaPrimitive.Root className="relative">
      <ScrollAreaPrimitive.Viewport
        className={cn("overscroll-contain outline-none", className)}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
    </ScrollAreaPrimitive.Root>
  );
}
