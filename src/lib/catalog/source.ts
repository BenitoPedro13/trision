import { hasDatabase } from "@/lib/payload/client";

import type { Colecao, Produto } from "./types";
import { catalogSourceLocal } from "./source.local";

/** Fase 0 → Fase 1 seam (`spec-architecture.md` §6.1). */
export interface CatalogSource {
  listarProdutos(): Promise<Produto[]>;
  buscarProdutoPorSku(sku: string): Promise<Produto | undefined>;
  listarColecoes(): Promise<Colecao[]>;
}

async function resolveCatalogSource(): Promise<CatalogSource> {
  if (hasDatabase()) {
    const { catalogSourcePayload } = await import("./source.payload");
    return catalogSourcePayload;
  }
  return catalogSourceLocal;
}

/** Active catalogue seam — Payload when `DATABASE_URL` is set, else `content/` mock. */
export const catalogSource: CatalogSource = {
  async listarProdutos() {
    return (await resolveCatalogSource()).listarProdutos();
  },
  async buscarProdutoPorSku(sku) {
    return (await resolveCatalogSource()).buscarProdutoPorSku(sku);
  },
  async listarColecoes() {
    return (await resolveCatalogSource()).listarColecoes();
  },
};
