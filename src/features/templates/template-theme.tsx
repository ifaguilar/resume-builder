import { createContext, type ReactNode, use, useMemo } from "react";

import type { Settings } from "#/features/resume/settings-schema";
import {
  createTemplateTw,
  DEFAULT_TEMPLATE_TW,
  type TemplateTw,
} from "#/features/templates/design-tokens";

const TemplateTwContext = createContext<TemplateTw>(DEFAULT_TEMPLATE_TW);

export function TemplateTheme({
  settings,
  children,
}: {
  settings: Settings;
  children: ReactNode;
}) {
  const tw = useMemo(
    () => createTemplateTw(settings.accentColor),
    [settings.accentColor],
  );
  return <TemplateTwContext value={tw}>{children}</TemplateTwContext>;
}

export function useTw(): TemplateTw {
  return use(TemplateTwContext);
}
