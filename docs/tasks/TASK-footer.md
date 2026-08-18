# TASK — `Rodape`, the shared brand-site footer

## 1. Current scenario

No marca route has a real footer. `/` is the only one with anything at all: a bare
`<footer>` holding a single link to `/apresentacao` (`src/app/page.tsx`). The other seven
marca routes (`/catalogo`, `/colecoes`, `/colecoes/[slug]`, `/oculos/[slug]`,
`/revendedores`, `/seja-revendedor`, `/sobre`) end with no footer chrome at all — the page
just stops after its content. User feedback, looking at the homepage: "what about our
footer" — flagging that the current one-link version doesn't read as a footer.

`Cabecalho` (`src/components/marca/cabecalho.tsx`) is already the shared header for these
same eight routes (`grep -l Cabecalho src/app/`). This task adds its counterpart.

## 2. Planned changes

### 2.1 `src/components/marca/rodape.tsx` — new

Server component (no interactivity, unlike `Cabecalho`'s drawer — no `"use client"` needed).

First draft was a single row (small lockup + nav + copyright) — rejected on review: "make a
proper footer, professional, not a copy of a header." Rebuilt as three columns plus a
legal bar, which is also what actually gives Amanda's eventual contact details somewhere to
live instead of being invented as a reason to add them later:

- **Column 1 — brand**: small `MarcaLockup` (`simbolo="w-7" texto="text-[1.0625rem]"
  subtexto="text-[.625rem]" gap="gap-3" desde={false}`) linking to `/`, plus a one-line
  tagline reusing existing confirmed brand copy ("Uma linha curada — não o catálogo mais
  largo, a certa," already on `/seja-revendedor`) — not new copy, so nothing invented.
  `desde={false}` because `Desde {marca.desde}` already appears in the legal bar below.
- **Column 2 — navigation**: same five routes as `Cabecalho`'s `LINKS` plus `/sobre`
  (`Cabecalho` deliberately didn't add `/sobre` to its own nav — `TASK-sobre.md` §2.3 left
  that for "a separate, nameable task if wanted." This is that task, but only for the
  footer's fuller link list, the conventional place for a complete sitemap; `Cabecalho`'s
  shortlist is unchanged).
- **Column 3 — contact**: WhatsApp (via `montarLinkWhatsapp` — the one builder, not a second
  one), `marca.email` (new field, §2.1a below), `marca.instagram` — each rendered only if
  present. If none are (true today), the column shows "Consulte o WhatsApp," the same
  fallback microcopy `BotaoWhatsApp` itself uses when disabled — honest-absence, not a dead
  link, not an empty-looking column either.
- **Legal bar**: `© {year} Trísion Eyewear · Desde {marca.desde}` + the studio credit
  (§2.3), separated from the three columns by its own hairline — a second tier, which is
  what makes this read as a real footer rather than one more nav row.
- **No WhatsApp *button* in the footer.** Every page that has one already has its single
  `BotaoWhatsApp` (`spec-design.md` §4.2 rule 3: exactly one `--ouro`-fill button per page).
  The contact column's WhatsApp entry is a plain text link, not a second gold CTA.
- **No `/apresentacao` link.** That page is Amanda's private pitch (`robots.ts` disallows
  crawling it, `README.md` calls it "not public"). `/`'s old one-link footer linked to it;
  folding that into a footer shared across every public marca route would effectively
  advertise a private page site-wide, the opposite of its `noindex`/disallow intent. Dropped.

#### 2.1a `marca.email` — new field on `Marca`

`src/lib/catalog/types.ts`'s `Marca` interface gains `email: string`, same `""` ⇒ not shown
convention as `whatsapp` (`Revendedor.endereco` already uses this exact pattern).
`content/marca.ts` sets it to `""` with a `[VERIFICAR]` comment — not asked in
`spec-brand.md` §6's ten open questions yet, so it's a new gap, not a stale one. Added
because a real footer's contact column needs a place for an email once she gives one; adding
the field now means that's a content update later, not a code change.

### 2.2 `src/app/(marca)/layout.tsx` — new, and a route-group restructure

Originally planned as "add `<Rodape />` to each of the 8 pages that already render
`Cabecalho`," matching how `Cabecalho` itself was wired. Mid-implementation the user asked
directly why the footer wasn't going in a layout instead — the honest answer: no shared
layout existed for these routes because a root `layout.tsx` wraps `/apresentacao` (private
pitch, own chrome) and `/loja/[rev]/*` (storefront chrome) too, and `Cabecalho` had simply
been added per-page up to now, copy-pasted identically into all 8 files.

The actual fix: **`src/app/(marca)/` route group**, wrapping exactly the 8 routes that used
to render `Cabecalho` by hand. Route groups don't add a URL segment (Next.js docs,
`file-conventions/route-groups`), so `(marca)/catalogo/page.tsx` still serves `/catalogo` —
confirmed by `pnpm build`'s route table being byte-identical before and after the move.
`src/app/(marca)/layout.tsx` now owns `Ceu`, `VisorCursor`, the `relative z-10` wrapper,
`Cabecalho`, and `Rodape`; every moved page was stripped down to just its own `<main>`.

**`ProvedorMotion` deliberately stayed out of the layout and stayed local to `/`
(`(marca)/page.tsx`).** It's scoped to only `/` and `/apresentacao` — the two routes
mounting `FocoVerdadeiro` — per that component's own comment: putting `motion` in a shared
layout would pull the runtime onto every catalogue/grid route and blow the `spec-design.md`
§12 JS budget.

**This is not the same thing as the target `(marca)/` in `AGENTS.md`'s "Layout (target)"
section**, which is tied to `middleware.ts` and the real subdomain domain landing (Fase 1).
This route group exists purely to share chrome and has no dependency on either — when Fase
1's migration happens, this is what the group already looks like, one less thing to build
then rather than a conflicting decision now. `AGENTS.md` updated to record this distinction
explicitly so a future session doesn't read the target-layout section and assume `(marca)/`
still needs to be created from scratch.

Files physically moved (git detected as renames for everything already tracked;
`sobre/page.tsx` was untracked from the same-session `TASK-sobre.md` work, so it's a new
file at its new path instead):

| Old path | New path |
|---|---|
| `src/app/page.tsx` | `src/app/(marca)/page.tsx` |
| `src/app/catalogo/page.tsx` | `src/app/(marca)/catalogo/page.tsx` |
| `src/app/colecoes/page.tsx` | `src/app/(marca)/colecoes/page.tsx` |
| `src/app/colecoes/[slug]/page.tsx` | `src/app/(marca)/colecoes/[slug]/page.tsx` |
| `src/app/oculos/[slug]/page.tsx` | `src/app/(marca)/oculos/[slug]/page.tsx` |
| `src/app/revendedores/page.tsx` | `src/app/(marca)/revendedores/page.tsx` |
| `src/app/seja-revendedor/page.tsx` | `src/app/(marca)/seja-revendedor/page.tsx` |
| `src/app/sobre/page.tsx` | `src/app/(marca)/sobre/page.tsx` |

`/`'s old bespoke `<footer>` (mark-free, one link to `/apresentacao`) is gone — replaced by
the shared `Rodape`, not kept alongside it (§2.1 explains why `/apresentacao` isn't linked
from it).

### 2.3 Footer polish found after first render (user screenshot review)

- **Padding was actually `0px` on three sides** — confirmed via computed-style check, not
  just a screenshot impression. `Rodape` is a sibling of `<main>` in the new layout, not
  nested inside it, so it needs its own `px-[clamp(24px,5vw,88px)]` (matching `main`'s) —
  the first draft dropped this by mistake while removing a since-corrected assumption that
  it was still nested. `pb-10` added back too — the copyright line was rendering flush
  against the literal bottom of the browser viewport.
- **"Powered by Blessed Moon Studio" credit** — lives in the legal bar, not the contact
  column (§2.1). Unlike Amanda's business facts this isn't a `[VERIFICAR]` case — the user
  supplied both the studio name and, in a follow-up message, the URL
  (`https://blessed-moon.vercel.app`) and the exact styling directly in chat, so it's a real
  link, not text: `data-alvo` + `.foco-visor` like every other interactive element (so
  `VisorCursor`'s bracket-follow targets it same as a nav link or button), and only "Blessed
  Moon Studio" renders in `--ouro` — "Powered by " stays the legal bar's muted colour (user
  correction after the first pass coloured the whole string gold).

### 2.4 Two more alignment bugs caught in the same mobile review

- **Footer columns all stacked on mobile** (`grid-cols-1 sm:grid-cols-3`) — user: "here we
  can break in 2 columns." Changed to `grid-cols-2 sm:grid-cols-3`, with the brand column
  set `col-span-2 sm:col-span-1` (its paragraph needs the full row; Navegação and Contato
  don't). Mobile: brand full-width, Navegação/Contato side by side. Desktop: unchanged
  3-equal-column layout.
- **`/revendedores` cards were different widths depending on the reseller name's length**
  (user screenshot: bracket frames landing at different x-positions per card). Root cause:
  `RevendedorEndosso`'s `Visor` wrapper is `inline-block` (correct for its other caller,
  `LojaCabecalho`'s flex header, where it must shrink-to-fit) — but inside `/revendedores`'
  grid, `inline-block` shrinks each card to its own text instead of filling the grid cell.
  Fixed by giving `RevendedorEndosso` an optional `className` prop (default `""`,
  appended after the base classes) and having `/revendedores/page.tsx` pass
  `className="w-full"` plus `block` (not `inline-block`) on the wrapping `Link` — scoped to
  that one caller, `LojaCabecalho`'s usage is untouched.

**Out of scope**: `/apresentacao` (private pitch, own chrome) and `/loja/[rev]/*`
(storefront chrome is `RevendedorEndosso`, a separate concern — a storefront footer, if
wanted, is its own task, not a reuse of the brand-site one, per `spec-design.md` §11's "same
components, different data" boundary not extending to different chrome entirely).

## 3. Why

A footer with a single "A apresentação" link doesn't read as a footer — it reads as a
leftover. The other seven marca routes having no footer at all is worse: no path back to
the rest of the site short of the header nav, no copyright, no second mention of `Desde
2002` (the brand's most valuable, cheapest-to-repeat fact per `spec-brand.md` §1.5) at the
point a reader has scrolled furthest into the page. Sharing one `Rodape` component across
every marca route — the same pattern `Cabecalho` already established — keeps it consistent
without hand-writing footer markup eight times.

## 4. Affected files

| File | Change type | Notes |
|---|---|---|
| `src/components/marca/rodape.tsx` | new | shared footer, 3 columns + legal bar |
| `src/app/(marca)/layout.tsx` | new | `Ceu`, `VisorCursor`, `Cabecalho`, `{children}`, `Rodape` |
| `src/app/(marca)/page.tsx` (was `src/app/page.tsx`) | moved + edit | shell stripped to `<main>`; keeps its own `<ProvedorMotion>` |
| `src/app/(marca)/catalogo/page.tsx` | moved + edit | shell stripped; `<FiltroDrawer>` stays a sibling of `<main>` |
| `src/app/(marca)/colecoes/page.tsx` | moved + edit | shell stripped |
| `src/app/(marca)/colecoes/[slug]/page.tsx` | moved + edit | shell stripped |
| `src/app/(marca)/oculos/[slug]/page.tsx` | moved + edit | shell stripped |
| `src/app/(marca)/revendedores/page.tsx` | moved + edit | shell stripped |
| `src/app/(marca)/seja-revendedor/page.tsx` | moved + edit | shell stripped |
| `src/app/(marca)/sobre/page.tsx` (was untracked `src/app/sobre/page.tsx`) | moved + edit | shell stripped |
| `src/lib/catalog/types.ts` | edit | `Marca.email: string`, `[VERIFICAR]` |
| `src/content/marca.ts` | edit | `email: ""` |
| `AGENTS.md` | edit | file layout section, target-vs-actual `(marca)/` distinction |
| `README.md` | edit | Status section |

## 5. Verification

- `pnpm exec tsc --noEmit` and `pnpm lint` pass.
- `pnpm build` succeeds.
- Manual: every one of the eight routes renders the same footer (mark, nav, copyright);
  `/apresentacao` and `/loja/*` are unchanged (no `Rodape`).
- `marca.whatsapp`/`instagram`/`email` all stay `""` today, so the contact column falls
  back to "Consulte o WhatsApp," not a dead link or an empty-looking column (screenshot).
- Keyboard pass: footer nav links, the mark link, and the studio credit link all show
  `.foco-visor` on Tab.
- `pnpm build`'s route table is identical before/after the `(marca)/` move — confirmed
  directly (§2.2).
