/* The single source of truth for the Trísion mark: four corner brackets locked into
   a `Tr` ligature, on a 200×200 grid.
   Imported by the React component AND by the icon/OG routes, so the favicon can
   never drift from the mark in the header.

   APPROXIMATE REDRAW from the low-resolution raster on Amanda's logo tile —
   docs/spec-brand.md §1.2, open question #8. Replace wholesale when the vector
   turns up; every consumer picks the change up from here. */
export const MARCA_VIEWBOX = "0 0 200 200";

export const MARCA_PATHS = [
  /* the four brackets — the viewfinder */
  "M8 8h56v15H23v41H8z",
  "M192 8v56h-15V23h-41V8z",
  "M8 192v-56h15v41h41v15z",
  "M192 192h-56v-15h41v-41h15z",
  /* the T */
  "M34 40h92v24H34z",
  "M66 40h26v122H66z",
  /* the r */
  "M100 82h26v80h-26z",
  "M126 82h24a28 28 0 0 1 28 28v18h-26v-18a2 2 0 0 0-2-2h-24z",
] as const;

/** Just the brackets — legible at favicon sizes where the ligature turns to mush. */
export const MARCA_BRACKETS = MARCA_PATHS.slice(0, 4);

export function marcaSvg(cor = "#FFFFFF", paths: readonly string[] = MARCA_PATHS) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${MARCA_VIEWBOX}"><g fill="${cor}">${paths
    .map((d) => `<path d="${d}"/>`)
    .join("")}</g></svg>`;
}

export function marcaDataUri(cor = "#FFFFFF", paths: readonly string[] = MARCA_PATHS) {
  return `data:image/svg+xml;base64,${Buffer.from(marcaSvg(cor, paths)).toString("base64")}`;
}

/* Deterministic starfield for the OG cards. Seeded so the image is byte-stable
   across builds — a card that changes every deploy busts every social cache. */
export function estrelas(quantas: number, w: number, h: number) {
  let seed = 20021117;
  const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  return Array.from({ length: quantas }, () => ({
    left: Math.round(rnd() * w),
    top: Math.round(rnd() * h),
    size: Math.round(rnd() * 2 + 1),
    opacity: Number((rnd() * 0.7 + 0.2).toFixed(2)),
  }));
}
