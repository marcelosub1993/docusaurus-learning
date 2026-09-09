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
npx create-docusaurus@latest website classic --skip-install
```

Traduzindo o comando:

| Parte | Significado |
|---|---|
| `npx` | Baixa e roda um pacote sem instalá-lo permanentemente |
| `create-docusaurus@latest` | O gerador oficial, na versão mais recente |
| `website` | Nome da pasta que será criada, dentro do repositório |
| `classic` | O template — traz docs, blog, tema e tudo preparado |
| `--skip-install` | **Cria os arquivos mas não instala as dependências ainda** |

O `--skip-install` é o detalhe que faz o resto do módulo funcionar. Você precisa
que a pasta `node_modules` **ainda não exista** quando criar os junctions do
Passo 2. Se o gerador instalar tudo primeiro, você teria que apagar e refazer.

👀 Ele pergunta qual linguagem usar:

```
? Which language do you want to use?
❯ JavaScript
  TypeScript
```

Escolha **JavaScript** com as setas e Enter. TypeScript é ótimo, mas adiciona uma
camada de aprendizado que não ajuda agora.

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

## Passo 2 — Criar os junctions antes de instalar

Lembra do [Módulo 00, Passo 4](./00-environment-setup.md#passo-4--a-pasta-do-projeto-e-o-problema-do-onedrive)?
Três pastas não podem sincronizar no OneDrive. Agora é a hora.

💻 Primeiro, crie os destinos reais, fora do OneDrive:

```powershell
$local = "C:\dev\docusaurus-local\website"
New-Item -ItemType Directory -Force "$local\node_modules" | Out-Null
New-Item -ItemType Directory -Force "$local\.docusaurus" | Out-Null
New-Item -ItemType Directory -Force "$local\build" | Out-Null
```

💻 Agora entre em `website` e crie os três junctions:

```powershell
cd website
New-Item -ItemType Junction -Path "node_modules" -Target "$local\node_modules" | Out-Null
New-Item -ItemType Junction -Path ".docusaurus"  -Target "$local\.docusaurus"  | Out-Null
New-Item -ItemType Junction -Path "build"        -Target "$local\build"        | Out-Null
```

💻 Confirme que os três são junctions e não pastas comuns:

```powershell
Get-ChildItem -Force | Where-Object { $_.LinkType } | Format-Table Name, LinkType, Target -AutoSize
```

👀 Três linhas, todas com `LinkType` = `Junction` e o `Target` apontando para
`C:\dev\docusaurus-local\website\...`.

> **Não precisa de administrador.** Junction é diferente de link simbólico:
> qualquer usuário cria. Se algum comando pedir elevação, você digitou
> `SymbolicLink` em vez de `Junction`.

⚠️ Se você **não** quiser usar junctions, pule este passo inteiro. O site vai
funcionar igual — você só fica exposto à sincronização lenta e aos erros de cache
do [Módulo 99](./99-troubleshooting.md).

---

## Passo 3 — Instalar as dependências

💻 Ainda dentro de `website`:

```powershell
npm install
```

👀 Alguns minutos, uma barra de progresso, e no fim algo como
`added 1268 packages in 1m`.

💻 Confirme que as dependências foram parar fora do OneDrive:

```powershell
(Get-ChildItem "C:\dev\docusaurus-local\website\node_modules").Count
```

👀 Um número grande (centenas). Se der `0`, o junction não foi criado antes do
install — apague `node_modules` e refaça os Passos 2 e 3.

---

## Passo 4 — Subir o site

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

## Passo 5 — Ver a mágica do hot reload

💻 Em outro terminal:

```powershell
code "C:\Users\marce\OneDrive\Documents\Docusaurus"
```

Isso abre o repositório inteiro — `guide/` e `website/` lado a lado.

📄 Abra `website/docs/intro.mdx` e mude o título da primeira linha depois do
front matter, por exemplo para `# Welcome to Nimbus`. Salve com `Ctrl+S`.

👀 Olhe o navegador **sem recarregar a página**: o texto mudou sozinho.

Isso é *hot reload*. É o que torna o Docusaurus agradável de usar: você escreve e
vê o resultado imediatamente. Mantenha o `npm start` rodando o guia inteiro.

⚠️ Uma exceção importante: mudanças em **`docusaurus.config.js`** exigem parar
(`Ctrl+C`) e rodar `npm start` de novo. Se você mexeu na config e nada aconteceu,
é isso. O mesmo vale depois de instalar qualquer pacote novo.

---

## Passo 6 — O tour pelas pastas

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
    ├── node_modules/           🚫 junction — nunca edite, nunca versione
    ├── .docusaurus/            🚫 junction — cache de build
    └── build/                  🚫 junction — o site gerado
```

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

## Passo 7 — Os comandos do projeto

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

## Passo 8 — Registrar no Git

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
- [ ] `node_modules`, `.docusaurus` e `build` são junctions apontando para `C:\dev\`
- [ ] Você editou `website/docs/intro.mdx` e viu a mudança sem recarregar
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
