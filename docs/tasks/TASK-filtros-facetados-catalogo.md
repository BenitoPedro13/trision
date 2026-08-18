# TASK — Faceted narrowing for `/catalogo`'s filter chips

## 1. Current scenario

User-reported, screenshot of `/catalogo`'s sidebar: `Filtros` (`components/produto/filtros.tsx`)
always renders the full static option list per facet — `FORMATOS`/`MATERIAIS`/`GENEROS` constants,
plus `coresDisponiveis` (already dynamic, but computed from *all* products regardless of active
filters). Selecting `genero=feminino` still shows every formato/material/cor chip, including ones
that don't exist on any feminino product — a selectable combination that silently returns zero
results, the same shape of bug just fixed on `/revendedores` (`TASK-loja-identidade-e-busca-
revendedores.md` §2.5: UF now narrows the Cidade chip list). User asked for the general version:
*"selecting one filter should rerender only showing the available other filters for that first
selection."*

This is standard faceted search: each facet's option list is computed from products matching
every *other* active filter, excluding the facet's own — so a facet never hides the value the
user just picked, but does hide values with zero matches given the rest of the selection.

## 2. Planned changes

### 2.1 `src/app/catalogo/page.tsx` and `src/app/loja/[rev]/mostruario/page.tsx` — per-facet narrowing

Both pages replace their single static `coresDisponiveis` line with four `*Disponiveis`
computations, each filtering `todos` by every active facet except its own, using the shared
`combina()` import (§2.1b):

```ts
const formatosDisponiveis = [...new Set(todos.filter((p) => combina(p, ativos, "formato")).map((p) => p.formato))].sort();
const materiaisDisponiveis = [...new Set(todos.filter((p) => combina(p, ativos, "material")).map((p) => p.material))].sort();
const coresDisponiveis = [...new Set(todos.filter((p) => combina(p, ativos, "cor")).map((p) => p.cor))].sort();
const generosDisponiveis = [...new Set(todos.filter((p) => combina(p, ativos, "genero")).map((p) => p.genero))].sort();
const produtos = todos.filter((p) => combina(p, ativos));
```

`combina` (called with no `excluir`) also replaces each page's inline `&&` chain for `produtos` —
one shared function instead of the filter predicate duplicated across two routes.

`mostruario/page.tsx` gets this too, not just `/catalogo` — both render the same shared
`Filtros`/`FiltroDrawer` (`spec-design.md` §11: "the two are the same components with a different
tenantId"), so leaving one un-narrowed would reintroduce the exact bug this task closes, one route
later.

### 2.2 `src/components/produto/filtros.tsx` — reads narrowed lists, not static enums

`Filtros` currently builds its `linhas` array from the exported `FORMATOS`/`MATERIAIS`/`GENEROS`
constants plus a `coresDisponiveis` prop. Changes to four props —
`formatosDisponiveis`/`materiaisDisponiveis`/`coresDisponiveis`/`generosDisponiveis` — mirroring
`cor`'s existing shape. `FORMATOS`/`MATERIAIS`/`GENEROS` stay exported (still the canonical enum
source for `FiltrosAtivos`'s type and anything that needs the full domain, not just what's
currently reachable), just no longer read directly inside `Filtros`.

### 2.3 `src/components/produto/filtro-drawer.tsx` — live narrowing against `pendentes`

Revised after user feedback: narrowing only on "Ver resultados" (reflecting committed/URL
`ativos`) read as broken — tapping a chip in the open drawer visibly changed nothing else, which
doesn't match "edit several, commit once" so much as "commit once, see nothing until then."
`FiltroDrawer` now recomputes its four option lists **live**, client-side, against `pendentes`
(the staged, not-yet-applied selections) on every tap — same `combina()` the server pages use
against `ativos`, now exported from `filtros.tsx` so both sides narrow identically (§2.1b).

`FiltroDrawer` drops its `FORMATOS`/`MATERIAIS`/`GENEROS` import and its four `*Disponiveis`
props; it instead takes one `facetas: FacetaProduto[]` prop — `{formato, material, cor,
genero}[]`, mapped from `todos` at the call site (`CatalogoPage`/`MostruarioPage`), not the full
`Produto[]` (photos, sku, description, price…) — the client only needs the four filterable
fields, not the rest of the catalogue payload.

### 2.1b `src/components/produto/filtros.tsx` — `combina()` and `FacetaProduto` become exports

`combina()` (§2.1) and a new `FacetaProduto` interface move from a page-local function into
`filtros.tsx`, alongside `FiltrosAtivos`, and are exported. Both server pages
(`CatalogoPage`/`MostruarioPage`) and the client `FiltroDrawer` import the same implementation —
one narrowing rule, not two copies that could drift.

### 2.4 `src/components/produto/filtro-toggle.tsx`

No change — it only renders the applied-filter count badge, doesn't read any option list.

### 2.5 Explicitly out of scope

- **`/revendedores`'s UF→Cidade narrowing.** Already shipped in the in-progress
  `TASK-loja-identidade-e-busca-revendedores.md` — this doc only covers `/catalogo`.
- **Showing disabled/greyed-out chips for zero-match options** instead of omitting them. The
  existing `cor` behavior (and the just-shipped `cidade`/`uf` behavior) already omits rather than
  disables — matching that, not inventing a second unavailable-option treatment.

## 3. Why

Closes a real UX bug (selectable filter combinations that silently return zero results) using the
exact faceted-search technique already applied to `/revendedores` moments earlier in this session
— same session, same root cause, same fix shape, different route.

## 4. Affected files

| File | Change type | Notes |
|---|---|---|
| `src/components/produto/filtros.tsx` | modified | exports `combina()` + `FacetaProduto`; `Filtros` reads four `*Disponiveis` props instead of static enums (§2.1b, §2.2) |
| `src/app/catalogo/page.tsx` | modified | four narrowed `*Disponiveis` lists via shared `combina()`; passes `facetas` to `FiltroDrawer` (§2.1) |
| `src/app/loja/[rev]/mostruario/page.tsx` | modified | same narrowing, same `facetas` prop (§2.1) |
| `src/components/produto/filtro-drawer.tsx` | modified | live client-side narrowing against `pendentes`, one `facetas` prop replaces the four `*Disponiveis` props (§2.3) |

## 5. Verification

- `pnpm lint` and `pnpm build` clean.
- Visual: selecting `Gênero → Feminino` narrows `Formato`/`Material`/`Cor` to only values present
  on feminino products; the active `Feminino` chip itself stays visible/selectable to deselect.
  Clearing filters restores every facet's full option list.
- Mobile: `FiltroDrawer` narrows live as each chip is tapped, before "Ver resultados" — matches
  the sidebar's narrowed lists once applied, and a staged tap that would zero out another facet
  removes that facet's now-unreachable options immediately, not only after commit (§2.3).
- No combination of chips remains selectable that yields a filter with a nonzero product count
  becoming zero after narrowing — i.e., no dead-end combination is presented as available.
