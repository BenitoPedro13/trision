# TASK — Frontend layout, Fase 0, mock data end-to-end

## 1. Current scenario

`/` is still the holding page from `TASK-scaffold-e-apresentacao.md` — a lockup, one
sentence, one link to `/apresentacao`. `TASK-catalogo-fase-0.md` built the catalogue seam
(`lib/catalog/types.ts`, `source.ts`, `source.local.ts`) and three examples products/one
example collection in `src/content/`, but explicitly kept them unwired: *"Wiring this into
`/`... would ship something that has to be thrown away."*

That call is reversed here, deliberately: the goal now is to see the design system
(`spec-design.md`) actually working as pages — `Visor`, `Numeracao`, the token system, the
grid — against real component trees, not just the four hand-written primitives and the
`/apresentacao` deck. Everything rendered is `exemplo: true` data, labelled as such on
screen, exactly like the existing example products already are.

No photography exists (`TASK-normalizar-imagens.md` ships the pipeline, not content) — every
product's `fotos` stays `[]`. Pages that need a light plate render an honest empty state
(`--lente` panel, "sem foto"), not an invented photograph.

No tenancy exists yet — `lib/tenant/scope.ts` (the one scoping function,
`spec-architecture.md` §6.1) has never been written. This task writes a **Fase 0 version of
it** against mock reseller/mostruário data in `content/`, mirroring the catalogue seam, so
Fase 1 replaces its *implementation* (Payload-backed) without moving the boundary.

No lead capture exists (`spec-architecture.md` §7 needs a `leads` collection — Payload,
Fase 1). `lib/lead/link.ts` (the one `wa.me` builder, §6.3) is written here as a **direct
link builder**; the `/ir/[rev]/[sku]` attribution redirect that wraps it is explicitly out of
scope (§4 below).

## 2. Planned changes

### 2.1 Routes built this task (all mock data, all reachable, none wired to fake facts)

| Route | Spec ref | Notes |
|---|---|---|
| `/` | §11 (brand table) | Replaces the holding page: the thesis line, the collections, `Desde 2002`, a pointer at the one mock storefront. Static — no `TrueFocus` (React Bits isn't installed, §2.3 below) |
| `/colecoes` | §11 | List of collections, `ColecaoCard` |
| `/colecoes/[slug]` | §11 | One collection + its produtos |
| `/catalogo` | §11 | Full line, filterable by `formato`/`material`/`cor`/`genero` via URL search params |
| `/oculos/[slug]` | §11 | Gallery (empty-state aware), `FichaTecnica`, `Numeracao`, `OndeComprar`, `BotaoWhatsApp` |
| `/loja/[rev]` | §11 (storefront table), **path shape is Fase 0 only** — see §2.4 | Storefront home: `RevendedorEndosso`, its featured frames |
| `/loja/[rev]/mostruario` | §11 | Only what that reseller carries — **same `GradeProdutos`/`Filtros` components as `/catalogo`**, scoped data (§6 tenancy rule) |

Not built this task (scoped out deliberately, §4): `/revendedores`, `/sobre`,
`/seja-revendedor`, `/atendimento-exclusivo`, `/loja/[rev]/a-loja`,
`/loja/[rev]/oculos/[slug]`, `/admin`.

### 2.2 New library code

- **`src/lib/numeracao.ts`** — `formatarNumeracao(medidas): string | undefined`. Pulls the
  `52□18-145` string-formatting logic out of the `Numeracao` component (which keeps the SVG
  `□` rendering) so `lib/lead/link.ts` can put the *identical* string in the WhatsApp message —
  `spec-architecture.md` §7.3's binding requirement: "the number Amanda receives is the same
  number the customer read." One function, both call sites.
- **`src/lib/lead/link.ts`** — `montarLinkWhatsapp(dados): string | null`. The one `wa.me`
  builder (§6.3). Returns `null` when the target number is empty — `BotaoWhatsApp` renders a
  disabled "Consulte o WhatsApp" state in that case, same fallback shape as
  `precoSugerido` → "Consulte o valor". No `codigo` (attribution) param wired yet — that
  arrives with `/ir/`, Fase 1.
- **`src/lib/tenant/source.ts` / `source.local.ts`** — mirrors `lib/catalog/source.*.ts`
  exactly: a `TenantSource` interface (`listarRevendedores`, `buscarRevendedorPorSlug`,
  `listarMostruario`) and a Fase 0 implementation reading `content/revendedores.ts` /
  `content/mostruario.ts`. `source.payload.ts` is Fase 1, not started here.
- **`src/lib/tenant/scope.ts`** — the one scoping function (§6.1), Fase 0 version:
  `escopoRevendedor(slug)` joins tenant source + catalog source and returns the reseller plus
  its resolved, sorted, available `produtos`; `revendedoresQueCarregam(sku)` is the reverse
  lookup `OndeComprar` uses. **Every read of `revendedores`/`mostruario` data in this task
  goes through this file** — no route/component queries `content/revendedores.ts` or
  `content/mostruario.ts` directly. With one mock reseller the leak this rule guards against
  can't manifest yet, but the boundary is what Fase 1 needs to inherit, not redesign.
- **`src/lib/catalog/types.ts`** — adds `Revendedor` and `MostruarioItem`, the Fase 0
  stand-ins for `spec-architecture.md` §5.2/§5.3, trimmed to the fields this task's UI
  actually reads (no `endereco`/`horarios` — no page shows them yet).

### 2.3 New components

Hand-written, matching `spec-design.md` §8's list (`ProdutoCard`, `FichaTecnica`,
`BotaoWhatsApp` are named there explicitly) and the token system already in `globals.css` —
no AlignUI, shadcn, or React Bits. **Deliberately not installed this task**: AGENTS.md's stack
table marks all three "Not installed yet — do not add them in a task that does not name
them," and this task doesn't. Concretely: `/`'s thesis line is static type, not `TrueFocus`;
the primary CTA is a plain `--ouro`-fill button, not the `Iridescence` coating (§7.3); form
controls (filter chips) are hand-written links/buttons on existing tokens. Upgrading these to
their React Bits/AlignUI versions is a named follow-up task, not silently bundled here.

| Component | File | Notes |
|---|---|---|
| `ProdutoCard` | `components/produto/produto-card.tsx` | `Visor` around the plate, `Numeracao`, price or "Consulte o valor," `data-alvo` for `VisorCursor` |
| `GaleriaProduto` | `components/produto/galeria-produto.tsx` | `fotos.length === 0` ⇒ one "sem foto" `--lente` plate. Otherwise thumbnail rail + main image, selected-index state local to this component (`useState` — see §3 on why not Zustand here) |
| `FichaTecnica` | `components/produto/ficha-tecnica.tsx` | Formato / Material / Cor rows + `Numeracao` |
| `BotaoWhatsApp` | `components/produto/botao-whatsapp.tsx` | The one gold-fill CTA per page (§4.2 rule 3: `--noite` text on `--ouro`); disabled state when `montarLinkWhatsapp` returns `null` |
| `OndeComprar` | `components/produto/onde-comprar.tsx` | Calls `revendedoresQueCarregam`, links to `/loja/[slug]` |
| `GradeProdutos` | `components/produto/grade-produtos.tsx` | The shared grid — `/catalogo` and `/loja/[rev]/mostruario` both render this against different data, per §11's "same components, different data" rule |
| `Filtros` | `components/produto/filtros.tsx` | Server-rendered filter chips as plain links (`?formato=aviador`) — works with JS disabled, shareable URL. **No client fetch, no TanStack Query** — see §3 |
| `FiltroToggle` / `FiltroDrawer` | `components/produto/filtro-toggle.tsx`, `filtro-drawer.tsx` | Mobile: a header badge (`FiltroToggle`) and an off-canvas panel (`FiltroDrawer`) that must share "which filters are pending, is the drawer open" state without a shared parent — see §3 for why this is the Zustand case and the gallery isn't |
| `ColecaoCard` | `components/colecao/colecao-card.tsx` | Editorial tile |
| `RevendedorEndosso` | `components/revendedor/revendedor-endosso.tsx` | The exact attribution line from `spec-brand.md` §3: `TRÍSION EYEWEAR / Revenda oficial · <nome> · <cidade>, <uf>`, inside `Visor` (§3.1 "reseller badge") |
| `Cabecalho` | `components/marca/cabecalho.tsx` | Nav shared by every new marca route: mark, Catálogo, Coleções |

### 2.4 Storefront path shape — explicitly provisional

`spec-architecture.md` §8 puts the storefront at `<slug>.trision.com.br/`, reached by
`middleware.ts` rewriting on `Host`. That can't be built or even meaningfully tested yet: the
domain is still `[VERIFICAR]` (`spec-brand.md` §6 q4), and `trision.vercel.app` cannot serve
arbitrary wildcard subdomains. So this task adds **`src/app/loja/[rev]/`** — a real path
segment, not the `(loja)` route group the target layout (`AGENTS.md`) shows — purely so the
storefront components exist and are reachable (`/loja/otica-exemplo`) before the domain and
middleware do. This route is very likely **deleted outright**, not evolved, once Fase 1 adds
`middleware.ts` and the `(marca)`/`(loja)` route groups — recorded here so that future session
doesn't try to preserve `/loja/` as a permanent alias.

### 2.5 Mock data

- **`src/content/revendedores.ts`** — one reseller, `slug: "otica-exemplo"`, `exemplo: true`
  (the same flag `Produto` already carries, added to `Revendedor` for this task).
  `whatsapp: ""` with a `[VERIFICAR]` comment, same convention as `content/marca.ts` — a
  fictional shop still doesn't get an invented phone number, because `BotaoWhatsApp`'s
  disabled-state path needs exercising honestly, not skipped by faking a value.
- **`src/content/mostruario.ts`** — two join rows (`otica-exemplo` carries `Modelo A` and
  `Modelo B`, not `Modelo C`) — deliberately not "carries everything," so `/loja/[rev]` visibly
  demonstrates "only what this shop carries" (§11) rather than mirroring `/catalogo` 1:1.

### 2.6 `package.json`

- **`zustand`** (`^5`) added — real, scoped use in §2.3 above.
- **`@tanstack/react-query` is *not* added this task.** See §3.

## 3. Why — including the state-management research the user asked for

Researched current (2026) guidance for Next.js App Router + React 19 + TanStack Query v5 +
Zustand specifically to answer "where should each one actually go," not to install both by
default:

- **Server Components own initial data.** Every page in this task reads its data with a
  direct, awaited call into `lib/catalog/source.ts` / `lib/tenant/scope.ts` — no client
  fetch, no loading spinner, no waterfall. This is what the TanStack Query docs themselves
  recommend: *"treat Server Components as a place to prefetch data... it's fine to have
  Server Components own some data."* Fase 0's data is synchronous local TS, so there's nothing
  to keep in sync after the initial load — which is specifically the job TanStack Query is
  for.
- **TanStack Query's real job — request-scoped `QueryClient` via `cache()`, prefetch in a
  Server Component, `HydrationBoundary`, `useSuspenseQuery` in the client leaf — starts once a
  page needs to *revalidate, mutate, or poll* live data.** Nothing in this task's scope does:
  no live inventory, no lead-status updates, no reseller self-edit. Installing the provider
  now would sit in every route's client bundle (`spec-design.md` §12: storefront JS budget
  ≤180 KB gzipped) for zero present benefit — exactly the premature abstraction `AGENTS.md`
  warns against. **First real candidate: the Fase 1 reseller mostruário toggle grid**
  (`spec-architecture.md` §5.3) — a Payload-backed admin view with per-row mutations, which is
  precisely the shape TanStack Query is built for. The pattern above is recorded in `AGENTS.md`
  now so that task doesn't have to re-research it.
- **Filter state on `/catalogo` and `/loja/[rev]/mostruario` is URL search params, read by
  the Server Component — not TanStack Query and not Zustand.** This matches the research
  consensus (*"the solution is URL state + Server Components... keeping state in the URL
  makes it shareable and persistent"*) and Next's own soft-navigation model: clicking a filter
  link re-renders the Server Component over RPC without a client fetch or a full reload.
  Shareable filtered URLs are also a real product win (a reseller can send a customer a
  pre-filtered link).
- **Zustand fits the mobile filter drawer, not the gallery.** `FiltroToggle` (a badge in the
  page's toolbar) and `FiltroDrawer` (an off-canvas panel) are siblings, not
  parent/child — sharing "is it open, what's staged before Apply" between them either needs a
  Context provider wrapping both (which forces everything inside it, including the
  Server-Component page body, into the client boundary — the exact trap the research flagged:
  *"React Server Components should not read from or write to the store... a Context Provider
  forces parent components into becoming Client Components"*) or a store neither needs a
  provider for. Zustand's plain `create()` needs no provider, so the two islands import the
  same hook and nothing above them has to become a Client Component. `GaleriaProduto`'s
  selected-photo state, by contrast, is read and written by one component only — `useState`
  is correct there and reaching for Zustand would be state-managed for its own sake.
- **The per-request store *factory* pattern in Zustand's own Next.js guide (`createStore` +
  `useContext`, to stop store instances leaking across concurrent server requests) does not
  apply to `filtro-store.ts`.** That pattern exists for stores whose *initial state is seeded
  from server/request data*. The filter drawer's store starts from a fixed empty state and is
  never touched during SSR — it's created fresh per browser tab like any client-only module
  singleton, so the plain `create()` form is correct and simpler. Recording this distinction
  in `AGENTS.md` so a future task doesn't reach for the heavier factory pattern by default.

Sources consulted: TanStack Query's own [Advanced Server Rendering
guide](https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr) and
[Next.js docs](https://ihsaninh.dev/blog/the-complete-guide-to-tanstack-query-next.js-app-router)
guide; Zustand's own [Next.js setup guide](https://zustand.docs.pmnd.rs/learn/guides/nextjs);
general 2026 App Router state-management guidance
([masad.dev](https://masad.dev/blogs/state-management-nextjs-zustand-context),
[oneuptime.com](https://oneuptime.com/blog/post/2026-01-15-choose-react-state-management-context-redux-zustand/view)).

## 4. Explicitly out of scope

- **`/ir/[rev]/[sku]` and the `leads` collection.** Needs Payload (Fase 1). `BotaoWhatsApp`
  links straight to `wa.me` for now; `lib/lead/link.ts` is written so that route can wrap it
  later without a second builder appearing (§6.3's binding rule).
- **`middleware.ts` and real subdomain routing.** Blocked on the domain (§2.4).
- **AlignUI, shadcn, React Bits.** Not named by this task; see §2.3.
- **`/revendedores`, `/sobre`, `/seja-revendedor`, `/atendimento-exclusivo`.** Editorial/static
  pages, not catalogue-driven — a separate task, deliberately not bundled with this one
  (confirmed with the user).
- **`/loja/[rev]/a-loja`, `/loja/[rev]/oculos/[slug]` (attributed product page).** Needs either
  more storefront-specific content (`a-loja`) or `/ir/` attribution (`oculos/[slug]`) — both
  deferred with their dependencies above.
- **Real product photography, `scripts/normalizar-imagens.ts`.** Separate task
  (`TASK-normalizar-imagens.md`), not started here — every gallery renders the empty state.
- **Extending `scripts/verificar-fase-0.mts`** to the new routes. Worth doing, but this task's
  verification (§5) is manual + `tsc`/`lint`/`build`; wiring Lighthouse/axe budgets to five new
  routes is its own follow-up.
- **`@tanstack/react-query` as an installed dependency.** See §3 — pattern documented, not
  installed, until a Fase 1 feature actually needs it.

## 5. Affected files

| File | Change type | Notes |
|---|---|---|
| `src/lib/catalog/types.ts` | edit | add `Revendedor`, `MostruarioItem` |
| `src/lib/numeracao.ts` | new | `formatarNumeracao` |
| `src/components/numeracao.tsx` | edit | comment cross-references `formatarNumeracao`; the component keeps drawing its own SVG `□` rather than importing the string helper, since its guard logic (`aro == null`, etc.) was already identical and duplicating it added an import for no behavioural change |
| `src/lib/lead/link.ts` | new | `montarLinkWhatsapp` |
| `src/lib/tenant/source.ts` | new | `TenantSource` interface |
| `src/lib/tenant/source.local.ts` | new | Fase 0 implementation |
| `src/lib/tenant/scope.ts` | new | `escopoRevendedor`, `revendedoresQueCarregam` — the one scoping function |
| `src/content/revendedores.ts` | new | one mock reseller, `exemplo: true` |
| `src/content/mostruario.ts` | new | two mock join rows |
| `src/components/produto/*.tsx` | new | `ProdutoCard`, `GaleriaProduto`, `FichaTecnica`, `BotaoWhatsApp`, `OndeComprar`, `GradeProdutos`, `Filtros`, `FiltroToggle`, `FiltroDrawer` |
| `src/components/produto/filtro-store.ts` | new | Zustand store, plain `create()` |
| `src/components/colecao/colecao-card.tsx` | new | `ColecaoCard` |
| `src/components/revendedor/revendedor-endosso.tsx` | new | `RevendedorEndosso` |
| `src/components/marca/cabecalho.tsx` | new | `Cabecalho` nav |
| `src/app/page.tsx` | edit | real homepage, replaces holding page |
| `src/app/colecoes/page.tsx`, `[slug]/page.tsx` | new | |
| `src/app/catalogo/page.tsx` | new | |
| `src/app/oculos/[slug]/page.tsx` | new | |
| `src/app/loja/[rev]/page.tsx`, `mostruario/page.tsx` | new | Fase 0 path shape, §2.4 |
| `src/app/robots.ts` | edit | disallow `/loja/` (same reasoning as `/apresentacao`, `/ir/`) |
| `src/app/sitemap.ts` | edit | add new marca routes + `colecoes`/`produtos` slugs |
| `package.json` | edit | add `zustand` |
| `AGENTS.md` | edit | stack table, file layout, new "state management" guidance (§3 above), storefront path-shape caveat |
| `README.md` | edit | status, routes table, stack table |

## 6. Verification

- `pnpm exec tsc --noEmit` passes.
- `pnpm lint` passes.
- `pnpm build` succeeds; every new route appears in the build output (static where
  `generateStaticParams` applies — `/colecoes/[slug]`, `/oculos/[slug]`).
- Manual, via `pnpm dev` + browser: every route in §2.1 renders; `/catalogo?formato=aviador`
  narrows the grid and the URL is shareable (reload keeps the filter); `/loja/otica-exemplo`
  shows exactly the two mostruário products, not all three; `/loja/nao-existe` 404s in brand
  chrome; a product's `BotaoWhatsApp` is disabled (no invented number); `Numeracao` renders on
  every example product (all three carry `medidas`) and the string inside `montarLinkWhatsapp`'s
  message matches what's on screen, byte for byte.
- Grep confirms no file outside `lib/tenant/` imports `content/revendedores.ts` or
  `content/mostruario.ts` directly, and no file outside `lib/lead/` builds a `wa.me` URL.
- Keyboard pass: every new interactive element (filter chips, drawer toggle, product cards,
  the WhatsApp CTA) shows the `.foco-visor` bracket on Tab, matching the fix already recorded
  in `TASK-verificacao-fase-0.md`.
