# Módulo 99 — Solução de problemas

> Os erros que você vai encontrar, a causa real de cada um, e o conserto.
> Consulte por sintoma.

⬅️ [Índice do guia](./README.md)

---

## Antes de qualquer coisa: os três comandos

Na dúvida, nesta ordem:

```powershell
npm run clear      # 1. limpa o cache
npm run build      # 2. mostra os erros de verdade (o start esconde alguns)
```

```powershell
Remove-Item -Recurse -Force node_modules, package-lock.json   # 3. último recurso
npm install
```

O passo 2 é o mais subestimado: **o `npm start` ignora links quebrados**. Muito
"problema misterioso" aparece nomeado e explicado no `npm run build`.

⚠️ Se você usa junctions (Módulo 02), o passo 3 **apaga o junction**, não a pasta
de destino. Recrie o junction antes de rodar `npm install` de novo — veja
[Apaguei o `node_modules` e perdi o junction](#apaguei-o-node_modules-e-perdi-o-junction).

---

## Erros de Git e GitHub

### `fatal: refusing to merge unrelated histories`

**Causa:** você criou o repositório no GitHub **com** README, `.gitignore` ou
licença, e também tem commits locais. São dois históricos que nunca se
encontraram.

**Conserto**, quando o local é o que vale:

```powershell
git push --force-with-lease origin main
```

⚠️ Isso descarta o que o GitHub criou. Só faça se você tiver certeza de que
aqueles arquivos não importam. A alternativa segura é mesclar:

```powershell
git pull origin main --allow-unrelated-histories
```

**Prevenção:** crie o repositório vazio, como diz o
[Módulo 01, Passo 2](./01-git-and-github.md#passo-2--criar-o-repositório-no-github).

### `Updates were rejected because the remote contains work that you do not have locally`

**Causa:** alguém — ou você, pela interface do GitHub — commitou lá algo que não
está aqui.

**Conserto:**

```powershell
git pull
git push
```

Se o `pull` gerar conflito, o Git marca os trechos no arquivo com `<<<<<<<`,
`=======` e `>>>>>>>`. Edite, apague os marcadores, e:

```powershell
git add .
git commit
```

### `Author identity unknown` / `Please tell me who you are`

**Causa:** `user.name` ou `user.email` não configurados.

**Conserto:** [Módulo 01, Passo 1](./01-git-and-github.md#passo-1--configurar-o-git).

### `fatal: not a git repository`

**Causa:** você está numa pasta que não é o repositório — quase sempre dentro de
`website/` achando que está na raiz, ou o contrário.

**Conserto:**

```powershell
pwd
cd "C:\Users\marce\OneDrive\Documents\Docusaurus"
```

O `.git` fica **só na raiz**. Comandos Git funcionam de qualquer subpasta, desde
que a raiz esteja acima.

### `Authentication failed` no push

**Causa:** o GitHub removeu autenticação por senha em 2021. Sua senha da conta
não funciona no Git.

**Conserto:** o Git Credential Manager, que vem junto com o Git for Windows,
resolve isso abrindo o navegador. Se ele não abrir:

```powershell
git config --global credential.helper manager
```

E tente o push de novo. Se ainda falhar, apague a credencial errada: menu Iniciar
→ **Gerenciador de Credenciais** → Credenciais do Windows → remova a entrada
`git:https://github.com`.

### `src refspec main does not match any`

**Causa:** você tentou `git push` antes de fazer qualquer commit. Não existe
branch `main` ainda — ela nasce com o primeiro commit.

**Conserto:** `git add .` e `git commit -m "..."` primeiro.

### Commitei o `node_modules` sem querer

**Sintoma:** o push demora uma eternidade, ou o GitHub reclama do tamanho.

**Conserto:**

```powershell
git rm -r --cached node_modules
git commit -m "chore: stop tracking node_modules"
git push
```

O `--cached` remove do Git e **mantém no disco**. Sem ele, você apaga os arquivos
de verdade.

⚠️ Isso para de rastrear daqui pra frente, mas os arquivos continuam no histórico
antigo. Enquanto o repositório é seu e pequeno, tudo bem. Se incomodar, o
caminho é reescrever o histórico — mais trabalho do que vale a pena agora.

### `warning: LF will be replaced by CRLF`

**Não é erro.** É o `core.autocrlf true` fazendo o trabalho dele. Pode ignorar.

### Apaguei o `node_modules` e perdi o junction

**Sintoma:** `npm install` funciona, mas as dependências voltaram a ficar dentro
do OneDrive — e a sincronização enlouqueceu.

**Conserto:**

```powershell
cd "C:\Users\marce\OneDrive\Documents\Docusaurus\website"
Remove-Item -Recurse -Force node_modules
$local = "C:\dev\docusaurus-local\website"
New-Item -ItemType Directory -Force "$local\node_modules" | Out-Null
New-Item -ItemType Junction -Path "node_modules" -Target "$local\node_modules" | Out-Null
npm install
```

💻 Confira sempre com:

```powershell
Get-ChildItem -Force | Where-Object { $_.LinkType } | Format-Table Name, LinkType
```

---

## Erros de sidebar

### `Invalid sidebar file at "sidebars.js". These sidebar document ids do not exist`

```
These sidebar document ids do not exist:
- reference

Available document ids are:
- intro
- installation
- syntax-reference
```

**Causa:** o id que você escreveu no `sidebars.js` não corresponde a nenhum
documento. Quase sempre porque:

1. Você renomeou ou moveu o arquivo, ou
2. O arquivo tem `id:` no front matter, que **substitui** o id derivado do nome
   do arquivo.

**Conserto:** a mensagem já lista os ids válidos. Ou use o id certo no
`sidebars.js`, ou remova o `id:` do front matter. Não faça os dois.

⚠️ **O `slug` não muda o id.** Uma página com `slug: /faq-licensing` continua
tendo o id `faq/licensing`. Veja o
[Módulo 07, Passo 2](./07-navigation-and-sidebar.md#passo-2--descobrir-os-ids).

### `Can't find any sidebar with id "tutorialSidebar"`

**Causa:** você renomeou a sidebar no `sidebars.js` e esqueceu de atualizar o
`sidebarId` do item da navbar no `docusaurus.config.js`.

**Conserto:** os dois nomes precisam bater. Veja o
[Módulo 07, Passo 1](./07-navigation-and-sidebar.md#passo-1--ver-o-que-está-lá).

### Uma página sumiu do menu, mas a URL ainda abre

**Causa:** você assumiu o controle do `sidebars.js` e não listou aquela página.
Não é erro — é o comportamento correto.

**Conserto:** liste a página, ou use `{type: 'autogenerated', dirName: 'pasta'}`
para a pasta inteira. Se usar `autogenerated`, isso nunca acontece — é a maior
vantagem dele.

---

## Erros de link

### `Docusaurus found broken links!`

O build lista cada link e a página de origem. Causas, em ordem de frequência:

**1. Barra na frente do caminho de arquivo**

```mdx
[Errado](/installation.mdx)
[Certo](./installation.mdx)
```

Com barra, o Docusaurus entende URL, não caminho de arquivo.

**2. Caminho de arquivo dentro de prop JSX**

```jsx
<Card to="./installation.mdx">     ← não funciona
<Card to="/docs/installation">     ← certo
```

A conversão caminho→URL só acontece em links **Markdown**. Props recebem o valor
cru.

**3. Link para conteúdo que você desligou ou renomeou**

Desligou o blog (`blog: false`) mas deixou `{to: '/blog'}` na navbar. Ou renomeou
uma página e esqueceu do rodapé.

**4. Link do template que sobrou**

O `src/pages/index.js` aponta para `/docs/intro`. Se você deu `slug: /` ao
`intro.mdx`, essa rota não existe mais.

> **Não resolva desligando.** `onBrokenLinks: 'ignore'` faz o erro sumir e o site
> quebrar para o usuário. O erro está te protegendo.

### O build passou, mas a âncora não leva a lugar nenhum

**Causa:** `onBrokenAnchors` é `'warn'` por padrão, não `'throw'`. Âncora quebrada
só avisa.

**Conserto:** leia os avisos do terminal. Para ser rigoroso:

```js
onBrokenAnchors: 'throw',
```

---

## Erros de MDX

### `Unexpected character` / `Could not parse expression with acorn`

**Causa:** um `{` ou `<` solto no texto. Em MDX, `{` inicia uma expressão
JavaScript e `<` inicia uma tag.

**Conserto:** coloque em crase (`` `{example}` ``), em bloco de código, ou escape
com `\{`.

⚠️ Isso vale para arquivos `.md` também — no Docusaurus 3 eles passam pelo MDX
por padrão. Veja o [Módulo 05, Passo 8](./05-admonitions-and-code.md#passo-8--o-que-realmente-acontece).

### O comentário HTML quebrou o build

**Causa:** `<!-- comentário -->` não existe em MDX. E como no Docusaurus 3 todo
arquivo é MDX por padrão, **isso quebra em `.md` também** — mesmo que tutoriais
antigos digam o contrário.

**Conserto:** `{/* comentário */}`.

Se você realmente precisa de Markdown puro naquele arquivo:

```js title="docusaurus.config.js"
markdown: {
  format: 'detect',
},
```

Aí `.md` volta a ser CommonMark e `.mdx` continua MDX.

### O HTML que colei não formatou nada

**Causa:** você usou `class=` em vez de `className=`.

Em MDX, HTML é JSX. `class` é ignorado silenciosamente — sem erro, sem aviso, só
o layout que não acontece.

**Conserto:** `className`. E lembre que propriedades CSS em `style` são objeto e
camelCase:

```jsx
<div className="row" style={{marginTop: 16}}>
```

### `Expected a closing tag for <img>`

**Causa:** em JSX toda tag precisa fechar. `<img src="x">` é inválido.

**Conserto:** `<img src="x" />`. Vale para `<br />`, `<hr />`, `<input />`.

### O Markdown dentro de `<TabItem>` apareceu como texto cru

**Causa:** falta linha em branco entre a tag JSX e o conteúdo Markdown.

**Conserto:**

````mdx
<TabItem value="a" label="A">

```powershell
npm start
```

</TabItem>
````

A linha em branco antes e depois é obrigatória.

### `Expected component Tabs to be defined`

**Causa:** você usou `<Tabs>` sem importar.

**Conserto:** no topo do arquivo, depois do front matter:

```mdx
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

### A admonition apareceu como texto com dois-pontos

**Causa:** a sintaxe de título mudou no Docusaurus 3. `:::tip Título` (com
espaço) não funciona mais.

**Conserto:** `:::tip[Título]`.

---

## Erros de servidor e build

### `Panic occurred at runtime` / `ModuleGraphModule ... not found` (rspack)

```
panicked at crates\rspack_core\src\module_graph\mod.rs:
ModuleGraphModule with identifier ...cssExtractHmr.js not found
```

**Causa:** bug do rspack no hot reload, quase sempre disparado por cache
persistente inconsistente. **Pastas sincronizadas são a causa mais comum** — a
sincronização mexe nos arquivos de cache enquanto o bundler os usa.

O template do Docusaurus 3 vem com `future: {v4: true}`, que liga o rspack por
padrão. Por isso este erro ficou comum.

**Conserto, em ordem:**

1. Limpar o cache:

   ```powershell
   npm run clear
   ```

2. Confirmar que os junctions existem (é a solução de verdade):

   ```powershell
   Get-ChildItem -Force | Where-Object { $_.LinkType } | Format-Table Name, LinkType
   ```

   Se `.docusaurus` e `node_modules` não aparecerem como `Junction`, veja
   [Apaguei o `node_modules` e perdi o junction](#apaguei-o-node_modules-e-perdi-o-junction).

3. Se voltar mesmo com junctions, desligue o cache persistente:

   ```js
   future: {
     v4: true,
     faster: {
       rspackPersistentCache: false,
     },
   },
   ```

4. Se ainda voltar, volte para o webpack — mais lento, mais estável:

   ```js
   future: {
     v4: true,
     faster: {
       rspackBundler: false,
       rspackPersistentCache: false,
     },
   },
   ```

> `rspackPersistentCache` exige `rspackBundler: true`. Se desligar o bundler,
> desligue os dois.

### `Port 3000 is already in use`

**Causa:** um `npm start` anterior ficou rodando, ou outro programa ocupou a porta.

**Conserto:**

```powershell
npm start -- --port 3001
```

Ou mate o processo:

```powershell
Get-NetTCPConnection -LocalPort 3000 | Select-Object OwningProcess
Stop-Process -Id <NUMERO> -Force
```

### Mudei o `docusaurus.config.js` e nada aconteceu

**Causa:** esse arquivo não tem hot reload.

**Conserto:** `Ctrl+C` e `npm start` de novo. Vale também para `sidebars.js` em
alguns casos, e sempre depois de instalar um pacote.

### `ReferenceError: window is not defined`

**Causa:** o Docusaurus renderiza as páginas no Node durante o build, onde
`window` e `document` não existem.

**Conserto:**

```jsx
import BrowserOnly from '@docusaurus/BrowserOnly';

<BrowserOnly>{() => <ComponentThatUsesWindow />}</BrowserOnly>
```

Repare que o filho é uma **função**. Ou mova o código para um *client module*
([Módulo 11, Passo 7](./11-advanced-features.md#passo-7--código-executando-no-navegador)).

### `JavaScript heap out of memory`

**Causa:** site grande demais para a memória padrão do Node.

**Conserto:**

```powershell
$env:NODE_OPTIONS = "--max-old-space-size=8192"
npm run build
```

### A busca não aparece

**Causa:** a busca local só funciona no site buildado.

**Conserto:**

```powershell
npm run build
npm run serve
```

O mesmo vale para o plugin de redirects.

---

## Erros de instalação

### Erro de rede ou proxy no npm

Sintomas: `ETIMEDOUT`, `ECONNRESET`, `unable to get local issuer certificate`.

**Causa:** rede corporativa com proxy ou inspeção de certificado.

**Conserto** (peça os valores ao time de infraestrutura):

```powershell
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080
npm config set registry https://registry.npmjs.org/
```

Se o erro for de certificado, o time pode fornecer o CA da empresa:

```powershell
npm config set cafile C:\caminho\para\certificado.pem
```

⚠️ **Não use `npm config set strict-ssl false`.** Ele resolve desligando a
verificação de segurança das suas dependências.

### `ERESOLVE unable to resolve dependency tree`

**Causa:** conflito de versões entre pacotes.

**Conserto:** primeiro, garanta que todos os `@docusaurus/*` estão na mesma versão:

```powershell
npm ls @docusaurus/core
```

Se o conflito for com um pacote de terceiros que ainda não declara suporte à sua
versão do React ou do Docusaurus:

```powershell
npm install nome-do-pacote --legacy-peer-deps
```

Use com parcimônia — é uma exceção, não o padrão. E é o sintoma típico de plugin
da comunidade atrasado em relação ao Docusaurus.

### `'node' não é reconhecido como comando`

**Causa:** o Node foi instalado mas o terminal não recarregou o `PATH`.

**Conserto:** feche e abra o terminal. Se persistir, feche o VS Code **inteiro**
— ele herda o ambiente de quando foi aberto.

O mesmo vale para `git` e `npm`.

---

## Problemas de aparência

### O site publicado abriu sem CSS, com tudo desalinhado

**Causa:** `baseUrl` errado. É o problema de publicação mais comum, disparado.

**Conserto:** veja o
[Módulo 12, Passo 2](./12-build-and-deploy.md#passo-2--configurar-as-urls-o-passo-que-todo-mundo-erra).
Confirme com `F12` → aba Network: os arquivos `.css` estão dando 404 num caminho
que não existe.

### As imagens quebraram só no site publicado

**Causa:** caminho de imagem escrito à mão dentro de JSX, sem `useBaseUrl`. Local
funciona porque o `baseUrl` é `/`; publicado, não.

**Conserto:**

```jsx
<img src={useBaseUrl('/img/logo.svg')} />
```

Veja o [Módulo 06, Passo 6](./06-images-and-icons.md#para-que-serve-o-usebaseurl).

### A imagem não aparece nem localmente

**Causa mais comum:** o caminho inclui `static/`. O correto é `/img/photo.png`,
não `/static/img/photo.png`.

**Segunda mais comum:** maiúsculas. `Logo.PNG` e `logo.png` são arquivos
diferentes num servidor Linux, mesmo que o Windows não diferencie. O site funciona
na sua máquina e quebra em produção — e o GitHub Pages roda em Linux.

### Minha cor customizada não aplicou

**Causas possíveis:**

1. O CSS do tema tem prioridade maior. Prefira mudar a **variável**
   (`--ifm-color-primary`) em vez de escrever um seletor.
2. Você criou `styles.css` em vez de `styles.module.css` num componente — aí a
   classe é global e pode estar colidindo com uma do tema.
3. Você definiu só no `:root` e está olhando no modo escuro.
4. Cache do navegador: `Ctrl+Shift+R`.

### O favicon não mudou

Cache do navegador. `Ctrl+Shift+R`, ou abra numa janela anônima.

### O `respectPrefersColorScheme` não está funcionando

**Causa:** você já clicou no botão de tema alguma vez, e a sua escolha manual fica
salva no navegador — ela ganha da preferência do sistema.

**Conserto:** teste numa janela anônima.

---

## Erros no GitHub Actions

### O workflow falha em `npm ci`

**Causa mais comum:** o `package-lock.json` não está commitado, ou está
dessincronizado do `package.json`.

**Conserto:**

```powershell
cd website
npm install
cd ..
git add website/package-lock.json
git commit -m "chore: sync package-lock.json"
git push
```

**Segunda causa:** o `cache-dependency-path` do workflow aponta para o lugar
errado. Como o site está em `website/`, tem que ser `website/package-lock.json`.

### O workflow falha em `npm run build`

Não é problema do CI. É o mesmo erro que você veria localmente — o CI só é mais
honesto que o `npm start`.

**Conserto:** rode `npm run build` na sua máquina, leia a mensagem, conserte, e
faça push.

### `Error: Failed to create deployment (status: 404)`

**Causa:** o GitHub Pages não está configurado como "GitHub Actions".

**Conserto:** Settings → Pages → Source → **GitHub Actions**. Veja o
[Módulo 12, Passo 4](./12-build-and-deploy.md#passo-4--ligar-o-github-pages).

### `Resource not accessible by integration`

**Causa:** faltam as permissões no workflow.

**Conserto:** o bloco `permissions` com `pages: write` e `id-token: write`, como
no [Módulo 12, Passo 5](./12-build-and-deploy.md#passo-5--o-workflow-de-publicação).

---

## Avisos que não são erros

Estes aparecem no terminal, o site funciona, e você pode resolver quando quiser —
mas cada um aponta para uma prática melhor.

| Aviso | O que fazer |
|---|---|
| `blog authors ... are not defined in "authors.yml"` | Declare o autor ([Módulo 10](./10-blog-and-pages.md#passo-5--autores)) |
| `Tags [x] used in ... are not defined in tags.yml` | Declare a tag ([Módulo 10](./10-blog-and-pages.md#passo-6--tags)) |
| `blog posts without truncation markers` | Adicione `{/* truncate */}` no post |
| `Docs markdown link couldn't be resolved` | Um link `./file.mdx` apontando para arquivo inexistente |
| `warning: LF will be replaced by CRLF` | Nada. É o Git normalizando as quebras de linha. |

Todos os primeiros podem ser silenciados com `'ignore'` nas opções do plugin —
mas resolver é melhor. Um build sem nenhum aviso é uma meta alcançável, e vale a
pena.

---

## Como pedir ajuda

Quando nada aqui resolver, o que incluir no pedido:

1. O comando exato que você rodou
2. A mensagem de erro **completa**, incluindo o stack trace
3. A saída de `npx docusaurus --version` e `node -v`
4. O que você mudou logo antes de quebrar

Onde perguntar:

- [Discord do Docusaurus](https://discord.gg/docusaurus) — respostas rápidas
- [GitHub Discussions](https://github.com/facebook/docusaurus/discussions)
- [Stack Overflow, tag `docusaurus`](https://stackoverflow.com/questions/tagged/docusaurus)

---

⬅️ Voltar ao [índice do guia](./README.md)
