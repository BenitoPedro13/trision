import type { Metadata } from "next";
import { ColecaoCard } from "@/components/colecao/colecao-card";
import { Revela } from "@/components/revela";
import { catalogSourceLocal } from "@/lib/catalog/source.local";
import { metadataDaPagina } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const colecoes = await catalogSourceLocal.listarColecoes();
  return metadataDaPagina({
    titulo: "Coleções",
    descricao: `${colecoes.length} coleções Trísion — uma armação é uma decisão sobre o que você olha.`,
    caminho: "/colecoes",
  });
}

export default async function ColecoesPage() {
  const colecoes = await catalogSourceLocal.listarColecoes();

  return (
    <main className="px-[clamp(24px,5vw,88px)] pb-[clamp(64px,10vh,160px)]">
      <Revela secao>
        <h1 className="mb-10 text-[clamp(2.25rem,5vw,4rem)] font-semibold tracking-[-0.02em] text-foco">
          Coleções
        </h1>
      </Revela>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {colecoes.map((colecao, i) => (
          <Revela key={colecao.slug} atraso={Math.min(i * 0.08, 0.56)}>
            <ColecaoCard colecao={colecao} />
          </Revela>
        ))}
      </div>
    </main>
  );
}
