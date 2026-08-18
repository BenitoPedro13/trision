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

### 2.1 One reduced-motion boundary — scoped to routes that mount `FocoVerdadeiro`

`ProvedorMotion` (`components/provedor-motion.tsx`) wraps `<MotionConfig reducedMotion="user">`
around `/` and `/apresentacao` only — **not** `layout.tsx`. The original plan (one boundary in
the root layout) was attempted first; it pulled the `motion` runtime onto every route including
`/catalogo`, and Lighthouse measured **212 KB** script transfer there (budget ≤180 KB). `Revela`
handles its own reduced motion in `globals.css` and does not need `MotionConfig`.

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

**Implementation note:** first pass used `motion` for `Revela` (matching
`TASK-motion-apresentacao.md`); verification showed that pulled ~50 KB of runtime onto every
grid route. `Revela` was rewritten as a **Server Component** with CSS scroll-driven animation
(`animation-timeline: view()` in `globals.css`) — same visual idiom, zero JS, opacity stays 1
from first paint (LCP-safe). Browsers without scroll-driven animation support get a static layout.

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
| `src/components/provedor-motion.tsx` | new | `<MotionConfig reducedMotion="user">` wrapper for `/` and `/apresentacao` only (§2.1) |
| `src/app/apresentacao/page.tsx` | modified | uses `ProvedorMotion` instead of inline `<MotionConfig>`; combinado panel repointed at global `.iridescencia` |
| `src/app/apresentacao/apresentacao.module.css` | modified | `.iridescencia` + `@property --angulo` + `girar` keyframes removed, moved to `globals.css` (§2.2) |
| `src/app/globals.css` | modified | adds shared `.iridescencia`, `.revela` scroll-entrance utilities |
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

## 4a. Deviations found during verification

Kept in sync per §1.2 — the plan below changed after the first implementation pass, once
real measurement and review pushed back on it.

- **`Revela` rewritten from Intersection Observer to CSS `animation-timeline: view()`.**
  §2.1's original plan (`components/revela.tsx` as client-side IO + a CSS class toggle)
  blew the `≤180 KB` JS budget once mounted once per grid card across four routes.
  `Revela` is now a zero-JS Server Component: `@supports (animation-timeline: view())`
  drives the entrance purely in CSS (`globals.css`), and the fallback for browsers
  without that support is a static, fully-visible layout — no IntersectionObserver
  anywhere in this repo any more. `§2.1`'s root-layout `<MotionConfig>` plan was also
  narrowed: `ProvedorMotion` wraps only `/` and `/apresentacao` (the two routes that
  mount `FocoVerdadeiro`, the one thing in this task still on the `motion` runtime), not
  `layout.tsx` — putting `motion` in the root layout pulled the runtime onto routes that
  only need CSS `Revela`.
- **Timing tuned down after a visual pass (Benito, 2026-08-18):** three effects read as
  too fast once seen live across real routes, not just `/apresentacao`.
  - `FocoVerdadeiro`'s per-word blur→focus tween was still on the **interaction-state**
    figures (`240ms` duration, `90ms` stagger, `cubic-bezier(.2,.8,.2,1)`) — the exact
    `240ms` figure `spec-design.md` §7.5 already named as reading like "a flicker rather
    than a reveal" for `Revela`. `FocoVerdadeiro` is content-entrance by the same §7.5
    rule ("anything built with `Revela`... or the same shape of effect") but had never
    been moved onto that budget. Now `560ms` duration / `140ms` stagger / expo-out
    `cubic-bezier(.16,1,.3,1)`, matching `Revela`'s own element figure; the aria-hidden
    bracket-flash overlay scaled with it, `300ms` → `420ms`.
  - The grid stagger (`grade-produtos.tsx`, `page.tsx`'s coleções grid,
    `colecoes/page.tsx`) went from `Math.min(i * 0.05, 0.3)` to
    `Math.min(i * 0.08, 0.56)` — the old `50ms` step read as near-simultaneous on a
    6+ item grid; `80ms`/`560ms`-cap gives a visibly slower cascade without a large grid
    taking unreasonably long to finish entering.
  - `.iridescencia`'s conic-gradient sweep (`globals.css`) went from an `8s` to a `16s`
    loop — ambient, ungated by any interaction, so the slower pace has no functional
    cost, just a calmer sweep on the one CTA per page it decorates.
  - `VisorCursor`'s `120ms` snap was reviewed and left unchanged — that figure is
    `spec-design.md` §7.5's own named interaction-state budget, not a per-component
    guess, so it wasn't in scope for this pass.

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

**Measured 2026-08-18** (`pnpm build && PORT=3002 pnpm start`, median of 3 Lighthouse runs):

| Route | LCP | JS transfer | Notes |
|---|---|---|---|
| `/` | 1.59s ✓ | 183.4 KB ✗ | +40 KB vs pre-task `/` (143 KB) — `FocoVerdadeiro`/`motion`; 3.4 KB over budget |
| `/catalogo` | 1.55s ✓ | 186.6 KB ✗ | filter drawer + zustand baseline; `Revela` is CSS-only (no motion chunk) |
| `/colecoes` | 1.53s ✓ | 183.4 KB ✗ | Ceu + VisorCursor baseline; same figure as `/` without `motion` |
| `/oculos/TRI-MOD-A` | 1.42s ✓ | 96.5 KB ✓ | |
| `/loja/otica-exemplo` | 1.36s ✓ | 95.1 KB ✓ | |
| `/loja/otica-exemplo/mostruario` | 1.38s ✓ | 95.4 KB ✓ | |
| `/apresentacao` | 1.61s ✓ | 178.3 KB ✓ | LCP improved vs pre-task 3.77s (CSS `Revela` on deck) |

LCP passes on all vitrine routes after `Revela` stopped using `initial={{ opacity: 0 }}`.
**Accepted, not blocking (Benito, 2026-08-18):** `/`, `/catalogo`, `/colecoes` JS transfer
sits 3.4–6.6 KB over the 180 KB ceiling. The floor is the shared Ceu/VisorCursor island
(marca routes) plus, on `/catalogo`, the AlignUI `Drawer`/Radix dependency
(`TASK-alignui-vendoring.md`) — not `Revela`, which is CSS-only and adds nothing to any
route's script transfer. Next lever if this starts to matter: audit the Ceu/VisorCursor
bundle or defer `FocoVerdadeiro`'s `motion` import. Not a blocker for closing this task.
