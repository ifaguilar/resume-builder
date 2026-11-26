import { Link as PdfLink } from "@react-pdf/renderer";

import { tw } from "#/features/templates/design-tokens";

// The visible text is the address itself, so parsers that ignore link
// annotations still read it.
export function Link({ href, children }: { href: string; children: string }) {
  return (
    <PdfLink src={href} style={tw("text-muted underline")}>
      {children}
    </PdfLink>
  );
}
