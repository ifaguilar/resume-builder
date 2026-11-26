import {
  FILE_NAME_UNSAFE,
  FILE_NAME_WHITESPACE,
  FILE_NAME_WORD_SEPARATOR,
  PDF_EXTENSION,
} from "#/features/export/constants";
import { cleanText } from "#/features/resume/stored-value";

// Recruiters see the file name, so it carries the candidate's name and the
// word they use for the document ("Resume" or "CV").
export function pdfFileName(name: unknown, documentWord: string): string {
  const words = cleanText(name)
    .replace(FILE_NAME_UNSAFE, "")
    .split(FILE_NAME_WHITESPACE)
    .filter((word) => word !== "");
  return (
    [...words, documentWord].join(FILE_NAME_WORD_SEPARATOR) + PDF_EXTENSION
  );
}
