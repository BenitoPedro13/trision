import type { Metadata } from "next";
import { BotaoWhatsApp } from "@/components/produto/botao-whatsapp";
import { Revela } from "@/components/revela";
import { marca } from "@/content/marca";
import { metadataDaPagina } from "@/lib/seo";
import { atendimentoExclusivoJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = metadataDaPagina({
  titulo: "Atendimento Exclusivo",
  descricao:
    "Não é só óculos. É presença. Consultoria de imagem e alta precisão técnica até você, no Rio de Janeiro e em Mato Grosso do Sul — sem filas, sem pressa, no seu tempo.",
  caminho: "/atendimento-exclusivo",
});

const PASSOS = [
  {
    titulo: "Análise de Rotina",
    texto:
      "Avaliamos suas necessidades visuais e tecnologias de lentes (como multifocais de última geração) para garantir o melhor custo-benefício e conforto.",
  },
  {
    titulo: "Visita Técnica e Estética",
    texto:
      "Vamos até você com uma seleção exclusiva de armações. Realizamos uma consultoria de imagem para entender seu estilo e desejo de imagem.",
  },
  {
    titulo: "Entrega e Suporte Vitalício",
    texto:
      "Você recebe seus óculos e conta com assistência técnica e suporte para manutenções sem custo adicional, independentemente do tempo de uso.",
  },
];

const PARA_VOCE = [
  {
    titulo: "Busca Praticidade",
    texto: "Não tem tempo a perder e prefere atendimento com hora marcada em casa ou no escritório.",
  },
  {
    titulo: "Valoriza Estética",
    texto: "Quer óculos que realmente combinem com sua personalidade e imagem profissional.",
  },
  {
    titulo: "Exige Precisão",
    texto: "Precisa de lentes multifocais complexas e não quer errar na adaptação.",
  },
  {
    titulo: "Deseja Segurança",
    texto: "Valoriza uma empresa com mais de duas décadas de expertise e suporte contínuo.",
  },
];

/* Content ported from sitetrision.my.canva.site/atendimento-exclusivo (read in a real
   browser 2026-08-20 — the page is client-rendered, a plain fetch only sees the shell),
   in Amanda's own words. Testimonials and the "Olhar como assinatura" editorial
   paragraph are deliberately left out — see TASK-atendimento-exclusivo.md §3: they're
   someone else's quoted words and a second, looser telling of facts already stated more
   precisely on /sobre, not confirmed for reuse here. */
export default function AtendimentoExclusivoPage() {
  return (
    <main className="px-[clamp(24px,5vw,88px)] pb-[clamp(64px,10vh,160px)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(atendimentoExclusivoJsonLd()).replace(/</g, "\\u003c"),
        }}
      />
      <Revela secao className="mx-auto flex max-w-[52ch] flex-col gap-8">
        <div>
          <p className="mb-3 font-mono text-[.6875rem] uppercase tracking-[.16em] text-ouro">
            Não é só óculos. É presença.
          </p>
          <h1 className="text-[clamp(2.25rem,5vw,4rem)] font-semibold tracking-[-0.02em] text-foco">
            Atendimento Exclusivo
          </h1>
        </div>
        <p className="text-[1.0625rem] leading-relaxed text-luz">
          A primeira ótica boutique que leva consultoria de imagem e alta precisão técnica
          até você. Sem filas, sem pressa, no seu tempo.
        </p>

        <div>
          <p className="mb-4 font-mono text-[.6875rem] uppercase tracking-[.16em] text-cinza">
            A experiência Trísion em 3 passos
          </p>
          <ol className="flex flex-col gap-6">
            {PASSOS.map((passo, i) => (
              <li key={passo.titulo} className="flex gap-4">
                <span className="font-mono text-[.9375rem] text-ouro">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-semibold text-foco">{passo.titulo}</p>
                  <p className="mt-1 text-[.9375rem] leading-relaxed text-luz">{passo.texto}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <p className="mb-4 font-mono text-[.6875rem] uppercase tracking-[.16em] text-cinza">
            Soluções sob medida para você que
          </p>
          <ul className="flex flex-col gap-4">
            {PARA_VOCE.map((item) => (
              <li key={item.titulo}>
                <p className="font-semibold text-foco">{item.titulo}</p>
                <p className="mt-1 text-[.9375rem] leading-relaxed text-luz">{item.texto}</p>
              </li>
            ))}
          </ul>
        </div>

        <p className="font-mono text-[.9375rem] tracking-[.02em] text-ouro">
          Atendemos no Rio de Janeiro e em Mato Grosso do Sul.
        </p>

        <div className="rounded-[var(--radius-lente)] border border-aro bg-lente px-6 py-8">
          <p className="mb-2 font-mono text-[.6875rem] uppercase tracking-[.16em] text-lente-tinta">
            Verificar
          </p>
          <p className="text-[.9375rem] leading-relaxed text-lente-tinta">
            Depoimentos de clientes existem na página atual, com nome completo — ainda não
            confirmado com Amanda se podem ser reaproveitados aqui. Nada foi inventado; eles
            aguardam a confirmação dela.
          </p>
        </div>

        <BotaoWhatsApp
          dados={{
            numero: marca.whatsapp,
            assunto: "Quero agendar meu Atendimento Exclusivo.",
          }}
        />
      </Revela>
    </main>
  );
}
