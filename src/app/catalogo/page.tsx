import type { Metadata } from "next";
import { Ceu } from "@/components/ceu";
import { Cabecalho } from "@/components/marca/cabecalho";
import { FiltroDrawer } from "@/components/produto/filtro-drawer";
import { FiltroToggle } from "@/components/produto/filtro-toggle";
import { Filtros, type FiltrosAtivos } from "@/components/produto/filtros";
import { GradeProdutos } from "@/components/produto/grade-produtos";
import { VisorCursor } from "@/components/visor-cursor";
import { catalogSourceLocal } from "@/lib/catalog/source.local";

export const metadata: Metadata = { title: "Catálogo" };

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

  const todos = await catalogSourceLocal.listarProdutos();
  const coresDisponiveis = [...new Set(todos.map((p) => p.cor))].sort();

  const produtos = todos.filter(
    (p) =>
      (!ativos.formato || p.formato === ativos.formato) &&
      (!ativos.material || p.material === ativos.material) &&
      (!ativos.cor || p.cor === ativos.cor) &&
      (!ativos.genero || p.genero === ativos.genero),
  );

  return (
    <>
      <Ceu />
      <VisorCursor />
      <div className="relative z-10">
        <Cabecalho />
        <main className="px-[clamp(24px,5vw,88px)] pb-[clamp(64px,10vh,160px)]">
          <div className="mb-10 flex items-center justify-between gap-4">
            <h1 className="text-[clamp(2.25rem,5vw,4rem)] font-semibold tracking-[-0.02em] text-foco">
              Catálogo
            </h1>
            <FiltroToggle ativos={ativos} />
          </div>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
            <aside className="hidden lg:block">
              <Filtros basePath="/catalogo" ativos={ativos} coresDisponiveis={coresDisponiveis} />
            </aside>
            <GradeProdutos produtos={produtos} />
          </div>
        </main>
      </div>
      <FiltroDrawer basePath="/catalogo" coresDisponiveis={coresDisponiveis} />
    </>
  );
}
