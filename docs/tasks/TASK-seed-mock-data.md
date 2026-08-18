# TASK — Seed Payload from Fase 0 mock data

**Status:** implemented 2026-08-18

## 1. Current scenario

Payload is live at `/admin` with empty collections. The public site still reads
`content/*.ts` when Payload queries fail or return no rows. The same `exemplo`
data already exists in `src/content/{produtos,colecoes,revendedores,mostruario,marca}.ts`
— nothing invented.

## 2. Planned changes

- `scripts/seed-mock-data.mts` — idempotent seed: reads `content/`, writes via Payload
  local API with `overrideAccess: true`. Order: config → colecoes → revendedores →
  produtos → mostruario. `--force` deletes seeded rows first (by known slugs/SKUs).
- `package.json` — `payload:seed` script.
- `README.md` — one-line seed instruction.

## 3. Why

Lets `/` and storefront routes render real Payload data without waiting for Amanda's
catalogue. Same fictional `exemplo` shops/frames as Fase 0 — no new business facts.

## 4. Affected files

| File | Change type | Notes |
|------|-------------|-------|
| `scripts/seed-mock-data.mts` | new | ports `content/` → Payload |
| `package.json` | modified | `payload:seed` |
| `README.md` | modified | seed step |

## 5. Verification

- `pnpm payload:seed` exits 0; second run reports already seeded.
- `/api/produtos` returns 14 active docs (15 total, 1 descontinuado); `/api/revendedores` returns 9 (8 ativos).
- 4 coleções, 29 mostruario rows seeded from expanded `content/`.

**Out of scope:** media uploads (no real photos), `mostruario.preco`, invented prices.
