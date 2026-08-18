# TASK — Photo normalization pipeline (`scripts/normalizar-imagens.ts`)

## 1. Current scenario

`spec-design.md` §10 states the site is 80% photographs and that inconsistent product shots
are "a task of its own," scripted with `sharp`, never normalized by hand — citing F&A
Móveis' `scripts/normalizar-imagens.ts` as the pattern to port. That script exists at
`/Users/benito/Documents/personal/fa-moveis/scripts/normalizar-imagens.ts` and has been read
for this task; per `AGENTS.md` §2.1, the idea is ported, not the furniture-specific
assumptions (its `--papel` background, its D'Doro lifestyle-crop jobs).

No such script exists in this repo. No raw or normalized product photos exist either —
`[VERIFICAR: what Amanda actually has; if it's Instagram crops, that's a photo day, quoted
separately, spec-design.md §10]` is still open. `src/lib/catalog/types.ts`'s `Produto.fotos`
(`string[]`, public asset paths, `[0]` = front shot) and `src/content/produtos.ts`'s example
entries (`TASK-catalogo-fase-0.md`) already assume normalized output will live under
`public/produtos/<sku>/`, but nothing produces it yet.

This is infrastructure, not content — it can and should be built and tested against
placeholder input now, ahead of her photographs, so there's no gap between "Amanda sends
photos" and "photos are on the site correctly formatted."

## 2. Planned changes

### 2.1 `scripts/normalizar-imagens.ts`

Ported from F&A Móveis, adjusted to `spec-design.md` §10:

- **Background swap target is `--lente` (`#E8EBEC`), not F&A's `--papel`.** Studio shots
  (front, three-quarter, temple detail) that arrive on a plain/near-white background get
  composited onto `--lente` — the spec's own words: "backgrounds that arrive as pure white
  get swapped to `--lente` in that script." Ported `removerFundoBranco` unchanged
  (near-white → transparent, threshold-based), only the composite colour changes.
  "On a face" shots are explicitly the one exception (§10: "the only shot allowed on a dark
  ground") — the script skips the background swap for a `job.tipo === "rosto"` entry rather
  than forcing `--lente` on it.
- **Framing target: subject fills ~72% of canvas width** (§10: "frame filling ~72% of
  width"), not F&A's fixed 3%/12% edge-padding percentages. After `trim()`, the output side
  is computed as `max(w, h) / 0.72` rather than F&A's `/ (1 - PADDING_PCT * 2)` — same
  mechanism, different constant, because Trísion's spec states the ratio directly.
  `FRAME_FILL_RATIO = 0.72` is a named constant so it's one edit if the spec number changes.
  No lifestyle "ambiente" crop concept — Trísion has no room-scene photography — so F&A's
  fractional `Crop` type is dropped, not ported.
  Output is a square canvas per shot (`SIZE = 1000`), matching the existing F&A dimensions;
  `spec-design.md` §10 doesn't set a different pixel size, and using the same one keeps the
  budget conversation (below) comparable.
- **`removerFundoBranco` reused verbatim** (RGB threshold → alpha), since it's
  photography-agnostic.
- **Formats: AVIF + WebP**, same as F&A, per §10's explicit "Formats: AVIF + WebP via
  `next/image`." No fixed per-image byte budget is stated anywhere in `spec-design.md` or
  `spec-architecture.md` for Trísion (unlike F&A's script-comment 180 KB target, which is
  that project's own number) — quality settings (`avif quality: 60`, `webp quality: 70`,
  ported from F&A) are a starting point to be checked against the **measured** LCP budget
  (`spec-design.md` §12: LCP ≤ 2.0s, 4G) once real photos exist, not asserted as a byte
  number nobody has verified here.
- **Output path**: `public/produtos/<sku>/<n>.avif` / `.webp`, `n` following the shot order
  in `Produto.fotos` (`0` = front, per `types.ts`'s existing comment).
- **Input path**: `RAW_FRAMES_DIR` env var, defaulting to `raw/produtos/` at the repo root —
  a new gitignored directory (this repo has no monorepo siblings to borrow F&A's
  `../../../scratchpad/frames` default from). `raw/` is where Amanda's supplied photography
  lands before normalization; never committed, same treatment as `references/*.mov`.
- **`jobs: Job[]` ships empty**, commented with an example shape, exactly like F&A's current
  state — no product/photo entry is invented. Someone fills it in once real raw frames exist
  in `raw/produtos/`.

### 2.2 `.gitignore`

Add `/raw/` — raw photography intake, large binaries, never committed. Same rationale as the
existing `references/*.mov` line.

### 2.3 `package.json`

Add a `normalizar-imagens` script entry (`tsx scripts/normalizar-imagens.ts`) and `sharp` +
`tsx` as dependencies — same tools F&A already uses, so no new tool choice is being made
here (`AGENTS.md` §2.0 doesn't apply; this isn't a framework decision).

### 2.4 Explicitly out of scope

- **No real photos, no real `jobs` entries.** This task ships the pipeline, not content.
- **No wiring into `next/image` usage on any page.** `Produto.fotos` already anticipates
  `public/produtos/<sku>/…` paths; consuming them on a real page is the homepage task,
  itself still blocked on Amanda's photographs and data (`TASK-catalogo-fase-0.md` §2.5).
- **No lifestyle/"ambiente" crop feature.** Not part of Trísion's photography standard.
- **No per-image byte budget number.** Not stated in the spec; not invented here.

## 3. Why

`spec-design.md` §10 already names this as a task of its own and names the exact file to
port from. Building it now, against placeholder input, means the day Amanda's photos arrive
there's a known, tested pipeline to run rather than a script written under deadline —
the same reasoning as `TASK-catalogo-fase-0.md` for the catalogue seam: scaffold the parts of
the tech stack that don't require her data before the parts that do.

## 4. Affected files

| File | Change type | Notes |
|---|---|---|
| `scripts/normalizar-imagens.ts` | new | ported from F&A Móveis, `--lente` swap, 72%-width framing, no lifestyle crop |
| `.gitignore` | edit | add `/raw/` |
| `package.json` | edit | `sharp`, `tsx` deps; `normalizar-imagens` script |
| `README.md` | edit | note the script under a "Photography" or "Scripts" heading |

## 5. Verification

- `pnpm exec tsc --noEmit` passes with the new script included.
- Run against a small set of placeholder/synthetic test images (e.g. solid-colour squares
  with a near-white border, generated locally, not committed) placed in `raw/produtos/` to
  confirm: near-white background becomes `--lente` (`#E8EBEC`) exactly, output is a square
  `1000×1000`, both `.avif` and `.webp` are written, and a `tipo: "rosto"` job's background
  is left untouched.
- `pnpm build` and `pnpm lint` still pass (script is excluded from the Next.js route tree by
  virtue of living in `scripts/`, same as F&A).
- Manual check: deleting `public/produtos/<sku>/` and re-running the script reproduces
  byte-identical output for the same input (deterministic pipeline, no timestamp/random
  seed) — same property the OG card's `estrelas()` seeding already relies on elsewhere in
  this repo.
