# TASK — SEO, metadata and dynamic OG images for every route

## 1. Current scenario

Every page under `src/app/(marca)/` and `src/app/loja/[rev]/` sets at most a bare
`{ title: "…" }` (static `metadata` export or `generateMetadata`). None of them set
`description`, `openGraph`, `twitter`, or `alternates.canonical`. Because Next.js
**shallow-merges** metadata objects per segment (nested fields like `openGraph` are
*replaced*, not deep-merged — confirmed in
`node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md`
§"Merging metadata"), every page that only sets `title` silently falls back to root
`layout.tsx`'s `openGraph`/`twitter` blocks — so a shared link to `/oculos/aviador-01` or
to `/loja/otica-do-carlos` shows the generic "Trísion Eyewear — Uma vitrine para cada
revendedor" preview in WhatsApp/Slack/Twitter, never the product or the shop.

There is exactly one OG image in the whole app: `src/app/opengraph-image.tsx` (+
`twitter-image.tsx` re-exporting it), a static brand card. Because Next.js resolves the
*closest* `opengraph-image` file up the segment tree, this one root file is what renders
for **every** route — `/`, `/catalogo`, `/oculos/aviador-01`, `/loja/otica-do-carlos`, all
identical. Confirmed in `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/opengraph-image.md`
("the more specific image will take precedence… over any OG images above it").

`sitemap.ts` and `robots.ts` are already correct and are not touched here (`/loja/` stays
disallowed — Fase 0 path stand-in, `AGENTS.md` §0). No JSON-LD structured data exists
anywhere in the app.

No real product/reseller photography exists yet (`content/produtos.ts` → `fotos: []`,
`content/colecoes.ts` → `capa: ""`, `content/revendedores.ts` → `retrato: ""` on every
row, `TASK-normalizar-imagens.md` still not built). OG images in this task are therefore
**typographic only** — the same honesty rule that already gates the "sem foto" empty
state in `GaleriaProduto` applies here: no invented photograph in a social card either.

## 2. Planned changes

### 2.1 Shared helpers (new, avoids repeating boilerplate across ~11 route files each)

- **`src/lib/seo.ts`** — `metadataDaPagina({ titulo, descricao, caminho, keywords? })`.
  Returns a full `Metadata` object (`title`, `description`, `alternates.canonical`,
  `openGraph` with `siteName`/`locale`/`type: "website"`/`url`/`title`/`description`,
  `twitter` with `card: "summary_large_image"`/`title`/`description`) so every page that
  calls it keeps the fields the shallow-merge would otherwise drop. `titulo` is the bare
  page title (layout's `%s · Trísion Eyewear` template still applies to `<title>`);
  `openGraph.title`/`twitter.title` are composed as `${titulo} · ${SITE.titulo}` inline,
  since OG/Twitter tags are **not** run through the title template.
  `next.OpenGraphType` (checked in `node_modules/next/dist/lib/metadata/types/opengraph-types.d.ts`)
  has no `product` variant, so every route stays `type: "website"` — consistent with "no
  cart, no checkout" (`AGENTS.md` §0).
- **`src/lib/og-image.tsx`** — one Satori composition (`CartaoOg`) reused by every
  `opengraph-image.tsx`: dark ground, starfield (`estrelas` from `marca-paths.ts`), the
  four gold visor corners, a small mark+wordmark top-left, and four optional text slots
  (`kicker`, `titulo`, `subtitulo`, `rodape`). Also exports `OG_SIZE`, `OG_CONTENT_TYPE`,
  and `gerarOgImage(props)` which loads the two static Archivo weights (same
  `src/assets/archivo-{400,700}.ttf` the existing root OG image already reads) and
  returns the `ImageResponse`. This is the same "one composer" pattern already
  established for `lib/lead/link.ts` (wa.me) and `lib/marca-paths.ts` (the mark) —
  11 near-identical Satori layouts is real duplication, not a hypothetical one.
- **`src/lib/structured-data.ts`** — `organizacaoJsonLd()` (Organization + WebSite,
  root layout, sitewide) and `produtoJsonLd(produto)` (Product, both product page
  variants). Both return plain objects rendered via `<script type="application/ld+json"
  dangerouslySetInnerHTML>` per the official guide
  (`node_modules/next/dist/docs/01-app/02-guides/json-ld.md`) — no `schema-dts` dependency
  added for two small object shapes.

### 2.2 Metadata per page (all in `src/app/(marca)/**` and `src/app/loja/[rev]/**`)

Every page below switches its `metadata`/`generateMetadata` to call `metadataDaPagina()`
with real, already-existing copy (brand thesis line, reseller city/UF, product
formato/material/cor, numeração) — nothing invented, nothing beyond what the page itself
already renders:

| Route | Title | Description source |
|---|---|---|
| `/catalogo` | "Catálogo" | live `produtos.length` count |
| `/colecoes` | "Coleções" | brand thesis line (already used in `FocoVerdadeiro` on `/`) |
| `/colecoes/[slug]` | `colecao.nome` | `colecao.texto`, truncated to ~155 chars |
| `/oculos/[slug]` | `produto.nome` | categoria/formato/material/cor + numeração when present |
| `/revendedores` | "Revendedores" | live active-reseller count |
| `/seja-revendedor` | "Seja revendedor" | existing curated-line copy from the page body |
| `/sobre` | "Sobre" | existing "óptico, não boutique" copy from the page body |
| `/loja/[rev]` | `revendedor.nome` | `revendedor.cidade` + `revendedor.uf` |
| `/loja/[rev]/a-loja` | `A loja · {revendedor.nome}` | same city/UF |
| `/loja/[rev]/mostruario` | `Mostruário · {revendedor.nome}` | item count in this mostruário |
| `/loja/[rev]/oculos/[slug]` | `{produto.nome} · {revendedor.nome}` | product facts + reseller attribution |

`/loja/**` pages get `robots: { index: false, follow: false }` in their
`metadataDaPagina()` call — `robots.ts` already disallows crawling `/loja/` (Fase 0 path
stand-in, `AGENTS.md` §0), so the per-page `<meta name="robots">` should say the same
thing rather than silently contradicting it. `/`, `/apresentacao` and every other page
are untouched (root layout / existing metadata already correct or intentionally scoped —
`/apresentacao` stays exactly as is, out of scope, see §4).

### 2.3 Dynamic OG images (new, one or two files per route)

Each of these adds `opengraph-image.tsx` (calls `gerarOgImage()` from `og-image.tsx`)
and a one-line `twitter-image.tsx` re-export, mirroring the existing root pair exactly:

- `(marca)/catalogo/opengraph-image.tsx` — kicker "CATÁLOGO", subtitulo with live count.
- `(marca)/colecoes/opengraph-image.tsx` — kicker "COLEÇÕES", subtitulo = brand thesis.
- `(marca)/colecoes/[slug]/opengraph-image.tsx` — dynamic on `params.slug`: kicker
  `COLEÇÃO · {ano}`, titulo `colecao.nome`, subtitulo `colecao.texto`.
- `(marca)/oculos/[slug]/opengraph-image.tsx` — dynamic on `params.slug`: kicker
  `{categoria} · {formato}`, titulo `produto.nome`, subtitulo `material · cor`, and —
  only when `produto.medidas` has all three fields — a gold numeração badge. Drawn as
  Satori SVG (`NumeracaoOg` in `lib/og-image.tsx`), not the `lib/numeracao.ts` string:
  the static Archivo TTF Satori reads doesn't ship the `□` glyph (U+25A1) and rendered
  it as a tofu box in testing, so this mirrors `components/numeracao.tsx`'s own reason
  for drawing the box as inline SVG rather than trusting the font. Falls back to a plain
  "Óculos" card if the sku doesn't resolve (never crashes the image route).
- `(marca)/revendedores/opengraph-image.tsx` — kicker "REVENDEDORES", subtitulo with
  live active-reseller count.
- `(marca)/seja-revendedor/opengraph-image.tsx`, `(marca)/sobre/opengraph-image.tsx` —
  static kicker/titulo/subtitulo pulled from each page's own copy.
- `loja/[rev]/opengraph-image.tsx`, `loja/[rev]/a-loja/opengraph-image.tsx`,
  `loja/[rev]/mostruario/opengraph-image.tsx` — each dynamic on `params.rev` via
  `escopoRevendedor`, one file per route (not one shared parent file) so the kicker can
  say "REVENDA OFICIAL" / "A LOJA" / "MOSTRUÁRIO" per page while subtitulo stays
  `{cidade} · {uf}`. Falls back to a plain "Loja" card if the slug doesn't resolve.
- `loja/[rev]/oculos/[slug]/opengraph-image.tsx` — dynamic on both params: kicker
  `REVENDA OFICIAL · {revendedor.nome}`, titulo `produto.nome`, numeração badge as
  above, subtitulo `{cidade} · {uf}` — the same attribution the WhatsApp CTA already
  carries (`spec-architecture.md` §7.3).

`/` and `/apresentacao` keep the existing root `opengraph-image.tsx` — the root card
already *is* the brand-generic card `/` wants, and `/apresentacao` is an internal pitch
link, not a public route worth a bespoke card (see §4, explicitly out of scope).

### 2.4 Structured data (JSON-LD)

- **`src/app/layout.tsx`** — one `<script type="application/ld+json">` rendering
  `organizacaoJsonLd()`: `@type: ["Organization","WebSite"]` merged object with `name`,
  `url` (`SITE_URL`), `logo` (`${SITE_URL}/apple-icon`, the existing 180×180 mark route).
  `sameAs` is **omitted** — `content/marca.ts`'s `instagram`/`whatsapp` are both `""`
  (`[VERIFICAR]`, `spec-brand.md` §6 question 6), so there is nothing real to cite yet.
- **`(marca)/oculos/[slug]/page.tsx`** and **`loja/[rev]/oculos/[slug]/page.tsx`** —
  one `<script type="application/ld+json">` rendering `produtoJsonLd(produto)`:
  `@type: "Product"`, `name`, `sku`, `description`, `brand`, `color`, `material`.
  `offers` is included **only when `produto.precoSugerido` is set** — Google's Product
  rich-result guidelines require a real price inside `offers`, and "Consulte o valor" is
  not a price; omitting `offers` entirely (not a placeholder price) is the same honesty
  rule as the numeração component already enforces (`AGENTS.md` §0: "no invented
  price"). No `image` field — no real photo exists yet.

## 3. Why

- Right now a reseller sharing their own storefront link, or Amanda sharing a product
  link, produces a WhatsApp preview that names neither the shop nor the product — the
  single biggest visible SEO/sharing gap in the app today, and the literal ask.
- The shallow-merge behavior (§1) means "just add `openGraph` to more pages" would be a
  trap without a shared builder — a page that sets `openGraph: { title }` alone *loses*
  `siteName`/`locale`/`url` inherited from the layout. `metadataDaPagina()` exists
  specifically to make that mistake impossible to make eleven times.
- OG images stay text-only, matching the same "no invented photo" rule the gallery
  empty-state already enforces — this task does not touch photography
  (`TASK-normalizar-imagens.md` is separate and still not built).
- JSON-LD `offers` is conditional on a real price for the same reason `Numeracao` renders
  nothing rather than a placeholder: a wrong or fabricated structured-data price shown to
  Google is worse than no rich result at all.

## 4. Explicitly out of scope

- **No photography in OG images or JSON-LD `image`.** All source fields (`fotos`,
  `capa`, `retrato`) are empty in `content/*.ts` today; wiring image embedding now would
  be speculative code with nothing to render, against `AGENTS.md`'s "don't design for
  hypothetical future requirements." Revisit alongside `TASK-normalizar-imagens.md`.
- **No bespoke `/apresentacao` OG card.** It's an internal pitch link (already
  `noindex`), and the existing generic brand card is an acceptable preview for a link
  Benito sends Amanda directly.
- **No `BreadcrumbList` JSON-LD.** Real and cheap, but a distinct enhancement from what
  was asked; left for a follow-up task rather than expanding this one's surface.
- **No per-reseller `LocalBusiness` JSON-LD.** `/loja/` stays `noindex` (Fase 0 path
  stand-in, per `robots.ts`) — indexed local-business markup for a URL shape that's
  "very likely deleted, not evolved" (`AGENTS.md` §0) once the domain lands isn't worth
  building twice.
- **No `schema-dts` dependency.** Two small, stable object shapes don't justify a new
  package; hand-typed inline is enough and matches "don't add a dependency you can avoid."
- **`sitemap.ts`/`robots.ts` unchanged** — already correct for this scope.

## 5. Affected files

| File | Change type | Notes |
|---|---|---|
| `src/lib/seo.ts` | new | `metadataDaPagina()` — the one page-metadata builder |
| `src/lib/og-image.tsx` | new | `CartaoOg`, `gerarOgImage()`, `OG_SIZE`, `OG_CONTENT_TYPE` |
| `src/lib/structured-data.ts` | new | `organizacaoJsonLd()`, `produtoJsonLd()` |
| `src/app/layout.tsx` | modified | adds Organization/WebSite JSON-LD `<script>` |
| `src/app/(marca)/catalogo/page.tsx` | modified | `metadataDaPagina()` |
| `src/app/(marca)/catalogo/opengraph-image.tsx` + `twitter-image.tsx` | new | |
| `src/app/(marca)/colecoes/page.tsx` | modified | `metadataDaPagina()` |
| `src/app/(marca)/colecoes/opengraph-image.tsx` + `twitter-image.tsx` | new | |
| `src/app/(marca)/colecoes/[slug]/page.tsx` | modified | `metadataDaPagina()` |
| `src/app/(marca)/colecoes/[slug]/opengraph-image.tsx` + `twitter-image.tsx` | new | dynamic |
| `src/app/(marca)/oculos/[slug]/page.tsx` | modified | `metadataDaPagina()` + Product JSON-LD |
| `src/app/(marca)/oculos/[slug]/opengraph-image.tsx` + `twitter-image.tsx` | new | dynamic, numeração badge |
| `src/app/(marca)/revendedores/page.tsx` | modified | `metadataDaPagina()` |
| `src/app/(marca)/revendedores/opengraph-image.tsx` + `twitter-image.tsx` | new | |
| `src/app/(marca)/seja-revendedor/page.tsx` | modified | `metadataDaPagina()` |
| `src/app/(marca)/seja-revendedor/opengraph-image.tsx` + `twitter-image.tsx` | new | |
| `src/app/(marca)/sobre/page.tsx` | modified | `metadataDaPagina()` |
| `src/app/(marca)/sobre/opengraph-image.tsx` + `twitter-image.tsx` | new | |
| `src/app/loja/[rev]/page.tsx` | modified | `metadataDaPagina()`, noindex |
| `src/app/loja/[rev]/opengraph-image.tsx` + `twitter-image.tsx` | new | dynamic |
| `src/app/loja/[rev]/a-loja/page.tsx` | modified | `metadataDaPagina()`, noindex |
| `src/app/loja/[rev]/a-loja/opengraph-image.tsx` + `twitter-image.tsx` | new | dynamic |
| `src/app/loja/[rev]/mostruario/page.tsx` | modified | `metadataDaPagina()`, noindex |
| `src/app/loja/[rev]/mostruario/opengraph-image.tsx` + `twitter-image.tsx` | new | dynamic |
| `src/app/loja/[rev]/oculos/[slug]/page.tsx` | modified | `metadataDaPagina()`, noindex, Product JSON-LD |
| `src/app/loja/[rev]/oculos/[slug]/opengraph-image.tsx` + `twitter-image.tsx` | new | dynamic |
| `README.md` | modified | Status section |
| `AGENTS.md` | modified | layout tree note (`lib/seo.ts`, `lib/og-image.tsx`, `lib/structured-data.ts`) |

## 6. Verification

- `pnpm build` succeeds — every `generateStaticParams`-backed OG image route prerenders
  for all `exemplo` products/collections/resellers with no runtime error.
- `pnpm lint` clean.
- Manually inspect rendered `<head>` (view-source or React DevTools) on `/catalogo`,
  `/oculos/{sku}`, `/colecoes/{slug}`, `/loja/{rev}`, `/loja/{rev}/oculos/{sku}`: each has
  a distinct `<title>`, `og:title`, `og:description`, `og:image` (not the root card),
  `twitter:image`, and `<link rel="canonical">` pointing at that exact path.
- Visit each new `opengraph-image` route directly in the browser (e.g.
  `/oculos/{sku}/opengraph-image`) and confirm the composed PNG renders without a Satori
  error and without any unstyled/missing-font fallback.
- Confirm `/loja/**` pages carry `<meta name="robots" content="noindex,nofollow">`,
  matching `robots.ts`'s existing `disallow: ["/loja/"]`.
- Paste an `/oculos/{sku}` and a `/loja/{rev}` URL into Google's Rich Results Test —
  `Product` JSON-LD parses with no errors for products that have `precoSugerido`, and no
  `offers` block (not an error) for the ones that don't.
- Grep `docs/*.md` for `opengraph-image`, `metadata`, `structured data` to confirm no
  stale reference is left after this lands.
