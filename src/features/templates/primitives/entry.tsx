import { Text, View } from "@react-pdf/renderer";
import type { ReactNode } from "react";

import { PDF_DATE_FEATURES } from "#/features/templates/constants";
import { tw } from "#/features/templates/design-tokens";
import {
  Bullet,
  BulletList,
} from "#/features/templates/primitives/bullet-list";

const NO_HIGHLIGHTS: string[] = [];

function Row({ left, right }: { left: ReactNode; right: ReactNode }) {
  if (!left && !right) return null;
  return (
    <View style={tw("flex-row gap-4")}>
      <View style={tw("flex-1")}>{left}</View>
      {right}
    </View>
  );
}

function Bullets({ items, offset }: { items: string[]; offset: number }) {
  if (items.length === 0) return null;
  return (
    <BulletList>
      {items.map((item, index) => (
        // Bullets have no id, and nothing reorders them during a render.
        // oxlint-disable-next-line react/no-array-index-key
        <Bullet key={offset + index}>{item}</Bullet>
      ))}
    </BulletList>
  );
}

export function Entry({
  title,
  date,
  subtitle,
  aside,
  highlights,
}: {
  title: string;
  date: string;
  subtitle: string;
  aside?: ReactNode;
  highlights?: string[];
}) {
  const [first, ...rest] = highlights ?? NO_HIGHLIGHTS;

  return (
    <View style={tw("gap-1")}>
      {/* The header moves to the next page with its first bullet, so it
          never ends a page alone. */}
      <View wrap={false} style={tw("gap-1")}>
        <View>
          <Row
            left={
              title ? <Text style={tw("font-semibold")}>{title}</Text> : null
            }
            right={
              date ? (
                <Text style={{ fontFeatureSettings: PDF_DATE_FEATURES }}>
                  {date}
                </Text>
              ) : null
            }
          />
          <Row
            left={
              subtitle ? <Text style={tw("text-muted")}>{subtitle}</Text> : null
            }
            right={aside}
          />
        </View>
        <Bullets items={first === undefined ? [] : [first]} offset={0} />
      </View>
      <Bullets items={rest} offset={1} />
    </View>
  );
}
