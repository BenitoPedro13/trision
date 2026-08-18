import type { Colecao } from "@/lib/catalog/types";

/** Example collection — not a real Trísion catalogue entry. */
export const colecoes = [
  {
    nome: "Coleção exemplo",
    slug: "exemplo",
    ano: 2026,
    capa: "",
    texto:
      "Coleção de demonstração para o scaffold do catálogo. Não é um lançamento real da Trísion.",
  },
] as const satisfies readonly Colecao[];
