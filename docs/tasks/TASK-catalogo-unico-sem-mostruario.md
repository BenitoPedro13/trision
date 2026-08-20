# TASK — One catalogue everywhere: remove `mostruario`, resellers stop curating

**Decided by Benito, 2026-08-20.** Every reseller storefront shows Trísion's full active
catalogue — the same one, everywhere. A reseller no longer selects which frames it carries.
The reseller's storefront/link exists for two things only: **endorsement** (`spec-brand.md`
§3, unchanged) and **attribution** — so when a customer reaches Amanda through a reseller's
WhatsApp CTA, she knows which shop to pay commission on.

This directly reverses `spec-architecture.md` §1 requirement 2 ("showing only the frames it
actually carries, selected by the reseller in a CMS") and the `mostruario` join collection
built for it in `TASK-payload-tenancy.md` Stage C. Confirmed with Benito
(`AskUserQuestion`, 2026-08-20): not "per-reseller subset curated by Amanda instead of the
reseller" — **one identical catalogue, no per-reseller selection at all.**

## 1. Current scenario

`mostruario` (`collections/Mostruario.ts`) is a live Payload collection, listed in
`payload.config.ts`'s `multiTenantPlugin` `collections` config, with `access: { create, read,
update, delete }` all `Boolean(req.user)` — meaning a logged-in `revendedor` user can already
write their own rows today. This is exactly the self-curation behaviour being removed.

It is threaded through the whole stack:

- **Types:** `MostruarioItem` in `src/lib/catalog/types.ts`.
- **Fase 0 mock data:** `src/content/mostruario.ts` (join rows for 8 mock resellers).
- **Seams:** `TenantSource.listarMostruario` in `src/lib/tenant/source.ts`,
  `source.local.ts`, `source.payload.ts`; `mapMostruario` in `src/lib/payload/map.ts`.
- **Scoping:** `escopoRevendedor` in `src/lib/tenant/scope.ts` returns `itens:
  ItemMostruario[]` (a reseller's filtered, sorted, available subset) instead of the full
  catalogue. `revendedoresQueCarregam(sku)` answers "which resellers carry this SKU" — a
  question that stops making sense once every reseller carries everything.
- **Routes:** `/loja/[rev]` shows a `destaque` subset with a "ver tudo" link to
  `/loja/[rev]/mostruario`, which shows the full filtered `itens` grid.
  `/loja/[rev]/oculos/[slug]` 404s if the SKU isn't in that reseller's `itens`.
- **UI:** `LojaCabecalho`'s nav has a "Mostruário" tab. `OndeComprar` (on
  `/oculos/[slug]`) lists every reseller that carries a given SKU — now every active
  reseller, on every product, always.
- **Tests/scripts:** `tests/tenancy-access.spec.ts` asserts the `mostruario` access matrix
  (including reseller CRUD on own rows) and that it has no `preco` field.
  `scripts/seed-mock-data.mts` seeds `mostruario` rows. `scripts/verificar-fase-0.mts`
  measures `/loja/otica-exemplo/mostruario`.
- **Docs:** `spec-architecture.md` §1, §3, §5.3, §5.6, §9, §14, §15, NFR-1;
  `spec-design.md` §11; `spec-brand.md` §1.6 (uses "mostruário" as the data-model half of
  "the find"); `README.md` routes table, key-files tree, budget table; `AGENTS.md` stack
  table and repo-layout tree.

## 2. Planned changes

### Data model / Payload

- Delete `collections/Mostruario.ts`.
- `payload.config.ts`: drop the `Mostruario` import and its entry in `collections: [...]`;
  change `multiTenantPlugin({ collections: { mostruario: {} }, ... })` to
  `collections: {}` — the plugin still does real work (tenants-array field on `usuarios`,
  `revendedor` tenant field on `revendedores` itself, admin tenant selector), it just no
  longer lists any tenant-scoped collection. `revendedores`' own hand-rolled access
  (`revendedorOwnTenantUpdate` etc. in `src/payload/access.ts`) is untouched — it already
  doesn't depend on the plugin's `collections` list, only on `user.tenants`.

### Seams and types

- `src/lib/catalog/types.ts`: remove `MostruarioItem`.
- Delete `src/content/mostruario.ts`.
- `src/lib/tenant/source.ts`: drop `listarMostruario` from `TenantSource` and its
  implementation; drop the now-unused `MostruarioItem` import.
- `src/lib/tenant/source.local.ts`: drop the `mostruario` import and `listarMostruario`.
- `src/lib/tenant/source.payload.ts`: drop `listarMostruario`.
- `src/lib/payload/map.ts`: drop `mapMostruario`, `MostruarioDoc`, and the now-unused
  `MostruarioItem` import.
- `src/lib/tenant/scope.ts`: rewrite `escopoRevendedor(slug)` to return `{ revendedor,
  produtos }` where `produtos` is simply `catalogSource.listarProdutos()` — the exact same
  call `/catalogo` makes, unfiltered by tenant, because there is no longer a tenant filter
  to apply. Remove `ItemMostruario` and `revendedoresQueCarregam` entirely — "which
  resellers carry SKU X" has no answer once the answer is always "all of them."

### Routes and components

- `src/app/(frontend)/loja/[rev]/page.tsx`: becomes the shop's whole catalogue — merge in
  the filterable-grid logic currently in `.../mostruario/page.tsx` (same `Filtros` /
  `FiltroDrawer` / `GradeProdutos` pattern as `/catalogo`, still "the same components with a
  different tenantId," `spec-design.md` §11), keep the reseller's `sobre` blurb above the
  grid. Drop the `destaque`/"ver tudo" split — there is nothing left to split.
- Delete `src/app/(frontend)/loja/[rev]/mostruario/page.tsx` and the whole `mostruario/`
  route folder.
- `src/app/(frontend)/loja/[rev]/oculos/[slug]/page.tsx`: look the product up via
  `catalogSource.listarProdutos()` / the resolved `escopo.produtos`, not `escopo.itens`; a
  SKU 404s only if the product itself doesn't exist or isn't `ativo` — never because "this
  reseller doesn't carry it," since that concept is gone.
- `src/components/revendedor/loja-cabecalho.tsx`: remove the "Mostruário" tab from `TABS`
  (left with "Vitrine" and "A loja").
- `src/components/produto/onde-comprar.tsx`: `revendedoresQueCarregam(sku)` no longer
  exists and the question it answered is now the same on every product page. Replace the
  per-SKU reseller list with a single line + link to `/revendedores` ("Encontre uma revenda
  oficial perto de você") — informative without implying a selectivity that no longer
  exists. Still reads through `lib/tenant/scope.ts`
  (`revendedoresAtivos`), not `content/` directly.
- `src/components/produto/grade-produtos.tsx`: update the doc comment's route reference
  from `/loja/[rev]/mostruario` to `/loja/[rev]`.

### Tests, scripts, seed data

- `tests/tenancy-access.spec.ts`: drop the `mostruario` row from `ACCESS_MATRIX`; drop the
  `Mostruario` import and the offline "`mostruario` schema has no `preco` field" test (the
  collection no longer exists to assert against).
- `scripts/seed-mock-data.mts`: drop the `mostruario` import, the `MostruarioItem` import,
  the `existingMostruario` force-delete block, and the seeding loop at the end.
- `scripts/verificar-fase-0.mts`: replace `/loja/otica-exemplo/mostruario` with
  `/loja/otica-exemplo` in `PAGES` (already present as its own budget row via `/` — no,
  `/loja/otica-exemplo` isn't currently measured at all; add it, replacing the mostruário
  line, since that's now the shop's whole catalogue page and the one worth budgeting).

### Docs

- `spec-architecture.md`:
  - §1, requirement 2 — rewrite: "Every reseller storefront shows the same catalogue.
    Selection is gone; the storefront exists for endorsement (§ brand `spec-brand.md` §3)
    and lead attribution."
  - §3 phasing table — Fase 1 row: "produtos / revendedores" (drop `mostruario`).
  - §5.3 — replace the `mostruario` section with a short **"REMOVED 2026-08-20"** note
    explaining the decision and pointing at this task doc, so a future reader doesn't
    wonder where it went.
  - §5.6 access matrix — drop the `mostruario` row.
  - §9 — reseller admin no longer lands on a mostruário grid (that whole "custom Payload
    admin view" line item in §5.3 is now moot); reseller's `/admin` is just their own
    `revendedores` profile fields (and later, own `leads`, Fase 2).
  - §14 alternatives — add a row: "Per-reseller `mostruario` join (curated subset, by
    Amanda or the reseller)" → rejected 2026-08-20, one catalogue is simpler and matches
    how Amanda actually intends to run the network (consignado/atacado, she finishes every
    sale herself regardless of who referred it).
  - §15 / NFR-1 — `mostruario` no longer named; NFR-1 narrows to `leads`.
  - Repo layout (§10) and any collection list — drop `Mostruario.ts`.
- `spec-design.md` §11 — reseller storefront table: drop the `/mostruario` row, update `/`
  row's purpose to "the shop's whole catalogue, endorsement line, its contact." Brand site
  `/oculos/[slug]` row's "onde comprar" wording stays accurate as-is (still lists
  resellers, just always the same list now — not worth rewording the screens table over).
- `spec-brand.md` — no structural change to §1.6 ("the find"): "each reseller's storefront
  shows a *selection* of Amanda's stock" is now wrong and gets corrected to "shows Amanda's
  full catalogue" — the three-part analogy (mark / product / business) still holds, a frame
  is still a decision about what you look at, it's just Amanda's decision for the whole
  business rather than each reseller's for their shop.
- `README.md` — storefronts route table (drop the `/mostruario` row, update `/loja/[rev]`
  purpose, drop the "(tenant-scoped: 404 if shop doesn't carry it)" clause on
  `/oculos/[slug]`), key-files tree (drop `mostruario.ts`), budget table (replace the
  `/loja/[rev]/mostruario` row — see Verification).
- `AGENTS.md` — stack table `Tenancy seam` row description, and the target-layout /
  current-layout trees wherever they mention `mostruario`.

## 3. Why

- **It's what the business actually is.** Per Amanda (relayed 2026-08-20): she runs
  consignado *and* atacado, but for this system "será tudo por mim, eles revendem, eu
  finalizo entrega, pagamento e repasso comissão" — she fulfills every sale herself
  regardless of which shop referred the customer. A reseller's storefront was never going
  to gate what she's willing to sell through it; it only needed to say "this shop sent you."
- **It deletes a whole planned deliverable for free.** `spec-architecture.md` §5.3's
  "reseller-facing UX… ship a custom Payload admin view… budget this explicitly" — the
  mostruário toggle grid — no longer needs to exist. That was flagged as its own
  follow-up task (`TASK-mostruario-admin-view.md`, never written); it now never will be.
- **It matches question #7's answer.** Amanda: "Mesmo preço, tabelado" — one price
  everywhere. One catalogue is the same shape of answer to the adjacent question of *what*
  is the same everywhere.
- **Attribution already works without it.** `BotaoWhatsApp`/`lib/lead/link.ts` already
  names the reseller and city in the WhatsApp message text (`spec-architecture.md` §7.3),
  independent of `mostruario`. The `/ir/[rev]/[sku]` `leads` collection (Fase 2) is the
  system's actual commission-attribution mechanism; nothing in this task touches or
  depends on it.

## 4. Explicitly out of scope

- The `/ir/[rev]/[sku]` lead redirect and `leads` collection — still Fase 2, untouched by
  this task.
- `destinoLead` on `revendedores` — Amanda confirmed it should always resolve to `marca`
  ("Deverá ser comigo"), matching the existing default; the field and its admin-only
  access stay as they are, not touched here. (Recorded as answered in `spec-brand.md` §6
  question 6, see docs update in this task.)
- Commission calculation or payout tracking — not asked for; the system's job stays
  "tell Amanda which shop sent this lead," never "compute what she owes."
- Any change to `revendedores` fields, access, or the multi-tenant plugin's handling of
  `usuarios`/`revendedores` — only the `collections: {}` line changes, nothing about how a
  reseller edits their own shop profile.
- Re-litigating brand-architecture rules (`spec-brand.md` §3) — a reseller is still an
  endorsement, not a sub-brand; unaffected by this change.

## 5. Affected files

| File | Change type | Notes |
|------|-------------|-------|
| `collections/Mostruario.ts` | removed | |
| `payload.config.ts` | modified | drop import + collections entry; plugin `collections: {}` |
| `src/lib/catalog/types.ts` | modified | remove `MostruarioItem` |
| `src/content/mostruario.ts` | removed | |
| `src/lib/tenant/source.ts` | modified | drop `listarMostruario` |
| `src/lib/tenant/source.local.ts` | modified | drop mostruario import/method |
| `src/lib/tenant/source.payload.ts` | modified | drop `listarMostruario` |
| `src/lib/payload/map.ts` | modified | drop `mapMostruario`/`MostruarioDoc` |
| `src/lib/tenant/scope.ts` | modified | `escopoRevendedor` returns full catalogue; drop `revendedoresQueCarregam` |
| `src/app/(frontend)/loja/[rev]/page.tsx` | modified | full filterable grid, drop destaque split |
| `src/app/(frontend)/loja/[rev]/mostruario/page.tsx` | removed | folder deleted |
| `src/app/(frontend)/loja/[rev]/oculos/[slug]/page.tsx` | modified | look up product directly |
| `src/components/revendedor/loja-cabecalho.tsx` | modified | drop "Mostruário" tab |
| `src/components/produto/onde-comprar.tsx` | modified | generic `/revendedores` link, drop SKU lookup |
| `src/components/produto/grade-produtos.tsx` | modified | doc comment route reference |
| `tests/tenancy-access.spec.ts` | modified | drop `mostruario` matrix row + import + offline test |
| `scripts/seed-mock-data.mts` | modified | drop mostruario seeding |
| `scripts/verificar-fase-0.mts` | modified | swap measured route |
| `docs/spec-architecture.md` | modified | §1, §3, §5.3, §5.6, §9, §14, §15, NFR-1, §10 |
| `docs/spec-design.md` | modified | §11 |
| `docs/spec-brand.md` | modified | §1.6 |
| `README.md` | modified | routes, key files, budget table |
| `AGENTS.md` | modified | stack table, layout trees |

## 6. Verification

- `pnpm build` succeeds.
- `pnpm test:tenancy` passes with `mostruario` removed from the access matrix (offline
  suite; the DB-backed suite is `skipIf(!hasDatabase)`).
- `grep -rn "mostruario\|Mostruario" src collections payload.config.ts scripts tests` —
  zero hits.
- Manual: `/loja/otica-exemplo` renders the full catalogue (same product count as
  `/catalogo`); `/loja/otica-exemplo/mostruario` 404s (route no longer exists);
  `/loja/otica-exemplo/oculos/<any active sku>` renders for every active SKU, not just a
  previously-assigned subset.
- `pnpm exec tsx scripts/verificar-fase-0.mts` re-measures `/loja/otica-exemplo` (its
  budget numbers are stale under the old `/mostruario` path and must be re-taken, not
  copied forward, per `AGENTS.md` §0 "never invent a fact" applied to a performance
  number).
