<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Workflow Guidelines — Trísion Eyewear (Brand Site + Reseller Storefronts)

> This file follows a portable process template (plan before you touch anything, lean on
> existing tooling while you work, treat documentation as part of the deliverable when you
> finish) instantiated for this specific project. Section 0 is project-specific; sections
> 1–4 are the portable rules with paths and examples adapted to this repo.
>
> The philosophy in one line: **Plan before you write, lean on existing tooling while you
> work, and treat documentation as part of the deliverable when you finish.**
>
> Closest siblings: **F&A Móveis** (catalogue, WhatsApp, no cart, existing brand, demo
> before the money) and **Prumo** (Payload inside Next, tenant-shaped admin). Do not
> import Flora's monorepo, NestJS, or satellite pipeline into this repo.

---

## 0. Project context — Trísion Eyewear

The brand, the visual system and the platform live in **`docs/spec-brand.md`**,
**`docs/spec-design.md`** and **`docs/spec-architecture.md`**. Read brand §1–§3 and
architecture §1–§6 before writing anything. Those three files are the source of truth
for *what to build*; this file covers *how to work*. The root `README.md` is the
implementation README (setup, scripts, status).

**Trísion Eyewear** is a Brazilian eyewear label, founded 2002, owned by **Amanda**. She
sells through independent optical shops. Today the brand's entire web presence is a
Linklist page and a one-screen Canva site. Resellers have nothing.

The product in one sentence: **one catalogue, many storefronts, and every lead still
lands with Amanda — attributed.** A reseller is an endorsement, not a sub-brand
(`spec-brand.md` §3). There is no cart, no checkout, no payments. Every path terminates
in WhatsApp, the same commercial shape as F&A Móveis.

**This is a paid client project. Fase 0 comes before the rest of the money**, exactly as
it did with Fátima — a working brand site on her real identity, shown on her phone.
Phasing and the cost ladder: `spec-architecture.md` §3.

**The brand already exists.** Name (accent included), bracket mark, `Tr` ligature,
starfield ground, gold (`#CCA866`, sampled from her lockup), `Since 2002`, first-person
voice. The job is to bring that identity onto the web with better craft — not to invent
Trísion (`spec-brand.md` §4).

### Status

**Fase 0 frontend complete; Fase 1 CMS foundation landed** (`TASK-payload-tenancy.md`).
Payload 3.88 at `/admin` (blank template install). Six Trísion collections/globals +
multi-tenant plugin + Blob. Seams: `catalogSource` / `tenantSource` with Payload fallback
to `content/` mock when DB unreachable or schema not pushed.

**The frontend layout is built end-to-end against mock data**
(`TASK-frontend-fase-0.md`): `/`, `/colecoes`, `/catalogo`, `/oculos/[slug]` and a
Fase-0 storefront stand-in at `/loja/[rev]` all render, every product/reseller marked
`exemplo`. No real photography exists yet (`TASK-normalizar-imagens.md` is written but
not built), so every gallery shows the honest "sem foto" empty state, not an invented
photograph. AlignUI foundation + `Drawer` are vendored (`TASK-alignui-vendoring.md`); filter
chips and other brand-owned surfaces stay hand-written on the token system. shadcn/React Bits
are still not installed.

The live URL is `https://trision.vercel.app` (`src/lib/site-config.ts`). Wildcard
subdomains — and therefore every multi-tenant route — wait on the apex domain. Amanda
confirmed 2026-08-17 that she owns one; the exact domain and DNS/registrar access are still
`[VERIFICAR]` (`spec-brand.md` §6 question 4).

### Brand identity (for copy, tone, and component decisions)

- **Thesis:** *A frame is a decision about what you look at.* That sentence is the brand,
  the design system (`spec-design.md` §3) and the data model (`spec-architecture.md` §5)
  at once. It was already in the logo.
- **Promise:** frames chosen by someone who is genuinely obsessed with them. Not the
  widest catalogue — the *right* one.
- **The asset nobody else has:** 24 years. `Desde 2002` is a mark, set small, near the
  logo. Never `Há mais de 20 anos no mercado`.
- **Audiences:** two, and they are different people (`spec-brand.md` §2.1). The wearer
  lands on a reseller storefront; the reseller lands on the brand site. Both funnels
  terminate in the same inbox.
- **Personality:** precise, quietly confident, warm underneath. An optician's eye, not a
  boutique's pose. Not luxury-eyewear pastiche (no serif-and-marble, no invented European
  heritage). Not playful (`references/frames/eyewearjunkie/` is the negative).
- **Voice:** measured, specific, first person. Portuguese a real optician in Rio de
  Janeiro state would speak. `"Fale comigo"` is Amanda; `"A Trísion trabalha com…"` is
  the label. Do not mix them inside one sentence. Customer-facing copy is always
  **pt-BR**; `Trísion` without the accent is a misspelling, including in `<title>`, OG
  tags and WhatsApp messages (`spec-brand.md` §5).
- Any new copy (microcopy, empty states, CTAs) must sound like the same voice. If it
  reads like generic eyewear e-commerce, it is wrong for this brand.

### Stack (per `spec-architecture.md` §4)

| Layer | Choice | Status |
|---|---|---|
| Framework | **Next.js** (App Router, TypeScript, `src/` dir, `@/*` alias) — **≥ 16.2.0 required** (Payload will not support 15.5–16.1.x). Always the current stable major, never a pinned number (see §2.0) | scaffolded, 16.3.1 |
| Styling | Tailwind v4, CSS-first in `src/app/globals.css`. Tokens mapped 1:1 to `spec-design.md` §4.1. Dark only — no light-mode toggle, no `prefers-color-scheme` swap | built |
| Brand components | Hand-written: `Visor`, `VisorCursor`, `Numeracao`, `Marca`/`MarcaLockup`, `Ceu` (`src/components/`). No generator produces these; they are the brand | built |
| Components (later) | AlignUI (vendored, primary) → shadcn (gaps only) → React Bits (`spec-design.md` §8). **Foundation utils + `Drawer` vendored** (`src/utils/`, `src/components/ui/drawer.tsx`); rest deferred per real need | partial — `Drawer` only |
| Catalogue, Fase 0 | Typed TS modules in `content/` behind the same domain types Payload will later implement. **The seam is `lib/catalog/source.*.ts`.** Nothing outside those files imports a Payload type | wired — `/`, `/colecoes`, `/catalogo`, `/oculos/[slug]` render it, example data, `TASK-frontend-fase-0.md` |
| Tenancy seam, Fase 0 | Mirrors the catalogue seam: `lib/tenant/source.*.ts` + **`lib/tenant/scope.ts`**, the one place that reads `revendedores`/`mostruario` (`spec-architecture.md` §6.1). One mock reseller, path-routed at `/loja/[rev]` — **not** the real subdomain shape, see the routing row below | seam scaffolded, mock data, `TASK-frontend-fase-0.md` §2.4 |
| CMS, Fase 1 | **Payload ≥ 3.73.0**, mounted at `/admin`, `@payloadcms/plugin-multi-tenant`. Collections it does *not* list stay global — which is how `produtos` stays brand-owned | **started** — 3.88.0, Trísion collections, `/admin` |
| Data + files, Fase 1 | Postgres via `@payloadcms/db-postgres` (provider chosen at scaffold time, not from memory) + Vercel Blob | wired — Neon in `.env`, Blob token in `.env.example` |
| Client/server state | **Zustand** for client-only ephemeral UI state shared between sibling components with no natural parent (e.g. the mobile filter drawer, `components/produto/filtro-store.ts`) — plain `create()`, no provider. **URL search params + Server Components** for anything shareable/filterable (`/catalogo` filters), per Next's own guidance over either state library. **TanStack Query is not installed** — Fase 0 has no live/mutable server data for it to manage; see the state-management note below before reaching for either library | zustand 5, `@tanstack/react-query` deliberately absent |
| Conversion | `wa.me` deep links via **`lib/lead/link.ts`** — the one builder (`spec-architecture.md` §6.3), used directly (no `/ir/` attribution redirect yet — needs the Payload `leads` collection, Fase 1). **No cart, no checkout, no payments in v1** | `lib/lead/link.ts` built, direct-link only |
| Storefront routing | Target: `<slug>.trision.com.br` via `middleware.ts` Host rewrite (`spec-architecture.md` §8) — blocked on the domain. Fase 0 stand-in: `/loja/[rev]` as a real path segment, **not** the `(loja)` route group the target layout shows below — very likely deleted, not evolved, once the domain lands | Fase 0 stand-in only |
| Hosting | Vercel. Wildcard domain + Routing Middleware are the two features Fase 1 depends on | live at a Vercel URL; apex domain open |
| Package manager | **pnpm**, decided at scaffold time, never mixed | pnpm 11.21.0 |

**Version numbers written anywhere in this repo are a snapshot, not a pin.** See §2.0
before adding a dependency.

### State management — which tool, and why

Researched and decided in `TASK-frontend-fase-0.md` §3; keep applying this instead of
re-deriving it per task.

1. **Server Components own initial data.** A page reads `lib/catalog/source.ts` /
   `lib/tenant/scope.ts` directly, awaited, no client fetch. Fase 0's data is synchronous
   local TS, so there is nothing to keep in sync after the first render — which is
   specifically TanStack Query's job, not a Server Component's.
2. **TanStack Query is not installed.** Its real job — request-scoped `QueryClient` via
   `cache()`, `HydrationBoundary`, `useSuspenseQuery` — starts once a page needs to
   *revalidate, mutate, or poll* live data. Nothing does yet. Installing the provider
   before that would sit in every route's client bundle for zero benefit (storefront JS
   budget ≤180 KB gzipped, `spec-design.md` §12) — install it when a real feature needs
   it (first candidate: the Fase 1 reseller mostruário toggle grid,
   `spec-architecture.md` §5.3), not speculatively. When it lands, the pattern is: a
   per-request `getQueryClient` via React's `cache()`, `queryClient.prefetchQuery` (not
   awaited) in the Server Component wrapped in `<HydrationBoundary state={dehydrate(...)}>`,
   and `useSuspenseQuery` in the client leaf underneath.
3. **Filterable/shareable state (e.g. `/catalogo`'s formato/material/cor/gênero) is URL
   search params, read by the Server Component** — not a client store. Matches Next's
   own soft-navigation model (no client fetch on a filter click) and makes filtered URLs
   shareable, which is a real product win here (a reseller can send a customer a
   pre-filtered link).
4. **Zustand is for client-only ephemeral UI state shared between components with no
   natural common parent** — e.g. `components/produto/filtro-store.ts`, split between a
   toolbar badge and an off-canvas drawer. A plain `create()` (no provider, no
   per-request factory) is correct whenever the store's initial state is *not* seeded
   from server/request data and is never read during SSR — which is true of every
   client-only UI store in this repo so far. The heavier `createStore` + Context-provider
   factory pattern from Zustand's own Next.js guide exists only for stores whose initial
   state comes from the request; don't reach for it by default.
5. **When one component owns a piece of state alone, `useState` is correct** — e.g.
   `GaleriaProduto`'s selected-thumbnail index. Neither Zustand nor Context is needed
   just because a library is available. A Context provider wrapping a page also forces
   everything inside it — including the Server Component page body — into the client
   boundary; that's the concrete reason Zustand, not Context, backs `filtro-store.ts`.

### Things that must not break

These are not style preferences. Each one is either the product thesis, a brand rule, or
a lesson already paid for on a sibling project.

- **Never invent a fact about her business** — not a price, not a measurement, not a
  city, not a reseller's name, not that the woman in the portrait is Amanda. Write
  `[VERIFICAR: what to check and who to ask]` inline instead. `Consultar` / `Consulte o
  valor` beats a plausible number. A wrong figure shown to Amanda loses the room
  (`spec-brand.md` §5). Example frames on `/apresentacao` are labelled `exemplo` on the
  slide itself, not merely in a comment.
- **No cart, no checkout, no payments in v1.** Every path ends in WhatsApp
  (`spec-brand.md` §2.2, `spec-architecture.md` §2).
- **A reseller is an endorsement, not a sub-brand.** No colour field, no logo field, no
  font field, ever — enforced in the data model (`spec-architecture.md` §5.2), not only
  in a document. A reseller controls name, city, contact, one photograph, and which
  frames it carries. Never a token (`spec-brand.md` §3).
- **A bracket frames something real** (`spec-design.md` §3.1). Focus, selection, a
  product, a section, a crop. A bracket decorating an empty area is out of spec — the
  analogue of F&A Móveis' "a hairline rule must carry a real number."
- **A number on this site is a real measurement.** `52□18-145` is data from
  `produtos.medidas`, stored as millimetres and formatted at the edge. Never store the
  string. A product with no measurements renders **no** numeração — not a placeholder
  (`spec-design.md` §5). The `□` is drawn as inline SVG in `Numeracao`; never substitute
  `-`, `x`, or `/`.
- **`--foco` (`#FFFFFF`) is not a text colour.** Body is `--luz`. Pure white is reserved
  for the element currently in focus, hovered, or selected — one element on screen at a
  time (`spec-design.md` §4.2).
- **No second accent colour.** Gold is light, not paint: hairlines, edges, small marks,
  one button. `--ouro` may not appear on `--lente` (measured 1.87, fails); on the plate
  the accent is `--ouro-fundo`. Text on an `--ouro` fill is `--noite`, never white. The
  fix for a flat screen is a better photograph (`spec-design.md` §4.2).
- **Sharp corners.** `--radius: 0`. The one exception is named: `--radius-lente: 2px`,
  so it cannot spread (`spec-design.md` §3.2).
- **The wordmark is SVG, never a typeface.** Paths live in `src/lib/marca-paths.ts` and
  are the only source — header, favicon, apple-touch and OG card all read from there.
  The current drawing is an **approximate redraw** pending the original vector
  (`spec-brand.md` §1.2, open question #8). Do not re-set it in a substitute face.
- **Dark theme only.** `<html class="dark">` is hardcoded. Do not add a light-mode
  toggle.
- **`prefers-reduced-motion` and no-WebGL are complete experiences**, not degraded ones.
  `Ceu` is static under reduced motion; `VisorCursor` is off on coarse pointers and
  under reduced motion. The page is fully legible if the canvas never initialises
  (`spec-design.md` §7.1, §7.5).
- **One `wa.me` builder.** `lib/lead/link.ts` is that builder — nothing else composes a
  WhatsApp URL. F&A Móveis shipped `localhost` inside every production message because
  more than one place built that string (`spec-architecture.md` §6.3).
- **One tenancy boundary.** Every read of a tenant-scoped collection goes through
  `lib/tenant/scope.ts` (built, Fase 0 version, against mock `revendedores`/`mostruario`
  in `content/`). A reseller can never create a product — two locks, plus a catalog test
  that enumerates every collection (`spec-architecture.md` §6, still Fase 1 — no product
  creation UI exists yet). Do not write a filter inline in a route.
- **A React Bits component needs a sentence naming the brand fact it carries.** "It
  looks incredible" is not that sentence. The rejected list in `spec-design.md` §7.4 is
  binding.
- **AlignUI, when installed, is vendored byte-identical** into `components/ui/` and
  logged in `SOURCES.md` with URL + sha256. Restyle only through the token layer. One
  primitive, one source — if AlignUI ships a Button, shadcn's `button` is not also
  installed (`spec-design.md` §8).

### How to write in this repo

- **Never invent an API, a component prop, or a provider's behaviour.** Write
  `[VERIFICAR: what to check and where]` inline instead. Resolve it before the code that
  depends on it ships, not after.
- **Be specific to the point of discomfort:** exact token names (`--ouro`, not "the
  gold"), exact node/spec section, exact mm, exact pt-BR strings. No acceptance
  criterion may rest on "works", "fast" or "looks good". `spec-architecture.md` §13 and
  `spec-design.md` §12 set the pattern (measured LCP, measured WCAG ratios).
- **Cite the spec by section**, not by description — `spec-design.md` §3.1, not "the
  viewfinder thing."
- **Brazilian formatting everywhere:** `R$ 890`, `12x de R$ 74`, `52□18-145`,
  `(24) 9…`.
- **No superlatives without a number behind them.** `Desde 2002` is allowed because it
  is true and checkable.

### Start here

1. `docs/spec-brand.md` — who Trísion is, the audit, voice, the ten open questions.
2. `docs/spec-design.md` — tokens, the visor, numeração, type, motion, screens, the
   rules that are never broken (§13).
3. `docs/spec-architecture.md` — the platform, phasing, data model, the three tenancy
   rules (§6).
4. `docs/tasks/TASK-scaffold-e-apresentacao.md` — what Fase 0 has already shipped.
5. `README.md` — how to run it, current routes, current components.

### Open questions that block code

All ten live in `spec-brand.md` §6 with an owner each. **Three of them block everything
else**, and they are the real deliverable of `/apresentacao` slides 14–15:

1. **The domain** (question 4). Wildcard subdomains require an apex. Hard blocker for
   every multi-tenant route. Fase 0 can ship on `trision.vercel.app`. **Partially
   answered 2026-08-17** — Amanda confirmed she owns a domain; the exact string and
   DNS/registrar access are still `[VERIFICAR]`, so this still blocks Fase 1.
2. **The pricing model** (question 7). Decides whether `mostruario.preco` exists, and
   whether "register a product once" survives contact with reality. Do not build a
   per-reseller price field speculatively.
3. **Where the WhatsApp button points** (question 6). `destinoLead` exists so this does
   not block the build, but it must be answered before launch.

Do not silently assume answers. The presentation exists to extract them.

---

## 1. Plan before executing — write a task document first

**Rule:** Before editing or creating **any** code file, write a task document at
`docs/tasks/TASK-<slug>.md` describing the work. No exceptions for "small" changes.

This applies from the very first scaffold commit: the initial `create-next-app` already
got `TASK-scaffold-e-apresentacao.md` before the app existed. Keep doing that.

### 1.1 Required sections

Every task document must contain these five sections, in this order:

1. **Current scenario** — what exists today, what's missing or blocked, with concrete
   file names and the commit it describes.
2. **Planned changes** — file by file, what's added/modified/removed and how it
   connects. Note alternatives considered and rejected.
3. **Why** — the justification, so a reviewer can push back before code exists.
4. **Affected files** — a table:

   | File | Change type | Notes |
   |------|-------------|-------|
   | `src/app/apresentacao/page.tsx` | new | the 16-section pitch, `noindex` |
   | `src/components/visor.tsx` | new | the four brackets, `spec-design.md` §3.1 |

5. **Verification** — measurable criteria. See `spec-architecture.md` §13 and
   `spec-design.md` §12. No criterion may rest on "works."

Also record what is **explicitly out of scope**. The phases in `spec-architecture.md` §3
overlap enough that an unstated boundary will be crossed — Payload in a Fase 0 task,
per-reseller theming, a cart, an invented price.

### 1.2 How to apply it

- **Write the document silently.** Create the file, then point the user at it or
  summarize in 2–3 lines, and wait for alignment on anything significant before writing
  code.
- **One document per task / unit of work.** Short kebab-case slug:
  `TASK-scaffold-e-apresentacao.md`, `TASK-catalogo-fase-0.md`, `TASK-payload-tenancy.md`.
- **Keep it in sync** if the plan changes mid-task — it's a living record, not
  write-once.
- **The document is the contract.** When scope is unclear, the task doc is the source of
  truth for what was agreed.

### 1.3 Why this matters

The user wants review and alignment before code is written — avoids work that gets
rejected, and leaves a trail of *why* a decision was made (no per-reseller theming, gold
over turquoise, Payload deferred to Fase 1) which will not be obvious from the code
later.

---

## 2. Use CLIs, generators, and SDKs — don't write everything by hand

**Rule:** Prefer invoking existing, canonical tooling over hand-authoring files a tool
can generate correctly.

### 2.0 Assume your framework knowledge is outdated — check first, every time

Before scaffolding or adding a dependency for **any** part of this stack — Next.js,
Tailwind, AlignUI, shadcn, React Bits, Payload, `next/font`, Vercel Blob:

1. **Go to the framework's own current docs first.** Don't rely on remembered APIs or
   flags; they may already be wrong. The Next.js note at the top of this file is not
   decorative.
2. **Use the official CLI to scaffold/generate**, not a hand-written file:
   `pnpm create next-app@latest`, `pnpm dlx shadcn@latest init` / `add <component>`,
   `npx @alignui/cli tailwind`, `pnpm create payload-app@latest`.
3. **AlignUI and shadcn both want to own `globals.css`.** AlignUI's CLI runs first and
   overwrites it; shadcn tokens are then *appended*. Never let a shadcn theme generator
   rewrite the file — the Trísion tokens in `src/app/globals.css` are sampled, not
   generated (`spec-design.md` §4.1).
4. **Take the current major version as authoritative** over anything written in this
   file, and update the stack table to match (§3.1). Exception: do not drop below
   Next 16.2 — that blocks Payload (`spec-architecture.md` §4).
5. **Postgres provider is not pinned in the spec.** Provision it at Payload scaffold
   time by running Vercel Marketplace discovery. Picking a vendor from memory is how
   you end up on the wrong one.

### 2.1 What this looks like in practice

- **Scaffolding & generators.** `pnpm create next-app@latest`, AlignUI CLI, shadcn
  CLI, Payload's creator, `gh repo create`.
- **Run the command, then verify the output** rather than hand-recreating what a
  reliable generator already produces.
- **Fonts via `next/font`**, self-hosted, never a third-party stylesheet request — it
  breaks the performance budget in `spec-design.md` §12. Archivo needs the **`wdth`
  axis** (that is the whole reason for the choice, `spec-design.md` §6). IBM Plex Mono
  is the current technical face; revisitable, not blocking.
- **Image processing** (normalising product shots per `spec-design.md` §10) goes
  through `sharp` or `ffmpeg`, scripted — never hand-edited one file at a time. F&A
  Móveis already has `scripts/normalizar-imagens.ts`; port the idea, not the furniture
  assumptions.
- **Colour samples from her material go through `ffmpeg`**, not the eyedropper of
  memory. `#D4AF37` is stock gold; hers is `#CCA866`.
- **Use the agent's dedicated tools** (Read/Edit/Write/Grep) over improvised shell
  commands when one fits.
- **One package manager, decided at scaffold time, then never mixed.**

### 2.2 When to hand-write instead

No generator covers `Visor`, `Numeracao`, `Marca`, `Ceu`, `VisorCursor`, the lead
redirect, the tenancy scope function, or the Payload access matrix. Those are
hand-written on purpose, matching surrounding code style. If a provider's behaviour
isn't something you can verify directly, write `[VERIFICAR: ...]` rather than guessing.

### 2.3 Why this matters

Less human error, canonical and reproducible output, and — for anything touching her
prices, measurements or WhatsApp number — a result that reflects what she actually
gave us rather than a plausible number from training data. A wrong `52□18-145` shown
to an optician is the worst failure this product can have on a product page.

---

## 3. Update documentation after executing

**Rule:** Before considering a task **done**, update all documentation affected by the
change.

### 3.1 What to check and update

- **`AGENTS.md`** (this file) — if the change alters the stack, architecture, or any of
  §0's "things that must not break."
- **`README.md`** — the *implementation* README (setup, scripts, status). Update when
  scripts, stack, routes, or the Status section change.
- **`docs/spec-brand.md`** — if an open question in §6 gets answered, or a keep/refine/
  retire decision in §4 changes.
- **`docs/spec-design.md`** — if a token, component or rule changes. Contrast ratios
  are recomputed, not estimated. When the Figma (or the live page that replaced it)
  changes, this file changes with it.
- **`docs/spec-architecture.md`** — if the change resolves an open question, changes
  scope, or alters the data model / tenancy rules. Update the specific section; don't
  append.
- **`.env.example`** — every environment variable the code reads must be listed the
  moment code reads it. F&A Móveis broke a production build twice on `SITE_URL`
  handling alone.
- **`docs/tasks/`** — keep task docs in sync while work is in progress (§1.2).
- Grep `docs/*.md` for the names of things you changed (route, token, collection,
  `[VERIFICAR]` item, pt-BR string) to catch stale references.

### 3.2 How to apply it

Treat "docs updated" as an explicit checklist item before declaring a task complete.
When unsure whether a doc is affected, grep for the thing you changed.

### 3.3 Why this matters

The gold/turquoise reversal (`spec-brand.md` §1.5b) already happened mid-spec. A doc
that silently goes stale is how a future session builds a turquoise site Amanda has
already told us is wrong.

---

## 4. Project conventions

**Rule:** Single Next.js app, not a monorepo — no workspace tooling unless a real
second package emerges. Payload, when it lands, is mounted *inside* this app
(`spec-architecture.md` §4), not as a sibling service.

- **Layout (current, Fase 0):**

  ```
  src/app/                      App Router: /apresentacao (pitch, noindex)
  src/app/layout.tsx            <html lang="pt-BR" class="dark">, Archivo + IBM Plex Mono
  src/app/globals.css           spec-design.md §4.1 tokens + @theme
  src/app/icon.tsx              favicon, from marca-paths.ts
  src/app/apple-icon.tsx        apple-touch, same source
  src/app/opengraph-image.tsx   1200×630 card; twitter-image.tsx reuses it
  src/app/robots.ts             Disallow /apresentacao, /ir/, /loja/ (Fase 0 path stand-in, §2.4 caveat above)
  src/app/sitemap.ts            marca routes + colecoes/produtos slugs — /loja/ stays out
  src/app/(marca)/               route group, chrome-sharing only — TASK-footer.md, NOT the
                                same thing as the target (marca)/ below (see that entry)
  src/app/(marca)/layout.tsx     Ceu, VisorCursor, Cabecalho, {children}, Rodape — every
                                marca page below is just its own <main>
  src/app/(marca)/page.tsx       /, home hero (keeps its own <ProvedorMotion>)
  src/app/(marca)/catalogo/      filterable grid, URL search params
  src/app/(marca)/colecoes/      list + [slug] detail
  src/app/(marca)/oculos/[slug]/ product page: gallery, ficha técnica, numeração, onde comprar, WhatsApp CTA
  src/app/(marca)/revendedores/  network directory, city/UF filter
  src/app/(marca)/seja-revendedor/  B2B funnel
  src/app/(marca)/sobre/          honest-partial bio page — TASK-sobre.md, [VERIFICAR] panel
                                for what Amanda hasn't confirmed yet
  src/app/loja/[rev]/           Fase 0 storefront path stand-in: home + mostruario/ — own
                                chrome (RevendedorEndosso), deliberately outside (marca)/
  src/components/visor.tsx      the four brackets
  src/components/visor-cursor.tsx  brackets following the pointer, data-alvo snap
  src/components/numeracao.tsx  mm in → 52□18-145; □ is SVG (string logic lives in lib/numeracao.ts)
  src/components/marca.tsx      symbol + lockup (approximate redraw); MarcaLockup takes
                                simbolo/texto/subtexto/gap so it renders at header AND hero
                                scale — one logo treatment, not two
  src/components/marca/cabecalho.tsx  nav shared by marca routes, small MarcaLockup as the
                                header logo (not a bare icon)
  src/components/marca/rodape.tsx  shared footer: brand blurb, nav, contact (honest-absence
                                fallback), legal bar with studio credit
  src/components/ceu.tsx        starfield canvas; static under reduced motion; dim, slow
                                twinkle, ~14% of stars --ouro (TASK-ceu-brilho-velocidade.md)
  src/components/produto/       ProdutoCard, GaleriaProduto, FichaTecnica, BotaoWhatsApp,
                                OndeComprar, GradeProdutos, Filtros, FiltroToggle/FiltroDrawer
                                + filtro-store.ts (Zustand)
  src/components/colecao/       ColecaoCard
  src/components/revendedor/    RevendedorEndosso (the attribution line, spec-brand.md §3)
  src/lib/site-config.ts        SITE_URL, normalised once (trailing slash stripped)
  src/lib/marca-paths.ts        the eight paths — the only source for the mark
  src/lib/numeracao.ts          mm → "52□18-145" string, shared by the component and lib/lead/link.ts
  src/lib/seo.ts                the ONE page-metadata builder (metadataDaPagina) — every
                                page/generateMetadata calls this, not a bare { title }
  src/lib/og-image.tsx          the ONE OG/Twitter card composer (gerarOgImage), reused by
                                every route's opengraph-image.tsx; NumeracaoOg draws □ as SVG
                                like components/numeracao.tsx — Satori's font lacks the glyph
  src/lib/structured-data.ts    JSON-LD builders: organizacaoJsonLd() (root layout, sitewide),
                                produtoJsonLd() (both /oculos/[slug] variants)
  src/lib/catalog/              Fase 0 catalogue seam: types.ts, source.ts, source.local.ts
  src/lib/tenant/               Fase 0 tenancy seam: source.ts, source.local.ts, scope.ts (the ONE scoping fn)
  src/lib/lead/link.ts          the ONE wa.me builder — direct link only, no /ir/ attribution yet
  src/content/                  example catalogue + tenant data (produtos, colecoes, marca,
                                revendedores, mostruario) — all `exemplo`
  src/assets/*.ttf              Archivo statics for Satori; next/font's variable face
                                does not reach ImageResponse
  scripts/verificar-fase-0.mts  budget checks: Lighthouse + Playwright/axe (TASK-verificacao-fase-0.md;
                                not yet extended to the routes TASK-frontend-fase-0.md added)
  docs/spec-brand.md            who Trísion is
  docs/spec-design.md           the visual system
  docs/spec-architecture.md     the platform
  docs/identidade.html          internal identity board — not client material
  docs/tasks/                   task docs (§1)
  references/                   brand evidence; *.mov gitignored, frames committed
  ```

- **Layout (target, from `spec-architecture.md` §8 / §10 — do not create these
  folders in a task that is not building them):**

  ```
  src/app/(marca)/              trision.com.br — replaces today's top-level marca routes
                                once middleware.ts and the domain exist
  src/app/(loja)/[rev]/         <slug>.trision.com.br — replaces src/app/loja/[rev]/ above,
                                not an evolution of it (TASK-frontend-fase-0.md §2.4)
  src/app/(payload)/            Payload admin + API
  src/app/ir/[rev]/[sku]/       the lead redirect
  src/lib/catalog/source.payload.ts   Fase 1 implementation of the catalogue seam
  src/lib/tenant/source.payload.ts    Fase 1 implementation of the tenancy seam
  src/components/ui/            AlignUI, vendored + SOURCES.md
  src/components/bits/          React Bits, vendored + SOURCES.md — TrueFocus, Iridescence etc.
                                that TASK-frontend-fase-0.md deliberately shipped static instead
  payload.config.ts             collections from architecture §5
  scripts/normalizar-imagens.ts photography pipeline (spec-design.md §10, TASK-normalizar-imagens.md — planned, pending a real sample photo)
  ```

- **`src/lib/marca-paths.ts` is the single source for the mark.** The React component
  and the icon/OG routes all import it, so the favicon cannot drift from the header.
- **`src/lib/site-config.ts` owns `SITE_URL`.** Trailing slashes are stripped there,
  once. Empty counts as unset. Do not read `NEXT_PUBLIC_SITE_URL` anywhere else.
- **`content/` is the single source of truth for the catalogue** (Fase 0 example data
  only until Amanda's real products land). No product data inline in a component, ever.
  The Fase 0 → Fase 1 seam is `lib/catalog/source.*.ts` — the same boundary that paid
  for itself at F&A Móveis.
- **Language.** All customer-facing copy is **Brazilian Portuguese**. Code, comments,
  commit messages and specs are English, except where a domain term has no useful
  translation — keep `mostruário`, `revenda oficial`, `aro` / `ponte` / `haste`,
  `Consulte o valor`, `Fale comigo` as-is.
  **Enforced strictly going forward (decided 2026-08-17):** every commit message and
  every file under `docs/` — specs, task docs, `README.md` — is written in English, no
  exceptions beyond the domain terms above. Earlier commits in this repo's history are
  in Portuguese; that was a mistake, not a precedent. Do not follow it. This does not
  change customer-facing copy, which stays pt-BR.
- **Package manager:** **pnpm**, never mixed.
- **Styling:** Tailwind v4 tokens in `globals.css`. Don't introduce a second styling
  system (CSS-in-JS, another component library) alongside it. AlignUI/shadcn land
  later, through the token layer, in a named task.

**Why:** this is a brand site that becomes a small multi-tenant platform, not a
distributed system. The process should match the size of the problem — F&A Móveis'
shape, not Flora's.

### 4.1 Commit conventions

- **Commit automatically once a task doc's work is complete and verified** (build/lint
  passing per its own scope) — don't wait to be asked for each one. This is a standing
  authorization scoped to work that followed the task-doc process in §1; it is not
  blanket permission for destructive git operations (force-push, `reset --hard`), which
  still require explicit confirmation.
- **Never add a `Co-Authored-By` trailer to commits in this repo.**

---

## TL;DR

| Phase | Rule | Output |
|-------|------|--------|
| **Stack** | Next.js 16 + Tailwind v4, pnpm. Payload / AlignUI / Postgres in Fase 1, not before | Single-app repo: `src/app/`, `src/components/`, `docs/tasks/` |
| **Before** | Write a task document first | `docs/tasks/TASK-<slug>.md`: current scenario, planned changes (file by file), why, affected-files table, verification |
| **During** | Use CLIs / generators; `[VERIFICAR: ...]` for any fact about her business, any provider behaviour, any unconfirmed measurement | Canonical output, no invented prices, no invented mm |
| **After** | Update `README.md` / `docs/spec-*.md` / `AGENTS.md` / `.env.example` as needed, then commit — auto-committed once verified | Docs in sync, a commit |

**The loop:** plan → align → build with tooling → document → commit → done.

**Never broken:** no invented facts about her business, no cart in v1, a reseller is an
endorsement (no theming), a bracket frames something real, a number is a real
measurement, `#FFFFFF` means in-focus, no second accent, radius `0` (one named
exception), the wordmark is SVG from `marca-paths.ts`, dark-only, reduced-motion is a
complete site, one `wa.me` builder, one tenancy scope, AlignUI vendored byte-identical
when it lands.
