# TASK — Invert the storefront header: Trísion left, reseller center, nav right

## 1. Current scenario

`src/components/revendedor/loja-cabecalho.tsx` (`LojaCabecalho`) renders every
`/loja/[rev]/*` page's header as a two-slot flex row: `RevendedorEndosso` (the
reseller's framed identity badge — "TRÍSION EYEWEAR" kicker, "Revenda oficial ·
{nome} · {cidade}, {uf}", optional "exemplo" tag) sits in the primary **left** slot,
and on `lg+` a small `MarcaSimbolo` icon-only mark (no wordmark) sits at the **far
right**, after the nav tabs (Vitrine/Mostruário/A loja). Below `lg`, the mark
disappears entirely from the visible header — it only reappears as a text link
("Catálogo Trísion") inside the mobile `Drawer`.

This is backwards from `spec-brand.md` §3's binding rule: **"a reseller is an
endorsement, not a sub-brand."** The component that currently visually leads the
header is the reseller's, and Trísion's own mark is a small icon-only afterthought
that isn't even shown on mobile. `src/components/marca/cabecalho.tsx` (the brand-site
`Cabecalho`) already establishes the correct precedent for how small Trísion's mark
reads in a header bar: a compact `MarcaLockup` (`simbolo="w-7" texto="text-[1.0625rem]"
subtexto="text-[.625rem]" gap="gap-3"`), always visible, linking to `/`.

There is no such thing as a "reseller mark" in the data model —
`AGENTS.md` §0 is explicit: *"No colour field, no logo field, no font field, ever"*
for a `Revendedor` (`spec-architecture.md` §5.2). What centers in this task is the
reseller's **name/city as text** — the existing `RevendedorEndosso` component,
repositioned, not redesigned.

## 2. Planned changes

- **`src/components/revendedor/loja-cabecalho.tsx`** — replace the current
  `flex justify-between` header with a three-column grid
  (`grid-cols-[1fr_minmax(0,auto)_1fr]`, `minmax(0,auto)` on the center track so the
  reseller badge can shrink and its text wrap at narrow widths instead of forcing
  horizontal overflow):
  - **Left** (`justify-self-start`) — `Link href="/"` wrapping `MarcaLockup` at the
    same compact scale `Cabecalho` already uses (`simbolo="w-7" texto="text-[1.0625rem]"
    subtexto="text-[.625rem]" gap="gap-3"`), with **`desde={false}`** — the "Desde 2002"
    chunk `Cabecalho` shows by default doesn't fit a three-column layout as cleanly as
    it does `Cabecalho`'s two-column one; the storefront doesn't need to repeat it since
    `RevendedorEndosso` already carries "Trísion Eyewear" in its own kicker line.
    Visible at every breakpoint, not just `lg+` — the "always on left" part of the
    fix applies on mobile too, where the mark previously didn't appear in the header
    at all.
  - **Center** (`justify-self-center`, `min-w-0`) — `RevendedorEndosso`.
  - **Right** (`justify-self-end`) — unchanged: the `lg+` nav tabs, and below `lg` the
    hamburger button opening the existing `Drawer`.
  - The `Drawer`'s redundant "Catálogo Trísion" text link is **removed** — it existed
    specifically because the mark used to be invisible on mobile; now that the header's
    left slot is visible at every width, the drawer entry pointed at the same
    destination as something already on screen.

**Revised after first render** (user screenshots mid-session caught two real bugs the
plan above didn't anticipate):

1. **The always-on `Visor` badge was too big.** At mid viewport widths the full
   `RevendedorEndosso` (kicker + address, which itself wraps to two lines + the
   "exemplo" line) reached 4 lines and visually dominated the header, dragging its
   `Visor` corner brackets down toward the logo. Fix: **`src/components/revendedor/
   revendedor-endosso.tsx`** gains a `compacto` prop. When true, it drops the "Trísion
   Eyewear" kicker (redundant now that the header's own mark carries that identity) and
   the permanent `Visor` frame, rendering as a single-line `<Link href="/loja/[rev]/
   a-loja">` instead. Brackets still appear — but only on hover/focus, via the site's
   *existing* mechanism for every other `data-alvo` target: `VisorCursor`
   (`components/visor-cursor.tsx`) snaps its follow-brackets onto any `data-alvo`
   element on mouse hover, and `.foco-visor:focus-visible::after` (`globals.css`) draws
   the identical bracket art on keyboard focus. No new CSS — this is the same
   mechanism every nav link on the site already uses; a permanently framed badge in a
   compact header slot was the wrong read anyway ("a bracket frames something real:
   focus, selection," `AGENTS.md` §0, not a passive label). `LojaCabecalho` now renders
   `<RevendedorEndosso revendedor={revendedor} compacto />`. The un-compacted branch
   (used by `/revendedores`'s directory cards) is untouched.
2. **The Trísion mark itself wrapped and broke** at the same mid-widths, once the badge
   was addressed. Root cause: the grid's two flanking columns are both `1fr`, which
   forces them to *equal* width regardless of how much content each actually needs —
   and `MarcaLockup`'s root div is `flex flex-wrap`, whose min-content to the grid is
   just its largest child (the icon), not its full unwrapped width. The grid happily
   shrank the mark's track down toward the hamburger icon's minimal width below `lg`,
   and the mark wrapped: icon on one line, "Trísion"/"Eyewear" stacked awkwardly below.
   First fix attempt added a `quebra` (wrap) prop to `MarcaLockup` and passed
   `quebra={false}` here — worked, but the next round of feedback (below) replaced the
   full lockup with the icon alone, which can't wrap at all, so `quebra` had no more
   callers and was reverted out of `marca.tsx` rather than left as unused surface.
3. **Full wordmark was still too much below `lg`.** User feedback: below `lg`, show
   only the small bracket mark, not "Trísion/Eyewear" text — matching how the mark
   reads elsewhere at icon scale (favicon, `VisorCursor`'s own idle state). Above `lg`
   there's room for the full identity, so `LojaCabecalho`'s left slot is now both,
   toggled by breakpoint: `<MarcaSimbolo className="h-8 w-8 lg:hidden" />` plus a
   `<div className="hidden lg:block">` wrapping the same compact `MarcaLockup` as
   before, inside one `Link href="/"` + `foco-visor` + `data-alvo` wrapper (`text-foco`
   for full-white icon colour — leading position, not the muted `text-cinza` the old
   far-right icon used). The `quebra` prop from fix #2 turned out not to be dead after
   all — reinstated in `marca.tsx` and passed `quebra={false}` on the `lg+` `MarcaLockup`
   here, since that lockup sits in the same squeeze-prone grid track.

## 3. Why

`spec-brand.md` §3 and `AGENTS.md` §0 already say a reseller is an endorsement, not a
sub-brand — the storefront header visually said the opposite by making the reseller's
badge the primary left-anchored element and shrinking Trísion to an icon that vanished
on mobile. Benito flagged this directly looking at a rendered `/loja/[rev]` screenshot
mid-session; this task is that fix, scoped to the one component that owns it.

## 4. Explicitly out of scope

- No change to `RevendedorEndosso`'s un-compacted branch (`/revendedores`'s directory
  cards) or the `(marca)/` brand-site `Cabecalho` — both are correct as they are.
- No new "reseller mark" field, image, or component — none exists in the data model
  and none is being added here (see §1).

## 5. Affected files

| File | Change type | Notes |
|---|---|---|
| `src/components/revendedor/loja-cabecalho.tsx` | modified | 3-column grid layout, mark icon below `lg` / full lockup at `lg+`, compact centered badge, drops the redundant mobile-drawer "Catálogo Trísion" link |
| `src/components/revendedor/revendedor-endosso.tsx` | modified | new `compacto` prop — single-line `Link`, no permanent `Visor`, brackets only on hover/focus via the site's existing `data-alvo`/`foco-visor` mechanism |
| `src/components/marca.tsx` | modified | `MarcaLockup` gains a `quebra` (wrap) prop, default `true` (no behaviour change anywhere else); `LojaCabecalho`'s `lg+` lockup passes `quebra={false}` |

## 6. Verification

- `pnpm build` succeeds, `pnpm lint` clean, `tsc --noEmit` clean.
- Rendered with Playwright (Chrome extension unavailable this session) at 375, 800,
  1024, 1230 and 1440px on `/loja/otica-exemplo` and its product page: mark icon-only
  and non-wrapping below `lg`, full non-wrapping lockup at `lg+`, both always linking
  to `/`; reseller badge single-line and centered, brackets absent by default; nav
  tabs (desktop) / hamburger (mobile) stay on the right; mobile drawer no longer shows
  the redundant "Catálogo Trísion" row; no console errors.
