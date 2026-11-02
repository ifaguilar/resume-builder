import type { z } from "zod";

import { WARNING_MESSAGES } from "#/features/resume/constants";
import { resumeSchema } from "#/features/resume/resume-schema";

type WarningPath = (string | number)[];

export type ResumeWarning = { path: WarningPath; message: string };

function toPath(path: readonly PropertyKey[]): WarningPath {
  return path.map((key) => (typeof key === "number" ? key : String(key)));
}

function isRootTypeMismatch(issue: z.core.$ZodIssue): boolean {
  return issue.code === "invalid_type" && issue.path.length === 0;
}

function toWarnings(
  issue: z.core.$ZodIssue,
  prefix: WarningPath,
): ResumeWarning[] {
  const path = [...prefix, ...toPath(issue.path)];

  if (issue.code === "unrecognized_keys") {
    return issue.keys.map((key) => ({
      path: [...path, key],
      message: WARNING_MESSAGES.unknownKey(key),
    }));
  }

  if (issue.code === "invalid_union") {
    // When only one branch matched the value's type (e.g. a location object),
    // report that branch's real problems instead of a generic union error.
    const relevant = issue.errors.filter(
      (branch) => !branch.every(isRootTypeMismatch),
    );
    const [onlyBranch] = relevant;
    if (relevant.length === 1 && onlyBranch) {
      return onlyBranch.flatMap((inner) => toWarnings(inner, path));
    }
  }

  if (path.length === 0 && issue.code === "invalid_type") {
    return [{ path, message: WARNING_MESSAGES.notAnObject }];
  }

  return [{ path, message: issue.message }];
}

// Checks a resume against JSON Resume and reports problems as warnings.
// It never throws and never changes the input: a half-written resume is valid.
export function validateResume(input: unknown): { warnings: ResumeWarning[] } {
  const result = resumeSchema.safeParse(input);
  if (result.success) return { warnings: [] };
  return {
    warnings: result.error.issues.flatMap((issue) => toWarnings(issue, [])),
  };
}
