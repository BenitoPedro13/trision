# Guia de Administração — Trísion Eyewear

**Para:** Amanda, proprietária da Trísion Eyewear  
**Versão:** 1.0 — Fase 1 (Agosto 2026)  
**Objetivo:** Ensinar como usar e configurar cada aspecto do painel de administração Payload

---

## Sumário

1. [Acesso inicial](#acesso-inicial)
2. [Entender o painel](#entender-o-painel)
3. [Gerenciar produtos](#gerenciar-produtos)
4. [Gerenciar coleções](#gerenciar-coleções)
5. [Gerenciar revendedores](#gerenciar-revendedores)
6. [Gerenciar mostruário (inventário por loja)](#gerenciar-mostruário)
7. [Configuração global da marca](#configuração-global-da-marca)
8. [Ensinar revendedores a escolher seus produtos](#ensinar-revendedores)
9. [Dúvidas e solução de problemas](#dúvidas-e-solução-de-problemas)

---

## Acesso Inicial

### Primeiro acesso (primeira vez apenas)

1. Abra seu navegador e vá para: `https://seu-site.vercel.app/admin`
   - Substitua `seu-site` pelo endereço real quando a Trísion tiver seu próprio domínio
   - Por enquanto: `https://trision.vercel.app/admin`

2. Na primeira vez, você verá uma tela para **criar o primeiro usuário administrador**
   - **Email:** Use seu email pessoal (exemplo: `amanda@trision.com.br`)
   - **Senha:** Crie uma senha forte (use um gerenciador de senhas!)
   - Clique em **"Create Admin"**

3. Você será redirecionado para o painel principal

### Acessos futuros

1. Vá para `/admin`
2. Digite seu email e senha
3. Clique em **"Login"**

---

## Entender o Painel

### O que você vê

Quando entra no painel, vê uma barra lateral esquerda com várias abas:

```
📦 Productos
📚 Colecoes
🏪 Revendedores
📋 Mostruario
👥 Usuarios
⚙️  Config
🖼️  Media (Imagens)
```

Cada aba é uma coleção — um tipo de dado que você gerencia.

### Barra superior

- **Seu nome/email** (canto superior direito) — clique para sair
- **Versão Payload** — informação técnica (ignore)

### Cada página de coleção

Todas seguem o mesmo padrão:

```
┌─────────────────────────────────────────┐
│ TITULO DA COLECAO                       │
│ [+ Add New] [Filter] [Sort] [Search]    │
├─────────────────────────────────────────┤
│ Item 1    │ Status │ Data      │ [Edit] │
│ Item 2    │ Status │ Data      │ [Edit] │
│ Item 3    │ Status │ Data      │ [Edit] │
└─────────────────────────────────────────┘
```

---

## Gerenciar Produtos

### O que é a coleção "Productos"

Aqui você cadastra todos os óculos que a Trísion oferece. É o **catálogo centralizado** — um produto existe aqui uma vez, e vários revendedores podem carregar o mesmo produto em suas lojas.

### Ver todos os produtos

1. Na barra lateral, clique em **"Productos"**
2. Você vê uma lista de todos os óculos cadastrados

### Adicionar um novo produto

1. Clique no botão **"+ Add New"** (verde, no canto superior)
2. Preencha os campos:

#### Campos obrigatórios

| Campo | O que é | Exemplo |
|-------|---------|---------|
| **SKU** | Código único do produto | `TRI-MOD-A` |
| **Nome** | Nome do modelo | `Modelo Apollo` |
| **Descrição** | Uma ou duas frases sobre o produto | `Modelo clássico com ponte fina e haste tradicional` |
| **Formato** | Escolha entre as opções: Redondo, Quadrado, Retangular, Gatinho | Redondo |
| **Material** | Escolha entre: Acetato, Metal, Titânio, Misto | Acetato |
| **Cor do Aro** | A cor principal do moldura | Preto |
| **Cor da Lente** | Escolha entre: Transparente, Cinza, Marrom, Verde, Azul | Transparente |

#### Campos com medidas

Na seção **"Medidas"**, preencha em **milímetros** (mm):

| Campo | Significado | Intervalo normal |
|-------|-------------|------------------|
| **Largura do aro** | De uma extremidade à outra | 130–150 mm |
| **Ponte** | A parte que fica no nariz | 14–24 mm |
| **Haste** | Cada um dos "braços" dos óculos | 130–150 mm |

**Exemplo:** Um óculos com as medidas `52-18-140` quer dizer:
- Aro: 52 mm
- Ponte: 18 mm
- Haste: 140 mm

Ele será exibido no site como **52□18-140** (o quadradinho é a separação visual).

#### Campos opcionais

- **Preço sugerido:** O valor que você recomenda às lojas (deixe em branco por enquanto — isso ainda está sendo decidido)
- **Foto:** Faça upload de uma foto do produto
  - Clique em **"Upload"** na seção **"Capa"**
  - Escolha uma imagem do seu computador (JPG ou PNG)
  - Tamanho recomendado: 800×800 pixels

#### Coleções

Você pode associar este produto a uma ou mais **Coleções**. Coleções são grupos temáticos (exemplo: "Coleção Verão 2026").

- Marque as coleções que este produto pertence
- Se nenhuma aplicar, deixe em branco (pode adicionar depois)

### Salvar o produto

1. Clique em **"Save"** (botão azul, no topo ou rodapé)
2. Se tudo estiver preenchido corretamente, você vê a mensagem: ✓ **Saved successfully**
3. Você será redirecionado para o produto criado

### Editar um produto existente

1. Na lista de **Productos**, clique no produto que quer editar
2. Faça as mudanças que desejar
3. Clique em **"Save"**

### Remover um produto

⚠️ **Cuidado:** Remover um produto que revendedores já têm em suas lojas vai quebrá-las.

1. Abra o produto
2. Procure pelo botão **"Delete"** (vermelho) no topo
3. Confirme a exclusão

**Melhor que deletar:** Desativar o produto (se essa opção existir) ou criar uma versão nova com um SKU diferente.

---

## Gerenciar Coleções

### O que é a coleção "Colecoes"

Coleções são **grupos temáticos de produtos** — como "Coleção Primavera 2026" ou "Acetatos Vintage". Cada coleção tem uma foto de capa, um ano, e uma descrição editada.

### Ver todas as coleções

1. Na barra lateral, clique em **"Colecoes"**
2. Você vê a lista

### Adicionar uma nova coleção

1. Clique em **"+ Add New"**
2. Preencha:

| Campo | O que é | Exemplo |
|-------|---------|---------|
| **Nome** | O nome público da coleção | `Coleção Verão 2026` |
| **Slug** | A URL amigável (sem espaços, sem acentos) | `colecao-verao-2026` |
| **Ano** | O ano da coleção | `2026` |
| **Capa** | Foto da coleção | Upload uma imagem |
| **Texto** | Descrição editorial (pode ter vários parágrafos) | Sua história da coleção em português |

**Sobre o Slug:**
- Não use espaços, acentos ou caracteres especiais
- Use hífen (-) para separar palavras
- Exemplo ruim: `Coleção Verão 2026`
- Exemplo bom: `colecao-verao-2026`

3. Clique em **"Save"**

### Associar produtos a uma coleção

Você pode fazer isso de duas formas:

**Opção A: Da coleção para o produto**
1. Abra a coleção
2. Na seção **"Productos"**, clique em **"Add"**
3. Escolha os produtos que pertencem a esta coleção
4. Clique em **"Save"**

**Opção B: Do produto para a coleção**
1. Abra o produto (em **Productos**)
2. Na seção **"Colecoes"**, marque esta coleção
3. Clique em **"Save"**

---

## Gerenciar Revendedores

### O que é a coleção "Revendedores"

Cada **revendedor** é uma loja óptica independente que vende óculos Trísion. Aqui você cadastra:
- Nome e dados de contato
- Localização (cidade, estado)
- Foto do revendedor (retrato do proprietário)
- Status (ativo ou inativo)

### Ver todos os revendedores

1. Na barra lateral, clique em **"Revendedores"**
2. Você vê a lista de todas as lojas

### Adicionar um novo revendedor

1. Clique em **"+ Add New"**
2. Preencha os campos:

#### Informações básicas

| Campo | O que é | Quem pode editar | Exemplo |
|-------|---------|------------------|---------|
| **Nome** | Nome da loja óptica | Admin (você) | `Ótica Exemplo` |
| **Slug** | URL amigável (sem espaços, sem acentos) | Admin | `otica-exemplo` |
| **Cidade** | Cidade onde a loja fica | Admin | `Petrópolis` |
| **UF** | Estado (sigla) | Admin | `RJ` |
| **Status** | Ativo ou Inativo | Admin | Ativo |
| **Destino do Lead** | Para onde vão os pedidos de contato | Admin | `amanda@trision.com.br` |

#### Informações de contato (revendedor pode editar depois)

| Campo | O que é | Exemplo |
|-------|---------|---------|
| **WhatsApp** | Número da loja com DDD | `(24) 99999-9999` |
| **Instagram** | @ do Instagram | `@oticaexemplo` |
| **Endereço** | Rua, número, complemento | `Rua A, 123, Centro` |
| **Horários** | Quando a loja abre/fecha | `Seg–Sex 09h–18h, Sáb 09h–13h` |
| **Sobre a loja** | Uma ou duas frases (história, especialidade) | `Óptica de confiança desde 1990` |

#### Foto

- **Retrato:** Upload de uma foto do revendedor (ou da loja, se preferi)
  - Tamanho sugerido: 400×400 pixels
  - Formato: JPG ou PNG

### Campos que você (admin) controla

❌ **Revendedores NÃO podem editar:**
- Nome da loja
- Slug (URL)
- Cidade e estado
- Status (ativo/inativo)
- Destino do lead

✅ **Revendedores PODEM editar:**
- WhatsApp
- Instagram
- Endereço
- Horários
- Foto
- Sobre a loja

Isso protege a integridade dos dados que você controla.

### Editar um revendedor

1. Na lista, clique no revendedor
2. Faça as mudanças
3. Clique em **"Save"**

---

## Gerenciar Mostruário

### O que é "Mostruario" (Inventário por loja)

O mostruário é o **link entre um revendedor e os produtos que ele vende**.

**Exemplo:**
- A Trísion tem 50 produtos no catálogo
- Mas a "Ótica Exemplo" só vende 15 desses 50
- Você cria 15 linhas no mostruário da "Ótica Exemplo", dizendo: "Este revendedor tem estes produtos"

Quando alguém visita a loja da "Ótica Exemplo" online, vê apenas os 15 produtos que ela realmente tem.

### Ver o mostruário de um revendedor

**Opção 1: Direto no painel**
1. Clique em **"Mostruario"** na barra lateral
2. Você vê todas as linhas de todos os revendedores
3. Use a barra de **busca/filtro** para encontrar um revendedor específico

**Opção 2: De dentro do revendedor**
1. Vá em **"Revendedores"**
2. Abra o revendedor
3. Procure pela seção **"Mostruario"** (lista de produtos)

### Adicionar produtos ao mostruário de um revendedor

#### Método 1: Do painel Mostruario

1. Clique em **"+ Add New"** no painel Mostruario
2. Preencha:

| Campo | O que é | Como preencher |
|-------|---------|----------------|
| **Revendedor** | Qual loja este produto pertence | Escolha da lista suspensa |
| **Produto** | Qual produto da Trísion | Escolha da lista suspensa |
| **Disponível** | Está em estoque? | Sim/Não (padrão: Sim) |
| **Destaque** | Mostrar em primeiro lugar? | Sim/Não (padrão: Não) |
| **Observação** | Notas extras (opcional) | Ex: "Sob encomenda em 5 dias" |

3. **Ordem:** Se quiser que produtos apareçam em ordem específica, use o campo **"Ordem"** (número)
4. Clique em **"Save"**

#### Método 2: De dentro do revendedor (mais fácil para muitos produtos)

1. Vá em **"Revendedores"**
2. Abra o revendedor que quer atualizar
3. Procure pela seção **"Mostruario"** (provavelmente no final da página)
4. Clique em **"Add"** ou **"+ Add New Product"**
5. Escolha os produtos da lista
6. Preencha **Disponível**, **Destaque**, **Observação**
7. Clique em **"Save"**

### Editar o mostruário

1. Na lista do **Mostruario**, clique no item que quer editar
2. Faça as mudanças (produto, disponibilidade, ordem, etc.)
3. Clique em **"Save"**

### Remover um produto do mostruário

1. Abra o item no **Mostruario**
2. Clique em **"Delete"** (vermelho)
3. Confirme

O produto **não é apagado** do catálogo, só desaparece da loja daquele revendedor.

### Entender "Destaque" e "Disponível"

**Disponível:**
- ✅ **Sim** = A loja tem este produto em estoque agora
- ❌ **Não** = A loja não tem (pode estar sob encomenda)

**Destaque:**
- ✅ **Sim** = Mostra este produto primeiro na loja (tipo "bestseller")
- ❌ **Não** = Ordem normal

Exemplo de uso:
- Um óculos muito vendido? Marque como **Destaque: Sim**
- Um óculos fora de estoque mas ainda oferecido? Marque **Disponível: Não**

---

## Configuração Global da Marca

### O que é "Config"

A configuração global controla informações que aparecem em toda a marca:
- Número de WhatsApp da Trísion
- Links de redes sociais
- Dados do rodapé
- Texto "Desde 2002"
- Conteúdo do hero da home

### Acessar a configuração

1. Na barra lateral, clique em **"Config"**
2. Você vê uma página (não é uma lista — é um único documento global)

### Campos disponíveis

| Campo | O que é | Exemplo |
|-------|---------|---------|
| **WhatsApp Marca** | Seu número para contato | `+55 24 99999-9999` |
| **Instagram** | @ da Trísion | `@trisioneyewear` |
| **Email** | Email de contato | `contato@trision.com.br` |
| **Ano de Fundação** | Para a frase "Desde 2002" | `2002` |
| **Texto do Footer** | Descrição da marca no rodapé | "Trísion Eyewear. Desde 2002, uma abordagem obsessiva pela qualidade dos óculos." |
| **Hero Home Título** | Título grande da home | `Uma moldura é uma decisão sobre o que você olha` |
| **Hero Home Subtítulo** | Descrição sob o título | `Escolhida por quem é genuinamente obsessivo` |

### Editar a configuração

1. Abra o painel **"Config"**
2. Faça as mudanças
3. Clique em **"Save"**

Tudo que você muda aqui aparece no site automaticamente.

---

## Ensinar Revendedores

### O contexto

Cada revendedor tem uma **conta separada** com acesso limitado:
- ✅ Pode **editar seus próprios dados** (telefone, endereço, foto, horas)
- ✅ Pode **gerenciar seu próprio mostruário** (quais produtos tem)
- ❌ Não pode **criar produtos** (produtos ficam sob seu controle)
- ❌ Não pode **ver dados de outros revendedores**

### Criar uma conta para um revendedor

1. Vá em **"Usuarios"** na barra lateral
2. Clique em **"+ Add New User"**
3. Preencha:

| Campo | O que é | Exemplo |
|-------|---------|---------|
| **Email** | Email do revendedor | `gerente@oticaexemplo.com.br` |
| **Senha** | Senha temporária (ele pode mudar depois) | Uma senha forte |
| **Função** | Tipo de acesso | Escolha **"Revendedor"** (não Admin) |
| **Revendedor** | Qual loja ele gerencia | Escolha a loja dele da lista |

4. Clique em **"Save"**

### Compartilhar o acesso com o revendedor

Mande uma mensagem de WhatsApp ou email com:

```
Olá [Nome do Revendedor],

Sua conta no painel Trísion foi criada! 🎉

Acesse em: https://trision.vercel.app/admin
Email: [seu email]
Senha: [senha temporária]

No painel, você pode:
✓ Atualizar seu endereço e horários
✓ Escolher quais óculos da Trísion você tem em estoque
✓ Adicionar foto da sua loja
✓ Gerenciar informações de contato

Após o primeiro acesso, você pode trocar sua senha em Perfil.

Qualquer dúvida, manda uma mensagem!

Abraços,
Amanda — Trísion
```

### Guiar um revendedor: Adicionar seus produtos

**Cenário:** A "Ótica Exemplo" quer adicionar seus produtos no site.

#### Passo 1: Você prepara a loja (admin)

1. Vá em **"Revendedores"**
2. Abra a "Ótica Exemplo"
3. Na seção **"Mostruario"**, clique em **"Add"**
4. Escolha todos os produtos que essa loja oferece (você sabe qual loja tem o quê)
5. Clique em **"Save"**

Pronto! Os produtos estão ali. Agora o revendedor pode gerenciar.

#### Passo 2: O revendedor faz login e edita

O revendedor faz login em `/admin` com suas credenciais. Ele vê:
- Seu nome e dados de contato
- Uma lista dos seus produtos

O revendedor pode:
- **Marcar "Disponível: Não"** se um óculos está fora de estoque
- **Marcar "Destaque: Sim"** se quer destacar um produto
- **Mudar a ordem** para reorganizar como aparecem
- **Adicionar observação** (ex: "Sob encomenda em 5 dias")

#### Passo 3: Você monitora

De vez em quando, você entra no painel e verifica:
- Os revendedores estão atualizando seus dados?
- Os mostruários estão precisos (disponibilidade, destaque)?

---

## Media (Gerenciar Fotos)

### O que é "Media"

Aqui você vê **todas as fotos** que foram enviadas para o site — fotos de produtos, coleções, revendedores.

Você não precisa fazer nada aqui normalmente. Payload gerencia automaticamente. Mas é útil para:
- Ver todas as imagens
- Deletar uma foto antiga se necessário
- Verificar nomes de arquivos

---

## Usuarios (Gerenciar Contas)

### O que é "Usuarios"

Aqui você gerencia quem pode acessar o painel:
- **Admin** = Você (Amanda). Acesso total.
- **Revendedor** = Cada loja. Acesso limitado aos seus dados.

### Ver todas as contas

1. Clique em **"Usuarios"**
2. Você vê a lista de todos com acesso

### Remover acesso de um revendedor

Se um revendedor parar de trabalhar com você:

1. Abra o usuário dele em **"Usuarios"**
2. Procure por um botão **"Delete"** (vermelho)
3. Confirme

Ele não conseguirá mais fazer login.

---

## Dúvidas e Solução de Problemas

### "Esqueci minha senha"

Infelizmente, ainda não há um botão de "Recuperar senha" automático. **Entre em contato com o suporte técnico** (seu desenvolvedor) para resetar.

### "Um revendedor não consegue fazer login"

Verifique:
1. O email está escrito corretamente em **"Usuarios"**?
2. A **função** dele está marcada como **"Revendedor"**?
3. O **revendedor** (loja) foi atribuído a ele?

Se tudo está correto, peça que ele:
- Limpe o cache do navegador (Ctrl+Shift+Delete)
- Tente em outro navegador
- Tente em modo anônimo

Ainda não funciona? **Contacte o suporte.**

### "Um produto desapareceu da loja de um revendedor"

Pode ser:
1. Você deletou o produto? Ele desaparece de todas as lojas.
2. Você desabilitou o revendedor (Status: Inativo)? Seus produtos desaparecem.
3. Você removeu o produto do mostruário dele? Procure em **"Mostruario"**.

**Solução:** Adicione o produto de volta ao mostruário.

### "Não consigo fazer upload de uma foto"

Verifique:
1. O arquivo é JPG, PNG ou GIF?
2. A imagem é menor que 10 MB?
3. O navegador está carregando ainda (aguarde)?

Se persiste, tente:
- Outro navegador
- Dimensionar a imagem para algo menor (800×800 pixels)
- Contacte o suporte

### "Onde vejo como fica no site?"

O site está ao vivo em: `https://trision.vercel.app`

Mudanças que você faz no painel aparecem no site automaticamente em alguns segundos.

**Dicas:**
- Atualize a página do site (Ctrl+R)
- Limpe o cache (Ctrl+Shift+Delete)
- Veja em modo anônimo para ter certeza

### "Um revendedor mudou de telefone. Como atualizar?"

1. Vá em **"Revendedores"**
2. Abra a loja
3. Edite o campo **"WhatsApp"**
4. Clique em **"Save"**

Alternativamente, o **próprio revendedor** pode fazer isso fazendo login no painel dele.

### "Quero deletar um produto da Trísion"

⚠️ **Cuidado extremo.** Se você deletar um produto:
- Desaparece de **todas** as lojas
- Pedidos e histórico se perdem
- É irreversível

**Melhor opção:** Não deletar. Apenas criar um novo produto com versão atualizada (SKU diferente).

Se realmente precisa deletar:
1. Vá em **"Productos"**
2. Abra o produto
3. Clique em **"Delete"** (vermelho, topo)
4. Digite uma confirmação
5. Pronto (não há volta!)

### "Quantos revendedores posso cadastrar?"

Ilimitado. Pode cadastrar quantas lojas precisar.

### "Posso editar um produto que um revendedor já tem?"

Sim! Mudanças que você faz em um produto aparecem em **todas** as lojas que têm esse produto.

Exemplo:
- Você corrige a descrição de um óculos
- Todas as 10 lojas que vendem veem a descrição nova
- Perfeito para manter tudo sincronizado

---

## Checklist de Boas Práticas

Ao trabalhar no painel, mantenha:

- ✅ **SKUs únicos** — cada produto tem um código diferente (TRI-MOD-A, TRI-MOD-B, etc.)
- ✅ **Medidas em milímetros** — sempre mm, nunca "grande" ou "pequeno"
- ✅ **Dados precisos** — se não sabe uma informação, deixe em branco ou marque como `[VERIFICAR]`
- ✅ **Fotos de boa qualidade** — óculos fotografado de frente, com boa iluminação
- ✅ **Descrições honestas** — se um óculos é simples, descreva como simples, não invente características
- ✅ **Slug amigável** — nomes de URL sem espaços, sem acentos
- ✅ **Revendedores atualizados** — verifique de tempos em tempos se endereços e horários estão corretos

---

## Próximos Passos

### Quando a marca cresce

Algumas funcionalidades podem ser adicionadas no futuro:
- **Dashboard:** Ver quantas lojas vendem, quais produtos são mais populares
- **Recuperação automática de senha:** Revendedores conseguem resetar sozinhos
- **Importar dados em lote:** Upload de Excel com vários produtos/lojas de uma vez
- **Análise de leads:** Saber quais lojas recebem mais contatos

Converse com seu desenvolvedor se precisar de algo novo.

---

## Suporte

Qualquer dúvida:
- Releia este guia (use Ctrl+F para buscar palavras-chave)
- Procure na seção "Dúvidas e Solução de Problemas"
- Contacte seu desenvolvedor

**Última atualização:** Agosto 2026

---

**Bem-vinda ao painel, Amanda! Você tem isto. 🎯**
