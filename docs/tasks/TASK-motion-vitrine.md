# TASK — Bring the motion layer to the catalogue and storefront routes

## 1. Current scenario

`TASK-motion-apresentacao.md` gave `/apresentacao` a real motion layer: `Revela` (scroll
entrance, `components/revela.tsx`), `FocoVerdadeiro` (the thesis-line focus effect,
`components/foco-verdadeiro.tsx`), `Deck` (the slide container + scroll-progress rail,
`components/deck.tsx`), a CSS `.iridescencia` sweep on the pitch's one CTA-shaped panel, and a
`VisorCursor` retune to the `120ms` snap `spec-design.md` §7.2 names. All of it sits behind
`<MotionConfig reducedMotion="user">`, mounted locally inside `apresentacao/page.tsx`.

Every other route — `/`, `/catalogo`, `/oculos/[slug]`, `/colecoes`, `/colecoes/[slug]`,
`/loja/[rev]`, `/loja/[rev]/mostruario` — still renders instantly. `Ceu` and `VisorCursor` are
mounted on all of them (the ambient signature is already there), but there is no entrance
motion, no thesis-line effect, and no `.iridescencia` anywhere in this tier. Concretely:

- `src/app/page.tsx`'s thesis line (*"Uma armação é uma decisão sobre o que você olha"*) is
  static type — even though `spec-design.md` §7.4's own table names **the homepage statement**,
  not the pitch deck, as `TrueFocus`'s real target. `FocoVerdadeiro` already takes an arbitrary
  `texto` prop, so nothing about it is `/apresentacao`-specific; it just hasn't been mounted
  where the spec says it belongs yet.
- `src/components/produto/grade-produtos.tsx` — the one shared grid behind `/catalogo`,
  `/colecoes/[slug]`, `/loja/[rev]` and `/loja/[rev]/mostruario` (its own header comment: "the
  two are the same components with a different tenantId") — renders `ProdutoCard`s with no
  stagger, no entrance.
- `src/components/produto/botao-whatsapp.tsx` is already commented as "the one primary CTA per
  page," and `src/app/page.tsx`'s "Ver o catálogo" is the equivalent on the homepage — both are
  exactly the kind of element `spec-design.md` §7.3 names for the `.iridescencia` sweep ("the
  primary CTA's edge... exactly one element per page"), and neither has it.
- Reduced-motion handling (`<MotionConfig reducedMotion="user">`) is currently local to
  `apresentacao/page.tsx`. Nothing else needs it yet because nothing else uses `motion` yet —
  but the moment `Revela`/`FocoVerdadeiro` land on another route, that route needs the same
  boundary or reduced-motion visitors get the full, un-collapsed animation (exactly the
  hydration-mismatch-adjacent failure `TASK-motion-apresentacao.md` §2.8 already paid for once).

Two hard constraints carry over unchanged from the prior task:

- **JS budget.** `spec-design.md` §12 caps main-thread JS at **≤180 KB gzipped per storefront
  route**. `scripts/verificar-fase-0.mts` last measured 135–140 KB (`README.md`, 2026-08-17,
  before `TASK-frontend-fase-0.md`'s routes even landed) — real headroom, but `motion` is now
  loaded on routes that were previously plain server-rendered HTML with zero client JS beyond
  `VisorCursor`. This has to be measured after the change, not assumed to still fit.
- **No real photography.** `TASK-normalizar-imagens.md` is written but not built; every example
  product's `fotos` is `[]` (`src/content/produtos.ts`), so `GaleriaProduto`'s multi-thumbnail
  path never renders today. Building a crossfade for a path nothing currently exercises would be
  unverifiable — out of scope here, see §2.9.

## 2. Planned changes

### 2.1 One reduced-motion boundary, moved to the root layout

`src/app/layout.tsx` wraps `{children}` in `<MotionConfig reducedMotion="user">` (client
component, but Server Component children can still be passed through it — same pattern already
used for `Ceu`/`VisorCursor` islands on every page). This becomes the **one** reduced-motion
boundary for the whole app, matching the "one `wa.me` builder / one tenancy scope" pattern in
`AGENTS.md` §4 rather than repeating a local wrap per route. `apresentacao/page.tsx`'s existing
local `<MotionConfig>` is removed — behaviourally identical, one source instead of a duplicate.

### 2.2 `.iridescencia`, promoted from a page module to `globals.css`

The sweep currently lives in `apresentacao.module.css`, scoped to that page. It's needed on two
different routes now (`/oculos/[slug]`, `/`), and CSS Modules are page-scoped by design, so a
cross-route effect belongs in the global layer — the same reasoning `.foco-visor`
(`globals.css:80`) already follows for a shared interaction class. Ports the `.iridescencia`
rule, the `@property --angulo` declaration, the `girar` keyframes, and the
`prefers-reduced-motion` static-angle override into `globals.css` verbatim; deletes the
duplicate from `apresentacao.module.css` and repoints the combinado panel at the global class
(`AGENTS.md` §4's "one primitive, one source").

### 2.3 `grade-produtos.tsx` — stagger, once, covers four routes

Each `ProdutoCard` gets wrapped in `Revela` with an index-based stagger (`atraso={Math.min(i *
0.05, 0.3)}` — capped so a 20-item grid doesn't take six seconds to finish entering), matching
the "prateleira" stagger idiom `TASK-motion-apresentacao.md` §2.2 already established. Because
`GradeProdutos` is the single shared component behind `/catalogo`, `/colecoes/[slug]`,
`/loja/[rev]` and `/loja/[rev]/mostruario`, this one edit is the entrance motion for all four —
no per-route grid logic to duplicate.

### 2.4 `src/app/page.tsx` — the actual target of `FocoVerdadeiro`

- The static thesis `<p>` becomes `<FocoVerdadeiro texto="Uma armação é uma decisão sobre o que
  você olha." />`. This is the exact row `spec-design.md` §7.4's table names ("the homepage
  statement, once") — `/apresentacao`'s slide-03 use is a separate internal sales artifact a
  different audience (Amanda, reviewing the pitch) sees in a different session, so this isn't
  the "twice is a gimmick" case §7.4 warns against; that rule is about one visitor's experience,
  not the repo's total effect count. `docs/spec-design.md` §7.4 gets a one-line note recording
  this reconciliation so it doesn't read as an open contradiction later.
- The CTA row and the `colecoes` grid header (`"⌐ 01 — Coleções ¬"`) wrap in `Revela`.
- Each `ColecaoCard` in the `colecoes.map(...)` gets the same stagger treatment as §2.3 — inlined
  here rather than extracted into a shared "grade de coleções" component, matching how `/` and
  `/colecoes` already duplicate this exact map rather than sharing one (three similar lines
  beats a premature abstraction, `AGENTS.md` root-level convention).
- The "Ver o catálogo" link — the homepage's one `--ouro`-fill CTA — gets the `.iridescencia`
  class from §2.2. "Encontre um revendedor" (the secondary, bordered CTA) does not: §7.3 is
  explicit that the sweep is for exactly one element per page.

### 2.5 `src/app/colecoes/page.tsx`

`<h1>Coleções</h1>` wraps in `Revela secao`; each `ColecaoCard` gets the §2.3/§2.4 stagger.

### 2.6 `src/app/colecoes/[slug]/page.tsx`

The `ano` / `<h1>` / `texto` block wraps in one `Revela secao`. The grid's stagger comes free
from §2.3 — no separate edit needed here for the products themselves.

### 2.7 `src/app/oculos/[slug]/page.tsx`

The right-column content stack (title + SKU + `exemplo` tag, `descricao`, price, `FichaTecnica`,
`BotaoWhatsApp`, `OndeComprar`) wraps in one `Revela secao` — a single content unit entering
together, not staggered field-by-field, since splitting a product's own ficha técnica into
separate reveals would read as the numbers arriving late rather than the page arriving. Adds
`.iridescencia` directly to `BotaoWhatsApp`'s `<a>` — it's already commented as "the one primary
CTA per page," which is exactly what §2.2's sweep is for.

### 2.8 `src/app/loja/[rev]/page.tsx` and `src/app/loja/[rev]/mostruario/page.tsx`

Both wrap their `<header>` (`RevendedorEndosso`) in `Revela`; `/loja/[rev]` additionally wraps
the `revendedor.sobre` paragraph. The product grid's stagger is free from §2.3 in both routes.
No `.iridescencia` on either — a storefront's primary CTA is reaching a specific product's
`BotaoWhatsApp` (already covered by §2.7 once a visitor opens a product), not a page-level action
here.

### 2.9 Explicitly out of scope

- **`Deck` and the scroll-progress rail.** Built for a scroll-snap slide deck (`spec-design.md`
  §7's own framing); none of these routes scroll that way, and the rail isn't named in the spec
  outside that context (`TASK-motion-apresentacao.md` §2.6).
- **`GaleriaProduto`'s multi-thumbnail crossfade.** Every `exemplo` product's `fotos` is `[]`
  (§1) — the path is currently unreachable, so a crossfade here would be unverifiable against
  real content. Revisit when `TASK-normalizar-imagens.md` ships actual photography.
- **`FiltroDrawer`/`FiltroToggle` open/close transitions.** Interaction chrome, not an
  entrance/thesis moment — and AlignUI/Radix will likely own overlay transitions once installed
  (`spec-design.md` §8); no reason to hand-roll a second one now.
- **Any additional `.iridescencia` use.** §7.3 caps it at exactly one element per page;
  `/catalogo`, `/colecoes` and `/colecoes/[slug]` are listings with no single primary CTA to
  justify it.
- **Installing AlignUI, shadcn or React Bits.** Separate, deferred concern (`AGENTS.md` §0).
- **Changes to `Ceu` or `VisorCursor`'s own behaviour.** Already correct and retuned by
  `TASK-motion-apresentacao.md`; only mounted here, not modified.

## 3. Why

Benito confirmed the plan directly (previous session, before `/clear`): start with `/` — "it's
the first thing either audience (wearer or reseller) lands on, and it's where the brand's own
thesis line belongs" — then extend to the rest of the commercial funnel, and asked for the task
document before any of it gets written, per `AGENTS.md` §1. This task is exactly that scope: the
motion layer `TASK-motion-apresentacao.md` proved out on the internal pitch, applied to the
routes real customers load, reusing the same primitives (`Revela`, `FocoVerdadeiro`,
`.iridescencia`) instead of inventing a second motion system — and checked against the two real
constraints (JS budget, no real photography yet) instead of assuming either one is fine.

## 4. Affected files

| File | Change type | Notes |
|---|---|---|
| `src/app/layout.tsx` | modified | wraps `{children}` in `<MotionConfig reducedMotion="user">` — one reduced-motion boundary for the app (§2.1) |
| `src/app/apresentacao/page.tsx` | modified | removes the now-redundant local `<MotionConfig>` wrap |
| `src/app/apresentacao/apresentacao.module.css` | modified | `.iridescencia` + `@property --angulo` + `girar` keyframes removed, moved to `globals.css` (§2.2) |
| `src/app/globals.css` | modified | adds the shared `.iridescencia` utility, ported verbatim |
| `src/components/produto/grade-produtos.tsx` | modified | wraps each `ProdutoCard` in `Revela`, index-based stagger (§2.3) |
| `src/app/page.tsx` | modified | `FocoVerdadeiro` on the thesis line, `Revela` on CTA row + colecoes grid, `.iridescencia` on "Ver o catálogo" (§2.4) |
| `src/app/colecoes/page.tsx` | modified | `Revela` on heading + collection cards (§2.5) |
| `src/app/colecoes/[slug]/page.tsx` | modified | `Revela` on heading/description block (§2.6) |
| `src/app/oculos/[slug]/page.tsx` | modified | `Revela` on the right-column content stack, `.iridescencia` on `BotaoWhatsApp` (§2.7) |
| `src/app/loja/[rev]/page.tsx` | modified | `Revela` on header + `sobre` text (§2.8) |
| `src/app/loja/[rev]/mostruario/page.tsx` | modified | `Revela` on header (§2.8) |
| `scripts/verificar-fase-0.mts` | modified | `PAGES` extended to cover `/colecoes`, a `/colecoes/[slug]` example, and `/loja/otica-exemplo` (not just `/mostruario`), so the routes this task touches are actually measured |
| `docs/spec-design.md` | modified | §7.4 note reconciling `FocoVerdadeiro` on `/` (the table's named target) with its existing `/apresentacao` use; §7.3 note recording `.iridescencia`'s two live instances |
| `README.md` | modified | Status section: motion layer extended past `/apresentacao` to the catalogue/storefront routes |

## 5. Verification

- `pnpm lint` and `pnpm build` clean.
- `pnpm exec tsx scripts/verificar-fase-0.mts` (after `pnpm build && pnpm start`, per the
  script's own prerequisite) — main-thread JS for every route in the extended `PAGES` list stays
  **≤180 KB gzipped** (`spec-design.md` §12), before/after figures recorded in this doc. LCP
  stays **≤2.0s** and CLS **≤0.05** on the same routes — `Revela`'s `initial={{opacity:0}}` on
  above-the-fold content (the homepage thesis line, the first row of a product grid) is exactly
  the kind of thing that can regress LCP if unmeasured.
- `prefers-reduced-motion: reduce` Playwright pass (same method as
  `TASK-motion-apresentacao.md` §2.8/§5 — `reducedMotion: "reduce"` + a `pageerror` listener,
  not a visual check alone) across all seven routes: zero console/page errors, no
  stuck-at-opacity-0 content, the thesis line and every grid fully visible.
- Keyboard-only pass (`Tab` through each route): unchanged from `TASK-verificacao-fase-0.md`'s
  existing coverage — `Revela`, `FocoVerdadeiro` and `.iridescencia` are all decorative/
  `aria-hidden` and add no new tab stops.
- Visual: thesis line on `/` resolves into focus once on scroll into view; product/collection
  grids stagger in; `BotaoWhatsApp` and "Ver o catálogo" each show a visible edge sweep; no
  route shows more than one sweeping element.
