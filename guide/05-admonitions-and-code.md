# Módulo 05 — Admonitions e blocos de código

> **Objetivo:** usar as caixas de destaque e todos os recursos de código —
> incluindo abas. E entender de verdade a diferença entre `.md` e `.mdx`.
> **Tempo:** ~45 min
> **Pré-requisito:** [Módulo 04](./04-writing-markdown.md)

💻 Dentro de `website`, com `npm start` rodando.

---

## Parte A — Admonitions

São as caixas coloridas de aviso. Sintaxe: três dois-pontos, o tipo, o conteúdo, e
três dois-pontos fechando.

### Passo 1 — Os cinco tipos

📄 Adicione em `docs/reference.mdx`:

````mdx
## Admonitions

:::note
A neutral remark. Gray.
:::

:::tip
A useful, optional shortcut. Green.
:::

:::info
Extra context. Blue.
:::

:::warning
Requires attention before moving on. Yellow.
:::

:::danger
Destructive action or serious error. Red.
:::
````

👀 Cinco caixas, cada uma com ícone e cor própria.

**Escolha pelo significado, não pela cor.** Um site com `:::danger` em tudo perde
o efeito. A regra prática: `danger` só quando a ação causa perda de dados ou
indisponibilidade.

| Tipo | Use quando |
|---|---|
| `note` | Detalhe que não muda o que a pessoa faz |
| `tip` | Atalho opcional, que economiza tempo |
| `info` | Contexto que ajuda a entender, mas não é obrigatório |
| `warning` | Se ignorar, algo vai dar errado |
| `danger` | Se ignorar, perde dado ou derruba o serviço |

### Passo 2 — Título customizado

````mdx
:::tip[A shortcut that saves time]
`npm run clear` wipes the cache. It is the first thing to try when the site
behaves strangely after a config change.
:::
````

O título vai entre colchetes, colado no tipo.

⚠️ A sintaxe antiga era `:::tip Título` (com espaço, sem colchetes). Ela **não
funciona** no Docusaurus 3. Se você achar isso num tutorial, é conteúdo da v2.

### Passo 3 — Conteúdo rico e aninhamento

Admonitions aceitam qualquer Markdown dentro. Para aninhar uma dentro da outra, a
**de fora usa quatro dois-pontos**:

````mdx
::::info[Full upgrade procedure]

1. Stop the agent:

   ```powershell
   nimbus stop
   ```

:::warning[Run as administrator]
The installer writes to `Program Files` and fails silently otherwise.
:::

2. Run the installer.

::::
````

A regra: a cerca externa precisa ter **mais** dois-pontos que a interna.

---

## Parte B — Blocos de código

### Passo 4 — O básico

Três crases, a linguagem, o código, três crases:

````mdx
```powershell
nimbus sync --force
```
````

👀 O realce de sintaxe aparece sozinho, e no canto direito tem um botão de copiar.

Linguagens que funcionam sem configuração: `js`, `jsx`, `ts`, `tsx`, `json`,
`css`, `html`, `bash`, `python`, `java`, `sql`, `yaml`, `diff`, `md`, `text`.

Para as demais — **incluindo `powershell`** — declare no config:

📄 `docusaurus.config.js`, dentro de `themeConfig.prism`:

```js
prism: {
  theme: prismThemes.github,
  darkTheme: prismThemes.dracula,
  additionalLanguages: ['powershell', 'bash', 'ini'],
},
```

👀 Compare antes e depois: sem o `additionalLanguages`, o bloco `powershell`
aparece em cinza, sem cores. Com ele, os comandos e as flags ganham destaque.

⚠️ Se as cores não aparecerem depois de salvar, aplique a regra prática do
[Módulo 02](./02-creating-the-site.md#o-que-recarrega-sozinho-e-o-que-não):
`Ctrl+C` e `npm start`. Este é um caso de fronteira — está no `themeConfig`, mas
mexe em quais arquivos de linguagem entram no pacote.

### Passo 5 — Título no bloco

````mdx
```yaml title="~/.nimbus/config.yml"
workspace: acme-prod
interval: 15m
retries: 3
```
````

👀 Uma barra com o nome do arquivo aparece no topo do bloco. Use sempre que o
código pertencer a um arquivo real — o leitor precisa saber onde colar aquilo.

### Passo 6 — Destacando linhas

**Forma 1 — comentário mágico**, dentro do próprio código:

````mdx
```yaml title="~/.nimbus/config.yml"
workspace: acme-prod
# highlight-next-line
interval: 15m
# highlight-start
proxy:
  url: http://proxy.acme.internal:8080
# highlight-end
```
````

Disponíveis: `highlight-next-line`, `highlight-start` / `highlight-end`,
`error-next-line` (fundo vermelho) e `warning-next-line` (fundo amarelo).

**Forma 2 — intervalo de linhas**, sem sujar o código:

````mdx
```python {2,4-6}
def process(items):
    total = 0
    for item in items:
        if item.active:
            total += item.value
    return total
```
````

Use a forma 1 quando o código é seu e a 2 quando você colou de algum lugar e não
quer editar.

### Passo 7 — Numeração de linhas

````mdx
```js showLineNumbers
function sum(a, b) {
  return a + b;
}
```
````

Para começar de outro número — ao mostrar um trecho do meio de um arquivo —
`showLineNumbers=42`.

---

## Parte C — `.md` vs `.mdx`

Aqui mora a informação mais desatualizada da internet sobre Docusaurus. Vale ler
com atenção, porque quase todo tutorial de 2022–2023 está errado neste ponto.

### Passo 8 — O que realmente acontece

**No Docusaurus 3, todos os arquivos de conteúdo passam pelo compilador MDX por
padrão** — inclusive os `.md`. A documentação oficial diz isso com todas as
letras: *"By default, Docusaurus v3 uses the MDX format for all files (including
`.md` files) for historical reasons."*

A consequência prática é que a tabela que você já viu em vários blogs está errada:

| | O que dizem por aí | O que acontece de verdade (Docusaurus 3) |
|---|---|---|
| `import` num `.md` | ❌ não funciona | ✅ funciona |
| JSX num `.md` | ❌ não funciona | ✅ funciona |
| `<!-- comentário -->` num `.md` | ✅ funciona | ❌ **quebra o build** |

💻 Prove você mesmo. 📄 Crie `docs/scratch.md` — repare na extensão, `.md`:

```md
---
title: Extension test
---

import Tabs from '@theme/Tabs';

If this page renders, `.md` is being compiled as MDX.

<div style={{padding: 12, border: '1px solid red'}}>
  JSX inside a .md file.
</div>
```

👀 A página renderiza normalmente, com a caixa de borda vermelha. Em MDX puro
"clássico" isso seria impossível num `.md`.

💻 Agora 📄 adicione uma linha de comentário HTML no fim do arquivo:

```md
<!-- this breaks -->
```

👀 O terminal do `npm start` mostra um erro de compilação MDX. **Esse é o motivo
pelo qual o Módulo 04 mandou usar `{/* */}`.**

💻 Apague o arquivo de teste:

```powershell
Remove-Item docs\scratch.md
```

### Passo 9 — Então quando usar cada um?

Como o comportamento é o mesmo, a extensão vira uma **convenção sua**. Duas
estratégias defensáveis:

**A — `.mdx` em tudo (o que este guia faz).** É o que o próprio template do
Docusaurus 3 usa: ele já vem com `docs/intro.mdx` e os posts do blog em `.mdx`.
Vantagem: uma regra só, o editor sempre sabe o que esperar, e a extensão não
mente sobre o que o arquivo pode fazer.

**B — separar de verdade, com `markdown.format: 'detect'`.** Se você quer que
`.md` volte a ser Markdown puro — aceitando `<`, `{` e `<!-- -->` como texto
comum, sem escapar — ligue a detecção por extensão:

```js title="docusaurus.config.js"
markdown: {
  format: 'detect',
},
```

Com isso: `.md` = CommonMark (sem JSX), `.mdx` = MDX (com JSX). Aí sim a tabela
antiga passa a valer.

Quando a opção B compensa: documentação que mostra muito código com chaves e
sinais de menor no meio do texto corrido, ou conteúdo escrito por gente que não
quer saber o que é JSX.

> **Recomendação:** fique na opção A enquanto aprende. Uma regra só. Se um dia
> um arquivo específico te der trabalho com `{` e `<`, dá para resolver caso a
> caso com `mdx.format: md` no front matter daquela página, sem mudar o site
> inteiro.

---

### Passo 10 — Abas de código

Este é o uso mais comum de MDX, e o primeiro grande ganho concreto.

📄 No **topo** de `docs/reference.mdx`, logo depois do front matter:

```mdx
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

📄 E onde você quiser as abas:

````mdx
## Tabs

<Tabs>
  <TabItem value="windows" label="Windows" default>

```powershell
winget install Nimbus.CLI
```

  </TabItem>
  <TabItem value="macos" label="macOS">

```bash
brew install nimbus
```

  </TabItem>
  <TabItem value="linux" label="Linux">

```bash
curl -fsSL https://get.nimbus.example/install.sh | sh
```

  </TabItem>
</Tabs>
````

👀 Três abas clicáveis, cada uma com seu bloco de código.

⚠️ **Repare nas linhas em branco** antes e depois do bloco de código, dentro do
`<TabItem>`. Sem elas, o Markdown de dentro não é processado e você vê o texto
cru. É o erro mais comum de quem começa com abas.

⚠️ Os `import` ficam **depois** do front matter e **antes** do primeiro texto.
Um `import` no meio da página funciona, mas é confuso — mantenha todos no topo.

### Passo 11 — Abas sincronizadas

📄 Adicione `groupId` a todos os grupos que tratam do mesmo assunto:

```mdx
<Tabs groupId="operating-system">
```

👀 Agora, ao trocar para "macOS" numa página, **todas** as abas com esse mesmo
`groupId` no site inteiro trocam junto — e a escolha fica salva no navegador do
leitor entre visitas.

É um detalhe pequeno com efeito grande: o usuário de Mac escolhe uma vez e o site
inteiro fala com ele.

⚠️ O `groupId` é global no site. Use nomes descritivos e reutilizáveis
(`operating-system`, `package-manager`) e **nunca** algo específico de uma página
(`install-tabs`), senão a sincronização não acontece onde deveria.

---

## Passo 12 — Registrar no Git

💻

```powershell
cd ..
git add .
git commit -m "feat: add admonitions, code block features and OS tabs"
git push
cd website
```

---

## ✅ Checkpoint

- [x] Sua página de referência tem os 5 tipos de admonition
- [x] Uma admonition com título customizado e uma aninhada
- [x] `additionalLanguages: ['powershell']` no config, e os blocos PowerShell
      aparecem coloridos
- [x] Um bloco com `title=` e outro com linhas destacadas
- [x] Um grupo de abas funcionando, com `groupId`
- [x] Você conseguiu explicar por que `<!-- -->` quebra até num arquivo `.md`
- [x] `npm run build` passa
- [x] Commit feito

---

## 🎯 Exercício

Transforme `docs/installation.mdx` num guia de instalação de verdade.

**1. Abas por sistema operacional**

Substitua a lista de passos por três abas — Windows, macOS e Linux — usando
`groupId="operating-system"` (o mesmo da página de referência, para sincronizar).

Cada aba precisa de dois blocos de código: um para instalar, outro para conferir.
Use os comandos do Passo 10 como base para o primeiro; o segundo é
`nimbus --version` nos três.

**2. Título em todo bloco de código**

Todo bloco deve dizer de onde ele vem: `title="PowerShell"`, `title="Terminal"`,
ou o caminho do arquivo quando for conteúdo de arquivo.

**3. Uma admonition de cada peso**

| Onde | Tipo | Conteúdo sugerido |
|---|---|---|
| Antes das abas | `:::info` | Que a instalação leva ~5 minutos e exige reinício |
| Dentro da aba Windows | `:::warning` | Que precisa executar como administrador |
| No fim da página | `:::tip` | Um atalho: `nimbus doctor` diagnostica o setup |

Pelo menos uma delas deve ter **título customizado**.

**4. Uma linha destacada**

Adicione um bloco mostrando o arquivo de configuração, com
`# highlight-next-line` apontando a única linha que a pessoa precisa editar:

````mdx
```yaml title="~/.nimbus/config.yml" showLineNumbers
# highlight-next-line
workspace: replace-with-your-workspace-id
interval: 15m
retries: 3
```
````

**5. Teste a sincronização**

Mude a aba na página de instalação, navegue até `/docs/reference`, e confirme que
a aba lá **já está** na sua escolha. Se não estiver, os dois `groupId` estão
diferentes.

**6. Commite**

**Como saber que deu certo:**

- As três abas mostram comandos diferentes e o Markdown de dentro está formatado
  (não aparece crase crua na tela)
- A escolha de aba viaja entre as duas páginas
- Recarregar o navegador mantém a aba escolhida
- Existe exatamente uma linha com fundo destacado no bloco do `config.yml`
- `npm run build` passa

---

## 📌 O que você aprendeu

Admonitions comunicam severidade — use com critério e prefira o título entre
colchetes. Blocos de código melhoram muito com `title=` e destaque de linha, e
linguagens fora da lista padrão precisam entrar em `additionalLanguages`. E a
diferença entre `.md` e `.mdx` no Docusaurus 3 é convenção, não capacidade — a
não ser que você ligue `markdown.format: 'detect'`.

➡️ Próximo: [Módulo 06 — Imagens e ícones](./06-images-and-icons.md)
