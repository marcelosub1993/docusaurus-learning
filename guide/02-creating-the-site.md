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

---

## Passo 2 — Tirar as pastas de cache do OneDrive

Lembra do [Módulo 00, Passo 4](./00-environment-setup.md#passo-4--a-pasta-do-projeto-e-o-problema-do-onedrive)?
Três pastas de cache não podem sincronizar no OneDrive. Agora é a hora.

💻 Entre em `website` e rode o bloco inteiro:

```powershell
cd website
$local = "C:\dev\docusaurus-local\website"

New-Item -ItemType Directory -Force "$local\.docusaurus", "$local\build", "$local\node_modules-cache" | Out-Null

foreach ($p in @(".docusaurus", "build", "node_modules\.cache")) {
  if (Test-Path $p) { Remove-Item -Recurse -Force $p }
}

New-Item -ItemType Junction -Path ".docusaurus"         -Target "$local\.docusaurus"        | Out-Null
New-Item -ItemType Junction -Path "build"               -Target "$local\build"              | Out-Null
New-Item -ItemType Junction -Path "node_modules\.cache" -Target "$local\node_modules-cache" | Out-Null
```

O `foreach` existe porque um junction não pode ser criado por cima de uma pasta
que já existe. Se for a sua primeira vez, ele não remove nada — as três ainda não
nasceram.

💻 Confirme que os três viraram junction:

```powershell
Get-ChildItem -Force | Where-Object { $_.LinkType } | Format-Table Name, LinkType -AutoSize
Get-Item "node_modules\.cache" -Force | Select-Object Name, LinkType, Target
```

👀 `.docusaurus` e `build` na primeira tabela, `node_modules\.cache` na segunda —
os três com `LinkType` = `Junction`.

> **Não precisa de administrador.** Junction é diferente de link simbólico:
> qualquer usuário cria. Se algum comando pedir elevação, você digitou
> `SymbolicLink` em vez de `Junction`.

### E o `node_modules`?

Ele **não** entra nessa lista, e o motivo é uma limitação do npm que vale
conhecer: se `node_modules` for um junction, o `npm install` **apaga o junction**
e cria uma pasta de verdade no lugar. Você veria isto no terminal:

```
npm warn reify Removing non-directory C:\...\website\node_modules
```

O npm verifica se `node_modules` é um diretório real antes de extrair os pacotes,
e remove qualquer coisa que não seja. É comportamento deliberado, documentado no
[issue #3669 do npm](https://github.com/npm/cli/issues/3669) — e o caso de uso
citado lá é exatamente este, gente tentando tirar a pasta da nuvem. Não tem como
contornar.

Então o `node_modules` vai sincronizar mesmo — cerca de 250 MB e 30 mil arquivos.
Isso é um custo de **volume**: a primeira sincronização demora e consome cota.

⚠️ Mas repare que o problema **grave** — os builds que quebram com erro sem
sentido — vem das pastas de *cache*, não do `node_modules` em si. E essas o npm
não gerencia, então os junctions delas sobrevivem a todo `npm install`. É por isso
que essa solução parcial resolve a maior parte do risco.

⚠️ A exceção: se você um dia apagar o `node_modules` inteiro para reinstalar do
zero, o junction de `.cache` vai junto. Rode o bloco deste passo de novo depois do
`npm install` — ele é idempotente, feito para isso. O
[Módulo 99](./99-troubleshooting.md#os-junctions-sumiram-depois-de-um-npm-install)
repete o procedimento.

💡 Se a sincronização te incomodar, o atalho é pausar o OneDrive antes de
instalar pacotes: clique no ícone da nuvem na bandeja → **Pausar sincronização →
2 horas**. Rode o `npm install`, e despause quando terminar.

---

## Passo 3 — Subir o site

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

## Passo 4 — Ver a mágica do hot reload

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

⚠️ Uma exceção importante: mudanças em **`docusaurus.config.js`** exigem parar
(`Ctrl+C`) e rodar `npm start` de novo. Se você mexeu na config e nada aconteceu,
é isso. O mesmo vale depois de instalar qualquer pacote novo.

---

## Passo 5 — O tour pelas pastas

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
    ├── node_modules/           🚫 Dependências — nunca edite, nunca versione
    │   └── .cache/             🔗 junction → C:\dev  (cache do bundler)
    ├── .docusaurus/            🔗 junction → C:\dev  (cache de build)
    └── build/                  🔗 junction → C:\dev  (o site gerado)
```

🔗 = junction, ou seja, mora fisicamente fora do OneDrive (Passo 2).
🚫 = nunca editar à mão e nunca commitar.

⚠️ Repare que `node_modules` é 🚫 mas **não** é 🔗: ela sincroniza no OneDrive,
porque o npm não aceita que ela seja junction. Só a `.cache` de dentro dela fica
de fora. As três 🔗 e a `node_modules` estão todas no `.gitignore`, pelo mesmo
motivo: são geradas, não escritas.

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

## Passo 6 — Os comandos do projeto

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

## Passo 7 — Registrar no Git

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

- [ ] `http://localhost:3000` abre o site de exemplo
- [ ] `.docusaurus`, `build` e `node_modules\.cache` são junctions apontando para `C:\dev\`
- [ ] Você sabe explicar por que o `node_modules` **não** é junction
- [ ] Você achou a página do `intro.mdx` no site (navbar → **Tutorial**)
- [ ] Você editou `website/docs/intro.mdx` e viu a mudança sem recarregar
- [ ] A página tem **um** título grande, não dois
- [ ] Você sabe parar o servidor (`Ctrl+C`) e subir de novo (`npm start`)
- [ ] `npm run build` termina com SUCCESS
- [ ] `website/` está no GitHub, sem `node_modules`
- [ ] Você sabe dizer, de cabeça, para que serve `docs/`, `static/` e `sidebars.js`

---

## 🎯 Exercício

**1. Dê nome ao site**

📄 Em `website/docusaurus.config.js`, troque três campos. Os valores do template
são `'My Site'`, `'Dinosaurs are cool'` e `'My Project, Inc.'`:

```js
title: 'Nimbus',
tagline: 'Sync your data without thinking about it',
```

E, mais abaixo, dentro de `footer`:

```js
copyright: `Copyright © ${new Date().getFullYear()} Nimbus. Built with Docusaurus.`,
```

**2. Confirme a pegadinha do Passo 5**

Salve **sem** parar o servidor e olhe o navegador. Nada muda — o
`docusaurus.config.js` não tem hot reload. Agora `Ctrl+C`, `npm start`, e o nome
aparece na navbar e na aba do navegador.

**3. Ache o que ainda é do template**

💻

```powershell
Select-String -Path "docusaurus.config.js" -Pattern "facebook|My Site|Dinosaurs|My Project"
```

👀 Devem sobrar as linhas de `organizationName`, `projectName` e as duas de
`editUrl`. Deixe como está — o Módulo 12 arruma essas.

**4. Commite**

```powershell
cd ..
git add .
git commit -m "feat: set site title and tagline"
git push
```

**Como saber que deu certo:**

- A aba do navegador mostra "Nimbus", não "My Site"
- O rodapé não diz mais "My Project, Inc."
- `npm run build` continua passando
- `git log --oneline` mostra três commits

---

## 📌 O que você aprendeu

Um projeto Docusaurus é uma pasta com conteúdo em Markdown, dois arquivos de
configuração e um servidor de desenvolvimento. `npm start` é para escrever,
`npm run build` é para validar e publicar. As pastas geradas ficam fora do
OneDrive por junction e fora do Git por `.gitignore` — pelo mesmo motivo.

➡️ Próximo: [Módulo 03 — Sua primeira página](./03-first-page.md)
