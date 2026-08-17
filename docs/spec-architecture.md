# Trísion Eyewear — Architecture Spec

> Companion to `spec-brand.md` and `spec-design.md`. Read `spec-brand.md` §2.1 (two
> audiences) and §3 (a reseller is an endorsement, not a sub-brand) first — both are
> load-bearing here.
>
> Version numbers below are a **snapshot verified 2026-08-17**, not a pin. Re-check against
> each tool's own docs before scaffolding (`CLAUDE.md` §2.0).

---

## 1. The problem

Amanda owns Trísion Eyewear (founded 2002) and sells through a network of resellers —
independent optical shops that carry some subset of her frames. Today the brand's entire web
presence is a Linklist page and a one-screen Canva site. Resellers have nothing.

Three requirements, in Benito's words:

1. **Register a product once.** One catalogue, one database, one set of photographs.
2. **Each reseller gets its own storefront** (`lojaa.trision…`, `lojab.trision…`) showing
   **only the frames it actually carries**, selected by the reseller in a CMS. A reseller can
   *select*, never *create*.
3. **Amanda receives every lead, and knows which storefront it came from.**

The commercial shape mirrors F&A Móveis and works for the same reason: no cart, no checkout,
no payments. Every path terminates in WhatsApp, which is where this market already buys.

## 2. Scope

**In scope (v1):** the brand site, N reseller storefronts on subdomains, one product
catalogue, per-reseller selection, attributed lead capture, an admin for Amanda and a
restricted admin for resellers.

**Explicitly not in scope:** cart, checkout, payments, stock quantities, prescriptions,
virtual try-on, reseller-configurable design (`spec-brand.md` §3), multi-language, a mobile
app.

---

## 3. Phasing and the cost ladder

Each phase is independently shippable and independently sellable. **Fase 0 comes before the
money**, exactly as it did with Fátima.

| Fase | What ships | Recurring cost |
|---|---|---|
| **0 — a venda** | The brand site only, real frames, real photographs, WhatsApp CTA. No CMS, no tenants — catalogue as typed TS modules in `content/`. Shown to Amanda on her phone. | ~R$0 (Vercel Hobby) + domain |
| **1 — o segundo inquilino** | Payload + Postgres + Blob. Subdomain routing. `produtos` / `revendedores` / `mostruario`. **One real reseller onboarded end to end.** This is where the product proves itself, and it is the phase worth charging for. | Vercel Pro + Postgres + Blob |
| **2 — a atribuição** | `/ir` lead route, `leads` collection, Amanda's dashboard, lead status workflow, per-reseller report | unchanged |
| **3 — escala** | Custom domains per reseller, reseller self-onboarding, catalogue CSV import, `/seja-revendedor` funnel | + domain automation |

**Fase 0 deliberately has no database.** The catalogue lives in `content/produtos.ts` behind
the same domain types the Payload source will implement (§6.1), so Fase 1 swaps one module
instead of rewriting the site. This is F&A Móveis' `lib/catalog/source.*.ts` boundary, and it
already paid for itself there.

---

## 4. Platform

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js, App Router, TypeScript** — **≥ 16.2.0 required** | Not a preference: Payload supports Next 16 only from `>16.1.1-canary.35` / `16.2.0+`, and **15.5–16.1.x is unsupported and will not be**. Pinning below 16.2 blocks the CMS. |
| CMS | **Payload ≥ 3.73.0**, mounted inside the same Next app at `/admin` | Full Next 16 + Turbopack support landed in 3.73.0. Gives Amanda a real admin we do not build, plus per-collection *and* per-field access control, which is the whole tenancy story. |
| Multi-tenancy | **`@payloadcms/plugin-multi-tenant`** | Adds a `tenant` field to *listed* collections and filters admin lists and relationship pickers by the selected tenant. Crucially, **collections it does not list stay global** — which is exactly the shape we need (§5). |
| Database | **Postgres** via `@payloadcms/db-postgres` | Provider is **not pinned here.** Provision it at scaffold time by running Vercel Marketplace discovery, per `CLAUDE.md` §2.0 — picking a vendor from memory in a spec is how you end up on the wrong one. |
| Media | **Vercel Blob** via `@payloadcms/storage-vercel-blob` | Product photography is the heaviest asset class in the build. |
| Styling | Tailwind + CSS variables mapped 1:1 to `spec-design.md` §4 | |
| Components | AlignUI (vendored) → shadcn (gaps) → React Bits (§7 of the design spec) | `spec-design.md` §8 |
| Hosting | Vercel | Wildcard domain + Routing Middleware are the two features this design depends on |
| Bot filtering | **Vercel BotID** on `/ir/*` | §7.4 — without it the lead numbers are fiction |

### 4.1 Domains — the hard blocker

```
trision.com.br              → brand site
<slug>.trision.com.br       → reseller storefronts   (wildcard: *.trision.com.br)
trision.com.br/admin        → Payload
```

**Wildcard subdomains require owning the apex domain.** Amanda is currently on
`sitetrision.my.canva.site`, which suggests she owns nothing. **This is the first purchase of
the project and it blocks all of Fase 1** — `spec-brand.md` §6 question 4. Fase 0 can ship on
`trision.vercel.app` while it is sorted, but nothing multi-tenant can.

---

## 5. Data model

Seven collections. The asymmetry between them **is** the product.

### 5.1 `produtos` — global, brand-owned. NOT tenant-scoped.

The inversion that makes this work: the multi-tenant plugin's default model is "each tenant
owns its documents." Here the catalogue is the *brand's*, and tenants hold a **selection** of
it. So `produtos` is simply **not listed in the plugin config**, and its access control is
written by hand.

| Field | Type | Notes |
|---|---|---|
| `nome` | text | `Trísion Vega` |
| `sku` | text, unique, indexed | the catalogue key, shown to customers (WEB Eyewear pattern) |
| `marca` | text, default `Trísion` | exists because open question #1 is unresolved; costs nothing and survives either answer |
| `colecao` | rel → `colecoes` | |
| `categoria` | select | `solar` \| `grau` \| `clip-on` |
| `formato` | select | `aviador` \| `quadrado` \| `redondo` \| `gatinho` \| `hexagonal` \| `retangular` |
| `material` | select | `acetato` \| `metal` \| `TR90` \| `titânio` |
| `cor` | text + `hexAprox` | `hexAprox` drives the swatch, never the photograph |
| `genero` | select | `feminino` \| `masculino` \| `unissex` |
| `medidas` | group | `aro`, `ponte`, `haste` (mm, **numbers**) → renders `52□18-145` |
| `fotos` | array → media | ordered; `[0]` is the front shot (`spec-design.md` §10) |
| `descricao` | richtext | pt-BR, Amanda's voice |
| `precoSugerido` | number, **optional** | absent ⇒ `Consulte o valor`. Never defaulted |
| `status` | select | `ativo` \| `descontinuado` |

**Measurements are stored as numbers in mm and formatted at the edge.** Never store
`"52□18-145"`. Same rule as F&A Móveis' centimetres, same reason: a stored string cannot be
filtered, sorted, or converted.

### 5.2 `revendedores` — the tenants

| Field | Type | Reseller may edit |
|---|---|---|
| `nome` | text | ✗ |
| `slug` | text, unique, indexed | ✗ — **it is the subdomain**; changing it breaks every shared link |
| `cidade`, `uf` | text | ✗ |
| `whatsapp` | text (E.164) | ✓ |
| `instagram` | text | ✓ |
| `endereco`, `horarios` | group | ✓ |
| `retrato` | media | ✓ — **the one visual thing a reseller controls** (`spec-brand.md` §3) |
| `sobre` | textarea, ≤ 400 chars | ✓ |
| `status` | select `ativo` \| `pausado` | ✗ |
| `destinoLead` | select `marca` \| `revendedor` | ✗ — §7.2 |

**There is no colour field, no logo field, no font field, and there never will be.** The
brand-architecture rule from `spec-brand.md` §3 is enforced here, in the schema, because a
rule that lives only in a document gets designed around.

### 5.3 `mostruario` — the join. Tenant-scoped.

One row per (reseller × product) the reseller carries. This is the collection the whole
system exists to hold.

| Field | Type | Notes |
|---|---|---|
| `revendedor` | rel → `revendedores` | set by the plugin, never by the user |
| `produto` | rel → `produtos` | |
| `disponivel` | checkbox, default `true` | |
| `destaque` | checkbox | drives the storefront home |
| `ordem` | number | |
| `observacao` | text | e.g. `só na cor tartaruga` |
| `preco` | number, optional | **only exists if open question #7 resolves to per-reseller pricing.** Do not build it speculatively — it is the field that quietly destroys "one catalogue" |

**Why a join collection rather than an array of relationships on `revendedores`:** an array
field means one document lock per edit, a relationship picker that is unusable past ~100
products, and nowhere to hang `destaque` / `ordem` / `observacao`. The join costs one
collection and buys per-item curation.

**Reseller-facing UX:** a picker listing 400 products one row at a time is a bad product. Ship
a **custom Payload admin view** — a grid of every product with a toggle per card, writing
`mostruario` rows underneath. Budget this explicitly; it is the reseller's entire experience
of the CMS and the thing they will judge it by.

### 5.4 `leads` — §7

`revendedor` · `produto` · `codigo` (unique) · `criadoEm` · `origem` (path) · `referrer` ·
`utm{source,medium,campaign}` · `dispositivo` · `status` (`novo` \| `atendido` \| `vendido` \|
`perdido`) · `notas`.

**No PII is collected.** We record that someone left for WhatsApp, never who. Identity
arrives in Amanda's inbox, from the customer, by their own choice.

### 5.5 `colecoes`, `usuarios`, `config`

- `colecoes` — global, brand-owned: `nome`, `slug`, `ano`, `capa`, `texto`.
- `usuarios` — auth. `role`: `admin` \| `revendedor`; `revendedor` users carry a `tenant`.
- `config` — a Payload global: brand WhatsApp, socials, home hero, footer, `Desde 2002`.

### 5.6 Access matrix

| Collection | `admin` | `revendedor` |
|---|---|---|
| `produtos` | CRUD | **read only**, `status: ativo` |
| `colecoes`, `config` | CRUD | read |
| `revendedores` | CRUD | read own · update own **field-level allowlist** (§5.2) |
| `mostruario` | CRUD | CRUD **own rows only** |
| `leads` | CRUD | read own rows, **no create/update** |
| `usuarios` | CRUD | read/update self |

---

## 6. The tenancy boundary — the three rules

This section is the one that matters. Everything else is a website.

### 6.1 One scoping function

> **Every read of a tenant-scoped collection goes through `lib/tenant/scope.ts`, which takes
> a `tenantId`.** No route, no component, no loader writes its own tenant filter.

A missing filter here shows one reseller another's leads or mostruário. It is the only
catastrophic bug this system can have, and it is the kind that ships silently — the page
looks fine, it just has the wrong rows. One boundary, one place to test, one place to audit.

The same module is the Fase 0 → Fase 1 seam: `source.local.ts` (typed TS in `content/`) and
`source.payload.ts` implement one interface, and nothing outside them imports a Payload type.

### 6.2 Two locks on product creation

> **A reseller can never create a product.**

Enforced twice, deliberately: (a) Payload `access.create` on `produtos` returns
`user.role === 'admin'`; (b) the admin UI hides the create action for the `revendedor` role.
Belt and braces, the way Flora enforces tenancy twice (app-level *and* Postgres RLS). If the
Postgres adapter's RLS story is available at build time, add it as a third lock — a leak here
is not recoverable by apology.

**A test enumerates every collection and asserts its access rules**, so adding a collection
without deciding its tenancy fails CI rather than shipping open. (Flora's
`tenancy.spec.ts` catalog test, ported.)

### 6.3 One WhatsApp link builder

> **Every `wa.me` URL in this codebase is produced by `lib/lead/link.ts`.** Nothing else
> composes one.

F&A Móveis shipped `localhost` URLs inside every WhatsApp message to production
(commit `b122f42`) because more than one place built that string. That bug is already paid
for; do not buy it twice.

---

## 7. Lead capture and attribution — the money path

### 7.1 The mechanism

The CTA is a normal link to **`/ir/[revendedor]/[sku]`**. That route, server-side:

1. mints a `codigo` — `TRI-<REV>-<4 base32 chars>`, e.g. `TRI-SILVA-K4M2`
2. writes the `leads` row (tenant, product, path, referrer, UTM, device)
3. **302s** to the real `https://wa.me/<numero>?text=<mensagem>`

**Why a redirect and not `sendBeacon` on a direct `wa.me` link:** a beacon is lost to ad
blockers, privacy modes, and in-app browsers — precisely the population that arrives from
Instagram, which is most of this traffic. The redirect is deterministic, works with
JavaScript disabled, and has one code path. Its costs, stated honestly: one hop (~100ms) and
a hover URL that is ours rather than WhatsApp's. Worth it — an attribution system that is
right 70% of the time is worse than none, because Amanda will make decisions on it.

### 7.2 Where the message goes

`revendedores.destinoLead` decides: `marca` (Amanda's number) or `revendedor` (the shop's).
**Default `marca`**, matching the brief. The flag exists so open question #6 does not block
the build — but it must be answered before launch, because it changes what the reseller
thinks they bought.

### 7.3 What Amanda actually reads

```
Olá! Vim pela loja da Ótica Silva (Volta Redonda, RJ) e quero saber sobre o
Trísion Vega — solar, acetato preto, 52□18-145.  [TRI-SILVA-K4M2]
```

Both halves are deliberate: the **sentence** so Amanda knows the source without opening
anything, and the **code** so the message joins to its row. She will use the sentence every
day and the code never — until the month she wants to know which reseller is actually working.

### 7.4 Keeping the numbers honest

`/ir/*` is `Disallow`ed in `robots.txt`, links carry `rel="nofollow"`, and **Vercel BotID**
guards the route. Without this, crawlers manufacture leads and the dashboard becomes a lie
that looks like data.

---

## 8. Routing and rendering

`middleware.ts` (Node runtime) reads `Host`:

| Host | Rewrite |
|---|---|
| `trision.com.br`, `www.` | `/(marca)/…` |
| `<slug>.trision.com.br` | `/(loja)/[slug]/…` |
| unknown `<slug>` | 404 **in brand chrome** — a dead reseller link must still look like Trísion |
| `/admin`, `/api/*` | untouched |

```
app/(marca)/            trision.com.br
app/(loja)/[rev]/       <slug>.trision.com.br
app/(payload)/admin/    Payload
app/ir/[rev]/[sku]/     the lead redirect (§7)
```

**Caching.** Storefronts are statically generated per tenant and revalidated by tag:
`rev:<slug>`, `produto:<id>`, `mostruario:<slug>`. Payload `afterChange` / `afterDelete`
hooks call `revalidateTag`. `generateStaticParams` covers active tenants at build; **new
tenants render on demand**, so onboarding a reseller never requires a deploy — which is the
difference between a platform and thirty forks.

`[VERIFICAR: whether Next 16 Cache Components (`use cache`) is on. Payload has initial
support and the admin-panel blocker is fixed, but "initial" is doing work in that sentence —
verify against Payload's own docs at scaffold time, and if it is not solid, ship without it.]`

---

## 9. What each person sees in `/admin`

| | Amanda (`admin`) | Reseller (`revendedor`) |
|---|---|---|
| Lands on | leads dashboard | **the mostruário grid** (§5.3) |
| Products | full CRUD, photography, collections | a read-only grid with a toggle per frame |
| Resellers | all, plus create/onboard | own shop, allowlisted fields |
| Leads | all, filterable by reseller, status workflow | own, read-only |

The reseller's admin must be usable by a shop owner on a phone, between customers. If it is
not, they will not curate, the storefront will show the whole catalogue including frames they
cannot sell, and the product's core promise fails quietly.

---

## 10. Repo layout

```
app/(marca)/ (loja)/ (payload)/ ir/     routes per §8
content/                                Fase 0 catalogue: produtos.ts, marca.ts, colecoes.ts
lib/catalog/  types.ts source.ts source.local.ts source.payload.ts    the §6.1 seam
lib/tenant/scope.ts                     the ONE scoping function
lib/lead/link.ts codigo.ts              the ONE wa.me builder
lib/numeracao.ts                        mm → 52□18-145
components/ui/                          AlignUI, vendored + SOURCES.md (sha256)
components/bits/                        React Bits, vendored + SOURCES.md
components/marca/ produto/ revendedor/  hand-written brand components
payload.config.ts  collections/         the schema in §5
scripts/normalizar-imagens.ts           the photography pipeline (spec-design.md §10)
docs/  references/                      specs + brand evidence (references/ is gitignored, §11)
```

## 11. Repo hygiene

`references/` holds **780 MB of `.mov`** files. `.gitignore` must exclude `references/*.mov`
before the first commit — the extracted `references/frames/**` JPEGs are small and are the
part worth keeping, since every colour sample in `spec-brand.md` and `spec-design.md` cites
them. Losing them makes those specs unverifiable.

## 12. Security

- Payload auth, HTTP-only cookies. Resellers never touch the database directly.
- **Every collection's access rules are asserted by a test** (§6.2).
- Rate-limit `/ir/*` and any public form; BotID on `/ir/*`.
- Env vars: `DATABASE_URL`, `PAYLOAD_SECRET`, `BLOB_READ_WRITE_TOKEN`, `SITE_URL`,
  `WHATSAPP_MARCA`. **Every one listed in `.env.example`** the moment code reads it —
  F&A Móveis broke a production build twice on `SITE_URL` handling alone (`e40ec63`,
  `e57ef97`), and both were env/config, not logic.

## 13. Non-functional requirements

| # | Requirement |
|---|---|
| NFR-1 | A reseller cannot read or write another reseller's `mostruario` or `leads`. **Asserted by test**, not by review. |
| NFR-2 | A reseller cannot create, edit or delete a `produto`. Two locks (§6.2). |
| NFR-3 | Every lead row carries a resolvable `revendedor` — no orphans, ever. |
| NFR-4 | Onboarding a reseller requires **no deploy**. |
| NFR-5 | Storefront LCP ≤ 2.0s on 4G, mid-range Android, median of repeated runs. |
| NFR-6 | Every customer-facing string is pt-BR (`spec-brand.md` §5). |
| NFR-7 | A product with no confirmed price shows `Consulte o valor`. Never a number we were not given. |
| NFR-8 | No `wa.me` URL is composed outside `lib/lead/link.ts` (§6.3). |

## 14. Alternatives considered and rejected

| Option | Why not |
|---|---|
| **One Next app per reseller** | Thirty deploys, thirty drifting designs, no shared catalogue. This is the problem, not the solution. |
| **Shopify / Shopify Markets** | Requires a paid store to exist before the site does, which inverts the sale (F&A Móveis §2.2), and imposes a cart this business does not want. |
| **Path-based tenants (`/loja/silva`)** | Cheaper — no wildcard DNS — but a reseller cannot say "my site is X" in their shop window, and that sentence is most of what they are buying. Keep as the fallback if the domain (§4.1) stalls. |
| **Array of product relationships on `revendedores`** | §5.3. Unusable picker, one lock per edit, nowhere to hang curation. |
| **`sendBeacon` attribution on direct `wa.me` links** | §7.1. Loses exactly the traffic that matters. |
| **Per-reseller theming** | `spec-brand.md` §3. Destroys the product's core value. |
| **Building Amanda a custom admin** | Payload already is one, with the access-control model this design needs. Writing it by hand is weeks of work to arrive somewhere worse (`CLAUDE.md` §2). |

## 15. Open questions

All ten live in **`spec-brand.md` §6** with an owner each. The two that block code:

- **#4 — the domain.** Blocks every multi-tenant route. First purchase of the project.
- **#7 — pricing model.** Decides whether `mostruario.preco` exists, and whether "register a
  product once" survives contact with reality.
