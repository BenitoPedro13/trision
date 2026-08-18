import { OG_CONTENT_TYPE, OG_SIZE, gerarOgImage } from "@/lib/og-image";
import { SITE } from "@/lib/site-config";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Sobre · Trísion Eyewear";

export default async function Image() {
  return gerarOgImage({
    kicker: `Desde ${SITE.desde}`,
    titulo: "Sobre a Trísion",
    subtitulo: "Óculos escolhidos por quem é obcecada por óculos.",
  });
}
