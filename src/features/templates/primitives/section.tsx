import { Text, View } from "@react-pdf/renderer";
import type { ReactNode } from "react";

import { KEEP_WITH_NEXT_PT, tw } from "#/features/templates/design-tokens";

export function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <View style={tw("mt-5")}>
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
