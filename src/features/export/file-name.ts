import {
  FILE_NAME_UNSAFE,
  FILE_NAME_WHITESPACE,
  FILE_NAME_WORD_SEPARATOR,
  PDF_FALLBACK_FILE_NAME,
  PDF_FILE_SUFFIX,
} from "#/features/export/constants";
import { cleanText } from "#/features/templates/format";

// Recruiters see the file name, so it carries the candidate's name.
export function pdfFileName(name: unknown): string {
  const words = cleanText(name)
    .replace(FILE_NAME_UNSAFE, "")
    .split(FILE_NAME_WHITESPACE)
    .filter((word) => word !== "");
  if (words.length === 0) return PDF_FALLBACK_FILE_NAME;
  return words.join(FILE_NAME_WORD_SEPARATOR) + PDF_FILE_SUFFIX;
}
