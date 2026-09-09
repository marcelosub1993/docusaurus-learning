# Módulo 08 — Componentes e layout

> **Objetivo:** usar o sistema de layout embutido e criar seu primeiro componente
> React reutilizável.
> **Tempo:** ~70 min
> **Pré-requisito:** [Módulo 07](./07-navigation-and-sidebar.md)

Este é o módulo com mais JavaScript. Não precisa saber React antes — vou explicar
cada linha. Se travar, faça só a Parte A, commite, e volte para a B outro dia.

💻 Dentro de `website`.

---

## Parte A — O layout embutido (sem escrever código)

O tema `classic` inclui o [Infima](https://infima.dev/), um framework CSS. As
classes dele estão disponíveis em qualquer página de conteúdo, sem instalar nem
importar nada.

### Passo 1 — O grid de 12 colunas

📄 Em `docs/reference.mdx`:

```jsx
## Layout

<div className="row">
  <div className="col col--4">
    <div className="card padding--md">
      <h4>First</h4>
      <p>One third of the width.</p>
    </div>
  </div>
  <div className="col col--4">
    <div className="card padding--md">
      <h4>Second</h4>
      <p>Another third.</p>
    </div>
  </div>
  <div className="col col--4">
    <div className="card padding--md">
      <h4>Third</h4>
      <p>The last third.</p>
    </div>
  </div>
</div>
```

👀 Três cards lado a lado. **Diminua a janela do navegador** — eles empilham
sozinhos no celular.

Como funciona: `row` cria a linha, e cada `col col--N` ocupa N de 12 colunas. Some
sempre 12: `4+4+4`, `8+4`, `6+6`, `3+3+3+3`.

⚠️ **`className`, não `class`.** Em arquivos de conteúdo o HTML é interpretado
como JSX, e em JSX o atributo se chama `className`. Escrever `class="row"` não dá
erro — o Docusaurus simplesmente ignora, e você fica olhando para um layout que
não aconteceu, sem saber por quê. É um dos erros mais frustrantes de depurar,
porque não tem mensagem nenhuma.

💻 Prove: troque um `className` por `class`, salve, olhe. Depois desfaça.

### Passo 2 — Espaçamento

O Infima tem classes utilitárias no padrão `propriedade--tamanho`:

```jsx
<div className="margin-top--lg padding--md margin-bottom--sm">
```

Tamanhos: `xs`, `sm`, `md`, `lg`, `xl`.
Propriedades: `margin`, `margin-top`, `margin-bottom`, `margin-left`,
`margin-right`, `margin-vert`, `margin-horiz` — e o mesmo para `padding`.

### Passo 3 — Botões

```jsx
<a className="button button--primary button--lg" href="/docs/installation">
  Get started
</a>
```

Variações: `button--primary`, `--secondary`, `--success`, `--warning`, `--danger`,
`--outline`, `--link`. Tamanhos: `button--sm`, `button--lg`, `button--block`
(ocupa a largura toda).

### Passo 4 — Badges e alertas

```jsx
<span className="badge badge--primary">v2.0</span>
<span className="badge badge--warning">beta</span>
<span className="badge badge--danger">deprecated</span>

<div className="alert alert--info" role="alert">
  A compact alert, without icon or title.
</div>
```

Badges são ótimos ao lado de títulos, para marcar status de uma funcionalidade.

💻 Commite a Parte A antes de seguir:

```powershell
cd ..
git add .
git commit -m "docs: add Infima layout examples to the reference page"
cd website
```

---

## Parte B — Seu primeiro componente

Repare no que acabou de acontecer: cada card do Passo 1 custou 5 linhas de HTML.
Numa documentação com 40 páginas isso vira um pesadelo de manutenção — e mudar o
visual dos cards significaria editar 40 arquivos.

A solução é criar um componente: você escreve a estrutura **uma vez** e usa um
nome curto nas páginas.

### Passo 5 — Criar os arquivos

💻

```powershell
mkdir src\components\Cards
```

📄 Crie `src/components/Cards/index.js`:

```jsx
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export function CardGrid({children}) {
  return <div className={styles.grid}>{children}</div>;
}

export function Card({icon, title, to, children}) {
  return (
    <Link className={styles.card} to={to}>
      <span className={styles.icon}>{icon}</span>
      <span className={styles.title}>{title}</span>
      <span className={styles.body}>{children}</span>
    </Link>
  );
}
```

### Passo 6 — Entender o que você escreveu

Linha por linha:

```jsx
import Link from '@docusaurus/Link';
```
O componente de link do Docusaurus. Use-o em vez de `<a>`: ele faz navegação
instantânea entre páginas internas e pré-carrega o destino quando o mouse passa
por cima.

```jsx
import styles from './styles.module.css';
```
Importa o CSS como um **objeto**. `styles.card` devolve o nome real da classe. O
sufixo `.module.css` é o que ativa esse comportamento — Passo 8.

```jsx
export function Card({icon, title, to, children}) {
```
Define o componente. `export` o torna importável em outros arquivos. As chaves
`{icon, title, to, children}` são as **props** — os valores que quem usa o
componente vai passar. `children` é especial: é o conteúdo escrito *entre* as tags
de abertura e fechamento.

```jsx
  return (
    <Link className={styles.card} to={to}>
```
O que aparece na tela. `{styles.card}` e `{to}` estão entre chaves porque são
JavaScript; sem as chaves seriam o texto literal `styles.card`.

> **E o `import React from 'react'`?** Não precisa. O Docusaurus 3 usa o
> "automatic JSX runtime", que injeta isso sozinho — repare que o componente
> `src/components/HomepageFeatures/index.js`, que veio no template, também não
> importa React. Você só importa de `react` quando usar algo nomeado, como
> `import {useState} from 'react'`.
>
> Muito tutorial antigo põe essa linha. Ela não quebra nada, só é desnecessária.

> **Por que `function Card` e não `function card`?** Em JSX, nomes com letra
> minúscula são interpretados como tags HTML. Componente **sempre** começa com
> maiúscula. Essa regra causa erros silenciosos quando esquecida: o JSX vira uma
> tag `<card>` que o navegador ignora.

### Passo 7 — O CSS

📄 Crie `src/components/Cards/styles.module.css`:

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
}

.card {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 1.25rem;
  border: 1px solid var(--ifm-color-emphasis-300);
  border-radius: 8px;
  text-decoration: none !important;
  color: inherit;
  transition: border-color 200ms ease, transform 200ms ease;
}

.card:hover {
  border-color: var(--ifm-color-primary);
  transform: translateY(-2px);
}

.icon {
  font-size: 1.75rem;
  line-height: 1;
}

.title {
  font-weight: 700;
  color: var(--ifm-heading-color);
}

.body {
  font-size: 0.9rem;
  color: var(--ifm-color-emphasis-700);
}
```

A linha do `grid-template-columns` merece atenção:
`repeat(auto-fill, minmax(240px, 1fr))` significa "encaixe quantas colunas
couberem, cada uma com no mínimo 240px". O layout se adapta sozinho, sem media
query.

### Passo 8 — Por que `.module.css`

Um arquivo `styles.css` comum define classes **globais**. Se você criar `.card` e
o tema também tiver `.card` — e ele tem, você usou no Passo 1 — um sobrescreve o
outro, e o resultado depende da ordem de carregamento. Uma dor de cabeça clássica.

Com `.module.css`, o build renomeia suas classes para algo único
(`Cards_card_a3f9`). Colisão impossível. Por isso o import é um objeto:
`styles.card` devolve o nome gerado.

**A regra:** CSS de componente sempre em `.module.css`. Só o `src/css/custom.css`
é global — e ele existe para variáveis de tema, que é o assunto do próximo módulo.

### Passo 9 — As variáveis `--ifm-*`

Repare que o CSS acima não tem nenhuma cor fixa. `var(--ifm-color-primary)` é uma
variável do Infima que **já muda sozinha entre modo claro e escuro**.

As mais úteis:

| Variável | O que é |
|---|---|
| `--ifm-color-primary` | Cor principal do site |
| `--ifm-color-emphasis-100` a `-900` | Escala de cinza, do mais claro ao mais escuro |
| `--ifm-heading-color` | Cor dos títulos |
| `--ifm-background-color` | Fundo da página |
| `--ifm-font-color-base` | Cor do texto |

Escrever `color: #333` funciona no modo claro e fica ilegível no escuro. Usar as
variáveis resolve os dois de graça.

### Passo 10 — Usar o componente

📄 No topo de `docs/intro.mdx`, depois do front matter:

```mdx
import {CardGrid, Card} from '@site/src/components/Cards';
```

📄 E no corpo, substituindo a lista de links da seção "Where to start":

```mdx
<CardGrid>
  <Card icon="📦" title="Installation" to="/docs/installation">
    Get Nimbus running on your machine.
  </Card>
  <Card icon="⚙️" title="Configuration" to="/docs/configuration/basic-setup">
    The three settings you need first.
  </Card>
  <Card icon="❓" title="FAQ" to="/docs/faq-licensing">
    Licensing, performance and data retention.
  </Card>
</CardGrid>
```

👀 Três cards com hover, responsivos, em 3 linhas por card em vez de 5 de HTML. E
mudar o visual de todos significa editar um arquivo.

As chaves no import (`import {CardGrid, Card}`) são porque o arquivo exporta dois
componentes **nomeados**. Um `export default` seria importado sem chaves.

⚠️ **Em prop JSX, use a URL, não o caminho do arquivo.** `to="./installation.mdx"`
**não** funciona: a conversão de caminho para URL só acontece em links Markdown
(`[texto](./installation.mdx)`). Dentro de JSX escreva `to="/docs/installation"`.

Este erro passa despercebido no `npm start` e só aparece no `npm run build`, como
link quebrado.

💻 Confirme:

```powershell
npm run build
```

---

## Passo 11 — Swizzle: alterando o próprio tema

Quando um componente **do Docusaurus** não faz o que você precisa, você pode
"ejetar" uma cópia dele para dentro do projeto:

💻

```powershell
npm run swizzle @docusaurus/theme-classic Footer -- --eject
```

O arquivo aparece em `src/theme/Footer/` e passa a substituir o original.

⚠️ Swizzle tem custo de manutenção: seu fork não recebe as correções das versões
novas do Docusaurus. Prefira `--wrap`, que **envolve** o componente original em
vez de substituí-lo:

```powershell
npm run swizzle @docusaurus/theme-classic Footer -- --wrap
```

E prefira ainda mais **não** fazer swizzle. Na maioria dos casos, CSS resolve — e
é o que o Módulo 09 faz.

💻 Se você experimentou, desfaça antes de seguir:

```powershell
Remove-Item -Recurse -Force src\theme
```

---

## Passo 12 — Registrar no Git

💻

```powershell
cd ..
git add .
git commit -m "feat: add reusable Card and CardGrid components"
git push
cd website
```

---

## ✅ Checkpoint

- [ ] Um grid do Infima com 3 colunas, que empilha no celular
- [ ] Botões e badges na página de referência
- [ ] O componente `Cards` criado e usado na Overview
- [ ] Você sabe explicar o que é `children` e o que é uma prop
- [ ] Você sabe por que o CSS é `.module.css`
- [ ] Você testou `class` no lugar de `className` e viu o silêncio
- [ ] `npm run build` passa
- [ ] Commit feito

---

## 🎯 Exercício

Crie um componente `<Figure>` que resolve o problema do
[Módulo 06, Passo 7](./06-images-and-icons.md#passo-7--imagem-com-legenda): o
bloco `<figure>` repetido à mão em toda página.

**1. Os arquivos**

```
src/components/Figure/index.js
src/components/Figure/styles.module.css
```

**2. O esqueleto do componente**

📄 `src/components/Figure/index.js` — complete as partes marcadas:

```jsx
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

export default function Figure({src, alt, caption, width}) {
  return (
    <figure className={styles.figure} style={{maxWidth: width}}>
      <img src={/* use useBaseUrl aqui */} alt={alt} className={styles.image} />
      <figcaption className={styles.caption}>{caption}</figcaption>
    </figure>
  );
}
```

Duas decisões suas:

- Por que `useBaseUrl(src)` e não `src` direto? Releia o
  [Módulo 06, Passo 6](./06-images-and-icons.md#para-que-serve-o-usebaseurl).
- Repare que aqui é `export default`, não `export function`. Isso muda como você
  importa. O Passo 10 explica a diferença.

**3. O CSS**

📄 `src/components/Figure/styles.module.css` precisa de três classes. Requisitos:

| Classe | Requisito |
|---|---|
| `.figure` | Sem margem lateral, centralizado, com respiro em cima e embaixo |
| `.image` | Largura 100%, cantos arredondados, uma borda sutil usando `var(--ifm-color-emphasis-300)` |
| `.caption` | Menor que o texto normal, itálico, centralizado, cor `var(--ifm-color-emphasis-600)` |

⚠️ Nenhuma cor fixa. Se você escrever `#666`, a legenda vai sumir no modo escuro
— e o objetivo do exercício é justamente não deixar isso acontecer.

**4. Use em duas páginas**

📄 Em `docs/installation.mdx`, substitua o `<figure>` manual do exercício do
Módulo 06 pelo componente.

📄 E use uma segunda vez em `docs/reference.mdx`, com uma imagem diferente e
`width="400px"`.

**5. O desafio**

Faça a borda da imagem aparecer **só no modo escuro**. A dica está no
[Módulo 09, Passo 1](./09-visual-identity.md#passo-1--o-arquivo-de-estilo-global):
o Docusaurus coloca um atributo no `<html>` quando o tema escuro está ativo, e
CSS Module aceita seletores compostos.

**6. Valide e commite**

**Como saber que deu certo:**

- As duas páginas usam `<Figure>` e nenhuma tem `<figure>` escrito à mão
- Trocar o tema muda a cor da legenda, sem você ter escrito nada sobre tema
- A imagem de `reference.mdx` é visivelmente menor que a de `installation.mdx`
- Mudar uma regra no `styles.module.css` muda as duas páginas ao mesmo tempo
- `npm run build` passa

---

## 📌 O que você aprendeu

O Infima resolve layout sem código — e `className`, não `class`. Quando um padrão
se repete, ele merece virar componente: props entram, JSX sai, CSS Module isola os
estilos, e variáveis `--ifm-*` cuidam do modo claro/escuro sozinhas. Swizzle
existe, mas é o último recurso.

➡️ Próximo: [Módulo 09 — Identidade visual](./09-visual-identity.md)
