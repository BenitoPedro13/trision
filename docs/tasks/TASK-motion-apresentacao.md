# TASK — A real motion layer for `/apresentacao`

## 1. Current scenario

`/apresentacao` (`TASK-scaffold-e-apresentacao.md`, `TASK-frontend-fase-0.md`) renders all 16
slides correctly against the tokens in `spec-design.md` §4, and two hand-written pieces of the
signature already work: `Ceu` (starfield ground, §7.1-equivalent) and `VisorCursor` (brackets
that snap to `data-alvo`, §7.2-equivalent). Both were hand-written rather than pulled from
React Bits, and both already respect `prefers-reduced-motion` and pointer type.

Past that, there is **no motion at all**. `apresentacao.module.css` has zero `@keyframes`,
zero `transition` outside `VisorCursor`'s inline styles, and every slide simply appears —
scroll-snap moves the viewport, nothing animates in. Benito's read, after comparing against
the Awwwards references the spec is built on (`spec-design.md` §1 — Oakley's guides, XOO's
plate contrast): the page reads as a well-typeset document, not yet as the kind of site those
references are. AlignUI is a separate, correctly-deferred concern (`AGENTS.md` §0 stack table)
— it owns semantic form components, not this gap.

`spec-design.md` §7/§8 currently mandate React Bits (`npx shadcn@latest add
@react-bits/<Name>-TS-TW`) as the source for `TrueFocus`, `ScrollFloat`/`ScrollReveal` and
`Iridescence`. That registry's exact contents and current API are unverified — the same
`[VERIFICAR: provider behaviour]` caution `AGENTS.md` §2.2 already applies to any package
whose behaviour we haven't inspected first-hand. `Ceu` and `VisorCursor` already deviated from
that path once (hand-written instead of `Galaxy`/`TargetCursor`), so this task does not
introduce a new pattern, it extends the existing one, and updates the spec to say so instead of
leaving it silently stale (`AGENTS.md` §3.3 — the gold/turquoise reversal is exactly the
"don't let a doc go stale" lesson).

Benito confirmed the page's JS budget has headroom (`scripts/verificar-fase-0.mts` main-thread
JS figures are well under the §12 180 KB gzip ceiling today) and asked explicitly for a
verified, real animation library rather than more hand-rolled `requestAnimationFrame` loops, so
this task adds one dependency: **`motion`** (13.1.0, the current package — `framer-motion` is
now an alias of the same release; verified via `npm view` 2026-08-17, not from training
memory), React 19-compatible.

## 2. Planned changes

### 2.1 Spec update first — `docs/spec-design.md` §7/§8

Before writing components, record the decision the doc doesn't yet have: hand-written/`motion`-
built equivalents are an accepted source for the §7 motion layer, on the same terms as `Ceu`
and `VisorCursor` already are — behaviour must still match the named budget (§7.5: 120/240/480ms,
the two easings, `prefers-reduced-motion` as a complete path) and each piece must still carry
the one-sentence brand justification (§7.4's binding rule). React Bits stays the first thing to
reach for if a future task needs a component whose behaviour is genuinely easier to vendor than
hand-build; it is not mandatory when the team already owns a correct, verified alternative.

### 2.2 `src/components/revela.tsx` — the entrance primitive

A client component wrapping `motion.div`, `whileInView` + `viewport={{ once: true, margin:
"-10% 0px" }}`, animating `opacity` + a small `y` rise (12px), duration mapped to §7.5's
`240ms` (element) / `480ms` (section) tokens, easing `cubic-bezier(.2,.8,.2,1)`. Takes an
optional `atraso` (stagger delay) prop for grid children. Reads `useReducedMotion()` from
`motion/react` and, when true, renders children with no initial/animate transform at all (not
just a fast transition) — matching §7.5's "a complete, elegant, static site."

Applied to: every slide's `Chapeu`/heading pair, the `.quatro` grid cells (staggered), the
`.prateleira` product cards (staggered), `.fases` rows, `.perguntas` blocks, `.passos` rows —
i.e. the repeating content units already identified by their existing CSS classes. The slide
container itself (scroll-snap) is untouched.

### 2.3 `src/components/foco-verdadeiro.tsx` — the thesis, once

Slide 03 ("Um aro é uma decisão sobre o que você olha") is the thesis line named in
`spec-design.md` §3 as *the* sentence that is the brand, the design system and the data model
at once — the single slide `spec-design.md` §7.4 names for a `TrueFocus`-shaped effect ("an
optical focus device with corner brackets, for an eyewear brand whose mark is a corner-bracket
focus device"). Built with `motion`: each word blurred/dimmed by default, a single gold
`Visor`-style bracket travels word to word on a stagger as the slide enters view (`useInView`),
each word sharpening as the bracket passes, settling on the full sentence in focus. Triggers
once, `viewport={{ once: true }}`. Under reduced motion, renders the sentence already in focus,
no blur pass. Used exactly once, per §7.4's own warning ("twice is a gimmick").

### 2.4 Grid guides — built, then reverted

`spec-design.md` §9 describes thin `--aro` verticals "drawn over full-bleed media" (Oakley's
own phrasing). Built as `src/components/guias.tsx`, a fixed three-line overlay. **Reverted
2026-08-18**: Oakley draws its guides over cinematic full-bleed film; this deck is dense text
and card grids on every slide, so the same lines crossing through paragraphs and grid cells
read as a rendering glitch rather than a grid device (Benito: "what are those vertical lines?
look strange"). §9 stays accurate as a description of the *target* screens (`/`, hero crops)
that actually have full-bleed media to draw over — it just doesn't fit this deck. Not
reapplied; file deleted.

### 2.5 Iridescence sweep — the price panel's edge

`spec-design.md` §7.3: used on exactly one element per page. The slide-13 "o combinado" panel
(`<Visor cor="var(--ouro)">` wrapping the price) is the closest thing this pitch has to a
primary CTA — it's the commercial ask. Add a slow (`8s`, looping, `prefers-reduced-motion`:
static) `conic-gradient` sweep along that panel's border, stops sampled from her lens flash
(`#10247C`, already named and retired-as-a-UI-colour in `globals.css`) running to
`--ouro-claro`. Pure CSS `@keyframes`, no `motion` needed — cheaper and it is the one place §4.2
rule 6 permits a second hue, because it is explicitly the AR-coating flash, not a second accent.

### 2.6 A scroll-progress rail — built, then redesigned

Built as `src/components/deck.tsx`, wrapping the deck container and driving a fixed `--ouro`
rail off `useScroll`. First version was a bare 38vh gold line with no visible track — read as
a stray floating mark rather than progress feedback (Benito: "what are those vertical lines?
look strange"). Briefly reverted alongside the grid guides (§2.4), then reinstated on
clarification: the rail itself was wanted, only its execution was the problem ("i actually
liked the progress rail only the glitches no"). Redesigned to draw the full `--aro` track (so
the unfilled length gives the gold fill something to read as progress against) with a small
square tick at each end, echoing `Contador`'s own "position in a sequence" idiom rather than
introducing an unrelated device. Not named in the spec to begin with, so nothing to update
there.

### 2.7 `VisorCursor` retune

Small, while touching this file: bring the snap transition to the exact figure `spec-design.md`
§7.2 names (`120ms`, currently `180ms`/`90ms`) using the same easing token already in use. No
behavioural change, just matching the written budget now that this task is auditing it anyway.

### 2.8 Fixing a hydration mismatch — `<MotionConfig reducedMotion="user">`

`Revela` and `FocoVerdadeiro` originally branched their own JSX on `useReducedMotion()`,
rendering a plain, unanimated tree when true. That hook can only know the answer on the
client — the server always renders the animated branch — so any visitor with reduced motion
on got a React hydration-mismatch error on every load (caught via `pageerror` in a Playwright
console check, not visually obvious). Fixed by removing the branch entirely: both components
always render the same (`motion`-driven) tree, and the whole deck is wrapped in `<MotionConfig
reducedMotion="user">` (`apresentacao/page.tsx`), which is `motion`'s own mechanism for this —
it collapses a transition to its end state instantly rather than skipping it, so server and
client render identical markup and reduced motion is still fully honoured. Also removed the
same-shaped `useReducedMotion()` gate from the progress rail (§2.6) — decorative
scroll-position tracking isn't the kind of motion `prefers-reduced-motion` is asking to
remove, so nothing was lost by dropping the gate there.

### 2.9 Timing pass — the content-entrance budget

First pass used the literal `spec-design.md` §7.5 figures (`240ms`/`480ms`) for `Revela`.
Benito's read after seeing it live: too fast — reads as a flicker, not a reveal, on a slide-
sized block of content. §7.5 now distinguishes interaction-state motion (stays at
120/240/480ms — `VisorCursor`, `:focus-visible`) from content-entrance motion (`560ms`/`760ms`,
`cubic-bezier(.16,1,.3,1)`), and `Revela` was retimed to the latter. `FocoVerdadeiro`'s
per-word pacing was left untouched — direct positive feedback ("i loved this animation on
this title").

### 2.10 A pre-existing color issue, fixed in passing

Not part of this task's original scope, but flagged while reviewing it live: slide 05's
`.quatro` cards (`data-alvo` divs under "A assinatura") carried an inline
`style={{ background: "var(--petroleo)" }}` from the original scaffold
(`TASK-scaffold-e-apresentacao.md`), sitting inside a section already tinted `--petroleo` via
`.petroleo` — the card fill read as a second, distinct blue against its own backdrop rather
than receding into it (Benito: "didn't like this blue on the middle of the cards"). Removed
the inline override; the cards now fall back to `.quatro > div`'s default `var(--noite)`,
matching how every other `.quatro` grid in the deck already renders.

### 2.11 A second bug: `VisorCursor` freezing on animating targets

Flagged live via screenshots (Benito, three separate images across three slides): a detached
bracket pair floating just below a card row, not aligned to anything. Root cause is
`Revela` (§2.2) interacting badly with pre-existing `VisorCursor` (`components/visor-cursor.tsx`,
not otherwise part of this task's scope): `VisorCursor` only re-read its target's
`getBoundingClientRect()` on `mousemove`/`scroll`. If the pointer arrived on a `data-alvo`
card while `Revela` was still sliding it into place (up to 760ms now, previously would have
resolved before a `Revela`-less page finished mounting), the bracket froze at the card's
pre-settle position and never caught up — nothing moved it again until the next mousemove or
scroll. Fixed by re-reading the target's rect every animation frame while a target is set
(a `requestAnimationFrame` loop replacing the old `scroll` listener, which is now redundant —
the per-frame read covers scroll too), so the bracket tracks anything moving the target,
not just the two events that used to be the only triggers.

Benito's ask, twice: the deck needs to *feel* like the Awwwards references it cites, not just
match their tokens on a static page, and the team has budget headroom to spend on a verified
library rather than more from-scratch `requestAnimationFrame` code. `motion` is the
current, verified, React-19-compatible package for exactly this (scroll-linked reveals,
`useInView`, `useScroll`) rather than a speculative React Bits registry install. Everything
above still passes through the same non-negotiables `spec-design.md` §13 already commits to:
brackets frame something real, one accent, reduced-motion is a complete path, nothing invented.

**Explicitly out of scope:** installing AlignUI or shadcn (separate, deferred concern, not a
motion gap); touching any route other than `/apresentacao`; the `Galaxy`/`Particles` or
`TargetCursor` React Bits packages themselves (their hand-written equivalents already exist and
work); sound (Oakley's toggle) — no brand fact justifies it here.

## 4. Affected files

| File | Change type | Notes |
|---|---|---|
| `docs/spec-design.md` | modified | §7/§8: hand-written/`motion`-built is an accepted source; §7.5 splits interaction-state vs. content-entrance budgets |
| `package.json` / `pnpm-lock.yaml` | modified | `+ motion` |
| `src/components/revela.tsx` | new | scroll-triggered entrance primitive, content-entrance budget (§2.9) |
| `src/components/foco-verdadeiro.tsx` | new | the thesis-line effect, slide 03 only |
| `src/components/guias.tsx` | built, then deleted | grid-guide overlay, §9 — reverted (§2.4), didn't fit a text-dense deck |
| `src/components/deck.tsx` | new | deck container + scroll-progress rail, redesigned once (§2.6) |
| `src/app/apresentacao/page.tsx` | modified | wrap repeating content units in `Revela`, mount `Deck` + `MotionConfig`, mount `FocoVerdadeiro` on slide 03, drop slide 05's inline `--petroleo` card override (§2.10) |
| `src/app/apresentacao/apresentacao.module.css` | modified | Iridescence `@keyframes` on the combinado panel |
| `src/components/visor-cursor.tsx` | modified | snap timing `180ms/90ms` → `120ms` (§2.7); `scroll` listener replaced with a per-frame `rAF` loop to fix freezing on `Revela`-animated targets (§2.11) |

## 5. Verification

- `pnpm lint` and `pnpm build` clean.
- `prefers-reduced-motion: reduce`, checked via Playwright (`reducedMotion: "reduce"` +
  `pageerror` listener, not just DevTools) after the first pass shipped a real hydration
  mismatch (§2.8) a visual check alone wouldn't have caught: zero console/page errors, every
  slide's content still appears (no stuck-at-opacity-0 elements), the thesis line still
  resolves to focus, the Iridescence sweep holds a static angle.
- Keyboard-only pass (`Tab` through the deck): unchanged from `TASK-verificacao-fase-0.md`'s
  existing keyboard-focus coverage — the new components are all `aria-hidden` or non-interactive
  and add no new tab stops.
- `scripts/verificar-fase-0.mts` main-thread JS figure for `/apresentacao`, before vs. after —
  recorded in this doc once run, confirming it stays under the §12 180 KB gzip ceiling.
- Visual: each slide's primary content enters on scroll instead of appearing instantly; the
  thesis slide's sentence resolves into focus once; the grid guides are visible on full-bleed
  slides; the combinado panel's edge visibly sweeps.
