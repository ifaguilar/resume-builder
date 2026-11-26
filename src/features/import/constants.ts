import { m } from "#/paraglide/messages.js";

export const JSON_FILE_ACCEPT = "application/json,.json";

export const IMPORT_ERROR_MESSAGES = {
  notJson: m.import_error_not_json,
  notAResume: m.import_error_not_a_resume,
  unreadable: m.import_error_unreadable,
} as const;
