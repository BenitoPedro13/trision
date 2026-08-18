# TASK — Storefront product page: `/loja/[rev]/oculos/[slug]`

## 1. Current scenario

`spec-design.md` §11 lists four storefront routes. Three exist
(`TASK-frontend-fase-0.md`, `TASK-loja-identidade-e-busca-revendedores.md`):
`/loja/[rev]` (front), `/loja/[rev]/mostruario` (full showcase),
`/loja/[rev]/a-loja` (shop identity). The fourth — **"Same product page; the CTA is
attributed (`spec-architecture.md` §7)"** — was explicitly deferred twice
(`TASK-frontend-fase-0.md` §4, `TASK-loja-identidade-e-busca-revendedores.md` §2.8),
both times citing the same reason: "needs either more storefront-specific content
or `/ir/` attribution — both real work, not a stub."

Today, every product link rendered inside a storefront (`ProdutoCard`, used by
`GradeProdutos` on both `/loja/[rev]` and `/loja/[rev]/mostruario`) points at the
brand-scoped `/oculos/[slug]` (`src/components/produto/produto-card.tsx:13`). That
page's `BotaoWhatsApp` always sends `marca.whatsapp` with no mention of which shop
the visitor came from (`src/app/oculos/[slug]/page.tsx:64-72`) — a storefront visitor
who taps a frame loses the shop context that got them there, which contradicts
`spec-brand.md` §3 (endorsement) and the "onde comprar" purpose of the whole
storefront tree.

The `/ir/` redirect itself (minted `codigo`, `leads` row, 302) is genuinely Fase 1 —
it needs the Payload `leads` collection (`spec-architecture.md` §7.1, §5.4). That
part stays out of scope here, same as it has been since `TASK-frontend-fase-0.md`.
But `lib/lead/link.ts` already supports attribution *without* `/ir/`: the
`revendedorNome`/`cidade`/`uf` fields on `DadosContatoProduto` produce exactly the
sentence half of §7.3's message ("Vim pela loja da Ótica Silva (Volta Redonda, RJ) e
quero saber sobre o…"), minus the trailing `[codigo]`. Nothing in the codebase
passes those fields today — `/oculos/[slug]/page.tsx` only ever builds
`DadosContatoGeral`-shaped brand data. That gap, not the redirect, is what's
buildable now.

## 2. Planned changes

### 2.1 New route: `src/app/loja/[rev]/oculos/[slug]/page.tsx`

Mirrors `src/app/oculos/[slug]/page.tsx` structurally (`GaleriaProduto`,
`FichaTecnica`, `BotaoWhatsApp`), with three differences:

- **Tenancy-scoped lookup.** Calls `escopoRevendedor(rev)` (already returns
  `{ revendedor, itens }` with `itens[].produto` — `src/lib/tenant/scope.ts:20`),
  then finds the item whose `produto.sku === slug`. `notFound()` if the reseller
  doesn't exist/isn't active, **or** if it exists but doesn't carry that sku. This
  is the tenancy boundary applied to a single product, not just a list — a
  storefront can only ever render a product it actually stocks, matching
  `/loja/[rev]/mostruario`'s "only what this shop carries" (`spec-design.md` §11).
  No new scope function needed; `escopoRevendedor` already has everything.
- **Header is `RevendedorEndosso`, not `Cabecalho`.** Same as `/loja/[rev]` and
  `/loja/[rev]/mostruario` — the storefront never shows the brand nav.
- **`BotaoWhatsApp` gets attribution.** `dados` includes
  `revendedorNome: revendedor.nome`, `cidade: revendedor.cidade`,
  `uf: revendedor.uf`, still `numero: marca.whatsapp` (Fase 0 has no
  `destinoLead` field on `Revendedor` — `spec-architecture.md` §7.2's stated
  default is `marca` until that field exists, which matches current behavior
  everywhere else; not invented here).
- **No `OndeComprar`.** Redundant — the visitor is already at this shop. (The
  brand-scoped `/oculos/[slug]` keeps it, unchanged.)

`generateStaticParams`: for each active reseller (`revendedoresAtivos`), for each
sku in its resolved `itens` — mirrors `mostruario`'s per-reseller params but one
level deeper.

### 2.2 `ProdutoCard` / `GradeProdutos`: parametrize the link target

Add an optional `hrefBase` prop, default `"/oculos"`:

- `ProdutoCard({ produto, hrefBase = "/oculos" })` →
  `<Link href={`${hrefBase}/${produto.sku}`}>`.
- `GradeProdutos({ produtos, hrefBase })` passes it through to each `ProdutoCard`.

`/loja/[rev]/page.tsx` and `/loja/[rev]/mostruario/page.tsx` pass
`hrefBase={`/loja/${revendedor.slug}/oculos`}`. `/catalogo` and `/colecoes/[slug]`
(if it renders `GradeProdutos`/`ProdutoCard`) pass nothing and keep the brand-scoped
default. This is the same "same components, different tenantId" shape
`spec-design.md` §11 and the existing `mostruario`/`GradeProdutos` comments already
commit to — a prop, not a fork.

### 2.3 Alternatives considered

- **Forking `ProdutoCard` into a storefront variant.** Rejected — `spec-design.md`
  §11 is explicit that brand and storefront reuse the same components; a fork here
  is the tenancy-boundary violation the `GradeProdutos` comment already warns
  against.
- **Building `/ir/` now to get real attribution codes.** Rejected — no `leads`
  collection exists (Fase 1, needs Payload + Postgres, `spec-architecture.md` §5.4),
  and BotID gating (§7.4) isn't in place either. Shipping a redirect with no
  storage behind it would be a stub with a URL, exactly what was deferred against
  twice already.
- **Adding a `destinoLead` field to the Fase 0 `Revendedor` mock type.** Rejected —
  it's a Fase 1 concept tied to the `leads` collection's read side; adding it now
  with no consumer is speculative, and the spec's own stated default (`marca`)
  already matches current behavior with zero new field.

## 3. Why

Closes the last gap in `spec-design.md` §11's storefront route table that doesn't
depend on Payload. Every storefront product click today silently drops the shop
attribution that's the entire point of a "revenda oficial" page
(`spec-brand.md` §3) — a visitor who came from Ótica Silva's storefront and taps a
frame currently sends Amanda a message indistinguishable from one that started on
the brand site. `lib/lead/link.ts` was already built to carry that sentence
(`revendedorNome`/`cidade`/`uf`); this task is the first caller that actually
supplies it.

## 4. Affected files

| File | Change type | Notes |
|------|-------------|-------|
| `src/app/loja/[rev]/oculos/[slug]/page.tsx` | new | storefront product page, tenant-scoped via `escopoRevendedor` |
| `src/components/produto/produto-card.tsx` | modified | `hrefBase` prop, default `/oculos` |
| `src/components/produto/grade-produtos.tsx` | modified | pass-through `hrefBase` prop |
| `src/app/loja/[rev]/page.tsx` | modified | pass `hrefBase={/loja/<slug>/oculos}` to `GradeProdutos` |
| `src/app/loja/[rev]/mostruario/page.tsx` | modified | same |
| `README.md` | modified | Status section: fourth storefront route now built |

**Explicitly out of scope:** the `/ir/[rev]/[sku]` redirect, `codigo` minting, the
`leads` collection, BotID gating — all Fase 1, unchanged from prior task docs.
`destinoLead`-based routing to the reseller's own WhatsApp number — still defaults
to `marca` per spec until that field exists. `/sobre` and `/atendimento-exclusivo`
— still blocked on Amanda per `TASK-revendedores-e-seja-revendedor.md` §2.7.

## 5. Verification

- `pnpm build` succeeds (Next 16 App Router static generation for the new
  `generateStaticParams`).
- `pnpm lint` clean.
- For each of the three `exemplo` resellers in `content/revendedores.ts`, every sku
  in its `content/mostruario.ts` rows renders at
  `/loja/<slug>/oculos/<sku>` — spot-checked by reading `generateStaticParams`
  output during build, not asserted from memory.
- A sku **not** in a given reseller's mostruário 404s at that reseller's
  `/loja/<slug>/oculos/<sku>` (tenancy boundary — manually verified against one
  cross-reseller case).
- `montarLinkWhatsapp` output for a storefront product page includes the exact
  sentence shape `Vim pela loja da <nome> (<cidade>, <uf>) e quero saber sobre o…` —
  checked by reading the composed `href` (URL-decoded) for one product, not assumed
  from the function's existing tests (there are none — this is the first caller
  passing `revendedorNome`).
- `/catalogo` and the brand `/oculos/[slug]` pages are visually unchanged (default
  `hrefBase` regression check).
