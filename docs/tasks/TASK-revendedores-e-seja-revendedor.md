# TASK — `/revendedores` (the network) and `/seja-revendedor` (the B2B funnel)

## 1. Current scenario

`TASK-frontend-fase-0.md` built every catalogue-driven marca route (`/`, `/colecoes`,
`/catalogo`, `/oculos/[slug]`) and explicitly deferred the editorial cluster: "`/revendedores`,
`/sobre`, `/seja-revendedor`, `/atendimento-exclusivo`. Editorial/static pages, not
catalogue-driven — a separate task, deliberately not bundled with this one (confirmed with the
user)." `spec-design.md` §11 names all four in the marca route table; `TASK-motion-vitrine.md`
and `TASK-alignui-vendoring.md` have both just closed out (this session), so this is the next
unbundled piece.

Two of the four are blocked on Amanda, not on us:

- **`/sobre`** wants "Amanda, 2002, the portrait" — the portrait itself is
  `[VERIFICAR: that this is Amanda herself and that we may use the portrait]`
  (`spec-brand.md` §1.4).
- **`/atendimento-exclusivo`** is `[VERIFICAR: blocked on open question #2]` — the page's own
  content is unknown; it's a Canva page that "could not be read programmatically — ask Amanda
  for a screenshot or for the text" (`spec-brand.md` §1.5).

**`/revendedores` and `/seja-revendedor` are not blocked on anything external** — this task
scopes those two only.

A phasing question came up while scoping this: `spec-architecture.md` §3 lists "the
`/seja-revendedor` funnel" under **Fase 3 — escala**, alongside custom domains per reseller and
reseller self-onboarding automation. `README.md`'s Status section says "Only Fase 3 is left to
negotiate." **Resolved (Benito, 2026-08-18):** the Fase 3 line item is the *automation* —
self-service reseller signup, no human in the loop. The page this task builds is the opposite of
that: static editorial copy ending in the same `wa.me` handoff to Amanda every other page in this
app already uses. It is Fase 0 work by the same logic that makes `/catalogo` Fase 0 — a page,
not a system. `spec-architecture.md` §3 gets a one-line note recording this distinction so it
doesn't read as a contradiction later (§4, affected files).

**A related correction, made while scoping, before any code:** the first framing of this task
assumed `/seja-revendedor` would be AlignUI's first real form (`Input`/`Label`/`Button`). On
closer look that's wrong — Fase 0 has no Payload `leads` collection and no backend to submit
form data to (`AGENTS.md` §0: "No Payload, no database — deliberate"), so a real `<form>` has
nowhere to go. The page ends in a `BotaoWhatsApp` CTA like every other page in this app, not a
form. No AlignUI component is touched by this task.

## 2. Planned changes

### 2.1 `lib/tenant/scope.ts` — one new export, full reseller records

`revendedoresAtivosSlugs()` already exists but returns only slugs (it feeds
`generateStaticParams` for `/loja/[rev]`). `/revendedores` needs the full records (nome, cidade,
uf, sobre, exemplo) to render cards. Adds:

```ts
export async function revendedoresAtivos(): Promise<Revendedor[]> {
  const revendedores = await tenantSource.listarRevendedores();
  return revendedores.filter((r) => r.status === "ativo");
}
```

`revendedoresAtivosSlugs()` is rewritten to call this and `.map(r => r.slug)`, instead of
duplicating the `status === "ativo"` filter a second time. Still the one tenancy-scoping module
(`AGENTS.md` §0) — the new page imports from `@/lib/tenant/scope`, never
`content/revendedores.ts` directly.

### 2.2 `src/app/revendedores/page.tsx` — the network directory

Server Component, same shape as `src/app/colecoes/page.tsx` (`Ceu` + `VisorCursor` +
`Cabecalho`, `Revela secao` heading, staggered `Revela` grid). Each reseller renders through the
existing `RevendedorEndosso` component (`components/revendedor/revendedor-endosso.tsx`) — it
already is the "endorsement, not co-brand" badge `spec-brand.md` §3 requires, wrapped in a
`Link href="/loja/${revendedor.slug}"`, matching the exact linking convention
`components/produto/onde-comprar.tsx` already established (`OndeComprar` → `/loja/${slug}`, the
one other place in this app that links to a storefront). No new card component — reusing
`RevendedorEndosso` for a directory listing is the same "endorsement" idiom, not a new one.

### 2.3 `src/app/seja-revendedor/page.tsx` — the B2B funnel

Static editorial page, no catalogue/tenant data. Copy pulls directly from confirmed brand facts
only — `spec-brand.md` §2.1's own row for what the reseller "wants" and "needs": *to know the
line is worth carrying* / *2002, the network, the terms*:

- Headline naming the 24-year asset (`Desde 2002`, the one superlative-with-a-number this brand
  is allowed, `AGENTS.md` §0).
- A short paragraph on the curated-line positioning (`spec-brand.md` §2, "not the widest
  catalogue — the right one") — no invented commission %, minimum order, or exclusivity terms;
  those are `spec-brand.md` §6 open question 7 (`[VERIFICAR: pricing model, not yet
  confirmed]`), same discipline `docs/tasks/TASK-catalogo-fase-0.md` already applied to
  `marca.whatsapp`.
- One `BotaoWhatsApp` CTA (§2.4) — the page's one primary action, gets `.iridescencia` per
  `spec-design.md` §7.3 (exactly one sweep per page), matching `/oculos/[slug]`'s existing
  pattern (`TASK-motion-vitrine.md` §2.7).
- `Revela secao` on the heading/copy block, same idiom as every other marca route since
  `TASK-motion-vitrine.md` landed — not adding it here would read as a regression, not a
  deliberate omission.

### 2.4 `lib/lead/link.ts` — the wa.me builder, extended to a second message shape

`DadosContatoWhatsapp` today is exactly one shape: a product inquiry (`produtoNome`,
`categoria`, `material`, `cor` all required). `/seja-revendedor`'s CTA has no product — it needs
a free-text `assunto` line instead. Checked every call site first (`grep`, one result:
`src/app/oculos/[slug]/page.tsx`) — safe to change the exported type without touching that
caller. Becomes a discriminated union, still **one function**, so `AGENTS.md`'s "one `wa.me`
builder" rule holds (this is the same function gaining a second input shape, not a second
builder appearing):

```ts
export interface DadosContatoProduto {
  numero: string;
  revendedorNome?: string;
  cidade?: string;
  uf?: string;
  produtoNome: string;
  categoria: CategoriaProduto;
  material: MaterialProduto;
  cor: string;
  medidas?: MedidasProduto;
  codigo?: string;
}

export interface DadosContatoGeral {
  numero: string;
  assunto: string;
}

export type DadosContatoWhatsapp = DadosContatoProduto | DadosContatoGeral;

export function montarLinkWhatsapp(dados: DadosContatoWhatsapp): string | null {
  const numeroLimpo = dados.numero.replace(/\D/g, "");
  if (!numeroLimpo) return null;

  const mensagem = "produtoNome" in dados
    ? /* existing product-message composition, unchanged */
    : `Olá! ${dados.assunto}`;

  return `https://wa.me/${numeroLimpo}?text=${encodeURIComponent(mensagem)}`;
}
```

`BotaoWhatsApp` (`components/produto/botao-whatsapp.tsx`) needs no change — it already just
forwards `dados` to `montarLinkWhatsapp` and renders the same disabled/enabled states either way.
`/seja-revendedor` calls it with
`{ numero: marca.whatsapp, assunto: "Quero saber mais sobre revender a Trísion." }`. Since
`marca.whatsapp` is still `""` (`[VERIFICAR]`, `spec-brand.md` §6 question 6), this CTA renders
the same honest "Consulte o WhatsApp" disabled state every other `BotaoWhatsApp` on the site
renders today — no new blocker, consistent with the rest of the app.

### 2.5 Nav — `components/marca/cabecalho.tsx`

Adds two links after "Coleções": "Revendedores" → `/revendedores`, "Seja revendedor" →
`/seja-revendedor`. Same `data-alvo foco-visor hover:text-luz` treatment as the existing two
links — no new nav pattern.

### 2.6 `src/app/sitemap.ts`

Adds static entries for `/revendedores` and `/seja-revendedor` (real, indexable marca routes —
unlike `/loja/[rev]`, which stays out per the comment already in that file). No `robots.ts`
change needed — its default `allow: "/"` already covers new top-level routes; the existing
`disallow` list is unrelated to this task.

### 2.7 Explicitly out of scope

- **`/sobre`, `/atendimento-exclusivo`.** Blocked on Amanda (§1) — separate task once
  `[VERIFICAR]` resolves.
- **Real city/UF search/filter on `/revendedores`.** `spec-design.md` §11 names "search by
  city/UF," but with exactly one `exemplo` reseller today, a filter UI would be unverifiable
  against real content — same reasoning `TASK-motion-vitrine.md` §2.9 already applied to
  `GaleriaProduto`'s crossfade. Revisit once Fase 1 onboards more than one reseller.
- **`LogoLoop` on `/revendedores`.** `spec-design.md` §7.4 names it as this route's React Bits
  candidate ("the network, marching... uses reseller names as type"), but a marching ticker of
  one name reads as broken, not as proof of a network. React Bits stays fully uninstalled
  (`AGENTS.md` §0) until this page has enough real resellers for the effect to mean something.
- **A real `<form>`, AlignUI `Input`/`Label`/`Button`.** §1 explains the correction: no backend
  to submit to yet (Fase 1's `leads` collection). This page is a `wa.me` handoff, like every
  other page in this app.
- **Reseller self-onboarding, custom per-reseller domains.** `spec-architecture.md` §3's actual
  Fase 3 scope — automation, not this static page. See §1's resolution.
- **Pricing/commission terms on the page.** `[VERIFICAR]`, `spec-brand.md` §6 question 7 — not
  invented here.

## 3. Why

Both routes are named in `spec-design.md` §11, were explicitly deferred (not rejected) by
`TASK-frontend-fase-0.md`, and are the only two of the four deferred editorial pages not blocked
on something only Amanda can supply. Building them now keeps the marca site's route table moving
without inventing facts (pricing, portrait rights) the brand hasn't confirmed, and without
front-loading Fase 3 automation this contract hasn't sold yet (`README.md`: "Only Fase 3 is left
to negotiate").

## 4. Affected files

| File | Change type | Notes |
|---|---|---|
| `src/lib/tenant/scope.ts` | modified | adds `revendedoresAtivos()`; `revendedoresAtivosSlugs()` reuses it (§2.1) |
| `src/app/revendedores/page.tsx` | new | network directory, reuses `RevendedorEndosso` (§2.2) |
| `src/app/seja-revendedor/page.tsx` | new | B2B funnel, static copy + one `BotaoWhatsApp` CTA (§2.3) |
| `src/lib/lead/link.ts` | modified | `DadosContatoWhatsapp` becomes a union (`DadosContatoProduto` \| `DadosContatoGeral`); still one builder function (§2.4) |
| `src/components/marca/cabecalho.tsx` | modified | two new nav links (§2.5) |
| `src/app/sitemap.ts` | modified | adds `/revendedores`, `/seja-revendedor` (§2.6) |
| `docs/spec-architecture.md` | modified | §3 note distinguishing this static page from Fase 3's self-onboarding automation (§1) |
| `README.md` | modified | Status section: two more marca routes live |

## 5. Verification

- `pnpm lint` and `pnpm build` clean.
- `pnpm exec tsx scripts/verificar-fase-0.mts` — both new routes added to `PAGES`; JS transfer
  ≤180 KB gzipped (`spec-design.md` §12) — neither route mounts `motion` (no `FocoVerdadeiro` on
  either), so this should track the CSS-only `Revela` routes' existing ~95 KB figures, not the
  ~183–187 KB `motion`-carrying ones. LCP ≤2.0s, CLS ≤0.05.
- Visual: `/revendedores` renders the one `exemplo` reseller inside a `RevendedorEndosso` card,
  links to `/loja/otica-exemplo`; `/seja-revendedor`'s CTA renders the disabled "Consulte o
  WhatsApp" state (since `marca.whatsapp` is still empty) — not a broken link, not a fabricated
  number.
- `prefers-reduced-motion: reduce` pass on both routes: zero console/page errors, content fully
  visible (same method as `TASK-motion-vitrine.md` §5).
- Keyboard pass: `Tab` reaches both new nav links and the `seja-revendedor` CTA in DOM order, no
  new focus traps.
- Re-run once `marca.whatsapp` is confirmed: `/seja-revendedor`'s CTA produces a real `wa.me`
  link with the exact text "Olá! Quero saber mais sobre revender a Trísion." — not asserted here,
  since the number doesn't exist yet.
