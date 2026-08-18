# TASK — Fase 0 verification pass (measured, not asserted)

## 1. Current scenario

The first pass (2026-08-17) measured only `/` and `/apresentacao` from
`TASK-scaffold-e-apresentacao.md`. `TASK-frontend-fase-0.md` has since landed five more
routes (`/catalogo`, `/colecoes`, `/oculos/[slug]`, `/loja/[rev]`, `/loja/[rev]/mostruario`)
and replaced the holding page at `/`. §5 below still records the original two-page numbers;
**this extension re-runs the same budgets against the routes that now matter** — especially
the product page (LCP, `spec-design.md` §12) and the storefront mostruário (JS transfer,
§12 "storefront route"). Manual checks from `TASK-frontend-fase-0.md` §6 (`tsc`/`lint`/`build`
+ curl + keyboard) passed; they are not a substitute for measured LCP/CLS/JS/contrast.

This work needs none of Amanda's input — no photos, no product data, no domain, no pricing
answer. It only touches what's already built and already shipped.

## 2. Planned changes

No product code changes are planned up front — this is a measure-then-fix task. Whatever the
measurements find becomes the fix list; this document gets updated with what was actually
found and changed (`AGENTS.md` §1.2, "keep it in sync").

### 2.1 What gets measured, against which page and which number

| Check | Target | Source | Page(s) |
|---|---|---|---|
| LCP | ≤ 2.0s, 4G, mid-range Android, median of repeated runs | `spec-design.md` §12, NFR-5 | `/`, `/apresentacao`, `/catalogo`, `/oculos/TRI-MOD-A`, `/loja/otica-exemplo/mostruario` |
| CLS | ≤ 0.05 | `spec-design.md` §12 | same |
| Main-thread JS | ≤ 180 KB gzipped (transfer size) | `spec-design.md` §12 | all of the above; **storefront budget** checked on `/loja/otica-exemplo/mostruario` |
| Contrast | every text token ≥ 4.5:1 **as rendered**, not just as computed in the CSS comment | `spec-design.md` §12 | same |
| Keyboard | every interactive element reachable; focus state is the bracket, not a browser outline | `spec-design.md` §3.1, §12 | same + mobile viewport on `/catalogo` (filter drawer toggle) |
| `prefers-reduced-motion` | `Ceu` goes static, `VisorCursor` disabled, page stays complete | `spec-design.md` §7.1, §7.5, `AGENTS.md` §0 | every page that mounts `Ceu` |
| Coarse pointer | `VisorCursor` off | `spec-design.md` §7.2 | every page that mounts `VisorCursor` |
| No-WebGL | page fully legible if canvas never initializes | `AGENTS.md` §0 | unchanged — still N/A |

### 2.2 Tooling — automated with Playwright + axe-core, not manual DevTools

Revised from the original manual-DevTools plan: LCP/CLS/JS weight stay on **Lighthouse**
(CDP-based, no Playwright equivalent for Core Web Vitals), and everything else —
contrast-as-rendered, keyboard/focus, `prefers-reduced-motion`, coarse-pointer — is
scripted with **Playwright + `@axe-core/playwright`** instead of manual DevTools toggling,
so the pass is repeatable and produces the same numbers every run. Added as devDependencies:
`playwright`, `@axe-core/playwright`, `lighthouse`, `tsx`. This is a deliberate exception to
"no new dependency" in the original plan — justified because it replaces a manual,
non-repeatable process with a scripted one, and doubles as groundwork for a future CI task
without expanding scope today.

**`scripts/verificar-fase-0.mts`** — prerequisite: a production server already running
(`pnpm build && pnpm start`; `pnpm dev` is unthrottled/unminified and would produce numbers
nobody could act on). Run with `pnpm exec tsx scripts/verificar-fase-0.mts` (or `pnpm
verificar-fase-0`).

- **Lighthouse**, shelled out via `execFileSync` (no `chrome-launcher` dependency needed —
  the CLI launches its own Chrome), 3 runs per page, median taken for LCP/CLS/JS transfer
  size (summed from `network-requests` audit items where `resourceType === "Script"`).
  **`--throttling-method=devtools`, not Lighthouse's default `simulate`** — measured
  2026-08-17 that `simulate` (a dependency-graph estimate) overstated this page's LCP by
  ~1s versus `devtools` (an actual throttled replay); see §5 for the numbers. `devtools`
  is the number that reflects what a real mid-range-Android/4G user would see.
- **Contrast**: `@axe-core/playwright`'s `AxeBuilder`, `wcag2aa` tag, filtered to
  `color-contrast` violations — reads computed styles on the live DOM, catching anywhere
  the rendered result diverges from the token hex values in `globals.css`'s comments.
- **Keyboard**: `page.keyboard.press("Tab")` in a loop, recording `document.activeElement`
  and whether it carries the `.foco-visor` bracket class.
- **`prefers-reduced-motion`**: `page.emulateMedia({ reducedMotion: "reduce" })`, then
  diffs two `canvas.toDataURL()` snapshots 500ms apart (`Ceu`) and checks `VisorCursor`'s
  div stays `opacity: 0` after a dispatched `mousemove`.
- **Coarse pointer**: `browser.newContext({ hasTouch: true })`, **not** CDP's
  `Emulation.setEmulatedMedia` with `pointer`/`hover` features — verified 2026-08-17 that
  this Chromium version's CDP command silently no-ops for the `pointer`/`hover` interaction
  features (it only affects `prefers-*` features), while `hasTouch` correctly flips
  `(pointer: coarse)` and `(hover: none)`. Recorded here so the next person doesn't lose the
  same hour rediscovering it.
- **No-WebGL**: not implemented. `Ceu` uses a 2D canvas context only — there is no WebGL
  component in this build yet (React Bits is still deferred, `AGENTS.md` §0) — so the check
  has nothing to exercise. Revisit once a WebGL-based component lands.

### 2.3 If something fails budget

Fix it in the smallest change that closes the gap (e.g. `priority` on an LCP image, a missed
`prefers-reduced-motion` branch, a focus style that fell back to the browser default) and
record the before/after number here. If a budget genuinely cannot be met without a larger
change, record that as a follow-up rather than silently shipping past it.

### 2.4 Explicitly out of scope

- **No new pages, no new content.** This task only verifies what's shipped — including the
  routes added by `TASK-frontend-fase-0.md`, not routes still deferred (`/sobre`, `/ir/`, etc.).
- **No CI/GitHub Actions setup.** Out of scope for this task; Vercel's own build already
  gates on type errors and lint on every deploy. Worth a separate, explicitly-named task if
  wanted, not bundled here.
- **AlignUI/shadcn/React Bits** — still deferred (`AGENTS.md` §0), not touched by a
  verification pass.

## 3. Why

Every number in `spec-design.md` §12 and `spec-architecture.md` §13 exists specifically so
no acceptance criterion has to rest on "works" or "looks good" (`AGENTS.md` "How to write in
this repo"). Right now those numbers are asserted in the spec but not measured against the
actual build — the scaffold task doc shipped without the Verification section `AGENTS.md`
§1.1 requires. Closing that gap is real, useful work that doesn't wait on Amanda's domain,
photos, or open questions, unlike almost everything else left in Fase 0.

## 4. Affected files

| File | Change type | Notes |
|---|---|---|
| `docs/tasks/TASK-verificacao-fase-0.md` | new | this document; updated in place with results |
| `scripts/verificar-fase-0.mts` | new | Lighthouse + Playwright/axe automation, §2.2 |
| `package.json` | edit | `playwright`, `@axe-core/playwright`, `lighthouse`, `tsx` devDeps; `verificar-fase-0` script |
| `pnpm-lock.yaml` | edit | lockfile for the above |
| `src/app/apresentacao/page.tsx` | edit | deck `<div>` gets `.foco-visor` + `aria-label` — the keyboard-focus fix, §5 |
| `README.md` | edit | record the measured numbers, note the script |

## 5. Verification — measured 2026-08-17

Local machine, production build (`pnpm build && pnpm start`), Chromium via Playwright/
Lighthouse. Numbers are a snapshot of this build on this machine, not a permanent
guarantee — re-run after any change that could plausibly move them.

| Check | `/` | `/apresentacao` | Budget | Result |
|---|---|---|---|---|
| LCP (Lighthouse, `devtools` throttling, median of 3) | 1.47–1.51s | 1.48s | ≤ 2.0s | **PASS** |
| CLS | 0.001 | 0.001 | ≤ 0.05 | **PASS** |
| JS transfer (Script resources, median of 3) | 140.3 KB | 135.3 KB | ≤ 180 KB gzipped¹ | **PASS** |
| Contrast (axe-core, rendered DOM, WCAG AA) | 0 violations | 0 violations | ≥ 4.5:1 | **PASS** |
| Keyboard reachability + `.foco-visor` bracket | 1 stop (`<a>`), bracketed | 1 stop (the deck), bracketed² | every stop visibly focused | **PASS** |
| `prefers-reduced-motion` — `Ceu` | static | static | must hold still | **PASS** |
| `prefers-reduced-motion` — `VisorCursor` | off | off | must not mount/act | **PASS** |
| Coarse pointer — `VisorCursor` | off | off | fine-pointer only | **PASS** |
| No-WebGL fallback | N/A | N/A | — | not applicable yet, §2.2 |

¹ Lighthouse reports **transfer size** (already gzip/br-compressed over the wire), which is
the same quantity the 180 KB budget describes.
² **Fixed as part of this task** — see below.

### What this pass found and fixed

- **LCP looked like a failure (2.56–2.71s) under Lighthouse's default `simulate`
  throttling, and wasn't** — `devtools` throttling (an actual throttled replay) measured
  1.47–1.51s, comfortably under budget. `simulate` estimates timing from a dependency
  graph and overstated this page's LCP by roughly a second; `network-dependency-tree` and
  `render-blocking-insight` both showed a trivial critical path (~60ms, one small CSS file)
  that couldn't explain a 2.5s+ LCP, which is what prompted checking the other throttling
  method. Recorded in `scripts/verificar-fase-0.mts` so future runs use the accurate one.
- **`/apresentacao`'s scroll deck was a real, invisible keyboard trap.** Chromium
  auto-registers a scrollable overflow region as a native Tab stop (accessibility feature,
  not a bug in Chromium), but `globals.css`'s `:focus-visible { outline: none }` — correct
  everywhere else, since `.foco-visor` supplies the replacement — left this one Tab stop
  with **zero visible focus indicator**, a real WCAG 2.4.7 gap the keyboard pass caught.
  **Fixed:** `src/app/apresentacao/page.tsx`'s deck `<div>` now carries `.foco-visor` (the
  same bracket every other focusable element uses) and an `aria-label`. One-line fix,
  re-measured, now passes.
- **No other budget failed.** Contrast, CLS, JS weight, and all four motion/pointer checks
  passed on the first correctly-measured run.

A row that fails budget is not "done" until either fixed and re-measured (as above) or
explicitly logged as a follow-up with why it wasn't closed here. Nothing needed that
treatment this pass.
