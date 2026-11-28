import { Link as PdfLink, Text } from "@react-pdf/renderer";
import { cn } from "cn";
import { Fragment } from "react";

import { withContentKeys } from "#/features/templates/content-keys";
import type { RichText } from "#/features/templates/rich-text";
import { useTw } from "#/features/templates/template-theme";

// Runs drawn inside the caller's <Text>. react-pdf draws a link blue unless
// the link sets its own color, so links take the surrounding text's color.
export function FormattedText({
  text,
  muted = false,
}: {
  text: RichText;
  muted?: boolean;
}) {
  const tw = useTw();
  return withContentKeys(text).map(({ key, item: run }) => {
    const weight = run.bold ? "font-semibold" : "";
    if (run.href) {
      return (
        <PdfLink
          key={key}
          src={run.href}
          style={tw(
            cn("underline", weight, muted ? "text-muted" : "text-foreground"),
          )}
        >
          {run.text}
        </PdfLink>
      );
    }
    return run.bold ? (
      <Text key={key} style={tw(weight)}>
        {run.text}
      </Text>
    ) : (
      <Fragment key={key}>{run.text}</Fragment>
    );
  });
}
