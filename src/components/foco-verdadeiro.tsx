"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

/* The thesis, in focus — docs/spec-design.md §7.4: "an optical focus device with corner
   brackets, for an eyewear brand whose mark is a corner-bracket focus device." The named
   customer-facing target is `/` (this component); `/apresentacao` slide 03 reuses it for
   the pitch — a different audience in a different session, not the "twice is a gimmick"
   case §7.4 warns about.

   Each word starts blurred/dimmed; a single gold bracket travels word to word as the block
   enters view, sharpening each one in turn and settling on the full sentence in focus.
   Reduced motion is handled by `<MotionConfig reducedMotion="user">` (`ProvedorMotion` on `/`
   and `/apresentacao`), not a branch here — see revela.tsx for why CSS `Revela` is separate.
   Under reduced motion the words still resolve to focus, just without the blur tween. */
export function FocoVerdadeiro({
  texto,
  atrasoInicial = 0,
}: {
  texto: string;
  /* Lets a headline be split into two `FocoVerdadeiro` calls (e.g. across a manual
     line break) while the gold bracket still travels word to word continuously
     across both — pass the previous call's word count * 0.14 so the second line's
     delays pick up where the first left off, instead of restarting at 0. */
  atrasoInicial?: number;
}) {
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
              duration: 0.56,
              delay: atrasoInicial + i * 0.14,
              ease: [0.16, 1, 0.3, 1],
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
              duration: 0.42,
              delay: atrasoInicial + i * 0.14,
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
