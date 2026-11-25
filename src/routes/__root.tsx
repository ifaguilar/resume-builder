import { TanStackDevtools } from "@tanstack/react-devtools";
import { FormDevtoolsPanel as TanStackFormDevtoolsPanel } from "@tanstack/react-form-devtools";
import {
  HeadContent,
  ScriptOnce,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import type { ReactNode } from "react";

import { ColorSchemeProvider } from "#/features/color-scheme/color-scheme-provider";
import { colorSchemeScript } from "#/features/color-scheme/color-scheme-script";
import { FONT_REGULAR_URL } from "#/features/templates/fonts/constants";

import styles from "#/styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Resume Builder",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: styles,
      },
      {
        rel: "preload",
        href: FONT_REGULAR_URL,
        as: "font",
        type: "font/ttf",
        crossOrigin: "anonymous",
      },
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: ReactNode }) {
  return (
    // The inline script sets the color scheme on <html> before hydration.
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ScriptOnce>{colorSchemeScript}</ScriptOnce>
        <ColorSchemeProvider>{children}</ColorSchemeProvider>
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
            {
              name: "Tanstack Form",
              render: <TanStackFormDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
