// Normalizes the backend-exported OpenAPI spec for doc rendering without
// mutating the pristine source (so re-exports from the API stay drop-in):
//   - replaces the dev `servers` entry with the production base URL
//   - merges request/response examples from openapi/examples.json (keyed by
//     operationId) so code samples get real payloads and responses render
//   - применяет русский оверлей переводов и пишет отдельную спецификацию для ru
//
// Спецификация экспортируется бэкендом на английском. Русская версия получается
// наложением openapi/ru-overlay.json — саму спецификацию не трогаем, иначе
// следующий экспорт затрёт перевод. Подробности — в scripts/openapi-i18n.mjs.
//
// Reads:  openapi/verificahub-api-v1.json   (source of truth, as exported)
//         openapi/examples.json             (curated examples overlay)
//         openapi/ru-overlay.json           (переводы, JSON Pointer -> {en, ru})
// Writes: openapi/normalized.json           (en, build artifact for the plugin)
//         openapi/normalized.ru.json        (ru, build artifact for the plugin)
//         static/openapi/verificahub-api-v1.json     (served for the Download button)
//         static/openapi/verificahub-api-v1.ru.json  (то же на русском)
import {mkdirSync, readFileSync, writeFileSync, existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname, resolve} from 'node:path';
import {applyOverlay} from './openapi-i18n.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = resolve(root, 'openapi/verificahub-api-v1.json');
const EXAMPLES = resolve(root, 'openapi/examples.json');
const OVERLAY_RU = resolve(root, 'openapi/ru-overlay.json');
const OUT = resolve(root, 'openapi/normalized.json');
const OUT_RU = resolve(root, 'openapi/normalized.ru.json');
const STATIC_OUT = resolve(root, 'static/openapi/verificahub-api-v1.json');
const STATIC_OUT_RU = resolve(root, 'static/openapi/verificahub-api-v1.ru.json');

const PROD_URL = 'https://api.verificahub.ru';
// Описание сервера подставляется сборкой, а не приходит из спецификации, поэтому
// переводится здесь, а не через оверлей — иначе оверлей считал бы его непереведённой
// строкой спецификации на каждом прогоне.
const SERVER_DESCRIPTION = {en: 'Production', ru: 'Продакшен'};

const spec = JSON.parse(readFileSync(SRC, 'utf8'));

// Merge curated examples (overlay) into request bodies / responses by operationId
const examples = JSON.parse(readFileSync(EXAMPLES, 'utf8'));
const jsonOf = (holder) => holder?.content?.['application/json'];
let merged = 0;
for (const methods of Object.values(spec.paths ?? {})) {
  for (const op of Object.values(methods)) {
    const ov = op && op.operationId ? examples[op.operationId] : undefined;
    if (!ov) continue;
    if (ov.requestBody) {
      const c = jsonOf(op.requestBody);
      if (c) {
        c.example = ov.requestBody;
        merged++;
      }
    }
    for (const [code, ex] of Object.entries(ov.responses ?? {})) {
      const c = jsonOf(op.responses?.[code]);
      if (c) {
        c.example = ex;
        merged++;
      }
    }
  }
}

// Русская версия — тот же спек с наложенным оверлеем. Оверлей накладывается до того,
// как в спецификацию попадёт сборочное описание сервера.
const overlay = existsSync(OVERLAY_RU) ? JSON.parse(readFileSync(OVERLAY_RU, 'utf8')) : {};
const ru = applyOverlay(spec, overlay, 'ru');

spec.servers = [{url: PROD_URL, description: SERVER_DESCRIPTION.en}];
ru.spec.servers = [{url: PROD_URL, description: SERVER_DESCRIPTION.ru}];

const serialized = JSON.stringify(spec, null, 2);
writeFileSync(OUT, serialized);
mkdirSync(dirname(STATIC_OUT), {recursive: true});
writeFileSync(STATIC_OUT, serialized);
console.log(`[prepare-openapi] ${SRC} -> ${OUT} + ${STATIC_OUT} (server: ${PROD_URL}, examples merged: ${merged})`);

const serializedRu = JSON.stringify(ru.spec, null, 2);
writeFileSync(OUT_RU, serializedRu);
writeFileSync(STATIC_OUT_RU, serializedRu);
console.log(
  `[prepare-openapi] ru: переведено ${ru.translated}` +
    (ru.missing.length ? `, без перевода ${ru.missing.length}` : '') +
    (ru.stale.length ? `, устарело ${ru.stale.length}` : '') +
    ` -> ${OUT_RU}`,
);
if (ru.missing.length || ru.stale.length) {
  // Не роняем сборку: непереведённая строка показывается по-английски, это лучше,
  // чем отсутствующая страница. Жёсткую проверку делает `npm run api:i18n -- --check` в CI.
  console.warn('[prepare-openapi] русский перевод неполон — запустите `npm run api:i18n`');
}
