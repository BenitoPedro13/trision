import { hasDatabase } from "@/lib/payload/client";

import type { MostruarioItem, Revendedor } from "@/lib/catalog/types";
import { tenantSourceLocal } from "./source.local";

/** Fase 0 → Fase 1 seam for tenant data (`spec-architecture.md` §6.1). */
export interface TenantSource {
  listarRevendedores(): Promise<Revendedor[]>;
  buscarRevendedorPorSlug(slug: string): Promise<Revendedor | undefined>;
  listarMostruario(revendedorSlug: string): Promise<MostruarioItem[]>;
}

async function resolveTenantSource(): Promise<TenantSource> {
  if (hasDatabase()) {
    const { tenantSourcePayload } = await import("./source.payload");
    return tenantSourcePayload;
  }
  return tenantSourceLocal;
}

/** Active tenant seam — Payload when `DATABASE_URL` is set, else `content/` mock. */
export const tenantSource: TenantSource = {
  async listarRevendedores() {
    return (await resolveTenantSource()).listarRevendedores();
  },
  async buscarRevendedorPorSlug(slug) {
    return (await resolveTenantSource()).buscarRevendedorPorSlug(slug);
  },
  async listarMostruario(revendedorSlug) {
    return (await resolveTenantSource()).listarMostruario(revendedorSlug);
  },
};
