import { getRouteApi } from "@tanstack/react-router";
import * as motion from "motion/react-m";
import type { ReactNode } from "react";

import {
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
import { fadeTransition } from "#/shared/lib/motion-transitions";

const editorRoute = getRouteApi("/");

export function EditorTabs({
  panels,
}: {
  panels: Record<EditorTab, ReactNode>;
}) {
  const { tab: activeTab } = editorRoute.useSearch();
  const navigate = editorRoute.useNavigate();

  return (
    <Tabs
      value={activeTab}
      onValueChange={(tab: EditorTab) =>
        void navigate({ search: { tab }, replace: true })
      }
      className="h-full gap-0"
    >
      <div className="border-b bg-background p-2">
        <TabsList className="w-full">
          {EDITOR_TABS.map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              {EDITOR_TAB_LABELS[tab]()}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {/* Hidden instead of unmounted, so the form keeps its scroll position,
          open sections and field state. */}
      {EDITOR_TABS.map((tab) => (
        <TabsContent key={tab} value={tab} keepMounted className="min-h-0">
          {/* Hidden panels stay at opacity 0, so the one shown next fades in. */}
          <motion.div
            className="h-full"
            initial={false}
            animate={{ opacity: tab === activeTab ? 1 : 0 }}
            transition={fadeTransition}
          >
            {panels[tab]}
          </motion.div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
