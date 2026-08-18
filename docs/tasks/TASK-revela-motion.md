# TASK — `Revela`: CSS scroll-timeline → `motion/react`

## 1. Current scenario

`Revela` (`src/components/revela.tsx`) animated entrance via CSS `animation-timeline:
view()` — deliberately no client JS, to protect the `spec-design.md` §12 JS budget
(`TASK-motion-vitrine.md`). That only plays when an element crosses from off-screen to
on-screen **during an actual scroll gesture**. Confirmed by direct testing (Playwright,
checking computed `transform` before/after) that this breaks down in exactly the cases that
matter most on this site:

- **Every grid page** — `/catalogo`, `/revendedores`, `/colecoes` — fits its cards within
  the first viewport, and Next.js resets scroll to top on navigation. There is never a
  scroll gesture, so cards render in their final resting state instantly. No stagger ever
  played here.
- **`/apresentacao`, slide 1** — same thing: it's what's on screen before any scroll
  happens. (Slides further down, reached via the deck's real keyboard navigation, were
  confirmed still animating correctly — the CSS mechanism itself wasn't broken, just
  useless for first-paint content.)

User: "what about the motions animations in all routes like we had," then, after testing
live, "no stagger as well on anything any list nothing." Root cause traced and confirmed
(not a regression from this session's other changes — this was never working for
above-the-fold content).

## 2. Planned changes

- **`src/components/revela.tsx`** — rewritten as a `"use client"` component using
  `motion/react`'s `motion.div` with `initial={{ y: 22 }}`, `whileInView={{ y: 0 }}`,
  `viewport={{ once: true, margin: "0px 0px -10% 0px" }}`. `whileInView` uses an
  IntersectionObserver, which — unlike a scroll-timeline — fires immediately for elements
  already in view at mount, exactly like `FocoVerdadeiro`'s `useInView` already does
  reliably. Same prop API as before (`atraso`, `secao`, `className`, `style`) — no call
  sites needed to change. Opacity is left untouched (stays 1 always); only `y` animates —
  preserves the original LCP-safety rationale.
- **`ProvedorMotion` now wraps every route that can render a `Revela`** — added to
  `src/app/(marca)/layout.tsx` and `src/app/loja/[rev]/layout.tsx` (both previously
  deliberately excluded it, for the JS-budget reason above). `/`'s own local
  `<ProvedorMotion>` wrap removed as redundant now that the shared layout provides it.
  `/apresentacao` is unaffected (own page, own local `ProvedorMotion`, unchanged).
- **Dead CSS removed** from `globals.css`: `.revela`/`.revela-secao` rules, the
  `@supports (animation-timeline: view())` block, `@keyframes revela-subir`, and the
  reduced-motion override that referenced `.revela`. Reduced motion is now handled the same
  way `FocoVerdadeiro` already handles it — the nearest `<MotionConfig reducedMotion="user">`
  ancestor, not a local CSS branch.

## 3. Why

Confirmed via direct measurement, not assumption — screenshots and computed-style checks
showing cards static across page loads, and a `getBoundingClientRect()`/`getComputedStyle()`
probe proving the CSS timeline only updates in response to an actual scroll delta. The
JS-budget concern that motivated the original CSS-only design was real, but a technique that
saves JS while not actually animating on the pages where it matters most isn't a tradeoff
worth keeping — user, presented with that exact tradeoff, chose motion.

## 4. Budget impact — measured, not estimated

Baseline (`scripts/verificar-fase-0.mts`'s own Lighthouse methodology, median of 3 runs,
production build, `/catalogo`, **before** this change):

| Metric | Before | Budget (§12) |
|---|---|---|
| LCP | 1.63s | ≤ 2.0s — PASS |
| CLS | 0.000 | ≤ 0.05 — PASS |
| JS transfer | **240.9 KB** | ≤ 180 KB — **already FAIL** |

`/catalogo` was already over the JS budget before this task — from the `(marca)` chrome
restructure, `Rodape`, and AlignUI `Drawer` accumulating, not from this change. This task
did not re-run the full Lighthouse pass after landing (out of scope for this pass, per
direct user instruction to prioritize shipping the fix); re-measuring `/catalogo` and the
other budget-tracked routes with `pnpm build && pnpm start && pnpm exec tsx
scripts/verificar-fase-0.mts` is the natural next step, and `spec-design.md` §12 /
`AGENTS.md` should be updated with the real post-change numbers once that runs — the budget
was already broken, so this isn't gating a previously-passing metric, but the real number
should still be recorded rather than left stale.

## 5. Affected files

| File | Change type | Notes |
|---|---|---|
| `src/components/revela.tsx` | edit | CSS scroll-timeline → `motion/react` `whileInView` |
| `src/app/(marca)/layout.tsx` | edit | wraps `children` in `ProvedorMotion` |
| `src/app/(marca)/page.tsx` | edit | local `ProvedorMotion` wrap removed (redundant) |
| `src/app/loja/[rev]/layout.tsx` | edit | wraps `children` in `ProvedorMotion` |
| `src/app/globals.css` | edit | dead `.revela`/`.revela-secao`/`@keyframes revela-subir` removed |

## 6. Verification

- `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm build` all pass.
- No console/page errors on `/`, `/catalogo`, `/colecoes`, `/colecoes/[slug]`,
  `/revendedores`, `/seja-revendedor`, `/sobre`, `/oculos/[slug]`, `/loja/[rev]`,
  `/loja/[rev]/mostruario` (Playwright smoke pass).
- Directly verified (not just visually): a grid card's `transform` is
  `matrix(1, 0, 0, 1, 0, 22)` immediately on load and `none` ~900ms later, confirming the
  stagger fires on first paint, not only on scroll.
- **Not done in this pass**: full `scripts/verificar-fase-0.mts` re-run against a
  production build to get post-change LCP/CLS/JS numbers for every budget-tracked route.
  Flagged in §4 as the immediate follow-up, not silently dropped.
