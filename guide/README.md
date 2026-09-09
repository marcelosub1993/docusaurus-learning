# Guia de Docusaurus — do zero ao site publicado

Um curso prático, em 14 módulos, para aprender Docusaurus construindo um site de
documentação de verdade e registrando tudo no Git.

## Como este guia funciona

Cada módulo segue a mesma estrutura:

| Elemento | O que é |
|---|---|
| **Objetivo / Tempo / Pré-requisito** | O que você sai sabendo e quanto custa |
| **Passos numerados** | A parte guiada — comando, arquivo, resultado esperado |
| **✅ Checkpoint** | Lista de verificação antes de seguir |
| **🎯 Exercício** | A parte sem colinha, com esqueleto pronto e critério de acerto |
| **📌 O que você aprendeu** | O resumo de uma frase |

E três símbolos aparecem o tempo todo:

| Símbolo | Significa |
|---|---|
| 💻 | Rode isto no terminal |
| 📄 | Crie ou edite este arquivo |
| 👀 | O que você deve ver acontecer |

## Duas regras de idioma

Elas parecem detalhe e evitam retrabalho:

1. **O guia é em português.** Toda a explicação, os avisos e os exercícios.
2. **Tudo dentro do site é em inglês.** Nome de pasta, nome de arquivo, front
   matter, títulos, texto das páginas, nome de componente, nome de branch e
   mensagem de commit.

O motivo da segunda regra é prático: nome de arquivo com acento (`configuração.md`)
quebra em servidor Linux, em URL e em Git. E como o repositório vai ser público,
inglês é o padrão que o resto do mundo consegue ler.

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
| 00 | [Preparando o ambiente](./00-environment-setup.md) | Instalar Node, Git e VS Code; deixar a pasta do projeto pronta para funcionar dentro do OneDrive |
| 01 | [Git e GitHub](./01-git-and-github.md) | Criar o repositório, escrever um bom README, fazer commit e enviar para o GitHub |
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
| 12 | [Build e publicação](./12-build-and-deploy.md) | `url` e `baseUrl`, GitHub Pages e publicação automática |

### Consulta

| # | Módulo | Para quê |
|---|---|---|
| 99 | [Solução de problemas](./99-troubleshooting.md) | Os erros que você vai encontrar, organizados por sintoma |

## Por onde começar

Faça na ordem, do 00 ao 12. Os módulos se apoiam uns nos outros: o site que você
constrói no 03 é o mesmo que você estiliza no 09 e publica no 12.

O Módulo 99 não é para ler de ponta a ponta — é para consultar quando algo quebrar.
Vale dar uma olhada nos títulos agora, só para saber o que tem lá.

➡️ Comece pelo [Módulo 00 — Preparando o ambiente](./00-environment-setup.md).

## Você não precisa saber

- **React ou JavaScript** — só aparecem a partir do Módulo 08, explicados linha a linha.
- **Git** — o Módulo 01 começa do "o que é um commit".
- **Terminal** — o Módulo 00 tem a tabela dos comandos que você vai usar.

O que ajuda ter: familiaridade com Markdown básico. Se não tiver, o Módulo 04
cobre tudo do zero.
