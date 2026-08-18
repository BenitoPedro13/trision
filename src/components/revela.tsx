"use client";

import { motion } from "motion/react";

/* Scroll-triggered entrance — docs/spec-design.md §7.4 (ScrollFloat/ScrollReveal-equivalent),
   built on `motion` rather than vendored, see spec-design.md §7. Fires once. Uses the
   *content-entrance* budget added to §7.5 (560ms element / 760ms section, expo-out) rather
   than the original 120/240/480ms figures — those stay correct for interaction states
   (VisorCursor's snap, :focus-visible) but read as a flicker, not a reveal, on a slide-sized
   block of content; Benito confirmed 2026-08-18 after seeing the 240ms version.

   Reduced motion is handled by `<MotionConfig reducedMotion="user">` in
   `apresentacao/page.tsx`, not by branching this component's own JSX: Motion collapses the
   transition to its end state instantly rather than skipping it, which keeps server and
   client rendering the same tree (branching on `useReducedMotion()` here previously caused
   a hydration mismatch — the server can't know the client's OS preference, so it always
   rendered the animated branch, which the client immediately discarded and rebuilt whenever
   reduced motion was on). §7.5's binding rule — a complete, static-feeling page — still
   holds: content still appears, just without the tween. */
export function Revela({
  children,
  atraso = 0,
  secao = false,
  className,
  style,
}: {
  children: React.ReactNode;
  /** stagger delay in seconds, for repeating grid children */
  atraso?: number;
  /** true = section-level entrance (760ms), false = element-level (560ms) */
  secao?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{
        duration: secao ? 0.76 : 0.56,
        delay: atraso,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
