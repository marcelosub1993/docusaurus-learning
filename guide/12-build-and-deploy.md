# Módulo 12 — Build e publicação

> **Objetivo:** gerar o site final corretamente e colocá-lo no ar, publicando
> automaticamente a cada push.
> **Tempo:** ~50 min
> **Pré-requisito:** [Módulo 11](./11-advanced-features.md)

---

## Passo 1 — Entender o que o build produz

💻 Dentro de `website`:

```powershell
npm run build
```

👀 A pasta `build/` se preenche. Olhe o conteúdo:

```
build/
├── index.html
├── docs/
│   ├── index.html              ← a Overview, por causa do slug: /
│   ├── installation/index.html
│   └── ...
├── blog/
├── assets/          ← CSS e JS com hash no nome
├── img/             ← cópia de static/
└── sitemap.xml
```

São **arquivos estáticos**. Não há banco de dados, não há Node rodando, não há
processo para monitorar. Qualquer servidor web serve isso — ou um bucket S3, um
IIS, até um SharePoint.

💻 Confira localmente antes de publicar:

```powershell
npm run serve
```

Isso serve a pasta `build/` em `http://localhost:3000`, exatamente como será em
produção. **É diferente do `npm start`** — aqui não há hot reload, e o que você vê
é o produto final. É também o único lugar onde a busca local e os redirects
funcionam.

---

## Passo 2 — Configurar as URLs (o passo que todo mundo erra)

📄 No `docusaurus.config.js`, quatro campos precisam corresponder ao destino real:

```js
url: 'https://marcelosub1993.github.io',
baseUrl: '/docusaurus-learning/',
organizationName: 'marcelosub1993',
projectName: 'docusaurus-learning',
trailingSlash: false,
```

| Campo | O que é |
|---|---|
| `url` | O domínio, **sem** barra no fim |
| `baseUrl` | O caminho dentro do domínio, **com** barra no início e no fim |
| `organizationName` | Seu usuário ou organização no GitHub |
| `projectName` | O nome do repositório |
| `trailingSlash` | Se as URLs terminam com `/`. Defina explicitamente. |

### Como escolher o `baseUrl`

| Endereço final do site | `url` | `baseUrl` |
|---|---|---|
| `https://marcelosub1993.github.io/docusaurus-learning/` | `https://marcelosub1993.github.io` | `/docusaurus-learning/` |
| `https://docs.company.com/` | `https://docs.company.com` | `/` |
| `https://company.com/docs/` | `https://company.com` | `/docs/` |

⚠️ **Este é o erro nº 1 de publicação.** Com o `baseUrl` errado, o site abre mas
o CSS não carrega e todos os links levam para 404 — aquela cara de HTML dos anos
90. O motivo é simples: o HTML procura `/assets/main.css` quando o arquivo está
em `/docusaurus-learning/assets/main.css`.

💻 Teste o `baseUrl` localmente **antes** de publicar:

```powershell
npm run build
npm run serve
```

👀 O `serve` abre em `http://localhost:3000/docusaurus-learning/`. Navegue por
cinco páginas. Se alguma imagem quebrar, é `useBaseUrl` faltando dentro de JSX
(Módulo 06, Passo 6) — e é exatamente por isso que o guia insistiu naquilo.

> **Por que definir `trailingSlash`?** Sem definir, o Docusaurus usa o padrão e
> deixa o servidor decidir — e servidores diferentes decidem diferente. O
> resultado é um link que funciona local e dá 404 publicado. `false` funciona bem
> no GitHub Pages.

---

## Passo 3 — A checklist antes de publicar

Rode esta lista toda vez. Leva 5 minutos e evita retrabalho público.

- [ ] `npm run build` termina com SUCCESS, sem avisos que você não entenda
- [ ] `onBrokenLinks: 'throw'` continua ligado (não desligue para "resolver" erro)
- [ ] `url`, `baseUrl`, `organizationName` e `projectName` correspondem ao destino
- [ ] `title`, `tagline` e `favicon` são os seus, não os do template
- [ ] O `copyright` do rodapé não diz "My Project, Inc."
- [ ] O `image:` do cartão social não é o do Docusaurus
- [ ] Os `editUrl` apontam para o seu repositório
- [ ] Os links de Stack Overflow/Discord/X do template foram removidos
- [ ] `npm run serve` e você navegou por 5 páginas, incluindo uma com imagem
- [ ] Testou o modo escuro
- [ ] Testou numa janela estreita (celular)
- [ ] A busca funciona

💻 Um jeito rápido de achar sobras do template:

```powershell
Select-String -Path "docusaurus.config.js" -Pattern "facebook|My Site|Dinosaurs|My Project|docusaurus-social-card|your-docusaurus-site"
```

👀 O ideal é **nenhum resultado**.

---

## Passo 4 — Ligar o GitHub Pages

Faça isso no site, uma vez:

1. Vá em <https://github.com/marcelosub1993/docusaurus-learning/settings/pages>
2. Em **Source**, escolha **GitHub Actions** (não "Deploy from a branch")
3. Pronto — não tem botão de salvar

⚠️ Escolher "Deploy from a branch" é o caminho antigo. Ele funciona, mas exige uma
branch `gh-pages` com o site buildado commitado dentro — arquivo gerado no Git,
justamente o que o Módulo 01 disse para não fazer. Prefira Actions.

---

## Passo 5 — O workflow de publicação

Agora o robô. Ele roda no GitHub a cada push na `main`: instala, builda e publica.

⚠️ **Atenção ao caminho.** O workflow fica em `.github/workflows/` na **raiz do
repositório**, não dentro de `website/`. E como o site mora numa subpasta, o
workflow precisa saber disso.

💻 Na raiz do repositório:

```powershell
cd "C:\Users\marce\OneDrive\Documents\Docusaurus"
New-Item -ItemType Directory -Force .github\workflows | Out-Null
```

📄 Crie `.github/workflows/deploy.yml`:

```yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: website
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: website/package-lock.json
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: website/build

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Lendo o arquivo por partes:

| Bloco | O que faz |
|---|---|
| `on.push.branches` | Dispara a cada push na `main` |
| `permissions` | O mínimo que o robô precisa para publicar. Sem isso, falha com erro de permissão. |
| `concurrency` | Se dois pushes acontecerem juntos, o segundo espera — não publica pela metade |
| `defaults.run.working-directory` | Faz todo `run:` acontecer dentro de `website/` |
| `cache-dependency-path` | Onde está o `package-lock.json`, para o cache do npm funcionar |
| `upload-pages-artifact.path` | O caminho a partir da **raiz** do repositório — este **não** obedece o `working-directory` |
| `deploy` | Um job separado, que só roda se o `build` passar |

> **`npm ci` em vez de `npm install`:** instala exatamente as versões do
> `package-lock.json`, sem atualizar nada, e é mais rápido. É o comando correto em
> automação. Ele exige que o `package-lock.json` esteja commitado — que é o que
> você fez no Módulo 02.

---

## Passo 6 — O workflow de verificação

Publicar automaticamente é ótimo até você quebrar o site sem perceber. Um segundo
workflow, que só **builda** (sem publicar), vira seu verificador de links
quebrados.

📄 Crie `.github/workflows/test-deploy.yml`:

```yml
name: Test build

on:
  pull_request:
    branches: [main]

jobs:
  test-build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: website
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: website/package-lock.json
      - run: npm ci
      - run: npm run build
```

Repare no gatilho: `on: pull_request`. Este workflow **não roda** em push direto
na `main` — ele só existe para verificar mudanças *antes* de elas entrarem.

Ou seja: enquanto você commitar direto na `main`, ele nunca vai disparar. É por
isso que o Passo 9 muda o seu fluxo de trabalho. Sem PR, este arquivo é
decoração.

---

## Passo 7 — Publicar

💻 Na raiz do repositório:

```powershell
git add .
git commit -m "ci: publish to GitHub Pages on every push to main"
git push
```

👀 Vá em <https://github.com/marcelosub1993/docusaurus-learning/actions>. O
workflow "Deploy to GitHub Pages" está rodando. Clique nele e acompanhe.

👀 Quando terminar (2 a 4 minutos), o job `deploy` mostra a URL. Ou acesse direto:

```
https://marcelosub1993.github.io/docusaurus-learning/
```

🎉 Seu site está no ar.

⚠️ **Se o site abrir sem CSS**, é o `baseUrl`. Volte ao Passo 2. Não é
coincidência este ser o aviso mais repetido do módulo.

⚠️ **Se o workflow falhar em `npm run build`**, leia o log: é o mesmo erro que
você veria localmente. Rode `npm run build` na sua máquina, conserte, e faça push
de novo. O CI não tem erro próprio — ele só é mais honesto que o `npm start`.

---

## Passo 8 — Colocar o badge no README

Agora sim: o badge existe de verdade e diz a verdade.

📄 No `README.md` da raiz, logo abaixo do título:

```md
[![Deploy to GitHub Pages](https://github.com/marcelosub1993/docusaurus-learning/actions/workflows/deploy.yml/badge.svg)](https://github.com/marcelosub1993/docusaurus-learning/actions/workflows/deploy.yml)
```

📄 E adicione o link do site no topo, onde quem chega vê primeiro:

```md
🌐 **[Ver o site publicado](https://marcelosub1993.github.io/docusaurus-learning/)**
```

📄 Também vale adicionar a URL no campo **Website** do "About" do repositório
(a engrenagem do Módulo 01, Passo 8).

---

## Passo 9 — A partir de agora: branch e Pull Request

Alguma coisa mudou de verdade nos últimos passos, e vale parar para reconhecer.

Até o Módulo 11, quebrar a `main` não custava nada: o erro aparecia no seu
terminal, você consertava, ninguém via. Agora **todo push na `main` republica o
site público**. O mesmo link quebrado passa a ser um 404 que outras pessoas
encontram.

É exatamente a fronteira das duas fases do
[Módulo 01, Passo 11](./01-git-and-github.md#a-regra-deste-guia-duas-fases). Daqui
pra frente, você trabalha em branch e mescla por Pull Request — e o
`test-deploy.yml` do Passo 6, que até agora nunca rodou, finalmente ganha função.

### O ciclo, uma vez, de verdade

Vamos fazer uma mudança real: acrescentar o link do site publicado no README.

💻 **1. Crie a branch e entre nela**

```powershell
cd "C:\Users\marce\OneDrive\Documents\Docusaurus"
git switch -c docs/add-live-site-link
```

👀 `Switched to a new branch 'docs/add-live-site-link'`

O `-c` é de *create*. Sem ele, o `switch` só troca para uma branch que já existe.

📄 **2. Faça a mudança**

No `README.md`, na seção "What's in here", adicione uma linha apontando para o
site no ar:

```md
🌐 **[Live site](https://marcelosub1993.github.io/docusaurus-learning/)** — the
practice site, published automatically from `main`.
```

💻 **3. Commite e envie a branch**

```powershell
git add .
git commit -m "docs: link the published site from the README"
git push -u origin docs/add-live-site-link
```

⚠️ O `-u origin <branch>` é necessário aqui. A branch é nova e o GitHub ainda não
a conhece — sem isso, o Git responde
`fatal: The current branch has no upstream branch` e te dá o comando certo.

👀 A saída do push traz um link pronto:

```
remote: Create a pull request for 'docs/add-live-site-link' on GitHub by visiting:
remote:      https://github.com/marcelosub1993/docusaurus-learning/pull/new/docs/add-live-site-link
```

🌐 **4. Abra o Pull Request**

Clique naquele link (ou vá no repositório — aparece um banner amarelo
"Compare & pull request").

Na tela do PR:

- **Title** — o GitHub sugere a mensagem do commit. Serve.
- **Description** — escreva o *porquê*, não o *o quê*. O diff já mostra o quê.
- Clique em **Create pull request**

👀 **5. Espere o check**

Na parte de baixo do PR aparece uma caixa de verificações. O `test-deploy.yml`
está rodando:

| Estado | Significa |
|---|---|
| 🟡 `Test build — In progress` | Buildando. Leva 2 a 4 minutos. |
| ✅ `All checks have passed` | O build passou. Pode mesclar. |
| ❌ `Test build — Failing` | O build quebrou. **Não mescle.** Clique em "Details" e leia o log. |

Este é o ponto do módulo inteiro: o build rodou **antes** de a `main` ser tocada.
O site público continua intacto enquanto o PR está aberto.

🌐 **6. Mescle**

Com o check verde, clique em **Merge pull request** → **Confirm merge**.

👀 O GitHub oferece **Delete branch** logo depois. Aceite — a branch já cumpriu o
papel dela, e branch morta acumulada é sujeira.

👀 Vá em Actions. Agora sim o `Deploy to GitHub Pages` disparou, porque houve um
push na `main`. Em poucos minutos o site republica com o README novo.

💻 **7. Volte para a `main` e sincronize**

Este passo é fácil de esquecer e gera confusão depois: sua `main` local ainda não
tem o merge que aconteceu no GitHub.

```powershell
git switch main
git pull
git branch -d docs/add-live-site-link
```

👀 `git log --oneline -3` mostra o commit do README no topo.

O `git branch -d` apaga a cópia local da branch. Ele só funciona se as mudanças
já estiverem incorporadas — se você errar a branch, o Git recusa e avisa. É uma
proteção, não um obstáculo.

### Opcional: fazer o GitHub cobrar isso de você

Enquanto for só disciplina, um dia você vai commitar direto na `main` no
automático. Dá para o GitHub impedir.

1. Vá em **Settings → Branches** (em algumas contas o caminho é
   **Settings → Rules → Rulesets**)
2. Crie uma regra para a branch `main`
3. Marque:
   - **Require a pull request before merging**
   - **Require status checks to pass before merging** → e selecione **Test build**

👀 A partir daí, `git push` direto na `main` é **recusado pelo servidor**, com
uma mensagem explicando que a branch é protegida.

⚠️ Faça isso só depois de o `test-deploy.yml` ter rodado pelo menos uma vez —
o GitHub só lista um check na configuração depois de conhecê-lo.

> **Vale a pena num repositório de uma pessoa só?** Vale, por um motivo: você está
> aprendendo o fluxo que vai usar em equipe. Deixar a regra ligada aqui faz o
> hábito se formar sozinho, sem depender de você lembrar.

---

## Passo 10 — As outras formas de publicar

GitHub Pages não é a única opção. Se um dia o destino for outro:

### Servidor web interno (IIS, Apache, Nginx)

O caminho mais comum em empresa.

1. `npm run build`
2. Copie **o conteúdo** da pasta `build/` para a pasta pública do servidor
3. Ajuste `baseUrl` se o site não estiver na raiz do domínio

💻 Compactar para enviar:

```powershell
Compress-Archive -Path build\* -DestinationPath site.zip -Force
```

⚠️ Copie o *conteúdo* de `build/`, não a pasta `build` inteira — senão o site
fica em `/build/` e nada funciona.

### Netlify, Vercel, Cloudflare Pages

Os mais simples para site público com domínio próprio. Conecte o repositório e
informe:

- **Base directory:** `website`
- **Build command:** `npm run build`
- **Publish directory:** `website/build`

Cada push na branch principal republica sozinho.

### Publicação manual pelo próprio Docusaurus

Ainda existe, e serve para um deploy rápido sem CI:

```powershell
$env:GIT_USER = "marcelosub1993"
npm run deploy
```

Ele builda e faz push para a branch `gh-pages`. Requer que o Pages esteja
configurado como "Deploy from a branch". Funciona, mas commita arquivo gerado —
prefira o workflow do Passo 5.

### SharePoint / rede interna

Funciona, com uma ressalva: alguns ambientes não servem corretamente arquivos
`.js` e `.css` de subpastas, ou não fazem *fallback* de rota. Se o site abrir sem
estilo, o problema quase sempre é `baseUrl` ou MIME type — não o Docusaurus.

---

## Passo 11 — Manutenção

**Atualizar o Docusaurus:**

```powershell
npm install @docusaurus/core@latest @docusaurus/preset-classic@latest
npm run clear
npm run build
```

Atualize todos os pacotes `@docusaurus/*` **juntos, sempre** — versões misturadas
causam erros difíceis de diagnosticar. Se você instalou o `@docusaurus/theme-mermaid`
no Módulo 11, ele entra na mesma linha.

💻 Para conferir se ficou tudo alinhado:

```powershell
npm ls @docusaurus/core
```

**Antes de atualizar**, confira se os plugins da comunidade (a busca local) já
suportam a versão nova. Eles são o gargalo típico.

**Se algo quebrar depois de atualizar:** leia o
[changelog do Docusaurus](https://docusaurus.io/changelog). Mudanças que quebram
compatibilidade são sempre documentadas lá.

---

## ✅ Checkpoint

- [ ] `npm run build` e `npm run serve` funcionando
- [ ] `url`, `baseUrl`, `organizationName`, `projectName` e `trailingSlash` corretos
- [ ] A checklist do Passo 3 inteira marcada
- [ ] GitHub Pages com Source = GitHub Actions
- [ ] Os dois workflows commitados em `.github/workflows/`
- [ ] O site abre em `https://marcelosub1993.github.io/docusaurus-learning/`
- [ ] O badge do README está verde
- [ ] Você abriu, viu o check ficar verde, e mesclou pelo menos um Pull Request
- [ ] Sua `main` local está sincronizada (`git pull` depois do merge)
- [ ] A branch mesclada foi apagada, local e no GitHub
- [ ] Você entende por que `npm ci` e não `npm install` no CI
- [ ] Você sabe dizer por que o `test-deploy.yml` nunca rodava antes do Passo 9

---

## 🎯 Exercício

**1. Quebre o `baseUrl` de propósito**

Este é o exercício mais valioso do módulo. Quando o erro acontecer de verdade,
você vai reconhecer na hora.

📄 Mude `baseUrl` para `/wrong/`, e:

```powershell
npm run build
npm run serve
```

👀 Acesse `http://localhost:3000/wrong/`. O site abre **sem estilo nenhum**.

💻 Abra o console do navegador (`F12` → aba Network) e olhe: os arquivos `.css`
estão dando 404, num caminho que não existe.

📄 Agora desfaça e confirme que voltou.

**2. Quebre o build dentro de um Pull Request**

Agora que você tem o fluxo do Passo 9, este exercício acontece onde deveria: numa
branch, com o site público protegido o tempo todo.

💻 Crie a branch:

```powershell
git switch -c experiment/break-the-build
```

📄 Adicione um link para uma página inexistente em `website/docs/intro.mdx`:

```mdx
[This page does not exist](./ghost-page.mdx)
```

💻 Commite e envie — **sem** rodar `npm run build` antes. A graça é deixar o robô
achar:

```powershell
git add .
git commit -m "docs: add a deliberately broken link"
git push -u origin experiment/break-the-build
```

🌐 Abra o Pull Request pelo link que o push imprimiu.

👀 Espere o check. Ele fica **❌ vermelho**, e o e-mail do GitHub chega. Clique em
**Details** e leia o log: a mensagem é idêntica à que você veria rodando
`npm run build` na sua máquina.

👀 Agora repare em duas coisas, que são o ponto do exercício:

1. O botão de merge está desencorajado (ou **bloqueado**, se você criou a regra
   de proteção do Passo 9).
2. **O site público continua no ar, intacto.** Você quebrou o build e nenhum
   visitante viu nada. Compare com o que teria acontecido num push direto na
   `main`.

📄 Conserte na mesma branch — apague a linha do link:

```powershell
git add .
git commit -m "fix: remove the broken link"
git push
```

👀 O PR **atualiza sozinho** e o check roda de novo. Verde. Agora mescle, apague
a branch, e volte:

```powershell
git switch main
git pull
git branch -d experiment/break-the-build
```

**3. Confirme que o `.gitignore` está fazendo o trabalho**

💻 Na raiz:

```powershell
git status
```

👀 Depois de todos esses builds, nada de `build/`, `node_modules/` ou
`.docusaurus/` pode aparecer.

**4. Confira o zip**

```powershell
cd website
Compress-Archive -Path build\* -DestinationPath ..\site.zip -Force
```

Abra o zip e confirme que `index.html` está na **raiz** dele, não dentro de uma
pasta `build`. Depois apague o zip — ele não vai para o Git.

**5. Escreva o post final — pelo fluxo completo**

Este é o último, e é para você fazer o ciclo inteiro sozinho, sem consultar o
Passo 9.

📄 Numa branch nova (`docs/launch-post`), crie um post no blog anunciando que o
site está no ar, com o link real. Abra o PR, espere o verde, mescle, apague a
branch e sincronize a `main`.

👀 Espere o `Deploy to GitHub Pages` terminar e veja seu próprio post publicado,
no ar, escrito por você, no site que você construiu.

**Como saber que deu certo:**

- O site público abre com estilo, em `https://marcelosub1993.github.io/docusaurus-learning/`
- A busca e o modo escuro funcionam no site publicado
- O badge do README está verde
- A aba **Pull requests** do repositório mostra **3 PRs fechados** (o do Passo 9,
  o do build quebrado e o do post final)
- Você viu, pelo menos uma vez, o check vermelho **sem** o site público quebrar
- `git branch` lista só `main` — nenhuma branch morta sobrou
- `git status` na raiz responde `working tree clean`

---

## 📌 O que você aprendeu

O build gera HTML estático, hospedável em qualquer lugar. `url` e `baseUrl`
precisam corresponder ao endereço final, e errar isso é o problema de publicação
mais comum. Um workflow no GitHub Actions publica sozinho a cada push na `main`,
e um segundo workflow, que roda no Pull Request, é sua rede de segurança contra
links quebrados.

E foi aqui que o fluxo de trabalho mudou: com o site no ar, quebrar a `main`
passou a ter plateia. Branch + PR deixou de ser cerimônia e virou o mecanismo que
segura o erro antes de ele chegar no público.

---

## 🎓 Você terminou

Do zero até um site publicado, com tudo registrado no Git. O que fazer agora:

- **Escreva documentação de verdade.** A ferramenta você já domina; o difícil
  daqui pra frente é o texto, não o Docusaurus.
- **Consulte o [Módulo 99](./99-troubleshooting.md)** quando algo quebrar.
- **Leia a [documentação oficial](https://docusaurus.io/pt-BR/docs)** — ela é
  excelente e tem resposta para o que este guia não cobriu.
- **Mantenha o `guide/NOTES.md`.** Daqui a seis meses, ele vale mais que o guia.

E o repositório que você construiu é, ele próprio, um exemplo de repositório bem
feito: README que explica, licença, `.gitignore` correto, histórico legível,
publicação automática e mudanças verificadas antes de entrar. Isso é reaproveitável
em todo projeto seu daqui pra frente.
