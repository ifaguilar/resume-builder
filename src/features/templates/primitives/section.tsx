import { Text, View } from "@react-pdf/renderer";
import type { ReactNode } from "react";

import { KEEP_WITH_NEXT_PT, tw } from "#/features/templates/design-tokens";

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
