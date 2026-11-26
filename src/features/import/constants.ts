export const JSON_FILE_ACCEPT = "application/json,.json";

export const IMPORT_ERROR_TITLE = "This file can't be imported";
export const IMPORT_ERROR_MESSAGES = {
  notJson: "It isn't a valid JSON file.",
  notAResume: "It doesn't contain a resume.",
  unreadable: "The file couldn't be read.",
} as const;
