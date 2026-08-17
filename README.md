# Trísion Eyewear

Site da marca + plataforma de vitrines para revendedores.
**Trísion Eyewear, desde 2002.** Uma vitrine para cada revendedor, um catálogo só.

## Onde está a especificação

| Doc | O que é |
|---|---|
| `docs/spec-brand.md` | A marca: auditoria do que já existe, posicionamento, voz, e as 10 perguntas em aberto (§6) |
| `docs/spec-design.md` | O sistema visual: tokens medidos, o visor, a numeração, tipografia, motion |
| `docs/spec-architecture.md` | A plataforma: multi-tenant, modelo de dados, atribuição de lead, fases |
| `docs/identidade.html` | Board interno de identidade (não é material de cliente) |
| `docs/tasks/` | Task docs — nenhum código antes de um deles (`CLAUDE.md` §1) |

## Status (2026-08-17)

**Fase 0, em andamento.** Next.js 16.3.1 scaffoldado, tokens do `spec-design.md` §4.1
aplicados, e a **página de apresentação para a Amanda** está pronta em `/apresentacao`
(`TASK-scaffold-e-apresentacao.md`).

Sem Payload, sem banco — decisão de escopo: Payload entra na Fase 1
(`spec-architecture.md` §3).

**Três perguntas travam todo o resto** (`spec-brand.md` §6): o domínio, o modelo de preço,
e para quem aponta o botão de WhatsApp. Estão nos slides 14–15 da apresentação, marcadas.

## Rodar

```sh
pnpm install
pnpm dev          # http://localhost:3000  →  /apresentacao
pnpm build && pnpm start
pnpm lint
```

## Rotas

| Rota | O que é |
|---|---|
| `/` | Página de espera. A home de verdade é Fase 0 e depende das fotos e dos dados da Amanda |
| `/apresentacao` | A proposta para a Amanda — 16 seções, pt-BR, `noindex` |

## Componentes da marca

| Arquivo | O que faz |
|---|---|
| `src/components/visor.tsx` | Os quatro colchetes. O único ornamento do sistema |
| `src/components/numeracao.tsx` | `52□18-145` a partir de três números em mm; o `□` é SVG |
| `src/components/marca.tsx` | Símbolo + lockup. **Redesenho aproximado** — depende do vetor original |
| `src/components/ceu.tsx` | O céu estrelado dela, em canvas. Estático sob `prefers-reduced-motion` |

## Deploy

Estático. `pnpm build` gera as três rotas pré-renderizadas — dá pra subir na Vercel
direto do repo, sem variável de ambiente nenhuma nesta fase.
