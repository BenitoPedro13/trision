import type { Metadata } from "next";
import { BotaoWhatsApp } from "@/components/produto/botao-whatsapp";
import { Revela } from "@/components/revela";
import { marca } from "@/content/marca";
import { metadataDaPagina } from "@/lib/seo";

export const metadata: Metadata = metadataDaPagina({
  titulo: "Sobre",
  descricao: `A Trísion trabalha com uma linha curada há ${new Date().getFullYear() - marca.desde} anos — não o catálogo mais largo, a certa. Um olho de óptico, não a pose de uma boutique.`,
  caminho: "/sobre",
});

export default function SobrePage() {
  return (
    <main className="px-[clamp(24px,5vw,88px)] pb-[clamp(64px,10vh,160px)]">
      <Revela secao className="mx-auto flex max-w-[52ch] flex-col gap-8">
        <div>
          <p className="mb-3 font-mono text-[.6875rem] uppercase tracking-[.16em] text-ouro">
            Desde {marca.desde}
          </p>
          <h1 className="text-[clamp(2.25rem,5vw,4rem)] font-semibold tracking-[-0.02em] text-foco">
            Sobre
          </h1>
        </div>
        <p className="text-[1.0625rem] leading-relaxed text-luz">
          A Trísion trabalha com uma linha curada há {new Date().getFullYear() - marca.desde}{" "}
          anos — não o catálogo mais largo, a certa. Cada armação passa por uma escolha
          antes de entrar na rede: um olho de óptico, não a pose de uma boutique.
        </p>
        <p className="font-mono text-[.9375rem] tracking-[.02em] text-ouro">
          Eyewear Addict ❤
        </p>
        <div className="rounded-[var(--radius-lente)] border border-aro bg-lente px-6 py-8">
          <p className="mb-2 font-mono text-[.6875rem] uppercase tracking-[.16em] text-lente-tinta">
            Verificar
          </p>
          <p className="text-[.9375rem] leading-relaxed text-lente-tinta">
            Esta página ainda não traz o nome completo de Amanda, a história em suas
            próprias palavras, nem confirmação de que o retrato descrito em
            spec-brand.md §1.4 pode ser usado aqui. Nenhum desses fatos foi inventado —
            eles aguardam confirmação dela.
          </p>
        </div>
        <BotaoWhatsApp
          dados={{
            numero: marca.whatsapp,
            assunto: "Quero saber mais sobre a Trísion.",
          }}
        />
      </Revela>
    </main>
  );
}
