import Link from "next/link";
import type { FormatoProduto, GeneroProduto, MaterialProduto } from "@/lib/catalog/types";

export const FORMATOS: FormatoProduto[] = [
  "aviador",
  "quadrado",
  "redondo",
  "gatinho",
  "hexagonal",
  "retangular",
];
export const MATERIAIS: MaterialProduto[] = ["acetato", "metal", "TR90", "titânio"];
export const GENEROS: GeneroProduto[] = ["feminino", "masculino", "unissex"];

export interface FiltrosAtivos {
  formato?: string;
  material?: string;
  cor?: string;
  genero?: string;
}

/* Filter chips as plain links (`?formato=aviador`) — no client fetch, no JS required,
   the resulting URL is shareable. Deliberately not a client component: see
   TASK-frontend-fase-0.md §3 for why this reaches for URL state instead of
   TanStack Query or Zustand. */
export function Filtros({
  basePath,
  ativos,
  coresDisponiveis,
}: {
  basePath: string;
  ativos: FiltrosAtivos;
  coresDisponiveis: string[];
}) {
  const linhas: { rotulo: string; chave: keyof FiltrosAtivos; opcoes: string[] }[] = [
    { rotulo: "Formato", chave: "formato", opcoes: FORMATOS },
    { rotulo: "Material", chave: "material", opcoes: MATERIAIS },
    { rotulo: "Cor", chave: "cor", opcoes: coresDisponiveis },
    { rotulo: "Gênero", chave: "genero", opcoes: GENEROS },
  ];

  return (
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
                  const selecionado = ativos[chave] === opcao;
                  const params = new URLSearchParams(
                    Object.entries(ativos).filter(([, v]) => v) as [string, string][],
                  );
                  if (selecionado) params.delete(chave);
                  else params.set(chave, opcao);
                  const query = params.toString();
                  return (
                    <Link
                      key={opcao}
                      href={query ? `${basePath}?${query}` : basePath}
                      data-alvo
                      className={`foco-visor border px-3 py-1.5 text-[.8125rem] capitalize transition-colors ${
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
        <Link href={basePath} data-alvo className="foco-visor self-start text-[.8125rem] text-cinza underline">
          Limpar filtros
        </Link>
      )}
    </div>
  );
}
