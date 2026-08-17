"use client";

import { useEffect, useRef } from "react";

/* Her starfield, rebuilt live instead of shipped as a 1.5 MB JPEG.
   The ground appears in three independent places in Amanda's material
   (spec-brand.md §1.3), so it is hers, not a decoration we added.

   Non-negotiable (spec-design.md §7.1): the page is fully legible if this never
   initialises, and it holds still under prefers-reduced-motion. */
export function Ceu() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const parado = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0,
      h = 0,
      raf = 0;
    let estrelas: { x: number; y: number; r: number; a: number; v: number; f: number }[] = [];

    const montar = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.width = window.innerWidth * dpr;
      h = cv.height = window.innerHeight * dpr;
      cv.style.width = "100%";
      cv.style.height = "100%";
      const n = Math.min(700, Math.round((window.innerWidth * window.innerHeight) / 2200));
      estrelas = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: (Math.random() * 1.35 + 0.3) * dpr,
        a: Math.random() * 0.72 + 0.28,
        v: Math.random() * 0.02 + 0.004,
        f: Math.random() * Math.PI * 2,
      }));
    };

    const pintar = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const s of estrelas) {
        const al = parado ? s.a : s.a * (0.42 + 0.58 * Math.sin(t * s.v + s.f));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232,235,236,${al.toFixed(3)})`;
        ctx.fill();
      }
    };

    const laco = (t: number) => {
      pintar(t);
      raf = requestAnimationFrame(laco);
    };

    montar();
    window.addEventListener("resize", montar);
    if (parado) pintar(0);
    else raf = requestAnimationFrame(laco);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", montar);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
