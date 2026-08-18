"use client";

import type { FiltrosAtivos } from "./filtros";
import { useFiltroStore } from "./filtro-store";

/* The mobile trigger — a toolbar badge showing how many filters are applied. Lives
   apart from `FiltroDrawer` in the component tree, so the two share state through
   `filtro-store.ts` rather than a Context provider (see that file's comment). */
export function FiltroToggle({ ativos }: { ativos: FiltrosAtivos }) {
  const abrir = useFiltroStore((estado) => estado.abrir);
  const contagem = Object.values(ativos).filter(Boolean).length;

  return (
    <button
      type="button"
      data-alvo
      onClick={() => abrir(ativos)}
      className="foco-visor flex items-center gap-2 border border-aro px-4 py-2 text-[.8125rem] text-luz lg:hidden"
    >
      Filtros{contagem > 0 && ` (${contagem})`}
    </button>
  );
}
