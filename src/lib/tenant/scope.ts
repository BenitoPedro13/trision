import { catalogSourceLocal as catalogSource } from "@/lib/catalog/source.local";
import type { Produto, Revendedor } from "@/lib/catalog/types";
import { tenantSourceLocal as tenantSource } from "./source.local";

export interface ItemMostruario {
  produto: Produto;
  destaque: boolean;
  ordem: number;
  observacao?: string;
}

/** The one tenancy-scoping module (`spec-architecture.md` §6.1). Every read of
 * `revendedores`/`mostruario` data goes through here — no route or component queries
 * `content/revendedores.ts` / `content/mostruario.ts` directly. With a single mock
 * reseller the leak this rule guards against (one reseller seeing another's rows) can't
 * manifest yet; the boundary is what Fase 1's Payload-backed `source.payload.ts`
 * inherits, not redesigns. */

/** A reseller's storefront: itself plus its resolved, available, sorted mostruário. */
export async function escopoRevendedor(
  slug: string,
): Promise<{ revendedor: Revendedor; itens: ItemMostruario[] } | null> {
  const revendedor = await tenantSource.buscarRevendedorPorSlug(slug);
  if (!revendedor || revendedor.status !== "ativo") return null;

  const linhas = await tenantSource.listarMostruario(slug);
  const produtos = await catalogSource.listarProdutos();

  const itens: ItemMostruario[] = [];
  for (const linha of linhas) {
    if (!linha.disponivel) continue;
    const produto = produtos.find((p) => p.sku === linha.produtoSku);
    if (!produto) continue;
    itens.push({
      produto,
      destaque: linha.destaque,
      ordem: linha.ordem,
      observacao: linha.observacao,
    });
  }
  itens.sort((a, b) => a.ordem - b.ordem);

  return { revendedor, itens };
}

/** Slugs of every active reseller — `generateStaticParams` for `/loja/[rev]` and
 * `/loja/[rev]/mostruario`, mirroring `spec-architecture.md` §8: "generateStaticParams
 * covers active tenants at build; new tenants render on demand." */
export async function revendedoresAtivosSlugs(): Promise<string[]> {
  const revendedores = await tenantSource.listarRevendedores();
  return revendedores.filter((r) => r.status === "ativo").map((r) => r.slug);
}

/** Reverse lookup for `OndeComprar`: every active reseller carrying `sku`. */
export async function revendedoresQueCarregam(sku: string): Promise<Revendedor[]> {
  const revendedores = await tenantSource.listarRevendedores();
  const resultado: Revendedor[] = [];

  for (const revendedor of revendedores) {
    if (revendedor.status !== "ativo") continue;
    const linhas = await tenantSource.listarMostruario(revendedor.slug);
    if (linhas.some((linha) => linha.produtoSku === sku && linha.disponivel)) {
      resultado.push(revendedor);
    }
  }

  return resultado;
}
