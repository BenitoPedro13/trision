import { OG_CONTENT_TYPE, OG_SIZE, gerarOgImage } from "@/lib/og-image";
import { escopoRevendedor } from "@/lib/tenant/scope";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "A loja · Trísion Eyewear";

export default async function Image({ params }: { params: Promise<{ rev: string }> }) {
  const { rev } = await params;
  const escopo = await escopoRevendedor(rev);

  if (!escopo) {
    return gerarOgImage({ kicker: "A loja", titulo: "Trísion Eyewear" });
  }

  const { revendedor } = escopo;
  return gerarOgImage({
    kicker: "A loja",
    titulo: revendedor.nome,
    subtitulo: `${revendedor.cidade} · ${revendedor.uf}`,
  });
}
