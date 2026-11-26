export const WHITESPACE = /\s+/;
export const WORD_SEPARATOR = " ";
export const LINE_BREAK = "\n";
// Pages are joined with a form feed, the character text extractors such as
// pdftotext put between pages.
export const PAGE_BREAK = "\f";

export const MIN_SPLIT_FRAGMENTS = 2;
// A word broken into more pieces than this would be noise, not a split word.
export const MAX_SPLIT_FRAGMENTS = 3;
export const CONTEXT_WORDS = 6;
