# Trísion Eyewear

Brand site + reseller storefront platform.
**Trísion Eyewear, since 2002.** One storefront per reseller, one catalogue.

The brand, the visual system and the platform live in
[`docs/spec-brand.md`](docs/spec-brand.md),
[`docs/spec-design.md`](docs/spec-design.md) and
[`docs/spec-architecture.md`](docs/spec-architecture.md).
How to work in this repo: [`AGENTS.md`](AGENTS.md).

## Where the spec lives

| Doc | What it is |
|---|---|
| `docs/spec-brand.md` | The brand: audit of what already exists, positioning, voice, and the 10 open questions (§6) |
| `docs/spec-design.md` | The visual system: measured tokens, the visor, numeração, type, motion |
| `docs/spec-architecture.md` | The platform: multi-tenancy, data model, lead attribution, phases |
| `docs/identidade.html` | Internal identity board (not client-facing material) |
| `docs/tasks/` | Task docs — no code before one of these (`AGENTS.md` §1) |

## Status (2026-08-17)

**Fase 0, in progress.** Next.js 16.3.1 scaffolded, `spec-design.md` §4.1 tokens applied,
and the **pitch page for Amanda** is live at `/apresentacao`
(`TASK-scaffold-e-apresentacao.md`).

**The frontend layout is now built end-to-end against mock data**
(`TASK-frontend-fase-0.md`): `/`, `/colecoes`, `/catalogo`, `/oculos/[slug]`, and a
Fase-0 storefront stand-in at `/loja/[rev]` all render — every product and reseller
marked `exemplo`. No real photography exists yet, so every gallery shows the honest
"sem foto" state rather than an invented photo, and AlignUI/React Bits aren't installed
yet, so the CTA/filter chips/thesis line are hand-written on the token system, not their
eventual polished versions.

No Payload, no database — a scope decision: Payload enters in Fase 1
(`spec-architecture.md` §3).

**Closed at R$ 300** (R$ 150 to start) for Fases 0, 1 and 2 — site live, first storefront,
and lead attribution per shop. Only Fase 3 is left to negotiate.

**Three questions block everything else** (`spec-brand.md` §6): the domain, the pricing
model, and where the WhatsApp button points. They are on slides 14–15 of the pitch,
marked.

## Stack

Versions here are a snapshot, not a pin — see `AGENTS.md` §2.0 before adding anything.

| Layer | Choice | Now |
|---|---|---|
| App | Next.js 16 (App Router, TypeScript, Turbopack, `src/`) | yes |
| Styling | Tailwind v4, tokens in `src/app/globals.css`, dark only | yes |
| Brand | `Visor`, `VisorCursor`, `Numeracao`, `Marca`, `Ceu` — hand-written | yes |
| Catalogue | TS modules in `content/` behind `lib/catalog/` (Fase 0) | wired into `/`, `/catalogo`, `/oculos/[slug]`, `/colecoes` |
| Tenancy | Mirrors the catalogue seam: `lib/tenant/` + `lib/tenant/scope.ts` (Fase 0, mock data) | one mock reseller, `/loja/[rev]` path stand-in |
| State | Zustand (client UI state, e.g. the filter drawer) + URL search params (filters). TanStack Query deliberately not installed yet | see `AGENTS.md` "State management" |
| CMS | Payload 3, in the same app, at `/admin` (Fase 1) | not yet |
| Data | Postgres + Vercel Blob (Fase 1) | not yet |
| Conversion | `wa.me` via `lib/lead/link.ts`, no cart (`spec-architecture.md` §2) | direct link, no `/ir/` attribution yet |
| Host | Vercel | `trision.vercel.app` |

## Address

`https://trision.vercel.app` — in `src/lib/site-config.ts`, trailing slash stripped in
one place. Override with `NEXT_PUBLIC_SITE_URL` once the real domain is known — Amanda
confirmed 2026-08-17 she owns one, but the exact string and DNS access are still
`[VERIFICAR]` (`spec-brand.md` §6, question 4). Wildcard subdomains (illustrated here as
`loja.trision.com.br`, not a confirmed name) need the apex; until then, Fase 1 does not
move.

## Mark, favicon and OG

The eight paths of the symbol live in `src/lib/marca-paths.ts` and are the **only**
source: the header, the favicon (`src/app/icon.tsx`), the apple-touch (`apple-icon.tsx`)
and the social card (`opengraph-image.tsx`, reused by `twitter-image.tsx`) all read from
there, so the favicon cannot drift from the mark. The drawing is an **approximate
redraw** of the raster — question 8 in `spec-brand.md` §6 is still open.

The social card is composed with the static instances in `src/assets/*.ttf` — Satori
does not use the variable face that `next/font` serves. The card's stars are seeded
(`estrelas()`), so the image is byte-stable across builds: a card that changes on every
deploy invalidates every social cache.

## Run

```sh
pnpm install
pnpm dev          # http://localhost:3000
pnpm build && pnpm start
pnpm lint
pnpm verificar-fase-0   # budgets pass, TASK-verificacao-fase-0.md §5 — needs pnpm start running
```

No `.env` needed in this phase. `NEXT_PUBLIC_SITE_URL` only lands when the real domain
exists; the default is the Vercel address above.

## Verification

`scripts/verificar-fase-0.mts` (Lighthouse + Playwright/axe) checks `/` and `/apresentacao`
against the budgets in `spec-design.md` §12. Last measured **2026-08-17, before
`TASK-frontend-fase-0.md`'s routes landed**: LCP 1.47–1.51s (budget ≤2.0s), CLS 0.001
(≤0.05), JS transfer 135–140 KB (≤180 KB), zero contrast violations, every keyboard stop
carries the `.foco-visor` bracket, `Ceu`/`VisorCursor` correctly go still/off under
`prefers-reduced-motion` and coarse pointer. Full methodology and findings in
`docs/tasks/TASK-verificacao-fase-0.md`. **Not yet re-run against the new routes** —
`/catalogo`, `/oculos/[slug]` etc. were verified manually (`tsc`/`lint`/`build` + curl,
`TASK-frontend-fase-0.md` §6), not against these measured budgets.

## Routes

| Route | What it is |
|---|---|
| `/` | The real homepage: thesis line, collections, `Desde 2002`. Mock data, `exemplo` labelled |
| `/colecoes`, `/colecoes/[slug]` | Collection list + editorial detail |
| `/catalogo` | Full line, filterable by formato/material/cor/gênero via URL search params |
| `/oculos/[slug]` | Product page — gallery, ficha técnica, numeração, onde comprar, WhatsApp CTA |
| `/loja/[rev]`, `/loja/[rev]/mostruario` | **Fase 0 path stand-in** for the storefront — `/loja/otica-exemplo` is the one mock reseller. Not the final URL shape (see `AGENTS.md` "Storefront routing") |
| `/apresentacao` | The pitch for Amanda — 16 sections, pt-BR, `noindex` |
| `/icon`, `/apple-icon` | Favicon and apple-touch generated from the symbol |
| `/opengraph-image`, `/twitter-image` | Social card 1200×630 |
| `/robots.txt`, `/sitemap.xml` | `/apresentacao`, `/ir/`, `/loja/` stay out of the index |

## Brand components

| File | What it does |
|---|---|
| `src/components/visor.tsx` | The four corner brackets. The system's only ornament |
| `src/components/numeracao.tsx` | `52□18-145` from three numbers in mm; the `□` is SVG |
| `src/components/marca.tsx` | Symbol + lockup. **Approximate redraw** — pending the original vector |
| `src/components/visor-cursor.tsx` | The brackets following the pointer and snapping onto `data-alvo`. Fine pointer only, off under `prefers-reduced-motion` |
| `src/components/ceu.tsx` | Her starfield, on canvas, blinking. Static under `prefers-reduced-motion` |
| `src/components/produto/*` | `ProdutoCard`, `GaleriaProduto`, `FichaTecnica`, `BotaoWhatsApp`, `OndeComprar`, `GradeProdutos`, `Filtros`, `FiltroToggle`/`FiltroDrawer` (Zustand-backed) |
| `src/components/colecao/colecao-card.tsx` | Editorial tile for a collection |
| `src/components/revendedor/revendedor-endosso.tsx` | The attribution line — `spec-brand.md` §3 |
| `src/components/marca/cabecalho.tsx` | Shared nav for the marca routes |

## Layout

```
src/app/                 routes: /, /catalogo, /colecoes, /oculos/[slug], /loja/[rev],
                          /apresentacao, icon/og/robots/sitemap
src/app/globals.css      spec-design.md §4.1 tokens
src/components/          visor, visor-cursor, numeracao, marca, ceu, produto/, colecao/, revendedor/
src/lib/site-config.ts   SITE_URL, normalised once
src/lib/marca-paths.ts   the eight paths of the symbol
src/lib/numeracao.ts     mm → "52□18-145" string, shared by the component and lib/lead/link.ts
src/lib/catalog/         Fase 0 catalogue seam — types.ts, source.ts, source.local.ts
src/lib/tenant/          Fase 0 tenancy seam — source.ts, source.local.ts, scope.ts (the ONE scoping fn)
src/lib/lead/link.ts     the ONE wa.me builder — direct link only, no /ir/ attribution yet
src/content/             example catalogue + tenant data — all `exemplo`
src/assets/*.ttf         static Archivo, OG only (Satori)
scripts/verificar-fase-0.mts  budget checks (Lighthouse + Playwright/axe) — not yet extended
                          to the routes above
docs/                    specs, identity board, tasks
references/              brand evidence (*.mov gitignored; frames committed)
```

The Fase 1 target layout (`(marca)` / `(loja)` / `(payload)` / `content/` /
`lib/catalog/`) is in `spec-architecture.md` §10. Do not create those folders in a
task that is not building them.

## Deploy

Mostly static — `pnpm build` prerenders every route with `generateStaticParams`
(`/colecoes/[slug]`, `/oculos/[slug]`, `/loja/[rev]`). `/catalogo` and
`/loja/[rev]/mostruario` render on demand (`ƒ`) because they read URL search params.
Goes up on Vercel straight from the repo, with no environment variables in this phase.

## What must not break

Full list in `AGENTS.md` §0. The ones most easily broken by accident:

- **No invented facts** about her business — price, measurement, city, shop name.
  `[VERIFICAR]` instead. `Consulte o valor` beats a plausible number.
- **No cart in v1.** Everything ends in WhatsApp.
- **A reseller is an endorsement, not a sub-brand.** No colour, logo or font per shop.
- **A bracket frames something real.** A number is a real measurement. `#FFFFFF` means
  "in focus", not text.
- **The wordmark is SVG**, from `marca-paths.ts`, never a substitute typeface.
