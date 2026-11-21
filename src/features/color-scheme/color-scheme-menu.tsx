import { type LucideIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { use } from "react";

import { parseColorScheme } from "#/features/color-scheme/color-scheme";
import { ColorSchemeContext } from "#/features/color-scheme/color-scheme-context";
import {
  COLOR_SCHEMES,
  type ColorScheme,
} from "#/features/color-scheme/constants";
import { IconTooltip } from "#/shared/components/icon-tooltip";
import { Button } from "#/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "#/shared/components/ui/dropdown-menu";

const SCHEME_OPTIONS = {
  light: { label: "Light", Icon: SunIcon },
  dark: { label: "Dark", Icon: MoonIcon },
  system: { label: "System", Icon: MonitorIcon },
} satisfies Record<ColorScheme, { label: string; Icon: LucideIcon }>;

export function ColorSchemeMenu() {
  const { scheme, setScheme } = use(ColorSchemeContext);

  return (
    <DropdownMenu>
      <IconTooltip label="Color scheme">
        <DropdownMenuTrigger
          render={<Button variant="outline" size="icon-sm" />}
        >
          <SunIcon className="dark:hidden" />
          <MoonIcon className="hidden dark:block" />
        </DropdownMenuTrigger>
      </IconTooltip>
      <DropdownMenuContent align="end" className="w-auto">
        <DropdownMenuRadioGroup
          value={scheme}
          onValueChange={(value) => setScheme(parseColorScheme(value))}
        >
          {COLOR_SCHEMES.map((option) => {
            const { label, Icon } = SCHEME_OPTIONS[option];
            return (
              <DropdownMenuRadioItem key={option} value={option} closeOnClick>
                <Icon />
                {label}
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
