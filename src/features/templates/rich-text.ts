// A piece of drawn text with one look: bold, a link target, or neither.
export type TextRun = { text: string; bold?: true; href?: string };

export type RichText = TextRun[];

export function plainText(text: string): RichText {
  return text ? [{ text }] : [];
}

export function richTextString(runs: RichText): string {
  return runs.map((run) => run.text).join("");
}
