import type { Colecao } from "@/lib/catalog/types";

/** Example collections — not real Trísion catalogue entries. */
export const colecoes = [
  {
    nome: "Coleção exemplo",
    slug: "exemplo",
    ano: 2026,
    capa: "",
    texto:
      "Coleção de demonstração para o scaffold do catálogo. Não é um lançamento real da Trísion.",
  },
  {
    nome: "Linha noturna (exemplo)",
    slug: "noturna-exemplo",
    ano: 2025,
    capa: "",
    texto:
      "Armações de grau pensadas para uso noturno e ambientes com pouca luz — dados fictícios para exercitar filtros e páginas de coleção.",
  },
  {
    nome: "Solar exemplo",
    slug: "solar-exemplo",
    ano: 2025,
    capa: "",
    texto:
      "Modelos solares de demonstração. Nenhuma lente ou tratamento descrito aqui é especificação real de produto.",
  },
  {
    nome: "Essenciais exemplo",
    slug: "essenciais-exemplo",
    ano: 2024,
    capa: "",
    texto:
      "Formatos clássicos para o dia a dia — coleção fictícia que cobre aviador, retangular e hexagonal no catálogo de teste.",
  },
] as const satisfies readonly Colecao[];
