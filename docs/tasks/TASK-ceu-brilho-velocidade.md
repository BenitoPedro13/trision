# TASK — `Ceu` starfield: dimmer, slower, mixed gold

## 1. Current scenario

User feedback, looking at the live site: "the blinking stars bg, are too bright and too
fast" — then, separately: "mix some gold stars too." `src/components/ceu.tsx` draws each
star's opacity as `s.a * (0.42 + 0.58 * Math.sin(t * s.v + s.f))`, with `s.a` random in
`[0.28, 1.0]` and `s.v` (twinkle speed) random in `[0.004, 0.024]`. At the fast end that's
close to a 3 Hz flicker (`t` is a `requestAnimationFrame` timestamp in ms; a full sine cycle
at `v=0.024` completes roughly every 260ms), and effective peak alpha reaches `1.0` — a
fully opaque near-white dot against `--vazio`. `spec-design.md` §7.1 already calls this
layer "Slow drift, near-static; it is a ground, not a screensaver" — the implementation had
drifted from that description, this wasn't a new requirement.

## 2. Planned changes

`src/components/ceu.tsx`, `montar()` and `pintar()`. Went through two passes — the user
caught the first pass overcorrecting before landing:

**Pass 1** (too bright/fast → dim/slow):
- Alpha `s.a`: `[0.28, 1.0]` → `[0.15, 0.55]`; sine floor `0.42` → `0.5`. Peak alpha `1.0`
  → `~0.55`.
- Speed `s.v`: `[0.004, 0.024]` → `[0.0004, 0.0016]`. Full cycle ~0.26–1.6s → ~4–15s.
- Gold mix: `~14%` of stars flagged `ouro: boolean` at creation, rendered
  `rgba(204,168,102,α)` (`--ouro`, `#CCA866`) instead of `rgba(232,235,236,α)`.

**Pass 2**, after "now they seem almost stoped and i cant see very much golden":
- Speed `s.v`: `[0.0004, 0.0016]` → `[0.0016, 0.0042]` — full cycle now ~1.5–4s, splitting
  the difference between the original blink and pass 1's near-stop instead of landing at
  either extreme.
- Gold share: `~14%` → `~25%` of stars.
- **Gold stars get their own alpha floor**, not the same range as white ones:
  `base = s.a * 0.65 + 0.35` before the twinkle multiplier, vs. plain `s.a` for white stars
  — gold at equal alpha reads less luminous than near-white against `--vazio`, so matching
  ranges made gold nearly invisible even at 25% share. Effective gold alpha range is now
  roughly `[0.45, 0.71]` vs. white's `[0.15, 0.55]`.

Both passes keep `--ouro` as the only colour introduced — not a second accent
(`AGENTS.md`'s "no second accent" rule), the one accent applied to more of the existing
ground layer.

No change to star count, radius range, `prefers-reduced-motion` handling (still renders one
static frame, `parado` branch untouched), or the WebGL-failure/legibility guarantees in
`spec-design.md` §7.1 — none of those were the complaint.

## 3. Why

Matches `spec-design.md` §7.1's own description of this layer ("slow drift, near-static...
not a screensaver") more closely than the shipped implementation did — this is a correction
toward the documented spec, not a new design decision. The gold mix was a direct, explicit
user request.

## 4. Affected files

| File | Change type | Notes |
|---|---|---|
| `src/components/ceu.tsx` | edit | alpha range, twinkle speed range, gold star mix |

## 5. Verification

- `pnpm exec tsc --noEmit` and `pnpm lint` pass.
- `pnpm build` succeeds.
- Manual, screenshot after 1s: gold-tinted stars visible mixed among white ones; overall
  field visibly dimmer than before (before/after screenshots).
- `prefers-reduced-motion` path unchanged — still one static paint, no animation loop
  started (code path untouched, not just visually re-checked).
