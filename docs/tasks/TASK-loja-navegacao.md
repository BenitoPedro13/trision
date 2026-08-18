# TASK — Storefront navigation (`/loja/[rev]/*`)

## 1. Current scenario

Confirmed by inspection (user question: "why on the loja routes i dont have any navigation
is it right?"): every one of the four storefront routes —
`/loja/[rev]`, `/loja/[rev]/mostruario`, `/loja/[rev]/a-loja`, `/loja/[rev]/oculos/[slug]` —
renders a `<header>` containing only `<RevendedorEndosso revendedor={...}>`, the shop
identity badge. No links. There is no way to move between a shop's own subpages, or back to
the main Trísion site, except: the browser back button, or two conditional inline links that
only exist on the storefront home page itself (`/loja/[rev]`'s "Endereço e horários" and,
only when the shop carries more than its featured items, "Ver tudo que essa loja tem"). A
visitor landing on `/loja/[rev]/a-loja` or a shared product link
(`/loja/[rev]/oculos/[slug]`) has no in-page way back to the shop's own front page.

This predates this session (`TASK-frontend-fase-0.md`,
`TASK-loja-identidade-e-busca-revendedores.md`, `TASK-loja-oculos-slug.md`) — not a
regression, a gap that was never closed. It happened because the storefront deliberately
doesn't reuse `Cabecalho`/`Rodape` (it needs the shop's own identity, not the brand's — the
same reason `(marca)/layout.tsx`, `TASK-footer.md`, explicitly excludes `/loja/*`), but
nobody built the storefront its own nav either. All four pages also duplicate the identical
`Ceu` + `VisorCursor` + `relative z-10` div + bare header shell — the same copy-paste
`Cabecalho` was in before `(marca)/layout.tsx`.

## 2. Planned changes

### 2.1 `src/app/loja/[rev]/layout.tsx` — new

A regular nested layout (not a route group — `[rev]` is already the shared dynamic
segment every storefront page sits under), mirroring what `(marca)/layout.tsx` just did for
the brand site:

```tsx
export default async function LojaRevLayout({ children, params }) {
  const { rev } = await params;
  const escopo = await escopoRevendedor(rev);
  if (!escopo) notFound();
  return (
    <>
      <Ceu />
      <VisorCursor />
      <div className="relative z-10">
        <LojaCabecalho revendedor={escopo.revendedor} />
        {children}
      </div>
    </>
  );
}
```

Each of the four pages keeps its own `escopoRevendedor(rev)` call for its own content (itens,
sku lookup, etc.) and its own `if (!escopo) notFound()` guard — practically unreachable once
the layout has already 404'd a missing reseller, but kept for type narrowing (`escopo` would
otherwise be `Revendedor | null` at the page level with no compiler proof it's non-null).
Accepted minor duplication: `escopoRevendedor` reads from in-memory `content/*.ts` arrays in
Fase 0 (no real I/O), so the second call costs nothing measurable — same tradeoff
`(marca)/layout.tsx` didn't have to make only because `Cabecalho` needs no per-route data.

### 2.2 `src/components/revendedor/loja-cabecalho.tsx` — new

Client component (`usePathname` for active-tab state — the one thing that justifies
`"use client"` here, same reasoning `Cabecalho` already documents for its own drawer state).

- `RevendedorEndosso` (unchanged, still the identity badge).
- Three tabs — **Vitrine** (`/loja/[rev]`), **Mostruário** (`/loja/[rev]/mostruario`),
  **A loja** (`/loja/[rev]/a-loja`) — active tab styled `text-luz`, inactive `text-prata`,
  matching `Cabecalho`'s nav link treatment. `/loja/[rev]/oculos/[slug]` has no tab of its
  own (it's reached from Vitrine/Mostruário, same as `/oculos/[slug]` isn't in `Cabecalho`).
- A small `MarcaSimbolo` (bracket mark only, not the full lockup) linking to `/`, labelled
  via `aria-label` — "the mark stays Trísion's everywhere" (`spec-brand.md` §3) without
  repeating the "Trísion Eyewear" text `RevendedorEndosso` already shows a line above. This
  is the storefront's only way back to the brand site.
- **Off-canvas `Drawer` below `lg`, mirroring `Cabecalho` exactly** — first pass shipped
  without one (reasoning at the time: three short tabs + one icon comfortably `flex-wrap`,
  measured no overflow at 375px). User feedback after seeing it live: "no mobile menu for
  revendedores" — fitting without overflowing wasn't the same as reading as a real mobile
  nav pattern, especially once `Cabecalho` right next to it on the brand site has one. Same
  `Drawer` chrome, same `lg:hidden`/`lg:flex` split, same `useState` justification. The
  drawer's link list adds a fourth row, "Catálogo Trísion," since the mark-icon-only
  back-link (§2.2 above, still used inline at `lg:`) needs a text label inside a list of
  text rows.
- Active tab (`aria-current="page"`, `text-luz` vs `text-prata`) applied in both the inline
  `lg:` nav and the drawer list, via `usePathname`.

### 2.3 Strip the shell from all four storefront pages

`src/app/loja/[rev]/page.tsx`, `mostruario/page.tsx`, `a-loja/page.tsx`,
`oculos/[slug]/page.tsx` — remove `Ceu`, `VisorCursor`, the `relative z-10` div, and the
bare `<header><RevendedorEndosso /></header>` block; each becomes just its own `<main>` (and
`<FiltroDrawer>` sibling, for `mostruario`, same pattern `(marca)/catalogo` already uses).

**Not in scope**: a storefront footer (`Rodape` is brand-specific — its "Navegação" column
links to marca routes, its contact column reads `marca.*`, neither is right for a shop). If
Amanda wants storefront pages to end in something more than the page content, that's a
separate, nameable task, not assumed here.

## 3. Why

A storefront a customer can land on via a shared link but can't navigate out of, short of
the browser back button, is a real usability gap on the one route type whose entire job is
converting an inbound visitor. Building it the same way `(marca)/layout.tsx` was just
built — a nested layout, not four more copy-pasted shells — keeps the fix consistent with
what this session already did for the brand site instead of introducing a second pattern.

## 4. Affected files

| File | Change type | Notes |
|---|---|---|
| `src/app/loja/[rev]/layout.tsx` | new | `Ceu`, `VisorCursor`, `LojaCabecalho`, `{children}` |
| `src/components/revendedor/loja-cabecalho.tsx` | new | identity badge + 3 tabs + back-to-Trísion mark |
| `src/app/loja/[rev]/page.tsx` | edit | shell stripped to `<main>` |
| `src/app/loja/[rev]/mostruario/page.tsx` | edit | shell stripped; `<FiltroDrawer>` stays a sibling of `<main>` |
| `src/app/loja/[rev]/a-loja/page.tsx` | edit | shell stripped |
| `src/app/loja/[rev]/oculos/[slug]/page.tsx` | edit | shell stripped |
| `README.md` | edit | Layout section note |

## 5. Verification

- `pnpm exec tsc --noEmit` and `pnpm lint` pass.
- `pnpm build` succeeds; `pnpm build`'s route table for `/loja/*` is unchanged (same static
  params generated, same URLs).
- Manual: from any of the three example shops' four pages, every tab reaches the others
  without a browser back; the mark icon reaches `/`; the active tab is visually distinct.
- Mobile checked at 375px (iPhone SE-class, the narrowest realistic width) and ~500px —
  three tabs + mark icon fit on one line without overflow or wrap at either. No off-canvas
  drawer needed, per §2.2's reasoning.
- `/loja/nao-existe` still 404s (layout's `notFound()`, not each page's).
- Keyboard pass: tabs and the mark link show `.foco-visor` on Tab.
- **Caveat hit during verification, not a code bug**: running `rm -rf .next && pnpm build`
  while the `pnpm dev` server was still live briefly broke what the dev server was serving
  (user saw a stale page with no nav). Confirmed via direct `curl` against the dev server,
  once it settled, that it was serving the new nav correctly — a hard refresh resolved it on
  the user's end. Worth remembering: don't clear `.next` out from under a running `next dev`
  process; if a build's needed to refresh generated types, prefer running it in a way that
  doesn't delete the dev server's own working directory, or expect to restart `pnpm dev`
  after.
