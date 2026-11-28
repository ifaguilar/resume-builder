import { Text, View } from "@react-pdf/renderer";
import type { ReactNode } from "react";

import { BULLET } from "#/features/templates/constants";
import { useTw } from "#/features/templates/template-theme";

export function BulletList({ children }: { children: ReactNode }) {
  const tw = useTw();
  return <View style={tw("gap-1 pl-2.5")}>{children}</View>;
}

// A real bullet character, so parsers see a list item instead of a shape.
// The row never splits across pages: the marker and its text broke apart.
export function Bullet({ children }: { children: ReactNode }) {
  const tw = useTw();
  return (
    <View style={tw("flex-row")} wrap={false}>
      <Text style={tw("w-4")}>{BULLET}</Text>
      <Text style={tw("flex-1")}>{children}</Text>
    </View>
  );
}
