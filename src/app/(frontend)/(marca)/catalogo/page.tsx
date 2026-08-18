import type { Metadata } from "next";
import { FiltroDrawer } from "@/components/produto/filtro-drawer";
import { FiltroToggle } from "@/components/produto/filtro-toggle";
import { Filtros, combina, type FiltrosAtivos } from "@/components/produto/filtros";
import { GradeProdutos } from "@/components/produto/grade-produtos";
import { catalogSource } from "@/lib/catalog/source";
import { metadataDaPagina } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const produtos = await catalogSource.listarProdutos();
  return metadataDaPagina({
    titulo: "Catálogo",
    descricao: `${produtos.length} armações Trísion — óculos de sol, de grau e clip-on selecionados um a um.`,
    caminho: "/catalogo",
  });
}

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const ativos: FiltrosAtivos = {
    formato: typeof params.formato === "string" ? params.formato : undefined,
    material: typeof params.material === "string" ? params.material : undefined,
    cor: typeof params.cor === "string" ? params.cor : undefined,
    genero: typeof params.genero === "string" ? params.genero : undefined,
  };

  const todos = await catalogSource.listarProdutos();
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

  const produtos = todos.filter((p) => combina(p, ativos));

  return (
    <>
      <main className="px-[clamp(24px,5vw,88px)] pb-[clamp(64px,10vh,160px)]">
        <div className="mb-10 flex items-center justify-between gap-4">
          <h1 className="text-[clamp(2.25rem,5vw,4rem)] font-semibold tracking-[-0.02em] text-foco">
            Catálogo
          </h1>
          <FiltroToggle ativos={ativos} />
        </div>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
          <aside className="hidden lg:block">
            <Filtros
              basePath="/catalogo"
              ativos={ativos}
              formatosDisponiveis={formatosDisponiveis}
              materiaisDisponiveis={materiaisDisponiveis}
              coresDisponiveis={coresDisponiveis}
              generosDisponiveis={generosDisponiveis}
            />
          </aside>
          <GradeProdutos produtos={produtos} />
        </div>
      </main>
      <FiltroDrawer
        basePath="/catalogo"
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
