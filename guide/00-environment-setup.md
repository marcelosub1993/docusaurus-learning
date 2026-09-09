# Módulo 00 — Preparando o ambiente

> **Objetivo:** instalar Node.js, Git e VS Code, e deixar a pasta do projeto
> preparada para funcionar dentro do OneDrive sem quebrar.
> **Tempo:** ~30 min
> **Pré-requisito:** nenhum.

Você não precisa saber React, JavaScript ou Git para começar. O Módulo 01 ensina
Git do zero, e o JavaScript só aparece no Módulo 08, explicado linha a linha.

---

## Passo 1 — Instalar o Node.js

O Docusaurus roda sobre o Node.js. Ele já vem com o `npm`, que instala pacotes.

💻 Primeiro, veja se você já tem:

```powershell
node -v
npm -v
```

👀 O esperado é algo como `v22.14.0` e `10.9.2`.

Se aparecer "o termo 'node' não é reconhecido", ou se a versão do Node for
**menor que 20**, instale a versão LTS:

**Opção A — pelo terminal (mais rápido):**

```powershell
winget install OpenJS.NodeJS.LTS
```

**Opção B — pelo site:** baixe em [nodejs.org](https://nodejs.org) (o botão "LTS")
e siga o instalador aceitando os padrões.

⚠️ Depois de instalar, **feche e abra o terminal de novo**. O `PATH` só é
recarregado em janelas novas — esse é o motivo nº 1 de "instalei e continua
dizendo que não existe". Se você usa o terminal de dentro do VS Code, feche o VS
Code inteiro, não só a aba do terminal.

> **Por que a versão 20 no mínimo?** É o que o Docusaurus 3 exige — está escrito
> no `engines.node` do pacote oficial. Com uma versão menor, a instalação até
> começa e falha no meio, com mensagens que não apontam para a causa.

> **Por que "LTS"?** *Long Term Support* — a versão estável, com suporte
> prolongado. Evite a "Current": é mais nova, mas quebra com mais frequência.

---

## Passo 2 — Instalar o Git

O Git é o que vai registrar seu aprendizado. O Módulo 01 explica como usar; aqui
só instalamos.

💻 Veja se já existe:

```powershell
git --version
```

👀 O esperado é algo como `git version 2.51.0.windows.1`.

Se não existir:

```powershell
winget install Git.Git
```

⚠️ De novo: feche e abra o terminal depois de instalar.

---

## Passo 3 — Instalar o editor

Use o [Visual Studio Code](https://code.visualstudio.com/). Se preferir instalar
pelo terminal:

```powershell
winget install Microsoft.VisualStudioCode
```

Depois de instalado, adicione uma extensão que ajuda bastante:

1. Abra o VS Code
2. `Ctrl+Shift+X` (painel de extensões)
3. Busque por **MDX** (autor: `unifiedjs`) e instale

Ela dá realce de sintaxe e aponta erros nos arquivos `.mdx` **antes** de você
rodar o build — o que economiza várias idas e vindas nos Módulos 05 em diante.

---

## Passo 4 — A pasta do projeto e o problema do OneDrive

Este passo parece burocrático e é o mais importante do módulo. Leia inteiro antes
de rodar qualquer comando.

### Onde o projeto vai ficar

```
C:\Users\marce\OneDrive\Documents\Docusaurus\
```

É onde o `guide/` já está. Vai virar um repositório Git no Módulo 01, e o site
Docusaurus vai nascer dentro dele, em `website/`, no Módulo 02.

### O problema

Pastas sincronizadas (OneDrive, Dropbox, Google Drive) causam dois problemas
reais em projetos Node:

1. **Volume.** A pasta `node_modules` tem **dezenas de milhares** de arquivos
   pequenos. O OneDrive tenta sincronizar todos — consome CPU, ocupa cota e
   demora horas.
2. **Corrida de arquivos.** O bundler grava arquivos de cache e os relê
   milissegundos depois. Se o OneDrive mexer no arquivo nesse intervalo, o build
   quebra com erros que não fazem sentido: *panics*, arquivos "não encontrados"
   que existem, builds que funcionam numa hora e falham na outra. O
   [Módulo 99](./99-troubleshooting.md#problemas-causados-pelo-onedrive)
   mostra a cara desse erro.

### A decisão

**Vamos manter o projeto no OneDrive mesmo, sem truque nenhum.**

Existem técnicas para tirar essas pastas da sincronização. Eu tentei três, e a
conclusão foi que todas custam mais do que resolvem: ou o npm as desfaz sozinho,
ou o próprio Docusaurus as apaga no build, ou você precisa recriá-las à mão para
sempre. Complexidade permanente no Módulo 00 para um problema que talvez nunca
apareça é mau negócio.

Então o plano é o inverso: **setup simples, e conserto documentado se der
problema.**

### Dois hábitos que evitam quase tudo

**1. Pause o OneDrive antes de instalar pacotes.**

É quando os milhares de arquivos aparecem de uma vez. Clique no ícone da nuvem na
bandeja do sistema → **Pausar sincronização → 2 horas**. Rode o `npm install`, e
despause quando terminar.

Não é obrigatório. Mas se a máquina ficar lenta depois de um `npm install`, é
isso, e agora você sabe.

**2. Se um build quebrar com erro que não faz sentido, suspeite do OneDrive.**

*Panic*, arquivo "não encontrado" que existe, build que funciona numa hora e falha
na outra — nada disso é culpa do seu código. O
[Módulo 99](./99-troubleshooting.md#problemas-causados-pelo-onedrive) tem a escada
de correção, da mais simples à definitiva. A primeira tentativa é sempre
`npm run clear`.

### A saída de emergência

Se o OneDrive atrapalhar de verdade, mova o projeto para fora dele. A partir do
Módulo 01 isso vira uma operação de dois comandos, porque o GitHub passa a ter
tudo:

```powershell
cd C:\dev
git clone https://github.com/marcelosub1993/docusaurus-learning.git
```

Aí você trabalha em `C:\dev\docusaurus-learning` e o backup continua sendo o Git —
que é o que backup de código deveria ser desde sempre.

Guarde essa carta na manga. Não precisa usar agora.

---

## Passo 5 — Comandos de terminal que você vai usar

Não precisa decorar. Volte aqui quando precisar.

| Comando | O que faz |
|---|---|
| `cd "C:\Users\marce\OneDrive\Documents\Docusaurus"` | Entra na pasta |
| `cd website` | Entra numa subpasta |
| `cd ..` | Volta uma pasta |
| `ls` | Lista o conteúdo da pasta atual |
| `pwd` | Mostra em qual pasta você está |
| `mkdir nome` | Cria uma pasta |
| `code .` | Abre a pasta atual no VS Code |
| `Ctrl+C` | Interrompe o comando que está rodando |
| `↑` (seta pra cima) | Repete o comando anterior |
| `Tab` | Completa o nome do arquivo ou pasta que você começou a digitar |

⚠️ O caminho do seu projeto tem espaços? O seu não tem, mas se algum dia tiver,
use aspas: `cd "C:\Meus Projetos\site"`. Sem as aspas, o PowerShell entende como
dois argumentos separados.

💻 Confirme que você consegue chegar na pasta:

```powershell
cd "C:\Users\marce\OneDrive\Documents\Docusaurus"
ls
```

👀 Você deve ver `guide`, `README.md` e `LICENSE`.

---

## ✅ Checkpoint

- [x] `node -v` mostra v20 ou superior
- [x] `npm -v` mostra um número de versão
- [x] `git --version` mostra uma versão
- [x] VS Code instalado, com a extensão MDX
- [x] Você consegue entrar na pasta do projeto com `cd` e ver o `guide` no `ls`
- [x] Você sabe onde fica o botão de pausar o OneDrive
- [x] Você sabe que erro de build sem sentido é sintoma de sincronização, e que o
      Módulo 99 tem o conserto

---

## 🎯 Exercício

Um aquecimento de terminal, para os comandos deixarem de ser estranhos.

1. Abra o PowerShell e vá até a pasta do projeto.
2. Descubra em que pasta você está sem olhar o prompt (dica: `pwd`).
3. Entre em `guide`, liste os arquivos, e volte um nível.
4. Crie uma pasta chamada `scratch`, entre nela, e volte.
5. Apague a pasta `scratch`:

   ```powershell
   Remove-Item scratch
   ```

6. Abra a pasta do projeto no VS Code com um comando só.

**Como saber que deu certo:** o VS Code abriu mostrando `guide`, `README.md` e
`LICENSE` na barra lateral, e a pasta `scratch` não existe mais.

---

## 📌 O que você aprendeu

O Docusaurus é uma ferramenta Node: o ambiente é Node + Git + editor + terminal.
O lugar onde o projeto mora afeta se ele vai funcionar de forma confiável — pasta
sincronizada e projeto Node se dão mal, e você já sabe qual é o sintoma.

Escolhemos setup simples com conserto documentado, em vez de prevenção
complicada. É uma troca que vale quase sempre: o problema pode nem aparecer, e se
aparecer você tem a receita.

➡️ Próximo: [Módulo 01 — Git e GitHub](./01-git-and-github.md)
