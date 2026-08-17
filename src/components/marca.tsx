/* The Trísion mark: four corner brackets locked into a `Tr` ligature.
   NOTE: this is an APPROXIMATE redraw from the low-resolution raster on Amanda's
   logo tile. The final lockup depends on the original vector — docs/spec-brand.md
   §1.2, open question #8. Do not treat these paths as final. */
export function MarcaSimbolo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <g fill="currentColor">
        <path d="M8 8h56v15H23v41H8z" />
        <path d="M192 8v56h-15V23h-41V8z" />
        <path d="M8 192v-56h15v41h41v15z" />
        <path d="M192 192h-56v-15h41v-41h15z" />
        <path d="M34 40h92v24H34z" />
        <path d="M66 40h26v122H66z" />
        <path d="M100 82h26v80h-26z" />
        <path d="M126 82h24a28 28 0 0 1 28 28v18h-26v-18a2 2 0 0 0-2-2h-24z" />
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
