/* `o visor` — the four hairline corner brackets, extracted from the mark and
   promoted to the system's only ornament. docs/spec-design.md §3.1.

   THE BINDING RULE: a bracket frames something real — focus, selection, a product,
   a section, a crop. A bracket decorating an empty area is out of spec.

   Each corner sets only its own two borders explicitly. Do NOT reach for a
   shorthand `borderWidth` here: it applies to all four sides and closes the
   brackets into squares, which is exactly the wrong shape. */
export function Visor({
  children,
  className = "",
  cor = "var(--turquesa)",
  tamanho = 14,
  folga = 8,
}: {
  children: React.ReactNode;
  className?: string;
  cor?: string;
  tamanho?: number;
  folga?: number;
}) {
  const risco = `1.5px solid ${cor}`;
  const base: React.CSSProperties = {
    position: "absolute",
    width: tamanho,
    height: tamanho,
    pointerEvents: "none",
  };
  const cantos: React.CSSProperties[] = [
    { top: -folga, left: -folga, borderTop: risco, borderLeft: risco },
    { top: -folga, right: -folga, borderTop: risco, borderRight: risco },
    { bottom: -folga, left: -folga, borderBottom: risco, borderLeft: risco },
    { bottom: -folga, right: -folga, borderBottom: risco, borderRight: risco },
  ];
  return (
    <div className={`relative block ${className}`}>
      {cantos.map((c, i) => (
        <span key={i} aria-hidden="true" style={{ ...base, ...c }} />
      ))}
      {children}
    </div>
  );
}
