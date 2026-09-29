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

## Справочник API: две локали

Спецификация приходит от бэкенда на английском и не правится руками. Русская версия
получается наложением оверлея переводов:

| Файл | Что это |
| --- | --- |
| `openapi/verificahub-api-v1.json` | спецификация как есть (источник истины, en) |
| `openapi/ru-overlay.json` | переводы: JSON Pointer → `{en, ru}` |
| `openapi/normalized.json` | en + примеры + прод-сервер (артефакт сборки) |
| `openapi/normalized.ru.json` | то же с переводом (артефакт сборки) |

Русские страницы генерируются в `docs/reference/` (локаль по умолчанию), английские —
в `i18n/en/docusaurus-plugin-content-docs/current/reference/`. Обе папки в `.gitignore`:
их пересоздаёт `npm run gen-api`, который вызывается из `npm run build`.

Рядом с переводом хранится английский оригинал на момент перевода. Если он разошёлся
со спецификацией, строка отдаётся по-английски, а `npm run api:i18n` показывает расхождение —
устаревший перевод не попадёт на сайт незаметно.

```bash
npm run api:i18n              # отчёт
npm run api:i18n -- --write   # заготовки для новых строк
npm run api:i18n -- --check   # код возврата для CI
```

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
