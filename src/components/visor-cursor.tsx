"use client";

import { useEffect, useRef } from "react";

/* The mark, alive — docs/spec-design.md §7.2.

   Four corner brackets that follow the pointer and SNAP onto anything marked
   `data-alvo`. This is Amanda's logo, moving: the brand mark stops being a sticker
   in the corner and becomes how the site behaves.

   Three conditions, all non-negotiable:
   - pointer-fine only. On touch there is no cursor to decorate, and a floating
     bracket that never resolves is just debris.
   - off under prefers-reduced-motion. The `:focus-visible` brackets in globals.css
     do the same job there without motion.
   - the native cursor stays. This augments the pointer, it does not replace it —
     replacing it is how you lose people who need the real one. */
export function VisorCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fino = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const parado = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fino || parado) return;

    let alvo: Element | null = null;
    let x = -100;
    let y = -100;

    const posicionar = () => {
      if (alvo) {
        const r = alvo.getBoundingClientRect();
        el.style.transition = "all .18s cubic-bezier(.2,.8,.2,1)";
        el.style.left = `${r.left - 9}px`;
        el.style.top = `${r.top - 9}px`;
        el.style.width = `${r.width + 18}px`;
        el.style.height = `${r.height + 18}px`;
      } else {
        el.style.transition = "all .09s linear";
        el.style.left = `${x - 19}px`;
        el.style.top = `${y - 19}px`;
        el.style.width = "38px";
        el.style.height = "38px";
      }
    };

    const mover = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      const alvoNovo =
        e.target instanceof Element ? e.target.closest("[data-alvo]") : null;
      alvo = alvoNovo;
      el.style.opacity = "1";
      posicionar();
    };

    /* The snapped rect is viewport-relative, so it must be re-read while the deck
       scrolls under it — otherwise the brackets detach from what they are framing. */
    const rolar = () => {
      if (alvo) posicionar();
    };
    const sair = () => {
      el.style.opacity = "0";
    };

    window.addEventListener("mousemove", mover, { passive: true });
    window.addEventListener("scroll", rolar, { passive: true, capture: true });
    document.addEventListener("mouseleave", sair);

    return () => {
      window.removeEventListener("mousemove", mover);
      window.removeEventListener("scroll", rolar, { capture: true });
      document.removeEventListener("mouseleave", sair);
    };
  }, []);

  const risco = "1.5px solid var(--turquesa-claro)";
  const base: React.CSSProperties = { position: "absolute", width: 11, height: 11 };

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed z-50 opacity-0"
      style={{ left: -100, top: -100, width: 38, height: 38 }}
    >
      <span style={{ ...base, top: 0, left: 0, borderTop: risco, borderLeft: risco }} />
      <span style={{ ...base, top: 0, right: 0, borderTop: risco, borderRight: risco }} />
      <span style={{ ...base, bottom: 0, left: 0, borderBottom: risco, borderLeft: risco }} />
      <span style={{ ...base, bottom: 0, right: 0, borderBottom: risco, borderRight: risco }} />
    </div>
  );
}
