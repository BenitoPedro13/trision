import type { Metadata } from "next";
import { SITE, SITE_URL } from "./site-config";

interface MetadataDaPaginaInput {
  /** Bare page title — the layout's `%s · Trísion Eyewear` template composes `<title>`.
   * `openGraph`/`twitter` titles are composed here explicitly since those tags are not
   * run through the title template. */
  titulo: string;
  descricao: string;
  /** Path only, e.g. `/catalogo` — resolved against `metadataBase` (`SITE_URL`). */
  caminho: string;
  keywords?: string[];
  /** Defaults to indexable. `/loja/**` pages pass `false` to match `robots.ts`'s
   * existing `disallow: ["/loja/"]` — the Fase 0 path stand-in, `AGENTS.md` §0. */
  indexar?: boolean;
}

/** The one page-metadata builder (mirrors `lib/lead/link.ts`'s "one wa.me builder"
 * pattern). Next.js shallow-merges `openGraph`/`twitter` between layout and page — a
 * page that sets `openGraph: { title }` alone loses the layout's `siteName`/`locale`/
 * `url` rather than inheriting them (`node_modules/next/dist/docs/01-app/03-api-reference/
 * 04-functions/generate-metadata.md` §"Merging metadata"). This always returns the full
 * shape so no page can drop a field by accident. */
export function metadataDaPagina({
  titulo,
  descricao,
  caminho,
  keywords,
  indexar = true,
}: MetadataDaPaginaInput): Metadata {
  const url = `${SITE_URL}${caminho}`;
  const tituloCompleto = `${titulo} · ${SITE.titulo}`;

  return {
    title: titulo,
    description: descricao,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical: caminho },
    openGraph: {
      type: "website",
      siteName: SITE.nome,
      locale: SITE.locale,
      url,
      title: tituloCompleto,
      description: descricao,
    },
    twitter: {
      card: "summary_large_image",
      title: tituloCompleto,
      description: descricao,
    },
    robots: indexar ? { index: true, follow: true } : { index: false, follow: false },
  };
}
