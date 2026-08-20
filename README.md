# Trísion Eyewear

A sophisticated Brazilian eyewear brand platform connecting one curated catalogue to an independent reseller network. Built with Next.js 16, Payload CMS, Postgres, and Vercel.

**`Desde 2002`** — 24 years of optical expertise, now on the web.

---

## Core Concept

**One catalogue. Many storefronts. Every lead back to Amanda.**

Trísion is an existing eyewear brand managed by Amanda. This platform allows her to:
- Maintain a unified catalogue of frames, controlled centrally
- Give independent optical shops a branded storefront, showing the same catalogue everywhere
- Route all customer inquiries directly to Amanda via WhatsApp, attributed to the reseller that sent them (so she knows who to pay commission)

Each reseller operates a branded storefront at their own domain, showing Trísion's full catalogue — there is no per-reseller selection (decided 2026-08-20, `docs/tasks/TASK-catalogo-unico-sem-mostruario.md`). The storefront exists for endorsement and attribution, not curation; the brand maintains editorial control over the catalogue, collections, and the core brand identity.

---

## Documentation

All specifications, design system details, architecture decisions, and implementation guides live in `/docs`:

| Document | Purpose |
|----------|---------|
| [`spec-brand.md`](docs/spec-brand.md) | Brand identity, voice, positioning, and open questions requiring confirmation |
| [`spec-design.md`](docs/spec-design.md) | Visual system: tokens, components, motion, performance budgets, accessibility rules |
| [`spec-architecture.md`](docs/spec-architecture.md) | Platform design: multi-tenancy model, data schema, phasing, API structure |
| [`AGENTS.md`](AGENTS.md) | Development workflow: task-document process, stack assumptions, things that must not break |
| [`docs/tasks/`](docs/tasks/) | Implementation tracking: one document per unit of work, no code before a task doc |

**How to work here:** Read `AGENTS.md` first. Every code change begins with a task document in `docs/tasks/` describing current state, planned changes, and verification criteria.

---

## Status

### Fase 0: Frontend Complete ✓
- Brand homepage, collection browsing, product catalogue, reseller directory
- Fase 0 path-based storefront at `/loja/[rev]` (temporary until domain is confirmed)
- All routes render against mock data from `src/content/`
- Motion layer (`motion/react`) applied to all marca and storefront routes
- Performance budgets met (LCP ≤1.6s, JS ≤180 KB, CLS 0.000) — except `/apresentacao` at 3.77s (tracked)
- Pitch presentation (`/apresentacao`) ready for Amanda

### Fase 1: CMS Foundation Landed ✓ (2026-08-18)
- **Payload 3.88** mounted at `/admin` with multi-tenant plugin
- **Five collections + one global** implemented: `Produtos`, `Colecoes`, `Revendedores`, `Usuarios`, `Config`. (`Mostruario` was built here and removed 2026-08-20 — see the note below.)
- **Postgres + Vercel Blob** adapters wired (requires marketplace provisioning)
- **Seam swap complete:** `lib/catalog/source.ts` and `lib/tenant/source.ts` now select between Payload (live) and mock data (offline fallback)
- **Access control matrix** implemented and tested — resellers can only edit their own data
- **OG cards and structured data** on all routes (product pages, collections, reseller storefronts)

**What's working now:**
- Without `DATABASE_URL`: all routes render from `src/content/` mock data
- With `DATABASE_URL` set: `/admin` loads Payload, and routes query Postgres when the database is reachable

### One catalogue everywhere — `Mostruario` removed (2026-08-20)

Every reseller storefront now shows Trísion's full active catalogue, identical for every
shop. Resellers no longer select or curate which frames they carry — Amanda fulfills
every sale herself regardless of which shop referred the customer, so the earlier
per-reseller `Mostruario` join collection (and the reseller-facing "toggle grid" admin
view it implied) bought nothing and has been deleted. The storefront's job is now
endorsement and lead attribution only. See
[`docs/tasks/TASK-catalogo-unico-sem-mostruario.md`](docs/tasks/TASK-catalogo-unico-sem-mostruario.md).

### Fase 2: Lead Attribution & Dashboard (Planned)
- `/ir/[rev]/[sku]` redirect for tracking which reseller sent the lead
- Admin dashboard for Amanda to view sourcing by shop
- (Waiting for question #6 answer: where does the WhatsApp button point?)

### Fase 3: Self-Service & Scaling (Planned)
- Reseller self-onboarding flow
- Custom reseller domains (awaiting answer to question #4: the apex domain)
- CSV product import
- (Blocked on all three questions in `spec-brand.md` §6)

---

## Quick Start

### Prerequisites
- Node 24 LTS
- pnpm 11.21.0
- Postgres database (Neon, Supabase, or similar)
- Vercel Blob token (for image storage)

### Installation

```bash
# Clone and install
pnpm install

# Set up environment
cp .env.example .env
# Fill in: DATABASE_URL, DATABASE_URL_UNPOOLED, PAYLOAD_SECRET, BLOB_READ_WRITE_TOKEN
```

### First Run

```bash
# Start dev server — Drizzle will prompt for schema migration
pnpm dev
# → Open http://localhost:3000
# → Visit /admin, create first admin user in `Usuarios` collection
```

**Drizzle migration note:** When upgrading from Payload's blank template (`users`, `media`) to Trísion's schema (`usuarios` + 6 collections), always choose **"create table"** for new collections, never "rename table." Renaming leaves orphaned foreign keys that break the migration.

If the schema push fails midway:
```bash
pnpm payload:fix-rels    # Repair stale FK constraints (dev only)
# Or, for a clean slate:
pnpm payload:reset-db    # Drops public schema, next `pnpm dev` starts fresh
```

### Key Commands

```bash
pnpm dev                  # Dev server with hot reload
pnpm build && pnpm start  # Production build and serve
pnpm lint                 # ESLint check
pnpm test:tenancy         # Verify access-control rules (Vitest)
pnpm payload:verify       # Smoke-test Payload init without admin UI
pnpm payload:seed         # Seed mock data from content/ into Postgres (idempotent)
pnpm verificar-fase-0     # Run Lighthouse + Playwright checks (requires pnpm start running)
```

---

## Stack

| Layer | Technology | Status |
|-------|-----------|--------|
| **Framework** | Next.js 16.3.1 (App Router, TypeScript, `src/` directory) | ✓ Active |
| **Styling** | Tailwind CSS v4, tokens in `src/app/globals.css` (dark mode only) | ✓ Active |
| **CMS** | Payload 3.88 with multi-tenant plugin at `/admin` | ✓ Landed |
| **Database** | Postgres via `@payloadcms/db-postgres` | Adapters ready |
| **Storage** | Vercel Blob for product photos and reseller portraits | Adapters ready |
| **Rich Text** | Payload Lexical editor for collection descriptions | ✓ Integrated |
| **UI Components** | AlignUI foundation + `Drawer` (vendored, `src/components/ui/`) | ✓ Partial |
| **Motion** | motion/react for scroll-triggered animations | ✓ Active |
| **Client State** | Zustand for ephemeral UI state (filters, drawer toggles) | ✓ Active |
| **Server State** | URL search params for filterable routes (soft navigation) | ✓ Active |
| **Conversion** | WhatsApp via `wa.me` links (no cart, no checkout) | ✓ Active |
| **Analytics** | JSON-LD (Organization, Product, WebSite structured data) | ✓ Active |
| **Deployment** | Vercel | ✓ Live |

**Note on versions:** All version numbers are a snapshot, not a pin. Before adding any dependency, check the framework's current docs first — APIs and conventions may have changed. See `AGENTS.md` §2.0.

---

## Architecture at a Glance

### Catalogue & Tenancy Seams

The app reads product and reseller data through two pluggable interfaces:

- **`src/lib/catalog/source.ts`** — Returns products and collections. Selects between `source.payload.ts` (live Postgres) or `source.local.ts` (mock data from `src/content/`) based on `DATABASE_URL`.
- **`src/lib/tenant/source.ts`** — Returns reseller data. Same selection logic. One scoping function `lib/tenant/scope.ts` enforces that a reseller user can only read their own data.

This design allows Fase 0 to run without a database (dev demos) and Fase 1 to swap in Payload without rewriting the app.

### Collections (Fase 1)

| Collection | Ownership | Editable By | Notes |
|-----------|-----------|------------|-------|
| `Productos` | Brand | Admin only | Global, not tenant-scoped. Lock: admin cannot be created by reseller role. |
| `Colecoes` | Brand | Admin (read for reseller) | Editorial collections, brand voice only. |
| `Revendedores` | Admin | Admin + reseller (field-level) | Tenant collection. Reseller can edit: contact, address, hours, portrait, bio. Admin controls: name, slug, city, UF, status, lead destination. No tenant-scoped catalogue collection sits under it — every reseller reads `Productos` directly. |
| `Usuarios` | Admin | Admin | Role: `admin` or `revendedor`. Multi-tenant plugin manages tenant membership. |
| `Config` | Admin | Admin | Global. Brand WhatsApp, socials, home hero, footer, founding year. |

### Multi-Tenancy Model

- Each row of `Revendedores` is a tenant
- No collection is listed in `plugin-multi-tenant`'s `collections` config — there's nothing
  left to filter by tenant. The plugin still does real work: it adds the `tenants` array
  field to `Usuarios` (so `revendedorOwnTenantUpdate` in `src/payload/access.ts` knows which
  `Revendedores` row a given reseller user may edit) and the `revendedor` tenant field +
  admin selector on `Revendedores` itself
- `Productos` and `Colecoes` are global so all resellers see the same catalogue
- `Usuarios` is global (admin is global, reseller auth is tenant-agnostic)

---

## Routes

### Brand Site (`/marca/*`)
| Path | Purpose |
|------|---------|
| `/` | Homepage: thesis, featured collections, 24-year mark |
| `/catalogo` | Full product line, filterable by format/material/colour/gender |
| `/colecoes`, `/colecoes/[slug]` | Collection list and editorial detail |
| `/revendedores` | Active reseller directory, filterable by city/state |
| `/seja-revendedor` | B2B pitch + WhatsApp CTA (no form yet) |
| `/sobre` | Brand story — confirmed facts only, `[VERIFICAR]` panel for unknowns |
| `/oculos/[slug]` | Product detail: gallery, specs, numeração, where to buy, WhatsApp CTA |

### Storefronts (`/loja/*` — temporary path-based routing)
| Path | Purpose |
|------|---------|
| `/loja/[rev]` | Storefront: full active catalogue (same one everywhere, filterable), shop's `sobre` blurb, endorsement line |
| `/loja/[rev]/a-loja` | Shop detail: address, hours, contact |
| `/loja/[rev]/oculos/[slug]` | Product detail, WhatsApp CTA names the shop for commission attribution |

**Note:** This path-based routing (`/loja/[rev]`) is the Fase 0 stand-in. Fase 1+ targets wildcard subdomains (`loja-exemplo.trision.com.br`) via `middleware.ts` Host rewriting — blocked on confirming the apex domain (question #4 in `spec-brand.md`).

**Every reseller storefront shows the same catalogue** (decided 2026-08-20,
`docs/tasks/TASK-catalogo-unico-sem-mostruario.md`). A reseller does not curate or select
products — the storefront exists for brand endorsement and lead attribution (so Amanda
knows which shop to pay commission on), not for a per-shop assortment.

### Admin & System
| Path | Purpose |
|------|---------|
| `/admin` | Payload CMS: manage products, resellers, inventory, media |
| `/api/[...slug]` | Payload REST & GraphQL API |
| `/opengraph-image`, `/twitter-image` | Dynamic social cards |
| `/icon`, `/apple-icon` | Favicon (SVG paths from `marca-paths.ts`) |

---

## Brand Components

All hand-written to embody the brand identity:

| Component | Purpose | File |
|-----------|---------|------|
| `Visor` | Four corner brackets — the brand's only ornament | `src/components/visor.tsx` |
| `VisorCursor` | Brackets following the pointer, snapping to focused elements | `src/components/visor-cursor.tsx` |
| `Numeracao` | Optical measurements: `52□18-145` from three mm values, SVG box | `src/components/numeracao.tsx` |
| `Marca` | Symbol + wordmark, scales from header to hero | `src/components/marca.tsx` |
| `Ceu` | Starfield canvas — dim, slow twinkle, ~25% gold stars | `src/components/ceu.tsx` |
| `MarcaCabecalho` | Shared brand-site nav | `src/components/marca/cabecalho.tsx` |
| `Rodape` | Shared brand-site footer | `src/components/marca/rodape.tsx` |
| `ProdutoCard`, `GradeProdutos`, `GaleriaProduto`, `FichaTecnica` | Product browsing and detail | `src/components/produto/*` |
| `FiltroDrawer`, `FiltroToggle`, `FiltroRevendedores` | Faceted search (Zustand-backed) | `src/components/produto/*` |
| `Drawer` | AlignUI dialog primitive (vendored) | `src/components/ui/drawer.tsx` |
| `RevendedorEndosso` | Reseller attribution line (spec-brand.md §3) | `src/components/revendedor/*` |

---

## Key Files

```
src/app/
  (marca)/              Brand-site route group (shared Ceu, VisorCursor, nav, footer)
  loja/[rev]/           Fase 0 storefront path stand-in
  apresentacao/         Amanda's pitch (16 sections, pt-BR, noindex)
  globals.css           Tailwind tokens per spec-design.md §4.1
  layout.tsx            Root layout: Archivo font, dark mode, structured data

src/lib/
  catalog/              Product/collection data seam
    source.ts           Selection point: payload or mock
    source.payload.ts   Payload implementation (Fase 1)
    source.local.ts     Mock data from content/ (Fase 0 fallback)
    types.ts            Shared types
  tenant/               Reseller/inventory data seam
    source.ts           Selection point: payload or mock
    source.payload.ts   Payload implementation (Fase 1)
    source.local.ts     Mock data from content/
    scope.ts            Single scoping function — enforces tenant boundaries
  marca-paths.ts        SVG paths for symbol (favicon, header, OG cards all read from here)
  numeracao.ts          mm → "52□18-145" string formatter
  lead/link.ts          Single WhatsApp URL builder
  site-config.ts        SITE_URL normalization

src/content/            Mock data for Fase 0 (marked `exemplo`)
  produtos.ts
  colecoes.ts
  revendedores.ts

src/components/         Brand components + product/reseller UI
src/utils/              AlignUI foundation (cn, tv, polymorphic, recursive-clone-children)
src/collections/        Payload collection schemas (Fase 1)
src/globals/            Payload global schemas (Fase 1)

payload.config.ts       Payload CMS configuration
.env.example            Environment variables template

docs/
  spec-brand.md         Brand audit, positioning, voice, open questions
  spec-design.md        Design system, tokens, performance budgets
  spec-architecture.md  Platform design, data model, phasing
  tasks/                Implementation task documents (one per unit of work)
  identidade.html       Internal identity reference board

scripts/
  verificar-fase-0.mts  Lighthouse + Playwright budget checks
  seed-mock-data.mts    Load content/ into Postgres
  verify-payload-init.mts  Smoke test
  fix-payload-rels.mts  Repair migration constraints
  reset-payload-db.mts  Drop schema for clean migration

```

---

## Development Workflow

1. **Before touching code:** Write a task document at `docs/tasks/TASK-<slug>.md`
   - Current scenario (what exists, what's missing)
   - Planned changes (file by file, why each change)
   - Why (justification, so reviewers can push back early)
   - Affected files (table of what changes and how)
   - Verification (measurable, no "works" or "looks good")

2. **While coding:**
   - Use CLI generators (`next`, `payload`, `tailwind`) over hand-authoring
   - Write `[VERIFICAR: what to check and who to ask]` for any uncertain facts
   - Prefer the existing seams: plug into `lib/catalog/source.ts` or `lib/tenant/source.ts`, don't rewrite around them

3. **Before declaring done:**
   - Update `README.md`, `AGENTS.md`, `spec-*.md`, `.env.example` as affected
   - Verify the build passes: `pnpm build`
   - Run the test suite: `pnpm test:tenancy`
   - Run Lighthouse checks: `pnpm verificar-fase-0`
   - Commit once everything is verified

---

## Performance & Accessibility

**Budget targets** (per `spec-design.md` §12):
- LCP: ≤1.6 seconds
- CLS: 0.000
- JS transfer: ≤180 KB (storefront routes)

**Current status** (as of Fase 1 CMS landing):
| Route | LCP | CLS | JS | Status |
|-------|-----|-----|----|-|
| `/` | 1.56s | 0.000 | 143 KB | ✓ |
| `/catalogo` | 1.61s | 0.000 | 147 KB | ✓ |
| `/oculos/[slug]` | 1.58s | 0.000 | 145 KB | ✓ |
| `/loja/[rev]` | `[VERIFICAR: re-run pnpm verificar-fase-0 — route now serves the full catalogue, not the old /mostruario page these numbers were measured against]` | | | |
| `/apresentacao` | 3.77s | 0.000 | 178 KB | ✗ LCP over (motion layer pending optimization) |

**Accessibility:** All routes pass WCAG AA contrast checks, keyboard navigation, focus indicators (via `.foco-visor`), and reduced-motion rendering (Ceu is static, VisorCursor is disabled).

---

## Blocking Questions

One answer still blocks scaling further (tracked in `spec-brand.md` §6 — most of the
eleven questions there were answered 2026-08-20):

| # | Question | Impact | Status |
|---|----------|--------|--------|
| 4 | **Who controls DNS/registrar access for `trision.com.br`?** | Blocks wildcard subdomain routing, multi-tenant URLs, Fase 1+ launch | Domain string confirmed 2026-08-20 (currently points at a Wbuy storefront); DNS/registrar access still `[VERIFICAR]` |
| 6 | **Where does the WhatsApp button point?** (Amanda's number or local reseller?) | Affects every CTA on the site | **Answered 2026-08-20** — always Amanda ("deverá ser comigo"); `destinoLead` stays available but should never be set to `revendedor` in practice |
| 7 | **Pricing model:** per-reseller or one suggested price? | Decided whether a per-reseller price-override field would exist | **Answered 2026-08-20** — one price everywhere ("mesmo preço, tabelado"); no such field will be built |

---

## Environment Variables

Copy `.env.example` → `.env` and fill:

```env
# Required for database & CMS
DATABASE_URL="postgresql://..."        # Pooler connection (for app)
DATABASE_URL_UNPOOLED="postgresql://..." # Direct connection (for migrations)
PAYLOAD_SECRET="<random 32+ char string>"

# Required for image storage
BLOB_READ_WRITE_TOKEN="<vercel blob token>"

# Site config
NEXT_PUBLIC_SITE_URL="https://trision.vercel.app"  # Override when apex domain is confirmed

# WhatsApp (brand default, overrideable per-reseller in Payload)
WHATSAPP_MARCA="+5524999999999"  # [VERIFICAR: actual number]
```

If `DATABASE_URL` is not set, the app runs entirely from mock data in `src/content/`.

---

## Deployment

Push to GitHub → Vercel builds and deploys automatically. No environment variables needed for Fase 0 (all routes render from mock data). For Fase 1+, configure Postgres and Blob through Vercel's dashboard or Marketplace.

**Preview deployments** work the same way — each branch gets its own URL.

---

## Payload First-Run Checklist

1. Fill `.env` with `DATABASE_URL` (pooler), `DATABASE_URL_UNPOOLED` (direct), `PAYLOAD_SECRET`, `BLOB_READ_WRITE_TOKEN`
2. Run `pnpm dev` and answer Drizzle migration prompts (always **create**, never **rename**)
3. Visit `/admin` and create the first admin user (Usuarios collection)
4. If Drizzle fails with constraint errors, run `pnpm payload:fix-rels`
5. Verify all collections/globals exist: Usuarios, Media, Colecoes, Productos, Revendedores, Config

---

## What Must Not Break

**Non-negotiable rules** — enforced by design, tests, and code review:

- **No invented facts** about the business (prices, measurements, city names, shop names). Write `[VERIFICAR]` instead.
- **No cart or checkout.** Every path ends in WhatsApp (`wa.me`).
- **A reseller is an endorsement, not a sub-brand.** No per-reseller colors, logos, or fonts. Ever.
- **A bracket frames something real** — not a decoration. A measurement is a real mm value, not a placeholder.
- **`#FFFFFF` means "in focus"** — focused element only, not text color.
- **No second accent color.** Gold appears on lines, edges, and one button. Never on text over a lens.
- **Radius = 0** (sharp corners). One exception: `--radius-lente: 2px` for lens elements.
- **The wordmark is SVG**, paths from `marca-paths.ts`, never a substitute typeface.
- **Dark mode only** — no light-mode toggle, no `prefers-color-scheme` swap.
- **`prefers-reduced-motion` is a complete experience** — Ceu is static, VisorCursor is off.
- **One WhatsApp builder:** `lib/lead/link.ts` only.
- **One tenancy scope:** `lib/tenant/scope.ts` only.
- **AlignUI is vendored byte-identical** when installed — restyle via tokens only.

See `AGENTS.md` §0 for the full list and rationale.

---

## Support & Contribution

This is a paid client project. All work follows the task-document process in `AGENTS.md`. For questions about the codebase, the brand, or the platform architecture, refer to the docs in `/docs` first — they are the source of truth.

To report issues or request features, open a GitHub issue with:
- What you tried
- What you expected
- What happened instead
- The task document (if one exists) or the spec section affected

---

**Built with ❤ for Trísion Eyewear.**
