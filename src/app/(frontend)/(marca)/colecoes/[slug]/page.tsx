import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GradeProdutos } from "@/components/produto/grade-produtos";
import { Revela } from "@/components/revela";
import { catalogSource } from "@/lib/catalog/source";
import { metadataDaPagina } from "@/lib/seo";

export async function generateStaticParams() {
  const colecoes = await catalogSource.listarColecoes();
  return colecoes.map((colecao) => ({ slug: colecao.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const colecoes = await catalogSource.listarColecoes();
  const colecao = colecoes.find((c) => c.slug === slug);
  if (!colecao) return metadataDaPagina({ titulo: "Coleção", descricao: "Coleção Trísion.", caminho: `/colecoes/${slug}` });

  return metadataDaPagina({
    titulo: colecao.nome,
    descricao: colecao.texto.length > 155 ? `${colecao.texto.slice(0, 154)}…` : colecao.texto,
    caminho: `/colecoes/${slug}`,
    keywords: [colecao.nome, "Trísion", `coleção ${colecao.ano}`],
  });
}

export default async function ColecaoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [colecoes, produtos] = await Promise.all([
    catalogSource.listarColecoes(),
    catalogSource.listarProdutos(),
  ]);
  const colecao = colecoes.find((c) => c.slug === slug);
  if (!colecao) notFound();

  const produtosDaColecao = produtos.filter((p) => p.colecaoSlug === slug);

  return (
    <main className="px-[clamp(24px,5vw,88px)] pb-[clamp(64px,10vh,160px)]">
      <Revela secao>
        <p className="mb-2 font-mono text-[.8125rem] text-cinza">{colecao.ano}</p>
        <h1 className="mb-4 text-[clamp(2.25rem,5vw,4rem)] font-semibold tracking-[-0.02em] text-foco">
          {colecao.nome}
        </h1>
        <p className="mb-12 max-w-[60ch] text-[1.0625rem] leading-relaxed text-luz">
          {colecao.texto}
        </p>
      </Revela>
      <GradeProdutos produtos={produtosDaColecao} />
    </main>
  );
}
