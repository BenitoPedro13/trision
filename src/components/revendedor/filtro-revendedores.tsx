import Link from "next/link";

export interface FiltrosRevendedoresAtivos {
  cidade?: string;
  uf?: string;
}

/* City/UF filter chips as plain links (`?cidade=São Paulo`) — same idiom as
   `components/produto/filtros.tsx`: no client fetch, shareable URL. UF renders above
   Cidade because it drives it: the page scopes `cidadesDisponiveis` to the active UF,
   and selecting a new UF chip here drops any active `cidade` — it may not belong to
   the newly selected UF. See TASK-loja-identidade-e-busca-revendedores.md §2.5. */
export function FiltroRevendedores({
  basePath,
  ativos,
  cidadesDisponiveis,
  ufsDisponiveis,
}: {
  basePath: string;
  ativos: FiltrosRevendedoresAtivos;
  cidadesDisponiveis: string[];
  ufsDisponiveis: string[];
}) {
  const linhas: {
    rotulo: string;
    chave: keyof FiltrosRevendedoresAtivos;
    opcoes: string[];
  }[] = [
    { rotulo: "UF", chave: "uf", opcoes: ufsDisponiveis },
    { rotulo: "Cidade", chave: "cidade", opcoes: cidadesDisponiveis },
  ];

  return (
    <div className="mb-10 flex flex-col gap-5">
      {linhas.map(
        ({ rotulo, chave, opcoes }) =>
          opcoes.length > 0 && (
            <div key={chave}>
              <p className="mb-2 font-mono text-[.6875rem] uppercase tracking-[.16em] text-cinza">
                {rotulo}
              </p>
              <div className="flex flex-wrap gap-2">
                {opcoes.map((opcao) => {
                  const selecionado = ativos[chave] === opcao;
                  const params = new URLSearchParams(
                    Object.entries(ativos).filter(([, v]) => v) as [string, string][],
                  );
                  if (selecionado) {
                    params.delete(chave);
                  } else {
                    params.set(chave, opcao);
                    // Picking a new UF may invalidate the active Cidade (it might
                    // belong to a different UF) — drop it rather than risk a
                    // cidade+uf combination that matches nothing.
                    if (chave === "uf") params.delete("cidade");
                  }
                  const query = params.toString();
                  return (
                    <Link
                      key={opcao}
                      href={query ? `${basePath}?${query}` : basePath}
                      data-alvo
                      className={`foco-visor border px-3 py-1.5 text-[.8125rem] transition-colors ${
                        selecionado
                          ? "border-ouro text-ouro"
                          : "border-aro text-prata hover:border-prata"
                      }`}
                    >
                      {opcao}
                    </Link>
                  );
                })}
              </div>
            </div>
          ),
      )}
      {Object.values(ativos).some(Boolean) && (
        <Link
          href={basePath}
          data-alvo
          className="foco-visor self-start text-[.8125rem] text-cinza underline"
        >
          Limpar filtros
        </Link>
      )}
    </div>
  );
}
