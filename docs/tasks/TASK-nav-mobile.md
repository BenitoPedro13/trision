# TASK — Mobile nav for `Cabecalho`

## 1. Current scenario

`src/components/marca/cabecalho.tsx` renders four nav links (Catálogo, Coleções, Revendedores,
Seja revendedor) plus the mark, in one `flex items-center gap-6` row with **no responsive
handling at all** — no wrap control, no breakpoint collapse. `TASK-revendedores-e-seja-
revendedor.md` §2.5 added the last two links "same `data-alvo foco-visor` treatment... no new
nav pattern," which was true for the desktop row but left the mobile gap unaddressed — four items
plus the logo don't fit a phone-width viewport. User-reported, screenshot at a narrow viewport:
"Seja revendedor" wraps to two lines and the row crowds the right edge.

The codebase already has an off-canvas mobile pattern for exactly this shape of problem:
`FiltroToggle` (`components/produto/filtro-toggle.tsx`) + `FiltroDrawer`
(`components/produto/filtro-drawer.tsx`) on `/catalogo`, built on the vendored AlignUI `Drawer`
(`components/ui/drawer.tsx`, Radix Dialog — focus trap + Escape-to-close, dark-theme token bridge
already in `globals.css`, confirmed working). This task reuses that chrome for nav instead of
inventing a second mobile-menu pattern.

## 2. Planned changes

### 2.1 `src/components/marca/cabecalho.tsx` — becomes a client component

Unlike `FiltroToggle`/`FiltroDrawer` (separate components, hence Zustand — no natural common
parent, `AGENTS.md` §0 state-management point 4), the hamburger trigger and its panel both live
inside `Cabecalho` itself. Plain `useState` is correct here (§0 point 5: "when one component owns
a piece of state alone, `useState` is correct") — no new store file.

- `"use client"` at the top. `Cabecalho` is already imported by every marca Server Component page
  (`/`, `/catalogo`, `/colecoes`, `/revendedores`, `/seja-revendedor`) as a leaf; making it a
  client boundary doesn't pull those pages' data-fetching into the client, same reasoning that
  already applies to `FiltroToggle`.
- Desktop row: existing four `Link`s, wrapped `hidden lg:flex` (same breakpoint `Filtros`/
  `FiltroToggle` already split on).
- New hamburger `button` (`RiMenuLine`-equivalent — check what icon `CompactButton`/Remix Icon set
  already ships before adding a new one; `FiltroDrawer` uses `RiCloseLine` from `@remixicon/react`,
  already a dependency), `lg:hidden`, `onClick` sets `aberto(true)`.
- `Drawer.Root open={aberto} onOpenChange={...}` + `Drawer.Content`, `Drawer.Header` with
  `Drawer.Title` "Menu", `Drawer.Body` holding the same four links stacked vertically, each
  closing the drawer on click (`onClick={() => setAberto(false)}` — simpler than `FiltroDrawer`'s
  staged-then-applied pattern, since a nav link is a direct navigation with nothing to stage).

### 2.2 No change to `src/components/ui/drawer.tsx` or the token bridge

Confirmed dark-theme rendering already works (`globals.css` maps `bg-white-0` → `--fumo`,
`stroke-soft-200` → `--aro`, `text-strong-950` → `--luz`; `FiltroDrawer` already ships this to
production on `/catalogo`). Nothing to add.

### 2.3 Explicitly out of scope

- **A second mobile-menu component/pattern.** Reuses `Drawer` as-is — no new off-canvas primitive.
- **Changing `FiltroDrawer`/`FiltroToggle`.** Untouched; this task only touches `Cabecalho`.
- **Storefront (`/loja/[rev]`) nav.** That header is `RevendedorEndosso`, not `Cabecalho`
  (`cabecalho.tsx`'s own comment: storefront pages render their own header) — not in scope.

## 3. Why

Closes a real mobile regression left by the last nav change, using the mobile-drawer idiom this
repo already established and ships in production, rather than a new one-off collapse pattern.

## 4. Affected files

| File | Change type | Notes |
|---|---|---|
| `src/components/marca/cabecalho.tsx` | modified | `"use client"`, hamburger + `Drawer` for `lg:hidden`, existing row becomes `hidden lg:flex` (§2.1) |

## 5. Verification

- `pnpm lint` and `pnpm build` clean.
- Visual at a phone-width viewport (≤430px) on `/`, `/catalogo`, `/colecoes`, `/revendedores`,
  `/seja-revendedor`: no wrapped/cramped nav row, hamburger opens the drawer, all four links
  reachable, tapping one navigates and the drawer isn't left open on the next page.
- Visual at `lg`+ (≥1024px): unchanged from today — horizontal row, no hamburger visible.
- `prefers-reduced-motion: reduce`: drawer still opens/closes (Radix handles this, same as
  `FiltroDrawer` today), no console errors.
- Keyboard pass: hamburger is reachable and operable via `Enter`/`Space`, `Escape` closes the
  drawer, focus returns to the hamburger button on close (Radix default — confirm, don't assume).
- `pnpm exec tsx scripts/verificar-fase-0.mts` — re-run since `Cabecalho` is now a client
  component on every marca route; confirm JS transfer stays within the existing per-route budget
  figures recorded in `TASK-motion-vitrine.md` §5 (Drawer/Radix is already shipped on `/catalogo`
  today, so the marginal cost on other marca routes is the new thing to check).
