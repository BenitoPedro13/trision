import { getPayloadClient } from "@/lib/payload/client";
import { mapMostruario, mapRevendedor } from "@/lib/payload/map";

import type { TenantSource } from "./source";

export const tenantSourcePayload: TenantSource = {
  async listarRevendedores() {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: "revendedores",
      depth: 1,
      limit: 1000,
      overrideAccess: true,
    });
    return docs.map((doc) => mapRevendedor(doc as unknown as Parameters<typeof mapRevendedor>[0]));
  },

  async buscarRevendedorPorSlug(slug) {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: "revendedores",
      depth: 1,
      limit: 1,
      overrideAccess: true,
      where: { slug: { equals: slug } },
    });
    const doc = docs[0];
    return doc ? mapRevendedor(doc as unknown as Parameters<typeof mapRevendedor>[0]) : undefined;
  },

  async listarMostruario(revendedorSlug) {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: "mostruario",
      depth: 2,
      limit: 1000,
      overrideAccess: true,
      where: { "revendedor.slug": { equals: revendedorSlug } },
    });
    return docs
      .map((doc) => mapMostruario(doc as unknown as Parameters<typeof mapMostruario>[0]))
      .filter((item): item is NonNullable<typeof item> => item !== null);
  },
};
