import { CheckIcon, Loader2Icon } from "lucide-react";
import * as motion from "motion/react-m";
import type { ReactNode } from "react";

import { ICON_POP_SCALE } from "#/shared/constants";
import { fadeTransition } from "#/shared/lib/motion-transitions";

export type ActionStatus = "idle" | "busy" | "done";

// A button's leading icon that turns into a spinner while its action runs
// and a check once it's done. The label stays, so the button never resizes.
// Keyed without AnimatePresence, so the old icon goes at once instead of
// sitting beside the new one; the resting icon appears without a pop.
export function StatusIcon({
  status,
  icon,
}: {
  status: ActionStatus;
  icon: ReactNode;
}) {
  return (
    <motion.span
      key={status}
      data-icon="inline-start"
      aria-hidden
      className="inline-flex"
      initial={
        status === "idle" ? false : { opacity: 0, scale: ICON_POP_SCALE }
      }
      animate={{ opacity: 1, scale: 1 }}
      transition={fadeTransition}
    >
      {status === "busy" ? (
        <Loader2Icon className="animate-spin" />
      ) : status === "done" ? (
        <CheckIcon />
      ) : (
        icon
      )}
    </motion.span>
  );
}
