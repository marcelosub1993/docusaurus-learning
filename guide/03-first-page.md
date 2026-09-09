# Módulo 03 — Sua primeira página

> **Objetivo:** criar documentos do zero e controlar título, ordem, rótulo e URL.
> **Tempo:** ~40 min
> **Pré-requisito:** [Módulo 02](./02-creating-the-site.md), com `npm start` rodando.

A partir daqui, tudo que você escrever **dentro de `website/`** é em inglês: nome
de arquivo, nome de pasta, front matter e o texto das páginas. O guia continua em
português.

O assunto do site é o **Nimbus**, uma ferramenta de linha de comando fictícia
para sincronizar dados. Não existe — serve só para você ter o que escrever.

💻 Todos os comandos deste módulo rodam dentro de `website`:

```powershell
cd "C:\Users\marce\OneDrive\Documents\Docusaurus\website"
```

---

## Passo 1 — Limpar o exemplo

O template veio com um tutorial de demonstração. Vamos tirá-lo do caminho.

💻

```powershell
Remove-Item -Recurse docs\tutorial-basics, docs\tutorial-extras
```

👀 O menu lateral no navegador perde as categorias "Tutorial - Basics" e
"Tutorial - Extras" na hora. Sobrou só "intro".

> Guarde o `docs/intro.mdx` por enquanto — vamos reaproveitá-lo no Passo 6.

---

## Passo 2 — Criar um documento

📄 Crie `docs/installation.mdx` com este conteúdo:

```mdx
# Installation

How to get Nimbus running on your machine.

## Requirements

- Windows 10 or later, macOS 13 or later, or any Linux with glibc 2.31+
- 8 GB of RAM
- Network access to your Nimbus workspace

## Steps

1. Download the installer from your workspace portal.
2. Run it with administrator privileges.
3. Restart your machine.
4. Confirm the install by running `nimbus --version`.
```

👀 Salve e olhe o navegador: apareceu **Installation** no menu lateral, e a página
está em `http://localhost:3000/docs/installation`.

Repare em duas coisas:

- **A URL veio do nome do arquivo**, não do título. `installation.mdx` →
  `/docs/installation`.
- **O rótulo no menu veio do `# Installation`**, o primeiro heading do arquivo.

> **Por que `.mdx` e não `.md`?** É o que o template do Docusaurus 3 usa, e é o
> que destrava componentes React mais adiante. O [Módulo 05](./05-admonitions-and-code.md#parte-c--md-vs-mdx)
> explica a diferença de verdade — que não é a que a maioria das pessoas imagina.

---

## Passo 3 — O front matter

Deixar o Docusaurus adivinhar funciona, mas você quer controle. O front matter é
um bloco de metadados no topo do arquivo, entre duas linhas de `---`.

📄 Edite `docs/installation.mdx` e coloque isto **na primeira linha do arquivo**,
removendo o `# Installation`:

```mdx
---
title: Installing Nimbus
sidebar_label: Installation
sidebar_position: 1
description: Requirements and step-by-step instructions to install Nimbus.
---

How to get Nimbus running on your machine.

## Requirements
...
```

Note que **removi o `# Installation`**. Quando existe `title:` no front matter, o
Docusaurus gera o `<h1>` sozinho — se você mantiver os dois, a página fica com
dois títulos.

👀 No navegador: o menu agora mostra "Installation" (vindo do `sidebar_label`), e
o título da página é "Installing Nimbus".

### Os campos que você mais vai usar

| Campo | Efeito | Exemplo |
|---|---|---|
| `title` | Título da página e da aba do navegador | `title: Installing Nimbus` |
| `sidebar_label` | Nome curto no menu lateral | `sidebar_label: Installation` |
| `sidebar_position` | Ordem no menu (menor primeiro) | `sidebar_position: 1` |
| `description` | Resumo para busca e preview de link | `description: Requirements and...` |
| `slug` | Muda a URL | `slug: /get-started` |
| `id` | Muda o identificador interno — **e a URL junto** | `id: install-nimbus` |
| `tags` | Etiquetas, com página de listagem própria | `tags: [setup]` |

💡 **Sobre `tags`:** funciona já, e cada tag ganha uma página em
`/docs/tags/<tag>`. Mas o Docusaurus aceita qualquer palavra que você escrever, e
avisa no terminal que ela não está declarada — é assim que o vocabulário de tags
de um site vira bagunça (`setup`, `Setup`, `install`, `installation` convivendo).
O [Módulo 10](./10-blog-and-pages.md#e-nas-docs) ensina a declará-las num
`tags.yml`. Até lá, use com moderação ou deixe para depois.

⚠️ **O front matter é YAML, e YAML se importa com espaços.** `title:Installation`
(sem espaço depois dos dois-pontos) quebra o build. Valores com `:` no meio
precisam de aspas: `title: "Nimbus: the basics"`.

---

## Passo 4 — Entendendo `slug` e `id`

Estes dois causam confusão, então vale parar aqui.

A regra que explica tudo, e que quase nenhum tutorial diz:

> **A URL não vem do nome do arquivo. Ela vem do `slug`, e o `slug` cai no `id`
> quando você não informa. O `id`, por sua vez, cai no nome do arquivo.**

É uma cascata de três degraus:

```
nome do arquivo  →  id  →  slug  →  URL
                    ↑       ↑
              front matter  front matter
```

Cada front matter interrompe a cascata no seu degrau. Na prática, para
`docs/installation.mdx`:

| Front matter | id | URL |
|---|---|---|
| *(nada)* | `installation` | `/docs/installation` |
| `id: install-nimbus` | `install-nimbus` | `/docs/install-nimbus` ← **mudou** |
| `slug: get-started` | `installation` | `/docs/get-started` |
| os dois juntos | `install-nimbus` | `/docs/get-started` ← o `slug` ganha |

Repare na segunda linha: **`id` também muda a URL.** É o efeito colateral que
pega todo mundo, porque o nome do campo não sugere isso.

### O `/docs/` não sai nunca

Repare que **todas** as URLs da tabela começam com `/docs/`. Isso não é
coincidência, e é o segundo mal-entendido comum:

> **O `slug` só controla o caminho *dentro* de `/docs/`. Nenhum valor de `slug`
> tira a página de lá.**

Quem define esse prefixo é o `routeBasePath` do plugin de docs, e ele vale para a
documentação inteira, não para uma página. Se você quiser as docs na raiz do site,
é `routeBasePath: '/'` na configuração — tudo ou nada.

E a barra inicial do `slug`? Ela existe, mas quer dizer outra coisa:

| `slug` | Significa | Para `docs/installation.mdx` | Para `docs/faq/licensing.mdx` |
|---|---|---|---|
| `get-started` | Relativo **à pasta do arquivo** | `/docs/get-started` | `/docs/faq/get-started` |
| `/get-started` | Relativo **à raiz de `docs/`** | `/docs/get-started` | `/docs/get-started` |

⚠️ Nas páginas que estão **na raiz de `docs/`**, as duas formas dão exatamente o
mesmo resultado — a pasta do arquivo já *é* a raiz. Se você testar a diferença no
`installation.mdx`, vai concluir que a barra não faz nada.

A diferença só aparece em arquivo dentro de subpasta, e é aí que ela é útil: a
barra inicial **escapa da pasta**. É o que o exercício deste módulo faz com o FAQ.

⚠️ O `id` **não pode conter barra**. `id: guides/install` derruba o build com
`Document id "guides/install" cannot include slash`. A pasta já entra no id
sozinha: `docs/faq/licensing.mdx` com `id: license` vira o id `faq/license`.

### Qual usar, e quando

| Objetivo | Use |
|---|---|
| Encurtar ou fixar a URL pública | `slug` |
| Encurtar o nome usado no `sidebars.js` | `id` |
| Só renomear a página no menu | `sidebar_label` |

💡 **Na dúvida, use `slug` e não mexa no `id`.** O `slug` faz uma coisa só e diz o
que faz. O `id` faz duas, e é aí que a confusão nasce.

⚠️ **O erro nº 1 de quem começa** vem daqui: você define `id:` no front matter,
depois escreve `'installation'` no `sidebars.js`, e o build falha com:

```
Error: Invalid sidebar file at "sidebars.js".
These sidebar document ids do not exist:
- installation
```

A mensagem lista os ids válidos logo abaixo. Leia essa lista — a resposta está lá.

💻 Teste a cascata você mesmo agora, enquanto é barato. 📄 Adicione ao front
matter de `installation.mdx`:

```mdx
id: install-nimbus
```

👀 Salve e olhe a barra de endereço: a página que estava em `/docs/installation`
agora está em `/docs/install-nimbus`, e o link antigo dá **404**.

📄 Agora acrescente também:

```mdx
slug: get-started
```

👀 A URL vira `/docs/get-started`. O `slug` ganhou do `id`.

💻 E confirme o que a tabela acima disse: 📄 troque para `slug: /get-started`, com
barra.

👀 **Nada muda** — continua `/docs/get-started`. Como o arquivo está na raiz de
`docs/`, "relativo à pasta" e "relativo à raiz de `docs/`" são o mesmo lugar. E
nem com a barra a página sai de `/docs/`.

📄 Depois **remova os dois campos**. Não vamos precisar deles nesta página, e a
URL volta a ser `/docs/installation`.

> **Por que nada quebrou no terminal?** Porque a sidebar ainda é `autogenerated`,
> que descobre os ids sozinha. O erro do `sidebars.js` só aparece no Módulo 07,
> quando você assumir o controle do menu. Guarde esta página para lá.

---

## Passo 5 — Organizando em pastas

Uma pasta dentro de `docs/` vira uma **categoria** no menu.

💻

```powershell
mkdir docs\configuration
```

📄 Crie `docs/configuration/basic-setup.mdx`:

```mdx
---
title: Basic setup
sidebar_position: 1
description: The minimum configuration to get Nimbus syncing.
---

The three settings Nimbus needs before it can sync anything.

## Workspace

Point the CLI at your workspace so it knows where to send data.

## Credentials

Nimbus reads credentials from the system keychain, never from a plain file.

## Sync interval

The default is every 15 minutes. Anything below 5 minutes is rejected.
```

📄 E `docs/configuration/advanced-setup.mdx`:

```mdx
---
title: Advanced setup
sidebar_position: 2
description: Filters, retries and proxies for specific scenarios.
---

Settings you only need once the basics are working.

## Filters

Exclude files by glob pattern so large build folders never leave the machine.

## Retry policy

How many times Nimbus retries a failed upload, and how long it waits.

## Proxy

Corporate networks usually need an explicit proxy here.
```

👀 O menu ganhou uma categoria **Configuration**, com dois itens dentro, na ordem
que você definiu. A URL da primeira é `/docs/configuration/basic-setup`.

### Dando nome e ordem à categoria

O nome da categoria veio do nome da pasta. Para controlar isso — e a ordem, e o
que acontece ao clicar nela — existe um arquivo especial dentro da própria pasta.

📄 Crie `docs/configuration/_category_.json`:

```json
{
  "label": "Configuration",
  "position": 2,
  "collapsed": false,
  "link": {
    "type": "generated-index",
    "description": "Everything you can adjust in Nimbus."
  }
}
```

👀 Agora a categoria aparece já expandida, e **clicar no nome dela abre uma página
de índice** com um card para cada filho — gerada automaticamente, sem você
escrever nada.

| Campo | Efeito |
|---|---|
| `label` | Nome exibido |
| `position` | Ordem da categoria entre os outros itens |
| `collapsed` | `false` = já vem aberta |
| `collapsible` | `false` = não deixa fechar |
| `link.type: "generated-index"` | Cria a página de índice automática |
| `link.type: "doc"` + `"id"` | Aponta para um documento seu como capa da seção |

> **Por que `_category_.json` e não front matter?** Porque a categoria é a pasta,
> e uma pasta não tem front matter. O arquivo começa com `_` para o Docusaurus
> saber que ele não é uma página.

---

## Passo 6 — Arrumando a home da documentação

📄 Edite `docs/intro.mdx`. Apague todo o conteúdo e coloque:

```mdx
---
title: Overview
sidebar_position: 0
slug: /
description: What Nimbus does and where to start.
---

Nimbus keeps a folder on your machine in sync with your team workspace,
without a UI and without a background service you have to babysit.

## Where to start

- [Installation](./installation.mdx) — get it running
- [Basic setup](./configuration/basic-setup.mdx) — the three required settings
```

O `slug: /` faz esta página virar a raiz da documentação: `/docs/` em vez de
`/docs/intro`.

👀 Repare que os links usam o **caminho do arquivo** (`./installation.mdx`), não a
URL. Guarde isso — é a forma recomendada, e o
[Módulo 04](./04-writing-markdown.md#passo-7--links-a-parte-importante) explica
por quê.

### Você acabou de quebrar dois links — conserte agora

⚠️ Este passo tem uma consequência que não é óbvia: **`/docs/intro` deixou de
existir**. E o template do Docusaurus aponta para esse endereço em dois lugares,
escritos como URL à mão.

Se você rodar `npm run build` agora, ele falha com uma lista enorme:

```
Docusaurus found broken links!
Frequent broken links are linking to:
- /docs/intro
```

A lista parece assustadora — dezenas de páginas — mas são **dois** links só. Um
deles está no rodapé, que aparece em toda página do site; por isso ele é contado
uma vez por página.

💡 A mensagem do Docusaurus até avisa: *"Maybe those broken links appear on all
pages through your site layout? We recommend that you check your theme
configuration"*. Quando um link quebrado aparecer em todo lugar, olhe navbar e
rodapé primeiro.

📄 **Conserto 1 — o rodapé.** Em `docusaurus.config.js`, dentro de `footer`,
procure `label: 'Tutorial'`:

```js
{
  label: 'Tutorial',
  to: '/docs/intro',     // ← troque para '/docs/'
},
```

📄 **Conserto 2 — o botão da home.** Em `src/pages/index.js`, procure o `<Link>`
do banner:

```jsx
<Link
  className="button button--secondary button--lg"
  to="/docs/intro">        {/* ← troque para "/docs/" */}
  Docusaurus Tutorial - 5min ⏱️
</Link>
```

Aproveite e troque o texto do botão para algo seu, como `Get started - 5min ⏱️`.

💻 **Agora sim, valide.** Pare o servidor (`Ctrl+C`) e rode:

```powershell
npm run build
```

👀 `[SUCCESS] Generated static files in "build".`

Se ainda falhar, leia a lista: ela diz a página de origem de cada link. Se falhar
por outro motivo, quase sempre é indentação de YAML no front matter.

💻 Suba de novo: `npm start`

> **A lição, que vale mais que o conserto:** mudar o endereço de uma página quebra
> quem apontava para ela. Links escritos como URL à mão (`to: '/docs/intro'`) não
> avisam quando você renomeia — só somem. Links por caminho de arquivo
> (`./installation.mdx`) são validados no build. É por isso que o Módulo 04
> insiste tanto nisso.

---

## Passo 7 — Registrar no Git

💻

```powershell
cd ..
git add .
git commit -m "feat: add installation and configuration docs"
git push
cd website
```

---

## ✅ Checkpoint

- [x] Você tem 4 páginas: Overview, Installation, Basic setup, Advanced setup
- [x] O menu lateral está na ordem que você quis
- [x] A categoria "Configuration" já vem expandida
- [x] Clicar em "Configuration" abre uma página de índice com cards
- [x] `/docs/` abre a Overview (por causa do `slug: /`)
- [x] Você sabe explicar a diferença entre `id`, `slug` e `sidebar_label`
- [x] Nenhum `/docs/intro` sobrou no rodapé nem no botão da home
- [x] `npm run build` passa **sem** a lista de links quebrados
- [x] Commit feito

---

## 🎯 Exercício

Você vai criar a seção de FAQ. Ela reaparece nos Módulos 04 e 07, então vale
fazer com calma.

**1. Crie a pasta e três perguntas**

Uma pergunta por arquivo, em `docs/faq/`:

| Arquivo | Assunto |
|---|---|
| `licensing.mdx` | Quantas máquinas uma licença cobre |
| `performance.mdx` | Por que a primeira sincronização é lenta |
| `data-retention.mdx` | Por quanto tempo os arquivos apagados ficam recuperáveis |

Use este esqueleto para cada um — preencha o corpo com 3 a 5 linhas inventadas,
mas plausíveis:

```mdx
---
title: (a pergunta, como frase completa, em inglês)
sidebar_label: (2 ou 3 palavras)
sidebar_position: (1, 2 ou 3)
description: (uma frase resumindo a resposta)
---

(a resposta)
```

**2. Nomeie e posicione a categoria**

📄 Crie `docs/faq/_category_.json`. Ela deve se chamar **"Frequently asked
questions"** e ficar **por último** no menu. Você precisa de dois campos do Passo
5 — `label` e `position`.

Dica de `position`: a Configuration está em `2`. Escolha um número maior.

**3. Dê uma URL curta a uma das páginas**

A pergunta de licenciamento é a mais compartilhada, e por padrão ela mora em
`/docs/faq/licensing` — longo demais para colar num chat.

Faça a URL dela ser **`/docs/faq-licensing`**: ainda dentro de `/docs/`, mas
**fora da pasta `faq/`**.

Aqui a barra inicial finalmente importa, porque o arquivo está numa subpasta:

| O que você escrever | URL resultante |
|---|---|
| `slug: faq-licensing` | `/docs/faq/faq-licensing` — ficou pior |
| *(o que você quer)* | `/docs/faq-licensing` |

Releia [O `/docs/` não sai nunca](#o-docs-não-sai-nunca) se travar.

⚠️ Repare que a página **sai da pasta na URL, mas continua na pasta no menu.** A
sidebar é montada pela estrutura de arquivos, não pela URL — os dois são
independentes, e isso é útil.

**4. Ligue o FAQ à Overview**

📄 Em `docs/intro.mdx`, adicione um terceiro item na lista "Where to start",
apontando para a pergunta de licenciamento pelo **caminho do arquivo**.

⚠️ Cuidado: essa página tem `slug`. O link por caminho de arquivo continua sendo
`./faq/licensing.mdx` — o Docusaurus resolve o `slug` sozinho. É exatamente por
isso que linkar por arquivo é melhor.

**5. Valide e commite**

```powershell
npm run build
```

**Como saber que deu certo:**

- O menu mostra, nesta ordem: Overview, Installation, Configuration, Frequently
  asked questions
- `http://localhost:3000/docs/faq-licensing` abre a página de licenciamento
- `http://localhost:3000/docs/faq/licensing` dá 404 — a página **mudou** de
  endereço, não ganhou um segundo
- No menu lateral, ela continua dentro de "Frequently asked questions", mesmo com
  a URL fora da pasta
- O link na Overview funciona e leva para `/docs/faq-licensing`
- `npm run build` termina com SUCCESS
- `git log --oneline` mostra o commit do exercício

---

## 📌 O que você aprendeu

Arquivo = página. Pasta = categoria. O front matter controla título, rótulo,
ordem e URL; o `_category_.json` faz o mesmo para categorias. O nome do arquivo
define a URL e o `id` — e o `id` é o que o `sidebars.js` vai enxergar no Módulo 07.

➡️ Próximo: [Módulo 04 — Escrevendo em Markdown](./04-writing-markdown.md)
