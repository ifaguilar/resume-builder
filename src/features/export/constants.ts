// Tool settings live in JSON Resume's `meta` ("tooling configuration") under
// our own key, so other tools ignore them. The key is a placeholder until the
// project is named.
export const SETTINGS_META_KEY = "resumeBuilder";

export const JSON_FILE_NAME = "resume.json";
export const JSON_MIME_TYPE = "application/json";
export const JSON_INDENT = 2;
export const JSON_FINAL_NEWLINE = "\n";

export const PDF_FILE_SUFFIX = "-Resume.pdf";
export const PDF_FALLBACK_FILE_NAME = "Resume.pdf";
// Characters Windows, macOS or Linux reject in file names.
export const FILE_NAME_UNSAFE = /[\\/:*?"<>|\p{Cc}]/gu;
export const FILE_NAME_WHITESPACE = /\s+/;
// Spaces get mangled by some email clients and upload forms.
export const FILE_NAME_WORD_SEPARATOR = "-";

// Revoking a download's URL in the same task can cancel it in Firefox.
export const DOWNLOAD_URL_REVOKE_DELAY_MS = 1000;

export const PDF_EXPORT_ERROR_TITLE = "The PDF couldn't be created";
export const PDF_EXPORT_ERROR_MESSAGE =
  "Something went wrong while rendering it. Your resume is safe; try again.";
