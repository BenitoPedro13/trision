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
  - **Center** (`justify-self-center`, `min-w-0`) — `RevendedorEndosso`, unchanged as
    a component (no edits to that file — it's shared with `/revendedores`'s directory
    cards, and its content is already correct, just mispositioned here).
  - **Right** (`justify-self-end`) — unchanged: the `lg+` nav tabs, and below `lg` the
    hamburger button opening the existing `Drawer`.
  - The `Drawer`'s redundant "Catálogo Trísion" text link is **removed** — it existed
    specifically because the mark used to be invisible on mobile; now that the header's
    left slot is visible at every width, the drawer entry pointed at the same
    destination as something already on screen.
- No changes to `RevendedorEndosso`, `MarcaLockup`, `Visor`, or any other shared
  component — this is a layout-only change inside one file's JSX.

## 3. Why

`spec-brand.md` §3 and `AGENTS.md` §0 already say a reseller is an endorsement, not a
sub-brand — the storefront header visually said the opposite by making the reseller's
badge the primary left-anchored element and shrinking Trísion to an icon that vanished
on mobile. Benito flagged this directly looking at a rendered `/loja/[rev]` screenshot
mid-session; this task is that fix, scoped to the one component that owns it.

## 4. Explicitly out of scope

- No change to `RevendedorEndosso`'s own content or the `(marca)/` brand-site
  `Cabecalho` — both are correct as they are.
- No new "reseller mark" field, image, or component — none exists in the data model
  and none is being added here (see §1).

## 5. Affected files

| File | Change type | Notes |
|---|---|---|
| `src/components/revendedor/loja-cabecalho.tsx` | modified | 3-column grid layout, drops the redundant mobile-drawer "Catálogo Trísion" link |

## 6. Verification

- `pnpm build` succeeds, `pnpm lint` clean.
- Visual check in a real browser at desktop (`lg+`) and mobile (375px) widths on
  `/loja/otica-exemplo`: Trísion mark visible top-left at both widths and links to
  `/`; reseller badge visually centered; nav tabs (desktop) / hamburger (mobile) stay
  on the right; the mobile drawer no longer shows a redundant "Catálogo Trísion" row.
- `Visor`'s corner brackets (8px `folga` outside the badge's own box) don't clip
  against the mark or the nav at the narrowest tested width.
