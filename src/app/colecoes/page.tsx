import type { Metadata } from "next";
import { Ceu } from "@/components/ceu";
import { Cabecalho } from "@/components/marca/cabecalho";
import { ColecaoCard } from "@/components/colecao/colecao-card";
import { VisorCursor } from "@/components/visor-cursor";
import { catalogSourceLocal } from "@/lib/catalog/source.local";

export const metadata: Metadata = { title: "Coleções" };

export default async function ColecoesPage() {
  const colecoes = await catalogSourceLocal.listarColecoes();

  return (
    <>
      <Ceu />
      <VisorCursor />
      <div className="relative z-10">
        <Cabecalho />
        <main className="px-[clamp(24px,5vw,88px)] pb-[clamp(64px,10vh,160px)]">
          <h1 className="mb-10 text-[clamp(2.25rem,5vw,4rem)] font-semibold tracking-[-0.02em] text-foco">
            Coleções
          </h1>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {colecoes.map((colecao) => (
              <ColecaoCard key={colecao.slug} colecao={colecao} />
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
