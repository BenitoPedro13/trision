import type { Produto } from "@/lib/catalog/types";

/* Example frames — same naming as `/apresentacao` slide 06 (`Modelo A/B/C`).
   Every entry is `exemplo: true`; measurements are plausible mm values for
   `Numeracao`, not verified Trísion product data. */
export const produtos = [
  {
    nome: "Modelo A",
    sku: "TRI-MOD-A",
    marca: "Trísion",
    colecaoSlug: "exemplo",
    categoria: "grau",
    formato: "quadrado",
    material: "acetato",
    cor: "preto",
    corHex: "#1A1A1A",
    genero: "unissex",
    medidas: { aro: 52, ponte: 18, haste: 145 },
    fotos: [],
    descricao:
      "Armação de acetato, formato quadrado. Produto de demonstração — não faz parte do catálogo real da Trísion.",
    status: "ativo",
    exemplo: true,
  },
  {
    nome: "Modelo B",
    sku: "TRI-MOD-B",
    marca: "Trísion",
    colecaoSlug: "exemplo",
    categoria: "grau",
    formato: "redondo",
    material: "metal",
    cor: "dourado",
    corHex: "#CCA866",
    genero: "unissex",
    medidas: { aro: 49, ponte: 21, haste: 140 },
    fotos: [],
    descricao:
      "Armação de metal, formato redondo. Produto de demonstração — não faz parte do catálogo real da Trísion.",
    status: "ativo",
    exemplo: true,
  },
  {
    nome: "Modelo C",
    sku: "TRI-MOD-C",
    marca: "Trísion",
    colecaoSlug: "exemplo",
    categoria: "grau",
    formato: "gatinho",
    material: "acetato",
    cor: "tartaruga",
    corHex: "#6B4423",
    genero: "feminino",
    medidas: { aro: 54, ponte: 17, haste: 145 },
    fotos: [],
    descricao:
      "Armação de acetato, formato gatinho. Produto de demonstração — não faz parte do catálogo real da Trísion.",
    status: "ativo",
    exemplo: true,
  },
] as const satisfies readonly Produto[];
