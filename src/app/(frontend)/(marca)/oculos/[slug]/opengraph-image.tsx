import { OG_CONTENT_TYPE, OG_SIZE, gerarOgImage } from "@/lib/og-image";
import { catalogSource } from "@/lib/catalog/source";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Óculos · Trísion Eyewear";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const produto = await catalogSource.buscarProdutoPorSku(slug);

  if (!produto) {
    return gerarOgImage({ kicker: "Óculos", titulo: "Trísion Eyewear" });
  }

  return gerarOgImage({
    kicker: `${produto.categoria} · ${produto.formato}`,
    titulo: produto.nome,
    subtitulo: `${produto.material} · ${produto.cor}`,
    medidas: produto.medidas,
    rodape: produto.sku,
  });
}
