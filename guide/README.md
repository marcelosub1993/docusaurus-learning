# Guia de Docusaurus — do zero ao site publicado

Um curso prático, em 15 módulos, para aprender Docusaurus construindo um site de
documentação de verdade e registrando tudo no Git.

## Como este guia funciona

Cada módulo do caminho principal (00 a 12) segue a mesma estrutura — os dois de
consulta, 13 e 99, são listas e não seguem este formato:

| Elemento | O que é |
|---|---|
| **Objetivo / Tempo / Pré-requisito** | O que você sai sabendo e quanto custa |
| **Passos numerados** | A parte guiada — comando, arquivo, resultado esperado |
| **✅ Checkpoint** | Lista de verificação antes de seguir |
| **🎯 Exercício** | A parte sem colinha, com esqueleto pronto e critério de acerto |
| **📌 O que você aprendeu** | O resumo de uma frase |

E cinco símbolos aparecem o tempo todo:

| Símbolo | Significa |
|---|---|
| 💻 | Rode isto no terminal |
| 📄 | Crie ou edite este arquivo |
| 👀 | O que você deve ver acontecer |
| ⚠️ | Armadilha conhecida — leia antes de seguir |
| 💡 | Contexto que explica o porquê |

## Espaços reservados

Dois valores aparecem em comandos e URLs ao longo do guia e precisam ser trocados
pelos seus:

| Espaço reservado | Troque por |
|---|---|
| `your-username` | Seu nome de usuário no GitHub |
| `C:\projects\docusaurus-learning` | A pasta onde você decidiu colocar o projeto |

O nome do repositório (`docusaurus-learning`) é uma sugestão. Se usar outro, troque
também.

## Duas regras de idioma

Elas parecem detalhe e evitam retrabalho:

1. **O guia é em português.** Toda a explicação, os avisos e os exercícios — ou
   seja, tudo que está **fora** de um bloco de código.
2. **Todo bloco de código é em inglês.** Nome de pasta, nome de arquivo, front
   matter, títulos, texto das páginas, nome de componente, nome de branch,
   mensagem de commit — e **os comentários dentro do código**, inclusive os que
   servem só de anotação.

A regra 2 vale mesmo para comando de terminal que você digita uma vez e não
salva. É mais fácil seguir "código é em inglês, ponto" do que decidir caso a caso
o que vira arquivo e o que não vira.

O motivo da regra 2 é prático: nome de arquivo com acento (`configuração.md`)
quebra em servidor Linux, em URL e em Git. E inglês é o padrão que qualquer pessoa
que abrir o repositório consegue ler — incluindo os comentários, que são a
primeira coisa que alguém lê ao chegar num código desconhecido.

## O site que você vai construir

Documentação de uma ferramenta de linha de comando fictícia chamada **Nimbus**.
Ela não existe — o que importa é ter um assunto concreto para escrever, em vez de
páginas com "Lorem ipsum".

Ao final você terá: visão geral, guia de instalação com abas por sistema
operacional, seção de configuração, referência de comandos, FAQ, blog com autores
e tags, busca funcionando, componentes React próprios e o site publicado no ar.

## Os módulos

### Fundação

| # | Módulo | Você sai sabendo |
|---|---|---|
| 00 | [Preparando o ambiente](./00-environment-setup.md) | Instalar Node, Git e VS Code; escolher a pasta do projeto sem criar problema para depois |
| 01 | [Git e GitHub](./01-git-and-github.md) | Criar o repositório, escrever um bom README, fazer commit, enviar para o GitHub e saber quando usar branch |
| 02 | [Criando o site](./02-creating-the-site.md) | Gerar o projeto, subir o servidor e entender cada pasta |

### Conteúdo

| # | Módulo | Você sai sabendo |
|---|---|---|
| 03 | [Sua primeira página](./03-first-page.md) | Front matter, categorias, `slug`, `id` e ordem no menu |
| 04 | [Escrevendo em Markdown](./04-writing-markdown.md) | Tabelas, listas, âncoras fixas e links validados no build |
| 05 | [Admonitions e código](./05-admonitions-and-code.md) | Caixas de aviso, destaque de linha e abas sincronizadas |
| 06 | [Imagens e ícones](./06-images-and-icons.md) | `static/` vs `require()`, imagem que troca com o tema, ícones |

### Estrutura e aparência

| # | Módulo | Você sai sabendo |
|---|---|---|
| 07 | [Navegação e sidebar](./07-navigation-and-sidebar.md) | Controlar o menu lateral, a navbar e o rodapé |
| 08 | [Componentes e layout](./08-components-and-layout.md) | Grid do Infima e seu primeiro componente React |
| 09 | [Identidade visual](./09-visual-identity.md) | Cores, logo, fontes e modo escuro |

### Publicação

| # | Módulo | Você sai sabendo |
|---|---|---|
| 10 | [Blog e páginas](./10-blog-and-pages.md) | Posts com autor e tag; páginas fora da documentação |
| 11 | [Recursos avançados](./11-advanced-features.md) | Busca, diagramas Mermaid, versionamento e tradução |
| 12 | [Build e publicação](./12-build-and-deploy.md) | `url` e `baseUrl`, GitHub Pages, publicação automática e o fluxo de branch + Pull Request |

### Consulta

| # | Módulo | Para quê |
|---|---|---|
| 13 | [Catálogo de recursos](./13-feature-catalog.md) | O que o Docusaurus faz além do que você construiu — partials, plugins, navbar centralizada, site offline |
| 99 | [Solução de problemas](./99-troubleshooting.md) | Os erros que você vai encontrar, organizados por sintoma |

## Por onde começar

Faça na ordem, do 00 ao 12. Os módulos se apoiam uns nos outros: o site que você
constrói no 03 é o mesmo que você estiliza no 09 e publica no 12.

Os módulos 13 e 99 não são para ler de ponta a ponta — são de consulta. O 99 é
organizado por sintoma, para quando algo quebrar; o 13 é um catálogo do que existe,
para quando você pensar "será que dá para fazer X?". Vale dar uma olhada nos
títulos dos dois agora, só para saber o que tem lá.

➡️ Comece pelo [Módulo 00 — Preparando o ambiente](./00-environment-setup.md).

## Você não precisa saber

- **React ou JavaScript** — só aparecem a partir do Módulo 08, explicados linha a linha.
- **Git** — o Módulo 01 começa do "o que é um commit".
- **Terminal** — o Módulo 00 tem a tabela dos comandos que você vai usar.

O que ajuda ter: familiaridade com Markdown básico. Se não tiver, o Módulo 04
cobre tudo do zero.
