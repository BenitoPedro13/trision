import type { MostruarioItem, Revendedor } from "@/lib/catalog/types";

/** Fase 0 → Fase 1 seam for tenant data, mirroring `lib/catalog/source.ts`
 * (`spec-architecture.md` §6.1). `source.payload.ts` is Fase 1, not started here. */
export interface TenantSource {
  listarRevendedores(): Promise<Revendedor[]>;
  buscarRevendedorPorSlug(slug: string): Promise<Revendedor | undefined>;
  listarMostruario(revendedorSlug: string): Promise<MostruarioItem[]>;
}
