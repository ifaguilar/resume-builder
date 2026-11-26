import { LazyMotion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";

// Loaded after the first render: nothing animates before the user acts.
const loadFeatures = () =>
  import("#/shared/lib/motion-features").then((module) => module.default);

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
