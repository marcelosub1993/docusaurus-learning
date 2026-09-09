# Módulo 09 — Identidade visual

> **Objetivo:** trocar cores, logo, favicon e fontes; deixar o site com a cara do
> seu projeto em modo claro e escuro.
> **Tempo:** ~45 min
> **Pré-requisito:** [Módulo 08](./08-components-and-layout.md)

💻 Dentro de `website`.

---

## Passo 1 — O arquivo de estilo global

📄 Abra `src/css/custom.css`. É o único CSS global do projeto, e ele já vem com o
essencial:

```css
:root {
  --ifm-color-primary: #2e8555;
  --ifm-color-primary-dark: #29784c;
  /* ... mais 5 tons ... */
  --ifm-code-font-size: 95%;
}

[data-theme='dark'] {
  --ifm-color-primary: #25c2a0;
  /* ... */
}
```

Duas coisas para entender:

- **`:root`** aplica ao site inteiro — na prática, é o modo claro.
- **`[data-theme='dark']`** só vale quando o modo escuro está ativo. O Docusaurus
  coloca esse atributo no `<html>` ao clicar no botão de tema.

Toda customização de cor segue esse par: define no `:root`, redefine no
`[data-theme='dark']`.

💻 Prove: abra o site, `F12`, aba Elements, e olhe a tag `<html>` enquanto clica no
botão de sol/lua. O atributo `data-theme` aparece e some.

> Esse mesmo seletor é o que resolve o desafio do exercício do Módulo 08.

---

## Passo 2 — Trocar a cor principal

Não escolha os 7 tons na mão. Existe uma ferramenta oficial, embutida na
documentação:

1. Abra [Styling and Layout → Styling your site with Infima](https://docusaurus.io/docs/styling-layout#styling-your-site-with-infima)
2. Role até o gerador e cole a cor da sua marca no campo de cor principal
3. Ele gera os 7 tons **e mostra o contraste WCAG** de cada um
4. Copie o bloco CSS gerado
5. Cole por cima do `:root` do seu `custom.css`

👀 Salve e veja: links, botões, o item ativo do menu, a barra de progresso e o
hover dos seus cards mudam de cor juntos — porque tudo isso usa
`var(--ifm-color-primary)`.

⚠️ **Verifique o contraste no modo escuro.** Uma cor escura da marca fica
ilegível sobre fundo preto. A regra prática: no `[data-theme='dark']`, use uma
versão mais **clara e mais saturada** da mesma cor. Foi exatamente o que o
template fez — verde `#2e8555` no claro, verde-água `#25c2a0` no escuro.

O gerador tem um seletor de fundo claro/escuro justamente para você conferir os
dois antes de colar.

---

## Passo 3 — Variáveis que valem conhecer

Além das cores, o Infima expõe centenas de variáveis. As que você mais vai mexer:

```css
:root {
  /* Tipografia */
  --ifm-font-family-base: 'Segoe UI', system-ui, sans-serif;
  --ifm-font-size-base: 16px;
  --ifm-line-height-base: 1.65;
  --ifm-heading-font-weight: 700;

  /* Código */
  --ifm-code-font-size: 95%;
  --ifm-font-family-monospace: 'Cascadia Code', Consolas, monospace;

  /* Layout */
  --ifm-navbar-height: 60px;
  --ifm-container-width-xl: 1400px;

  /* Sidebar */
  --doc-sidebar-width: 300px;
}
```

💻 Experimente mudar `--doc-sidebar-width` para `350px` e veja o efeito imediato.
Depois volte para `300px` ou deixe, se gostou.

Para descobrir o nome de uma variável: abra o site, clique com o botão direito no
elemento, "Inspecionar", e procure nas regras CSS por `--ifm-`.

---

## Passo 4 — Logo e favicon

📄 Coloque seus arquivos em `static/img/`. Depois, em `docusaurus.config.js`:

```js
favicon: 'img/favicon.ico',

themeConfig: {
  navbar: {
    title: 'Nimbus',
    logo: {
      alt: 'Nimbus logo',
      src: 'img/logo.svg',
      srcDark: 'img/logo-dark.svg',   // opcional: versão para modo escuro
      width: 32,
      height: 32,
      href: '/',                       // para onde o logo leva
    },
  },
},
```

Notas práticas:

- **Prefira SVG** para o logo: escala em qualquer tela sem borrar.
- Os caminhos **não incluem** `static/` — `static/img/logo.svg` vira `img/logo.svg`.
- `srcDark` existe porque um logo preto some no modo escuro.
- Para ficar **só o logo**, sem texto ao lado, remova a linha `title`.
- Favicon: um `.ico` de 32×32. Existem geradores online que criam a partir de PNG.

⚠️ O favicon é agressivamente cacheado pelo navegador. Se não mudar,
`Ctrl+Shift+R`, ou abra numa janela anônima.

---

## Passo 5 — Fontes customizadas

Para usar uma fonte que não está no sistema, importe no topo do `custom.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

:root {
  --ifm-font-family-base: 'Inter', system-ui, sans-serif;
}
```

⚠️ Duas ressalvas:

1. **Em rede corporativa restrita, o Google Fonts pode estar bloqueado** — e aí o
   site carrega sem a fonte, silenciosamente.
2. **O `@import` precisa ser a primeira coisa do arquivo.** CSS ignora `@import`
   que venha depois de qualquer regra, sem avisar.

A alternativa melhor para os dois casos: baixe os arquivos `.woff2` para
`static/fonts/` e declare localmente.

```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-Regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}
```

Isso também é melhor para privacidade e velocidade — nenhuma requisição sai para
fora do seu domínio.

---

## Passo 6 — Controlar o modo claro/escuro

📄 O template já traz uma parte disto. Complete:

```js
themeConfig: {
  colorMode: {
    defaultMode: 'light',
    disableSwitch: false,            // true remove o botão de tema
    respectPrefersColorScheme: true, // segue a preferência do sistema
  },
},
```

`respectPrefersColorScheme: true` é o comportamento mais educado: quem usa o
Windows em modo escuro já chega no site escuro. Ele já vem ligado no template.

💻 Teste: mude o Windows para modo escuro (Configurações → Personalização →
Cores → Modo do aplicativo) e recarregue o site numa aba anônima.

> Aba anônima porque a sua escolha manual anterior fica salva no navegador e
> ganha da preferência do sistema. Sem isso, você testa e "não funciona".

---

## Passo 7 — Barra de anúncio

Uma faixa no topo do site, útil para avisos temporários:

```js
themeConfig: {
  announcementBar: {
    id: 'release_2_0',
    content:
      '🚀 Nimbus 2.0 is out. <a href="/blog">Read the release notes</a>.',
    backgroundColor: '#2e8555',
    textColor: '#ffffff',
    isCloseable: true,
  },
},
```

O `id` é importante: quando o usuário fecha a barra, o Docusaurus grava esse id no
navegador dele. **Para mostrar um aviso novo, troque o `id`** — senão quem fechou
o anterior nunca verá o próximo.

---

## Passo 8 — Ajustes finos com CSS

Algumas customizações não têm variável. Aí é CSS mesmo, no `custom.css`:

```css
/* Deixar a sidebar mais compacta */
.menu__link {
  font-size: 0.9rem;
}

/* Tirar a sombra da navbar */
.navbar {
  box-shadow: none;
  border-bottom: 1px solid var(--ifm-color-emphasis-200);
}

/* Destacar o cabeçalho das tabelas */
.markdown table th {
  background-color: var(--ifm-color-emphasis-100);
}

/* Largura máxima confortável de leitura */
.markdown {
  max-width: 900px;
}
```

Para descobrir o nome da classe: botão direito no elemento → Inspecionar.

⚠️ Cuidado com `!important` e com seletores muito específicos — eles quebram
quando o Docusaurus atualiza a estrutura do tema. **Mude uma variável sempre que
existir uma**; escreva seletor só quando não existir.

---

## Passo 9 — O cartão social

Quando alguém cola o link do seu site no Teams, Slack ou WhatsApp, aparece uma
imagem de preview. Ela vem daqui:

```js
themeConfig: {
  image: 'img/docusaurus-social-card.jpg',
},
```

⚠️ Essa ainda é a imagem do Docusaurus, que veio no template. Troque por uma sua
antes de publicar — é o tipo de coisa que ninguém percebe até o link ser
compartilhado numa reunião.

Tamanho recomendado: **1200×630 px**. Você pode sobrescrever por página, no front
matter:

```mdx
---
image: /img/social-installation.jpg
---
```

---

## Passo 10 — Registrar no Git

💻

```powershell
cd ..
git add .
git commit -m "style: apply Nimbus color palette, logo and typography"
git push
cd website
```

---

## ✅ Checkpoint

- [ ] A cor principal é a sua, e está legível nos dois modos
- [ ] Logo e favicon próprios (ou você sabe exatamente onde trocá-los)
- [ ] Você mexeu em pelo menos uma variável de tipografia ou layout
- [ ] Testou o site com o Windows em modo escuro, numa aba anônima
- [ ] O `image:` do cartão social não é mais o do Docusaurus
- [ ] `npm run build` passa
- [ ] Commit feito

---

## 🎯 Exercício

Dê identidade completa ao site.

**1. Uma paleta de verdade**

Escolha uma cor (a do Nimbus pode ser um azul, já que o nome sugere nuvem) e gere
os 7 tons com a ferramenta do Passo 2.

📄 Cole no `:root`. Depois **ajuste manualmente** o bloco `[data-theme='dark']`
até a leitura ficar confortável — quase sempre é subir 2 tons.

👀 Confira em três lugares diferentes: um link no meio do texto, o botão da home,
e o hover dos seus `<Card>`.

**2. Uma cor de destaque própria**

📄 No `custom.css`, crie uma variável sua para o realce de código:

```css
:root {
  --nimbus-accent: #ff8a00;
}

[data-theme='dark'] {
  --nimbus-accent: #ffab40;
}

.markdown code {
  color: var(--nimbus-accent);
}
```

Repare no padrão: **nome próprio com prefixo** (`--nimbus-`), não `--ifm-`.
Sobrescrever uma variável do Infima com um significado diferente do original é
como você se confunde daqui a seis meses.

**3. Tipografia**

📄 Aumente `--doc-sidebar-width` para `320px` e diminua `.menu__link` para
`0.875rem`. Olhe o resultado e decida se fica.

**4. A barra de anúncio, com o teste completo**

📄 Adicione a `announcementBar` do Passo 7.

Agora o teste que ensina o mecanismo:

1. Feche a barra no navegador (clique no ×)
2. Recarregue a página — ela não volta
3. 📄 Troque o `id` para `release_2_1` e salve
4. Recarregue a página de novo

👀 Ela voltou. Agora você entende para que serve o `id`.

Repare que você não precisou reiniciar o servidor — `announcementBar` está no
`themeConfig`, que recarrega sozinho. Mas **precisou recarregar a página**, porque
a decisão de mostrar ou esconder é lida do armazenamento do navegador na carga.

**5. Um cartão social próprio**

Crie uma imagem 1200×630 (pode ser no PowerPoint, no Canva, ou qualquer coisa),
salve como `static/img/nimbus-social-card.jpg` e aponte o `image:` para ela.

Para conferir sem publicar: `npm run build`, `npm run serve`, e olhe o
`<head>` do HTML gerado com `F12` — procure por `og:image`.

**6. Veja no celular**

💻 Descubra o IP da sua máquina:

```powershell
ipconfig | Select-String "IPv4"
```

💻 Suba o servidor aceitando conexões da rede:

```powershell
npm start -- --host 0.0.0.0
```

Acesse `http://SEU-IP:3000` pelo celular, na mesma rede.

⚠️ Se não abrir, o Firewall do Windows está bloqueando a porta 3000. Isso é
esperado e não é problema do Docusaurus.

**7. Commite**

**Como saber que deu certo:**

- Nenhum tom da paleta original verde sobrou (busque por `2e8555` no `custom.css`)
- O texto em `code` usa sua cor de destaque nos dois modos, e é legível nos dois
- A barra de anúncio reapareceu depois da troca de `id`
- O `og:image` no HTML gerado aponta para a sua imagem
- O site é legível no celular sem zoom
- `npm run build` passa

---

## 📌 O que você aprendeu

A aparência do Docusaurus é controlada por variáveis CSS, não por edição de tema.
Defina no `:root`, redefina em `[data-theme='dark']`, e prefira variável a
seletor sempre que possível. Variáveis suas levam prefixo próprio, nunca `--ifm-`.

➡️ Próximo: [Módulo 10 — Blog e páginas soltas](./10-blog-and-pages.md)
