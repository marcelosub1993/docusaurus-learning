# Docusaurus Learning

A hands-on course for building documentation sites with [Docusaurus](https://docusaurus.io/),
written in Brazilian Portuguese, plus the practice site built while following it.

I built this while learning Docusaurus from zero. The guide is the notes I wish
I'd had: every step is a command to run and an expected result to compare against,
so nothing is left to guesswork.

## What's in here

| Path | What it is |
| --- | --- |
| [`guide/`](guide/) | The course: 14 modules, from installing Node.js to publishing the site |
| `website/` | The Docusaurus site built by following the guide |

The `website/` folder is created in Module 02. If you cloned this repository and it
isn't there yet, the guide walks you through generating it.

## Getting started

**Requirements**

- [Node.js](https://nodejs.org/) 20.0 or later
- [Git](https://git-scm.com/)

**Run the practice site locally**

```bash
cd website
npm install
npm start
```

The dev server starts at <http://localhost:3000> with hot reload.

**Other commands**

| Command | What it does |
| --- | --- |
| `npm start` | Dev server with hot reload |
| `npm run build` | Builds the production site into `build/` |
| `npm run serve` | Serves `build/` locally, exactly as it will be in production |
| `npm run clear` | Clears the `.docusaurus` cache |

## The course

Each module is self-contained: an objective, an estimated time, numbered steps,
a checkpoint, and an exercise. Modules build on each other in order.

| # | Module | Topic |
| --- | --- | --- |
| 00 | [Preparando o ambiente](guide/00-environment-setup.md) | Node.js, VS Code, Git, project folder |
| 01 | [Git e GitHub](guide/01-git-and-github.md) | Repository, commits, README, `.gitignore` |
| 02 | [Criando o site](guide/02-creating-the-site.md) | Scaffolding, dev server, folder tour |
| 03 | [Sua primeira página](guide/03-first-page.md) | Front matter, categories, URLs |
| 04 | [Escrevendo em Markdown](guide/04-writing-markdown.md) | Syntax, tables, links, anchors |
| 05 | [Admonitions e código](guide/05-admonitions-and-code.md) | Callouts, code blocks, tabs |
| 06 | [Imagens e ícones](guide/06-images-and-icons.md) | Static assets, themed images, icons |
| 07 | [Navegação e sidebar](guide/07-navigation-and-sidebar.md) | `sidebars.js`, navbar, footer |
| 08 | [Componentes e layout](guide/08-components-and-layout.md) | Infima grid, React components, CSS Modules |
| 09 | [Identidade visual](guide/09-visual-identity.md) | Colors, logo, fonts, dark mode |
| 10 | [Blog e páginas](guide/10-blog-and-pages.md) | Posts, authors, tags, standalone pages |
| 11 | [Recursos avançados](guide/11-advanced-features.md) | Search, Mermaid, versioning, i18n |
| 12 | [Build e publicação](guide/12-build-and-deploy.md) | `baseUrl`, GitHub Pages, CI |
| 99 | [Solução de problemas](guide/99-troubleshooting.md) | Errors by symptom, with fixes |

Start at [Module 00](guide/00-environment-setup.md), or read the
[guide index](guide/README.md) for the full description of each module.

## Conventions

- The guide is written in Portuguese; everything inside the Docusaurus site —
  file names, folder names, front matter, and page content — is in English.
- The practice site documents a fictional CLI tool called **Nimbus**, so the
  examples stay concrete without depending on any real product.

## Built with

- [Docusaurus](https://docusaurus.io/) 3.x
- [Infima](https://infima.dev/) (the CSS framework bundled with the classic theme)
- [React](https://react.dev/) 19

## License

The guide text is released under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
The code in `website/` is released under the [MIT License](LICENSE).
