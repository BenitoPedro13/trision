# TASK — Fase 0 catalogue seam (`lib/catalog/` + `content/`)

## 1. Current scenario

The scaffold and `/apresentacao` (`TASK-scaffold-e-apresentacao.md`) are done. `/` is still
the placeholder holding page pointing at `/apresentacao` — it stays that way after this task;
the real homepage is separately blocked on Amanda's photographs and product data
(`spec-brand.md` §6, unresolved).

The Fase 0 stack table in `README.md` lists every row as shipped except **Catalogue**: "TS
modules in `content/` — not yet." That is the one piece of the Fase 0 tech stack that is
still unscaffolded, and it does not depend on Amanda's real data — `spec-architecture.md` §3
is explicit that Fase 0's catalogue is typed TS modules holding whatever data exists
(example, in this case), behind the same interface Payload will later implement.

No `content/` directory and no `src/lib/catalog/` exist yet. Product shape currently lives
only informally, as inline JSX copy in `src/app/apresentacao/page.tsx` (`Modelo A/B/C`,
labelled `exemplo`).

## 2. Planned changes

### 2.1 `src/lib/catalog/types.ts` — the domain types

Mirrors the `produtos` and `colecoes` field lists in `spec-architecture.md` §5.1 / §5.5,
trimmed to what Fase 0 needs (no Payload relationship types, no media-library refs — `fotos`
is a plain array of public asset paths for now):

- `Produto`: `nome`, `sku`, `marca` (default `"Trísion"`), `colecaoSlug`, `categoria`
  (`'solar' | 'grau' | 'clip-on'`), `formato`, `material`, `cor` + `corHex`, `genero`,
  `medidas` (`{ aro: number; ponte: number; haste: number }`, mm — never a formatted
  string, per `AGENTS.md` §0 "a number on this site is a real measurement"), `fotos:
  string[]`, `descricao`, `precoSugerido?: number` (absent ⇒ `Consulte o valor`, never
  defaulted), `status` (`'ativo' | 'descontinuado'`), `exemplo: boolean`.
- `Colecao`: `nome`, `slug`, `ano`, `capa`, `texto`.
- `Marca`: the Fase 0 stand-in for the `config` global (`spec-architecture.md` §5.5) —
  `whatsapp` (E.164, `[VERIFICAR: Amanda's real WhatsApp number, spec-brand.md §6 question
  6]`), `instagram`, `desde` (`2002`).

The `exemplo: boolean` field is new relative to the spec (the real `produtos` collection has
no such field) — it exists only so Fase 0 code can assert at the type level that placeholder
data can never render without a visible "exemplo" label, the same rule already binding on
`/apresentacao` slide 06 (`AGENTS.md` §0).

### 2.2 `src/lib/catalog/source.ts` — the interface

One `interface CatalogSource` with `listarProdutos()`, `buscarProdutoPorSku(sku: string)`,
`listarColecoes()`. This is the Fase 0 → Fase 1 seam named in `spec-architecture.md` §6.1:
`source.local.ts` and the eventual `source.payload.ts` both implement it, and nothing outside
these two files imports a Payload type.

### 2.3 `src/lib/catalog/source.local.ts` — the Fase 0 implementation

Reads synchronously from `src/content/produtos.ts` and `src/content/colecoes.ts`. No I/O, no
async needed yet — kept `async` in signature so `source.payload.ts` can later implement the
same interface without a call-site change.

### 2.4 `src/content/produtos.ts`, `src/content/colecoes.ts`, `src/content/marca.ts`

Placeholder data only, every product `exemplo: true`, reusing the naming already established
on `/apresentacao` (`Modelo A`, `Modelo B`, `Modelo C`) rather than inventing new fictitious
product names. Measurements are plausible real-world mm values (so `Numeracao` renders
correctly when this is eventually wired up) but are not claimed to be real Trísion products.
`marca.ts`'s `whatsapp` field is `[VERIFICAR]`, not a placeholder number — a fake WhatsApp
number is worse than none, per `AGENTS.md` §0.

### 2.5 Explicitly out of scope

- **`source.payload.ts`** — Fase 1, needs Payload + Postgres, not started here.
- **Wiring this into `/`.** The real homepage is still blocked on Amanda's photographs
  and product data; rendering example products on the live homepage would ship something
  that has to be thrown away, exactly what `TASK-scaffold-e-apresentacao.md` §2.8 already
  decided against for the homepage itself.
- **`lib/tenant/scope.ts`** — no tenants exist before Fase 1.
- **`lib/lead/link.ts`** — separate task, needed once there's a CTA to wire it to.
- **Real product data entry.** Everything in `content/` this task adds is `exemplo`.

## 3. Why

This is the one remaining gap in the Fase 0 tech stack that doesn't wait on Amanda. Building
the seam now — instead of when the real homepage finally unblocks — means the homepage task,
whenever it starts, is "write `content/produtos.ts` with real data and a page that calls
`listarProdutos()`," not "invent the catalogue's shape under deadline." It's the same
`source.*.ts` boundary that already paid for itself on F&A Móveis (`spec-architecture.md`
§3, §6.1).

## 4. Affected files

| File | Change type | Notes |
|---|---|---|
| `src/lib/catalog/types.ts` | new | `Produto`, `Colecao`, `Marca` domain types |
| `src/lib/catalog/source.ts` | new | `CatalogSource` interface |
| `src/lib/catalog/source.local.ts` | new | Fase 0 implementation, reads `content/` |
| `src/content/produtos.ts` | new | example products, all `exemplo: true` |
| `src/content/colecoes.ts` | new | example collections |
| `src/content/marca.ts` | new | brand config stand-in, `whatsapp` is `[VERIFICAR]` |
| `README.md` | edit | Catalogue row in the stack table: "not yet" → "seam scaffolded, no real data" |
| `AGENTS.md` | edit | none expected beyond the language rule already added this session |

## 5. Verification

- `pnpm exec tsc --noEmit` passes with the new files included (no `any`, `strict` stays on
  per `tsconfig.json`).
- `pnpm lint` passes.
- `pnpm build` still succeeds and the build output is unchanged (nothing imports the new
  modules yet, so no route output changes).
- Manual check: `source.local.ts`'s `listarProdutos()` returns the example array with every
  entry's `exemplo` field `true`, verified via a scratch `pnpm exec tsx` invocation (not
  committed).
- Grep confirms no file outside `src/lib/catalog/` imports anything from `src/content/`
  directly — everything goes through the seam.
