"use client";

import { useRouter } from "next/navigation";
import * as Drawer from "@/components/ui/drawer";
import { combina, type FacetaProduto } from "./filtros";
import { useFiltroStore } from "./filtro-store";

/* The off-canvas panel `FiltroToggle` opens. Edits are staged in `filtro-store.ts`
   ("pendentes") and only reach the URL — the actual filter source of truth,
   `Filtros` reads it server-side — on "Ver resultados". That staging is the reason
   this needed Zustand instead of pushing straight to the router on every tap: a
   real product pattern (edit several, commit once), not state for its own sake.

   Overlay chrome is AlignUI `Drawer` (Radix Dialog): focus trap + Escape-to-close.
   Filter chip markup inside is unchanged — brand-owned selection state.

   Option lists narrow live, against `pendentes` — not just on "Ver resultados" — using
   the same `combina()` the server pages apply to `ativos` (TASK-filtros-facetados-
   catalogo.md §2.3b), so a chip never offers a combination that returns zero products
   even mid-edit. `facetas` ships only the four filterable fields per product, not the
   full `Produto` (photos, sku, price…), to keep the client payload small. */
export function FiltroDrawer({
  basePath,
  facetas,
}: {
  basePath: string;
  facetas: FacetaProduto[];
}) {
  const router = useRouter();
  const { aberto, pendentes, fechar, alternar, limparPendentes } = useFiltroStore();

  const linhas = [
    {
      rotulo: "Formato",
      chave: "formato" as const,
      opcoes: [
        ...new Set(facetas.filter((f) => combina(f, pendentes, "formato")).map((f) => f.formato)),
      ].sort(),
    },
    {
      rotulo: "Material",
      chave: "material" as const,
      opcoes: [
        ...new Set(
          facetas.filter((f) => combina(f, pendentes, "material")).map((f) => f.material),
        ),
      ].sort(),
    },
    {
      rotulo: "Cor",
      chave: "cor" as const,
      opcoes: [
        ...new Set(facetas.filter((f) => combina(f, pendentes, "cor")).map((f) => f.cor)),
      ].sort(),
    },
    {
      rotulo: "Gênero",
      chave: "genero" as const,
      opcoes: [
        ...new Set(facetas.filter((f) => combina(f, pendentes, "genero")).map((f) => f.genero)),
      ].sort(),
    },
  ];

  const aplicar = () => {
    const params = new URLSearchParams(
      Object.entries(pendentes).filter(([, v]) => v) as [string, string][],
    );
    const query = params.toString();
    router.push(query ? `${basePath}?${query}` : basePath);
    fechar();
  };

  return (
    <Drawer.Root
      open={aberto}
      onOpenChange={(open) => {
        if (!open) fechar();
      }}
    >
      <Drawer.Content className="lg:hidden">
        <Drawer.Header className="border-b border-stroke-soft-200">
          <Drawer.Title>Filtros</Drawer.Title>
        </Drawer.Header>

        <Drawer.Body className="p-6">
          <div className="flex flex-col gap-5">
            {linhas.map(
              ({ rotulo, chave, opcoes }) =>
                opcoes.length > 0 && (
                  <div key={chave}>
                    <p className="mb-2 font-mono text-[.6875rem] uppercase tracking-[.16em] text-cinza">
                      {rotulo}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {opcoes.map((opcao) => {
                        const selecionado = pendentes[chave] === opcao;
                        return (
                          <button
                            key={opcao}
                            type="button"
                            data-alvo
                            onClick={() => alternar(chave, opcao)}
                            className={`foco-visor border px-3 py-1.5 text-[.8125rem] capitalize transition-colors ${
                              selecionado
                                ? "border-ouro text-ouro"
                                : "border-aro text-prata hover:border-prata"
                            }`}
                          >
                            {opcao}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ),
            )}
          </div>
        </Drawer.Body>

        <Drawer.Footer className="border-t border-stroke-soft-200">
          <button
            type="button"
            data-alvo
            onClick={limparPendentes}
            className="foco-visor border border-aro px-4 py-2.5 text-[.8125rem] text-prata"
          >
            Limpar
          </button>
          <button
            type="button"
            data-alvo
            onClick={aplicar}
            className="foco-visor flex-1 bg-ouro px-4 py-2.5 text-[.8125rem] font-medium text-noite"
          >
            Ver resultados
          </button>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer.Root>
  );
}
