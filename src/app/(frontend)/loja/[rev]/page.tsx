import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FiltroDrawer } from "@/components/produto/filtro-drawer";
import { FiltroToggle } from "@/components/produto/filtro-toggle";
import { Filtros, combina, type FiltrosAtivos } from "@/components/produto/filtros";
import { GradeProdutos } from "@/components/produto/grade-produtos";
import { Revela } from "@/components/revela";
import { escopoRevendedor, revendedoresAtivosSlugs } from "@/lib/tenant/scope";
import { metadataDaPagina } from "@/lib/seo";

/* Fase 0 path shape — see TASK-frontend-fase-0.md §2.4. `<slug>.trision.com.br/` is
   the real target once the domain and `middleware.ts` exist; this route is very
   likely deleted, not evolved, when that lands.

   Shows the full active catalogue — same as `/catalogo` — under this reseller's
   endorsement (`TASK-catalogo-unico-sem-mostruario.md`). There is no per-reseller
   selection left; the storefront exists for endorsement and lead attribution. */
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
    return metadataDaPagina({ titulo: "Loja", descricao: "Revenda oficial Trísion.", caminho: `/loja/${rev}`, indexar: false });
  }

  const { revendedor, produtos } = escopo;
  return metadataDaPagina({
    titulo: revendedor.nome,
    descricao: `Revenda oficial Trísion em ${revendedor.cidade} · ${revendedor.uf}. ${produtos.length} armações Trísion. ${revendedor.sobre}`,
    caminho: `/loja/${rev}`,
    indexar: false,
  });
}

export default async function LojaPage({
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

  const { revendedor, produtos: todos } = escopo;
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
  const basePath = `/loja/${revendedor.slug}`;

  const produtos = todos.filter((p) => combina(p, ativos));

  return (
    <>
      <main className="px-[clamp(24px,5vw,88px)] pb-[clamp(64px,10vh,160px)]">
        <Revela secao>
          <p className="mb-10 max-w-[60ch] text-[1.0625rem] leading-relaxed text-luz">
            {revendedor.sobre}
          </p>
        </Revela>
        <div className="mb-10 flex items-center justify-between gap-4">
          <h1 className="text-[clamp(2.25rem,5vw,4rem)] font-semibold tracking-[-0.02em] text-foco">
            Catálogo
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
