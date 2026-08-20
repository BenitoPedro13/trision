import { OG_CONTENT_TYPE, OG_SIZE, gerarOgImage } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Atendimento Exclusivo · Trísion Eyewear";

export default async function Image() {
  return gerarOgImage({
    kicker: "Não é só óculos. É presença.",
    titulo: "Atendimento Exclusivo",
    subtitulo: "Consultoria de imagem e alta precisão técnica até você.",
    rodape: "Rio de Janeiro e Mato Grosso do Sul",
  });
}
