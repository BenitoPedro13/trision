# TASK — Scaffold Next.js + a página de apresentação

> Supersedes the earlier draft of `TASK-apresentacao-amanda.md`, which planned the pitch as a
> standalone HTML file in `docs/apresentacao/`. **Corrected 2026-08-17 by Benito: the pitch is
> the first page of the actual website, built in the scaffold — not a separate deck.**

## 1. Current scenario

`docs/spec-brand.md`, `spec-design.md` and `spec-architecture.md` are written and aligned.
`docs/identidade.html` exists but is an **internal** board — English-ish technical register,
`[VERIFICAR]` markers, file paths, WCAG figures. It is for Benito, not for Amanda.

**There is no application.** The repo holds `CLAUDE.md`, `docs/`, `references/` and a
`.gitignore`. No `package.json`, no framework, nothing deployable.

Amanda has seen nothing. Ten open questions are recorded in `spec-brand.md` §6, and **three of
them block all subsequent code** (the domain, the pricing model, and where the WhatsApp button
points).

**Scope decision, Benito 2026-08-17: Next.js only. Payload comes later.** This matches Fase 0
in `spec-architecture.md` §3, which deliberately has no database — the catalogue lives as typed
TS modules in `content/` behind the same domain types the Payload source will later implement,
so Fase 1 swaps one module instead of rewriting the site.

**Also confirmed:** no per-reseller theming, ever. Already enforced as an absence in
`spec-architecture.md` §5.2; the presentation page sells it to Amanda as brand control rather
than presenting it as a technical limit.

## 2. Planned changes

### 2.1 Scaffold — `pnpm create next-app@latest`

Next **16.3.1** (current stable, verified 2026-08-17). App Router, TypeScript, Tailwind,
`src/`, `@/*` alias, Turbopack. Chosen over any lower version because Payload requires
**≥ 16.2.0** and 15.5–16.1.x is unsupported and will not be (`spec-architecture.md` §4) — the
scaffold should not have to be migrated the week Payload lands.

No Payload, no database, no `@payloadcms/*` dependency in this task.

### 2.2 Design tokens — `src/app/globals.css`

`spec-design.md` §4.1 verbatim as CSS custom properties, mapped into Tailwind v4's CSS-first
`@theme`. Every value is an `ffmpeg` sample from Amanda's material or a computed WCAG figure;
none is re-derived here. `--radius: 0` with the single named exception
(`--radius-lente: 2px`, §3.2).

Dark only. No light-mode toggle, no `prefers-color-scheme` swap — the site has one visual
world (`spec-design.md` §2).

### 2.3 Fonts — `src/app/fonts.ts`

**Archivo** via `next/font/google` (variable, `wght` 400–700 + **`wdth` 62–125** — the width
axis is the whole reason for the choice, `spec-design.md` §6) and **IBM Plex Mono** 400/500 for
the technical layer. Self-hosted by `next/font`, latin subset. No third-party stylesheet
request — it breaks the performance budget in §12.

`spec-design.md` §6 leaves the mono face as `[VERIFICAR]` between Geist Mono and IBM Plex Mono.
**Resolved to IBM Plex Mono for now** on pt-BR diacritic coverage and figure clarity; recorded
in the spec, revisitable.

### 2.4 The signature, as real components — `src/components/`

| Component | What it does |
|---|---|
| `visor.tsx` | The four corner brackets (`spec-design.md` §3.1). Wraps any child. The one ornament in the system. |
| `numeracao.tsx` | `52□18-145` from three numbers in mm, with the `□` drawn as inline SVG because almost no mono ships U+25A1 (§5). |
| `marca.tsx` | The `Tr` bracket mark as SVG + the wordmark lockup. **Approximate redraw**, flagged in-code, pending the original vector (`spec-brand.md` §1.2). |
| `ceu.tsx` | The starfield ground on `<canvas>`, her own ground rebuilt live instead of a 1.5 MB JPEG. Static under `prefers-reduced-motion`; the page is complete if it never initialises. |

These are hand-written on purpose (`AGENTS.md` §2.2) — no generator produces them, and they
are the brand.

### 2.5 The page — `src/app/apresentacao/page.tsx`

16 sections, pt-BR, `scroll-snap-type: y mandatory`, one section per `100dvh`. Structure
follows `../fa-moveis/docs/apresentacao/deck-fatima.html`, which is direct evidence this format
closes: 13 slides, shown next to a live demo, and Fátima signed.

| # | Section | Job |
|---|---|---|
| 01 | Capa — marca, `Desde 2002` | Open on something already hers |
| 02 | O que você já tem | The audit. Prove nothing was invented |
| 03 | Um aro é uma decisão | The thesis in one sentence |
| 04 | A sua cor estava na sua foto | The turquoise, sourced three times from her own portrait |
| 05 | O visor | The signature, shown rather than described |
| 06 | Como fica um óculos | The product plate — **visibly labelled `exemplo`** |
| 07 | Um catálogo, muitas vitrines | The core business slide |
| 08 | Você cadastra uma vez | Her side |
| 09 | O revendedor só liga e desliga | Their side, and what they cannot do |
| 10 | Sua marca não muda de loja pra loja | The no-theming decision, sold as brand control |
| 11 | Termina onde você já vende | WhatsApp, no cart |
| 12 | Você vê de qual loja veio | The attributed message |
| 13 | Por fases | Phasing — **no invented figures**, see §2.7 |
| 14–15 | O que eu preciso saber | The open questions, rewritten for a client |
| 16 | Próximo passo | Close |

**Route is `noindex`** via route-segment metadata — it is a pitch, not a public page. Same
pattern as `blessed-moon`'s hidden `/system`.

### 2.6 `/` — placeholder

A minimal holding page pointing at `/apresentacao`. The real homepage is Fase 0 proper and is
blocked on Amanda's photographs and product data; shipping a fake one now would mean throwing
it away.

### 2.7 Content rules (binding — a client reads this)

- **No invented price.** Benito's figures are not known to this repo. Slide 13 carries the phase
  *structure* with a literal `__PRECO_N__` placeholder and a build-time check that **fails the
  build if any placeholder survives**, so the page cannot be deployed with them showing.
- **No invented fact about her business.** Product names, medidas and cities on 06/07/12 are
  labelled `exemplo` on the slide itself, not merely in a code comment.
- **No claim that the woman in the portrait is Amanda.** Slide 04 says "na foto do seu perfil" —
  verifiable, it is the Trísion Linklist avatar — and asserts nothing beyond that.
- Turquoise never sets text on the light plate (2.32, fails); text on a turquoise fill is
  `--noite` (6.79), never white (2.78).

### 2.8 Alternatives considered and rejected

| Option | Why not |
|---|---|
| Standalone HTML deck in `docs/` (the original plan) | Countermanded. A route in the real app means the pitch is the first thing deployed, Amanda sees the actual stack, and every component built for it (`Visor`, `Numeracao`, `Marca`, `Ceu`) is production code rather than throwaway. |
| Scaffolding Payload now | Explicitly deferred. It needs a database and a paid-ish hosting tier, and Fase 0 is designed to prove the sale before either. |
| Building the real homepage first | Blocked on her photographs, product data, and measurements — all unanswered in `spec-brand.md` §6. |
| Publishing it as an artifact | Benito hosts and deploys it himself. |

## 3. Why

Amanda has seen nothing, and what is being sold is a business model, not a website: "one
catalogue, many storefronts, and every lead still lands with you" does not explain itself.

The second job is extraction. **Three open questions block all further code**, and a
presentation she reads without being asked anything wastes the meeting. Sections 14–15 are the
real deliverable for Benito's next call, with the three blockers visually marked.

Doing it as a route rather than a file is what makes it cheap: the scaffold, the tokens, the
fonts and the four components all carry forward into Fase 0 unchanged. The only throwaway is
the copy on the slides.

## 4. Affected files

| File | Change type | Notes |
|---|---|---|
| `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs` | new | `create-next-app` output, verified not hand-written |
| `src/app/layout.tsx` | edit | `<html lang="pt-BR" class="dark">`, fonts, metadata |
| `src/app/globals.css` | edit | `spec-design.md` §4.1 tokens + `@theme` |
| `src/app/fonts.ts` | new | Archivo (wdth axis) + IBM Plex Mono |
| `src/app/page.tsx` | edit | placeholder pointing at `/apresentacao` |
| `src/app/apresentacao/page.tsx` | new | the 16 sections |
| `src/app/apresentacao/apresentacao.module.css` | new | slide/scroll-snap layout |
| `src/components/visor.tsx` | new | the four brackets |
| `src/components/numeracao.tsx` | new | `52□18-145`, mm in, `□` as SVG |
| `src/components/marca.tsx` | new | mark + wordmark lockup |
| `src/components/ceu.tsx` | new | starfield canvas |
| `src/content/apresentacao.ts` | new | slide copy + the question list as data, not JSX |
| `scripts/checar-placeholders.mjs` | new | fails the build if `__PRECO_` survives |
| `docs/tasks/TASK-apresentacao-amanda.md` | removal | superseded by this document |
| `docs/spec-design.md` | edit | resolve the mono `[VERIFICAR]` to IBM Plex Mono |
| `README.md` | new | setup, scripts, status |
| `.gitignore` | edit | `create-next-app` additions |
