import { OG_CONTENT_TYPE, OG_SIZE, gerarOgImage } from "@/lib/og-image";
import { catalogSourceLocal } from "@/lib/catalog/source.local";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Coleções · Trísion Eyewear";

export default async function Image() {
  const colecoes = await catalogSourceLocal.listarColecoes();
  return gerarOgImage({
    kicker: "Coleções",
    titulo: "As coleções Trísion",
    subtitulo: `${colecoes.length} coleções, uma decisão por vez.`,
  });
}
