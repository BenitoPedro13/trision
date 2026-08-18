# TASK — Fase 0 verification pass (measured, not asserted)

## 1. Current scenario

`TASK-scaffold-e-apresentacao.md` shipped `/` and `/apresentacao` but its own document has
no §5 Verification section — a gap against `AGENTS.md` §1.1, which requires one on every
task doc. `spec-design.md` §12 and `spec-architecture.md` §13 already state numeric budgets
for exactly this build (LCP, CLS, contrast, motion, keyboard, `prefers-reduced-motion`), but
none of them have been measured against the live pages. The contrast ratios in
`globals.css`'s comments are computed from the token values in isolation, not verified
against the rendered DOM.

This work needs none of Amanda's input — no photos, no product data, no domain, no pricing
answer. It only touches what's already built and already shipped.

## 2. Planned changes

No product code changes are planned up front — this is a measure-then-fix task. Whatever the
measurements find becomes the fix list; this document gets updated with what was actually
found and changed (`AGENTS.md` §1.2, "keep it in sync").

### 2.1 What gets measured, against which page and which number

| Check | Target | Source | Page(s) |
|---|---|---|---|
| LCP | ≤ 2.0s, 4G, mid-range Android, median of repeated runs | `spec-design.md` §12, NFR-5 | `/`, `/apresentacao` |
| CLS | ≤ 0.05 | `spec-design.md` §12 | `/`, `/apresentacao` |
| Main-thread JS | ≤ 180 KB gzipped | `spec-design.md` §12 | `/apresentacao` (the heavier route) |
| Contrast | every text token ≥ 4.5:1 **as rendered**, not just as computed in the CSS comment | `spec-design.md` §12 | both |
| Keyboard | every interactive element reachable; focus state is the bracket, not a browser outline | `spec-design.md` §3.1, §12 | `/apresentacao` (has interactive slides) |
| `prefers-reduced-motion` | `Ceu` goes static, `VisorCursor` disabled, page stays complete | `spec-design.md` §7.1, §7.5, `AGENTS.md` §0 | `/apresentacao` |
| Coarse pointer | `VisorCursor` off | `spec-design.md` §7.2 | `/apresentacao` |
| No-WebGL | page fully legible if canvas never initializes | `AGENTS.md` §0 | `/apresentacao` |

### 2.2 Tooling

- **Lighthouse** (Chrome DevTools or `npx lighthouse`) against `pnpm build && pnpm start`,
  throttled mobile profile, median of 3 runs — for LCP, CLS, JS weight. Not `pnpm dev`,
  which is unthrottled and unminified and would produce numbers nobody could act on.
- **`prefers-reduced-motion` / coarse-pointer / no-WebGL** — manual check via Chrome DevTools
  rendering emulation (no new dependency; these are runtime toggles, not measurable by a
  static tool).
- **Keyboard pass** — manual, tab through `/apresentacao` end to end.
- **Contrast** — re-verified against the actual rendered pixel colours (DevTools' own
  contrast checker on the computed style), not re-derived from the token hex values, since
  the point is to catch anywhere the rendered result diverges from the design intent.

No new dependency is added for anything Lighthouse or Chrome DevTools already covers —
per `AGENTS.md` §2, lean on existing tooling before reaching for a new package.

### 2.3 If something fails budget

Fix it in the smallest change that closes the gap (e.g. `priority` on an LCP image, a missed
`prefers-reduced-motion` branch, a focus style that fell back to the browser default) and
record the before/after number here. If a budget genuinely cannot be met without a larger
change, record that as a follow-up rather than silently shipping past it.

### 2.4 Explicitly out of scope

- **No new pages, no new content.** This task only verifies what's shipped.
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
| *(TBD, pending findings)* | edit | whatever component/route needs a fix to hit budget |
| `docs/spec-design.md` | edit, if needed | only if a measured number contradicts a stated one |
| `README.md` | edit | record the measured numbers once available |

## 5. Verification

This task's own deliverable **is** the verification — the table in §2.1, filled in with
measured numbers instead of targets, replaces this section once the pass is done. A row
that fails budget is not "done" until either fixed and re-measured, or explicitly logged as
a follow-up with why it wasn't closed here.
