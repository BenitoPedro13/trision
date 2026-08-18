import { colecoes } from "@/content/colecoes";
import { produtos } from "@/content/produtos";
import type { CatalogSource } from "./source";

/** Fase 0 implementation — reads typed TS modules in `content/`, no I/O. */
export const catalogSourceLocal: CatalogSource = {
  async listarProdutos() {
    return [...produtos];
  },

  async buscarProdutoPorSku(sku) {
    return produtos.find((p) => p.sku === sku);
  },

  async listarColecoes() {
    return [...colecoes];
  },
};
