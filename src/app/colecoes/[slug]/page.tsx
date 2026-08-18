import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Ceu } from "@/components/ceu";
import { Cabecalho } from "@/components/marca/cabecalho";
import { GradeProdutos } from "@/components/produto/grade-produtos";
import { VisorCursor } from "@/components/visor-cursor";
import { catalogSourceLocal } from "@/lib/catalog/source.local";

export async function generateStaticParams() {
  const colecoes = await catalogSourceLocal.listarColecoes();
  return colecoes.map((colecao) => ({ slug: colecao.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const colecoes = await catalogSourceLocal.listarColecoes();
  const colecao = colecoes.find((c) => c.slug === slug);
  return { title: colecao?.nome ?? "Coleção" };
}

export default async function ColecaoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [colecoes, produtos] = await Promise.all([
    catalogSourceLocal.listarColecoes(),
    catalogSourceLocal.listarProdutos(),
  ]);
  const colecao = colecoes.find((c) => c.slug === slug);
  if (!colecao) notFound();

  const produtosDaColecao = produtos.filter((p) => p.colecaoSlug === slug);

  return (
    <>
      <Ceu />
      <VisorCursor />
      <div className="relative z-10">
        <Cabecalho />
        <main className="px-[clamp(24px,5vw,88px)] pb-[clamp(64px,10vh,160px)]">
          <p className="mb-2 font-mono text-[.8125rem] text-cinza">{colecao.ano}</p>
          <h1 className="mb-4 text-[clamp(2.25rem,5vw,4rem)] font-semibold tracking-[-0.02em] text-foco">
            {colecao.nome}
          </h1>
          <p className="mb-12 max-w-[60ch] text-[1.0625rem] leading-relaxed text-luz">
            {colecao.texto}
          </p>
          <GradeProdutos produtos={produtosDaColecao} />
        </main>
      </div>
    </>
  );
}
