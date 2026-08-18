import { OG_CONTENT_TYPE, OG_SIZE, gerarOgImage } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Seja revendedor · Trísion Eyewear";

export default async function Image() {
  return gerarOgImage({
    kicker: "Seja revendedor",
    titulo: "Seja revendedor Trísion",
    subtitulo: "Uma linha curada — não o catálogo mais largo, a certa.",
  });
}
