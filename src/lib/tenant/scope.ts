import { catalogSource } from "@/lib/catalog/source";
import type { Produto, Revendedor } from "@/lib/catalog/types";
import { tenantSource } from "./source";

/** The one tenancy-scoping module (`spec-architecture.md` §6.1). Every read of
 * `revendedores` data goes through here — no route or component queries
 * `content/revendedores.ts` directly. Every reseller's storefront shows the same
 * catalogue (decided 2026-08-20, `TASK-catalogo-unico-sem-mostruario.md`) — there is no
 * per-reseller product selection left to scope, only the reseller's own identity. */

/** A reseller's storefront: itself plus the full active catalogue — identical for every
 * reseller. The storefront exists for endorsement and lead attribution, not curation. */
export async function escopoRevendedor(
  slug: string,
): Promise<{ revendedor: Revendedor; produtos: Produto[] } | null> {
  const revendedor = await tenantSource.buscarRevendedorPorSlug(slug);
  if (!revendedor || revendedor.status !== "ativo") return null;

  const produtos = await catalogSource.listarProdutos();

  return { revendedor, produtos };
}

/** Every active reseller — `/revendedores`, and the source for slug-only callers. */
export async function revendedoresAtivos(): Promise<Revendedor[]> {
  const revendedores = await tenantSource.listarRevendedores();
  return revendedores.filter((r) => r.status === "ativo");
}

/** Slugs of every active reseller — `generateStaticParams` for `/loja/[rev]`, mirroring
 * `spec-architecture.md` §8: "generateStaticParams covers active tenants at build; new
 * tenants render on demand." */
export async function revendedoresAtivosSlugs(): Promise<string[]> {
  const revendedores = await revendedoresAtivos();
  return revendedores.map((r) => r.slug);
}
