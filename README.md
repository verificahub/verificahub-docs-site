# Verificahub Docs Site

Движок документации Verificahub на **Docusaurus**. При сборке (CI) клонирует
контент из [`verificahub-docs`](https://github.com/verificahub/verificahub-docs),
подставляет `docs/`, собирает статический сайт и публикует его на GitHub Pages.

Прод: **https://docs.verificahub.ru**

Стиль (палитра, шрифты, логотип, шапка/подвал) повторяет лендинг
`verificahub-web-landing`.

## Локальная разработка

```bash
npm install
npm start          # дев-сервер
npm run build      # прод-сборка
```

Папка `docs/` в этом репозитории — **локальный фолбэк** (копия контента), чтобы
сайт собирался офлайн. В CI она заменяется содержимым из `verificahub-docs`.

## Архитектура

Два репозитория работают вместе:

1. `verificahub-docs` — источник истины для Markdown-контента и `registry/links.json`.
2. `verificahub-docs-site` (этот репозиторий) — движок и тема Docusaurus.
   CI клонирует контент, заменяет `docs/`/`i18n/`, собирает `build/` и
   деплоит через `actions/deploy-pages`.

## CI/CD

Workflow: `.github/workflows/deploy.yml`. Триггеры:
- push в `production`
- `repository_dispatch` типа `docs-update` (его шлёт `verificahub-docs` при пуше)
- ручной запуск (`workflow_dispatch`)

## Настройка GitHub

- **Settings → Pages → Source = GitHub Actions**
- **Custom domain**: `docs.verificahub.ru` (см. `CNAME`)
- Опциональный секрет `DOCS_REPO_TOKEN` — если `verificahub-docs` приватный
- Опциональные секреты DocSearch: `DOCSEARCH_APP_ID`, `DOCSEARCH_API_KEY`,
  `DOCSEARCH_INDEX_NAME` (без них поиск скрыт)

## DNS

- Тип: `CNAME`, Имя: `docs`, Значение: `verificahub.github.io`
