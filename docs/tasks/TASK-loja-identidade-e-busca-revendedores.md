# TASK — `/loja/[rev]/a-loja` (shop identity) and city/UF search on `/revendedores`

## 1. Current scenario

`TASK-revendedores-e-seja-revendedor.md` just closed. `spec-design.md` §11 names two rows still
open that are **not** blocked on Amanda (unlike `/sobre` and `/atendimento-exclusivo`, both
`[VERIFICAR: blocked on open question]`):

- **Storefront table:** `/a-loja` — "Shop identity: photo, address, hours, map." Not built.
  `src/app/loja/[rev]/` today has only `page.tsx` (home) and `mostruario/page.tsx`.
- **Brand table:** `/revendedores` — "The network. **Search by city/UF.** Proof of 24 years."
  The search half was explicitly deferred by the task doc that built `/revendedores`
  (§2.7): *"with exactly one `exemplo` reseller today, a filter UI would be unverifiable
  against real content... Revisit once Fase 1 onboards more than one reseller."*

That deferral reasoning still holds literally — `content/revendedores.ts` still has exactly one
record (`Ótica Exemplo`). Raised with the user before scoping this doc; **resolved: add 2–3 more
`exemplo` resellers as part of this task**, same license as every other mock dataset in this repo
(`content/produtos.ts`, the original `content/revendedores.ts` comment), so the filter is
actually exercised rather than shipped unverifiable a second time.

`Revendedor` (`src/lib/catalog/types.ts` §70) currently has no `endereco`, `horarios`, or
`retrato` fields — `/a-loja` needs all three. `spec-architecture.md` §5.2 (the Fase 1 Payload
schema) already names them: `endereco`, `horarios` (group, reseller-editable), `retrato` (media,
"the one visual thing a reseller controls," `spec-brand.md` §3). Adding them to the Fase 0 type
now is implementing a field the target schema already specifies, not inventing one — same seam
discipline as everything else in `lib/catalog` / `lib/tenant`.

## 2. Planned changes

### 2.1 `src/lib/catalog/types.ts` — three new `Revendedor` fields

Mirrors `spec-architecture.md` §5.2 field names exactly (`endereco`, `horarios`, `retrato`), Fase
0 shape (plain strings/booleans, no Payload `media`/`group` types):

```ts
export interface Revendedor {
  // ...existing fields unchanged...
  endereco: string; // "" ⇒ not shown, same convention as `whatsapp`
  horarios: string; // free text, e.g. "Seg–Sex 9h–18h · Sáb 9h–13h"
  retrato: string; // image path, "" ⇒ "Sem foto" empty state (mirrors GaleriaProduto)
}
```

No `MedidasProduto`-style structured type for `horarios` — `spec-architecture.md` §5.2 lists it
as a Payload `group`, but nothing in this app needs to parse hours (no "open now" logic exists or
is planned), so a display string is the honest Fase 0 shape. Revisit only if a real feature reads
it.

### 2.2 `src/content/revendedores.ts` — 2–3 more `exemplo` resellers

Adds resellers with distinct `cidade`/`uf` (so the filter has something to filter), all obviously
fictional and `exemplo: true`, all `endereco`/`horarios` filled with plausible placeholder text,
all `retrato: ""` (no photography exists, `TASK-normalizar-imagens.md` still not built — honest
empty state, not an invented photo, `AGENTS.md` §0). `Ótica Exemplo` stays in Volta Redonda/RJ;
the new records get a different `cidade` each and at least one different `uf`, so both chip
dimensions (§2.5) are actually exercisable — e.g. one São Paulo/SP record, one Curitiba/PR or
Belo Horizonte/MG record. Names stay obviously fictional ("Ótica Demonstração," "Loja Exemplo"),
same license as `content/produtos.ts`.

### 2.2b `src/content/mostruario.ts` — one row per new reseller

`/revendedores` links every card to `/loja/${slug}` (§2.6, existing `RevendedorEndosso` → `Link`
pattern). A reseller with zero `mostruario` rows lands on a storefront whose `GradeProdutos`
renders "Nenhum modelo encontrado com esses filtros" — the wrong message (that's the *filtered-to-
empty* string, not a *this shop carries nothing* string) and a dead end for a directory entry.
Each new reseller (§2.2) gets at least one `mostruario` row, reusing the existing `TRI-MOD-A/B/C`
SKUs (`content/produtos.ts`) — doesn't need a full vitrine, just enough that `/loja/<novo-slug>`
shows a real card instead of an empty grid.

### 2.3 `src/app/loja/[rev]/a-loja/page.tsx` — shop identity

Server Component, same shell as `src/app/loja/[rev]/page.tsx` (`Ceu` + `VisorCursor`, no
`Cabecalho` — storefront routes don't carry brand nav, matching the existing `/loja/[rev]` and
`/mostruario` pages). Reuses `escopoRevendedor` for the `revendedor` record + `notFound()`, and
exports both `generateStaticParams` (via `revendedoresAtivosSlugs()`) and `generateMetadata`
(title `` `A loja · ${revendedor.nome}` ``, falling back to `"Loja"` on a `notFound` slug) —
copying `src/app/loja/[rev]/mostruario/page.tsx`'s pattern exactly, not just "same as sibling
routes" in spirit.

Content, in order:

1. `retrato` — `bg-lente` plate, `aspect-square`, `rounded-[var(--radius-lente)]`, "Sem foto"
   label when empty — the exact empty-state idiom `GaleriaProduto` already established
   (`components/produto/galeria-produto.tsx` §19–26), not a new pattern.
2. `RevendedorEndosso` (name + city/UF, already exists) — repeats the header pattern already used
   on `/loja/[rev]`.
3. `endereco`, `horarios` as labelled text rows — **the label idiom is `components/produto/
   filtros.tsx`'s chip-section label** (`font-mono text-[.6875rem] uppercase tracking-[.16em]
   text-cinza`, label above the value), not `FichaTecnica`'s horizontal `dl` (label-left/value-
   right row, `spec-design.md` §8's WEB Eyewear tech-spec-table reference) — that pattern is
   product-spec-specific and wrong here. Only rendered when non-empty, mirroring `whatsapp`'s
   `""` ⇒ hidden convention.
4. **No embedded/interactive map.** No Maps provider is chosen anywhere in this repo, every
   address is `exemplo` placeholder text, and an embedded map pointing at a fake address is worse
   than none — same reasoning that already governs invented prices/measurements
   (`AGENTS.md` §0). `spec-design.md` §11's "map" is `[VERIFICAR: no maps provider decided;
   revisit once real addresses exist and a provider is chosen — likely Fase 1]`.

### 2.4 `src/app/loja/[rev]/page.tsx` — one new nav link

Adds a link to `/loja/${slug}/a-loja` next to the existing "Ver tudo que essa loja tem" link
(same `foco-visor` treatment), so `/a-loja` is reachable — today nothing links to it.

### 2.5 `src/components/revendedor/filtro-revendedores.tsx` — city/UF chips

New component, follows `components/produto/filtros.tsx` byte-for-byte idiom: plain `Link` chips
building `?cidade=`/`?uf=` query strings, no client component, no fetch, shareable URL — the
state-management rule already established (`AGENTS.md` §0 "state management" section, point 3).
Not a rename/extension of `Filtros` — that component's `FiltrosAtivos` type is product-specific
(`formato`/`material`/`cor`/`genero`); reseller search is a different domain (`cidade`/`uf`), so a
sibling component is more honest than overloading one type for two shapes.

Matching rule, stated explicitly: **exact string equality** on the stored `cidade`/`uf` values —
same as `/catalogo`'s enum-equality filters, no case folding or partial match. Chip options are
derived from `revendedoresAtivos()`'s actual `cidade`/`uf` values (`[...new Set(...)].sort()`),
the same way `/catalogo` derives `coresDisponiveis` from the product list rather than a hardcoded
enum — with 3–4 `exemplo` records this stays trivially correct; revisit only once real reseller
data makes case/accent drift a real risk.

No mobile drawer/off-canvas split for this filter. `/catalogo` uses `FiltroToggle` +
`FiltroDrawer` because it has four filter groups on a two-column layout competing for space
(`spec-design.md` §9). `/revendedores` has two small chip rows (`cidade`, `uf`) above a
single-column grid — they render inline at all breakpoints, no toggle/drawer needed. Stated here
so this isn't "fixed" later by cloning the catalogo sidebar/drawer split onto a page that doesn't
need it.

### 2.6 `src/app/revendedores/page.tsx` — reads `searchParams`, filters, renders chips + empty state

Same shape `src/app/catalogo/page.tsx` already uses: `searchParams` prop, build `ativos` from it,
filter the array fetched from `revendedoresAtivos()`, render `FiltroRevendedores` above the grid.
No change to `lib/tenant/scope.ts` — filtering happens in the page against the already-fetched
list, exactly like `/catalogo` filters products in the page rather than in `lib/catalog`.

When the filtered list is empty, render the same honest-empty-state idiom `GradeProdutos` already
established (`components/produto/grade-produtos.tsx` §11–16: bordered, centered, `text-cinza`
message) with reseller-appropriate copy — e.g. "Nenhuma revenda encontrada com esses filtros." —
rather than a silent blank grid. Small enough to inline in the page rather than a new shared
component (one call site; `GradeProdutos`'s version is reused twice today — `/catalogo` and
`/mostruario` — which is what justified factoring it out there).

### 2.7 `scripts/verificar-fase-0.mts`

Adds `/loja/otica-exemplo/a-loja` to `PAGES` (§4, affected files) — the new route needs the same
JS-budget/LCP/CLS coverage every other route gets. `/revendedores` itself is already covered;
its filtered states (`?cidade=...`) are UI-tested manually (§5), not added as separate budget
entries — same as `/catalogo`'s filtered states today.

### 2.8 Explicitly out of scope

- **Interactive/embedded map.** §2.3 — no provider chosen, no real addresses yet.
- **Reseller-editable `retrato` upload UI.** That's Payload admin, Fase 1 — this task only adds
  the field and its read-side empty/filled states.
- **Free-text search box / typeahead on `/revendedores`.** `spec-design.md` §11 says "search by
  city/UF," which the chip idiom already satisfies (same exact-match filter shape `/catalogo`
  uses) — a text input is a different, unrequested feature.
- **`horarios` "open now" logic.** No structured time data exists (§2.1) — display only.
- **Sitemap changes.** `/loja/*` stays out of `sitemap.ts` and `robots.ts`'s allow set — it's the
  Fase 0 path stand-in, not the real subdomain shape (existing comment in both files already
  covers this; `/a-loja` is one more route under the same disallowed prefix, no new line needed).

## 3. Why

Both pieces close the last two unblocked rows in `spec-design.md` §11's route tables. Building
them now, rather than waiting, keeps pace with the rest of Fase 0's route table without touching
anything blocked on Amanda (`[VERIFICAR]` items untouched) or front-loading Fase 1/3 scope (no
Payload, no real map provider, no reseller self-service).

## 4. Affected files

| File | Change type | Notes |
|---|---|---|
| `src/lib/catalog/types.ts` | modified | `Revendedor` gains `endereco`, `horarios`, `retrato`; stale "no `endereco`/`horarios` yet" comment (line ~69) corrected (§2.1) |
| `src/content/revendedores.ts` | modified | 2–3 more `exemplo` resellers, distinct cidade/uf (§2.2) |
| `src/content/mostruario.ts` | modified | one `mostruario` row per new reseller, reusing existing `TRI-MOD-*` SKUs (§2.2b) |
| `src/app/loja/[rev]/a-loja/page.tsx` | new | shop identity page, `generateStaticParams` + `generateMetadata` (§2.3) |
| `src/app/loja/[rev]/page.tsx` | modified | nav link to `/a-loja` (§2.4) |
| `src/components/revendedor/filtro-revendedores.tsx` | new | city/UF chip filter, URL-param idiom (§2.5) |
| `src/app/revendedores/page.tsx` | modified | reads `searchParams`, filters, renders chips + empty state (§2.6) |
| `scripts/verificar-fase-0.mts` | modified | adds `/loja/otica-exemplo/a-loja` to `PAGES` (§2.7) |
| `docs/spec-design.md` | modified | §11 `/a-loja` row gets a footnote: `[VERIFICAR: no maps provider chosen]` |
| `README.md` | modified | Status section: two more routes/features live |

## 5. Verification

- `pnpm lint` and `pnpm build` clean.
- `pnpm exec tsx scripts/verificar-fase-0.mts` — new route added to `PAGES`; JS transfer ≤180 KB
  gzipped, LCP ≤2.0s, CLS ≤0.05 (`spec-design.md` §12).
- Visual: `/loja/otica-exemplo/a-loja` renders "Sem foto," endereço, horários for the original
  mock reseller; `/revendedores?cidade=...` and `?uf=...` narrow the grid to matching resellers
  across all `exemplo` records added in §2.2; clearing filters restores the full list; a filter
  combination matching nothing renders the empty-state message (§2.6), not a blank grid.
- Visual: `/loja/<novo-slug>` (every new reseller from §2.2) renders at least one product card via
  its `mostruario` row (§2.2b), not an empty "Nenhum modelo encontrado" grid.
- `prefers-reduced-motion: reduce` pass on `/a-loja` and `/revendedores` (filtered + unfiltered):
  zero console/page errors, content fully visible.
- Keyboard pass: `Tab` reaches the new `/a-loja` nav link, the city/UF chips, and "Limpar
  filtros" in DOM order, no new focus traps.
