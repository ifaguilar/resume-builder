import { GripVerticalIcon } from "lucide-react";
import { Separator } from "react-resizable-panels";

export function PanelDivider() {
  return (
    <Separator className="group/divider relative flex w-1.5 items-center justify-center bg-border transition-colors outline-none data-[separator=active]:bg-primary/60 data-[separator=focus]:bg-primary/60 data-[separator=hover]:bg-primary/30">
      <div className="z-10 flex h-10 w-4 shrink-0 items-center justify-center rounded-full border border-foreground/20 bg-background text-muted-foreground shadow-sm transition-colors group-data-[separator=active]/divider:border-primary group-data-[separator=active]/divider:text-primary group-data-[separator=focus]/divider:border-primary group-data-[separator=focus]/divider:text-primary group-data-[separator=hover]/divider:border-primary group-data-[separator=hover]/divider:text-primary">
        <GripVerticalIcon className="size-3" />
      </div>
    </Separator>
  );
}
