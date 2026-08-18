/* `a numeração` — the boxing-system size marking stamped inside every temple arm.
   docs/spec-design.md §5.

   Stored as three numbers in mm and formatted here, at the edge. Never stored as
   the string "52□18-145" — a string cannot be filtered, sorted or converted.
   `lib/numeracao.ts`'s `formatarNumeracao` builds that same string as plain text
   for the WhatsApp message (`lib/lead/link.ts`) — same digits, same order, kept in
   sync by eye since this component draws them as SVG+JSX rather than a string.

   The `□` is U+25A1, which almost no mono webfont ships, so it is drawn as inline
   SVG rather than trusting the font. Never substitute `-`, `x` or `/`: opticians
   read the box as the box.

   A product with no measurements renders NOTHING here — not a placeholder. */
export function Numeracao({
  aro,
  ponte,
  haste,
  className = "",
  cor = "currentColor",
  tamanho = 9,
}: {
  aro?: number;
  ponte?: number;
  haste?: number;
  className?: string;
  cor?: string;
  tamanho?: number;
}) {
  if (aro == null || ponte == null || haste == null) return null;
  return (
    <span
      className={`inline-flex items-center gap-[.4em] font-mono tabular-nums tracking-[.04em] ${className}`}
    >
      {aro}
      <svg
        width={tamanho}
        height={tamanho}
        viewBox="0 0 9 9"
        className="shrink-0"
        role="img"
        aria-label="por"
      >
        <rect
          x="1"
          y="1"
          width="7"
          height="7"
          fill="none"
          stroke={cor}
          strokeWidth="1.2"
        />
      </svg>
      {ponte}-{haste}
    </span>
  );
}
