# TASK — One logo treatment: header lockup replaces the duplicate hero mark

## 1. Current scenario

User feedback (screenshot, `/` above the fold): "still feels like 2 logos, its strange."
`Cabecalho` (`src/components/marca/cabecalho.tsx`) rendered `MarcaSimbolo` — the bracket
mark alone, no wordmark — as the persistent nav logo on every marca route. `src/app/page.tsx`
then rendered the full `MarcaLockup` (mark + "Trísion Eyewear" + "Desde 2002") immediately
below it in the hero, with no content between them. On load, the homepage showed two
different renderings of the brand mark stacked within the first viewport: an abstract
bracket icon, then a much larger, differently-composed lockup right after it. A first pass
added top padding to separate them (`pt-[clamp(32px,8vh,112px)]` on the hero section); that
reduced crowding but didn't address the actual complaint, which is duplication, not spacing.

## 2. Planned changes

- **`src/components/marca.tsx`** — parameterize `MarcaLockup`'s icon size, wordmark size,
  sub-label size, and gap (`simbolo`, `texto`, `subtexto`, `gap` props, all with the
  existing hero-scale values as defaults) so the same component can render small in a
  header instead of only at hero scale. `subtexto` is its own `clamp()`, not `em` relative
  to `texto`, for two reasons found during the fix: (1) the original nested `.26em`
  approach rendered under 5px and unreadable once `texto` shrank to header scale (user
  report: "i cant read eyewear"); (2) "Eyewear" moved from *inside* the "Trísion" text node
  to a sibling element (below it, right-aligned — see next point), so `em` would resolve
  against the ambient font-size, not the wordmark, even after fixing point 1.
- **"Eyewear" placement** went through three shapes before landing (user-driven, each a
  real screenshot review): first beside "Trísion" on the same baseline (rejected — read as
  a suffix word, not a sub-label); then the final shape — **stacked below "Trísion",
  right-aligned so it sits under the "n" at the end of the wordmark**, not left-aligned
  under the "T". Implementation: the wordmark + sub-label wrapper is
  `flex flex-col items-end` (not the original `block` span nested in the text node).
- **`src/components/marca/cabecalho.tsx`** — replace the icon-only `MarcaSimbolo` link with
  `<MarcaLockup simbolo="w-7" texto="text-[1.0625rem]" subtexto="text-[.625rem]"
  gap="gap-3" />`, still wrapped in the `Link href="/"`. Drops the `sr-only` "Trísion
  Eyewear" span — the lockup now renders that text visibly, so the hidden duplicate is no
  longer needed.
- **`src/app/page.tsx`** — remove the hero's standalone `<MarcaLockup />` call and its now-
  unused import. The hero opens directly with the thesis headline (`FocoVerdadeiro`). Revisit
  the hero section's top padding (added in the spacing-only first pass) now that the
  duplication it was compensating for is gone.

Result: exactly one visual treatment of the logo (mark + "Trísion Eyewear" + "Desde 2002"),
shown small in the persistent header on every marca route including `/`, never repeated at
hero scale.

### 2.1 Follow-on fixes found during the same review (still `/`, still user-driven)

- **The hero headline wrapped to 3 lines on ordinary laptop widths**, not 2, even after
  widening the paragraph's `max-w`. Measured directly (Playwright, offscreen text-metrics
  probe against the live font/weight/tracking) across viewport widths 1024–2560px: the
  2-vs-3-line crossover tracks font-size as a near-constant ~7.2vw of viewport width,
  independent of the `max-w` constraint — so `max-w` was never the limiting factor, the
  **display type scale itself** was too large for the sentence length at realistic widths.
  Fixed by changing `--t-display` (only usage: `src/app/page.tsx`'s hero `<p>`) from
  `clamp(3rem, 9vw, 8.5rem)` to `clamp(3rem, 6.75vw, 7.5rem)` — picked with a safety margin
  under the measured ~7.2vw threshold, re-verified at 2 lines across 1024–2560px after the
  change. `docs/spec-design.md` §6's `--t-display` row updated to match (§4 below).
- **`FocoVerdadeiro` gained an optional `atrasoInicial` prop** (`src/components/foco-
  verdadeiro.tsx`) while a manual two-line split was being tried as a fix for the above —
  lets a headline split across two `FocoVerdadeiro` calls keep one continuous "bracket
  travels word to word" animation instead of restarting per call. The manual split was
  abandoned (the type-scale fix above solved the line count without it), but the prop is
  harmless, backward-compatible (defaults to `0`), and kept since it's a real capability
  the component didn't have.
- **The hero section didn't fill enough of the viewport** — content sat near the top with a
  large empty gap before the collections section started. Changed
  `src/app/page.tsx`'s hero `<section>` from `flex flex-col gap-10 pt-[...]` to
  `flex min-h-[80vh] flex-col justify-center gap-10` — the headline+CTAs now center within
  ~80% of the viewport height instead of being top-padded.
- **`--color-lente-tinta` was never registered in `globals.css`'s `@theme inline` block** —
  only `--color-lente` (the panel background) was. `text-lente-tinta` is used in several
  places (`GaleriaProduto`'s "sem foto" empty state, `/loja/[rev]/a-loja`, and this task's
  own `/sobre` `[VERIFICAR]` panel) but silently resolved to no CSS rule, so the text fell
  back to the inherited near-white body colour (`--luz`, `#E6EBEC`) on the near-white
  `--lente` panel (`#E8EBEC`) — invisible in practice, confirmed by screenshot ("Sem foto"
  and the `/sobre` panel copy both rendered as blank light-grey boxes). This was a
  pre-existing bug, not introduced by this task, surfaced because `/sobre`'s new panel hit
  the same class. Fixed with one line: `--color-lente-tinta: var(--lente-tinta);` added
  alongside `--color-lente` in `globals.css`.

## 3. Why

Two different renderings of the brand mark in the same viewport read as an inconsistency,
not a deliberate hierarchy — confirmed by the user pushing back a second time after "small
mark = nav, big lockup = hero" was offered as an explanation last session. The fix is
structural (stop rendering the mark twice), not cosmetic (more space between the two
renderings). `spec-brand.md` §5 already prescribes `Desde 2002` "used as a mark, set small,
near the logo" — applying that in the persistent header on every page, not only the
homepage hero, is more consistent with the brand rule than the previous bracket-only icon
was.

## 4. Affected files

| File | Change type | Notes |
|---|---|---|
| `src/components/marca.tsx` | edit | `MarcaLockup` gains `texto`/`subtexto`/`gap` props alongside existing `simbolo`; "Eyewear" moved from nested text to a right-aligned sibling below "Trísion" |
| `src/components/marca/cabecalho.tsx` | edit | header logo is now a small `MarcaLockup`, not `MarcaSimbolo` |
| `src/app/page.tsx` | edit | hero no longer renders its own `MarcaLockup`; `--t-display` narrowed to `clamp(3rem,6.75vw,7.5rem)`; hero `<section>` is `min-h-[80vh]` + `justify-center` |
| `src/components/foco-verdadeiro.tsx` | edit | optional `atrasoInicial` prop, default `0`, backward-compatible |
| `src/app/globals.css` | edit | registers `--color-lente-tinta` in `@theme inline` — bug fix, not scoped to this task's own content |
| `docs/spec-design.md` | edit | `--t-display` row in §6's type scale table updated to match |

## 5. Verification

- `pnpm exec tsc --noEmit` and `pnpm lint` pass.
- `pnpm build` succeeds.
- Manual, via Playwright screenshot at 1560×700 of `/`: exactly one lockup appears above the
  fold, in the header; the hero opens with the thesis headline, not a second mark.
- "Eyewear" sub-label confirmed legible (zoomed 3x screenshot) and right-aligned under the
  wordmark's last letter, at both header scale and hero scale.
- Hero headline measured programmatically at 2 lines across viewport widths 1024, 1152,
  1280, 1366, 1440, 1536, 1728, 1920, 2200, 2560px (Playwright, computed `getBoundingClientRect`
  height ÷ line-height).
- **"Encontre um revendedor" linked to a specific mock storefront (`/loja/otica-exemplo`),
  not the reseller directory (`/revendedores`).** Predates this session
  (`TASK-frontend-fase-0.md`, written before `/revendedores` existed) — user caught it while
  testing. Fixed: the CTA now points at `/revendedores`, matching its own label.
- `GaleriaProduto`'s "Sem foto" state and `/sobre`'s `[VERIFICAR]` panel both confirmed
  legible after the `--color-lente-tinta` fix (before/after screenshots).
- Every other marca route (`/catalogo`, `/colecoes`, `/revendedores`, `/seja-revendedor`,
  `/sobre`) still shows the header lockup and is otherwise unaffected — none of them had a
  duplicate hero lockup to remove.
