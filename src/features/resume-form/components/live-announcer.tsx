import { type ReactNode, useCallback, useState } from "react";

import { AnnounceContext } from "#/features/resume-form/components/announce-context";

export function LiveAnnouncer({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState("");

  // Clearing first makes screen readers repeat a message that hasn't changed.
  const announce = useCallback((text: string) => {
    setMessage("");
    requestAnimationFrame(() => setMessage(text));
  }, []);

  return (
    <AnnounceContext value={announce}>
      {children}
      <p aria-live="polite" className="sr-only">
        {message}
      </p>
    </AnnounceContext>
  );
}
