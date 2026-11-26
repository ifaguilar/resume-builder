import {
  CONTEXT_WORDS,
  MAX_SPLIT_FRAGMENTS,
  MIN_SPLIT_FRAGMENTS,
  WORD_SEPARATOR,
} from "#/features/ats/constants";
import type { ExtractedPage } from "#/features/ats/extract-text";
import { BULLET } from "#/features/templates/constants";

export type AtsFinding =
  | { kind: "missing"; word: string; context: string }
  | { kind: "split"; word: string; context: string }
  | { kind: "detached-bullet"; page: number; context: string };

const FIRST_PAGE = 1;

function contextAt(words: string[], index: number): string {
  return words.slice(index, index + CONTEXT_WORDS).join(WORD_SEPARATOR);
}

// Expected words must appear whole and in order. Extra extracted words are
// allowed, so this catches split, garbled, missing and reordered words.
export function findMissingWords(
  expected: string[],
  extracted: string[],
): AtsFinding[] {
  const findings: AtsFinding[] = [];
  let next = 0;
  for (const word of expected) {
    const found = extracted.indexOf(word, next);
    if (found === -1) {
      findings.push({
        kind: "missing",
        word,
        context: contextAt(extracted, next),
      });
    } else {
      next = found + 1;
    }
  }
  return findings;
}

// An expected word read as adjacent fragments ("A" + "rchitected"). Comparing
// with the resume's own words, instead of a pattern, never flags "A team".
export function findSplitWords(
  expected: string[],
  extracted: string[],
): AtsFinding[] {
  const words = new Set(expected);
  const findings: AtsFinding[] = [];
  for (let start = 0; start < extracted.length; start++) {
    let joined = extracted[start] ?? "";
    for (
      let count = MIN_SPLIT_FRAGMENTS;
      count <= MAX_SPLIT_FRAGMENTS && start + count <= extracted.length;
      count++
    ) {
      joined += extracted[start + count - 1] ?? "";
      if (words.has(joined)) {
        findings.push({
          kind: "split",
          word: joined,
          context: extracted.slice(start, start + count).join(WORD_SEPARATOR),
        });
        break;
      }
    }
  }
  return findings;
}

// A bullet marker on a line of its own lost its text, which used to happen at
// page breaks.
export function findDetachedBullets(pages: ExtractedPage[]): AtsFinding[] {
  return pages.flatMap((page, index) =>
    page.lines
      .filter((line) => line === BULLET)
      .map((line) => ({
        kind: "detached-bullet" as const,
        page: index + FIRST_PAGE,
        context: line,
      })),
  );
}
