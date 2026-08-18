# Trísion Eyewear — Brand Spec

> Companion to `spec-design.md` (visual system) and `spec-architecture.md` (the platform).
> Written in English; every string that reaches a customer is quoted in **pt-BR** exactly as
> it should ship.
>
> **This brand is 24 years old.** It has a name, a mark, a ground, a tagline, a founding year
> and a face. The job is to bring an existing identity onto the web with better craft — not to
> invent Trísion. Every token in `spec-design.md` traces to something Amanda already owns, and
> where it does not, that is stated in the open.

---

## 1. Brand audit — what already exists

All evidence is first-party: her logo tile, her link-in-bio page, her profile portrait.
Colour values are **sampled with `ffmpeg`**, not estimated. Source files live in
`references/`.

### 1.1 The mark

Four **L-shaped corner brackets** forming a square frame, with a **`Tr` ligature** locked
inside it. The letterforms and the brackets *interlock* — the `T` crossbar runs over the top
brackets, the stem drops through the bottom pair. White on a black glitter ground.

It is a **viewfinder**. The same device as a camera's focus reticle, a crop mark, and — for
this business specifically — a frame you look through. It is a much better mark than a
24-year-old regional eyewear label has any right to have, and its concept is doing real work
that has never been used.

### 1.2 The wordmark

**`Trísion`** set in a wide, geometric, square-with-rounded-corners sans — the
Eurostile / Microgramma lineage. Rounded rectangular counters on `o`, `s`, `n`; a joined
`Tr` ligature matching the mark; the `í` accent drawn as a slanted slab. Beneath it,
**`Eyewear`** in a bold oblique of the same family.

`[VERIFICAR: the exact typeface. Ask Amanda's designer, or ask for the original vector
(.ai/.eps/.svg/.pdf). We must not re-set the wordmark in a substitute face — see §4.]`

### 1.3 The ground

A **black glitter / starfield** field. It is not a one-off: it appears on her logo tile, as
the full-bleed background of her link-in-bio page, and behind her profile portrait. Three
independent uses. **The starfield is the brand's ground, and it is hers.**

| Sample | Source | Value |
|---|---|---|
| Logo tile, background patch | logo image, 200×200px at (40,40) | `#0F1012` |
| Link page, open field | link-in-bio screenshot, 300×300px at (200,700) | `#0D1111` |
| Portrait rim / backlight | avatar crop | `#091E24`, `#07171B` |

Two neutral-cool near-blacks and, in the portrait, a **petrol-tinted** one. None of them is
`#000000`. The ground has always had a cast; it has just never been specified.

### 1.4 The portrait — the single richest asset

Her profile picture: a woman in a chunky square acetate frame, **turquoise browline** fading
to champagne acetate, lit with a **teal rim light**, against the starfield, deep red lip.

| Sample | Value |
|---|---|
| Frame browline, brightest read | `#11ABB8` |
| Frame browline, mid | `#09838E` |
| Frame browline, deep | `#225151` |
| Rim light / backlight | `#091E24`, `#07171B` |
| **Anti-reflective coating flash on the lens** | `#10247C` |
| Champagne acetate, lower rim | `#A17055` |

`[VERIFICAR: that this is Amanda herself and that we may use the portrait. If it is her, it
is the brand's best photograph and belongs on /sobre.]`

### 1.5 The words she already uses

| String | Source | Status |
|---|---|---|
| `Trísion Eyewear` | logo, link page | the name — **accent is not optional** |
| `Eyewear Addict ❤` | link-in-bio bio line | her tagline, in English, first person |
| `Since 2002` | link-in-bio footer | **the most valuable fact in the audit** |
| `Atendimento Exclusivo` | link-in-bio button + a Canva page | a named service she already sells |
| `Fale comigo` | link-in-bio button | her CTA, singular and first person |

`[VERIFICAR: the content of the "Atendimento Exclusivo" Canva page
(sitetrision.my.canva.site/atendimento-exclusivo). It is fully client-rendered and could not
be read programmatically — ask Amanda for a screenshot or for the text. It names a service
we currently know nothing about, and "Atendimento Exclusivo" may be the single most
important page on the new site.]`

### 1.5b CONTESTED — the brand colour is gold, according to Amanda

**Amanda, via WhatsApp, 2026-08-17:** *"A nossa cor é essa: Dourado com preto. No insta eu
tenho usado preto com branco porque acho que facilita a leitura."*

This **directly contradicts** the turquoise in §1.4 and the thesis of `spec-design.md` §2,
which rejected gold as the most crowded position in the eyewear market. Her statement is a
**brand fact** and outranks our sampling — turquoise was inferred from the material, gold
was asserted by the owner.

Two things her message hands us for free, and they are worth more than the disagreement:

1. **Gold has already failed in practice, on legibility** — she herself moved to black and
   white on Instagram *"porque facilita a leitura"*. So the problem is not gold as
   identity, it is gold as body ink. That is solvable, and it is exactly the kind of thing
   a design system exists to solve.
2. **She never abandoned black.** The dark ground survives intact, and with it the
   starfield (§1.3), which is the strongest and most consistent part of her material.

**RESOLVED 2026-08-17.** The horizontal gold lockup arrived. Sampled with `ffmpeg`: the
mode over 821 px is **`#CCA866`**, and the solid strokes of the symbol and the logotype
read `#D2AE6D` / `#D2B171` — the same family. **Trísion's gold is `#CCA866`**, sampled,
not chosen. The art also proves the horizontal lockup **already exists** — §4 said it had
to be built, and that was wrong.

**~~Blocked on:~~** the exact value. She said "essa cor" alongside an image that had not
yet reached this repository. **Do not pick a gold from memory** — `#D4AF37` and kin are
stock gold, and using one here would repeat the error §2 of the design spec accuses. Ask
for the file, or the hex, or the art where she uses it.

**While it was still open:** the tokens in `spec-design.md` §4.1 stay as they are, and no new
screen should be built assuming turquoise *or* gold as definitive. See
`TASK-paleta-dourada.md` when it exists.

### 1.6 The find

Three things in her material are the same thing:

1. **The mark** is a frame around a letter.
2. **The product** is a frame around an eye.
3. **The business** is a frame around a catalogue — each reseller's storefront shows a
   *selection* of Amanda's stock. Same objects, different framing.

> **A frame is a decision about what you look at.**

That sentence is the brand, the design system (`spec-design.md` §3) and the data model
(`spec-architecture.md` §5) at once. It was not brought to Trísion; it was already in the
logo, waiting for someone to notice that the corner brackets mean something.

---

## 2. Positioning

|  |  |
|---|---|
| **What it is** | A Brazilian eyewear label, founded 2002, sold through a network of resellers. |
| **Promise** | Frames chosen by someone who is genuinely obsessed with them. |
| **Essence** | Considered selection. Not the widest catalogue — the *right* one. |
| **The asset nobody else has** | **24 years.** Every competitor in this market reads as launched-last-year. Trísion has outlived two decades of eyewear trends and can prove it. |
| **Audience** | Two, and they are different people (see §2.1). |
| **Personality** | Precise, quietly confident, warm underneath. An optician's eye, not a boutique's pose. |
| **Tone** | First person. Amanda is present in the brand — "Fale comigo", "Eyewear Addict" — and that is an advantage over faceless eyewear e-commerce. Do not sand it off into corporate plural. |

### 2.1 Two audiences, two front doors

This is the structural fact that most affects the build:

| | **The wearer** | **The reseller** |
|---|---|---|
| Lands on | a reseller storefront, `<loja>.trision…` | the brand site, `trision…` |
| Wants | to find a frame they'd actually wear, near them | to know the line is worth carrying |
| Proof they need | the frames, well photographed | 2002, the network, the terms |
| Ends in | WhatsApp with Amanda | WhatsApp with Amanda |

Both funnels terminate in the same inbox. `spec-architecture.md` §7 is how Amanda tells them
apart when they arrive.

### 2.2 What this deliberately is not

- **Not a "luxury eyewear" pastiche.** No serif-and-marble, no "timeless elegance"
  boilerplate, no invented European heritage. The heritage here is real, Brazilian, and
  dated 2002 — say that instead.
- **Not a marketplace.** The catalogue is one label's, curated by one person. If Trísion also
  distributes other brands, that is a `marca` field on a product, not a change of positioning
  (`spec-architecture.md` §5.3).
- **Not playful.** `references/frames/eyewearjunkie/` is the negative reference: bright
  primaries, cartoon mark, tilted cards. It is a fine site for a different brand and it is
  the opposite of what "consolidated since 2002" should look like.
- **Not a cart.** v1 ends in WhatsApp, exactly as F&A Móveis does. No checkout, no stock
  counts shown to customers, no prices we have not confirmed.

---

## 3. Brand architecture — the reseller question

**A reseller is not a sub-brand. It is an endorsement.**

Every storefront is Trísion's. The mark in the header is Trísion's, the type is Trísion's,
the palette is Trísion's. The reseller appears as a **line of attribution**, never as a
co-brand:

```
TRÍSION EYEWEAR
Revenda oficial · Ótica Silva · Volta Redonda, RJ
```

**Confirmed by Benito, 2026-08-17.** This is settled, not a proposal.

**Why this is a binding rule and not a preference:** the whole commercial argument for the
platform is that a small optical shop gets a storefront it could never afford to build. The
moment a reseller can upload a logo, pick a colour, or restyle a page, that value evaporates
into thirty different-looking sites that all claim to be Trísion, and Amanda's brand becomes
the least controlled thing she owns. **`spec-architecture.md` §5.2 enforces this in the data
model: a tenant has no design fields.** What a reseller controls is its *identity and its
selection* — name, city, contact, photo, which frames it carries — never a token.

The one place this bends: a reseller may set **one storefront photograph** (their shop, their
window, their counter). It appears in one slot, in one aspect ratio, under one treatment.
That is enough to feel like theirs and cannot break anything.

---

## 4. Keep / refine / retire

| | Decision |
|---|---|
| **Keep** | The name, accent included. The bracket mark and its interlock. The `Tr` ligature. The starfield ground. `Since 2002`. `Eyewear Addict`. First-person voice. **The gold, `#CCA866`.** The horizontal lockup — it exists (§1.5b); an earlier draft of this table wrongly said it had to be built. |
| **Refine** | Redraw the mark as clean SVG at its existing proportions — the current asset is a low-resolution raster with soft bracket corners. Anchor the ground to a defined value instead of a JPEG average. Redraw the existing horizontal lockup as clean SVG at its own proportions. |
| **Retire** | The glitter *texture* as a literal JPEG. The starfield stays; it gets rebuilt as a live field (`spec-design.md` §7.1) so it is sharp at every size and does not ship a 1.5 MB tile. The rounded pill buttons on the link-in-bio page — they belong to Linklist's template, not to Trísion. |
| **Add** | Only what the brand lacked because it never had a real site: a type system, a tested palette with contrast numbers, the measurement language (`spec-design.md` §5), and the viewfinder as a working interaction rather than a static logo. |
| **Never** | Re-set the wordmark in a substitute typeface. If the vector cannot be recovered, it gets **redrawn by hand from the raster** and shipped as SVG — see `[VERIFICAR]` in §1.2. A near-miss font is worse than no wordmark. |

---

## 5. Voice

Measured, specific, first person. Portuguese that a real optician in Rio de Janeiro state
would speak, not translated marketing copy.

**Reference lines** (hers, and lines written in her register):

| Slot | pt-BR |
|---|---|
| Bio / hero kicker | `Eyewear Addict` — kept in English. It is hers, and it is the one line of the brand that is a personality rather than a claim. |
| Founding | `Desde 2002` — used as a mark, set small, near the logo. Never `Há mais de 20 anos no mercado`. |
| CTA, primary | `Fale comigo` — singular, first person. Never `Entre em contato`. |
| CTA, reseller storefront | `Falar com a Trísion` |
| Product, no confirmed price | `Consulte o valor` — never an invented number (§6). |
| Reseller endorsement | `Revenda oficial · {loja} · {cidade}, {UF}` |
| Empty storefront | `Esta loja ainda está montando o mostruário.` |
| Reseller recruitment | `Sua ótica pode vender Trísion.` |

**Rules:**

- **First person singular for Amanda, third person for the label.** "Fale comigo" is Amanda.
  "A Trísion trabalha com…" is the brand. Do not mix them inside one sentence.
- **No superlatives without a number behind them.** `Desde 2002` is allowed because it is
  true and checkable. `A melhor curadoria do mercado` is not.
- **Brazilian formatting, everywhere.** `R$ 890`, `12x de R$ 74`, `52□18-145`, `(24) 9…`.
- **Never invent a fact about her business** — not a price, not a measurement, not a city,
  not a reseller's name. Write `[VERIFICAR: what to check and who to ask]` inline instead.
  The same rule that governs F&A Móveis, and for the same reason: a plausible wrong number
  shown to a client loses the room.

---

## 6. Open questions

These block real work and each one names who answers it.

| # | Question | Blocks | Ask |
|---|---|---|---|
| 1 | Does Trísion manufacture/import its **own** line, or distribute several brands? | whether `produtos.marca` is a real field or a constant | Amanda |
| 2 | What is on the **"Atendimento Exclusivo"** page? | possibly a whole route; it is a named service we cannot see | Amanda |
| 3 | Amanda's full name, city/UF, WhatsApp number, Instagram handle | every footer, every CTA, `content/marca.ts` | Amanda |
| 4 | Does Trísion own a **domain**? — **partially answered 2026-08-17**, see note below | **Hard blocker for multi-tenant** — wildcard subdomains require an apex domain (`spec-architecture.md` §4.1) | Amanda / Benito |
| 5 | How many resellers today, and how many frames in the catalogue? | phasing, whether a CSV importer is Fase 1 or Fase 3 | Amanda |
| 6 | Does the reseller's WhatsApp button reach **Amanda** or the **reseller**? | the lead model (`spec-architecture.md` §7.2 ships a flag so this is not blocking, but it must be answered before launch) | Amanda |
| 7 | One suggested retail price, or per-reseller pricing? | whether `mostruario` carries a price override, and whether "one catalogue" survives | Amanda |
| 8 | Is the original **logo vector** recoverable? | §1.2, §4 | Amanda's designer |
| 9 | Do the frames carry standard **boxing-system markings** (`52□18-145`), and does she have them per SKU? | the whole technical layer in `spec-design.md` §5 | Amanda |
| 10 | What is the "Site" link on her link-in-bio? | there may be an existing site we have not seen | Amanda |

### Question 4 — partially answered 2026-08-17

**Amanda: "Eu tenho domínio."** She confirms she owns a domain, which clears the hard
blocker in principle. **Still `[VERIFICAR]`:** which domain (the exact string), and who
controls its DNS/registrar access — both are required before `NEXT_PUBLIC_SITE_URL`
(`src/lib/site-config.ts`) can be set to it or any wildcard/apex configuration
(`spec-architecture.md` §4.1) can start. Not yet actionable; do not assume `trision.com.br`
or any other string until she names it.

