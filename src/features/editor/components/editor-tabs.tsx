import type { ReactNode } from "react";

import {
  DEFAULT_EDITOR_TAB,
  EDITOR_TAB_LABELS,
  EDITOR_TABS,
  type EditorTab,
} from "#/features/editor/constants";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "#/shared/components/ui/tabs";

export function EditorTabs({
  panels,
}: {
  panels: Record<EditorTab, ReactNode>;
}) {
  return (
    <Tabs defaultValue={DEFAULT_EDITOR_TAB} className="h-full gap-0">
      <div className="border-b bg-background p-2">
        <TabsList className="w-full">
          {EDITOR_TABS.map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              {EDITOR_TAB_LABELS[tab]}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {/* Hidden instead of unmounted, so the form keeps its scroll position,
          open sections and field state. */}
      {EDITOR_TABS.map((tab) => (
        <TabsContent key={tab} value={tab} keepMounted className="min-h-0">
          {panels[tab]}
        </TabsContent>
      ))}
    </Tabs>
  );
}
