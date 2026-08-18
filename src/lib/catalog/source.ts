import { hasDatabase } from "@/lib/payload/client";

import type { Colecao, Produto } from "./types";
import { catalogSourceLocal } from "./source.local";

/** Fase 0 → Fase 1 seam (`spec-architecture.md` §6.1). */
export interface CatalogSource {
  listarProdutos(): Promise<Produto[]>;
  buscarProdutoPorSku(sku: string): Promise<Produto | undefined>;
  listarColecoes(): Promise<Colecao[]>;
}

async function withCatalogSource<T>(fn: (source: CatalogSource) => Promise<T>): Promise<T> {
  if (!hasDatabase()) return fn(catalogSourceLocal);
  try {
    const { catalogSourcePayload } = await import("./source.payload");
    return await fn(catalogSourcePayload);
  } catch {
    return fn(catalogSourceLocal);
  }
}

/** Active catalogue seam — Payload when `DATABASE_URL` is set and reachable, else `content/` mock. */
export const catalogSource: CatalogSource = {
  async listarProdutos() {
    return withCatalogSource((source) => source.listarProdutos());
  },
  async buscarProdutoPorSku(sku) {
    return withCatalogSource((source) => source.buscarProdutoPorSku(sku));
  },
  async listarColecoes() {
    return withCatalogSource((source) => source.listarColecoes());
  },
};
