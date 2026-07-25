import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import type * as OpenApiPlugin from 'docusaurus-plugin-openapi-docs';

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

  // favicon.ico is emitted from the `favicon` field above; these cover the
  // PNG variants, Apple touch icon, and the brand theme color.
  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/img/favicon-32x32.png',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/img/favicon-16x16.png',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'apple-touch-icon',
        href: '/img/apple-touch-icon.png',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'theme-color',
        content: '#ece7db',
      },
    },
  ],

  i18n: {
    defaultLocale: 'ru',
    locales: ['ru', 'en'],
    localeConfigs: {
      ru: {label: 'Русский'},
      en: {label: 'English'},
    },
  },

  // Render ```mermaid fenced blocks as diagrams (used by the integration guide).
  markdown: {
    mermaid: true,
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // required so the OpenAPI theme can render generated API pages
          docItemComponent: '@theme/ApiItem',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      'docusaurus-plugin-openapi-docs',
      {
        id: 'openapi',
        docsPluginId: 'classic',
        config: {
          v1: {
            // normalized.json is produced by `npm run prepare-api` from the
            // pristine openapi/verificahub-api-v1.json (sets the prod server).
            specPath: 'openapi/normalized.json',
            outputDir: 'docs/reference',
            downloadUrl:
              'https://docs.verificahub.ru/openapi/verificahub-api-v1.json',
            sidebarOptions: {
              groupPathsBy: 'tag',
              categoryLinkSource: 'tag',
            },
            hideSendButton: true,
          } satisfies OpenApiPlugin.Options,
        },
      },
    ],
  ],

  themes: ['docusaurus-theme-openapi-docs', '@docusaurus/theme-mermaid'],

  themeConfig: {
    image: 'img/social-card.png',
    // multi-language code samples shown in the API reference right rail
    languageTabs: [
      {highlight: 'bash', language: 'curl', logoClass: 'curl'},
      {highlight: 'go', language: 'go', logoClass: 'go'},
      {highlight: 'javascript', language: 'nodejs', logoClass: 'nodejs'},
      {highlight: 'python', language: 'python', logoClass: 'python'},
      {highlight: 'php', language: 'php', logoClass: 'php'},
      {highlight: 'java', language: 'java', logoClass: 'java', variant: 'unirest'},
    ],
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
        {
          type: 'localeDropdown',
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
    // Footer is rendered by the swizzled src/theme/Footer (mirrors verificahub.ru).
    prism: {
      // dark code blocks on the cream site → richer syntax highlighting
      theme: prismThemes.oneDark,
      darkTheme: prismThemes.oneDark,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
