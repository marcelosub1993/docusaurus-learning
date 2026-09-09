# Módulo 04 — Escrevendo em Markdown

> **Objetivo:** dominar a sintaxe de texto, tabelas, listas, links e âncoras.
> **Tempo:** ~45 min
> **Pré-requisito:** [Módulo 03](./03-first-page.md)

Markdown é texto simples com marcações. A regra geral: **linha em branco separa
blocos**. Esquecer a linha em branco é a causa da maioria dos "por que isso não
formatou?".

💻 Como sempre, dentro de `website`:

```powershell
cd "C:\Users\marce\OneDrive\Documents\Docusaurus\website"
```

---

## Passo 1 — Criar a página de treino

📄 Crie `docs/reference.mdx`:

```mdx
---
title: Syntax reference
sidebar_position: 4
description: A page where every Markdown feature is demonstrated.
---

A living page where each formatting feature is shown in use.
```

Deixe o navegador aberto em `http://localhost:3000/docs/reference`. Cada seção
abaixo você **acrescenta no fim do arquivo** e confere no ato.

---

## Passo 2 — Títulos e o índice lateral

📄 Adicione:

```mdx
## Headings

### A subsection

#### A detail
```

👀 Repare na **coluna da direita**: apareceu um índice ("On this page"), montado
a partir dos `##` e `###`.

Regras que importam:

- Use **um único `#`** por página — e prefira deixar isso para o `title:` do front
  matter, como você fez no Módulo 03.
- O índice lateral pega `##` e `###` por padrão. Ajuste no front matter:

```mdx
---
toc_min_heading_level: 2
toc_max_heading_level: 4
---
```

- Para esconder o índice numa página: `hide_table_of_contents: true`.

### Âncoras fixas

Cada título vira um link automático (`/docs/reference#a-subsection`). Se você
mudar o texto do título, esse link quebra para quem salvou. Para evitar, fixe o id:

```mdx
### Installing on Windows {#windows-install}
```

Agora a âncora é `#windows-install` para sempre, mesmo que o texto mude.

⚠️ Use âncora fixa em todo título que você vai linkar de outro lugar. É barato
agora e caro depois.

---

## Passo 3 — Formatação de texto

📄 Adicione:

```mdx
## Text formatting

**bold**, _italic_, **_both_**, ~~strikethrough~~, `inline code`.

One line.
Another line — same paragraph!

A blank line starts a new paragraph.

Or end the line with a backslash: \
like this.
```

👀 Confira no navegador: as duas linhas do meio viraram um parágrafo só.

---

## Passo 4 — Listas

📄 Adicione:

```mdx
## Lists

- A simple item
- Another item
  - Nested (indent with 2 spaces)
    - Even deeper

1. First
2. Second
   1. Numbered sub-item
3. Third

- [x] Completed task
- [ ] Pending task
```

👀 A lista de tarefas vira caixinhas de seleção de verdade (só visuais, não
clicáveis).

⚠️ **A pegadinha da lista com bloco dentro.** Para colocar código ou parágrafo
dentro de um item, indente o conteúdo com **3 espaços** (alinhado ao texto do
item) e deixe linha em branco:

````mdx
1. Install the dependencies:

   ```powershell
   npm install
   ```

2. Start the project.
````

Sem a indentação certa, o bloco de código "escapa" da lista e a numeração recomeça
do 1.

---

## Passo 5 — Citações e separadores

📄 Adicione:

```mdx
## Quotes

> A quote.
>
> With two paragraphs.

---
```

Os três traços viram uma linha horizontal.

> **Citação ou admonition?** Citação é para nota leve e para citar alguém de
> verdade. Para avisos com peso — cuidado, atenção, perigo — existem as
> admonitions, no [Módulo 05](./05-admonitions-and-code.md).

---

## Passo 6 — Tabelas

📄 Adicione:

```mdx
## Tables

| Command | What it does | How often |
| --- | --- | :---: |
| `nimbus sync` | Syncs the workspace now | Daily |
| `nimbus status` | Shows pending changes | Often |
| `nimbus doctor` | Diagnoses the local setup | When something breaks |
```

O alinhamento vem dos dois-pontos na linha separadora:

| Sintaxe | Alinhamento |
|---|---|
| `---` ou `:---` | Esquerda (padrão) |
| `:---:` | Centro |
| `---:` | Direita |

⚠️ As barras não precisam estar alinhadas visualmente — o Markdown não liga. Mas
**toda linha precisa do mesmo número de colunas**, senão a tabela quebra.

Para quebrar linha dentro de uma célula, use `<br />`. Para usar uma barra `|` como
texto dentro de uma célula, escape com `\|`.

---

## Passo 7 — Links (a parte importante)

Existem três formas, e a diferença entre elas importa:

```mdx
1. [File path](./installation.mdx)          ← recomendado
2. [Site URL](/docs/installation)
3. [External](https://docusaurus.io)
```

### Por que o caminho de arquivo é melhor

Quando você escreve `./installation.mdx`, o Docusaurus **resolve isso no build**:
procura o arquivo, descobre a URL final dele (respeitando `slug`, `baseUrl`,
versionamento e idioma) e substitui. Se o arquivo não existir, **o build falha e
avisa**.

Com a URL escrita à mão, o link só quebra silenciosamente quando alguém renomeia
a página. Você viu isso no exercício do Módulo 03: `licensing.mdx` tem
`slug: /faq-licensing`, e mesmo assim o link por caminho de arquivo continuou
funcionando.

### O erro clássico

```mdx
[Errado](/installation.mdx)          ← barra na frente + extensão .mdx
[Certo](./installation.mdx)          ← ponto-barra
[Certo](../faq/licensing.mdx)        ← subir uma pasta
[Certo](./installation.mdx#requirements)  ← com âncora
```

Com a barra na frente, o Docusaurus entende que é URL, não caminho de arquivo — e
procura uma página literalmente chamada `/installation.mdx`, que não existe.

### A rede de segurança

📄 Em `docusaurus.config.js` existe:

```js
onBrokenLinks: 'throw',
```

Isso faz o `npm run build` **falhar** se houver qualquer link interno quebrado.
Mantenha assim. É desconfortável no começo e salva o site depois.

Existem dois irmãos dele, que por padrão só avisam:

| Opção | Padrão | O que cobre |
|---|---|---|
| `onBrokenLinks` | `throw` | Links entre páginas |
| `onBrokenAnchors` | `warn` | Âncoras (`#secao`) que não existem |
| `markdown.hooks.onBrokenMarkdownLinks` | `warn` | Caminhos `./arquivo.mdx` que não resolvem |

💻 Teste o `throw` agora. 📄 Adicione um link para um arquivo inexistente:

```mdx
[This will break](./does-not-exist.mdx)
```

💻 Pare o servidor e rode:

```powershell
npm run build
```

👀 Você verá a lista exata de links quebrados, com a página de origem de cada um.
Leia a mensagem inteira — é ela que você vai ler em produção um dia.

📄 Agora **apague a linha do link quebrado** e confirme que o build volta a passar.

---

## Passo 8 — Notas de rodapé

📄 Adicione:

```mdx
## Footnotes

Nimbus stores credentials in the system keychain[^1].

[^1]: Keychain on macOS, Credential Manager on Windows, and Secret Service on Linux.
```

👀 O `[^1]` vira um número sobrescrito clicável, e a nota aparece no fim da página
com uma setinha de volta.

---

## Passo 9 — Blocos recolhíveis

📄 Adicione:

````mdx
## Collapsible blocks

<details>
  <summary>What to do when port 3000 is already in use</summary>

  Start the server on another port:

  ```powershell
  npm start -- --port 3001
  ```

</details>
````

👀 Um bloco que abre e fecha com animação. Ótimo para respostas longas de FAQ e
detalhes que atrapalham a leitura principal.

⚠️ Precisa da **linha em branco** depois de `</summary>` e antes de `</details>`,
senão o Markdown de dentro não é processado e você vê o texto cru.

---

## Passo 10 — Comentários

📄 Adicione:

```mdx
{/* This does not show up on the site */}
```

⚠️ **Não use `<!-- comentário HTML -->`.** No Docusaurus 3, **todos** os arquivos
de conteúdo — `.md` e `.mdx` — passam pelo compilador MDX por padrão, e MDX não
tem comentário HTML. O build quebra com um erro de sintaxe.

Muito tutorial antigo na internet ainda mostra `<!-- -->` funcionando em `.md`.
Era verdade no Docusaurus 2. Não é mais. O [Módulo 05](./05-admonitions-and-code.md#parte-c--md-vs-mdx)
explica o que mudou e como voltar ao comportamento antigo, se você quiser.

---

## Passo 11 — Registrar no Git

💻

```powershell
cd ..
git add .
git commit -m "docs: add Markdown syntax reference page"
git push
cd website
```

---

## ✅ Checkpoint

A página `docs/reference.mdx` deve ter, funcionando: títulos com âncora fixa,
texto formatado, lista com bloco de código dentro, tabela alinhada, os três tipos
de link, uma nota de rodapé, um bloco `<details>` e um comentário.

- [ ] O índice lateral (direita) reflete seus títulos
- [ ] Você criou um link quebrado, viu o build falhar, e consertou
- [ ] `npm run build` passa
- [ ] Você consegue explicar por que `./page.mdx` é melhor que `/docs/page`
- [ ] Commit feito

---

## 🎯 Exercício

Reescreva a seção de FAQ do Módulo 03 usando o que aprendeu.

**1. Padronize as três perguntas**

Em cada um dos três arquivos de `docs/faq/`, aplique:

- Um `##` por subtópico, cada um com **âncora fixa**
- A parte longa da resposta dentro de um `<details>`
- Pelo menos uma tabela

Esqueleto para `licensing.mdx`:

```mdx
---
title: How many machines does one license cover?
sidebar_label: Licensing
sidebar_position: 1
slug: /faq-licensing
description: What a Nimbus seat includes and how to move it between machines.
---

(resposta curta, 2 linhas)

## What a seat includes {#seat}

| Plan | Machines per seat | Concurrent syncs |
| --- | :---: | :---: |
| | | |

## Moving a seat to a new machine {#transfer}

<details>
  <summary>Step-by-step transfer</summary>

(os passos aqui)

</details>
```

**2. Ligue as perguntas entre si**

Cada página de FAQ deve linkar pelo menos uma outra, **por caminho de arquivo e
com âncora**. Por exemplo, de `performance.mdx` para
`./data-retention.mdx#cleanup`.

Isso só funciona se a âncora existir do outro lado — que é o ponto do exercício.

**3. Quebre de propósito e conserte**

Este é o passo mais importante. Errar num momento controlado é como você aprende
a ler as mensagens de erro.

Faça as três quebras, uma de cada vez, rodando `npm run build` entre elas:

| Quebra | O que escrever | O que esperar |
|---|---|---|
| Link para arquivo inexistente | `[x](./nope.mdx)` | Build falha, lista o link e a origem |
| Âncora que não existe | `[x](./licensing.mdx#nope)` | Build **passa**, com aviso no terminal |
| Barra na frente | `[x](/licensing.mdx)` | Build falha, mensagem diferente da primeira |

Leia cada mensagem com calma antes de consertar. Repare que a segunda só **avisa**
— é a diferença entre `onBrokenLinks: 'throw'` e `onBrokenAnchors: 'warn'` do
Passo 7.

**4. Commite**

```powershell
cd ..
git add .
git commit -m "docs: expand FAQ with tables, anchors and cross-links"
git push
```

**Como saber que deu certo:**

- As três páginas de FAQ têm índice lateral com mais de um item
- Clicar num link entre perguntas leva direto à seção certa, não ao topo da página
- Você consegue dizer, de memória, qual das três quebras **não** derruba o build
- `npm run build` termina com SUCCESS e sem avisos de link

---

## 📌 O que você aprendeu

Markdown formata por blocos separados por linha em branco. Links por caminho de
arquivo são validados no build; links por URL não são. `onBrokenLinks: 'throw'`
derruba o build, `onBrokenAnchors: 'warn'` só avisa — e saber a diferença evita
publicar âncora quebrada.

➡️ Próximo: [Módulo 05 — Admonitions e blocos de código](./05-admonitions-and-code.md)
