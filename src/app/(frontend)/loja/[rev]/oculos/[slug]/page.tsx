import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BotaoWhatsApp } from "@/components/produto/botao-whatsapp";
import { FichaTecnica } from "@/components/produto/ficha-tecnica";
import { GaleriaProduto } from "@/components/produto/galeria-produto";
import { Revela } from "@/components/revela";
import { marca } from "@/content/marca";
import { escopoRevendedor, revendedoresAtivos } from "@/lib/tenant/scope";
import { metadataDaPagina } from "@/lib/seo";
import { produtoJsonLd } from "@/lib/structured-data";
import { formatarNumeracao } from "@/lib/numeracao";

/* Same product page as `/oculos/[slug]`, but tenant-scoped (spec-design.md §11:
   "the two are the same components with a different tenantId") and attributed:
   the WhatsApp message names this shop (spec-architecture.md §7.3's sentence half,
   minus the `/ir/` codigo — that redirect needs the Fase 1 `leads` collection,
   TASK-loja-oculos-slug.md §2.3). A sku not in this reseller's mostruário 404s
   here even if it exists in the brand catalogue — the same boundary
   `/loja/[rev]/mostruario` already enforces, applied to one product. */
export async function generateStaticParams() {
  const revendedores = await revendedoresAtivos();
  const params: { rev: string; slug: string }[] = [];
  for (const revendedor of revendedores) {
    const escopo = await escopoRevendedor(revendedor.slug);
    if (!escopo) continue;
    for (const item of escopo.itens) {
      params.push({ rev: revendedor.slug, slug: item.produto.sku });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ rev: string; slug: string }>;
}): Promise<Metadata> {
  const { rev, slug } = await params;
  const escopo = await escopoRevendedor(rev);
  const item = escopo?.itens.find((i) => i.produto.sku === slug);
  if (!escopo || !item) {
    return metadataDaPagina({ titulo: "Óculos", descricao: "Óculos Trísion.", caminho: `/loja/${rev}/oculos/${slug}`, indexar: false });
  }

  const { produto } = item;
  const { revendedor } = escopo;
  const numeracao = formatarNumeracao(produto.medidas);
  return metadataDaPagina({
    titulo: `${produto.nome} · ${revendedor.nome}`,
    descricao: `${produto.categoria} · ${produto.formato} · ${produto.material} · ${produto.cor}${numeracao ? ` · ${numeracao}` : ""}. Disponível na revenda oficial ${revendedor.nome}, ${revendedor.cidade} · ${revendedor.uf}.`,
    caminho: `/loja/${rev}/oculos/${slug}`,
    indexar: false,
  });
}

export default async function ProdutoLojaPage({
  params,
}: {
  params: Promise<{ rev: string; slug: string }>;
}) {
  const { rev, slug } = await params;
  const escopo = await escopoRevendedor(rev);
  if (!escopo) notFound();

  const { revendedor, itens } = escopo;
  const item = itens.find((i) => i.produto.sku === slug);
  if (!item) notFound();

  const { produto } = item;

  return (
    <main className="px-[clamp(24px,5vw,88px)] pb-[clamp(64px,10vh,160px)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(produtoJsonLd(produto)).replace(/</g, "\\u003c"),
        }}
      />
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <GaleriaProduto produto={produto} />
        <Revela secao className="flex flex-col gap-6">
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
              revendedorNome: revendedor.nome,
              cidade: revendedor.cidade,
              uf: revendedor.uf,
              produtoNome: produto.nome,
              categoria: produto.categoria,
              material: produto.material,
              cor: produto.cor,
              medidas: produto.medidas,
            }}
          />
        </Revela>
      </div>
    </main>
  );
}
