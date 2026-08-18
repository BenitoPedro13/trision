/* Scroll-triggered entrance — docs/spec-design.md §7.4 (ScrollFloat/ScrollReveal-equivalent).
   CSS scroll-driven animation (`animation-timeline: view()`), no client JS: mounting one
   Intersection Observer per grid card blew the §12 budget on catalogue routes
   (TASK-motion-vitrine.md verification). Opacity stays 1 from first paint (LCP-safe); only Y
   moves. Timing follows the content-entrance budget in §7.5 (560ms / 760ms, expo-out).
   Browsers without scroll-driven animation support get a static layout — still fully legible. */
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
    <div
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
