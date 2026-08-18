import { OG_CONTENT_TYPE, OG_SIZE, gerarOgImage } from "@/lib/og-image";
import { revendedoresAtivos } from "@/lib/tenant/scope";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Revendedores · Trísion Eyewear";

export default async function Image() {
  const revendedores = await revendedoresAtivos();
  return gerarOgImage({
    kicker: "Revendedores",
    titulo: "Encontre uma revenda oficial",
    subtitulo: `${revendedores.length} revendas, escolhidas armação a armação.`,
  });
}
