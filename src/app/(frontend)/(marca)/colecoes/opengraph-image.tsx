import { OG_CONTENT_TYPE, OG_SIZE, gerarOgImage } from "@/lib/og-image";
import { catalogSource } from "@/lib/catalog/source";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Coleções · Trísion Eyewear";

export default async function Image() {
  const colecoes = await catalogSource.listarColecoes();
  return gerarOgImage({
    kicker: "Coleções",
    titulo: "As coleções Trísion",
    subtitulo: `${colecoes.length} coleções, uma decisão por vez.`,
  });
}
