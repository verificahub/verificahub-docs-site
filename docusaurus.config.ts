import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)
const docsearchAppId = process.env.DOCSEARCH_APP_ID;
const docsearchApiKey = process.env.DOCSEARCH_API_KEY;
const docsearchIndexName = process.env.DOCSEARCH_INDEX_NAME;
const hasDocSearchConfig = Boolean(
  docsearchAppId && docsearchApiKey && docsearchIndexName,
);

const config: Config = {
  title: 'Verificahub Docs',
  tagline: 'Документация Verificahub',
  favicon: 'img/favicon.ico',

  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  url: 'https://docs.verificahub.ru',
  baseUrl: '/',
  trailingSlash: true,

  organizationName: 'verificahub',
  projectName: 'verificahub-docs-site',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'ru',
    locales: ['ru'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/verificahub/verificahub-docs/tree/production/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.png',
    algolia: hasDocSearchConfig
      ? {
          appId: docsearchAppId!,
          apiKey: docsearchApiKey!,
          indexName: docsearchIndexName!,
          contextualSearch: true,
          searchPagePath: 'search',
        }
      : undefined,
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      // Brand (mark + wordmark + DOCS tag) is rendered by the swizzled
      // src/theme/Navbar/Logo.tsx using the real brand components.
      items: [
        {
          to: '/docs',
          position: 'left',
          label: 'Документация',
        },
        {
          href: 'https://verificahub.ru',
          label: 'На сайт',
          position: 'right',
        },
        ...(hasDocSearchConfig
          ? [
              {
                type: 'search' as const,
                position: 'right' as const,
              },
            ]
          : []),
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Документация',
          items: [
            {label: 'Быстрый старт', to: '/docs/start/'},
            {label: 'API', to: '/docs/api/'},
            {label: 'Публичная оферта', to: '/docs/legal/public_offer/'},
            {label: 'Политика конфиденциальности', to: '/docs/legal/privacy_policy/'},
          ],
        },
        {
          title: 'Продукт',
          items: [
            {label: 'Verificahub', href: 'https://verificahub.ru'},
            {label: 'Тарифы', href: 'https://verificahub.ru/pricing'},
            {label: 'Контакты', href: 'https://verificahub.ru/contacts'},
          ],
        },
        {
          title: 'Репозитории',
          items: [
            {
              label: 'Контент документации',
              href: 'https://github.com/verificahub/verificahub-docs',
            },
            {
              label: 'Сайт документации',
              href: 'https://github.com/verificahub/verificahub-docs-site',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Verificahub. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
