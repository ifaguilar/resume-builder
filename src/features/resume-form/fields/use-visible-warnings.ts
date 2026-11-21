import type { AnyFieldApi } from "@tanstack/react-form";
import { useState } from "react";

import {
  type FieldWarning,
  isFieldWarning,
} from "#/features/resume-form/resume-warnings-validator";

// Warnings wait while the user is typing. A picker's value is final once
// picked, and focus returns to its trigger, so it opts out.
export function useVisibleWarnings(
  field: AnyFieldApi,
  { hideWhileFocused = true }: { hideWhileFocused?: boolean } = {},
) {
  const [isFocused, setIsFocused] = useState(false);

  const warnings: FieldWarning[] =
    hideWhileFocused && isFocused
      ? []
      : field.state.meta.errors.flat().filter(isFieldWarning);

  return {
    warnings,
    isInvalid: warnings.length > 0,
    focusProps: {
      onFocus: () => setIsFocused(true),
      onBlur: () => {
        setIsFocused(false);
        field.handleBlur();
      },
    },
  };
}
