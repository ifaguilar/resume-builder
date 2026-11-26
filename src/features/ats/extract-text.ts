// The modern build warns in Node and calls Math.sumPrecise, which Node 26
// lacks. Use the modern build when this runs in the browser (v0.2 ATS view).
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

import { LINE_BREAK, PAGE_BREAK, WHITESPACE } from "#/features/ats/constants";

export type ExtractedPage = { lines: string[] };

const FIRST_PAGE = 1;

// Lines follow pdf.js's own spacing and line ends (hasEOL), the plain reading
// a text-layer parser gets, not a layout we rebuild.
export async function extractText(pdf: Uint8Array): Promise<ExtractedPage[]> {
  // pdf.js takes ownership of the bytes it is given, so it gets a copy.
  const task = getDocument({ data: new Uint8Array(pdf) });
  try {
    const document = await task.promise;
    return await Promise.all(
      Array.from({ length: document.numPages }, async (_, index) => {
        const page = await document.getPage(index + FIRST_PAGE);
        const { items } = await page.getTextContent();
        const text = items
          .map((item) =>
            "str" in item ? item.str + (item.hasEOL ? LINE_BREAK : "") : "",
          )
          .join("");
        return {
          lines: text
            .split(LINE_BREAK)
            .map((line) => line.trim())
            .filter((line) => line !== ""),
        };
      }),
    );
  } finally {
    await task.destroy();
  }
}

export function pagesToText(pages: ExtractedPage[]): string {
  return pages
    .map((page) => page.lines.join(LINE_BREAK))
    .join(LINE_BREAK + PAGE_BREAK + LINE_BREAK);
}

export function toWords(text: string): string[] {
  return text.split(WHITESPACE).filter((word) => word !== "");
}

export function pagesToWords(pages: ExtractedPage[]): string[] {
  return pages.flatMap((page) => page.lines.flatMap(toWords));
}
