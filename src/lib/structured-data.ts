import { marca } from "@/content/marca";
import type { Produto } from "@/lib/catalog/types";
import { SITE, SITE_URL } from "@/lib/site-config";

/** Sitewide Organization + WebSite JSON-LD, rendered once in `src/app/layout.tsx`.
 * `sameAs` cites Instagram once `marca.instagram` is set (confirmed 2026-08-20,
 * `spec-brand.md` §6 question 3) — omitted while empty, never a guessed handle.
 * `areaServed` is the whole country: Trísion sells nationwide through its reseller
 * network (`spec-brand.md` §2.1), distinct from the Atendimento Exclusivo in-person
 * service's own two-state area (`/atendimento-exclusivo`). */
export function organizacaoJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "WebSite"],
    name: SITE.nome,
    url: SITE_URL,
    logo: `${SITE_URL}/apple-icon`,
    areaServed: { "@type": "Country", name: "BR" },
    ...(marca.instagram ? { sameAs: [`https://instagram.com/${marca.instagram}`] } : {}),
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

/** `Service` JSON-LD for `/atendimento-exclusivo` — an in-home/in-location visit, not a
 * fixed storefront, so `Service` + `areaServed` (the two states Amanda actually visits,
 * `TASK-atendimento-exclusivo.md`) is the accurate type, not `LocalBusiness` (which
 * implies a single street address that doesn't exist for this service). */
export function atendimentoExclusivoJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Consultoria óptica e visita técnica em domicílio",
    name: "Atendimento Exclusivo Trísion",
    provider: { "@type": "Organization", name: SITE.nome },
    areaServed: [
      { "@type": "State", name: "Rio de Janeiro" },
      { "@type": "State", name: "Mato Grosso do Sul" },
    ],
    description:
      "Visita técnica e consultoria de imagem para escolha de armações, no local de preferência do cliente.",
  };
}
