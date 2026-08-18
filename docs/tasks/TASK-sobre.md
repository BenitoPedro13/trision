# TASK — `/sobre`, honest-partial

## 1. Current scenario

`spec-design.md` §11 lists `/sobre` on the brand site: "Amanda, 2002, the portrait." Every
other route in that table now exists (`README.md` Status, 2026-08-18) except this one and
`/atendimento-exclusivo`.

Both are blocked on facts only Amanda can give (`spec-brand.md` §6 questions 2 and 3), but
they're blocked differently:

- **`/atendimento-exclusivo`** — question 2 says this "possibly [is] a whole route; it is a
  named service we cannot see." We don't know if the page should exist, let alone what's on
  it. Nothing to build. **Stays out of scope for this task.**
- **`/sobre`** — we don't have Amanda's full name, her own account of her story, or
  confirmation the portrait described in `spec-brand.md` §1.4 is usable (`[VERIFICAR]` on
  all three). But we *do* have confirmed, checkable facts: `Desde 2002` (`content/marca.ts`),
  the positioning language already written and approved into the spec itself
  (`spec-brand.md` §2 — "24 years," "considered selection," "an optician's eye, not a
  boutique's pose"), and her own words (`Eyewear Addict ❤`, `spec-brand.md` §1.5, kept in
  English per that table). None of that is invented — it's already in the spec as
  confirmed brand fact, not drafted bio copy.

This task builds `/sobre` the same way `GaleriaProduto` handles a product with `fotos: []`
(`components/produto/galeria-produto.tsx`): render what's real, and render the honest
absence of what isn't — a labelled `[VERIFICAR]` panel where the portrait and her personal
account go — instead of inventing either.

## 2. Planned changes

### 2.1 `src/app/sobre/page.tsx` — new

Structure, following `seja-revendedor/page.tsx`'s pattern (`Ceu` + `VisorCursor` +
`Cabecalho` + `Revela` sections, `max-w-[52ch]` reading column):

1. **Kicker + h1** — `Desde {marca.desde}` kicker (confirmed), `Sobre` h1.
2. **Positioning paragraph** — drawn verbatim-in-substance from `spec-brand.md` §2's
   confirmed table, not drafted: 24 years, considered selection over widest catalogue, an
   optician's eye. No sentence in this paragraph says anything not already written into the
   spec as fact.
3. **`Eyewear Addict ❤`** — her own line (`spec-brand.md` §1.5), set as a standalone mark
   near the portrait block, English kept as the source table specifies.
4. **Portrait block — the `[VERIFICAR]` panel.** A `--lente` panel matching
   `GaleriaProduto`'s empty-state visual language (same token, same radius) but with copy
   specific to this gap, not the product "sem foto" string: names exactly what's missing
   (her name, her story in her words, confirmation the described portrait is usable) and who
   answers it (Amanda) — same shape as every other `[VERIFICAR]` in this codebase, just
   rendered on-page instead of left in a comment, because this page cannot honestly claim
   completeness without surfacing the gap. Not indexed as a finished bio (see 2.2).
5. **CTA** — `BotaoWhatsApp`, same component and disabled-when-empty behavior as every other
   page (`marca.whatsapp` is still `""`).

No new components. No new library code — this is copy-and-layout only, same tier as
`seja-revendedor/page.tsx`.

### 2.2 `robots.ts` / `sitemap.ts`

- **`sitemap.ts`**: add `/sobre` at the same priority tier as `/seja-revendedor` (0.6) — it's
  a real, permanent brand-site route, not a Fase-0 stand-in like `/loja/`.
  `[VERIFICAR]` panel notwithstanding, the page is genuinely publishable content (confirmed
  facts + an honest gap marker), not a draft — same logic that already lets `/revendedores`
  and `/seja-revendedor` be indexed today with a mock reseller / no confirmed WhatsApp
  number.
- **`robots.ts`**: no change — `/sobre` isn't blocked from crawling the way `/apresentacao`
  (private pitch) or `/loja/` (about to be deleted, §2.4 of `TASK-frontend-fase-0.md`) are.

### 2.3 `Cabecalho`

Originally left unchanged here — `spec-design.md` §11 lists `/sobre` alongside
`/revendedores` and `/seja-revendedor`, and at the time neither of those was in the header
nav either, so singling `/sobre` out felt arbitrary; adding all three was deferred as "a
separate, nameable task if wanted." **Reversed in `TASK-footer.md`**: `/sobre` was added to
`Rodape`'s nav list there, and then — after user feedback ("no Sobre on mobile menu") made
it clear `Cabecalho`'s drawer is the *only* nav on mobile, where the desktop row is hidden
entirely — to `Cabecalho`'s own `LINKS` too. Recorded here so this section doesn't read as
still-current.

## 3. Why

The user asked to finish the remaining frontend routes. Of the two left on the spec's screen
table, one (`/atendimento-exclusivo`) has no knowable content — building anything there
would be inventing the existence of a service, not just its copy, so it's excluded outright.
`/sobre` is different: enough of it is already confirmed fact (not draft copy — spec-level
fact, `spec-brand.md` §2 and §1.5) that shipping the page with an honest, explicit
`[VERIFICAR]` gap for the rest is consistent with how this codebase already treats every
other missing fact (empty galleries, disabled WhatsApp buttons, `Consulte o valor`) — it
does not violate "never invent a fact," because nothing on the page is invented.

Alternative considered and rejected: leave `/sobre` unbuilt entirely until Amanda answers.
Rejected because the page doesn't need her answers to exist truthfully — it needs them to be
*complete*, and the codebase's established pattern is to ship the honest-incomplete version
and mark the gap, not withhold the whole page.

## 4. Affected files

| File | Change type | Notes |
|---|---|---|
| `src/app/sobre/page.tsx` | new | positioning copy (confirmed facts only) + `[VERIFICAR]` portrait/bio panel + `BotaoWhatsApp` |
| `src/app/sitemap.ts` | edit | add `/sobre`, priority 0.6 |
| `README.md` | edit | Status section, routes |
| `docs/spec-design.md` | edit if needed | none expected — `/sobre`'s row in §11 already describes this scope; update only if the built page diverges |

**Out of scope:** `/atendimento-exclusivo` (no knowable content, §1); adding `/sobre` to
`Cabecalho` nav (§2.3); any bio copy attributed to Amanda in first person — the `[VERIFICAR]`
panel stays third-person/meta, never simulates her voice with invented content.

## 5. Verification

- `pnpm exec tsc --noEmit` passes.
- `pnpm lint` passes.
- `pnpm build` succeeds; `/sobre` appears in the route output.
- Manual via `pnpm dev`: `/sobre` renders the kicker, positioning paragraph, `Eyewear Addict
  ❤`, the `[VERIFICAR]` panel with visible copy (not just a code comment), and a disabled
  `BotaoWhatsApp` (empty `marca.whatsapp`) exactly like every other page.
- Grep confirms no string on the page states Amanda's full name, city, or any biographical
  claim not already present in `spec-brand.md`.
- Keyboard pass: the CTA shows `.foco-visor` on Tab, matching every other page's convention.
