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

## Status (2026-08-18)

**Fase 0, in progress.** Next.js 16.3.1 scaffolded, `spec-design.md` §4.1 tokens applied,
and the **pitch page for Amanda** is live at `/apresentacao`
(`TASK-scaffold-e-apresentacao.md`).

**The frontend layout is now built end-to-end against mock data**
(`TASK-frontend-fase-0.md`): `/`, `/colecoes`, `/catalogo`, `/oculos/[slug]`, `/revendedores`,
`/seja-revendedor`, and a Fase-0 storefront stand-in at `/loja/[rev]` all render — every product
and reseller marked `exemplo`. No real photography exists yet, so every gallery shows the honest
"sem foto" state rather than an invented photo. The motion layer (`Revela`, `FocoVerdadeiro`,
`.iridescencia`) now covers the catalogue and storefront routes too, not just `/apresentacao`
(`TASK-motion-vitrine.md`). **`Revela` moved from a CSS-only scroll-timeline to
`motion/react`** (`TASK-revela-motion.md`) — the CSS version only played on an actual scroll
gesture, so it never animated on any page whose content fit in the first viewport (every
grid page) or on first paint anywhere. `ProvedorMotion` now wraps every marca/storefront
route as a result. JS budget: `/catalogo` measured at 240.9 KB (budget ≤180 KB) *before*
this change, already over from the `(marca)`/`Rodape`/`Drawer` work — a full post-change
`pnpm verificar-fase-0` re-run against every route is still owed (see that task doc §4),
the 3–7 KB figures previously here are stale.

**Shop identity and reseller search** (`TASK-loja-identidade-e-busca-revendedores.md`):
`/loja/[rev]/a-loja` (portrait, address, hours — no map until a provider is chosen) and
city/UF chip filters on `/revendedores`. Three `exemplo` resellers in `content/revendedores.ts`
exercise the filter; each has at least one `mostruario` row so storefront links from the
directory are not dead ends.

**Storefront product page is attributed** (`TASK-loja-oculos-slug.md`): `/loja/[rev]/oculos/[slug]`
completes `spec-design.md` §11's storefront route table — same product page as
`/oculos/[slug]`, tenant-scoped (a sku not in that reseller's mostruário 404s there even
if it exists in the brand catalogue) and its WhatsApp CTA names the shop
(`lib/lead/link.ts`'s `revendedorNome`/`cidade`/`uf` fields, spec-architecture.md §7.3's
sentence, minus the `/ir/` `codigo` — that redirect is still Fase 1). `ProdutoCard` and
`GradeProdutos` take an optional `hrefBase` so storefront grids link here instead of the
brand-scoped page; `/catalogo` and the brand product page are unchanged.

**AlignUI foundation vendored** (`TASK-alignui-vendoring.md`): `src/utils/{cn,tv,polymorphic,
recursive-clone-children}` + `Drawer` (and its `CompactButton` dependency) in
`src/components/ui/`, logged in `SOURCES.md`. `FiltroDrawer` now runs on Radix Dialog —
focus trap + Escape-to-close. Token bridge in `globals.css` maps only the AlignUI names
those files use; the CLI theme generator was not run. Everything else (filter chips,
`BotaoWhatsApp`, `ProdutoCard`, `FichaTecnica`) stays hand-written per `spec-design.md` §8.

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
| Tenancy | Mirrors the catalogue seam: `lib/tenant/` + `lib/tenant/scope.ts` (Fase 0, mock data) | three mock resellers, `/loja/[rev]` path stand-in |
| State | Zustand (client UI state, e.g. the filter drawer) + URL search params (filters). TanStack Query deliberately not installed yet | see `AGENTS.md` "State management" |
| UI primitives | AlignUI foundation + `Drawer` vendored (`src/components/ui/`, `src/utils/`) | `Drawer` only — rest deferred per real need |
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

`scripts/verificar-fase-0.mts` (Lighthouse + Playwright/axe) checks `/`, `/apresentacao`,
`/catalogo`, `/colecoes`, `/colecoes/exemplo`, `/revendedores`, `/seja-revendedor`,
`/oculos/TRI-MOD-A`, `/loja/otica-exemplo`, `/loja/otica-exemplo/mostruario`,
and `/loja/otica-exemplo/a-loja` against the budgets in `spec-design.md` §12.

| Route | LCP | CLS | JS transfer |
|---|---|---|---|
| `/` | 1.56s ✓ | 0.000 ✓ | 143 KB ✓ |
| `/catalogo` | 1.61s ✓ | 0.000 ✓ | 147 KB ✓ |
| `/oculos/TRI-MOD-A` | 1.58s ✓ | 0.000 ✓ | 145 KB ✓ |
| `/loja/otica-exemplo/mostruario` | 1.56s ✓ | 0.000 ✓ | 147 KB ✓ |
| `/apresentacao` | **3.77s ✗** | 0.000 ✓ | 178 KB ✓ |

All Playwright checks pass (contrast, keyboard/`.foco-visor`, `Ceu`/`VisorCursor` under
reduced-motion and coarse pointer). **`/apresentacao` LCP is the one open budget** — the
`motion` layer added in `ea6120f`; tracked in `TASK-verificacao-fase-0.md` §6 and the
motion task docs. Run with `pnpm build && PORT=3001 pnpm start` then
`pnpm verificar-fase-0 http://localhost:3001`.

## Routes

| Route | What it is |
|---|---|
| `/` | The real homepage: thesis line, collections, `Desde 2002`. Mock data, `exemplo` labelled |
| `/colecoes`, `/colecoes/[slug]` | Collection list + editorial detail |
| `/revendedores` | Active reseller network — filter by city/UF; each card links to its storefront |
| `/seja-revendedor` | B2B funnel — static copy + WhatsApp CTA (no form until Fase 1) |
| `/catalogo` | Full line, filterable by formato/material/cor/gênero via URL search params |
| `/oculos/[slug]` | Product page — gallery, ficha técnica, numeração, onde comprar, WhatsApp CTA |
| `/sobre` | Honest-partial bio page — confirmed facts (`Desde 2002`, positioning, `Eyewear Addict ❤`) plus a visible `[VERIFICAR]` panel for what Amanda hasn't confirmed yet (her name, her story, portrait use) |
| `/loja/[rev]`, `/loja/[rev]/mostruario`, `/loja/[rev]/a-loja`, `/loja/[rev]/oculos/[slug]` | **Fase 0 path stand-in** for the storefront — three mock resellers (`otica-exemplo`, `otica-demonstracao`, `loja-exemplo`). The product page is tenant-scoped (404s for a sku the shop doesn't carry) and its WhatsApp CTA is attributed to the shop. Shared `src/app/loja/[rev]/layout.tsx` renders `LojaCabecalho` — tabs between the shop's own pages plus a mark link back to the brand site (`TASK-loja-navegacao.md`). Not the final URL shape (see `AGENTS.md` "Storefront routing") |
| `/apresentacao` | The pitch for Amanda — 16 sections, pt-BR, `noindex` |
| `/icon`, `/apple-icon` | Favicon and apple-touch generated from the symbol |
| `/opengraph-image`, `/twitter-image` | Social card 1200×630 |
| `/robots.txt`, `/sitemap.xml` | `/apresentacao`, `/ir/`, `/loja/` stay out of the index |

## Brand components

| File | What it does |
|---|---|
| `src/components/visor.tsx` | The four corner brackets. The system's only ornament |
| `src/components/numeracao.tsx` | `52□18-145` from three numbers in mm; the `□` is SVG |
| `src/components/marca.tsx` | Symbol + lockup. **Approximate redraw** — pending the original vector. `MarcaLockup` takes `simbolo`/`texto`/`subtexto`/`gap` so the same component renders at header scale and hero scale — one logo treatment, not a small icon plus a separate big lockup |
| `src/components/visor-cursor.tsx` | The brackets following the pointer and snapping onto `data-alvo`. Fine pointer only, off under `prefers-reduced-motion` |
| `src/components/ceu.tsx` | Her starfield, on canvas. Dim, slow twinkle (~1.5–4s cycle), ~1 in 4 stars `--ouro`. Static under `prefers-reduced-motion` |
| `src/components/produto/*` | `ProdutoCard`, `GaleriaProduto`, `FichaTecnica`, `BotaoWhatsApp`, `OndeComprar`, `GradeProdutos`, `Filtros`, `FiltroToggle`/`FiltroDrawer` (Zustand-backed; drawer chrome is AlignUI `Drawer`) |
| `src/components/ui/drawer.tsx` | AlignUI `Drawer` — vendored, Radix Dialog. Powers `FiltroDrawer` |
| `src/utils/cn.ts`, `tv.ts`, `polymorphic.ts`, `recursive-clone-children.tsx` | AlignUI foundation utils — vendored byte-identical |
| `src/components/colecao/colecao-card.tsx` | Editorial tile for a collection |
| `src/components/revendedor/revendedor-endosso.tsx` | The attribution line — `spec-brand.md` §3 |
| `src/components/revendedor/filtro-revendedores.tsx` | City/UF chip filter on `/revendedores` — URL search params, same idiom as product filters |
| `src/components/marca/cabecalho.tsx` | Shared nav for the marca routes, small `MarcaLockup` as the header logo |
| `src/components/marca/rodape.tsx` | Shared footer — brand blurb, nav, contact column (WhatsApp/email/Instagram, honest-absence fallback), legal bar with studio credit |

## Layout

```
src/app/(marca)/         route group sharing one layout (Ceu, VisorCursor, Cabecalho,
                          Rodape): /, /catalogo, /colecoes, /oculos/[slug], /revendedores,
                          /seja-revendedor, /sobre — chrome-sharing only, no URL segment,
                          NOT the Fase 1 target (marca)/ below (see note after this tree)
src/app/loja/[rev]/      Fase 0 storefront path stand-in (+ mostruario, a-loja, oculos/[slug]) —
                          own layout.tsx + LojaCabecalho (RevendedorEndosso + tab nav),
                          deliberately outside (marca)/
src/app/apresentacao/    the pitch, own chrome, icon/og/robots/sitemap alongside it
src/app/globals.css      spec-design.md §4.1 tokens
src/components/          visor, visor-cursor, numeracao, marca, ceu, produto/, colecao/, revendedor/, ui/
src/utils/               AlignUI foundation (cn, tv, polymorphic, recursive-clone-children)
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

The Fase 1 target layout (`(loja)` / `(payload)` / `content/` / `lib/catalog/`) is in
`spec-architecture.md` §10. Do not create those folders in a task that is not building
them. `(marca)/` is the one exception already built (`TASK-footer.md`) — it exists today
purely to share `Cabecalho`/`Rodape`/`Ceu`/`VisorCursor` across the brand-site routes, has
no dependency on `middleware.ts` or the domain, and isn't itself the Fase 1 migration —
just a head start on the folder shape.

## Deploy

Mostly static — `pnpm build` prerenders every route with `generateStaticParams`
(`/colecoes/[slug]`, `/oculos/[slug]`, `/loja/[rev]`, `/loja/[rev]/a-loja`,
`/loja/[rev]/oculos/[slug]`). `/catalogo` and `/loja/[rev]/mostruario` render on demand
(`ƒ`) because they read URL search params.
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
