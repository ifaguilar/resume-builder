import type { AnyFieldApi } from "@tanstack/react-form";
import { useState } from "react";

import {
  type FieldWarning,
  isFieldWarning,
} from "#/features/resume-form/resume-warnings-validator";

export function useVisibleWarnings(field: AnyFieldApi) {
  const [isFocused, setIsFocused] = useState(false);

  const warnings: FieldWarning[] = isFocused
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
