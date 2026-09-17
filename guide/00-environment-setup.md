# Módulo 00 — Preparando o ambiente

> **Objetivo:** instalar Node.js, Git e VS Code, e escolher a pasta do projeto
> sabendo quais escolhas causam problema depois.
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

## Passo 4 — A pasta do projeto

Este passo parece burocrático e é o mais importante do módulo. Leia inteiro antes
de rodar qualquer comando.

### Escolhendo o lugar

O projeto vai virar um repositório Git no Módulo 01, e o site Docusaurus nasce
dentro dele, em `website/`, no Módulo 02. Escolha uma pasta e use a mesma até o
fim do guia.

```powershell
New-Item -ItemType Directory -Force "C:\projects\docusaurus-learning"
```

Este guia usa `C:\projects\docusaurus-learning` nos exemplos. Se você preferir
outro lugar, troque o caminho em todos os comandos daqui para frente.

### ⚠️ Se a pasta ficar dentro do OneDrive, Dropbox ou Google Drive

No Windows, `Documentos` e `Área de Trabalho` costumam estar dentro do OneDrive
sem que o usuário tenha escolhido isso. Vale conferir antes de decidir, porque
pasta sincronizada causa dois problemas reais em projetos Node:

1. **Volume.** A pasta `node_modules` tem **dezenas de milhares** de arquivos
   pequenos. O serviço de sincronização tenta subir todos — consome CPU, ocupa
   cota e demora horas.
2. **Corrida de arquivos.** O bundler grava arquivos de cache e os relê
   milissegundos depois. Se a sincronização mexer no arquivo nesse intervalo, o
   build quebra com erros que não fazem sentido: *panics*, arquivos "não
   encontrados" que existem, builds que funcionam numa hora e falham na outra. O
   [Módulo 99](./99-troubleshooting.md#problemas-causados-por-pastas-sincronizadas) mostra a
   cara desse erro.

**A recomendação é manter o projeto fora da pasta sincronizada.** Código
versionado não precisa de backup em nuvem de arquivos — o Git já cumpre esse
papel, e melhor.

### Se ainda assim o projeto ficar numa pasta sincronizada

Funciona, e muita gente trabalha assim. Existem técnicas para excluir
`node_modules` da sincronização — junções de diretório, listas de exclusão — mas
elas custam mais do que resolvem: o npm desfaz algumas sozinho, o Docusaurus apaga
outras durante o build, e várias precisam ser recriadas à mão para sempre.

O caminho mais barato é o inverso: **setup simples, e conserto documentado se der
problema.** Dois hábitos evitam quase tudo.

**1. Pause a sincronização antes de instalar pacotes.**

É quando os milhares de arquivos aparecem de uma vez. No OneDrive: ícone da nuvem
na bandeja do sistema → **Pausar sincronização → 2 horas**. Rode o `npm install`, e
despause ao terminar.

Não é obrigatório. Mas se a máquina ficar lenta depois de um `npm install`, a
causa é essa.

**2. Se um build quebrar com erro que não faz sentido, suspeite da sincronização.**

*Panic*, arquivo "não encontrado" que existe, build que funciona numa hora e falha
na outra, pasta `build/` que desaparece — nada disso é culpa do código. O
[Módulo 99](./99-troubleshooting.md#problemas-causados-por-pastas-sincronizadas) tem a escada
de correção, da mais simples à definitiva. A primeira tentativa é sempre
`npm run clear`.

### A saída de emergência

Se a sincronização atrapalhar de verdade, mova o projeto. A partir do Módulo 01
isso vira uma operação de dois comandos, porque o GitHub passa a ter tudo:

```powershell
cd C:\projects
git clone https://github.com/your-username/docusaurus-learning.git
```

O backup continua sendo o Git — que é o que backup de código deveria ser desde
sempre.

Guarde essa carta na manga. Não precisa usar agora.

---

## Passo 5 — Comandos de terminal que você vai usar

Não precisa decorar. Volte aqui quando precisar.

| Comando | O que faz |
|---|---|
| `cd "C:\projects\docusaurus-learning"` | Entra na pasta |
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
cd "C:\projects\docusaurus-learning"
ls
```

👀 Você deve ver `guide`, `README.md` e `LICENSE`.

---

## ✅ Checkpoint

- [ ] `node -v` mostra v20 ou superior
- [ ] `npm -v` mostra um número de versão
- [ ] `git --version` mostra uma versão
- [ ] VS Code instalado, com a extensão MDX
- [ ] Você consegue entrar na pasta do projeto com `cd`
- [ ] Você sabe se ela está ou não dentro de uma pasta sincronizada
- [ ] Se estiver, você sabe onde fica o botão de pausar a sincronização
- [ ] Você sabe que erro de build sem sentido é sintoma de sincronização, e que o
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
