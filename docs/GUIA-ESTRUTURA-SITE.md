# Guia de Estrutura do Site — Trísion Eyewear

**Para:** Amanda, proprietária da Trísion Eyewear
**Versão:** 1.0 — Fase 1 (Agosto 2026)
**Objetivo:** Explicar como o site é organizado — quais páginas existem, o que cada uma
mostra, e como elas se conectam. Este guia é o mapa; o [`GUIA-ADMIN.md`](GUIA-ADMIN.md)
explica como editar o conteúdo de cada uma dessas páginas.

---

## Sumário

1. [A ideia em uma frase](#a-ideia-em-uma-frase)
2. [O site da marca](#o-site-da-marca)
3. [As lojas dos revendedores](#as-lojas-dos-revendedores)
4. [O painel de administração](#o-painel-de-administração)
5. [Como uma venda chega até você](#como-uma-venda-chega-até-você)
6. [Onde o site "mora" hoje](#onde-o-site-mora-hoje)
7. [O que ainda está pendente](#o-que-ainda-está-pendente)

---

## A ideia em uma frase

**Um catálogo só, várias vitrines, todo contato termina no seu WhatsApp.**

Existem dois tipos de página no site:

- **O site da marca** — fala com quem procura a Trísion diretamente (a marca, a
  história, o catálogo completo).
- **As lojas dos revendedores** — cada óptica parceira tem uma página própria, com a
  cara dela (nome, cidade, foto), mas mostrando o mesmo catálogo da Trísion.

Não existe carrinho de compras nem checkout em nenhuma das duas. Toda página termina
num botão que abre uma conversa de WhatsApp.

---

## O site da marca

Estas são as páginas que qualquer visitante vê ao entrar direto no site (sem passar por
uma loja específica).

| Página | Endereço | O que mostra |
|---|---|---|
| **Home** | `/` | A frase-tese da marca, coleções em destaque, a marca "Desde 2002" |
| **Catálogo** | `/catalogo` | Todos os óculos ativos, com filtros por formato, material, cor e gênero |
| **Coleções** | `/colecoes` | Lista de todas as coleções (ex: "Coleção Verão 2026") |
| **Coleção (detalhe)** | `/colecoes/nome-da-colecao` | Uma coleção específica: capa, texto editorial, produtos dela |
| **Revendedores** | `/revendedores` | Diretório de todas as ópticas parceiras ativas, com filtro por cidade/estado |
| **Seja Revendedor** | `/seja-revendedor` | Página para uma óptica interessada em vender a Trísion entrar em contato |
| **Sobre** | `/sobre` | A história da marca, contada apenas com fatos confirmados |
| **Atendimento Exclusivo** | `/atendimento-exclusivo` | A consultoria em domicílio: os 3 passos do atendimento, para quem é, depoimentos, CTA de agendamento pelo WhatsApp — conteúdo migrado da sua página antiga no Canva |
| **Óculos (detalhe)** | `/oculos/nome-do-modelo` | Um produto específico: fotos, ficha técnica, numeração (`52□18-145`), botão de WhatsApp |
| **Apresentação** | `/apresentacao` | A proposta que te mostramos — não aparece em buscadores, é só para você |

**Como as páginas se conectam:** a Home leva ao Catálogo e às Coleções. O Catálogo e as
Coleções levam a cada Óculos. Cada Óculos tem um botão de WhatsApp e, se você tiver mais
de uma loja cadastrada, uma seção "onde comprar" apontando para os revendedores que
carregam aquele modelo.

---

## As lojas dos revendedores

Cada óptica parceira tem sua própria vitrine, hoje acessível por um endereço no formato
`/loja/nome-da-loja` — por exemplo `/loja/otica-exemplo`.

| Página | Endereço | O que mostra |
|---|---|---|
| **Vitrine da loja** | `/loja/nome-da-loja` | O catálogo completo da Trísion (o mesmo de todas as lojas), com a identidade daquela óptica (nome, foto, cidade) e a linha de endosso ("Revenda oficial Trísion") |
| **A Loja** | `/loja/nome-da-loja/a-loja` | Endereço, horário de funcionamento, contato daquela óptica |
| **Óculos na loja** | `/loja/nome-da-loja/oculos/nome-do-modelo` | O mesmo produto do site da marca, mas o botão de WhatsApp já identifica a loja — para você saber a quem pagar comissão |

**O ponto mais importante:** a vitrine de cada revendedor mostra sempre o catálogo
inteiro e igual — nenhuma loja escolhe um sortimento próprio (decisão de 2026-08-20,
`docs/tasks/TASK-catalogo-unico-sem-mostruario.md`). A loja existe para dizer "essa
venda veio daqui", não para montar um mostruário. Você vende todos os modelos, para
todas as lojas, sempre.

**Nota técnica sobre o endereço:** `/loja/nome-da-loja` é uma solução provisória. O
plano é que, assim que o domínio próprio da Trísion estiver configurado, cada loja tenha
um endereço mais bonito, do tipo `nome-da-loja.trision.com.br`. Isso depende da questão
do domínio ainda em aberto (veja a seção final).

---

## O painel de administração

| Página | Endereço | O que é |
|---|---|---|
| **Painel** | `/admin` | Onde você e os revendedores fazem login para editar dados — produtos, coleções, revendedores, configuração da marca |

Este painel é o assunto do outro guia: **[`GUIA-ADMIN.md`](GUIA-ADMIN.md)** explica passo
a passo como cadastrar um produto, uma coleção, um revendedor, e dar acesso a cada loja.

---

## Como uma venda chega até você

Não importa por qual página o cliente entra, o caminho é sempre o mesmo:

```
Cliente vê um óculos
   (no site da marca OU na loja de um revendedor)
        │
        ▼
Clica no botão "Falar no WhatsApp"
        │
        ▼
Abre uma conversa de WhatsApp com você,
já identificando o modelo — e a loja, se veio de uma vitrine
        │
        ▼
Você atende e fecha a venda diretamente
```

Não existe carrinho, pagamento ou checkout em nenhuma etapa. Essa é uma decisão de
propósito, não uma limitação técnica.

---

## Onde o site "mora" hoje

O endereço atual do site é **`https://trision.vercel.app`**. É provisório — assim que o
domínio próprio da Trísion estiver configurado (veja abaixo), o site passa a viver nele.

---

## O que ainda está pendente

Uma questão segue em aberto e afeta a estrutura descrita acima:

- **Domínio próprio.** Você confirmou que já possui um domínio, mas o endereço exato e o
  acesso ao registro/DNS ainda precisam ser verificados
  (`[VERIFICAR]`, `docs/spec-brand.md` §6, questão 4). Enquanto isso não é resolvido, as
  lojas dos revendedores continuam no formato `/loja/nome-da-loja` em vez do endereço
  final `nome-da-loja.trision.com.br`.

---

## Dúvidas

Qualquer dúvida sobre uma página específica, veja também:
- `docs/spec-brand.md` — quem é a Trísion, voz da marca
- `docs/spec-architecture.md` — como a plataforma funciona por baixo
- `docs/GUIA-ADMIN.md` — como editar o conteúdo de cada página

**Última atualização:** Agosto 2026
