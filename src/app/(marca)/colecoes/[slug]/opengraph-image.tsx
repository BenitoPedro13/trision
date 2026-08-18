import { OG_CONTENT_TYPE, OG_SIZE, gerarOgImage } from "@/lib/og-image";
import { catalogSourceLocal } from "@/lib/catalog/source.local";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Coleção · Trísion Eyewear";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const colecoes = await catalogSourceLocal.listarColecoes();
  const colecao = colecoes.find((c) => c.slug === slug);

  if (!colecao) {
    return gerarOgImage({ kicker: "Coleção", titulo: "Trísion Eyewear" });
  }

  return gerarOgImage({
    kicker: `Coleção · ${colecao.ano}`,
    titulo: colecao.nome,
    subtitulo: colecao.texto,
  });
}
