"use client";

import { useEffect, useRef } from "react";

/* Scroll-triggered entrance — docs/spec-design.md §7.4 (ScrollFloat/ScrollReveal-equivalent).
   Pure CSS transitions + Intersection Observer, not `motion`: the catalogue grids mount one
   `Revela` per card; pulling the motion runtime into `GradeProdutos` blew the §12 JS budget
   on routes that only need a quiet slide-up (TASK-motion-vitrine.md verification). Opacity
   stays at 1 from first paint so above-the-fold headings don't regress LCP.

   Timing uses the content-entrance budget from §7.5 (560ms element / 760ms section, expo-out).
   Reduced motion is handled in `globals.css` (`.revela`), not a JSX branch — see
   `provedor-motion.tsx` for why `FocoVerdadeiro` alone needs `<MotionConfig>`. */
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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revela--visivel");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={["revela", secao && "revela-secao", className].filter(Boolean).join(" ")}
      style={
        {
          ...style,
          "--revela-atraso": `${atraso}s`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
