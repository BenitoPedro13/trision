import { OG_CONTENT_TYPE, OG_SIZE, gerarOgImage } from "@/lib/og-image";
import { catalogSourceLocal } from "@/lib/catalog/source.local";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Catálogo · Trísion Eyewear";

export default async function Image() {
  const produtos = await catalogSourceLocal.listarProdutos();
  return gerarOgImage({
    kicker: "Catálogo",
    titulo: "Todos os óculos Trísion",
    subtitulo: `${produtos.length} armações selecionadas.`,
  });
}
