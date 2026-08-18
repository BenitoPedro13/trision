"use client";

import { MotionConfig } from "motion/react";

/* Reduced-motion boundary for `FocoVerdadeiro` — docs/tasks/TASK-motion-vitrine.md §2.1.
   Scoped to `/` and `/apresentacao` (the only routes that mount `FocoVerdadeiro`), not
   `layout.tsx`: putting `motion` in the root layout pulled the runtime onto catalogue grids
   that only need CSS `Revela`, and blew the §12 JS budget. `Revela` handles its own reduced
   motion via `globals.css`. */
export function ProvedorMotion({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
