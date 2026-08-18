import type { MostruarioItem } from "@/lib/catalog/types";

/** Mock join rows — each active `exemplo` reseller carries products so `/loja/[slug]`
 * is not a dead end from `/revendedores`. SKUs reuse `content/produtos.ts`. */
export const mostruario = [
  /* otica-exemplo — flagship demo shop */
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
    revendedorSlug: "otica-exemplo",
    produtoSku: "TRI-EX-04",
    disponivel: true,
    destaque: false,
    ordem: 3,
  },
  {
    revendedorSlug: "otica-exemplo",
    produtoSku: "TRI-EX-05",
    disponivel: true,
    destaque: true,
    ordem: 4,
  },
  {
    revendedorSlug: "otica-exemplo",
    produtoSku: "TRI-EX-06",
    disponivel: false,
    destaque: false,
    ordem: 5,
    observacao: "indisponível no momento — teste de disponível",
  },
  /* otica-demonstracao */
  {
    revendedorSlug: "otica-demonstracao",
    produtoSku: "TRI-MOD-C",
    disponivel: true,
    destaque: true,
    ordem: 1,
  },
  {
    revendedorSlug: "otica-demonstracao",
    produtoSku: "TRI-EX-07",
    disponivel: true,
    destaque: false,
    ordem: 2,
  },
  {
    revendedorSlug: "otica-demonstracao",
    produtoSku: "TRI-EX-08",
    disponivel: true,
    destaque: false,
    ordem: 3,
  },
  {
    revendedorSlug: "otica-demonstracao",
    produtoSku: "TRI-EX-09",
    disponivel: true,
    destaque: true,
    ordem: 4,
  },
  /* loja-exemplo */
  {
    revendedorSlug: "loja-exemplo",
    produtoSku: "TRI-MOD-A",
    disponivel: true,
    destaque: true,
    ordem: 1,
  },
  {
    revendedorSlug: "loja-exemplo",
    produtoSku: "TRI-EX-10",
    disponivel: true,
    destaque: false,
    ordem: 2,
  },
  {
    revendedorSlug: "loja-exemplo",
    produtoSku: "TRI-EX-11",
    disponivel: true,
    destaque: false,
    ordem: 3,
  },
  {
    revendedorSlug: "loja-exemplo",
    produtoSku: "TRI-EX-12",
    disponivel: true,
    destaque: true,
    ordem: 4,
  },
  /* otica-vidro-exemplo */
  {
    revendedorSlug: "otica-vidro-exemplo",
    produtoSku: "TRI-EX-04",
    disponivel: true,
    destaque: true,
    ordem: 1,
  },
  {
    revendedorSlug: "otica-vidro-exemplo",
    produtoSku: "TRI-EX-08",
    disponivel: true,
    destaque: false,
    ordem: 2,
  },
  {
    revendedorSlug: "otica-vidro-exemplo",
    produtoSku: "TRI-EX-13",
    disponivel: true,
    destaque: false,
    ordem: 3,
  },
  /* visao-centro-exemplo */
  {
    revendedorSlug: "visao-centro-exemplo",
    produtoSku: "TRI-MOD-B",
    disponivel: true,
    destaque: true,
    ordem: 1,
  },
  {
    revendedorSlug: "visao-centro-exemplo",
    produtoSku: "TRI-EX-05",
    disponivel: true,
    destaque: false,
    ordem: 2,
  },
  {
    revendedorSlug: "visao-centro-exemplo",
    produtoSku: "TRI-EX-14",
    disponivel: true,
    destaque: false,
    ordem: 3,
  },
  /* olhar-sul-exemplo */
  {
    revendedorSlug: "olhar-sul-exemplo",
    produtoSku: "TRI-EX-07",
    disponivel: true,
    destaque: true,
    ordem: 1,
  },
  {
    revendedorSlug: "olhar-sul-exemplo",
    produtoSku: "TRI-EX-09",
    disponivel: true,
    destaque: false,
    ordem: 2,
  },
  {
    revendedorSlug: "olhar-sul-exemplo",
    produtoSku: "TRI-EX-10",
    disponivel: true,
    destaque: false,
    ordem: 3,
  },
  /* optica-baiana-exemplo */
  {
    revendedorSlug: "optica-baiana-exemplo",
    produtoSku: "TRI-EX-07",
    disponivel: true,
    destaque: true,
    ordem: 1,
  },
  {
    revendedorSlug: "optica-baiana-exemplo",
    produtoSku: "TRI-EX-08",
    disponivel: true,
    destaque: true,
    ordem: 2,
  },
  {
    revendedorSlug: "optica-baiana-exemplo",
    produtoSku: "TRI-EX-09",
    disponivel: true,
    destaque: false,
    ordem: 3,
  },
  /* visao-recife-exemplo */
  {
    revendedorSlug: "visao-recife-exemplo",
    produtoSku: "TRI-MOD-C",
    disponivel: true,
    destaque: true,
    ordem: 1,
  },
  {
    revendedorSlug: "visao-recife-exemplo",
    produtoSku: "TRI-EX-06",
    disponivel: true,
    destaque: false,
    ordem: 2,
  },
  {
    revendedorSlug: "visao-recife-exemplo",
    produtoSku: "TRI-EX-11",
    disponivel: true,
    destaque: false,
    ordem: 3,
  },
] as const satisfies readonly MostruarioItem[];
