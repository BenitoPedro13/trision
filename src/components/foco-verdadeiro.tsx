"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

/* The thesis, in focus — docs/spec-design.md §7.4: "an optical focus device with corner
   brackets, for an eyewear brand whose mark is a corner-bracket focus device." Used exactly
   once (slide 03, "Um aro é uma decisão sobre o que você olha"), per §7.4's own warning that
   a second use is a gimmick.

   Each word starts blurred/dimmed; a single gold bracket travels word to word as the slide
   enters view, sharpening each one in turn and settling on the full sentence in focus.
   Reduced motion is handled by `<MotionConfig reducedMotion="user">` (apresentacao/page.tsx),
   not a branch here — see the matching comment in revela.tsx for why: branching on
   `useReducedMotion()` in a component rendered during SSR caused a hydration mismatch. Under
   reduced motion the words still resolve to focus, just without the blur tween. */
export function FocoVerdadeiro({ texto }: { texto: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const emVista = useInView(ref, { once: true, margin: "-20% 0px" });
  const palavras = texto.split(" ");

  return (
    <span ref={ref} style={{ display: "inline" }}>
      {palavras.map((palavra, i) => (
        <span key={i} style={{ display: "inline-block", position: "relative" }}>
          <motion.span
            initial={{ filter: "blur(6px)", opacity: 0.35 }}
            animate={emVista ? { filter: "blur(0px)", opacity: 1 } : undefined}
            transition={{
              duration: 0.24,
              delay: i * 0.09,
              ease: [0.2, 0.8, 0.2, 1],
            }}
            style={{ display: "inline-block" }}
          >
            {palavra}
          </motion.span>
          <motion.span
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={emVista ? { opacity: [0, 1, 1, 0] } : undefined}
            transition={{
              duration: 0.3,
              delay: i * 0.09,
              times: [0, 0.2, 0.75, 1],
              ease: "linear",
            }}
            style={{
              position: "absolute",
              inset: "-4px -6px",
              pointerEvents: "none",
              background: `
                linear-gradient(var(--ouro), var(--ouro)) 0 0 / 1.5px 9px no-repeat,
                linear-gradient(var(--ouro), var(--ouro)) 0 0 / 9px 1.5px no-repeat,
                linear-gradient(var(--ouro), var(--ouro)) 100% 0 / 1.5px 9px no-repeat,
                linear-gradient(var(--ouro), var(--ouro)) 100% 0 / 9px 1.5px no-repeat,
                linear-gradient(var(--ouro), var(--ouro)) 0 100% / 1.5px 9px no-repeat,
                linear-gradient(var(--ouro), var(--ouro)) 0 100% / 9px 1.5px no-repeat,
                linear-gradient(var(--ouro), var(--ouro)) 100% 100% / 1.5px 9px no-repeat,
                linear-gradient(var(--ouro), var(--ouro)) 100% 100% / 9px 1.5px no-repeat
              `,
            }}
          />
          {i < palavras.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}
