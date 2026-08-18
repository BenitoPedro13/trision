import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";
import { catalogSourceLocal } from "@/lib/catalog/source.local";

/* /loja/[rev] stays out — it's the Fase 0 path-based storefront stand-in
   (TASK-frontend-fase-0.md §2.4), disallowed in robots.ts for the same reason. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [colecoes, produtos] = await Promise.all([
    catalogSourceLocal.listarColecoes(),
    catalogSourceLocal.listarProdutos(),
  ]);

  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/catalogo`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/colecoes`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    ...colecoes.map((colecao) => ({
      url: `${SITE_URL}/colecoes/${colecao.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...produtos.map((produto) => ({
      url: `${SITE_URL}/oculos/${produto.sku}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
