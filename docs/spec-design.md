# Trísion Eyewear — Design Spec

> Companion to `spec-brand.md` (who Trísion is) and `spec-architecture.md` (how the platform
> works). Every colour value here was **measured**, not chosen by eye: brand values are
> `ffmpeg` samples from Amanda's own material, and every contrast ratio is a computed WCAG
> figure, recorded to two decimals. If you change a token, recompute the table.

---

## 1. What this is designed against

Read `references/`. The videos are frame-extracted to `references/frames/<name>/` with
`ffmpeg -vf fps=1/2`.

| Reference | What it is for | What we take |
|---|---|---|
| `frames/x8.adencys/` (XOO Eyewear) | **Closest sibling.** Black chrome, monogram, full-bleed product film, huge grotesque statements, product tiles on a light plate inside a black frame | the black-chrome + light-plate contrast; the confidence to leave a viewport nearly empty |
| `frames/web-eyewear/` (WEB / Marcolin) | **The catalogue mechanics reference.** Hairline-divided grid, SKU + price under each frame, a `Details & Fit` / `Tech Spec` table (Fit / Form / Material / Color), Store Finder, Wholesale Enquiries | the tech-spec table, the SKU-as-name discipline, the store-finder pattern we need for resellers |
| `frames/oakley/` | Cinematic scale, thin vertical grid guides drawn over full-bleed film, `Scroll down to navigate`, a sound toggle | the guides; the nerve to make a hero an *experience* and still keep a Shop button top-right |
| `frames/ditto/` + `ditto image.jpg` | Wireframe face-mesh over a portrait, dark, technical | the idea that measurement can be shown as an overlay on a face |
| `awwwards-pq-by-Ron-Arad-1.jpg` | Hairline modular grid, light ground, big geometric sans | grid rigour |
| `image-2.png` (BLIZ) | Giant type *behind* the product, dark | scale of type against product |
| `casa-lunara.png`, `image.png` (Gold Square) | Editorial eyewear, serif, warm / B&W | **calibration only** — see §2 |
| `frames/eyewearjunkie/` | **Negative reference.** Bright primaries, cartoon mark, tilted cards, cookie banner over everything | what "consolidated since 2002" must not look like |

---

## 2. Calibration — what this deliberately is not

The default answer to "dark, elegant eyewear site" is: near-black ground, thin white
Didone or a wide luxury serif, a gold accent, a full-bleed model shot. `casa-lunara.png` is
exactly that, executed well. Drifting there would be a template answer, not a decision.

What survives the critique, and why:

- **The dark ground stays** — because it is *hers*. Three independent uses of the starfield
  (`spec-brand.md` §1.3), consistently, for years. This is derivation, not the category
  default that happens to coincide with it.
- **The serif is rejected.** Trísion's wordmark is a squared geometric sans in the Eurostile
  lineage. A luxury serif would contradict the one piece of type the brand actually owns.
- **The accent is gold, because it is hers.** This section previously rejected gold as the
  most crowded position in eyewear and proposed a turquoise sampled from Amanda's portrait.
  **That was wrong and is reversed** (`spec-brand.md` §1.5b): she states the brand colour is
  gold with black, and an owner's statement outranks our inference. The gold is `#CCA866`,
  **sampled from her own lockup**, not picked from the stock-gold shelf — which is the part
  of the original objection that survives.
- **Her gold has only ever failed on white.** She moved to black-and-white on Instagram
  "porque facilita a leitura", and the measurement explains why: `#CCA866` is **2.24 on
  white — a fail** — and **8.42 on `--noite` — a comfortable AA**. The ground this site
  already had is the only one her real brand colour has ever worked on.
- **`#000000` and `#FFFFFF` are both rejected as surfaces.** Her ground samples at `#0F1012`
  and `#0D1111`; her portrait's ground is petrol-tinted. The palette in §4 descends from
  that, so every surface on the site is the turquoise driven to its dark extreme, and the
  whole thing resolves to one hue.
- **`#FFFFFF` survives with one job only** — see §4.2. It is not a text colour. It is the
  colour of the thing in focus.

**The risk taken:** committing the site to a mark-derived interaction (§3) as its entire
ornamental system, and to gold used strictly as *light* — hairlines, edges, small marks on
the dark ground — never as a field and never on the light plate (§4.2). Justified because
the mark and the gold are both hers, and because the discipline is what separates this from
the gold-on-black cliché the category is full of.

---

## 3. The thesis and the signature

> **A frame is a decision about what you look at.**

### 3.1 `o visor` — the viewfinder

**Four hairline corner brackets.** Amanda's mark, extracted from the logo and promoted to
the system's only ornament.

It is the site's:

| Role | Behaviour |
|---|---|
| **Focus indicator** | `:focus-visible` draws the four brackets around the element, `--ouro`, 1.5px, 8px arms, 3px offset. **The mark is the accessibility affordance.** This is the single best idea in the system: the brand device and the WCAG 2.4.7 requirement are the same object. |
| **Hover / pointer** | The brackets track the cursor and *snap* onto interactive targets (ReactBits `TargetCursor`, §7.2). Disabled on coarse pointers and under `prefers-reduced-motion`. |
| **Product card** | Each frame in a grid sits inside brackets, not inside a box. Corners only — the card has no border. |
| **Hero crop** | Brackets at the viewport's inner margin, marking the composition, exactly as Oakley's guides do (`frames/oakley/004.jpg`). |
| **Section marker** | A single bracket pair opens a section, carrying its number: `⌐ 03 — MOSTRUÁRIO ¬` |
| **Reseller badge** | The endorsement line (`spec-brand.md` §3) sits inside brackets. A storefront is *the catalogue in a frame*, and the frame says whose. |

**The binding rule — the one thing that stops this becoming wallpaper:**

> **A bracket must frame something real.** It marks focus, selection, a product, a section,
> or a crop. A bracket used to decorate an empty area is out of spec, and so is a bracket
> around something the user cannot act on.

This is the exact analogue of F&A Móveis' rule that a hairline rule must carry a real
measurement, and it exists for the same reason: a signature device that is applied
everywhere stops meaning anything by the third screen.

### 3.2 Geometry

- **Corner radius: `0` everywhere except the product plate.** The mark is square. The
  brackets are square. Buttons, inputs, panels, and cards are square.
- **The product plate is the exception**: `--radius-lente: 2px`. Barely there — enough to
  read as a physical plate rather than a hole punched in the page. This is the only radius
  token in the system and it exists so the exception cannot spread.
- **Hairlines are `1px` at `--aro`**, never `0.5px` (it disappears at DPR 1) and never
  `2px` (that is a border, and this system has no borders).

---

## 4. Colour

### 4.1 Tokens

Brand-sampled values are marked ●. All ratios computed against the stated ground.

```css
:root {
  /* ground — the turquoise driven to its dark extreme */
  --vazio:          #070B0C;  /* the void behind the starfield                       */
  --noite:          #0C1214;  /* ● page ground (from #0F1012 / #0D1111, hue-resolved) */
  --fumo:           #131A1D;  /* elevated surface: cards, sheets, nav on scroll       */
  --petroleo:       #0A2A31;  /* ● tinted panel (from her portrait's rim light)       */
  --aro:            #242E32;  /* hairlines. "the rim"                                 */

  /* ink */
  --cinza:          #78858A;  /* muted / captions        4.96 on --noite  AA          */
  --prata:          #A6B2B6;  /* secondary               8.69 on --noite  AA          */
  --luz:            #E6EBEC;  /* body                   15.70 on --noite  AA          */
  --foco:           #FFFFFF;  /* RESERVED — see §4.2    18.88 on --noite              */

  /* the light plate — where product photography lives */
  --lente:          #E8EBEC;  /* the plate                                            */
  --lente-tinta:    #0C1214;  /* text on the plate      15.76           AA            */

  /* the accent — her gold, sampled from the lockup (spec-brand.md §1.5b) */
  --ouro:           #CCA866;  /* ● THE accent            8.42 on --noite  AA          */
  --ouro-claro:     #E0C48F;  /* lit edge               11.20 on --noite  AA          */
  --ouro-fundo:     #7D6029;  /* accent for the plate    4.90 on --lente  AA          */
  /* --indigo (the AR-coating flash) is retired: it belonged to the turquoise story  */
}
```

### 4.2 The rules that make the palette work

1. **`--foco` (`#FFFFFF`) is not a text colour.** Body text is `--luz`. Pure white is
   reserved for **the element currently in focus, hovered, or selected** — one element on
   screen at a time. That single reservation is what makes the page read as an optical
   instrument rather than a dark theme: something is always *in focus*, and it is literally
   brighter than everything else.
2. **`--ouro` may not appear on `--lente`.** Measured 1.87 — it fails. On the light
   plate the accent is `--ouro-fundo` (4.90). This is a hard constraint and it is
   welcome: it means the accent belongs to the dark, and the light plate belongs to the
   product.
3. **Text on an `--ouro` fill is `--noite`** (8.42), never white (2.24 — fails). A gold
   button is dark-on-bright. There is exactly one on any given page.
4. **Gold is light, not paint.** Hairlines, edges, small marks, one button. It never fills
   a large field — a gold plane is the exact cliché §2 is steering around.
5. **The product photograph is the only saturated thing on the page.** Everything else is the
   greyscale ramp plus a strictly rationed turquoise. If a screen looks flat, the fix is a
   better photograph, never a second accent colour.
6. **No second accent, ever.** Errors and success states are system feedback, not brand:
   take AlignUI's own `state-error` / `state-success` tokens and use them only inside forms
   and `/admin`. They never appear on a storefront.

---

## 5. The technical layer — `a numeração`

Every pair of glasses in the world carries a **boxing-system size marking** stamped inside
the temple arm: lens width, bridge width, temple length.

```
52□18-145
```

This is the eyewear equivalent of F&A Móveis' `2,30 m`: an industry artifact, already
printed on the product, that customers half-recognise and no competitor site treats as
typography. It becomes the site's technical voice.

- Set in the mono face (§6), `--cinza` or `--prata`, uppercase, tracked `+0.04em`.
- The `□` is **U+25A1 WHITE SQUARE**, which most mono webfonts lack. **Draw it as an inline
  SVG square** in the `Numeracao` component rather than trusting the font — and never
  substitute `-`, `x`, or `/`, because opticians read the box as the box.
- It appears under every product name, in the tech-spec table, and in the pre-filled
  WhatsApp message (`spec-architecture.md` §7.3), so the number Amanda receives is the same
  number the customer read.

**The binding rule, matching §3.1:**

> **A number on this site is a real measurement.** `52□18-145` is data from
> `produtos.medidas`. A number is never set as decoration, and a product with no measurements
> renders **no** numeração — not a placeholder.

`[VERIFICAR: whether Amanda has these three numbers per SKU. If she does not, §5 ships
disabled and the tech-spec table drops to Formato / Material / Cor — the WEB Eyewear set
(`references/frames/web-eyewear/014.jpg`). Do not invent measurements to fill the layout.]`

---

## 6. Type

**The wordmark is never set in a typeface.** It ships as SVG (`spec-brand.md` §4). Nothing
below is an attempt to match it.

| Role | Face | Why |
|---|---|---|
| **Display + UI + body** | **Archivo** (variable: `wght` 100–900, `wdth` 62–125), self-hosted via `next/font/local` | One superfamily with a real **width axis**. Headlines run at `wdth 110–125` to echo the wordmark's extension; body runs at `wdth 100` and stays readable. The width relationship to the logo is a derivation, and it costs one font file. |
| **Technical** (numeração, SKU, lead codes, prices) | **IBM Plex Mono** 400/500, self-hosted via `next/font/google` | Resolved 2026-08-17 in `TASK-scaffold-e-apresentacao.md` §2.3 on pt-BR diacritic coverage and figure clarity. Revisitable against Geist Mono if a specimen comparison ever says otherwise, but it is no longer blocking. |

**Why not a squared/techno face for text:** setting a whole site in Eurostile-adjacent type
(Michroma, Orbitron, Chakra Petch) would be loud, would age badly, and would compete with
the logo instead of supporting it. The brand's squareness is carried **structurally** — by
the bracket, the zero radius, the grid — not typographically. That is the more durable
place to put it, and it is why the wordmark still reads as special after you have scrolled.

**Scale** (fluid, `clamp()`; ratio 1.333 at the display end, 1.2 in the text range):

| Token | Size | Setting |
|---|---|---|
| `--t-display` | `clamp(3rem, 9vw, 8.5rem)` | `wdth 118`, `wght 600`, tracking `-0.03em`, leading `0.92` |
| `--t-h1` | `clamp(2.25rem, 5vw, 4rem)` | `wdth 112`, `wght 600`, `-0.02em` |
| `--t-h2` | `clamp(1.5rem, 2.6vw, 2.25rem)` | `wdth 105`, `wght 600`, `-0.01em` |
| `--t-corpo` | `1.0625rem / 1.6` | `wdth 100`, `wght 400` |
| `--t-legenda` | `0.8125rem / 1.5` | `wdth 100`, `wght 400`, `--cinza` |
| `--t-sobrescrito` | `0.6875rem` | uppercase, tracking `+0.16em`, `wght 500` — eyebrows, section numbers |
| `--t-tecnico` | `0.75rem` | mono, tracking `+0.04em` — numeração, SKU, codes |

**pt-BR:** every face must ship `í ã õ ç é ê á â ó ô ú à`. `Trísion` without its accent is a
misspelling of the brand, including in `<title>`, OG tags and the WhatsApp message.

---

## 7. Motion and the live layer

Where the differentiation lives. Three components, **each justified by a brand fact rather
than by looking good** — the test any addition must pass.

**Source, updated `TASK-motion-apresentacao.md`:** React Bits (`npx shadcn@latest add
@react-bits/<Name>-TS-TW`, vendored into `components/bits/`, `SOURCES.md` + sha256, exactly as
Flora does for AlignUI) is the first thing to reach for. It is **not mandatory** when the team
already owns a verified, correct alternative — `Ceu` (§7.1) and `VisorCursor` (§7.2) were
hand-written from the start rather than pulled from the registry, and `foco-verdadeiro.tsx`
(§7.4) and the scroll-reveal primitive (`components/revela.tsx`) followed the same path,
built on `motion` (npm package `motion`, the current release of what was `framer-motion` —
verified via `npm view`, not assumed from memory) instead. Either source is acceptable as long
as the result matches the named budget in §7.5 and each piece still carries the one-sentence
brand justification in §7.4. Un-vendored, hand-written motion is not a shortcut that skips
verification — the same `[VERIFICAR: provider behaviour]` discipline in `AGENTS.md` §2.2
applies to a hand-built effect as much as to a registry package: check current API, don't
assume.

### 7.1 `Galaxy` / `Particles` — the ground

Her starfield, rebuilt live instead of shipped as a 1.5 MB JPEG. Slow drift, near-static;
it is a ground, not a screensaver.

**Non-negotiable:** it renders behind everything at `--vazio`, and the page is fully legible
if it never initialises. Feature-detect WebGL; on failure, or under
`prefers-reduced-motion`, the ground is a flat `--noite` with a static grain — **never** a
blank or broken hero.

### 7.2 `TargetCursor` — the mark, alive

Corner brackets that follow the pointer and snap onto interactive targets. This is *literally
Amanda's logo*, moving. It is the strongest single decision in the design: the brand mark
stops being a sticker in the corner and becomes how the site behaves.

Retune to spec: `--ouro`, 1.5px arms, snap `120ms` `cubic-bezier(.2,.8,.2,1)`. Pointer-fine
only; on touch the brackets are static on cards. Off under `prefers-reduced-motion`, where
`:focus-visible` brackets (§3.1) do the same job without motion.

### 7.3 `Iridescence` / `MetallicPaint` — the coating

The anti-reflective flash, sampled from her own lens at `#10247C` and running to
`--ouro-claro`. Used on **exactly one element per page** — the primary CTA's edge, or the
collection card in view. It is the only place two hues meet, and it is the reason the site
does not need a second accent colour.

**Live instances (`TASK-motion-vitrine.md`, 2026-08-18):** `.iridescencia` in `globals.css`
on `/` ("Ver o catálogo") and `/oculos/[slug]` (`BotaoWhatsApp`). `/apresentacao` slide 12
uses the same class on the combinado panel — internal pitch, not a customer route. Listing
pages (`/catalogo`, `/colecoes`) have no single primary CTA and correctly omit it.

### 7.4 Supporting cast

| Component | Where | Justification |
|---|---|---|
| `TrueFocus` | the homepage statement, once | Text that blurs while a focus bracket travels word to word and snaps each into focus. It is an **optical focus device with corner brackets**, for an eyewear brand whose mark is a corner-bracket focus device. Nothing else in the library is this on-brand. Use once; twice is a gimmick. |

**Implemented as `FocoVerdadeiro` (`components/foco-verdadeiro.tsx`).** The named customer-
facing target is `/` (*"Uma armação é uma decisão sobre o que você olha"*). `/apresentacao`
slide 03 reuses it for Amanda's pitch (*"Um aro é uma decisão…"*) — a different audience in a
different session, not the "twice is a gimmick" case the table warns about (that rule is about
one visitor's experience on one page, not the repo's total mount count).
| `ScrollFloat` / `ScrollReveal` | section headings | Quiet entrance. Both `whileInView`-driven — verify they degrade to visible text with JS off. |
| `ModelViewer` | one hero frame, if a 3D asset exists | `[VERIFICAR: does Amanda have any 3D/turntable assets? Almost certainly not — this is Fase 3 at the earliest. Do not build the route on the assumption.]` |
| `LogoLoop` | `/revendedores` | The network, marching. Uses reseller names as type, not logos (`spec-brand.md` §3). |
| `Masonry` / `ChromaGrid` | collection pages | Only where the photography justifies it. |

**Explicitly rejected:** `Balatro`, `Ballpit`, `Hyperspeed`, `LiquidEther`, `SplashCursor`,
`Lightning`, `FaultyTerminal`, `Ribbons`, `BlobCursor`. All fine components; all wrong for a
brand whose entire proposition is composure. **A component enters this system only with a
sentence explaining which brand fact it carries.** "It looks incredible" is not that sentence.

### 7.5 Motion budget

- **Durations:** `120ms` (state), `240ms` (element), `480ms` (section). Nothing longer — **for
  interaction states**: `VisorCursor`'s snap, `:focus-visible`, anything responding directly to
  a pointer or key. These stay snappy because they are confirming an input, not being watched.
- **Content-entrance budget, added `TASK-motion-apresentacao.md` 2026-08-18:** `560ms`
  (element) / `760ms` (section), easing `cubic-bezier(.16,1,.3,1)` (expo-out). A scroll-
  triggered reveal of a slide-sized block of content is not an interaction state — at 240ms it
  read as a flicker rather than a reveal (Benito, reviewing the first pass). Use this budget
  for anything built with `Revela` (`components/revela.tsx`) or the same shape of effect;
  keep the interaction-state figures above for anything responding to a click, hover, or key.
  **`FocoVerdadeiro` moved onto this budget `TASK-motion-vitrine.md` 2026-08-18** — it had
  shipped on the `240ms` interaction-state figure by oversight; it's a scroll-triggered,
  once-only reveal, the same shape of effect as `Revela`, so it now uses `560ms`/`140ms`
  stagger, expo-out.
- **Easing:** `cubic-bezier(.2,.8,.2,1)` for interaction entrances, `cubic-bezier(.4,0,.2,1)` for exits.
- **One rAF loop.** If more than two components end up scroll-driven, port `frame-loop.ts`
  from `blessed-moon` (reads before writes) rather than letting each own a loop. This has
  already been paid for once.
- **`prefers-reduced-motion` is a first-class path, not a fallback.** Every effect above
  either stops or resolves to its end state. A visitor who has asked for stillness gets a
  complete, elegant, static site — not a degraded one.

---

## 8. Components — which library owns what

| Source | Owns | Method |
|---|---|---|
| **AlignUI** (primary) | Everything with state and semantics: `Button`, `Input`, `Label`, `Hint`, `Select`, `Modal`, `Badge`, `Divider`, `Tooltip`, `Dropdown`, `FileUpload`, `Avatar`, `Kbd`, `Table`. Plus `utils/cn.ts`, `tv.ts`, `polymorphic.ts` | Vendored **byte-identical from its docs pages** into `components/ui/`, logged in `components/ui/SOURCES.md` with URL + sha256. This is Flora's established pattern (`flora/apps/web/components/ui/SOURCES.md`, AlignUI v1.2) — reuse it, do not re-invent it. Restyle **only** through the token layer. **`Drawer` + foundation utils are the first vendored slice** (`TASK-alignui-vendoring.md`): only the AlignUI token names those files reference are bridged in `globals.css` — not AlignUI's full ~900-line theme. |
| **shadcn/ui** (gap-filler) | Only what AlignUI does not ship and we actually need — likely `sheet`, `accordion`, `chart` (the leads dashboard) | `npx shadcn@latest add <name>` |
| **React Bits** (the differentiator) | §7 only | `npx shadcn@latest add @react-bits/<Name>-TS-TW` → `components/bits/` — or a verified hand-built equivalent on `motion`, see §7 |
| **Hand-written** | `Visor` (the brackets), `Numeracao`, `ProdutoCard`, `FichaTecnica`, `BotaoWhatsApp`, `MarcaLockup`, `Revendedor*` | No generator produces these; they are the brand |

**Rule:** one primitive, one source. If AlignUI ships a `Button`, shadcn's `button` is not
also installed. Two button implementations is how a design system dies.

---

## 9. Layout

- **Grid:** 12 columns, `--gutter: clamp(16px, 2vw, 32px)`, max content width `1440px`, with
  full-bleed permitted for hero film and the light plate.
- **The guides are visible.** Thin `--aro` verticals at the grid's outer and centre lines,
  drawn over full-bleed media, as Oakley does (`frames/oakley/004.jpg`, `006.jpg`). They cost
  nothing and they are what makes a dark page read as *composed* rather than empty.
- **The light plate.** Product photography sits on `--lente` panels inside the dark page —
  the XOO pattern (`frames/x8.adencys/004.jpg`). The contrast between black chrome and light
  plate is the layout's main event; it is also honest, because eyewear is photographed on
  white.
- **Vertical rhythm:** `8px` base. Section padding `clamp(64px, 10vh, 160px)`.
- **Mobile first, and mobile is the real target.** Amanda's traffic arrives from Instagram on
  a phone. Every screen is designed at `390px` first and the desktop layout is the
  adaptation, not the other way round.

---

## 10. Photography standard

The site is 80% photographs. This section is therefore load-bearing, and it is the thing most
likely to be the actual bottleneck.

| Shot | Required | Treatment |
|---|---|---|
| **Front, straight on** | yes | On `--lente`, frame filling ~72% of width, temples folded |
| **Three-quarter** | yes | Same plate, consistent angle across the whole catalogue |
| **Temple detail** | preferred | Shows the hinge, the acetate, and the numeração stamp |
| **On a face** | ideal | The only shot allowed on a dark ground |

- **One plate, one light, one angle, forever.** A catalogue whose photographs disagree with
  each other cannot be made elegant by any amount of CSS. If Amanda's existing product shots
  are inconsistent, **normalising them is a task of its own** — `sharp`, scripted, never by
  hand (F&A Móveis: `scripts/normalizar-imagens.ts`).
- Backgrounds that arrive as pure white get swapped to `--lente` in that script, so the plate
  is one value site-wide.
- Formats: AVIF + WebP via `next/image`. LCP image `priority`. `[VERIFICAR: what Amanda
  actually has. If it is Instagram crops, the honest answer is a photo day, and that should
  be quoted as part of the job.]`

---

## 11. Screens

**Brand site — `trision.com.br`** (audience: wearers *and* prospective resellers)

| Route | Purpose |
|---|---|
| `/` | The statement (§7.4 `TrueFocus`), the collections, `Desde 2002`, find-a-reseller |
| `/colecoes` · `/colecoes/[slug]` | Editorial, per collection |
| `/catalogo` | The full line, filterable: formato, material, cor, gênero |
| `/oculos/[slug]` | Product: gallery, ficha técnica, numeração, "onde comprar", WhatsApp |
| `/revendedores` | The network. Search by city/UF. Proof of 24 years |
| `/sobre` | Amanda, 2002, the portrait |
| `/seja-revendedor` | The B2B funnel — the second front door (`spec-brand.md` §2.1) |
| `/atendimento-exclusivo` | `[VERIFICAR: blocked on open question #2]` |

**Reseller storefront — `<loja>.trision.com.br`**

| Route | Purpose |
|---|---|
| `/` | This shop's front: endorsement line, its featured frames, its contact |
| `/mostruario` | **Only what this shop carries.** Same components, filtered data |
| `/oculos/[slug]` | Same product page; the CTA is attributed (`spec-architecture.md` §7) |
| `/a-loja` | Shop identity: photo, address, hours — map `[VERIFICAR: no maps provider chosen; revisit once real addresses exist]` |

The two are **the same components with a different `tenantId`**. If a storefront needs a
component the brand site does not have, that is a signal the tenancy boundary is being
violated — see `spec-architecture.md` §6.

---

## 12. Budgets

Numbers, not adjectives. Measured on a throttled mid-range Android profile, median of
repeated runs — never a single measurement.

| Metric | Budget |
|---|---|
| LCP, product page, 4G | **≤ 2.0s** |
| CLS | **≤ 0.05** |
| Main-thread JS, storefront route | **≤ 180 KB** gzipped |
| WebGL ground | lazy, **never** in the critical path; page is complete without it |
| Contrast | every text token in §4.1 carries a computed ratio ≥ 4.5 on its ground |
| Keyboard | every interactive element reachable, and its focus state is the bracket (§3.1) |

---

## 13. The rules that are never broken

1. **A bracket frames something real** (§3.1).
2. **A number is a real measurement** (§5).
3. **`#FFFFFF` means "in focus"** and nothing else (§4.2).
4. **No second accent colour.** Ever. The fix for a flat screen is a better photograph (§4.2).
5. **Sharp corners** — radius `0`, one exception, named (§3.2).
6. **The wordmark is SVG, never a typeface** (§6).
7. **A React Bits component needs a sentence naming the brand fact it carries** (§7.4).
8. **AlignUI is vendored byte-identical and logged with a sha256**; restyling happens in the
   token layer only (§8).
9. **`prefers-reduced-motion` and no-WebGL are complete experiences**, not degraded ones (§7.5).
10. **A reseller storefront has no design tokens of its own** (`spec-brand.md` §3).
