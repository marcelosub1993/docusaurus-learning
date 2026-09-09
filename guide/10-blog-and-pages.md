# Módulo 10 — Blog e páginas soltas

> **Objetivo:** publicar posts com autores e tags, e criar páginas fora da
> documentação — incluindo a home.
> **Tempo:** ~45 min
> **Pré-requisito:** [Módulo 09](./09-visual-identity.md)

O Docusaurus tem três tipos de conteúdo, e eles não se misturam:

| Tipo | Pasta | Tem menu lateral? | Tem data? |
|---|---|---|---|
| Documentação | `docs/` | Sim | Não |
| Blog | `blog/` | Não (tem uma lista de posts recentes) | Sim, e ordena por ela |
| Páginas soltas | `src/pages/` | Não | Não |

💻 Dentro de `website`.

---

## Parte A — O blog

### Passo 1 — Ver o que veio no template

💻

```powershell
Get-ChildItem blog
```

👀 Seis itens:

```
2021-08-26-welcome/              ← uma pasta, não um arquivo
2019-05-28-first-blog-post.mdx
2019-05-29-long-blog-post.mdx
2021-08-01-mdx-blog-post.mdx
authors.yml
tags.yml
```

Duas coisas para reparar já:

- **Um post pode ser uma pasta.** Quando ele tem imagens próprias, você cria a
  pasta com o nome datado e um `index.mdx` dentro. As imagens ficam ao lado.
- **`authors.yml` e `tags.yml` já existem.** Muito tutorial manda "criar" esses
  arquivos. No template atual eles já vêm — você vai **substituir** o conteúdo.

### Passo 2 — Limpar os exemplos

💻 Apague os posts, preservando os dois `.yml`:

```powershell
Get-ChildItem blog -Exclude *.yml | Remove-Item -Recurse -Force
Get-ChildItem blog
```

👀 Sobraram exatamente `authors.yml` e `tags.yml`. A página `/blog` fica vazia.

⚠️ O `-Exclude` é o detalhe que importa. Um `Remove-Item blog\*.mdx` deixaria a
pasta `2021-08-26-welcome/` para trás, e você ficaria com um post do Docusaurus no
seu blog sem entender de onde veio.

### Passo 3 — Escrever um post

O nome do arquivo define a data e a URL. O formato é `YYYY-MM-DD-title.mdx`.

📄 Crie `blog/2026-09-09-nimbus-2-0.mdx`:

```mdx
---
title: Nimbus 2.0 is out
description: What changed in this release and what comes next.
slug: nimbus-2-0
---

Nimbus 2.0 is now available for every workspace.

{/* truncate */}

## What changed

We rewrote the import engine. It now streams large files instead of loading
them into memory, so a 4 GB dataset no longer needs 4 GB of RAM.

## How to upgrade

Run the installer from your workspace portal and restart the agent.
```

👀 O post aparece em `/blog` e em `/blog/nimbus-2-0`.

### Passo 4 — O marcador de truncate

Aquela linha `{/* truncate */}` no meio do texto tem uma função específica: na
**lista** de posts, o Docusaurus mostra só o que vem antes dela, com um botão
"Read more". Na página do post, o texto completo.

Sem ela, a lista de posts exibe cada post inteiro — e vira uma parede de texto.

💻 Prove: 📄 apague a linha, salve, e recarregue `/blog`. Depois coloque de volta.

⚠️ **A sintaxe do marcador segue a do comentário**, que você viu no
[Módulo 04, Passo 10](./04-writing-markdown.md#passo-10--comentários):
`{/* truncate */}`. O `<!-- truncate -->` que aparece em tutoriais antigos quebra
o build, porque no Docusaurus 3 tudo passa pelo MDX.

> Aquele aviso `Docusaurus found blog posts without truncation markers` no
> terminal é exatamente isto. Ele vem de `onUntruncatedBlogPosts: 'warn'`, que o
> template já deixa ligado.

### Passo 5 — Autores

Escrever os dados do autor em cada post duplica informação. Declare uma vez.

📄 Substitua o conteúdo de `blog/authors.yml`:

```yml
marcelo:
  name: Marcelo
  title: Learning Docusaurus in public
  url: https://github.com/marcelosub1993
  image_url: https://github.com/marcelosub1993.png
  page: true
  socials:
    github: marcelosub1993

nimbus_team:
  name: The Nimbus Team
  title: Product and engineering
  image_url: /img/logo.svg
```

📄 E referencie **pela chave** no post:

```mdx
---
title: Nimbus 2.0 is out
authors: [marcelo]
---
```

Vários autores: `authors: [marcelo, nimbus_team]`.

👀 Foto, nome e cargo aparecem no post e na lista.

👀 E como `marcelo` tem `page: true`, existe agora uma página só dele em
`/blog/authors/marcelo`, listando tudo que ele escreveu. Clique no nome do autor
para chegar lá.

> Aquele aviso `Some blog authors used in "..." are not defined in "authors.yml"`
> some quando você faz isso. Ele vem de `onInlineAuthors: 'warn'`, também já
> ligado no template. Os avisos existem justamente para te empurrar nessa direção.

### Passo 6 — Tags

Mesma lógica, arquivo próprio.

📄 Substitua o conteúdo de `blog/tags.yml`:

```yml
release:
  label: Release
  permalink: /release
  description: Announcements of new Nimbus versions

tutorial:
  label: Tutorial
  permalink: /tutorial
  description: Step-by-step walkthroughs
```

📄 No post:

```mdx
---
tags: [release]
---
```

👀 A tag vira um link para `/blog/tags/release`, com todos os posts dela.

⚠️ Escrever `tags: [releases]` (uma chave que não existe no `tags.yml`) não quebra
o build — só gera o aviso do `onInlineTags`. O Docusaurus cria a tag na hora. Isso
é conveniente e é como o vocabulário de tags de um site vira uma bagunça: `release`,
`releases`, `Release` e `new-version` convivendo. Declare no arquivo e use só o
que está lá.

### Passo 7 — Configurar o blog

📄 Em `docusaurus.config.js`, dentro do preset, na chave `blog`:

```js
blog: {
  showReadingTime: true,          // "5 min read"
  blogTitle: 'Nimbus news',
  blogDescription: 'Release notes and announcements',
  postsPerPage: 10,
  blogSidebarTitle: 'Recent posts',
  blogSidebarCount: 5,            // 'ALL' para listar todos
  feedOptions: {
    type: ['rss', 'atom'],
    xslt: true,                   // deixa o feed legível no navegador
  },
  editUrl: 'https://github.com/marcelosub1993/docusaurus-learning/tree/main/website/',
  onInlineTags: 'warn',
  onInlineAuthors: 'warn',
  onUntruncatedBlogPosts: 'warn',
},
```

💻 Reinicie o `npm start` e confira `/blog`.

### Passo 8 — Não quero blog

Muito site de documentação interna não tem blog. Para desligar:

```js
blog: false,
```

💻 Depois apague a pasta `blog/` e remova **todos** os links para `/blog` — na
navbar e no rodapé.

⚠️ Se você desligar o blog e deixar um link, o `npm run build` falha com link
quebrado. Que é o comportamento certo — ele está te protegendo.

📄 Neste guia vamos **manter** o blog. Ele é o lugar natural para você registrar o
que aprendeu em cada módulo.

---

## Parte B — Páginas soltas

Tudo em `src/pages/` vira uma rota, com o caminho do arquivo virando a URL.
Sem menu lateral, sem data, sem paginação.

| Arquivo | URL |
|---|---|
| `src/pages/index.js` | `/` (a home) |
| `src/pages/about.md` | `/about` |
| `src/pages/support/contact.md` | `/support/contact` |

### Passo 9 — Uma página em Markdown

📄 Crie `src/pages/about.md`:

```md
---
title: About this site
description: Who maintains this documentation and how to contribute.
---

# About

This site documents Nimbus, a fictional CLI used as a practice project while
learning Docusaurus.

The source lives on
[GitHub](https://github.com/marcelosub1993/docusaurus-learning). Suggestions and
corrections are welcome as issues.
```

👀 Acesse `http://localhost:3000/about`. É uma página limpa, ocupando a largura
toda, sem menu lateral.

Use para: página "Sobre", política de privacidade, landing pages, avisos.

⚠️ Repare que aqui o `# About` **fica**, mesmo tendo `title:` no front matter.
Em `src/pages/`, ao contrário de `docs/`, o `title:` só alimenta a aba do
navegador e o SEO — ele não gera um `<h1>` na página. Se você tirar o `#`, a
página fica sem título visível.

### Passo 10 — Uma página em React

Quando a página precisa de layout próprio ou de lógica:

📄 Crie `src/pages/status.js`:

```jsx
import Layout from '@theme/Layout';

const services = [
  {name: 'Sync API', ok: true},
  {name: 'Workspace portal', ok: true},
  {name: 'Import engine', ok: false},
];

export default function Status() {
  return (
    <Layout title="Status" description="Current status of Nimbus services">
      <main className="container margin-vert--lg">
        <h1>Service status</h1>
        <ul>
          {services.map((service) => (
            <li key={service.name}>
              {service.ok ? '🟢' : '🔴'} {service.name}
            </li>
          ))}
        </ul>
      </main>
    </Layout>
  );
}
```

👀 Acesse `/status`.

Três coisas novas:

- **`<Layout>`** envolve o conteúdo com a navbar, o rodapé e o `<head>` correto.
  Sem ele, sua página fica solta, sem cabeçalho e sem tema.
- **`.map()`** transforma uma lista de dados em uma lista de elementos. É o mesmo
  padrão do `HomepageFeatures` que veio no template.
- **`key`** é obrigatório em lista. O React usa para saber qual item é qual entre
  renderizações. Sem ele, um aviso aparece no console do navegador (`F12`).

### Passo 11 — Editar a home

📄 `src/pages/index.js` é a página inicial. Ela tem duas partes:

1. `HomepageHeader` — a faixa colorida do topo, definida no próprio arquivo
2. `<HomepageFeatures />` — as três colunas, em `src/components/HomepageFeatures/`

💻 Comece pequeno: 📄 no `index.js`, mude o texto do botão e o destino dele. O
template aponta para `/docs/intro`, que não existe mais — você mudou o slug dessa
página para `/` no Módulo 03.

⚠️ Esse é um link quebrado esperando para acontecer. Rode `npm run build` para
confirmar que ele te avisa.

📄 Depois abra `src/components/HomepageFeatures/index.js`. Ele tem uma lista:

```jsx
const FeatureList = [
  {
    title: 'Easy to Use',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Docusaurus was designed from the ground up to be easily installed and
        used to get your website up and running quickly.
      </>
    ),
  },
  // ...
];
```

Edite os títulos, as descrições e as imagens. É a mesma estrutura de dados do
Passo 10: uma lista que vira elementos.

> O `<>...</>` é um **fragment** — um "elemento invisível" que serve só para
> agrupar. Ele existe porque JSX exige que cada expressão devolva um elemento só,
> e às vezes você quer devolver texto com uma tag no meio sem adicionar uma `div`.

> Se você preferir uma home totalmente própria, apague o conteúdo do `index.js` e
> escreva do zero usando `<Layout>` e o grid do Módulo 08. Ou aponte a home
> direto para a documentação, removendo o `index.js` — o `slug: /` do seu
> `intro.mdx` assume.

---

## Passo 12 — Registrar no Git

💻

```powershell
cd ..
git add .
git commit -m "feat: add blog with authors and tags, about and status pages"
git push
cd website
```

---

## ✅ Checkpoint

- [ ] A pasta `blog/` tem só os seus posts, `authors.yml` e `tags.yml`
- [ ] Nenhum aviso de autor, tag ou truncate no terminal
- [ ] Existe uma página de autor em `/blog/authors/marcelo`
- [ ] Uma página em Markdown em `src/pages/`
- [ ] Uma página em React usando `<Layout>`
- [ ] A home tem seu texto, não o do template, e o botão leva a uma rota que existe
- [ ] `npm run build` passa
- [ ] Commit feito

---

## 🎯 Exercício

**1. Um post de nota de versão com abas**

📄 Crie `blog/2026-09-10-nimbus-2-1.mdx`.

Requisitos:

- `authors: [marcelo, nimbus_team]` — os dois
- `tags: [release]`
- Marcador de truncate depois do primeiro parágrafo
- Um grupo de `<Tabs>` com o comando de atualização em Windows, macOS e Linux,
  usando `groupId="operating-system"` (Módulo 05)
- Uma `:::warning` avisando que o agente precisa ser reiniciado

⚠️ Para usar abas você precisa dos dois `import` no topo. Se esquecer, o erro é
`Expected component Tabs to be defined` — e ele diz exatamente isso.

**2. Um post sobre o que você aprendeu**

📄 Crie `blog/2026-09-11-what-i-learned.mdx`, com `tags: [tutorial]` e
`authors: [marcelo]`.

Escreva, em inglês, três coisas que te surpreenderam nos Módulos 00 a 09. É o
post mais útil do exercício — daqui a seis meses você vai querer ter escrito.

**3. Confirme a sincronização de abas**

👀 Escolha "Linux" no post do item 1, navegue até `/docs/installation`, e confirme
que a aba lá já está em Linux.

**4. Uma página de contato**

📄 Crie `src/pages/contact.md` com: como abrir uma issue, onde fica o repositório,
e o tempo médio de resposta (invente).

📄 Adicione um link para ela no rodapé, na coluna "Support".

**5. A home é sua**

📄 Substitua as três features do template por três reais do Nimbus. Sugestões:
"Works offline", "No background service", "One config file".

Para os ícones, use as três ilustrações `undraw_*.svg` que já existem, ou substitua
por SVGs seus (Módulo 06).

**6. Valide e commite**

**Como saber que deu certo:**

- `/blog` mostra três posts, cada um com resumo curto e botão "Read more"
- `/blog/tags/release` mostra dois posts; `/blog/tags/tutorial` mostra um
- `/blog/authors/marcelo` lista os três
- A escolha de aba viaja entre o post e a página de instalação
- A home não menciona Docusaurus nem dinossauros em lugar nenhum
- `npm run build` termina **sem nenhum aviso** no terminal

O último item é o mais rigoroso de propósito: um build limpo é o objetivo. Se
sobrou aviso, ele está apontando para alguma das práticas deste módulo.

---

## 📌 O que você aprendeu

Blog é conteúdo datado, com autores e tags declarados em YAML — que já vêm no
template, prontos para substituir. `src/pages/` é para páginas independentes, em
Markdown ou React, e lá o `title:` não gera `<h1>`. E os avisos do terminal
apontam para a prática melhor, não para um bug.

➡️ Próximo: [Módulo 11 — Recursos avançados](./11-advanced-features.md)
