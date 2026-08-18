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
  const item = escopo?.itens.find((i) => i.produto.sku === slug);

  if (!escopo || !item) {
    return gerarOgImage({ kicker: "Óculos", titulo: "Trísion Eyewear" });
  }

  const { produto } = item;
  const { revendedor } = escopo;
  return gerarOgImage({
    kicker: `Revenda oficial · ${revendedor.nome}`,
    titulo: produto.nome,
    subtitulo: `${produto.material} · ${produto.cor}`,
    medidas: produto.medidas,
    rodape: `${revendedor.cidade} · ${revendedor.uf}`,
  });
}
