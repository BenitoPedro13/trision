import type { MostruarioItem } from "@/lib/catalog/types";

/** Mock join rows — each `exemplo` reseller carries at least one product so `/loja/[slug]`
 * is not a dead end from `/revendedores`. SKUs reuse `content/produtos.ts`. */
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
  {
    revendedorSlug: "otica-demonstracao",
    produtoSku: "TRI-MOD-C",
    disponivel: true,
    destaque: true,
    ordem: 1,
  },
  {
    revendedorSlug: "loja-exemplo",
    produtoSku: "TRI-MOD-A",
    disponivel: true,
    destaque: true,
    ordem: 1,
  },
] as const satisfies readonly MostruarioItem[];
