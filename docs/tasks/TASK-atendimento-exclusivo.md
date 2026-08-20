# TASK — `/atendimento-exclusivo`: build the page from the real Canva content

## 1. Current scenario

`spec-brand.md` §6 question 2 asked what's on Amanda's existing "Atendimento Exclusivo"
Canva page (`sitetrision.my.canva.site/atendimento-exclusivo`) — it was `[VERIFICAR]`
because the page is fully client-rendered and a plain fetch only returns the empty shell.
The user answered the business side of the question 2026-08-20 (she's also an optical
practice, 24 years of in-home visits) and today asked to build the real page, pointing at
that URL for the actual copy.

I loaded the URL in a real browser (`claude-in-chrome`) and read the rendered DOM directly
— confirmed, not fetched blind. Full extracted copy, in order:

- Kicker: **"NÃO É SÓ ÓCULOS. É PRESENÇA."**
- Hero line: "A primeira ótica boutique que leva consultoria de imagem e alta precisão
  técnica até você. Sem filas, sem pressa, no seu tempo."
- **"A Experiência Trísion em 3 Passos"** — three steps (the DOM order interleaves
  headings and bodies; paired by content, not position):
  1. **Análise de Rotina** — "Avaliamos suas necessidades visuais e tecnologias de
     lentes (como multifocais de última geração) para garantir o melhor custo-benefício
     e conforto."
  2. **Visita Técnica e Estética** — "Vamos até você com uma seleção exclusiva de
     armações. Realizamos uma consultoria de imagem para entender seu estilo e desejo
     de imagem."
  3. **Entrega e Suporte Vitalício** — "Você recebe seus óculos e conta com assistência
     técnica e suporte para manutenções sem custo adicional, independentemente do tempo
     de uso."
- **"soluções sob medida para você que:"** — four bullets (Busca Praticidade / Valoriza
  Estética / Exige Precisão / Deseja Segurança), quoted in full in §2 below.
- CTA: **"Agendar minha experiência Trísion"**
- Editorial section, **"Olhar como assinatura"** — brand paragraph (Rio de Janeiro
  founding, "óculos não são apenas funcionais; eles são uma extensão da sua identidade").
- Three testimonials with first + last name (Marleide Uriu, Carmen Ramos, Antônio Gil).
- Footer line: **"Rio de Janeiro e Mato Grosso do Sul"** — the service's two operating
  states, plus `contato@trision.com.br`.
- The page's own "Agendar atendimento" link points at `https://wa.me/2164399579` — **a
  broken WhatsApp link** (missing the country code and mobile-9 prefix; not a usable
  E.164 number). This is a defect on the *old* site, not a fact to port — the new page
  uses `marca.whatsapp` (`+5521980118467`, confirmed 2026-08-20) through the one
  `lib/lead/link.ts` builder, per `spec-architecture.md` §6.3.

There is no `/atendimento-exclusivo` route today. `spec-design.md` §11 already lists it in
the brand-site screens table (previously `[VERIFICAR: blocked on open question #2]`,
updated when that question was answered). The brand nav (`src/components/marca/cabecalho.tsx`
`LINKS`) has five entries and doesn't include it yet.

## 2. Planned changes

- **New route** `src/app/(frontend)/(marca)/atendimento-exclusivo/page.tsx`, following the
  existing static-page pattern (`sobre/page.tsx`, `seja-revendedor/page.tsx`): a `Revela`-
  wrapped `<main>`, `metadataDaPagina()` for metadata, `BotaoWhatsApp` for the CTA.
  Content, ported into Amanda's own copy (already pt-BR, already her voice — not
  translated marketing copy, per `spec-brand.md` §5):
  - Kicker + hero line, as extracted above.
  - The three-step process as a numbered list (Análise de Rotina / Visita Técnica e
    Estética / Entrega e Suporte Vitalício), each with its body copy.
  - The four "para você que" bullets, verbatim:
    - "Busca Praticidade: Não tem tempo a perder e prefere atendimento com hora marcada
      em casa ou no escritório."
    - "Valoriza Estética: Quer óculos que realmente combinem com sua personalidade e
      imagem profissional."
    - "Exige Precisão: Precisa de lentes multifocais complexas e não quer errar na
      adaptação."
    - "Deseja Segurança: Valoriza uma empresa com mais de duas décadas de expertise e
      suporte contínuo."
  - The service area, **"Rio de Janeiro e Mato Grosso do Sul"**, stated plainly — this is
    an in-person visit service, so where it operates is load-bearing content, not
    decoration.
  - `BotaoWhatsApp` with `assunto: "Quero agendar meu Atendimento Exclusivo."`, reusing
    `marca.whatsapp` like every other general-inquiry CTA on the brand site.
  - **Testimonials and the "Olhar como assinatura" editorial paragraph are left out of
    v1**, flagged with the same `[VERIFICAR]` callout pattern `sobre/page.tsx` already
    uses — see §3 for why.
- **`opengraph-image.tsx` + `twitter-image.tsx`** (the latter re-exporting the former, the
  existing pattern), using `gerarOgImage` with the kicker/hero line above — same as every
  other marca route.
- **Nav:** add `{ href: "/atendimento-exclusivo", rotulo: "Atendimento Exclusivo" }` to
  `src/components/marca/cabecalho.tsx`'s `LINKS`, after `/sobre` — `spec-brand.md` called
  this "possibly the single most important page on the new site"; it shouldn't be
  unreachable from the nav.
- **Sitemap:** add the route to `src/app/(frontend)/sitemap.ts` (priority in line with
  `/sobre`/`/seja-revendedor`, `0.6`). No `robots.ts` change needed — it isn't in the
  `disallow` list, unlike `/loja/`.
- **`docs/spec-brand.md`** §1.5's `[VERIFICAR]` note (already partially updated
  2026-08-20) gets the real content folded in properly once the page exists, pointing at
  this task doc instead of the Canva URL.

## 3. Why testimonials and the "Olhar como assinatura" paragraph are out of v1

Two different reasons, not one:

- **The editorial paragraph** ("Fundada no Rio de Janeiro, a Trísion une a precisão da
  engenharia óptica...") restates founding facts already stated more precisely elsewhere
  on the site (`Desde 2002`, `spec-brand.md` §1.5) in looser marketing language. Porting
  it verbatim risks two slightly different "her story" paragraphs living on two pages;
  better to point back to `/sobre` than duplicate.
- **Testimonials** are real client names and quotes, scraped from a live public page — but
  "publicly visible on her existing site" isn't the same bar as "confirmed she wants them
  reused verbatim on the rebuilt one," and `AGENTS.md` §0's rule ("never invent a fact
  about her business") extends to not *repurposing* someone else's stated words without
  asking. Flagged as `[VERIFICAR: ask Amanda whether to port these three testimonials
  as-is]` rather than silently included or silently dropped.

Everything else on the page (the process, the four audience bullets, the service area,
the CTA) is operational description Amanda already wrote for exactly this purpose, so it
carries straight over.

## 4. Explicitly out of scope

- Any reseller-facing local SEO (indexing `/loja/[rev]`, per-reseller `LocalBusiness`
  JSON-LD) — raised in the same user message but a separate, larger decision (current
  `robots.ts`/`indexar: false` deliberately keeps `/loja/**` out of the index because the
  URL shape is a Fase 0 stand-in for subdomains, `spec-architecture.md` §8). Not decided
  or touched here — surfaced to the user separately.
- A booking/calendar integration for "Agendar atendimento" — the old page's own link is
  just a WhatsApp CTA (and a broken one at that); this task matches that shape with a
  working number, not a new booking flow nobody asked for.
- `organizacaoJsonLd()`'s stale `sameAs`/`[VERIFICAR]` comment (now wrong — `marca.ts`'s
  `whatsapp`/`instagram` are filled in) — small, unrelated fix, done separately.

## 5. Affected files

| File | Change type | Notes |
|------|-------------|-------|
| `src/app/(frontend)/(marca)/atendimento-exclusivo/page.tsx` | new | |
| `src/app/(frontend)/(marca)/atendimento-exclusivo/opengraph-image.tsx` | new | |
| `src/app/(frontend)/(marca)/atendimento-exclusivo/twitter-image.tsx` | new | re-exports the above |
| `src/components/marca/cabecalho.tsx` | modified | add nav link |
| `src/app/(frontend)/sitemap.ts` | modified | add route |
| `docs/spec-brand.md` | modified | §1.5 note finalized |
| `docs/spec-design.md` | modified | §11 row already updated; verify it stays accurate |

## 6. Verification

- `pnpm build` succeeds; `/atendimento-exclusivo` renders statically.
- Page appears in `sitemap.xml`, is not in `robots.ts`'s `disallow` list, and
  `metadataDaPagina` defaults it to indexable (no `indexar: false`).
- Nav link present on every marca route, both desktop tabs and the mobile drawer.
- `BotaoWhatsApp` resolves to a real `wa.me` link (non-empty `marca.whatsapp`), not the
  disabled "Consulte o WhatsApp" state.
- No testimonial text or the editorial paragraph appears on the page — confirms the
  explicit exclusion in §3 rather than an oversight.
