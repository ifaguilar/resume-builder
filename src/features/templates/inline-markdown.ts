import { Lexer, type MarkedToken, type Token } from "marked";

import {
  ALLOWED_LINK,
  EMPHASIS_MARK,
  HARD_BREAK,
  STRONG_MARK,
  WORD_CHARACTER,
} from "#/features/templates/constants";
import type { RichText, TextRun } from "#/features/templates/rich-text";

type Style = Omit<TextRun, "text">;

// The characters just outside a token, where a mark must not touch a word.
type Edges = { before: string; after: string };

const NO_STYLE: Style = {};
const NO_EDGES: Edges = { before: "", after: "" };
const LEXER_OPTIONS = { gfm: false };

function isToken<T extends MarkedToken["type"]>(
  token: Token,
  type: T,
): token is Extract<MarkedToken, { type: T }> {
  return token.type === type;
}

function push(runs: TextRun[], text: string, style: Style) {
  if (!text) return;
  const last = runs.at(-1);
  if (last && last.bold === style.bold && last.href === style.href) {
    last.text += text;
  } else {
    runs.push({ text, ...style });
  }
}

// A font change inside a word splits it for parsers that read each font run
// as its own word, and underscores mark identifiers far more often than
// emphasis in a CV.
function coversWholeWords(raw: string, mark: string, edges: Edges): boolean {
  return (
    raw.startsWith(mark) &&
    !WORD_CHARACTER.test(edges.before) &&
    !WORD_CHARACTER.test(edges.after)
  );
}

function walk(tokens: Token[], style: Style, edges: Edges, runs: TextRun[]) {
  tokens.forEach((token, index) => {
    const own: Edges = {
      before: tokens[index - 1]?.raw.at(-1) ?? edges.before,
      after: tokens[index + 1]?.raw.at(0) ?? edges.after,
    };
    if (
      isToken(token, "text") ||
      isToken(token, "escape") ||
      isToken(token, "codespan")
    ) {
      push(runs, token.text, style);
    } else if (isToken(token, "br")) {
      push(runs, HARD_BREAK, style);
    } else if (
      isToken(token, "strong") &&
      coversWholeWords(token.raw, STRONG_MARK, own)
    ) {
      walk(token.tokens, { ...style, bold: true }, own, runs);
    } else if (
      isToken(token, "em") &&
      coversWholeWords(token.raw, EMPHASIS_MARK, own)
    ) {
      walk(token.tokens, style, own, runs);
    } else if (isToken(token, "link") && ALLOWED_LINK.test(token.href)) {
      walk(token.tokens, { ...style, href: token.href }, own, runs);
    } else {
      push(runs, token.raw, style);
    }
  });
}

// Inline Markdown as the CV draws it: bold and links keep their look, italics
// and code keep their words, and anything else prints as typed.
export function inlineMarkdown(text: string): RichText {
  const runs: TextRun[] = [];
  walk(Lexer.lexInline(text, LEXER_OPTIONS), NO_STYLE, NO_EDGES, runs);
  return runs;
}
