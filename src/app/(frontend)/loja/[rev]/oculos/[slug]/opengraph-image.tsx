import { OG_CONTENT_TYPE, OG_SIZE, gerarOgImage } from "@/lib/og-image";
import { escopoRevendedor } from "@/lib/tenant/scope";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Óculos · Trísion Eyewear";

export default async function Image({
  params,
}: {
  params: Promise<{ rev: string; slug: string }>;
}) {
  const { rev, slug } = await params;
  const escopo = await escopoRevendedor(rev);
  const produto = escopo?.produtos.find((p) => p.sku === slug);

  if (!escopo || !produto) {
    return gerarOgImage({ kicker: "Óculos", titulo: "Trísion Eyewear" });
  }

  const { revendedor } = escopo;
  return gerarOgImage({
    kicker: `Revenda oficial · ${revendedor.nome}`,
    titulo: produto.nome,
    subtitulo: `${produto.material} · ${produto.cor}`,
    medidas: produto.medidas,
    rodape: `${revendedor.cidade} · ${revendedor.uf}`,
  });
}
