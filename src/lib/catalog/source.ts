import type { Colecao, Produto } from "./types";

/** Fase 0 → Fase 1 seam (`spec-architecture.md` §6.1). */
export interface CatalogSource {
  listarProdutos(): Promise<Produto[]>;
  buscarProdutoPorSku(sku: string): Promise<Produto | undefined>;
  listarColecoes(): Promise<Colecao[]>;
}
