# Módulo 13 — Catálogo de recursos

> **Objetivo:** conhecer o que o Docusaurus faz além do que você construiu, para
> reconhecer a ferramenta quando o problema aparecer.
> **Tempo:** não tem — este módulo é de consulta.
> **Pré-requisito:** [Módulo 12](./12-build-and-deploy.md)

Os módulos 00 a 12 formam um caminho: cada um depende do anterior e o site cresce
junto. Este aqui é diferente. É um **catálogo**, como o Módulo 99, e serve para
uma pergunta só: *"dá para fazer X no Docusaurus?"*

Não há exercício. Leia os títulos uma vez para saber o que existe, e volte quando
precisar.

## Como cada item está organizado

| Campo | O que traz |
|---|---|
| **O que é** | Uma frase |
| **Quando vale** | A situação concreta — e quando **não** vale |
| **Como fazer** | O comando e o trecho de config, com o caminho |
| **Veredito** | ✅ vale quase sempre · ⚠️ depende · 🔬 curiosidade |

Todos os pacotes citados foram conferidos no npm em setembro de 2026, contra o
Docusaurus **3.10.2** — a versão do seu site. Onde a documentação oficial exige
uma versão específica, ela está escrita.

⚠️ **Os trechos de config dizem em que nível entram**, usando o mesmo mapa do
[Módulo 11](./11-advanced-features.md#antes-de-começar-o-mapa-do-docusaurusconfigjs).
Se você não tem esse mapa fresco na cabeça, abra numa aba antes de mexer.

---

# Parte A — Recursos de conteúdo

Coisas que você escreve **dentro das páginas**. É a parte com maior retorno,
porque não depende de instalar quase nada.

---

## A1 — Trechos reaproveitáveis (partials)

**O que é:** um arquivo `.mdx` cujo nome começa com `_` não vira página. Ele
existe para ser importado por outras páginas.

**Quando vale:** quando o mesmo parágrafo aparece em cinco lugares — um aviso de
pré-requisito, uma tabela de limites, um bloco de contato do time. Hoje, mudar
isso significa lembrar dos cinco lugares. Com partial, você muda num lugar só.

✅ **Para a documentação interna da empresa, este é provavelmente o recurso mais
útil deste módulo inteiro.** Documentação corporativa é cheia de repetição: o
mesmo aviso de acesso, a mesma janela de manutenção, o mesmo "fale com o time de
dados antes de alterar".

**Como fazer** — 📄 crie `docs/_sync-warning.mdx`:

```mdx
:::warning[Before you change this]
Changing the sync interval affects every machine in the workspace. Talk to the
data team before going below 5 minutes.
:::
```

📄 E em qualquer página que precise dele:

```mdx
import SyncWarning from '@site/docs/_sync-warning.mdx';

<SyncWarning />
```

👀 O aviso aparece. E `_sync-warning.mdx` **não** vira uma página em
`/docs/sync-warning` — o `_` impede.

### ⚠️ O caminho do import, que é onde todo mundo tropeça

Existem duas formas de escrever esse caminho, e a diferença importa:

| Forma | Ponto de partida | Quebra quando... |
|---|---|---|
| `'./_sync-warning.mdx'` | A pasta **do arquivo que importa** | Você move a página de pasta |
| `'@site/docs/_sync-warning.mdx'` | A pasta `website/` | Você move o **partial** |

O caminho relativo é contado a partir da página, **não** da pasta `docs/`. Então,
para o partial em `docs/_sync-warning.mdx`:

```mdx
docs/intro.mdx                    → './_sync-warning.mdx'
docs/faq/performance.mdx          → '../_sync-warning.mdx'
docs/faq/billing/invoices.mdx     → '../../_sync-warning.mdx'
```

Errar isso dá um erro claro, pelo menos:

```
Module not found: Can't resolve './_sync-warning.mdx' in '...\docs\faq'
```

👀 Repare que a mensagem diz **em que pasta** ele procurou. Compare com onde o
arquivo realmente está e você acha o número de `../` que falta.

💡 **Para um partial usado em muitos lugares, prefira `@site/`.** Um partial existe
justamente para ser importado de toda parte, e contar `../` em cinco páginas de
profundidades diferentes é trabalho sem motivo. O `@site/` é o mesmo atalho que
você usou no [Módulo 06](./06-images-and-icons.md#passo-5--imagem-processada-pelo-bundler)
com `require('@site/static/img/...')`.

💡 É a mesma lógica dos imports relativos do Python — `.` é o nível atual, `..`
sobe um. A diferença é que aqui o ponto de partida é a pasta do arquivo, não o
pacote.

### Partials com parâmetro

O partial recebe `props`, então o mesmo trecho pode variar:

📄 `docs/_retention-note.mdx`:

```mdx
Files are kept for {props.days} days on the **{props.plan}** plan.
```

📄 Uso:

```mdx
import RetentionNote from './_retention-note.mdx';

<RetentionNote days={30} plan="Team" />
<RetentionNote days={90} plan="Enterprise" />
```

⚠️ **Partial não entra na busca por conta própria.** Ele é colado dentro da página
que o importa, então é aquela página que aparece no resultado. Isso é o
comportamento desejado, mas surpreende quem espera achar o partial pesquisando.

**Veredito:** ✅ Vale quase sempre, e quanto maior a documentação, mais vale.

---

## A2 — Componente disponível em toda página, sem import

**O que é:** um arquivo que registra componentes no escopo global do MDX. Depois
disso, você usa `<Figure />` em qualquer página sem escrever o `import`.

**Quando vale:** quando um componente seu virou hábito. Você fez o `Figure` no
[Módulo 08](./08-components-and-layout.md) — se ele aparece em 20 páginas, são 20
linhas de `import` para manter. E se um dia você mover a pasta do componente,
precisa editar as 20.

**Como fazer** — 📄 crie `src/theme/MDXComponents.js`:

```jsx
import MDXComponents from '@theme-original/MDXComponents';
import Figure from '@site/src/components/Figure';

export default {
  // Keep everything the theme already provides
  ...MDXComponents,
  // Then add your own
  Figure,
};
```

📄 Agora, em qualquer página, sem import nenhum:

```mdx
<Figure src="/img/install-wizard.jpg" alt="Installer" caption="Figure 1" />
```

⚠️ **O `...MDXComponents` não é opcional.** Ele é o que preserva tudo que o tema
já mapeia — `<Tabs>`, os blocos de código, as admonitions. Se você esquecer o
spread e escrever só `{Figure}`, metade da sua documentação para de renderizar, e
o erro não aponta para este arquivo.

💡 `@theme-original` significa "a versão que o tema traz". É o mesmo mecanismo do
swizzle que você viu no
[Módulo 08](./08-components-and-layout.md#passo-11--swizzle-alterando-o-próprio-tema),
na modalidade *wrapping*: você não substitui o original, você embrulha.

**Veredito:** ✅ Vale assim que você tiver o segundo componente próprio.

---

## A3 — As três variáveis que toda página MDX já tem

**O que é:** dentro de um `.mdx` de documentação ou blog, três variáveis existem
sem você importar nada.

| Variável | O que contém |
|---|---|
| `frontMatter` | O front matter da própria página, como objeto |
| `toc` | A árvore de títulos da página |
| `contentTitle` | O primeiro `h1` — ou `undefined` se não houver |

**Quando vale:** para não repetir a mesma informação duas vezes na mesma página.

📄 Exemplo — o front matter vira texto visível:

```mdx
---
title: Sync API
api_version: 2.2
last_reviewed: '2026-09-01'
---

> API version **{frontMatter.api_version}** ·
> last reviewed on {frontMatter.last_reviewed}
```

⚠️ **As aspas em `'2026-09-01'` não são enfeite — sem elas o build quebra.** O YAML
lê uma data sem aspas como **tipo data**, e o React recusa renderizar um objeto:

```
Objects are not valid as a React child (found: [object Date])
```

💡 A regra que evita essa família inteira de problemas: **em front matter, ponha
aspas em tudo que você quer que seja texto.** Vale para data, para versão (`2.10`
sem aspas vira o número 2.1, perdendo o zero) e para códigos como `no`, que o YAML
entende como `false`.

👀 A linha aparece renderizada com os valores. Se você atualizar o front matter, o
texto acompanha — não existe a chance de um dizer 2.1 e o outro 2.2.

⚠️ Isso só funciona em `.mdx`. Num `.md` lido como CommonMark, as chaves `{ }` são
texto literal.

**Veredito:** ⚠️ Vale quando você tem metadado que também precisa ser lido na
página. Para documentação interna com data de revisão, é excelente.

---

## A4 — Admonitions customizadas

**O que é:** criar seus próprios tipos além de `note`, `tip`, `info`, `warning` e
`danger`.

**Quando vale:** quando sua documentação tem um tipo de aviso recorrente que não
cabe nos cinco padrão. Exemplos de documentação de dados: "este número vem de uma
tabela que atualiza às 6h", "este processo custa dinheiro ao rodar", "aprovado
pelo time de segurança em tal data".

**Como fazer** — são dois arquivos.

📄 **1.** Em `docusaurus.config.js`, dentro de `presets` → `classic` → `docs` (o
mesmo bloco do `sidebarPath`):

```js
docs: {
  sidebarPath: './sidebars.js',
  admonitions: {
    keywords: ['costly'],
    extendDefaults: true,
  },
},
```

⚠️ `extendDefaults: true` é o que **mantém** os cinco tipos originais. Sem ele,
`keywords` substitui a lista inteira e suas admonitions atuais somem.

📄 **2.** Crie `src/theme/Admonition/Types.js`:

```jsx
import DefaultAdmonitionTypes from '@theme-original/Admonition/Types';

function CostlyAdmonition(props) {
  return (
    <div className="admonition alert alert--warning">
      <div className="admonition-heading">
        <h5>{props.title ?? 'This costs money'}</h5>
      </div>
      <div className="admonition-content">{props.children}</div>
    </div>
  );
}

export default {
  ...DefaultAdmonitionTypes,
  costly: CostlyAdmonition,
};
```

📄 Uso:

```mdx
:::costly[Full reindex]
A full reindex scans every file in the workspace. On a large workspace this runs
for hours and shows up on the monthly bill.
:::
```

💡 Repare que reaproveitei as classes do Infima (`alert alert--warning`) em vez de
escrever CSS do zero. Assim a caixa já nasce respeitando o modo escuro.

⚠️ Este arquivo **não é swizzlable** — o comando `npm run swizzle` não o oferece.
Você cria na mão, no caminho exato `src/theme/Admonition/Types.js`.

**Veredito:** ⚠️ Vale quando o mesmo tipo de aviso aparece muitas vezes. Para um
aviso único, use `:::warning` e siga a vida.

---

## A5 — Equações matemáticas

**O que é:** LaTeX renderizado na página, via KaTeX.

**Quando vale:** quando a documentação explica um cálculo. Para engenharia de
dados isso aparece mais do que parece — definição de métrica, janela de retenção,
fórmula de amostragem, custo por consulta.

**Como fazer** — 💻 ⚠️ **de dentro de `website/`**:

```powershell
npm install remark-math@6 rehype-katex@7
```

⚠️ **As versões são obrigatórias.** A documentação oficial é explícita: o
Docusaurus v3 usa MDX v3, e isso exige `remark-math` 6 e `rehype-katex` 7. As
versões anteriores falham no build com erro de plugin incompatível.

📄 No **topo** do `docusaurus.config.js`, junto dos outros imports:

```js
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
```

📄 Em `presets` → `classic` → `docs`:

```js
docs: {
  sidebarPath: './sidebars.js',
  remarkPlugins: [remarkMath],
  rehypePlugins: [rehypeKatex],
},
```

📄 E no **nível raiz** do config, irmão de `presets` — é o CSS do KaTeX:

```js
stylesheets: [
  {
    href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
    type: 'text/css',
    integrity:
      'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
    crossorigin: 'anonymous',
  },
],
```

📄 Uso — um cifrão para fórmula na linha, dois para bloco:

```mdx
Retention cost grows with the number of files times the retention window.

$$
C = \sum_{i=1}^{n} s_i \times d \times r
$$
```

⚠️ **O `integrity` é uma trava de segurança**, não enfeite. Ele garante que o
arquivo vindo do CDN é exatamente o esperado. Se você trocar a versão do KaTeX na
URL e não trocar o hash junto, o navegador **recusa** carregar o CSS e as fórmulas
aparecem como texto cru. Copie os dois sempre em par.

⚠️ Se o site for interno e sem internet, o CDN não resolve. Nesse caso instale o
pacote `katex` e sirva o CSS a partir de `static/`.

**Veredito:** ⚠️ Vale se você documenta cálculo. Se não, é peso morto.

---

## A6 — Abas que ficam na URL

**O que é:** o `<Tabs>` que você usou no [Módulo 05](./05-admonitions-and-code.md)
aceita `queryString`. A aba escolhida vai para a barra de endereço.

**Quando vale:** quando alguém precisa mandar o link **já na aba certa**. "Segue o
passo a passo" seguido de "mas clica em Windows primeiro" é um atrito pequeno que
acontece toda semana.

📄 Como fazer:

```mdx
<Tabs groupId="operating-systems" queryString="os">
  <TabItem value="windows" label="Windows">...</TabItem>
  <TabItem value="macos" label="macOS">...</TabItem>
</Tabs>
```

👀 Clique numa aba e olhe o endereço: vira `?os=windows`. Esse link, colado no
chat, abre direto na aba do Windows.

⚠️ **Se a URL não mudar, confira em que versão você está olhando.** Com
versionamento ligado e `lastVersion: '1.0'`, editar `docs/installation.mdx` só
tem efeito em `/docs/next/installation` — o endereço `/docs/installation` serve a
cópia congelada, que ainda tem o `<Tabs>` antigo. O
[Módulo 99](./99-troubleshooting.md#a-edição-não-aparece-e-não-há-erro-nenhum)
detalha.

💡 Os dois se complementam: o `groupId` sincroniza todas as abas da página, o
`queryString` guarda a escolha no endereço.

**Veredito:** ✅ Custo zero, ganho real. Vale ligar em toda aba de sistema
operacional.

---

## A7 — Metadado livre por página

**O que é:** o front matter `sidebar_custom_props` aceita qualquer objeto, e ele
chega ao lado do cliente.

**Quando vale:** quando você quer marcar páginas e depois usar essa marca — um
selo de "novo", um aviso de "obsoleto", uma cor por time responsável.

📄 No front matter:

```mdx
---
title: Proxy support
sidebar_custom_props:
  badge: new
  owner: data-platform
---
```

Sozinho isso não faz nada visível. Ele fica útil quando combinado com um
componente próprio ou um swizzle da sidebar que lê a marca e desenha o selo.

**Veredito:** 🔬 Guarde o nome. No dia em que você quiser "um selinho de novo na
sidebar", é por aqui que começa — e sem ele o caminho é bem pior.

---

# Parte B — Estrutura e aparência

Mudanças na casca do site: navbar, sidebar, página de erro, índice lateral.

⚠️ **Aviso sobre CSS.** Você disse que não conhece CSS, então vale a regra: os
trechos desta parte foram testados, mas CSS depende de **quantos itens** você tem
na navbar e de **quão larga** é a tela. Sempre confira o resultado em pelo menos
duas larguras antes de aceitar. Onde eu medi de fato, está dito.

---

## B1 — Navbar com os links no centro

**O que é:** logo na esquerda, links de navegação centralizados, ações na direita.

**Quando vale:** é uma escolha estética. O padrão do Docusaurus agrupa tudo à
esquerda; centralizar dá um ar mais de site de produto e menos de documentação.

**Como fazer** — 📄 em `src/css/custom.css`:

```css
/* Center the navbar links on desktop only.
   997px is the breakpoint where Docusaurus switches to the mobile menu. */
@media (min-width: 997px) {
  .navbar__inner {
    position: relative;
  }

  .navbar__items:not(.navbar__items--right) {
    flex: 1;
    justify-content: center;
  }

  /* Pull the logo out of the flow so it does not push the links off-center */
  .navbar__items:not(.navbar__items--right) .navbar__brand {
    position: absolute;
    left: 0;
  }

  .navbar__items--right {
    position: absolute;
    right: 0;
  }
}
```

**O que medi no seu site**, numa janela de 1280px: sem o CSS, o grupo de links
ficava centrado em 384px. Com ele, em **633px** — o centro da página é 640px.
Funciona.

⚠️ **E aí veio o problema, que é o motivo de eu estar contando isso.** No **seu**
site os links passaram a **colidir** com o bloco da direita. A conta é simples:

| Região | Largura ocupada |
|---|---|
| Logo + nome | 116px |
| Links centralizados | 459px → 807px |
| Busca + versão + idioma + GitHub + tema | começa em **651px** |

Os links terminam em 807 e a direita começa em 651. Elas se sobrepõem em 156px.

💡 **A lição não é "esse CSS é ruim", é que navbar centralizada exige navbar
enxuta.** Centralizar só funciona se sobrar espaço vazio nas laterais. Com busca,
seletor de versão, seletor de idioma, link do GitHub e botão de tema, não sobra.

Se você quiser esse visual, primeiro reduza o que está na direita — por exemplo,
mover o link do GitHub para o rodapé, ou tirar o seletor de idioma enquanto houver
um idioma só.

**Veredito:** ⚠️ Depende inteiramente de quantos itens você tem. Aplique, olhe, e
esteja disposto a remover coisas da navbar.

---

## B2 — Navbar que some ao rolar

**O que é:** a barra desaparece quando você rola para baixo e volta quando rola
para cima.

**Quando vale:** em páginas longas, devolve altura de tela para o conteúdo. É um
recurso nativo — uma linha, sem CSS.

📄 Em `themeConfig` → `navbar`:

```js
navbar: {
  title: 'Nimbus',
  hideOnScroll: true,
  items: [ /* ... */ ],
},
```

**Veredito:** ✅ Uma linha, reversível, sem risco. Vale experimentar.

---

## B3 — Títulos de seção e separadores na sidebar

**O que é:** o tipo de item `html`, que injeta HTML direto na barra lateral.

**Quando vale:** quando a sidebar ficou longa e você quer agrupar visualmente sem
criar uma categoria clicável a mais. Categoria adiciona um nível de profundidade;
título de seção não adiciona nada — é só uma etiqueta.

📄 Em `sidebars.js`:

```js
const sidebars = {
  guideSidebar: [
    {
      type: 'html',
      value: 'Getting started',
      className: 'sidebar-section-title',
    },
    'intro',
    'installation',
    {
      type: 'html',
      value: '<hr />',
      defaultStyle: false,
    },
    {
      type: 'html',
      value: 'Daily use',
      className: 'sidebar-section-title',
    },
    'syntax-reference',
  ],
};
```

📄 E o estilo, em `src/css/custom.css`:

```css
.sidebar-section-title {
  padding: 1rem 0.75rem 0.25rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  opacity: 0.6;
}
```

| Campo | Para que serve |
|---|---|
| `value` | O HTML. Texto puro também vale |
| `className` | A classe CSS que você vai estilizar |
| `defaultStyle` | `true` faz o item parecer um link do menu. Para um título, deixe `false` |

⚠️ **O `value` é HTML cru, e é inserido sem passar por sanitização.** Como o
arquivo é seu, isso não é um problema de segurança — mas é um bom motivo para
nunca montar esse valor a partir de algo vindo de fora.

**Veredito:** ✅ Vale quando a sidebar passa de umas 12 linhas.

---

## B4 — Página 404 própria

**O que é:** a tela de "não encontrado" com a sua cara.

**Quando vale:** sempre que o site for público ou tiver links antigos circulando.
A 404 padrão é correta e completamente inútil — não oferece saída nenhuma. Uma 404
boa leva para a busca, para o índice e para o "fale com alguém".

📄 Crie `src/pages/404.js`:

```jsx
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function NotFound() {
  return (
    <Layout title="Page not found">
      <main className="container margin-vert--xl">
        <h1>This page does not exist</h1>
        <p>
          It may have been renamed or moved. These are the usual starting
          points:
        </p>
        <ul>
          <li><Link to="/docs/">Documentation home</Link></li>
          <li><Link to="/docs/installation">Installation guide</Link></li>
          <li><Link to="/blog">Release notes</Link></li>
        </ul>
        <p>
          If you got here from a link inside the documentation, please open an
          issue so we can fix it.
        </p>
      </main>
    </Layout>
  );
}
```

⚠️ **Não dá para testar no `npm start`** de forma confiável — o servidor de
desenvolvimento tem a própria tela de erro. Teste com `npm run build` +
`npm run serve` e acesse um endereço inventado.

💡 Uma 404 que lista os caminhos principais é o melhor remendo para links antigos
que você **não** mapeou com o plugin de redirects. Os dois trabalham juntos: o
redirect resolve o que você conhece, a 404 acolhe o resto.

**Veredito:** ✅ Vale sempre. É meia hora de trabalho que dura anos.

---

## B5 — Controlar o índice lateral do site inteiro

**O que é:** o "On this page" da direita respeita, por padrão, os títulos `h2` e
`h3`. Dá para mudar isso de uma vez para todas as páginas.

**Quando vale:** quando sua documentação usa muito `h4` e o índice está raso
demais, ou o contrário — páginas com dezenas de `h3` e um índice ilegível.

📄 Em `themeConfig`, no mesmo nível de `navbar` e `footer`:

```js
tableOfContents: {
  minHeadingLevel: 2,
  maxHeadingLevel: 4,
},
```

💡 Você já conhece o `toc_min_heading_level` / `toc_max_heading_level` do front
matter, que faz isso **por página** — está na sua `syntax-reference.mdx`. A regra
é a de sempre: o global define o padrão, o front matter manda naquela página.

**Veredito:** ✅ Vale ajustar uma vez, quando você perceber o padrão das suas
páginas.

---

## B6 — Categorias que se fecham sozinhas

**O que é:** ao abrir uma categoria da sidebar, as outras se fecham.

**Quando vale:** sidebars com muitas categorias, onde tudo aberto vira uma parede
de links.

📄 Em `themeConfig` → `docs` → `sidebar` (aquele bloco pequeno de três chaves que
o [Módulo 07](./07-navigation-and-sidebar.md) explica — **não** o de `presets`):

```js
docs: {
  sidebar: {
    hideable: true,
    autoCollapseCategories: true,
  },
},
```

**Veredito:** ⚠️ Divide opiniões. Ajuda em sidebar grande, atrapalha quem gosta de
comparar duas seções. Experimente e pergunte para quem usa.

---

# Parte C — Plugins oficiais que não vimos

Todos são `@docusaurus/*`, publicados na versão **3.10.2** — a mesma do seu site.
Plugin oficial acompanha o Docusaurus nas atualizações, o que é a principal razão
para preferir um deles quando existe a opção.

---

## C1 — O painel de debug

**O que é:** um plugin oficial que expõe, em páginas internas, tudo que o
Docusaurus sabe sobre o seu site.

🎁 **Você já tem ele ligado e provavelmente não sabia.** O `preset-classic` ativa
o plugin de debug automaticamente em desenvolvimento. Conferi no código do preset:

```js
if (debug || (debug === undefined && !isProd)) {
  plugins.push(require.resolve('@docusaurus/plugin-debug'));
}
```

**Como usar** — 💻 com o `npm start` rodando, abra:

| Endereço | O que mostra |
|---|---|
| `/__docusaurus/debug` | O painel inicial |
| `/__docusaurus/debug/config` | **O config final, já resolvido** |
| `/__docusaurus/debug/routes` | Todas as rotas geradas |
| `/__docusaurus/debug/metadata` | O metadado de cada página |
| `/__docusaurus/debug/registry` | Os módulos registrados |

💡 **O `/config` é o mais útil dos cinco, disparado.** Ele mostra a configuração
**depois** de o preset expandir tudo e aplicar os padrões. É a resposta definitiva
para "essa chave que eu escrevi está sendo lida?" — em vez de deduzir pelo
comportamento, você olha.

Aquele erro do seletor de versão, onde o bloco `docs` tinha ido parar dentro do
item da navbar, apareceria aqui na hora.

⚠️ **Em produção ele fica desligado**, e deve continuar assim: o painel expõe a
estrutura inteira do site. Se um dia você ligar de propósito (`debug: true` no
preset), lembre que vale para o site publicado também.

**Veredito:** ✅ Não precisa instalar nada. Só precisa lembrar que existe — por
isso está aqui.

---

## C2 — Site que funciona sem internet (PWA)

**O que é:** gera um *service worker* e transforma o site em algo instalável, que
continua abrindo offline.

**Quando vale:** documentação que precisa ser consultada onde a rede é ruim — um
chão de fábrica, um cliente, um avião. Também deixa o site "instalável", com ícone
próprio, como se fosse um aplicativo.

💻 ⚠️ **de dentro de `website/`**:

```powershell
npm install @docusaurus/plugin-pwa
```

📄 No **nível raiz**, dentro de `plugins`:

```js
plugins: [
  [
    '@docusaurus/plugin-pwa',
    {
      offlineModeActivationStrategies: [
        'appInstalled',
        'standalone',
        'queryString',
      ],
      pwaHead: [
        {tagName: 'link', rel: 'icon', href: '/img/logo.svg'},
        {tagName: 'link', rel: 'manifest', href: '/manifest.json'},
        {tagName: 'meta', name: 'theme-color', content: '#ffc629'},
      ],
    },
  ],
],
```

⚠️ **Dois requisitos que fazem esse plugin falhar em silêncio:**

1. **Precisa de HTTPS** para a instalação funcionar. O GitHub Pages serve HTTPS, então
   ali está resolvido. Numa intranet em HTTP puro, a parte de instalar não roda.
2. **Precisa de um `static/manifest.json` válido.** O plugin não cria esse arquivo
   para você — ele só aponta para ele.

⚠️ **Service worker guarda cache de verdade**, e isso tem um custo: depois de
publicar uma atualização, quem já visitou pode continuar vendo a versão antiga até
recarregar. Para documentação que muda toda semana, pense duas vezes.

**Veredito:** ⚠️ Vale para um caso específico — documentação consultada offline.
Não ligue "porque é legal".

---

## C3 — Analytics

**O que é:** dois plugins oficiais, um para o Google Analytics 4 (`gtag`) e outro
para o Google Tag Manager.

**Quando vale:** quando você precisa saber **quais páginas ninguém lê**. Para
documentação isso é mais útil do que parece: página com muito acesso e pouco tempo
de leitura costuma ser página confusa.

📄 Como é parte do `preset-classic`, a configuração vai dentro dele — irmã de
`docs` e `blog`, não em `plugins`:

```js
presets: [
  ['classic', ({
    docs: { /* ... */ },
    blog: { /* ... */ },
    gtag: {
      trackingID: 'G-XXXXXXXXXX',
      anonymizeIP: true,
    },
    theme: { customCss: './src/css/custom.css' },
  })],
],
```

⚠️ **Para o site interno da empresa, converse com quem cuida de privacidade
antes.** Analytics em documentação interna significa registrar o que cada
funcionário lê. Dependendo da política e da LGPD, isso exige aviso — e às vezes
não é permitido. `anonymizeIP: true` ajuda, mas não resolve a questão sozinho.

**Veredito:** ⚠️ Vale para site público. Para interno, é uma decisão que não é
técnica.

---

## C4 — Sitemap

**O que é:** o arquivo que diz aos buscadores quais páginas existem.

🎁 **Você já tem.** O `preset-classic` gera automaticamente em produção — o seu
build produz `build/sitemap.xml`. Só está aqui porque dá para ajustar:

```js
presets: [
  ['classic', ({
    sitemap: {
      lastmod: 'date',
      changefreq: 'weekly',
      filename: 'sitemap.xml',
      ignorePatterns: ['/docs/next/**'],
    },
  })],
],
```

💡 O `ignorePatterns` acima resolve um problema real do **seu** site: você tem duas
versões da documentação, e sem isso o Google indexa as duas. O resultado é alguém
pesquisando e caindo na versão em desenvolvimento.

**Veredito:** ✅ Vale conferir o `ignorePatterns` se você usa versionamento ou
i18n.

---

## C5 — SVG como componente, em qualquer lugar

**O que é:** o `@docusaurus/plugin-svgr` permite `import Logo from './logo.svg'` e
usar `<Logo />` também em arquivos de **código** (`src/`), não só em MDX.

**Quando vale:** quando você monta componentes próprios que usam ícones e quer
controlar cor por CSS — o SVG entra inline, então `fill="currentColor"` funciona.

🎁 Já vem no `preset-classic`. A configuração é opcional:

```js
presets: [
  ['classic', ({
    svgr: {
      svgrConfig: { /* svgr options */ },
    },
  })],
],
```

**Veredito:** 🔬 Bom saber que o mecanismo tem nome, para procurar quando o import
de SVG se comportar de um jeito estranho.

---

## C6 — Descobrir por que o build está lento

**O que é:** o `@docusaurus/plugin-rsdoctor` liga uma análise do processo de build
e mostra onde o tempo foi.

**Quando vale:** quando o build passou de uns dois minutos e você quer saber por
quê, em vez de chutar.

💻

```powershell
npm install @docusaurus/plugin-rsdoctor
```

📄 No **nível raiz**, em `plugins` — e vale ligar **só sob demanda**, com uma
variável de ambiente, porque a análise em si custa tempo:

```js
plugins: [
  process.env.RSDOCTOR === 'true' && '@docusaurus/plugin-rsdoctor',
].filter(Boolean),
```

💻 Para rodar com a análise ligada:

```powershell
$env:RSDOCTOR='true'; npm run build
```

💡 O `.filter(Boolean)` remove os `false` da lista. É um truque comum de config em
JavaScript: você deixa a entrada condicional e limpa no final.

**Veredito:** 🔬 Guarde o nome para o dia em que o build incomodar.

---

# Parte D — Plugins da comunidade

⚠️ **A regra do [Módulo 11](./11-advanced-features.md#passo-1--busca) vale para
todos daqui:** plugin da comunidade pode demorar a acompanhar uma versão nova do
Docusaurus. Antes de atualizar o Docusaurus, confira se a versão dele já saiu.
Conferi a compatibilidade de cada um abaixo em setembro de 2026.

---

## D1 — Puxar documentação de outros repositórios

**O que é:** o `docusaurus-plugin-remote-content` baixa arquivos Markdown de uma
URL durante o build e os trata como se fossem seus.

**Quando vale:** este é o plugin que resolve o maior problema de documentação
corporativa — o **conteúdo que mora em outro lugar**. O README de cada pipeline
vive no repositório do pipeline, e quem mantém é o time dono. Copiar para o site
significa duas cópias divergindo em duas semanas.

Com este plugin, o site busca a versão atual a cada build. A fonte continua sendo
o repositório original; o site vira uma vitrine.

💻

```powershell
npm install docusaurus-plugin-remote-content
```

📄 No **nível raiz**, em `plugins`:

```js
plugins: [
  [
    'docusaurus-plugin-remote-content',
    {
      name: 'pipeline-docs',
      sourceBaseUrl: 'https://raw.githubusercontent.com/my-org/pipelines/main/docs/',
      outDir: 'docs/pipelines',
      documents: ['ingestion.md', 'transformation.md'],
      performCleanup: true,
      noRuntimeDownloads: false,
    },
  ],
],
```

| Opção | O que faz |
|---|---|
| `name` | Identifica esta instância — você pode ter várias, uma por repositório |
| `sourceBaseUrl` | O prefixo comum das URLs |
| `outDir` | Onde os arquivos caem, relativo a `website/` |
| `documents` | A lista de arquivos a baixar |
| `performCleanup` | Apaga os arquivos depois do build (padrão `true`) |

⚠️ **Deixe `performCleanup: true` e coloque o `outDir` no `.gitignore`.** Senão
você commita cópias de arquivos de outro repositório, e aí tem duas fontes de
verdade de novo — exatamente o que o plugin veio evitar.

⚠️ **O build passa a depender da rede.** Se o repositório de origem estiver fora
do ar, ou o arquivo for renomeado, seu build quebra. Para documentação interna
isso normalmente é aceitável; só saiba que a troca existe.

**Compatibilidade conferida:** `@docusaurus/core` `2.x || 3.x`. ✅

**Veredito:** ✅ Para o site da empresa, é o mais promissor deste módulo — mas
exige combinar com os times donos dos repositórios.

---

## D2 — Renderizar JSON Schema

**O que é:** o `docusaurus-json-schema-plugin` transforma um JSON Schema numa
tabela navegável, com tipos, obrigatoriedade, descrições e valores padrão.

**Quando vale:** quando você documenta o formato de um arquivo de configuração,
de um payload de API ou de um contrato de dados. É a mesma ideia do
`openapi-docs` do [Módulo 11](./11-advanced-features.md#53--referência-de-api-a-partir-de-openapi), mas
para JSON Schema em vez de OpenAPI.

💻

```powershell
npm install docusaurus-json-schema-plugin
```

📄 Ele entra em `themes` (nível raiz), não em `plugins` — ⚠️ lembre de **somar** ao
array que já existe, em vez de criar um segundo:

```js
themes: [
  '@docusaurus/theme-mermaid',
  'docusaurus-json-schema-plugin',
  ['@easyops-cn/docusaurus-search-local', {/* ... */}],
],
```

📄 Uso numa página `.mdx`:

```mdx
import JSONSchemaViewer from '@theme/JSONSchemaViewer';
import schema from '@site/static/schemas/nimbus-config.json';

<JSONSchemaViewer schema={schema} />
```

💡 O ganho de verdade: o schema é o **mesmo arquivo** que o sistema valida. A
documentação não pode ficar desatualizada, porque ela é gerada da fonte. Para
contrato de dados, isso vale muito.

**Compatibilidade conferida:** exige `@docusaurus/core` `^3.10.1` — o seu site
está em 3.10.2. ✅

**Veredito:** ⚠️ Vale se você tem JSON Schema. Se não tem, o esforço de criar um
só para documentar raramente compensa.

Documentação: [jy95.github.io/docusaurus-json-schema-plugin](https://jy95.github.io/docusaurus-json-schema-plugin/)

---

## D3 — Escrever CSS em Sass

**O que é:** o `docusaurus-plugin-sass` permite usar `.scss` no lugar de `.css`.

**Quando vale:** se você já conhece Sass. Se não conhece — e este é o seu caso —
**pule**. Sass adiciona variáveis, aninhamento e funções ao CSS, e nenhuma dessas
coisas resolve um problema que você tem hoje. O Infima já te dá variáveis
(`--ifm-*`), que é 90% do benefício.

💻 Precisa de dois pacotes:

```powershell
npm install docusaurus-plugin-sass sass
```

**Compatibilidade conferida:** `@docusaurus/core` `^3.0.0`. ✅

**Veredito:** 🔬 Está aqui só para você reconhecer o nome. Não é para agora.

---

## D4 — Comentários nas páginas

**O que é:** o **Giscus** usa as Discussions do GitHub como sistema de
comentários. Cada página vira uma discussão.

**Quando vale:** documentação pública onde a dúvida de uma pessoa serve para as
próximas. Funciona bem em projeto open source.

⚠️ **Para documentação interna, geralmente não vale** — e o motivo é organizacional,
não técnico. Comentário em página é onde a informação **morre**: alguém responde
uma dúvida importante ali, e aquilo nunca vira conteúdo. Seis meses depois a
página continua errada com a correção enterrada no rodapé.

Se a dúvida é boa, ela pertence à página. Um link de "sugerir alteração" apontando
para o `editUrl` que você já configurou resolve melhor o mesmo problema.

**Como seria:** não há plugin oficial. O caminho é criar
`src/theme/DocItem/Footer` (um *wrapping* de swizzle, como no A2) e colocar o
componente do Giscus ali.

**Veredito:** ⚠️ Só para site público, e mesmo assim pense se o `editUrl` não
resolve melhor.

---

# Parte E — Desempenho e distribuição

O bloco `future` do config, no **nível raiz**, guarda opções que ainda não são
padrão. Todas foram conferidas na referência oficial de configuração.

---

## E1 — Build mais rápido (`future.faster`)

**O que é:** um conjunto de otimizações que trocam ferramentas em JavaScript por
equivalentes escritos em Rust — bundler, minificador, compilador.

**Quando vale:** quando o build começa a incomodar. Em site pequeno a diferença é
pequena; em site grande, com muitas páginas e duas versões e dois idiomas — o seu
caso — a diferença aparece.

📄 No **nível raiz**, irmão de `presets`:

```js
future: {
  faster: true,
},
```

Ou, ligando peça por peça:

```js
future: {
  faster: {
    swcJsLoader: true,
    swcJsMinimizer: true,
    swcHtmlMinimizer: true,
    lightningCssMinimizer: true,
    rspackBundler: true,
    rspackPersistentCache: true,
    mdxCrossCompilerCache: true,
    ssgWorkerThreads: true,
    gitEagerVcs: true,
  },
},
```

| Chave | O que troca |
|---|---|
| `swcJsLoader` | O compilador de JavaScript |
| `swcJsMinimizer` | O minificador de JavaScript |
| `swcHtmlMinimizer` | O minificador de HTML |
| `lightningCssMinimizer` | O minificador de CSS |
| `rspackBundler` | O bundler (Rspack no lugar do webpack) |
| `rspackPersistentCache` | Cache de build entre execuções |
| `mdxCrossCompilerCache` | Cache de MDX entre idiomas/versões |
| `ssgWorkerThreads` | Gera as páginas em paralelo |
| `gitEagerVcs` | Leitura mais agressiva do Git (datas de atualização) |

⚠️ **O `rspackPersistentCache` é justamente o que o
[Módulo 99](./99-troubleshooting.md#problemas-causados-pelo-onedrive) manda
desligar quando o OneDrive apronta.** Ele grava cache em disco, e cache em pasta
sincronizada é uma combinação ruim. Se você ligar `faster: true` e começar a ver
build estranho, essa é a primeira chave a desligar:

```js
future: {
  faster: {
    // Everything else on, but no on-disk cache: OneDrive corrupts it
    swcJsLoader: true,
    swcJsMinimizer: true,
    rspackBundler: true,
    rspackPersistentCache: false,
  },
},
```

💡 Ligar por partes também serve para **descobrir o culpado** quando algo quebra:
liga tudo, quebrou, desliga metade, e assim por diante.

**Veredito:** ⚠️ Vale quando o build incomodar. Ligue, meça o antes e o depois, e
esteja preparado para desligar uma chave específica.

---

## E2 — Preparar para a versão 4 (`future.v4`)

**O que é:** as mudanças que quebram compatibilidade e virão no Docusaurus 4, para
você ativar antes e descobrir os problemas no seu tempo.

📄 No **nível raiz**:

```js
future: {
  v4: true,
},
```

Ou por partes:

| Chave | O que muda |
|---|---|
| `removeLegacyPostBuildHeadAttribute` | Remove um comportamento antigo do build |
| `useCssCascadeLayers` | Usa camadas de CSS (`@layer`) |
| `siteStorageNamespacing` | Isola o armazenamento local por site |
| `fasterByDefault` | Liga o `faster` sozinho |
| `mdx1CompatDisabledByDefault` | Desliga a compatibilidade com MDX v1 |

💡 **`siteStorageNamespacing` resolve um problema real de quem tem mais de um
site.** Sem ele, dois sites Docusaurus no mesmo domínio compartilham o
armazenamento do navegador — e o modo escuro de um bagunça o do outro. Se a
empresa for hospedar várias documentações no mesmo endereço, ligue.

⚠️ **Ligar `v4: true` de uma vez é a forma mais rápida de descobrir que algo
quebrou, e a mais lenta de descobrir o quê.** Ligue uma chave por vez.

**Veredito:** 🔬 Não é para agora. É para quando a versão 4 for anunciada — e aí
este bloco vira sua migração gradual.

---

## E3 — Site que roda a partir de uma pasta, sem servidor

**O que é:** `experimental_router: 'hash'` troca o roteamento por um que usa `#`
no endereço. O site passa a funcionar abrindo o `index.html` direto do disco.

**Quando vale:** este é o recurso mais específico do módulo, e um dos mais úteis
quando a situação aparece: **distribuir a documentação como um arquivo zip**.

O site normal precisa de um servidor, porque cada endereço (`/docs/installation`)
tem que ser resolvido por alguém. Abrindo do disco, isso quebra. Com o roteador de
hash, os endereços viram `index.html#/docs/installation`, que o navegador resolve
sozinho.

📄 No **nível raiz**:

```js
future: {
  experimental_router: 'hash',
},
```

Cenários reais: mandar a documentação para um cliente sem acesso à rede da
empresa; embutir a documentação dentro de um instalador; deixar uma cópia num
pendrive para uma auditoria.

⚠️ **O `experimental_` no nome é literal** — a opção pode mudar. E há um custo: os
endereços ficam feios, e **buscadores não indexam bem** URLs com `#`. Para o site
principal, não use. Para uma build paralela de distribuição, é perfeito.

💡 Você pode ter as duas coisas: o site normal publicado, e um script extra que
gera a versão de hash para quem precisa.

**Veredito:** ⚠️ Inútil até o dia em que alguém pedir "manda a documentação por
e-mail". Aí vira a solução exata.

---

# Parte F — Coisas do seu caso

Itens que não são recursos do Docusaurus, mas respondem ao que você descreveu
sobre a documentação da empresa.

---

## F1 — Relatório do Power BI dentro da página

Você mencionou que a documentação vai ter capturas do Power BI. Além da imagem
(com o zoom do [Módulo 11](./11-advanced-features.md#55--zoom-nas-imagens)), dá
para embutir o relatório **ao vivo** com um `iframe`:

```jsx
<iframe
  title="Nimbus sync dashboard"
  src="https://app.powerbi.com/reportEmbed?reportId=YOUR_REPORT_ID"
  width="100%"
  height="540"
  style={{border: 0}}
  allowFullScreen
/>
```

⚠️ **Três coisas antes de fazer isso:**

1. **Quem abrir a página precisa ter acesso ao relatório.** O `iframe` não carrega
   permissão junto — quem não tem acesso vê uma tela de login ou um erro. Em
   documentação interna isso costuma funcionar, porque a pessoa já está autenticada
   no Microsoft 365.
2. **O `title` não é opcional.** É o que um leitor de tela anuncia. Sem ele, a
   pessoa ouve "quadro" e nada mais.
3. **Um relatório embutido muda sem aviso.** Se o texto ao redor explica um número
   específico, ele vai desencontrar na próxima atualização. Para explicar um
   número, use captura de tela; para consultar o dado atual, use o `iframe`.

💡 **A captura de tela ainda ganha na maioria dos casos**, porque documentação
explica *como ler* o relatório — e para isso você quer a tela congelada, com
setas e destaques. O embed serve para "veja o estado atual", não para ensinar.

---

## F2 — Repositório privado, e o que isso muda

Vale repetir aqui, porque é o item de maior consequência de todo o guia: a
documentação interna vai para um repositório **privado**.

| | Site de aprendizado (este) | Site da empresa |
|---|---|---|
| Repositório | Público | **Privado** |
| Busca | Local ou Algolia | **Local** — o Algolia rastreia de fora |
| Analytics | Tanto faz | Conversar com privacidade antes |
| Hospedagem | GitHub Pages | GitHub Pages **privado**, ou servidor interno |

⚠️ **Apagar um arquivo não o remove do histórico do Git.** Se um nome de servidor,
uma string de conexão ou um print com dados reais entrar num commit, ele continua
recuperável mesmo depois de apagado. A hora de decidir que o repositório é privado
é **antes do primeiro commit**, não depois.

---

# Índice rápido

| Quero... | Item |
|---|---|
| Repetir um trecho em várias páginas | [A1](#a1--trechos-reaproveitáveis-partials) |
| Parar de escrever `import` em toda página | [A2](#a2--componente-disponível-em-toda-página-sem-import) |
| Mostrar um dado do front matter no texto | [A3](#a3--as-três-variáveis-que-toda-página-mdx-já-tem) |
| Um tipo de aviso que não existe | [A4](#a4--admonitions-customizadas) |
| Fórmulas | [A5](#a5--equações-matemáticas) |
| Mandar link já na aba certa | [A6](#a6--abas-que-ficam-na-url) |
| Marcar páginas com metadado | [A7](#a7--metadado-livre-por-página) |
| Links da navbar no centro | [B1](#b1--navbar-com-os-links-no-centro) |
| Navbar que some ao rolar | [B2](#b2--navbar-que-some-ao-rolar) |
| Agrupar a sidebar sem criar categoria | [B3](#b3--títulos-de-seção-e-separadores-na-sidebar) |
| Uma 404 útil | [B4](#b4--página-404-própria) |
| Mudar o índice lateral do site todo | [B5](#b5--controlar-o-índice-lateral-do-site-inteiro) |
| Fechar categorias automaticamente | [B6](#b6--categorias-que-se-fecham-sozinhas) |
| Ver o config já resolvido | [C1](#c1--o-painel-de-debug) |
| Funcionar offline | [C2](#c2--site-que-funciona-sem-internet-pwa) |
| Saber quais páginas ninguém lê | [C3](#c3--analytics) |
| Impedir que a versão `next` seja indexada | [C4](#c4--sitemap) |
| Descobrir por que o build é lento | [C6](#c6--descobrir-por-que-o-build-está-lento) |
| Puxar README de outro repositório | [D1](#d1--puxar-documentação-de-outros-repositórios) |
| Documentar um contrato de dados | [D2](#d2--renderizar-json-schema) |
| Comentários nas páginas | [D4](#d4--comentários-nas-páginas) |
| Build mais rápido | [E1](#e1--build-mais-rápido-futurefaster) |
| Preparar para a versão 4 | [E2](#e2--preparar-para-a-versão-4-futurev4) |
| Mandar a documentação por e-mail | [E3](#e3--site-que-roda-a-partir-de-uma-pasta-sem-servidor) |
| Embutir Power BI | [F1](#f1--relatório-do-power-bi-dentro-da-página) |

---

## 📌 O que levar deste módulo

Quase tudo aqui é **opcional por natureza**. A tentação, ao ler um catálogo, é
querer ligar tudo — e essa é a forma mais rápida de transformar um site que
funciona num site que ninguém consegue manter.

A ordem que eu seguiria, se fosse montar a documentação da empresa amanhã:

1. **A1 (partials)** — resolve a repetição, que é o problema real de documentação
   corporativa
2. **B4 (404)** e **C4 (sitemap)** — meia hora cada, valem por anos
3. **A2 (MDXComponents)** — quando o segundo componente próprio aparecer
4. **D1 (remote content)** — quando você tiver combinado com os times donos
5. O resto, quando doer

⬅️ Voltar ao [índice do guia](./README.md)
