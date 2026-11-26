import { describe, expect, it } from "vitest";

import {
  findDetachedBullets,
  findMissingWords,
  findSplitWords,
} from "#/features/ats/ats-checks";
import { toWords } from "#/features/ats/extract-text";

const EXPECTED = toWords("Architected a team platform at Autónoma");

describe("findMissingWords", () => {
  it("accepts the words in order with extra words between them", () => {
    const extracted = toWords(
      "• Architected a new team platform • at Autónoma",
    );
    expect(findMissingWords(EXPECTED, extracted)).toEqual([]);
  });

  it("reports a split word", () => {
    const extracted = toWords("A rchitected a team platform at Autónoma");
    expect(findMissingWords(EXPECTED, extracted)).toEqual([
      {
        kind: "missing",
        word: "Architected",
        context: "A rchitected a team platform at",
      },
    ]);
  });

  it("reports a lost accent", () => {
    const extracted = toWords("Architected a team platform at Autonoma");
    expect(findMissingWords(EXPECTED, extracted)).toEqual([
      { kind: "missing", word: "Autónoma", context: "Autonoma" },
    ]);
  });

  it("reports words out of order", () => {
    const extracted = toWords("Architected a platform team at Autónoma");
    expect(findMissingWords(EXPECTED, extracted)).toMatchObject([
      { kind: "missing", word: "platform" },
    ]);
  });
});

describe("findSplitWords", () => {
  it("names the word read as fragments", () => {
    const extracted = toWords("A rchitected a team platform at Autó noma");
    expect(findSplitWords(EXPECTED, extracted)).toEqual([
      { kind: "split", word: "Architected", context: "A rchitected" },
      { kind: "split", word: "Autónoma", context: "Autó noma" },
    ]);
  });

  it("never flags real one-letter words", () => {
    expect(findSplitWords(EXPECTED, EXPECTED)).toEqual([]);
    expect(
      findSplitWords(toWords("I led a team"), toWords("I led a team")),
    ).toEqual([]);
  });
});

describe("findDetachedBullets", () => {
  it("reports a marker left on a line of its own", () => {
    const pages = [
      { lines: ["EXPERIENCE", "• Led the team"] },
      { lines: ["•", "Shipped the product"] },
    ];
    expect(findDetachedBullets(pages)).toEqual([
      { kind: "detached-bullet", page: 2, context: "•" },
    ]);
  });
});
