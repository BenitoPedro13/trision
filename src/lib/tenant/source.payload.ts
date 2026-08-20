import { getPayloadClient } from "@/lib/payload/client";
import { mapRevendedor } from "@/lib/payload/map";

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
};
