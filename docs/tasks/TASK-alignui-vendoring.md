# TASK — Vendor the AlignUI foundation and the first real component (Drawer)

## 1. Current scenario

`AGENTS.md` §0 and `spec-design.md` §8 name AlignUI as the primary component source —
"vendored byte-identical from its docs pages into `components/ui/`, logged in
`components/ui/SOURCES.md` with URL + sha256... Restyle only through the token layer" —
but nothing from AlignUI exists in this repo yet. Every interactive element built so far
is hand-written directly on Tailwind utilities and the tokens in `src/app/globals.css`:

- `src/components/produto/filtros.tsx` — filter chips as plain `Link`s (`?formato=…`).
- `src/components/produto/filtro-toggle.tsx` / `filtro-drawer.tsx` — the mobile filter
  drawer. `FiltroDrawer` is a hand-rolled `fixed inset-0` overlay: a backdrop `<button>`
  closes it on click, but there is **no Escape-key handler and no focus trap** — a
  keyboard user who tabs into the open drawer can tab straight out into whatever sits
  behind it in the DOM. This is a real accessibility gap, not a style gap.
- `src/components/produto/botao-whatsapp.tsx`, `src/components/produto/produto-card.tsx`,
  `src/components/produto/ficha-tecnica.tsx` — all explicitly **hand-written** per
  `spec-design.md` §8's ownership table ("No generator produces these; they are the
  brand"). AlignUI does not own these and this task does not touch them.

Researched against AlignUI's current docs (`alignui.com/docs/v1.2/...`, per `AGENTS.md`
§2.0 — "go to the framework's own current docs first," not memory) and against
`flora/apps/web/components/ui/` (a sibling repo that already vendored AlignUI v1.2 the
way `spec-design.md` §8 describes — "reuse it, do not re-invent it"), two facts change
the plan from "just run the CLI":

1. **`npx @alignui/cli tailwind` is destructive.** It prompts for a primary/neutral
   colour and a colour format, then generates a full CSS-first `@theme` block and
   **overwrites `globals.css`**. `AGENTS.md` §2.0.3 already names this exact failure mode
   for shadcn ("Never let a shadcn theme generator rewrite the file — the Trísion tokens
   ... are sampled, not generated") and it applies just as hard here — running the CLI
   would destroy the sampled `--ouro`/`--noite`/`--luz` tokens `spec-design.md` §4.1
   documents with computed contrast ratios. **This task does not run that command.**
   `flora`'s own `SOURCES.md` confirms the same conclusion by omission: every entry there
   is a docs-page fetch, never a CLI run.
2. **AlignUI's vendored components hard-code `@/utils/cn`, `@/utils/tv`, `@/utils/polymorphic`
   style imports**, and rewriting an import to fit this repo's `@/lib/` convention would
   break "byte-identical" (the same reasoning `flora/apps/web/components/ui/SOURCES.md`
   gives for placing `use-tab-observer.tsx` under a new `hooks/` directory rather than
   folding it into an existing one). So the utils need a new top-level `src/utils/`
   directory — a one-time, deliberate exception to this repo's usual `src/lib/`
   convention, made necessary by vendoring rules this repo already committed to, not a
   drift away from them.
3. **AlignUI's own component classes assume its own theme surface** (`bg-overlay`,
   `bg-white-0`, `stroke-soft-200`, `text-strong-950`, `text-sub-600`, `shadow-regular-md`,
   `rounded-20`) — none of which exist in `globals.css` today. Confirmed by reading
   `flora`'s vendored `components/ui/modal.tsx` (same Radix-Dialog shape AlignUI's Drawer
   uses, per its docs page): `rounded-20 bg-bg-white-0 shadow-regular-md`, a
   `stroke-soft-200` divider, `text-label-sm text-text-strong-950` for the title. Flora's
   own `globals.css` answers this by porting AlignUI's **entire** generated theme
   (~900 lines: a full light/dark colour system, a 15-step neutral scale, `error`/
   `warning`/`success`/`information`/`feature`/`verified` semantic scales, a dozen named
   shadows). That is right for Flora — a light-first product with forms, alerts and a
   dashboard. It is the wrong amount for Trísion: dark-only, radius `0` with one named
   exception, no second accent, no form/alert surfaces built yet, and a `≤180 KB`
   gzipped JS budget already carrying the motion layer (`TASK-motion-vitrine.md`,
   verification in progress). Porting the full scale would also silently reintroduce
   rounded corners (`rounded-20`) and a shadow system this brand doesn't use anywhere
   today (`spec-design.md` §9: the page reads as composed through hairlines, not
   elevation). **This task defines only the token names the one component it vendors
   actually references** — see §2.3 — not AlignUI's full theme.

## 2. Planned changes

### 2.1 The foundation utils — `src/utils/`

Fetch, byte-identical, from AlignUI's own docs pages (`alignui.com/docs/v1.2/utils/...`,
same method `flora/apps/web/components/ui/SOURCES.md` documents: view-source or decode
the docs site's RSC flight payload, cut at the component's own `export`, verify with
`sha256sum`):

- `src/utils/cn.ts`
- `src/utils/tv.ts`
- `src/utils/polymorphic.ts`
- `src/utils/recursive-clone-children.tsx`

These are pure functions/types with no CSS or colour dependency — no token conflict, no
risk to `globals.css`. Every future AlignUI component vendored into this repo (this task
or later ones) imports these same four files, so this is a one-time cost regardless of
how many components eventually land.

### 2.2 The first component — `Drawer`, replacing `FiltroDrawer`'s hand-rolled overlay

AlignUI's `Drawer` (`alignui.com/docs/v1.2/ui/drawer`) wraps `@radix-ui/react-dialog`,
which gives focus trap and Escape-to-close natively — exactly the gap in
`filtro-drawer.tsx` §1 names. This is the concrete, present need that justifies
installing AlignUI now rather than only after `/seja-revendedor` or another form exists.

- Fetch `drawer.tsx` byte-identical into `src/components/ui/drawer.tsx`, sha256 logged in
  a new `src/components/ui/SOURCES.md` (§2.4). Confirm during extraction whether it
  depends on `compact-button.tsx` for its close affordance, the way `modal.tsx` does in
  `flora`'s vendored copy (`CompactButton.Root`/`CompactButton.Icon` for the `×`) — if
  so, `compact-button.tsx` is vendored alongside it, same as `flora` vendored
  `avatar-empty-icons.tsx` as a same-page dependency of `avatar.tsx`.
- New dependencies: `@radix-ui/react-dialog`, `@remixicon/react` (Drawer's own close icon,
  `RiCloseLine` — confirmed on its docs page). This is the first icon in the codebase;
  every other visual mark here is hand-drawn SVG (`Visor`, `marca-paths.ts`). Accepting
  one small, tree-shaken icon import for one vendored component's close button is judged
  worth it over hand-editing the vendored source to remove it (breaks byte-identical for
  no real gain — `@remixicon/react` ships as ESM, and only the one imported icon reaches
  the client bundle).
- `src/components/produto/filtro-drawer.tsx` is rewritten on top of `Drawer.Root` /
  `Drawer.Content` / `Drawer.Header` / `Drawer.Body` / `Drawer.Footer`, `open` driven by
  `useFiltroStore`'s existing `aberto` state and `onOpenChange` wired to `fechar()` — the
  store itself (`filtro-store.ts`) does not change; only what renders when `aberto` is
  true changes. The filter chip markup inside (the `formato`/`material`/`cor`/`genero`
  toggle buttons) is untouched — those are the brand's own bracket-style selection state
  (`border-ouro text-ouro` when selected), not something AlignUI owns per
  `spec-design.md` §8's table.
- `src/components/produto/filtro-toggle.tsx` — unchanged. It only calls `abrir()`; it
  never rendered the overlay itself.

### 2.3 The token bridge — additive to `globals.css`, not a replacement

Only the token names `drawer.tsx` (and its `compact-button.tsx` dependency, if vendored)
actually resolve, mapped once to existing or new-but-minimal Trísion values — not
AlignUI's full scale:

| AlignUI token | Trísion value | Reasoning |
|---|---|---|
| `--color-overlay` | same as the existing hand-rolled backdrop, `color-mix(in srgb, var(--vazio) 80%, transparent)` | Matches `filtro-drawer.tsx`'s current `bg-vazio/80` exactly — no new backdrop treatment introduced. No blur: nothing else on this site blurs. |
| `--color-bg-white-0` | `var(--fumo)` (elevated surface) | Despite the name, this is AlignUI's "panel surface" slot, not literally white — Trísion is dark-only, so it resolves once, not per light/dark branch. |
| `--color-stroke-soft-200` | `var(--aro)` | Same hairline already used everywhere (`FichaTecnica`'s `divide-aro`, `border-aro`). |
| `--color-text-strong-950` | `var(--luz)` | **Not** `--foco` — rule 3 (§4.2) reserves `--foco`/`#FFFFFF` for the in-focus element only; a drawer title is not that. |
| `--color-text-sub-600` | `var(--prata)` | Secondary text tier, matches existing usage (e.g. `Numeracao`'s muted figures). |
| `--shadow-regular-md` | `none` | This brand gets depth from hairlines (`spec-design.md` §9: "the guides are visible... cost nothing"), never elevation shadow — nothing today defines a `--shadow-*` token, and this task doesn't start. |
| `--radius-20`, `--radius-10` (whichever the vendored source actually uses) | `0` | Rule 5 (§13.5): sharp corners, radius `0`, one named exception (`--radius-lente`, unrelated). Defining these as `0` in the token layer means every future AlignUI component's `rounded-*` classes resolve sharp automatically, site-wide — no per-component override needed later. |

`tw-animate-css` (the current, Tailwind-v4-native successor to the deprecated
`tailwindcss-animate`, confirmed via current docs per `AGENTS.md` §2.0 — not assumed from
memory) is added and imported in `globals.css` so `drawer.tsx`'s own
`data-[state=open]:animate-in …` classes actually resolve to real CSS instead of silently
no-op-ing (confirmed that's what happens today in `flora` — no animate plugin is
installed there either, so its vendored `Modal` opens/closes instantly). This was
explicitly left open by `TASK-motion-vitrine.md` §2.9 ("AlignUI/Radix will likely own
overlay transitions once installed") — this is that moment, and the fix is the
plugin Radix-based vendored components are built for, not a hand-rolled `motion` wrapper
around Radix internals.

### 2.4 `src/components/ui/SOURCES.md`

New file, same format as `flora/apps/web/components/ui/SOURCES.md`: one row per vendored
file, URL fetched, sha256, fetch date, AlignUI docs version (`v1.2`, matching what
`flora` vendored — confirm this is still current when fetching, per `AGENTS.md` §2.0.4).
Starts with `drawer.tsx` (+ `compact-button.tsx` if it turns out to be a dependency) and
the four `src/utils/*` files.

### 2.5 Explicitly out of scope

- **Running `npx @alignui/cli tailwind`** — §1 explains why; this task hand-vendors
  instead.
- **Every other component in `spec-design.md` §8's AlignUI row** (`Button`, `Input`,
  `Label`, `Hint`, `Select`, `Modal`, `Badge`, `Divider`, `Tooltip`, `Dropdown`,
  `FileUpload`, `Avatar`, `Kbd`, `Table`). None has a concrete call site today — there is
  still no form anywhere in this app (`/seja-revendedor` isn't built) and no data table.
  Vendoring them speculatively repeats the exact mistake `AGENTS.md`'s state-management
  section already ruled out for TanStack Query ("install it when a real feature needs
  it, not speculatively"). Each lands in its own task, against its own real need, the
  same way `flora/apps/web/components/ui/SOURCES.md` grew — one task at a time, not one
  sweep.
- **Replacing `filtros.tsx`'s chip links, `BotaoWhatsApp`, `ProdutoCard`, or
  `FichaTecnica`.** All either explicitly hand-written per `spec-design.md` §8's table, or
  (filter chips) not named as an AlignUI-owned primitive and already correct against
  every brand rule (sharp corners, gold-only selected state, `foco-visor` focus ring).
  Nothing here is broken; AlignUI's job is stated as "everything with state and
  semantics" that doesn't have a hand-written brand reason to exist, and these do.
- **Full theme parity with `flora`'s ~900-line token block.** §1.3 explains why: wrong
  amount for a dark-only, no-shadow, `radius: 0` brand.
- **shadcn/ui.** `spec-design.md` §8 lists it as a gap-filler once AlignUI is in place and
  a real gap shows up (`sheet`, `accordion`, a leads-dashboard `chart`). No such gap
  exists yet.

## 3. Why

Benito asked to move on "AlignUI" next (previous message in this session). The honest
scope of that request today is narrower than "install the library": nothing in this
Fase-0 app has a form, a table, or any of the other AlignUI-owned surfaces yet, and the
one real, present gap — `FiltroDrawer`'s missing focus trap / Escape handling — is
exactly what AlignUI's `Drawer` (a thin, accessible wrapper over Radix Dialog) is for.
Vendoring the foundation now means every later AlignUI component is a small, incremental
add (utils already present, `SOURCES.md` pattern already established), rather than
front-loading fourteen components with zero call sites against a `≤180 KB` JS budget this
repo is already measuring carefully (`TASK-motion-vitrine.md`, in progress). This mirrors
`AGENTS.md`'s own precedent for TanStack Query: install real capability against real
need, not the whole surface speculatively.

## 4. Affected files

| File | Change type | Notes |
|---|---|---|
| `src/utils/cn.ts` | new | AlignUI utility, vendored byte-identical (§2.1) |
| `src/utils/tv.ts` | new | AlignUI utility, vendored byte-identical (§2.1) |
| `src/utils/polymorphic.ts` | new | AlignUI utility, vendored byte-identical (§2.1) |
| `src/utils/recursive-clone-children.tsx` | new | AlignUI utility, vendored byte-identical (§2.1) |
| `src/components/ui/drawer.tsx` | new | vendored byte-identical from `alignui.com/docs/v1.2/ui/drawer` (§2.2) |
| `src/components/ui/compact-button.tsx` | new, conditional | only if `drawer.tsx` depends on it, confirmed during extraction (§2.2) |
| `src/components/ui/SOURCES.md` | new | vendoring log, URL + sha256 per file (§2.4) |
| `src/components/produto/filtro-drawer.tsx` | modified | rebuilt on `Drawer.*`, real focus trap + Escape-to-close (§2.2) |
| `src/app/globals.css` | modified | adds `@import "tw-animate-css"` + the token bridge in §2.3, nothing removed or overwritten |
| `package.json` | modified | adds `@radix-ui/react-dialog`, `@remixicon/react`, `tw-animate-css` |
| `README.md` | modified | Status section: AlignUI foundation + `Drawer` vendored, notes what's still hand-written |
| `docs/spec-design.md` | modified | §8 gets a one-line note recording that `Drawer` is the first vendored component and the token-bridge scope decision (§1.3/§2.3 of this doc) |

## 5. Verification

- `pnpm lint` and `pnpm build` clean.
- Re-fetch each URL in `src/components/ui/SOURCES.md` and diff against the working tree —
  zero differences (the same check `flora`'s `SOURCES.md` names as the standing
  invariant).
- Keyboard pass on `/catalogo` (or any route rendering `Filtros`) at a mobile viewport:
  open the filter drawer via `FiltroToggle`, confirm `Tab` cannot escape the drawer while
  open, confirm `Escape` closes it and returns focus to the toggle button — the two
  concrete behaviours §1/§2.2 justify this task on.
- `prefers-reduced-motion: reduce` pass on the same flow: drawer still opens/closes
  (state-driven, not purely animation-driven) and produces no console/page errors.
- Visual: drawer panel uses `--fumo` background, `--aro` hairline divider, sharp corners
  (no visible rounding), filter chips inside render exactly as before this task (nothing
  in §2.2 touches their markup).
- `pnpm exec tsx scripts/verificar-fase-0.mts` (after `pnpm build && pnpm start`) — main
  thread JS for every measured route stays **≤180 KB gzipped** (`spec-design.md` §12)
  with `@radix-ui/react-dialog` + `@remixicon/react` added; before/after figures recorded
  in this doc once measured.
