import { MARCA_PATHS, MARCA_VIEWBOX } from "@/lib/marca-paths";

/* Paths live in @/lib/marca-paths so the header mark, the favicon and the OG card
   are literally the same geometry. See that file for the redraw caveat. */
export function MarcaSimbolo({ className }: { className?: string }) {
  return (
    <svg viewBox={MARCA_VIEWBOX} className={className} aria-hidden="true">
      <g fill="currentColor">
        {MARCA_PATHS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  );
}

/* The horizontal lockup the brand never had (spec-brand.md §4, "Refine").
   `Trísion` always carries its accent — including in <title> and OG tags. */
export function MarcaLockup({
  simbolo = "w-[clamp(64px,7.5vw,104px)]",
  desde = true,
}: {
  simbolo?: string;
  desde?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-[clamp(16px,3vw,32px)]">
      <MarcaSimbolo className={`${simbolo} h-auto shrink-0 text-foco`} />
      <div
        className="text-[clamp(2rem,5.4vw,4rem)] font-light leading-none tracking-[.02em] text-foco"
        style={{ fontVariationSettings: '"wdth" 125' }}
      >
        Trísion
        <span
          className="mt-[.4em] block text-[.26em] font-bold italic tracking-[.02em] text-prata"
          style={{ fontVariationSettings: '"wdth" 110' }}
        >
          Eyewear
        </span>
      </div>
      {desde && (
        <div className="flex items-center self-stretch border-l border-aro pl-4 font-mono text-[.6875rem] uppercase tracking-[.24em] text-turquesa">
          Desde 2002
        </div>
      )}
    </div>
  );
}
