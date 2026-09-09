# Módulo 01 — Git e GitHub

> **Objetivo:** transformar a pasta do projeto num repositório Git, publicá-la no
> GitHub e entender o que faz um repositório ser bom de olhar.
> **Tempo:** ~60 min
> **Pré-requisito:** [Módulo 00](./00-environment-setup.md), com o Git instalado.

Este módulo vem **antes** de criar o site de propósito. Assim o site nasce dentro
de um repositório que já funciona, e cada módulo daqui pra frente termina com um
commit — o seu aprendizado fica registrado passo a passo, com data.

---

## Parte A — O mínimo de teoria

Você precisa de quatro ideias. O resto se aprende usando.

**Repositório** é uma pasta que o Git observa. Ele guarda o histórico dentro de
uma subpasta escondida chamada `.git`. Apagou o `.git`, virou pasta comum de novo.

**Commit** é uma foto do projeto num momento, com uma mensagem explicando o que
mudou. O histórico é a sequência de fotos. Você pode voltar para qualquer uma.

**Staging area** é a bancada onde você escolhe *o que* entra na próxima foto.
Existe porque nem tudo que você mexeu pertence ao mesmo assunto — dá para
commitar duas mudanças separadamente, cada uma com sua explicação.

```
Você edita          →  git add        →  git commit      →  git push
(working directory)    (staging area)    (histórico local)   (GitHub)
```

**Remote** é uma cópia do repositório em outro lugar — no nosso caso, o GitHub.
`push` envia, `pull` traz.

> **Git e GitHub não são a mesma coisa.** Git é o programa que roda na sua
> máquina e funciona sem internet. GitHub é um site que hospeda repositórios Git.
> Dá para usar Git sem GitHub a vida inteira.

---

## Passo 1 — Configurar o Git

O Git assina cada commit com um nome e um e-mail. Sem isso configurado, ele se
recusa a commitar.

💻 Configure o nome (use o seu nome real, ele aparece no histórico público):

```powershell
git config --global user.name "Marcelo"
```

Agora o e-mail. Aqui vale uma decisão de privacidade: **todo commit público
expõe o e-mail que você configurar**, e robôs varrem o GitHub atrás deles. O
GitHub resolve isso dando um endereço de encaminhamento.

💻 Ligue a proteção e descubra seu endereço:

1. Acesse <https://github.com/settings/emails>
2. Marque **Keep my email addresses private**
3. Logo abaixo aparece seu endereço no formato
   `12345678+marcelosub1993@users.noreply.github.com` — copie

```powershell
git config --global user.email "COLE_AQUI_O_ENDERECO_NOREPLY"
```

💻 Mais três ajustes que evitam problema:

```powershell
git config --global init.defaultBranch main
git config --global core.autocrlf true
git config --global pull.rebase false
```

| Configuração | Por quê |
|---|---|
| `init.defaultBranch main` | O padrão antigo do Git é `master`; o do GitHub é `main`. Alinhar evita confusão no primeiro push. |
| `core.autocrlf true` | Windows termina linha com `CRLF`, Linux com `LF`. Isso converte na hora de commitar, para o arquivo não aparecer "todo modificado" sem motivo. |
| `pull.rebase false` | Diz ao Git o que fazer quando o histórico local e o remoto divergirem. `false` = mesclar, que é o comportamento mais previsível para começar. |

💻 Confira:

```powershell
git config --global --list
```

👀 Você deve ver as cinco linhas que acabou de definir.

---

## Passo 2 — Criar o repositório no GitHub

Faça pelo site, uma vez só.

1. Acesse <https://github.com/new>
2. Preencha:

| Campo                 | Valor                                                               | Por quê                                                                      |
| --------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| **Repository name**   | `docusaurus-learning`                                               | Minúsculas, com hífen, sem acento. É o padrão do GitHub e vira parte da URL. |
| **Description**       | `Curso prático de Docusaurus em português, com o site de exercício` | Aparece na busca e no topo da página. Uma frase.                             |
| **Public**            | marcado                                                             | Repositório público tem GitHub Pages de graça, que o Módulo 12 usa.          |
| **Add a README file** | **desmarcado**                                                      | Você já tem um README local.                                                 |
| **Add .gitignore**    | **None**                                                            | Você já tem um `.gitignore` local.                                           |
| **Choose a license**  | **None**                                                            | Você já tem um `LICENSE` local.                                              |

3. Clique em **Create repository**

⚠️ **Deixe as três últimas opções vazias mesmo.** Se o GitHub criar arquivos, o
repositório remoto terá um histórico que o seu local não conhece, e o primeiro
`push` falha com `refusing to merge unrelated histories`. É a armadilha mais
comum de quem está começando — e não tem nada de óbvio no erro.

👀 A tela seguinte mostra "Quick setup" com uma URL. Guarde ela:

```
https://github.com/marcelosub1993/docusaurus-learning.git
```

---

## Passo 3 — Inicializar o repositório local

💻 Na pasta do projeto:

```powershell
cd "C:\Users\marce\OneDrive\Documents\Docusaurus"
git init
```

👀 `Initialized empty Git repository in .../Docusaurus/.git/`

💻 Veja o que o Git está enxergando:

```powershell
git status
```

👀 Algo assim:

```
On branch main

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        .gitignore
        LICENSE
        README.md
        guide/
```

"Untracked" = o Git vê o arquivo mas ainda não o acompanha. É o estado inicial de
tudo.

---

## Passo 4 — O `.gitignore`

Antes de commitar qualquer coisa, decida o que **nunca** deve entrar. Um arquivo
`.gitignore` na raiz lista padrões que o Git ignora.

📄 O arquivo `.gitignore` já está na raiz do projeto. Abra e leia:

```gitignore
# Dependencies
node_modules/

# Docusaurus build output and cache
build/
.docusaurus/
.cache-loader/
```

A regra para decidir o que ignorar tem três perguntas:

| Pergunta | Se sim, ignore |
|---|---|
| É **gerado** a partir de outro arquivo do repositório? | `node_modules/`, `build/`, `.docusaurus/` |
| É **específico da minha máquina**? | `.vscode/`, `.idea/`, `desktop.ini` |
| É **segredo**? | `.env.local`, chaves, senhas |

⚠️ **O `.gitignore` só vale para arquivos ainda não rastreados.** Se você commitar
`node_modules` por engano, adicionar a linha depois não remove nada — o Git já
está acompanhando. Para corrigir:

```powershell
git rm -r --cached node_modules
```

O `--cached` remove do Git e **mantém no disco**. Sem ele, você apaga os arquivos
de verdade.

> **Por que ignorar `node_modules` se o projeto precisa dela?** Porque ela é
> reconstruível: o `package.json` e o `package-lock.json` listam exatamente o que
> instalar, e `npm install` recria a pasta idêntica. Versionar 40 mil arquivos
> que um comando reproduz é desperdício — e o `package-lock.json`, esse sim, vai
> para o repositório.

---

## Passo 5 — O primeiro commit

💻 Coloque tudo na bancada:

```powershell
git add .
```

O `.` significa "tudo a partir da pasta atual". Os padrões do `.gitignore` são
respeitados automaticamente.

💻 Confira **antes** de commitar — este é o hábito que evita commit acidental:

```powershell
git status
```

👀 Você deve ver quatro entradas em verde, sob "Changes to be committed":
`.gitignore`, `LICENSE`, `README.md` e `guide/`.

⚠️ Se aparecer `node_modules/` ou centenas de arquivos que você não reconhece,
**pare**. Rode `git reset` (que esvazia a bancada sem perder nada) e revise o
`.gitignore`.

💻 Agora a foto:

```powershell
git commit -m "docs: add Docusaurus learning guide and repository setup"
```

👀 Algo como `[main (root-commit) a1b2c3d] docs: add ...` seguido da contagem de
arquivos.

💻 Veja o histórico:

```powershell
git log --oneline
```

👀 Uma linha: o código curto do commit e sua mensagem. Aperte `q` para sair.

> **`q` para sair?** O `git log` abre num paginador. `q` fecha, setas rolam. Se
> isso te incomodar, `git --no-pager log --oneline` mostra direto no terminal.

---

## Passo 6 — Enviar para o GitHub

💻 Diga ao Git onde fica a cópia remota:

```powershell
git remote add origin https://github.com/marcelosub1993/docusaurus-learning.git
```

`origin` é só um apelido — é a convenção universal para "o remote principal".

💻 Confira:

```powershell
git remote -v
```

👀 Duas linhas com a URL, uma `(fetch)` e uma `(push)`.

💻 Envie:

```powershell
git push -u origin main
```

👀 Na primeira vez, uma janela do navegador abre pedindo login no GitHub. Isso é
o **Git Credential Manager**, que veio junto com o Git. Autorize, e ele guarda a
credencial no Gerenciador de Credenciais do Windows — você não vai precisar
digitar senha de novo.

👀 Depois: `Branch 'main' set up to track remote branch 'main' from 'origin'.`

O `-u` só é necessário na primeira vez. Ele amarra sua branch local à remota, e
a partir daí `git push` sozinho já sabe para onde ir.

👀 Recarregue <https://github.com/marcelosub1993/docusaurus-learning> — seus
arquivos estão lá, e o GitHub já está renderizando o `README.md` na página
inicial.

---

## Parte B — O que faz um repositório ser bom

Um repositório que ninguém consegue entender é uma pasta de arquivos com
histórico. O que separa um dos outros são cinco coisas, e quatro delas você já
tem.

| Elemento | Responde a pergunta | Você tem? |
|---|---|---|
| `README.md` | "O que é isso e como eu uso?" | ✅ |
| `.gitignore` | "O que não pertence aqui?" | ✅ |
| `LICENSE` | "Posso usar isso?" | ✅ |
| Description + topics | "Isso aparece na busca?" | ⬜ Passo 8 |
| Histórico legível | "O que aconteceu e por quê?" | ⬜ Passo 10 |

---

## Passo 7 — O README

O README é a página inicial do repositório. Quem chega decide em 15 segundos se
fica ou sai, e é isso que ele lê.

📄 Abra o `README.md` da raiz e acompanhe. Ele segue esta anatomia:

| Seção | Função | Regra prática |
|---|---|---|
| **Título** (`# `) | O nome do projeto | Um `#` só, na primeira linha |
| **Uma frase** | O que é, para quem | Sem "este projeto visa". Diga o que faz. |
| **Contexto** | Por que existe | 2–3 linhas. Opcional, mas é o que dá personalidade. |
| **What's in here** | O mapa das pastas | Tabela ou árvore. Evita que a pessoa tenha que clicar em tudo. |
| **Getting started** | Como rodar | Requisitos + os comandos, em blocos copiáveis |
| **Índice do conteúdo** | O sumário | Uma tabela com link por módulo |
| **Conventions** | Decisões que não são óbvias | Ex.: por que o guia é PT e o site é EN |
| **Built with** | A stack | Ajuda quem procura por tecnologia |
| **License** | Os termos | Uma linha, com link |

### As regras que importam

**Escreva em inglês.** O repositório é público. Inglês é o idioma padrão do
open source, e é o que faz seu repositório ser útil para quem não fala português.
O conteúdo do guia continua em português — isso é normal e não confunde ninguém.

**Todo bloco de código tem que funcionar copiando e colando.** Sem `$` na frente,
sem `<seu-usuario>` no meio de um comando que a pessoa vai rodar sem ler.

**Não prometa o que não existe.** Um README que descreve seis funcionalidades e
o repositório tem duas é pior do que um README curto. Quando o `website/` não
existia ainda, o nosso dizia exatamente isso.

**Nada de badge decorativo.** Badge de build que aponta para um CI inexistente é
mentira. No Módulo 12, quando o workflow existir de verdade, aí vale colocar.

💻 Verifique como ficou na prática:

```powershell
start https://github.com/marcelosub1993/docusaurus-learning
```

👀 Leia o README como se fosse a primeira vez. Alguma pergunta ficou sem resposta
nos primeiros 15 segundos? Essa é a seção que falta.

---

## Passo 8 — Descrição, topics e a barra lateral

Isso é configuração do GitHub, não arquivo. Muita gente pula e o repositório
some da busca.

1. Na página do repositório, clique na **engrenagem** ao lado de "About" (canto
   superior direito)
2. **Description:** a mesma frase do Passo 2
3. **Topics:** adicione `docusaurus`, `documentation`, `portuguese`,
   `learning`, `markdown`, `react`

   Topics são as etiquetas que o GitHub usa para busca e recomendação. São o
   jeito mais barato de o repositório ser encontrado.
4. Desmarque **Packages**, **Environments** e **Deployments** se estiverem
   marcados — só poluem a barra lateral enquanto não existem.
5. **Save changes**

---

## Passo 9 — O ciclo do dia a dia

Daqui em diante, no fim de cada módulo, você repete quatro comandos:

```powershell
git status                                    # 1. o que mudou?
git add .                                     # 2. quero tudo na próxima foto
git commit -m "docs: finish module 02"        # 3. tira a foto
git push                                      # 4. manda pro GitHub
```

Comandos de consulta que valem conhecer:

| Comando | O que mostra |
|---|---|
| `git status` | O que mudou, o que está na bancada |
| `git diff` | As linhas que você mudou e ainda não deu `add` |
| `git diff --staged` | As linhas que estão na bancada, prestes a virar commit |
| `git log --oneline -10` | Os 10 últimos commits, um por linha |
| `git show` | O último commit inteiro, com as mudanças |

E dois de emergência:

| Situação | Comando |
|---|---|
| Dei `add` e me arrependi | `git restore --staged arquivo.md` |
| Estraguei o arquivo e quero o do último commit | `git restore arquivo.md` |

⚠️ `git restore arquivo.md` **descarta suas mudanças sem pedir confirmação**.
Não tem desfazer. Use só quando tiver certeza.

---

## Passo 10 — Mensagens de commit

`git commit -m "update"` não ajuda ninguém, inclusive você daqui a três meses.

A convenção mais usada no mercado é **Conventional Commits**: um prefixo, dois
pontos, e uma frase no imperativo.

```
tipo: descrição curta em inglês, no imperativo, sem ponto final
```

| Tipo | Quando usar | Exemplo |
|---|---|---|
| `feat` | Funcionalidade nova | `feat: add search to the docs site` |
| `fix` | Correção | `fix: correct broken link on the install page` |
| `docs` | Só documentação | `docs: add module 05 exercise` |
| `style` | Formatação, sem mudar comportamento | `style: reformat sidebar config` |
| `refactor` | Reescrita sem mudar comportamento | `refactor: extract Card component` |
| `chore` | Manutenção, dependências, config | `chore: upgrade Docusaurus to 3.10.2` |

Boas mensagens deste projeto:

```
docs: add module 01 on Git and GitHub
feat: create Nimbus installation page with OS tabs
chore: ignore .docusaurus cache folder
fix: use className instead of class in the card grid
```

Duas regras que resolvem quase tudo:

1. **Imperativo, em inglês:** "add", não "added" nem "adiciona". A frase completa
   é "se aplicado, este commit vai *add* tal coisa".
2. **Um assunto por commit.** Se a mensagem precisa de "e", provavelmente são
   dois commits. Foi para isso que a staging area existe:

   ```powershell
   git add guide/05-admonitions-and-code.md
   git commit -m "docs: finish module 05"
   git add website/docs/installation.mdx
   git commit -m "feat: add OS tabs to the installation page"
   ```

---

## Passo 11 — Branches, e quando começar a usá-las

Uma branch é uma linha paralela de commits. Você trabalha nela sem tocar na
`main`, e depois traz de volta.

```powershell
git switch -c experiment/dark-theme   # cria e entra na branch
# ... edita, add, commit ...
git switch main                       # volta
git merge experiment/dark-theme       # traz as mudanças
git branch -d experiment/dark-theme   # apaga a branch, já incorporada
```

Nome de branch segue o mesmo padrão dos arquivos: minúsculas, hífen, inglês.
`feature/`, `fix/`, `docs/` e `experiment/` como prefixo são convenções comuns.

### A regra deste guia: duas fases

A pergunta "devo trabalhar em branch ou direto na `main`?" tem uma resposta que
não é gosto pessoal:

> **Branch começa a valer a pena quando quebrar a `main` custa alguma coisa.**

Por isso o guia muda de comportamento no meio do caminho:

| Fase | Como commitar | Por quê |
|---|---|---|
| **Módulos 02 a 11** | Direto na `main` | Você é o único autor, cada módulo é uma unidade coerente, e o site ainda não está publicado. Quebrar a `main` custa zero: ninguém vê. |
| **Módulo 12 em diante** | Branch + Pull Request | O site está no ar. Todo push na `main` **republica o site público**, e um link quebrado deixa de ser um erro no seu terminal para virar um erro que outras pessoas veem. |

O que muda concretamente no Módulo 12: você cria um segundo workflow que roda o
build **no Pull Request**. Ele mostra o ❌ antes de a `main` ser tocada — e é aí
que o PR deixa de ser ritual e passa a verificar alguma coisa de verdade.

⚠️ **Não comece a usar branch agora.** Abrir um PR, aprovar você mesmo e mesclar,
sem nenhum robô olhando e sem site no ar, ensina o gesto e esconde o motivo.
Quando você abrir o primeiro PR, no Módulo 12, vai ser porque ele resolve um
problema que você já sentiu na pele.

> **E se eu trabalhar com outra pessoa um dia?** Aí branch + PR passa a valer
> desde o primeiro commit, mesmo sem CI — porque o custo que aparece é outro:
> dois autores mexendo na mesma `main` ao mesmo tempo.

---

## ✅ Checkpoint

- [ ] `git config --global --list` mostra nome e e-mail
- [ ] O e-mail é o `@users.noreply.github.com`, não o seu pessoal
- [ ] <https://github.com/marcelosub1993/docusaurus-learning> existe e é público
- [ ] O README aparece renderizado na página inicial do repositório
- [ ] O repositório tem description e pelo menos 4 topics
- [ ] `git log --oneline` mostra pelo menos um commit
- [ ] `git status` responde `nothing to commit, working tree clean`
- [ ] Você sabe explicar a diferença entre `add`, `commit` e `push`

---

## 🎯 Exercício

O objetivo é fazer o ciclo completo sozinho e ver o resultado no GitHub.

**1. Crie um arquivo de anotações pessoais**

📄 Crie `guide/NOTES.md` com este esqueleto — preencha as três seções com o que
você realmente achou dos Módulos 00 e 01:

```md
# Notes

Anotações pessoais enquanto sigo o guia.

## Doubts

- (algo que ficou meio nebuloso)

## Commands I keep forgetting

| Command | What it does |
| --- | --- |
| | |

## Ideas for the practice site

-
```

**2. Commite e envie**

Use o ciclo do Passo 9. A mensagem de commit deve começar com `docs:`.

**3. Force um erro, de propósito**

Ainda é o melhor jeito de aprender a ler o Git.

💻 Crie uma pasta que deveria ser ignorada e veja o Git não ligar para ela:

```powershell
New-Item -ItemType Directory -Force node_modules | Out-Null
New-Item -ItemType File node_modules\fake.txt | Out-Null
git status
```

👀 O `git status` deve dizer `nothing to commit, working tree clean` — a pasta
existe no disco e o Git a ignora. É o `.gitignore` funcionando.

💻 Agora limpe:

```powershell
Remove-Item -Recurse -Force node_modules
```

**4. Leia seu próprio histórico**

```powershell
git log --oneline
git show --stat
```

**Como saber que deu certo:**

- O `NOTES.md` aparece em `guide/` no site do GitHub
- `git log --oneline` mostra dois commits, ambos com prefixo de tipo
- O `git status` ficou limpo depois do push
- Você conseguiu explicar, olhando o `git show --stat`, quais arquivos o último
  commit tocou

---

## 📌 O que você aprendeu

Git registra o histórico local; GitHub hospeda uma cópia. O ciclo é
`add` → `commit` → `push`, e a staging area existe para você separar assuntos.
Um repositório bom tem README, `.gitignore`, LICENSE, description com topics e um
histórico que se lê. Arquivos gerados nunca entram — nem no Git, nem no OneDrive.

E branch não é uma questão de gosto: ela passa a valer a pena quando quebrar a
`main` custa alguma coisa. Até lá — Módulo 11 — você commita direto; do Módulo 12
em diante, com o site no ar, o caminho é branch + Pull Request.

➡️ Próximo: [Módulo 02 — Criando o site](./02-creating-the-site.md)
