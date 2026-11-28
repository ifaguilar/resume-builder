import { describe, expect, it } from "vitest";

import { inlineMarkdown } from "#/features/templates/inline-markdown";
import { richTextString } from "#/features/templates/rich-text";

describe("inlineMarkdown", () => {
  it("draws bold around whole words", () => {
    expect(inlineMarkdown("**Led** a team")).toEqual([
      { text: "Led", bold: true },
      { text: " a team" },
    ]);
  });

  it.each([
    ["**Led**, then", "Led"],
    ["(**Go**)", "Go"],
    ["Grew **40%**", "40%"],
    ["At **Universidad Autónoma**.", "Universidad Autónoma"],
    ["***both***", "both"],
  ])("draws %j with %j bold", (source, bold) => {
    expect(inlineMarkdown(source)).toContainEqual({ text: bold, bold: true });
  });

  it.each([
    "Arch**itected** it",
    "**Arch**itected",
    "Café**ñ**o",
    "def __init__ and snake_case_name",
    "_italic_ word",
    "5*3*2 = 30",
    "*args and **kwargs",
    "SELECT * FROM t",
    "![logo](https://a.com/x.png)",
    "<b>raw</b> html",
    "# Heading",
    "- item",
    "1. item",
    "| a | b |",
    "AT&amp;T & co",
    "C:\\Users\\path",
    "~~gone~~",
    "https://a.com bare",
  ])("prints %j as typed", (source) => {
    expect(inlineMarkdown(source)).toEqual([{ text: source }]);
  });

  it("shows italics and code without their marks", () => {
    expect(inlineMarkdown("*Note:* run `pnpm **dev**`")).toEqual([
      { text: "Note: run pnpm **dev**" },
    ]);
  });

  it("drops a backslash before a mark", () => {
    expect(inlineMarkdown("\\*star\\* and 50\\%")).toEqual([
      { text: "*star* and 50%" },
    ]);
  });

  it.each([
    "https://a.com/case",
    "http://a.com",
    "mailto:ana@example.com",
    "HTTPS://A.COM",
  ])("links to %j", (href) => {
    expect(inlineMarkdown(`See [the case](${href}).`)).toEqual([
      { text: "See " },
      { text: "the case", href },
      { text: "." },
    ]);
  });

  it("links an autolink with its address as the label", () => {
    expect(inlineMarkdown("<https://a.com>")).toEqual([
      { text: "https://a.com", href: "https://a.com" },
    ]);
  });

  it("keeps bold inside a link and a link inside bold", () => {
    expect(inlineMarkdown("**[Go](https://go.dev)**")).toEqual([
      { text: "Go", bold: true, href: "https://go.dev" },
    ]);
    expect(inlineMarkdown("[**Go** lib](https://go.dev)")).toEqual([
      { text: "Go", bold: true, href: "https://go.dev" },
      { text: " lib", href: "https://go.dev" },
    ]);
  });

  it.each([
    "[x](javascript:alert(1))",
    "[x](/path)",
    "[x](tel:+15550100)",
    "[x](ftp://a.com)",
  ])("prints %j as typed", (source) => {
    expect(inlineMarkdown(source)).toEqual([{ text: source }]);
  });

  it("keeps line breaks", () => {
    expect(richTextString(inlineMarkdown("One\ntwo"))).toBe("One\ntwo");
    expect(richTextString(inlineMarkdown("One  \ntwo"))).toBe("One\ntwo");
  });

  it("gives empty text no runs", () => {
    expect(inlineMarkdown("")).toEqual([]);
  });
});
