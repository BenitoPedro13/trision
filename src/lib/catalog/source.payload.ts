import { getPayloadClient } from "@/lib/payload/client";
import { mapColecao, mapProduto } from "@/lib/payload/map";

import type { CatalogSource } from "./source";

export const catalogSourcePayload: CatalogSource = {
  async listarProdutos() {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: "produtos",
      depth: 1,
      limit: 1000,
      overrideAccess: true,
      where: { status: { equals: "ativo" } },
    });
    return docs.map((doc) => mapProduto(doc as unknown as Parameters<typeof mapProduto>[0]));
  },

  async buscarProdutoPorSku(sku) {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: "produtos",
      depth: 1,
      limit: 1,
      overrideAccess: true,
      where: { sku: { equals: sku } },
    });
    const doc = docs[0];
    return doc ? mapProduto(doc as unknown as Parameters<typeof mapProduto>[0]) : undefined;
  },

  async listarColecoes() {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: "colecoes",
      depth: 1,
      limit: 1000,
      overrideAccess: true,
    });
    return docs.map((doc) => mapColecao(doc as unknown as Parameters<typeof mapColecao>[0]));
  },
};
