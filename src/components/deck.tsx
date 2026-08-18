"use client";

import { useRef } from "react";
import { motion, useScroll } from "motion/react";

/* The deck container plus a scroll-progress rail down the right edge — not named in
   spec-design.md by title, but a direct application of the §7 motion budget (a decorative,
   `aria-hidden` signal, not a new interactive element) using the same `useScroll` machinery
   §7.4's other pieces need.

   First version (2026-08-18) was a bare 38vh gold line with no visible track — read as a
   floating stray mark, not a progress indicator (Benito: "what are those vertical lines?").
   This version draws the full track in `--aro` (so the unfilled length is visible, giving the
   gold fill something to read as progress *against*) and caps both ends with a small tick, the
   same idiom the `Contador` component already uses for "position within a sequence" — so the
   rail reads as an extension of the existing `01 / 16` counter, not a new device.

   Not gated behind `useReducedMotion()`: the rail tracks scroll position 1:1, the same as a
   native scrollbar thumb, rather than auto-playing, so it isn't the kind of motion
   `prefers-reduced-motion` is asking to remove. */
export function Deck({
  children,
  className,
  ariaLabel,
}: {
  children: React.ReactNode;
  className: string;
  ariaLabel: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: ref });

  return (
    <div ref={ref} className={className} aria-label={ariaLabel}>
      {children}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed right-6 top-1/2 z-[3] hidden h-[56vh] w-px -translate-y-1/2 flex-col items-center sm:flex"
      >
        <span className="h-1.5 w-1.5 shrink-0" style={{ background: "var(--aro)" }} />
        <div className="w-px flex-1" style={{ background: "var(--aro)" }}>
          <motion.div
            className="w-full origin-top"
            style={{ background: "var(--ouro)", height: "100%", scaleY: scrollYProgress }}
          />
        </div>
        <span className="h-1.5 w-1.5 shrink-0" style={{ background: "var(--aro)" }} />
      </div>
    </div>
  );
}
