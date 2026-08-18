"use client";

import { useRouter } from "next/navigation";
import { FORMATOS, MATERIAIS, GENEROS } from "./filtros";
import { useFiltroStore } from "./filtro-store";

/* The off-canvas panel `FiltroToggle` opens. Edits are staged in `filtro-store.ts`
   ("pendentes") and only reach the URL — the actual filter source of truth,
   `Filtros` reads it server-side — on "Ver resultados". That staging is the reason
   this needed Zustand instead of pushing straight to the router on every tap: a
   real product pattern (edit several, commit once), not state for its own sake. */
export function FiltroDrawer({
  basePath,
  coresDisponiveis,
}: {
  basePath: string;
  coresDisponiveis: string[];
}) {
  const router = useRouter();
  const { aberto, pendentes, fechar, alternar, limparPendentes } = useFiltroStore();

  if (!aberto) return null;

  const linhas = [
    { rotulo: "Formato", chave: "formato" as const, opcoes: FORMATOS as string[] },
    { rotulo: "Material", chave: "material" as const, opcoes: MATERIAIS as string[] },
    { rotulo: "Cor", chave: "cor" as const, opcoes: coresDisponiveis },
    { rotulo: "Gênero", chave: "genero" as const, opcoes: GENEROS as string[] },
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
    <div className="fixed inset-0 z-40 flex flex-col justify-end lg:hidden">
      <button
        type="button"
        aria-label="Fechar filtros"
        onClick={fechar}
        className="absolute inset-0 bg-vazio/80"
      />
      <div className="relative border-t border-aro bg-noite p-6">
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
        <div className="mt-6 flex gap-3">
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
        </div>
      </div>
    </div>
  );
}
