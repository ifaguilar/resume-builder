import { Text, View } from "@react-pdf/renderer";
import type { ReactNode } from "react";

import { KEEP_WITH_NEXT_PT } from "#/features/templates/design-tokens";
import { useTw } from "#/features/templates/template-theme";

export function Section({
  title,
  topMargin,
  children,
}: {
  title: string;
  // A Tailwind margin class, such as "mt-5".
  topMargin: string;
  children: ReactNode;
}) {
  const tw = useTw();
  return (
    <View style={tw(topMargin)}>
      <Text
        minPresenceAhead={KEEP_WITH_NEXT_PT}
        style={tw(
          "mb-1.5 text-sm leading-normal font-bold text-accent uppercase",
        )}
      >
        {title}
      </Text>
      {children}
    </View>
  );
}
