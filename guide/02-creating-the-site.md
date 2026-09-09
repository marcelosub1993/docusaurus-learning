# Módulo 02 — Criando o site

> **Objetivo:** gerar o projeto dentro do repositório, colocá-lo no ar
> localmente e entender o que é cada pasta que apareceu.
> **Tempo:** ~45 min
> **Pré-requisito:** [Módulo 01](./01-git-and-github.md), com o repositório no GitHub.

---

## Passo 1 — Gerar o projeto

💻 Vá para a raiz do repositório e rode o gerador:

```powershell
cd "C:\Users\marce\OneDrive\Documents\Docusaurus"
npx create-docusaurus@latest website classic
```

Traduzindo o comando:

| Parte | Significado |
|---|---|
| `npx` | Baixa e roda um pacote sem instalá-lo permanentemente |
| `create-docusaurus@latest` | O gerador oficial, na versão mais recente |
| `website` | Nome da pasta que será criada, dentro do repositório |
| `classic` | O template — traz docs, blog, tema e tudo preparado |

👀 Ele pergunta qual linguagem usar:

```
? Which language do you want to use?
❯ JavaScript
  TypeScript
```

Escolha **JavaScript** com as setas e Enter. TypeScript é ótimo, mas adiciona uma
camada de aprendizado que não ajuda agora.

👀 Depois vêm alguns minutos de instalação — ele cria os arquivos **e** baixa as
~1.200 dependências.

👀 Pelo caminho aparecem avisos de `deprecated`, como `uuid@8.3.2`. **Pode
ignorar.** São dependências indiretas: algum pacote do Docusaurus depende delas,
não você. Aviso de `deprecated` só te diz respeito quando é um pacote que **você**
instalou.

👀 No fim:

```
[SUCCESS] Created website.
[INFO] Inside that directory, you can run several commands: ...
Happy building awesome websites!
```

⚠️ **Se travar ou der erro de rede/proxy:** em rede corporativa o npm às vezes
precisa de configuração de proxy. Veja o
[Módulo 99](./99-troubleshooting.md#erro-de-rede-ou-proxy-no-npm).

💡 Este é o momento que o [Módulo 00](./00-environment-setup.md#dois-hábitos-que-evitam-quase-tudo)
avisou: 30 mil arquivos apareceram de uma vez dentro do OneDrive. Se a máquina
ficar lenta nos próximos minutos, é a sincronização — e da próxima vez você pausa
antes.

---

## Passo 2 — Subir o site

💻

```powershell
npm start
```

👀 Depois de alguns segundos:

```
[SUCCESS] Docusaurus website is running at: http://localhost:3000/
```

O navegador abre sozinho. Se não abrir, acesse `http://localhost:3000` manualmente.

Você está vendo o site de exemplo do template: uma home com três colunas, um menu
"Tutorial", um blog e um botão de modo escuro.

> **Esse terminal fica ocupado.** Enquanto o servidor roda, aquela janela não
> aceita outros comandos. Para rodar algo em paralelo, abra um segundo terminal
> (`Ctrl+Shift+5` no VS Code). Para parar o servidor: `Ctrl+C`.

---

## Passo 3 — Ver a mágica do hot reload

💻 Em outro terminal:

```powershell
code "C:\Users\marce\OneDrive\Documents\Docusaurus"
```

Isso abre o repositório inteiro — `guide/` e `website/` lado a lado.

**1. Vá até a página que você vai editar**

👀 No navegador você está na **home** (`http://localhost:3000/`). O arquivo que
vamos mexer não é ela.

🌐 Clique em **Tutorial**, na barra de cima. Você chega em
`http://localhost:3000/docs/intro`, numa página que começa com o título
**"Tutorial Intro"**.

⚠️ Este passo é fácil de pular, e aí você edita o arquivo, olha a home, não vê
nada mudar e acha que o hot reload está quebrado. **Deixe esta página aberta.**

**2. Abra o arquivo correspondente**

📄 No VS Code, abra `website/docs/intro.mdx`. As primeiras linhas são:

```mdx
---
sidebar_position: 1
---

# Tutorial Intro
```

Aquele bloco entre as duas linhas de `---` é uma área de configuração da página —
ele não aparece no site. Por enquanto **não mexa nele**; o
[Módulo 03](./03-first-page.md#passo-3--o-front-matter) explica o que é e como
usar (o nome dele é *front matter*, e é onde você controla título, ordem no menu
e URL).

**3. Edite e salve**

📄 **Substitua** a linha `# Tutorial Intro` por:

```mdx
# Welcome to Nimbus
```

⚠️ Substitua mesmo — não acrescente uma linha nova. Se ficarem dois `#` no
arquivo, a página fica com dois títulos grandes, um embaixo do outro.

Salve com `Ctrl+S`.

👀 Olhe o navegador, **na aba do `/docs/intro`, sem recarregar a página**: o
texto mudou sozinho.

Isso é *hot reload*. É o que torna o Docusaurus agradável de usar: você escreve e
vê o resultado imediatamente. Mantenha o `npm start` rodando o guia inteiro.

### O que recarrega sozinho e o que não

Isso vale saber agora, porque economiza reinício desnecessário — e porque muito
tutorial na internet ensina errado.

O `docusaurus.config.js` **também** tem hot reload. Mudar `title`, `tagline`,
`navbar`, `footer` ou cores reflete no navegador sem você parar nada.

Mas nem tudo:

| O que você mudou | Recarrega sozinho? |
|---|:---:|
| `title`, `tagline`, `favicon` | ✅ |
| `themeConfig` — navbar, footer, cores, `announcementBar`, prism | ✅ |
| Conteúdo em `docs/`, `blog/`, `src/` | ✅ |
| `sidebars.js` | ✅ |
| Instalar um pacote novo (`npm install ...`) | ❌ |
| Adicionar `plugins`, `themes` ou `presets` | ❌ |
| `markdown`, `future`, `i18n` | ❌ |
| `babel.config.js` | ❌ |

A lógica por trás: o servidor de desenvolvimento consegue trocar **dados** em
tempo real, mas não consegue se reconfigurar. Tudo que muda o *pipeline de build*
— plugins, temas, dependências — exige subir de novo.

💡 **A regra prática:** mudou a config e o site não reagiu em 2 segundos?
`Ctrl+C` e `npm start`. É barato e sempre funciona. Este guia avisa nos pontos em
que o reinício é obrigatório.

> **Se você achar tutorial dizendo que config nunca recarrega:** era verdade, e
> ainda é para quem escreve o config com `module.exports` (CommonJS). O template
> do Docusaurus 3 usa `export default`, e com ESM o hot reload funciona —
> [issue #9698](https://github.com/facebook/docusaurus/issues/9698). Se um dia
> você converter o arquivo para `module.exports`, perde esse ganho.

---

## Passo 4 — O tour pelas pastas

Compare com a tabela abaixo. Não precisa entender tudo agora — volte aqui quando
um módulo mencionar um arquivo.

```
Docusaurus/                     ← a raiz do repositório Git
├── .gitignore
├── README.md
├── LICENSE
├── guide/                      📖 este guia
└── website/                    ← o site Docusaurus
    ├── blog/                   📝 Posts do blog
    ├── docs/                   📚 A documentação (o coração do site)
    ├── src/
    │   ├── components/         ⚛️  Componentes React que você cria
    │   ├── css/custom.css      🎨 CSS global e cores do tema
    │   └── pages/              📄 Páginas soltas (fora de /docs e /blog)
    ├── static/                 📦 Arquivos servidos como estão (imagens, PDFs)
    │   └── img/
    ├── docusaurus.config.js    ⚙️  Configuração do site inteiro
    ├── sidebars.js             🧭 O menu lateral da documentação
    ├── package.json            📋 Dependências e comandos
    ├── package-lock.json       🔒 As versões exatas instaladas — vai pro Git
    ├── node_modules/           🚫 Dependências instaladas
    ├── .docusaurus/            🚫 Cache de build
    └── build/                  🚫 O site gerado — aparece no primeiro build
```

🚫 = **gerada**, não escrita por você. Nunca edite à mão, nunca commite. As três
estão no `.gitignore` pelo mesmo motivo: um comando as reconstrói inteiras
(`npm install` recria a primeira, `npm run build` as outras duas).

Essa é também a razão de elas não precisarem de backup. Se um dia você apagar as
três por engano, não perdeu nada — só tempo de reinstalar.

### As quatro pastas que importam

**`docs/`** — cada arquivo `.mdx` vira uma página em `/docs/...`. É onde você vai
passar 90% do tempo.

**`src/pages/`** — páginas independentes, sem menu lateral. Um arquivo
`src/pages/about.md` vira a URL `/about`. A home do site é o `src/pages/index.js`.

**`static/`** — cópia literal para a raiz do site. `static/img/logo.svg` fica
acessível em `/img/logo.svg`. Coloque aqui imagens, PDFs, fontes.

**`src/components/`** — seus componentes React. Só entra em cena no Módulo 08.

### Os dois arquivos de configuração

**`docusaurus.config.js`** define o site: título, URL, o menu de cima (navbar),
o rodapé, as cores do realce de código, quais plugins estão ativos.

📄 Abra e repare em três coisas que já vêm preenchidas:

```js
future: {
  v4: true, // Improve compatibility with the upcoming Docusaurus v4
},

onBrokenLinks: 'throw',

organizationName: 'facebook', // Usually your GitHub org/user name.
projectName: 'docusaurus',    // Usually your repo name.
```

- **`future.v4`** liga antecipadamente os comportamentos da versão 4 — inclusive
  o bundler rápido (rspack). É o padrão do template e vamos manter.
- **`onBrokenLinks: 'throw'`** faz o build **falhar** se houver link interno
  quebrado. Módulo 04 explica por que isso é bom.
- **`organizationName` / `projectName`** ainda são os do Docusaurus. Você troca
  no Módulo 12, quando for publicar.

**`sidebars.js`** define apenas o menu lateral da documentação. Por padrão:

```js
const sidebars = {
  tutorialSidebar: [{type: 'autogenerated', dirName: '.'}],
};
```

Ou seja: "monte o menu sozinho, lendo a estrutura da pasta `docs/`". É a
configuração mais prática para começar, e a que vamos manter até o Módulo 07.

---

## Passo 5 — Os comandos do projeto

Estão declarados no `package.json`. Os que importam:

| Comando | O que faz | Quando usar |
|---|---|---|
| `npm start` | Servidor de desenvolvimento com hot reload | O tempo todo, enquanto escreve |
| `npm run build` | Gera o site final na pasta `build/` | Antes de publicar, e para validar |
| `npm run serve` | Serve a pasta `build/` localmente | Para conferir o site final |
| `npm run clear` | Apaga o cache (`.docusaurus`, `build`) | Quando algo estranho acontece |
| `npm run swizzle` | Copia um componente do tema para você editar | Módulo 08 |

### `npm start` e `npm run build` não são a mesma coisa

Esta distinção economiza muita dor de cabeça:

| | `npm start` | `npm run build` |
|---|---|---|
| Velocidade | Rápido, incremental | Lento, faz tudo |
| Links quebrados | Ignora | **Falha o build** |
| Otimização | Nenhuma | Minifica, gera HTML estático |

Ou seja: **um site pode funcionar perfeitamente no `npm start` e falhar no
`npm run build`**. Por isso, rode o build de vez em quando — ele é o seu
verificador de qualidade.

💻 Experimente agora. Pare o servidor primeiro (`Ctrl+C`), para os dois não
disputarem o cache:

```powershell
npm run build
```

👀 Deve terminar com `[SUCCESS] Generated static files in "build".`

💻 Suba o servidor de novo:

```powershell
npm start
```

---

## Passo 6 — Registrar no Git

O site nasceu. Hora da primeira foto dele.

💻 Volte para a raiz do repositório:

```powershell
cd ..
git status
```

👀 O Git deve listar `website/` como não rastreada — e **não** deve mencionar
`node_modules`, `build` nem `.docusaurus`. Se mencionar, revise o `.gitignore`
(Módulo 01, Passo 4).

💻

```powershell
git add .
git status
```

👀 Confira a lista. Você deve ver os arquivos do template — `docusaurus.config.js`,
`package.json`, `package-lock.json`, `docs/`, `blog/`, `src/`, `static/` — e nada
das três pastas geradas.

💻

```powershell
git commit -m "feat: scaffold Docusaurus classic site"
git push
```

👀 Veja no GitHub: a pasta `website` apareceu.

> **O `package-lock.json` vai para o Git?** Vai, sempre. Ele registra a versão
> exata de cada uma das ~1200 dependências. É o que faz `npm install` reproduzir
> o mesmo resultado na sua máquina e no servidor de publicação.

---

## ✅ Checkpoint

- [x] `http://localhost:3000` abre o site de exemplo
- [x] Você sabe quais três pastas são geradas e por que nunca entram no Git
- [x] Você achou a página do `intro.mdx` no site (navbar → **Tutorial**)
- [x] Você editou `website/docs/intro.mdx` e viu a mudança sem recarregar
- [x] A página tem **um** título grande, não dois
- [x] Você sabe parar o servidor (`Ctrl+C`) e subir de novo (`npm start`)
- [x] `npm run build` termina com SUCCESS
- [x] `website/` está no GitHub, sem `node_modules`
- [x] Você sabe dizer, de cabeça, para que serve `docs/`, `static/` e `sidebars.js`

---

## 🎯 Exercício

**1. Dê nome ao site**

⚠️ Atenção a uma pegadinha do template: **`'My Site'` aparece duas vezes no
arquivo**, e os dois campos são independentes. Trocar um não troca o outro.

| Onde | O que controla |
|---|---|
| `title`, no topo do arquivo | A aba do navegador, o `<title>` do HTML, o cartão social |
| `themeConfig.navbar.title` | Só o texto ao lado do logo, na barra de cima |

Eles são separados de propósito: é comum o site se chamar "Nimbus Documentation"
e a navbar mostrar só "Nimbus", que é curto e cabe no celular.

📄 **No topo do arquivo** — os valores do template são `'My Site'` e
`'Dinosaurs are cool'`:

```js
title: 'Nimbus',
tagline: 'Sync your data without thinking about it',
```

📄 **Dentro de `themeConfig.navbar`** — mais dois `'My Site'`:

```js
navbar: {
  title: 'Nimbus',
  logo: {
    alt: 'Nimbus logo',
    src: 'img/logo.svg',
  },
```

O `alt` é o texto que leitores de tela anunciam e que aparece se a imagem falhar.
Deixar "My Site Logo" ali é o tipo de sobra que ninguém vê até alguém precisar.

📄 **Dentro de `footer`**, no fim:

```js
copyright: `Copyright © ${new Date().getFullYear()} Nimbus. Built with Docusaurus.`,
```

**2. Confirme o hot reload da config**

Salve **sem** parar o servidor e olhe o navegador.

👀 "Nimbus" aparece na barra de cima **e** na aba do navegador, sozinho, sem
reiniciar. É a tabela do [Passo 3](#o-que-recarrega-sozinho-e-o-que-não): esses
campos são dados, e dados recarregam.

💡 Se a navbar continuou dizendo "My Site", você trocou só o `title` do topo. É
exatamente a pegadinha do item 1 — volte e troque o `navbar.title` também.

O primeiro reinício obrigatório só vai aparecer no Módulo 06, quando você
instalar um pacote. O guia avisa na hora.

**3. Ache o que ainda é do template**

💻

```powershell
Select-String -Path "docusaurus.config.js" -Pattern "facebook|My Site|Dinosaurs|My Project"
```

👀 Devem sobrar **só** as linhas de `organizationName`, `projectName` e as duas de
`editUrl` — todas com `facebook`. Deixe como estão: o Módulo 12 arruma essas.

⚠️ Se ainda aparecer algum `My Site`, é o `navbar.title` ou o `logo.alt` do item
1. Este comando é a rede de segurança contra a pegadinha — use-o sempre que
achar que terminou de renomear alguma coisa.

**4. Commite**

```powershell
cd ..
git add .
git commit -m "feat: set site title and tagline"
git push
```

**Como saber que deu certo:**

- A aba do navegador mostra "Nimbus", não "My Site"
- A barra de cima, ao lado do logo, também mostra "Nimbus"
- O `Select-String` do item 3 não encontra mais nenhum `My Site`
- O rodapé não diz mais "My Project, Inc."
- `npm run build` continua passando
- `git log --oneline` mostra três commits

---

## 📌 O que você aprendeu

Um projeto Docusaurus é uma pasta com conteúdo em Markdown, dois arquivos de
configuração e um servidor de desenvolvimento. `npm start` é para escrever,
`npm run build` é para validar e publicar. Três pastas são geradas
(`node_modules`, `.docusaurus`, `build`) e por isso ficam fora do Git — um comando
reconstrói qualquer uma delas. E o hot reload cobre dados, não o pipeline de build.

➡️ Próximo: [Módulo 03 — Sua primeira página](./03-first-page.md)
