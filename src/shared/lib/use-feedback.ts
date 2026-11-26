import { useEffect, useState } from "react";

import { FEEDBACK_DURATION_MS } from "#/shared/constants";

// True for a moment after show(), to confirm an action that just finished.
export function useFeedback(initiallyShown = false) {
  const [shown, setShown] = useState(initiallyShown);

  useEffect(() => {
    if (!shown) return undefined;
    const timer = setTimeout(() => setShown(false), FEEDBACK_DURATION_MS);
    return () => clearTimeout(timer);
  }, [shown]);

  return { shown, show: () => setShown(true) };
}
