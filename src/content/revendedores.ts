import type { Revendedor } from "@/lib/catalog/types";

/** One mock reseller for TASK-frontend-fase-0.md — exercises the storefront components
 * and the tenancy seam ahead of Fase 1's real Payload-backed `revendedores`. Fictional
 * shop, obviously so (`exemplo: true`), same license as `content/produtos.ts`. */
export const revendedores = [
  {
    nome: "Ótica Exemplo",
    slug: "otica-exemplo",
    cidade: "Volta Redonda",
    uf: "RJ",
    // [VERIFICAR: not a real shop — a fake number here would be worse than none]
    whatsapp: "",
    instagram: "",
    sobre:
      "Loja de demonstração para o scaffold do storefront. Não é uma revenda real da Trísion.",
    status: "ativo",
    exemplo: true,
  },
] as const satisfies readonly Revendedor[];
