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
   [Módulo 99](./99-troubleshooting.md#panic-occurred-at-runtime--modulegraphmodule--not-found-rspack)
   mostra a cara desse erro.

### A solução (parcial, e vale entender o "parcial")

Nenhuma das pastas problemáticas — `node_modules`, `build`, `.docusaurus` e o
cache do bundler — precisa de backup: todas são **geradas** a partir do código, e
o Módulo 01 vai ensinar o Git a ignorá-las.

Então a saída é fazer o OneDrive ignorá-las também. E existe um jeito limpo: o
OneDrive **não sincroniza junctions de diretório**. Um junction é um atalho no
nível do sistema de arquivos — para o Node ele é uma pasta normal, mas o OneDrive
olha, vê que é um ponto de reparse e passa direto.

Ou seja: a pasta fica fisicamente fora do OneDrive, e o projeto continua inteiro
no lugar que você quer.

⚠️ **Mas isso não funciona para o `node_modules`.** O `npm install` verifica se
essa pasta é um diretório real e **apaga** o junction se não for — é
comportamento deliberado do npm, não dá para contornar. O Módulo 02 explica
quando você vir a mensagem.

Na prática, então, a divisão fica assim:

| Pasta | Junction? | Consequência |
|---|---|---|
| `.docusaurus` | ✅ | Fora do OneDrive — **é a que causa os builds quebrados** |
| `node_modules\.cache` | ✅ | Fora do OneDrive — cache do bundler |
| `build` | ✅ | Fora do OneDrive |
| `node_modules` | ❌ | Sincroniza. ~250 MB e 30 mil arquivos. |

O que sobra é um custo de **volume** (sincronização lenta e cota), não de
**correção**: as pastas que quebram o build ficam de fora. É uma troca aceitável,
e é o preço de manter o projeto no OneDrive.

💻 Crie agora a pasta que vai receber esses arquivos, fora do OneDrive:

```powershell
New-Item -ItemType Directory -Force "C:\dev\docusaurus-local\website" | Out-Null
Test-Path "C:\dev\docusaurus-local\website"
```

👀 Deve responder `True`.

Só isso por enquanto. Os junctions em si são criados no
[Módulo 02, Passo 2](./02-creating-the-site.md#passo-2--tirar-as-pastas-de-cache-do-onedrive),
depois que o projeto existir — não dá para apontar um atalho para uma pasta que
ainda não foi criada.

> **E se eu preferir não usar junction?** Funciona sem — o site vai rodar. Você
> só troca conforto por risco: sincronização lenta e a chance de encontrar os
> erros de cache do Módulo 99. Se topar, pule a criação dos junctions no Módulo
> 02 e siga o resto igual.

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
- [x] `C:\dev\docusaurus-local\website` existe
- [x] Você consegue entrar na pasta do projeto com `cd` e ver o `guide` no `ls`
- [x] Você sabe explicar, em uma frase, por que `node_modules` não pode
      sincronizar no OneDrive

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
O lugar onde o projeto mora afeta se ele vai funcionar de forma confiável, e
pastas geradas (`node_modules`, `build`, `.docusaurus`) não devem ser
sincronizadas nem versionadas — elas são reconstruíveis a partir do código.

➡️ Próximo: [Módulo 01 — Git e GitHub](./01-git-and-github.md)
