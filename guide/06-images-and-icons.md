# Módulo 06 — Imagens e ícones

> **Objetivo:** conhecer as formas de colocar imagem numa página e escolher a
> certa para cada caso. E resolver o problema dos ícones.
> **Tempo:** ~45 min
> **Pré-requisito:** [Módulo 05](./05-admonitions-and-code.md)

💻 Dentro de `website`, com `npm start` rodando.

---

## Passo 1 — Entender as duas pastas

Existem dois lugares para guardar imagem, e eles se comportam de forma diferente:

| Onde | Comportamento | Quando usar |
|---|---|---|
| `static/` | Copiada literalmente para a raiz do site | Logo, favicon, PDFs, imagens usadas em várias páginas |
| Junto do `.mdx` | Processada pelo bundler | Capturas de tela de uma página específica |

A diferença prática: arquivos processados pelo bundler ganham um hash no nome
(melhor para cache do navegador) e **o build falha se o arquivo não existir**.
Arquivos em `static/` são servidos como estão — se você errar o caminho, descobre
só quando alguém reclamar da imagem quebrada.

💻 Veja o que o template já trouxe:

```powershell
Get-ChildItem static\img | Select-Object Name, Length
```

👀 Sete arquivos: `logo.svg`, `favicon.ico`, `docusaurus.png`,
`docusaurus-social-card.jpg` e três ilustrações `undraw_*.svg`. Vamos usar
algumas delas.

---

## Passo 2 — Imagem externa (URL)

A mais simples. Sintaxe padrão do Markdown.

📄 Adicione em `docs/reference.mdx`:

```mdx
## Images

![A mountain landscape](https://picsum.photos/seed/nimbus/900/380)
```

👀 A imagem aparece ocupando a largura do conteúdo.

O texto entre colchetes é o **alt text** — lido por leitores de tela e exibido se
a imagem falhar. Não deixe vazio, e não escreva "image of": descreva o que
importa.

> **Cuidado:** se o servidor de origem sair do ar, a imagem some do seu site.
> Para conteúdo que importa, baixe o arquivo.

---

## Passo 3 — Baixar para `static/`

💻 Baixe uma imagem para dentro do projeto:

```powershell
Invoke-WebRequest -Uri "https://picsum.photos/seed/nimbus-ui/800/400" -OutFile "static\img\nimbus-dashboard.jpg"
```

📄 Agora referencie pelo caminho a partir da raiz do site:

```mdx
![The Nimbus status dashboard](/img/nimbus-dashboard.jpg)
```

👀 Repare: o caminho é `/img/nimbus-dashboard.jpg`, **não**
`/static/img/nimbus-dashboard.jpg`. A pasta `static` some — o conteúdo dela vira
a raiz do site.

---

## Passo 4 — Controlar o tamanho

Markdown puro não tem sintaxe de tamanho. Aqui o JSX resolve.

📄 Em `docs/reference.mdx`:

```jsx
<img
  src="/img/nimbus-dashboard.jpg"
  alt="Resized dashboard screenshot"
  style={{width: 320, borderRadius: 8}}
/>
```

⚠️ Repare em três coisas que são JSX, não HTML:

1. `style` recebe um **objeto** (`{{...}}`), não uma string. As chaves duplas são:
   as de fora dizem "isto é JavaScript", as de dentro são o objeto.
2. As propriedades CSS são camelCase: `borderRadius`, não `border-radius`.
3. A tag fecha sozinha: `/>`. Em JSX toda tag precisa fechar.

Se você escrever `<img src="..." >` sem a barra, o build quebra com
`Expected a closing tag for <img>`.

---

## Passo 5 — Imagem processada pelo bundler

📄 Adicione:

```jsx
<img
  src={require('@site/static/img/nimbus-dashboard.jpg').default}
  alt="Processed at build time"
  style={{width: 200}}
/>
```

`@site` é um atalho para a raiz do projeto (a pasta `website/`). O `require(...)`
faz o arquivo passar pelo pipeline de build.

💻 Teste a diferença — vale muito fazer este experimento:

📄 Troque o nome no `require` para um arquivo que não existe
(`nimbus-dashboard-typo.jpg`) e rode:

```powershell
npm run build
```

👀 **O build falha**, dizendo exatamente qual módulo não encontrou.

📄 Agora faça o mesmo erro no caminho do Passo 3 (`/img/typo.jpg`) e builde de
novo.

👀 **O build passa.** E a imagem quebra no site, silenciosamente.

Essa é a razão para preferir `require` em conteúdo crítico. 📄 Conserte os dois.

Para imagens que moram ao lado do `.mdx`, o caminho relativo já faz isso
automaticamente, sem `require`:

```mdx
![Sync diagram](./img/sync-flow.png)
```

---

## Passo 6 — Imagem que muda com o tema

Uma captura de tela clara fica horrível no modo escuro. O componente
`ThemedImage` resolve isso.

📄 No topo do arquivo, junto dos outros imports:

```mdx
import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';
```

📄 E no corpo:

```jsx
<ThemedImage
  alt="Illustration that follows the theme"
  sources={{
    light: useBaseUrl('/img/undraw_docusaurus_mountain.svg'),
    dark: useBaseUrl('/img/undraw_docusaurus_react.svg'),
  }}
  style={{width: 320}}
/>
```

👀 Clique no botão de sol/lua na navbar. A imagem troca.

### Para que serve o `useBaseUrl`

Hoje seu site roda em `http://localhost:3000/`, então `/img/logo.svg` funciona.
Mas no Módulo 12 ele vai para
`https://marcelosub1993.github.io/docusaurus-learning/`, e o caminho correto
passa a ser `/docusaurus-learning/img/logo.svg`.

`useBaseUrl` monta esse prefixo automaticamente. Use sempre que escrever um
caminho de imagem **dentro de JSX**.

> Em Markdown puro (`![](/img/x.png)`) o Docusaurus já faz esse ajuste sozinho.
> A preocupação é só dentro de JSX. Esquecer isso é uma das formas de o site
> funcionar local e quebrar publicado.

---

## Passo 7 — Imagem com legenda

```jsx
<figure style={{margin: 0}}>
  <img src="/img/nimbus-dashboard.jpg" alt="Sync architecture" style={{width: '100%'}} />
  <figcaption style={{textAlign: 'center', fontSize: '0.85rem', opacity: 0.7}}>
    Figure 1 — how a sync round-trip works.
  </figcaption>
</figure>
```

Numerar figuras manualmente dá trabalho, e repetir esse bloco em 20 páginas é
pior ainda. Se sua documentação tem muitas figuras, isso vira um componente —
você faz exatamente esse no exercício do
[Módulo 08](./08-components-and-layout.md#-exercício).

---

## Parte B — Ícones

O Docusaurus **não** vem com biblioteca de ícones. Quatro caminhos, do mais
simples ao mais completo.

### Passo 8 — Emoji

Zero dependência, e é o que a própria documentação oficial usa bastante.

📄 Adicione:

```mdx
## Platform support

| Platform | Status | Notes |
|---|:---:|---|
| Windows 11 | ✅ | Fully supported |
| Windows 10 | ⚠️ | Supported until January 2027 |
| macOS 13+ | ✅ | Fully supported |
| Linux (glibc < 2.31) | ❌ | Not supported |
| FreeBSD | 🚧 | In progress |
```

Vantagem: acessível, escalável, funciona em qualquer lugar — inclusive no
`sidebar_label` e no `label` da navbar. Desvantagem: o desenho exato muda de
sistema para sistema.

💻 Atalho para inserir emoji no Windows: `Win + .`

### Passo 9 — SVG como componente React

Qualquer `.svg` importado num arquivo de conteúdo vira um componente — e como o
SVG fica *inline* no HTML, você controla cor e tamanho por CSS.

📄 No topo:

```mdx
import Logo from '@site/static/img/logo.svg';
```

📄 No corpo:

```jsx
<Logo style={{width: 32, height: 32}} />
```

### Passo 10 — SVG escrito na página

Para um ícone único, sem virar arquivo. Note o `stroke="currentColor"`: ele faz o
ícone herdar a cor do texto ao redor, inclusive no modo escuro.

```jsx
<svg
  width="24" height="24" viewBox="0 0 24 24"
  fill="none" stroke="currentColor" strokeWidth="2"
  strokeLinecap="round" strokeLinejoin="round">
  <path d="M12 2L2 7l10 5 10-5-10-5z" />
  <path d="M2 17l10 5 10-5" />
</svg>
```

⚠️ Em JSX os atributos são camelCase: `strokeWidth`, `strokeLinecap`, `viewBox`.
Copiar SVG da internet e colar direto costuma quebrar por causa disso. Existem
conversores online de "SVG para JSX" que resolvem em um clique.

Fontes de SVG gratuitos: [Feather](https://feathericons.com/),
[Lucide](https://lucide.dev/), [Heroicons](https://heroicons.com/).

### Passo 11 — Biblioteca de ícones

Para um conjunto grande e consistente:

💻

```powershell
npm install react-icons
```

📄

```mdx
import {FiGithub, FiPackage} from 'react-icons/fi';

<FiGithub size={20} /> Repository
```

⚠️ Depois de instalar qualquer pacote, **pare e reinicie** o `npm start`.

💻 E lembre de commitar o `package.json` **e** o `package-lock.json` — os dois
mudaram.

---

## Passo 12 — Registrar no Git

💻

```powershell
cd ..
git add .
git commit -m "feat: add images, themed illustration and icon examples"
git push
cd website
```

---

## ✅ Checkpoint

- [ ] Uma imagem externa e uma de `static/img/`
- [ ] Uma imagem redimensionada via JSX
- [ ] Uma imagem via `require()`, e você **testou** que o build falha se ela sumir
- [ ] Você viu que o caminho de `static/` errado **não** derruba o build
- [ ] Um `ThemedImage` trocando com o botão de tema
- [ ] Uma tabela com emoji e um SVG inline com `currentColor`
- [ ] `npm run build` passa
- [ ] Commit feito

---

## 🎯 Exercício

Ilustre a página de instalação.

**1. Uma captura de tela validada no build**

💻 Baixe uma imagem qualquer para servir de captura:

```powershell
Invoke-WebRequest -Uri "https://picsum.photos/seed/nimbus-install/900/500" -OutFile "static\img\install-wizard.jpg"
```

📄 Em `docs/installation.mdx`, coloque-a **com `require()`**, dentro de um
`<figure>` com legenda, logo depois das abas.

Use o bloco do Passo 7 como base, trocando o `src` pela forma do Passo 5.

**2. Uma ilustração que segue o tema**

📄 Adicione um `ThemedImage` no topo da página, usando duas das ilustrações
`undraw_*.svg` que já vieram no template. Não esqueça dos dois imports.

**3. Uma tabela de compatibilidade**

📄 Reaproveite a tabela do Passo 8, adaptada para o que a página de instalação
precisa: uma linha por sistema operacional, com ✅ / ⚠️ / ❌.

**4. Um ícone que muda de cor sozinho**

📄 Coloque o SVG do Passo 10 imediatamente antes do texto de um `##`, assim:

```jsx
<h2><svg ... /> Requirements</h2>
```

👀 Troque para o modo escuro. O ícone tem que mudar de cor junto com o texto. Se
ele ficar preto no fundo escuro, você trocou `currentColor` por uma cor fixa.

**5. Valide e commite**

**Como saber que deu certo:**

- Renomear `install-wizard.jpg` faz `npm run build` **falhar** (desfaça depois)
- A ilustração do topo troca ao clicar no botão de tema
- O ícone do `##` acompanha a cor do título nos dois modos
- A legenda da figura aparece centralizada e menor que o texto normal
- `npm run build` passa

---

## 📌 O que você aprendeu

`static/` é cópia literal e falha em silêncio; `require()` é validado no build.
Dentro de JSX, use `useBaseUrl` para os caminhos — é o que evita imagem quebrada
quando o site sai do `localhost`. Ícone, no Docusaurus, é decisão sua: emoji
resolve muita coisa, SVG inline com `currentColor` dá controle e se adapta ao
tema, biblioteca dá consistência.

➡️ Próximo: [Módulo 07 — Navegação e sidebar](./07-navigation-and-sidebar.md)
