import type { Produto } from "@/lib/catalog/types";
import { SITE, SITE_URL } from "@/lib/site-config";

/** Sitewide Organization + WebSite JSON-LD, rendered once in `src/app/layout.tsx`.
 * `sameAs` is deliberately absent — `content/marca.ts`'s `instagram`/`whatsapp` are both
 * `""` (`[VERIFICAR]`, `spec-brand.md` §6 question 6); nothing real to cite yet. */
export function organizacaoJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "WebSite"],
    name: SITE.nome,
    url: SITE_URL,
    logo: `${SITE_URL}/apple-icon`,
  };
}

/** Product JSON-LD for `/oculos/[slug]` and `/loja/[rev]/oculos/[slug]`. `offers` is
 * included only when `precoSugerido` is set — Google's Product rich-result guidelines
 * require a real price inside `offers`, and "Consulte o valor" is not a price. Omitting
 * the block (not a placeholder) mirrors `Numeracao`'s "no measurements ⇒ no numeração"
 * rule (`AGENTS.md` §0). No `image` — no real photo exists yet. */
export function produtoJsonLd(produto: Produto) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: produto.nome,
    sku: produto.sku,
    description: produto.descricao,
    brand: { "@type": "Brand", name: produto.marca },
    color: produto.cor,
    material: produto.material,
    ...(produto.precoSugerido != null
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "BRL",
            price: produto.precoSugerido,
            availability:
              produto.status === "ativo"
                ? "https://schema.org/InStock"
                : "https://schema.org/Discontinued",
          },
        }
      : {}),
  };
}
