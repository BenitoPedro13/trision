import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Ceu } from "@/components/ceu";
import { Cabecalho } from "@/components/marca/cabecalho";
import { BotaoWhatsApp } from "@/components/produto/botao-whatsapp";
import { FichaTecnica } from "@/components/produto/ficha-tecnica";
import { GaleriaProduto } from "@/components/produto/galeria-produto";
import { OndeComprar } from "@/components/produto/onde-comprar";
import { VisorCursor } from "@/components/visor-cursor";
import { catalogSourceLocal } from "@/lib/catalog/source.local";
import { marca } from "@/content/marca";

/* Route is `/oculos/[slug]` per spec-design.md §11, but the param actually matches
   on `Produto.sku` (the catalogue key shown to customers, `spec-architecture.md`
   §5.1) — there is no separate slug field on `Produto`. */
export async function generateStaticParams() {
  const produtos = await catalogSourceLocal.listarProdutos();
  return produtos.map((produto) => ({ slug: produto.sku }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const produto = await catalogSourceLocal.buscarProdutoPorSku(slug);
  return { title: produto?.nome ?? "Óculos" };
}

export default async function ProdutoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const produto = await catalogSourceLocal.buscarProdutoPorSku(slug);
  if (!produto) notFound();

  return (
    <>
      <Ceu />
      <VisorCursor />
      <div className="relative z-10">
        <Cabecalho />
        <main className="px-[clamp(24px,5vw,88px)] pb-[clamp(64px,10vh,160px)]">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
            <GaleriaProduto produto={produto} />
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold tracking-[-0.02em] text-foco">
                  {produto.nome}
                </h1>
                <p className="mt-1 font-mono text-[.8125rem] text-cinza">{produto.sku}</p>
                {produto.exemplo && (
                  <p className="mt-2 font-mono text-[.6875rem] uppercase tracking-[.16em] text-cinza">
                    exemplo — não faz parte do catálogo real da Trísion
                  </p>
                )}
              </div>
              <p className="text-[1.0625rem] leading-relaxed text-luz">{produto.descricao}</p>
              <p className="font-mono text-lg text-luz">
                {produto.precoSugerido != null
                  ? `R$ ${produto.precoSugerido.toLocaleString("pt-BR")}`
                  : "Consulte o valor"}
              </p>
              <FichaTecnica produto={produto} />
              <BotaoWhatsApp
                dados={{
                  numero: marca.whatsapp,
                  produtoNome: produto.nome,
                  categoria: produto.categoria,
                  material: produto.material,
                  cor: produto.cor,
                  medidas: produto.medidas,
                }}
              />
              <OndeComprar sku={produto.sku} />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
