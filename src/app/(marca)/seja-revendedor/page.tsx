import type { Metadata } from "next";
import { BotaoWhatsApp } from "@/components/produto/botao-whatsapp";
import { Revela } from "@/components/revela";
import { marca } from "@/content/marca";

export const metadata: Metadata = { title: "Seja revendedor" };

export default function SejaRevendedorPage() {
  return (
    <main className="px-[clamp(24px,5vw,88px)] pb-[clamp(64px,10vh,160px)]">
      <Revela secao className="mx-auto flex max-w-[52ch] flex-col gap-8">
        <div>
          <p className="mb-3 font-mono text-[.6875rem] uppercase tracking-[.16em] text-ouro">
            Desde {marca.desde}
          </p>
          <h1 className="text-[clamp(2.25rem,5vw,4rem)] font-semibold tracking-[-0.02em] text-foco">
            Seja revendedor
          </h1>
        </div>
        <p className="text-[1.0625rem] leading-relaxed text-luz">
          A Trísion trabalha com uma linha curada — não o catálogo mais largo, a certa.
          Cada armação passa por uma escolha antes de entrar na rede.
        </p>
        <p className="text-[1.0625rem] leading-relaxed text-luz">
          Fale comigo para conhecer a linha e a rede de revendas oficiais.
        </p>
        <BotaoWhatsApp
          dados={{
            numero: marca.whatsapp,
            assunto: "Quero saber mais sobre revender a Trísion.",
          }}
        />
      </Revela>
    </main>
  );
}
