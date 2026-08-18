# TASK — Payload, Postgres and the tenancy boundary (Fase 1 foundation)

**Status:** Stages B–E implemented 2026-08-18 on top of doc-faithful Payload install (blank
template v3.88.0). Stage A (Marketplace provisioning) and Stage F (real data entry) remain
manual. Run `pnpm dev` once, answer Drizzle push prompts (or reset Neon first), create admin
at `/admin`.

### Drizzle push troubleshooting (2026-08-18)

When upgrading from the blank template (`users`, `media`) to Trísion (`usuarios` + six
collections), Drizzle's interactive push asks whether each new table is a **create** or
**rename**. Always pick **`+ create table`**. Picking `~ rename table` (e.g.
`users_sessions › usuarios_sessions`) leaves Payload's internal rel tables
(`payload_locked_documents_rels`, `payload_preferences_rels`) with a stale `users_id`
column; the next push then tries to `DROP CONSTRAINT payload_locked_documents_rels_users_fk`
which may not exist → `/admin` 500.

**Fix (dev, data already broken):** `pnpm payload:fix-rels` renames `users_id` →
`usuarios_id` on those two rel tables. **Nuclear option (empty dev DB):**
`pnpm payload:reset-db` then restart `pnpm dev` and create admin again.

## 1. Current scenario

Fase 0 is complete against mock data (README "Status", 2026-08-18): `/`, `/colecoes`,
`/catalogo`, `/oculos/[slug]`, `/revendedores`, `/seja-revendedor` and the path-based
storefront stand-in `/loja/[rev]` all render off typed TS modules in `src/content/`
(`produtos.ts`, `colecoes.ts`, `revendedores.ts`, `mostruario.ts`, `marca.ts`), every row
marked `exemplo`. There is no Payload, no database, no Blob — a deliberate Fase 0 scope
decision (`spec-architecture.md` §3).

**The two seams already exist as interfaces**, per `spec-architecture.md` §6.1:

- `src/lib/catalog/{types.ts,source.ts,source.local.ts}` — `CatalogSource` interface,
  implemented by `catalogSourceLocal` against `content/produtos.ts` / `content/colecoes.ts`.
- `src/lib/tenant/{source.ts,source.local.ts,scope.ts}` — `TenantSource` interface,
  implemented by `tenantSourceLocal` against `content/revendedores.ts` /
  `content/mostruario.ts`. `scope.ts` is the one scoping module (`escopoRevendedor`,
  `revendedoresAtivos`, `revendedoresAtivosSlugs`, `revendedoresQueCarregam`).

**Gap found while planning this task:** the seam's own promise — "Fase 1 swaps one module
instead of rewriting the site" (`spec-architecture.md` §3, §6.1) — is not actually true
today. `catalogSourceLocal` / `tenantSourceLocal` are imported **directly** by 11 files,
not through a single selection point:

```
src/app/sitemap.ts
src/app/(marca)/page.tsx
src/app/(marca)/catalogo/page.tsx
src/app/(marca)/catalogo/opengraph-image.tsx
src/app/(marca)/colecoes/page.tsx
src/app/(marca)/colecoes/[slug]/page.tsx
src/app/(marca)/colecoes/[slug]/opengraph-image.tsx
src/app/(marca)/oculos/[slug]/page.tsx
src/app/(marca)/oculos/[slug]/opengraph-image.tsx
src/lib/tenant/scope.ts
```

(`scope.ts` itself imports both `source.local` modules — every page under `loja/[rev]`
goes through it, so those routes are already one hop closer to a clean swap than the
`(marca)` routes above, which import `catalogSourceLocal` straight from `source.local`.)

Other relevant current state:

- `package.json`: Next 16.3.1, React 19.2.8, pnpm 11.21.0. Next already satisfies
  Payload's `≥16.2.0` floor (`spec-architecture.md` §4). No Payload package, no test
  runner (only Playwright E2E + `tsx` scripts) is installed.
- No `.env.example` exists yet — `spec-architecture.md` §12 requires one the moment code
  reads a var, and this task is the first code to read `DATABASE_URL` /
  `PAYLOAD_SECRET` / `BLOB_READ_WRITE_TOKEN`.
- `src/app/(marca)/` already exists as a route group (ahead of `AGENTS.md`'s "target,
  not yet built" framing — it's done). `src/app/loja/[rev]/` is the Fase 0 path
  stand-in. There is no `middleware.ts`, no `(loja)` group, no `(payload)` group, no
  `ir/` route.
- **Open questions still blocking** (`spec-brand.md` §6, `spec-architecture.md` §15):
  - **#4, the domain** — partially answered 2026-08-17 (Amanda confirmed she owns one),
    but the exact string and DNS/registrar access are still `[VERIFICAR]`. Wildcard
    subdomains require the apex string, which we don't have.
  - **#7, pricing model** — per-reseller price vs. one suggested price is still
    undecided, so `mostruario.preco` cannot be built.

## 2. Planned changes

### Stage A — Provisioning (no code)

- Run Vercel Marketplace discovery for a Postgres provider — **do not pick one from
  memory** (`AGENTS.md` §2.0.5, `spec-architecture.md` §4 row "Database"). Provision via
  the `vercel:marketplace` skill/CLI at execution time.
- Provision Vercel Blob for product photography and reseller portraits.

### Stage B — Payload install

- **Check Payload's current docs first** (`AGENTS.md` §2.0) for the officially
  recommended way to add Payload to an *existing* Next.js app — don't assume
  `pnpm create payload-app@latest` (that scaffolds a new app) is the right entry point
  here.
- Install `payload` (current `≥3.73.0` line — re-verify the floor against Payload's own
  Next-16 compatibility notes), `@payloadcms/next`, `@payloadcms/db-postgres`,
  `@payloadcms/storage-vercel-blob`, a rich-text package (whatever current docs default
  to for `descricao`), and `@payloadcms/plugin-multi-tenant`.
- Mount the admin panel and REST/GraphQL API per current docs.
  `[VERIFICAR: exact file paths/route handlers — likely
  src/app/(payload)/admin/[[...segments]]/page.tsx and
  src/app/(payload)/api/[...slug]/route.ts, but confirm against the installed version's
  own docs rather than assuming]`. `payload.config.ts` location (repo root vs. `src/`)
  is also version-dependent — confirm, don't guess.
- Create `.env.example` with `DATABASE_URL`, `PAYLOAD_SECRET`, `BLOB_READ_WRITE_TOKEN`,
  `SITE_URL`, `WHATSAPP_MARCA` (`spec-architecture.md` §12).

### Stage C — Collections (Fase 1 scope only)

Per the phasing table (`spec-architecture.md` §3), **Fase 1's row is "produtos /
revendedores / mostruario"** — `leads` is explicitly a Fase 2 line item even though its
schema is already specified in §5.4. Build six collections/globals, not seven:

- **`produtos`** (§5.1) — every field in that table, `medidas` as a numeric group
  (never a formatted string), `precoSugerido` optional with no default. `access.create`
  returns `user.role === 'admin'` (lock 1). Not listed in the multi-tenant plugin — stays
  global, per the §5.1 inversion. Admin UI create action hidden for `revendedor` role
  (lock 2) — `[VERIFICAR: current Payload API for role-conditional admin UI, e.g. an
  admin.hidden function vs. a custom List view — don't invent the prop name]`.
- **`colecoes`** (§5.5) — `nome`, `slug`, `ano`, `capa`, `texto`. Global, admin CRUD /
  revendedor read.
- **`revendedores`** (§5.2) — every field in that table, with field-level access
  matching the "reseller may edit" column exactly (`whatsapp`, `instagram`,
  `endereco`/`horarios`, `retrato`, `sobre` editable by the owning reseller; `nome`,
  `slug`, `cidade`, `uf`, `status`, `destinoLead` admin-only). This collection **is**
  the plugin's tenants collection (`tenantsSlug`). No colour/logo/font field — ever
  (`spec-brand.md` §3, enforced in schema per `AGENTS.md` §0).
- **`mostruario`** (§5.3) — `revendedor` rel (set by the plugin, never user-writable),
  `produto` rel, `disponivel` (default `true`), `destaque`, `ordem`, `observacao`. **No
  `preco` field** — question #7 is unresolved; do not build it speculatively, per the
  spec's own instruction. Listed in the multi-tenant plugin so it gets tenant filtering;
  access rules give a `revendedor` CRUD on own rows only (§5.6).
- **`usuarios`** (§5.5) — `role`: `admin` | `revendedor`. `[VERIFICAR: current
  @payloadcms/plugin-multi-tenant docs for how it expects the auth collection to declare
  tenant membership — likely a plugin-managed array field, not a hand-rolled singular
  `tenant` field. Confirm the real shape before writing this collection instead of
  guessing from the spec's plain-English description.]`
- **`config`** global (§5.5) — brand WhatsApp, socials, home hero, footer, `Desde 2002`.

Wire `@payloadcms/plugin-multi-tenant` with `revendedores` as the tenants collection and
`mostruario` as the one listed tenant-scoped collection — `produtos`, `colecoes`,
`config` stay outside the plugin's `collections` list, which is what keeps them global
(§5.1).

### Stage D — The access-control test (§6.2)

- No test runner exists yet. Add one — `[VERIFICAR: Payload's current testing docs;
  likely Vitest against the local API and a disposable test Postgres]` — as a
  devDependency, scoped to this need, not a general test-framework migration.
- Port Flora's `tenancy.spec.ts` pattern: one test enumerating every Payload collection
  and asserting its access config matches the §5.6 matrix, so a future collection added
  without a tenancy decision fails CI instead of shipping open.
- A second assertion: a `revendedor`-role user's `create` on `produtos` is denied
  (lock 1, verified in code, not just by the hidden admin button).

### Stage E — The seam swap, and closing the gap found in §1

- Add `src/lib/catalog/source.payload.ts` implementing `CatalogSource` against
  `produtos` / `colecoes` via Payload's local API.
- Add `src/lib/tenant/source.payload.ts` implementing `TenantSource` against
  `revendedores` / `mostruario`.
- **Fix the direct-import gap**: add one selection point per seam (e.g. `catalogSource`
  exported from `lib/catalog/source.ts` itself, chosen by whether `DATABASE_URL` is
  set) and repoint the 11 files listed in §1 at it instead of `source.local` directly.
  This is what makes "swap one module" true rather than aspirational.
- Leave `content/*.ts` + `source.local.ts` in place as the offline/no-DB fallback —
  `scripts/verificar-fase-0.mts` and any future demo-without-a-database path may still
  want it. `[VERIFICAR: confirm with Benito whether source.local should be retired once
  Payload is live in production, or kept indefinitely as a dev fallback — not assumed
  here.]`

### Stage F — Onboarding, and what's deliberately not in this task

- Once Amanda supplies real product/reseller data, enter it through `/admin` — never
  invented, per `AGENTS.md` §0.
- The custom reseller mostruário grid (§5.3 — "budget this explicitly; it is the
  reseller's entire experience of the CMS") is **its own follow-up task document**
  (`TASK-mostruario-admin-view.md`, not written yet), not attempted inline here — it's
  a UI-design-sized problem on top of an already large foundational task.

## 3. Why

- Payload + Postgres + Blob is the Fase 1 foundation the client is being charged for
  (`spec-architecture.md` §3; README: already closed at R$300 through Fase 2, only
  Fase 3 open) — this is the highest-value next step.
- **Wildcard subdomain routing is deliberately excluded from this task**, even though
  the Fase 1 row in §3 lists "subdomain routing": question #4 still lacks the exact
  domain string and DNS access despite Amanda's 2026-08-17 confirmation that she owns
  one. `spec-architecture.md` §4.1 calls the domain a hard blocker, and §14 names
  path-based `/loja/[rev]` (already built) as the explicit fallback "if the domain
  stalls." Building `middleware.ts` against an unresolved fact would be the same
  category of mistake `AGENTS.md` §0 forbids for prices or measurements, applied to a
  domain string.
- **`leads` / `/ir/*` / the dashboard are deliberately excluded**: the phasing table
  places them in Fase 2. Pulling them forward blurs the phase boundaries Amanda is
  billed against.
- **`mostruario.preco` is deliberately excluded**: question #7 is unresolved, and the
  spec itself flags this exact field as the one that "quietly destroys 'one catalogue'"
  if built speculatively.
- The Stage E seam fix is worth doing now, not later: the 11-file direct-import gap
  found while reading the current code means the "one module swap" design goal
  (the entire justification for `source.ts`/`scope.ts` existing) would otherwise fail
  the first time anyone actually tries to do that swap.

## 4. Explicitly out of scope

- `middleware.ts` Host-based rewrite, wildcard `*.trision.com.br`, the `(loja)` route
  group replacing `src/app/loja/[rev]/` — blocked on open question #4.
- `leads` collection, `/ir/[rev]/[sku]` redirect, Vercel BotID, Amanda's lead dashboard
  — Fase 2 (`spec-architecture.md` §3).
- `mostruario.preco` — blocked on open question #7.
- The custom reseller mostruário grid admin view — follow-up task.
- Reseller self-onboarding automation, per-reseller custom domains, CSV import — Fase 3.
- Any invented product, reseller, price, or measurement — real data only, `exemplo`
  content otherwise.

## 5. Affected files

| File | Change type | Notes |
|------|-------------|-------|
| `payload.config.ts` | new | location per current Payload docs — `[VERIFICAR]` |
| `src/app/(payload)/admin/[[...segments]]/page.tsx` (+ related) | new | exact shape `[VERIFICAR]` against installed version |
| `src/app/(payload)/api/[...slug]/route.ts` | new | REST/GraphQL mount, shape `[VERIFICAR]` |
| `src/collections/Produtos.ts` | new | §5.1, two-lock create access |
| `src/collections/Colecoes.ts` | new | §5.5 |
| `src/collections/Revendedores.ts` | new | §5.2, field-level allowlist, plugin tenants collection |
| `src/collections/Mostruario.ts` | new | §5.3, no `preco` field |
| `src/collections/Usuarios.ts` | new | §5.5, role + tenant membership, shape `[VERIFICAR]` |
| `src/globals/Config.ts` | new | §5.5 |
| `.env.example` | new | `DATABASE_URL`, `PAYLOAD_SECRET`, `BLOB_READ_WRITE_TOKEN`, `SITE_URL`, `WHATSAPP_MARCA` |
| `src/lib/catalog/source.payload.ts` | new | `CatalogSource` impl |
| `src/lib/tenant/source.payload.ts` | new | `TenantSource` impl |
| `src/lib/catalog/source.ts` | modified | add the active-source selection point |
| `src/lib/tenant/source.ts` | modified | add the active-source selection point |
| 11 files listed in §1 | modified | repoint from `source.local` to the new selection point |
| test file (path TBD with the chosen runner) | new | §6.2 access-control catalog test |
| `package.json` / lockfile | modified | Payload, plugin, storage, db-postgres, test runner |
| `README.md`, `AGENTS.md` | modified | Status section, stack table row updates (§3 of this repo's workflow rules) |

## 6. Verification

- `pnpm build` succeeds with Payload mounted alongside the existing app.
- `/admin` loads; an admin user can log in (first-run flow per current Payload docs,
  `[VERIFICAR]` exact mechanism).
- The Stage D test suite passes, and fails when an access rule is deliberately removed
  (mutation-tested, so it's proven to assert something).
- Manual check: a `revendedor`-role user sees no create action on `produtos` in
  `/admin`.
- Manual check: two seeded test tenants — a `revendedor`-role user's `mostruario` list
  shows only their own rows, never the other tenant's.
- Existing Fase 0 routes (`/`, `/colecoes`, `/catalogo`, `/oculos/[slug]`, `/loja/[rev]`,
  `/revendedores`) render identically once `source.payload.ts` is the active source —
  compare against current mock-data output.
- `grep` `.env.example` against every `process.env.*` read introduced in this task —
  none missing (`AGENTS.md` §3.1's F&A Móveis lesson).
- Negative check: no `mostruario.preco` field in the schema.
- Negative check: no `middleware.ts` / wildcard routing added.
- `README.md` Status section and `AGENTS.md` §0 stack table reflect Payload as
  "started," not "not started."
