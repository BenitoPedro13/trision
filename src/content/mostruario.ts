import type { MostruarioItem } from "@/lib/catalog/types";

/** Mock join rows: `otica-exemplo` carries `Modelo A` and `Modelo B`, deliberately not
 * `Modelo C` — so `/loja/otica-exemplo` visibly shows "only what this shop carries"
 * (`spec-design.md` §11) instead of mirroring `/catalogo` 1:1. */
export const mostruario = [
  {
    revendedorSlug: "otica-exemplo",
    produtoSku: "TRI-MOD-A",
    disponivel: true,
    destaque: true,
    ordem: 1,
  },
  {
    revendedorSlug: "otica-exemplo",
    produtoSku: "TRI-MOD-B",
    disponivel: true,
    destaque: false,
    ordem: 2,
    observacao: "só na cor dourada",
  },
] as const satisfies readonly MostruarioItem[];
