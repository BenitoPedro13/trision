/** Domain types for the Fase 0 catalogue seam — mirrors `spec-architecture.md` §5.1 / §5.5. */

export type CategoriaProduto = "solar" | "grau" | "clip-on";

export type FormatoProduto =
  | "aviador"
  | "quadrado"
  | "redondo"
  | "gatinho"
  | "hexagonal"
  | "retangular";

export type MaterialProduto = "acetato" | "metal" | "TR90" | "titânio";

export type GeneroProduto = "feminino" | "masculino" | "unissex";

export type StatusProduto = "ativo" | "descontinuado";

/** Millimetres — formatted at the edge (`Numeracao`), never stored as a string. */
export interface MedidasProduto {
  aro: number;
  ponte: number;
  haste: number;
}

export interface Produto {
  nome: string;
  sku: string;
  /** Default `"Trísion"` — survives open question #1 either way. */
  marca: string;
  colecaoSlug: string;
  categoria: CategoriaProduto;
  formato: FormatoProduto;
  material: MaterialProduto;
  cor: string;
  /** Drives the swatch, never the photograph (`spec-architecture.md` §5.1). */
  corHex: string;
  genero: GeneroProduto;
  medidas: MedidasProduto;
  /** Public asset paths; `[0]` is the front shot when present (`spec-design.md` §10). */
  fotos: string[];
  descricao: string;
  /** Absent ⇒ `Consulte o valor`. Never defaulted. */
  precoSugerido?: number;
  status: StatusProduto;
  /** Fase 0 only — real `produtos` has no such field; gates the visible "exemplo" label. */
  exemplo: boolean;
}

export interface Colecao {
  nome: string;
  slug: string;
  ano: number;
  capa: string;
  texto: string;
}

/** Fase 0 stand-in for the `config` global (`spec-architecture.md` §5.5). */
export interface Marca {
  /** E.164 — [VERIFICAR: Amanda's real WhatsApp number, spec-brand.md §6 question 6] */
  whatsapp: string;
  instagram: string;
  desde: number;
}
