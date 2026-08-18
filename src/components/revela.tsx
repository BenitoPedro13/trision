"use client";

import { motion } from "motion/react";

/* Entrance animation — docs/spec-design.md §7.4. Previously CSS-only
   (`animation-timeline: view()`, no client JS) specifically to avoid mounting an
   Intersection Observer per grid card. Replaced with `motion/react`'s `whileInView`
   after that approach turned out to only animate on an actual scroll gesture crossing
   the element into view — on any page where the content already fits in the first
   viewport (every grid page: /catalogo, /revendedores, /colecoes) or on first paint
   generally, there is no scroll event to trigger it, so nothing ever animated in
   (user: "no stagger as well on anything any list nothing"). `whileInView` uses an
   IntersectionObserver, which fires on mount for already-visible elements too.

   Reduced motion is handled by the nearest `<MotionConfig reducedMotion="user">`
   ancestor (`ProvedorMotion`, now mounted in the shared marca/loja layouts), not a
   local branch here — same pattern `FocoVerdadeiro` already used.

   Opacity stays 1 always; only Y moves — LCP-safe, unchanged from the CSS version. */
export function Revela({
  children,
  atraso = 0,
  secao = false,
  className,
  style,
}: {
  children: React.ReactNode;
  atraso?: number;
  secao?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      initial={{ y: 22 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{
        duration: secao ? 0.76 : 0.56,
        delay: atraso,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
