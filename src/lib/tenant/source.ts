import { hasDatabase } from "@/lib/payload/client";

import type { MostruarioItem, Revendedor } from "@/lib/catalog/types";
import { tenantSourceLocal } from "./source.local";

/** Fase 0 → Fase 1 seam for tenant data (`spec-architecture.md` §6.1). */
export interface TenantSource {
  listarRevendedores(): Promise<Revendedor[]>;
  buscarRevendedorPorSlug(slug: string): Promise<Revendedor | undefined>;
  listarMostruario(revendedorSlug: string): Promise<MostruarioItem[]>;
}

async function withTenantSource<T>(fn: (source: TenantSource) => Promise<T>): Promise<T> {
  if (!hasDatabase()) return fn(tenantSourceLocal);
  try {
    const { tenantSourcePayload } = await import("./source.payload");
    return await fn(tenantSourcePayload);
  } catch {
    return fn(tenantSourceLocal);
  }
}

/** Active tenant seam — Payload when `DATABASE_URL` is set and reachable, else `content/` mock. */
export const tenantSource: TenantSource = {
  async listarRevendedores() {
    return withTenantSource((source) => source.listarRevendedores());
  },
  async buscarRevendedorPorSlug(slug) {
    return withTenantSource((source) => source.buscarRevendedorPorSlug(slug));
  },
  async listarMostruario(revendedorSlug) {
    return withTenantSource((source) => source.listarMostruario(revendedorSlug));
  },
};
