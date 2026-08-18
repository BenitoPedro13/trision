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
  texto = "text-[clamp(2rem,5.4vw,4rem)]",
  /* Sized as its own clamp, not `em` relative to `texto`, on purpose — the previous
     nested `.26em` approach broke once `texto` shrank to header scale (rendered under
     5px, unreadable — user report, TASK-logo-cabecalho-unificado.md). Callers passing
     a non-default `texto` should pass a matching `subtexto`. */
  subtexto = "text-[clamp(.75rem,1.9vw,1.375rem)]",
  gap = "gap-[clamp(16px,3vw,32px)]",
  desde = true,
  /* `LojaCabecalho`'s `lg+`-only lockup (TASK-loja-cabecalho-invertido.md) sits in a
     3-column grid whose flanking tracks are both `1fr` — `flex-wrap`'s min-content is
     just its largest child (the icon or the wordmark alone), so the grid can allocate
     less than the lockup's real unwrapped width and it wraps mid-layout. `quebra=
     {false}` reports the full width as the floor instead. */
  quebra = true,
}: {
  simbolo?: string;
  texto?: string;
  subtexto?: string;
  gap?: string;
  desde?: boolean;
  quebra?: boolean;
}) {
  return (
    <div className={`flex items-center ${quebra ? "flex-wrap" : "flex-nowrap"} ${gap}`}>
      <MarcaSimbolo className={`${simbolo} h-auto shrink-0 text-foco`} />
      <div className="flex flex-col items-end">
        <span
          className={`${texto} font-light leading-none tracking-[.02em] text-foco`}
          style={{ fontVariationSettings: '"wdth" 125' }}
        >
          Trísion
        </span>
        <span
          className={`mt-[.15em] ${subtexto} font-bold italic tracking-[.02em] text-prata`}
          style={{ fontVariationSettings: '"wdth" 110' }}
        >
          Eyewear
        </span>
      </div>
      {desde && (
        <div className="flex items-center self-stretch border-l border-aro pl-4 font-mono text-[.6875rem] uppercase tracking-[.24em] text-ouro">
          Desde 2002
        </div>
      )}
    </div>
  );
}
