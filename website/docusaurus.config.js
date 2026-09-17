// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Nimbus',
  tagline: 'Sync your data without thinking about it',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://marcelosub1993.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/docusaurus-learning/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'marcelosub1993', // Usually your GitHub org/user name.
  projectName: 'docusaurus-learning', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt-BR'],
    localeConfigs: {
      en: {label: 'English'},
      'pt-BR': {label: 'Português'}
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
          admonitions: {
            keywords: ['costly'],
            extendDefaults: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          breadcrumbs: false,
          lastVersion: '1.0',
          versions: {
                      current: {label: '2.0 (in development)', path: 'next'},
                      '1.0': {label: '1.0 (stable)'},
                    },
          editUrl:
            'https://github.com/marcelosub1993/docusaurus-learning/tree/main/website/',
        },
        blog: {
          showReadingTime: true, // "5 min read..."
          blogTitle: 'Nimbus news',
          blogDescription: 'Release notes and announcements',
          postsPerPage: 10,
          blogSidebarTitle: 'Recent posts',
          blogSidebarCount:5,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/marcelosub1993/docusaurus-learning/tree/main/website/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      zoom: {
        selector: '.markdown img',
        background: {
          light: 'rgb(255, 255, 255)',
          dark: 'rgb(27, 27, 29)',
        },
      },
      // Replace with your project's social card
      image: 'img/image-site.jpg',
      colorMode: {
        //defaultMode: 'dark',
        //disableSwitch: true, // true removes the theme toggle
        respectPrefersColorScheme: true, // follows the system preference
      },

      docs: {
        sidebar: {
          hideable: true,
        }
      },

      navbar: {
        title: 'Nimbus',
        logo: {
          alt: 'Nimbus logo',
          src: 'img/google-keep.svg',
          srcDark: 'img/google-keep.svg',   // optional: dark mode version
          width: 32,
          height: 32,
          href: '/'
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'guideSidebar',
            position: 'left',
            label: 'Guide',
          },
          {
            type: 'docSidebar',
            sidebarId: 'referenceSidebar',
            position: 'left',
            label: 'Reference',
          },
          
          // Dropdown menu
          {
            type: 'dropdown',
            label: 'Resources',
            position: 'left',
            items: [
              {type: 'doc', docId: 'syntax-reference', label: 'Syntax reference'},
              {to: '/docs/category/configuration', label: 'Configuration'},
              {href: 'https://docusaurus.io', label: 'Docusaurus ↗'},
            ],
          },


          {to: '/blog', label: 'Blog', position: 'left'},

          {
            type: 'docsVersionDropdown', 
            position: 'right',
          },

          {type: 'localeDropdown', position: 'right'},



          // positions the search bar

          {
            href: 'https://github.com/marcelosub1993/docusaurus-learning/tree/main/website/',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },

      footer: {
        style: 'dark',
        logo: {alt: 'Nimbus logo', src: 'img/google-keep.svg', href: '/', width: 48},
        links: [
          {
            title: 'Documentation',
            items: [
              {label: 'Get Started', to: '/docs/installation'},
              {label: 'Configuration', to: '/docs/category/configuration'},
              {label: 'Syntax reference', to: '/docs/syntax-reference'},
            ],
          },
          {
            title: 'Support',
            items: [
              {label: 'Frequently asked questions', to: '/docs/faq-licensing'},
              {label: 'Report an issue', href: 'https://github.com/marcelosub1993/docusaurus-learning/issues'},
              {label: 'Contact', to: '/contact'}
            ],
          },
          {
            title: 'More',
            items: [
              {label: 'Blog', to: '/blog'},
              {label: 'GitHub', href: 'https://github.com/marcelosub1993/docusaurus-learning'},
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Nimbus. Built with Docusaurus.`,
      },

      announcementBar: {
        id: 'release_2_2',
        content:
          '🚀 Nimbus 2.2 is out. <a href="/blog">Read the release notes</a>.',
        backgroundColor: '#000000',
        textColor: '#ffc629',
        isCloseable: true,
      },

      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),

  markdown: {
    mermaid: true,
  },

  plugins: [
    'docusaurus-plugin-image-zoom',
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          {from: '/docs/intro', to: '/docs/'},
          {from: '/docs/reference', to: '/docs/syntax-reference'},
        ],
      },
    ],
  ],

  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],

  themes: [
    '@docusaurus/theme-mermaid',
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        language: ['en'],
        indexDocs: true,
        indexBlog: true,
        indexPages: true,
        highlightSearchTermsOnTargetPage: true,
      },
    ],
  ]

};

export default config;
