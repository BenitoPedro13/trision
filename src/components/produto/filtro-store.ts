import { create } from "zustand";
import type { FiltrosAtivos } from "./filtros";

interface FiltroDrawerState {
  aberto: boolean;
  pendentes: FiltrosAtivos;
  abrir: (atuais: FiltrosAtivos) => void;
  fechar: () => void;
  alternar: (chave: keyof FiltrosAtivos, valor: string) => void;
  limparPendentes: () => void;
}

/* Client-only ephemeral UI state — "is the mobile filter drawer open, what's staged
   before Apply" — shared between `FiltroToggle` (a badge in the toolbar) and
   `FiltroDrawer` (an off-canvas panel), which are siblings, not parent/child. A plain
   `create()` is correct here (no provider, no per-request factory): this store is
   never seeded from server data and never touched during SSR, unlike the pattern in
   Zustand's own Next.js guide, which exists for stores whose *initial* state comes
   from a request. See TASK-frontend-fase-0.md §3. */
export const useFiltroStore = create<FiltroDrawerState>((set) => ({
  aberto: false,
  pendentes: {},
  abrir: (atuais) => set({ aberto: true, pendentes: atuais }),
  fechar: () => set({ aberto: false }),
  alternar: (chave, valor) =>
    set((estado) => ({
      pendentes: {
        ...estado.pendentes,
        [chave]: estado.pendentes[chave] === valor ? undefined : valor,
      },
    })),
  limparPendentes: () => set({ pendentes: {} }),
}));
