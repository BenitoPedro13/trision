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

`[VERIFICAR: the exact typeface — still open. The original vector itself is recoverable:
Amanda confirmed 2026-08-20 she has the file and will send it (§6 question 8). She also
flagged, unprompted, that the current hand-redrawn `R` in the `Tr` ligature is wrong —
don't re-guess it from the raster; wait for the real file. We must not re-set the wordmark
in a substitute face — see §4.]`

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

**ANSWERED 2026-08-20 — see §6 question 2 for the full content.** In short: Trísion is
also an optical practice (**Trísion Personal Optical**), 24 years of in-home/in-location
visits — technical routine assessment, technology recommendation, aesthetic frame
consultation. `[VERIFICAR: exact page structure/length — the Canva page and Instagram
linklist entry Amanda pointed at may still have detail worth reading before final copy.]`

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
3. **The business** is a frame around a catalogue — every reseller's storefront shows
   Amanda's full catalogue, the same objects framed by a different shop's endorsement
   (decided 2026-08-20, `TASK-catalogo-unico-sem-mostruario.md`). The frame is Amanda's
   decision for the whole business, not each reseller's for their shop.

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
| 1 | Does Trísion manufacture/import its **own** line, or distribute several brands? — **ANSWERED 2026-08-20** | whether `produtos.marca` is a real field or a constant | ~~Amanda~~ |
| 2 | What is on the **"Atendimento Exclusivo"** page? — **ANSWERED 2026-08-20** | possibly a whole route; it is a named service we cannot see | ~~Amanda~~ |
| 3 | Amanda's full name, city/UF, WhatsApp number, Instagram handle — **partially answered 2026-08-20** | every footer, every CTA, `content/marca.ts` | Amanda |
| 4 | Does Trísion own a **domain**? — **string confirmed 2026-08-20**, see note below | **Hard blocker for multi-tenant** — wildcard subdomains require an apex domain (`spec-architecture.md` §4.1) | Benito (DNS/registrar access) |
| 5 | How many resellers today, and how many frames in the catalogue? — **ANSWERED 2026-08-20** | phasing, whether a CSV importer is Fase 1 or Fase 3 | ~~Amanda~~ |
| 6 | Does the reseller's WhatsApp button reach **Amanda** or the **reseller**? — **ANSWERED 2026-08-20** | the lead model (`spec-architecture.md` §7.2 ships a flag so this is not blocking, but it must be answered before launch) | ~~Amanda~~ |
| 7 | One suggested retail price, or per-reseller pricing? — **ANSWERED 2026-08-20** | whether a price override collection exists, and whether "one catalogue" survives (moot now — see `TASK-catalogo-unico-sem-mostruario.md`) | ~~Amanda~~ |
| 8 | Is the original **logo vector** recoverable? — **ANSWERED 2026-08-20: yes, she has it** | §1.2, §4 | Amanda (still needs to send the file) |
| 9 | Do the frames carry standard **boxing-system markings** (`52□18-145`), and does she have them per SKU? — **partially answered 2026-08-20** | the whole technical layer in `spec-design.md` §5 | Amanda (owes a measurements table) |
| 10 | What is the "Site" link on her link-in-bio? — **ANSWERED 2026-08-20** | there may be an existing site we have not seen | ~~Amanda~~ |
| 11 | Does Amanda need numeric **stock quantity**, or is a yes/no toggle enough? Raised 2026-08-18 — she's worried a manual daily update won't scale as the business grows. **Evidence toward "no" as of 2026-08-20** — see note below | whether `produtos` gains a `quantidade` field; a quantity model needs an update mechanism (who updates it, how often) or it rots the same day it ships | Amanda |

### Question 4 — domain string confirmed 2026-08-20

**Amanda: "Tem domínio sim, www.trision.com.br."** The apex is **`trision.com.br`**. This
also answers question 10 below — the "Site" link on her Instagram link-in-bio is the same
domain. **Still `[VERIFICAR]`:** who controls DNS/registrar access — required before
`NEXT_PUBLIC_SITE_URL` (`src/lib/site-config.ts`) is set to it or any wildcard/apex
configuration (`spec-architecture.md` §4.1) starts. **New fact, same answer:** the domain
currently points at **Wbuy** (Amanda confirmed she has a Wbuy account — question 10's
follow-up, "já existe alguma conta de Trísion em serviço de site?"). That means launch
isn't just "point DNS at Vercel" — it's a cutover away from a live storefront, and Amanda
asked to **see what already exists there before anything is rebuilt** ("quero ver o que já
existe antes de refazer"). Visit `www.trision.com.br` and review the current Wbuy site
before treating any of its content, copy, or product listing as superseded.

### Question 10 — answered 2026-08-20

Same domain as question 4: `www.trision.com.br`, currently a Wbuy storefront. See the note
above — review it before rebuilding, per Amanda's explicit request.

### Question 1 — answered 2026-08-20

**Amanda: "Somente marca própria."** Trísion sells only its own line, never distributes
other brands. `produtos.marca` (`spec-architecture.md` §5.1) stays the constant
`"Trísion"` it already defaults to — no UI ever needs to show or pick a different value.

### Question 2 — answered 2026-08-20, and it changes the site

**Amanda:** *"Além da marca Trísion, somos uma óptica (Trísion Personal Optical). Há 24
anos atendemos os clientes, na casa ou local de preferência, realizamos visita técnica no
qual analisamos sua rotina e indicamos a melhor tecnologia, bem como realizamos uma
consultoria estética para melhor escolha de armação."*

This is not a minor service page — it's a second half of the business the spec didn't
know existed. Trísion is a *brand* (frames) **and** an *optical practice*
("Trísion Personal Optical") that has been doing in-home/in-location eye-care visits for
24 years: a technical assessment of the client's daily routine, a technology
recommendation from that assessment, and an aesthetic consultation to choose the frame.
This is the same 24-year fact already load-bearing in §2 ("The asset nobody else has") —
it now has a service behind it, not just a founding date.

`spec-design.md` §11's open `/atendimento-exclusivo` route is confirmed as real and
worth building, not a maybe. Content for it: the paragraph above, in Amanda's voice, not
translated marketing copy (§5). **Still `[VERIFICAR]`:** the exact page structure/length —
Amanda pointed at a Canva page and her Instagram linklist entry titled "atendimento
exclusivo" for more detail; read those before writing final copy.

### Question 3 — partially answered 2026-08-20

Instagram handle confirmed: **`@trisioneyewear`**. WhatsApp number: Amanda first said it
was **not yet decided** — *"será um outro contato, ainda estou vendo qual número vou
disponibilizar"* — but the number has since been named: **`+55 21 98011-8467`**
(`+5521980118467` E.164), set 2026-08-20 in `.env` (`WHATSAPP_MARCA`) and
`src/content/marca.ts`. Full name and city/UF are **still unanswered** — not addressed in
this round.

### Question 5 — answered 2026-08-20

**4 active resellers today.** Catalogue: **100+ models exist**, but Amanda deliberately
does not want all of them live at once — her plan is **~30 feminino + ~30 masculino
live at a time**, rotating as she updates it, plus models that sell out and later get
restocked cycling back in. This is exactly what `produtos.status` (`ativo` /
`descontinuado`, `spec-architecture.md` §5.1) is for — a model going out of print is a
status flip, not a delete, and a restock is flipping it back. **This is also evidence for
question 11** (below): she's describing a curation/status workflow, not asking for a
stock counter.

With 4 resellers and a two-tier catalogue (~60 live, 100+ total), a CSV importer
(`spec-architecture.md` §3, Fase 3) is not urgent — Payload's own admin UI comfortably
handles entering 60 products by hand for launch.

### Question 6 — answered 2026-08-20, no longer just a default

**Amanda: "Deverá ser comigo."** ("It has to be me.") Every reseller storefront's
WhatsApp CTA reaches Amanda, never the reseller — matching
`revendedores.destinoLead`'s existing default (`marca`, `spec-architecture.md` §5.2). The
field and its admin-only access stay as they are (a reseller could theoretically never
have needed the alternative option, but the field costs nothing to leave in place); this
answer just means it should never actually be set to `revendedor` in practice.

### Question 7 — answered 2026-08-20

**Amanda: "Mesmo preço, tabelado."** One price everywhere, no per-reseller pricing. A
price-override field is now settled as something to **never** build — see
`spec-architecture.md` §5.1's `precoSugerido` (single field on `produtos`) and
`TASK-catalogo-unico-sem-mostruario.md` (the per-reseller join collection this would have
lived on no longer exists at all, for an unrelated but compounding reason: resellers no
longer curate their own selection either).

### Question 8 — answered 2026-08-20

**Amanda has the original logo file** and confirmed she'll send it — preferably
`.ai`/`.eps`/`.cdr`/`.pdf`/`.svg`, whatever her designer used (§1.2's own ask). Until the
file actually arrives, the current approximate SVG redraw in `marca-paths.ts` stays in
place. **New defect she flagged in that redraw, unprompted:** *"A letra R da minha logo TR
está errada."* The `R` in the current hand-redrawn `Tr` ligature (§1.2) is wrong — treat
this as confirmed pending the real vector, and do not attempt to eyeball-fix the `R`
further from the raster; wait for her file rather than guessing twice.

### Question 9 — partially answered 2026-08-20

Amanda has the photos (see below) but **measurements are not yet joined to SKUs**: *"no
Drive junto ao modelo não consta essa informação, lá temos a foto, o código e nome do
modelo."* She's committed to sending a **separate measurements table**. Until it arrives,
`produtos.medidas` stays empty for real (non-`exemplo`) products and `Numeracao` renders
nothing for them — per this file's own rule (§6 table) and `AGENTS.md` §0: "A product with
no measurements renders **no** numeração — not a placeholder." Do not fabricate a
`52□18-145` from a product photo or guess.

**Related, new:** her product photos are **studio light-box shots, already edited, with
the Trísion logo baked into the image** ("Fotos feitas em caixa de estúdio para
acessórios, editadas e com logo"), stored in a shared Drive folder (Amanda asked for a
Gmail address to share it with — action item for Benito, not a spec fact). Flag for
`TASK-normalizar-imagens.md` when that task is written: a baked-in logo watermark may
need to be planned around (crop, or accept it) rather than discovered mid-pipeline.

### Question 11 — new evidence 2026-08-20, still open

Not resolved outright, but question 5's answer weakens the case for a numeric quantity
field: Amanda's own description of how she manages inventory is a **status
workflow** — a model is live, or it's sold out and off, or it's restocked and back on —
not a running count she wants to keep. That is what `produtos.status` already models. If
she confirms `ativo`/`descontinuado` covers it, this question closes without a new field;
if she later says she wants an actual number, that's still a real ask this doesn't answer
by itself. Do not build `quantidade` from this note alone — ask her directly before
closing this question.

