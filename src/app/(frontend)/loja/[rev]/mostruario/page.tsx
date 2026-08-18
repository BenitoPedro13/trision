import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FiltroDrawer } from "@/components/produto/filtro-drawer";
import { FiltroToggle } from "@/components/produto/filtro-toggle";
import { Filtros, combina, type FiltrosAtivos } from "@/components/produto/filtros";
import { GradeProdutos } from "@/components/produto/grade-produtos";
import { escopoRevendedor, revendedoresAtivosSlugs } from "@/lib/tenant/scope";
import { metadataDaPagina } from "@/lib/seo";

export async function generateStaticParams() {
  const slugs = await revendedoresAtivosSlugs();
  return slugs.map((rev) => ({ rev }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ rev: string }>;
}): Promise<Metadata> {
  const { rev } = await params;
  const escopo = await escopoRevendedor(rev);
  if (!escopo) {
    return metadataDaPagina({ titulo: "Mostruário", descricao: "Revenda oficial Trísion.", caminho: `/loja/${rev}/mostruario`, indexar: false });
  }

  const { revendedor, itens } = escopo;
  return metadataDaPagina({
    titulo: `Mostruário · ${revendedor.nome}`,
    descricao: `${itens.length} armações Trísion disponíveis na revenda de ${revendedor.nome}, ${revendedor.cidade} · ${revendedor.uf}.`,
    caminho: `/loja/${rev}/mostruario`,
    indexar: false,
  });
}

/* Same `GradeProdutos`/`Filtros`/`FiltroDrawer` as `/catalogo` — spec-design.md §11:
   "the two are the same components with a different tenantId." Only `itens` differs,
   and it comes exclusively from `lib/tenant/scope.ts`. */
export default async function MostruarioPage({
  params,
  searchParams,
}: {
  params: Promise<{ rev: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { rev } = await params;
  const escopo = await escopoRevendedor(rev);
  if (!escopo) notFound();

  const query = await searchParams;
  const ativos: FiltrosAtivos = {
    formato: typeof query.formato === "string" ? query.formato : undefined,
    material: typeof query.material === "string" ? query.material : undefined,
    cor: typeof query.cor === "string" ? query.cor : undefined,
    genero: typeof query.genero === "string" ? query.genero : undefined,
  };

  const { revendedor, itens } = escopo;
  const todos = itens.map((item) => item.produto);
  const formatosDisponiveis = [
    ...new Set(todos.filter((p) => combina(p, ativos, "formato")).map((p) => p.formato)),
  ].sort();
  const materiaisDisponiveis = [
    ...new Set(todos.filter((p) => combina(p, ativos, "material")).map((p) => p.material)),
  ].sort();
  const coresDisponiveis = [
    ...new Set(todos.filter((p) => combina(p, ativos, "cor")).map((p) => p.cor)),
  ].sort();
  const generosDisponiveis = [
    ...new Set(todos.filter((p) => combina(p, ativos, "genero")).map((p) => p.genero)),
  ].sort();
  const basePath = `/loja/${revendedor.slug}/mostruario`;

  const produtos = todos.filter((p) => combina(p, ativos));

  return (
    <>
      <main className="px-[clamp(24px,5vw,88px)] pb-[clamp(64px,10vh,160px)]">
        <div className="mb-10 flex items-center justify-between gap-4">
          <h1 className="text-[clamp(2.25rem,5vw,4rem)] font-semibold tracking-[-0.02em] text-foco">
            Mostruário
          </h1>
          <FiltroToggle ativos={ativos} />
        </div>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
          <aside className="hidden lg:block">
            <Filtros
              basePath={basePath}
              ativos={ativos}
              formatosDisponiveis={formatosDisponiveis}
              materiaisDisponiveis={materiaisDisponiveis}
              coresDisponiveis={coresDisponiveis}
              generosDisponiveis={generosDisponiveis}
            />
          </aside>
          <GradeProdutos produtos={produtos} hrefBase={`/loja/${revendedor.slug}/oculos`} />
        </div>
      </main>
      <FiltroDrawer
        basePath={basePath}
        facetas={todos.map(({ formato, material, cor, genero }) => ({
          formato,
          material,
          cor,
          genero,
        }))}
      />
    </>
  );
}
