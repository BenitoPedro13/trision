import { OG_CONTENT_TYPE, OG_SIZE, gerarOgImage } from "@/lib/og-image";
import { catalogSource } from "@/lib/catalog/source";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Catálogo · Trísion Eyewear";

export default async function Image() {
  const produtos = await catalogSource.listarProdutos();
  return gerarOgImage({
    kicker: "Catálogo",
    titulo: "Todos os óculos Trísion",
    subtitulo: `${produtos.length} armações selecionadas.`,
  });
}
