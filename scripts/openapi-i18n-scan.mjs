// Сверяет оверлей переводов со спецификацией.
//
//   npm run api:i18n           — отчёт: чего не хватает, что устарело, что осиротело
//   npm run api:i18n -- --write — дописывает в оверлей заготовки для непереведённых
//                                 строк (ru: "") и обновляет en у устаревших
//   npm run api:i18n -- --check — молча, но с ненулевым кодом возврата, если есть
//                                 непереведённые или устаревшие строки (для CI)
import {readFileSync, writeFileSync, existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname, resolve} from 'node:path';
import {extractStrings, applyOverlay} from './openapi-i18n.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SPEC = resolve(root, 'openapi/verificahub-api-v1.json');
const OVERLAY = resolve(root, 'openapi/ru-overlay.json');
const write = process.argv.includes('--write');
const check = process.argv.includes('--check');

const spec = JSON.parse(readFileSync(SPEC, 'utf8'));
const overlay = existsSync(OVERLAY) ? JSON.parse(readFileSync(OVERLAY, 'utf8')) : {};
const total = extractStrings(spec).length;
const {translated, missing, stale, orphaned} = applyOverlay(spec, overlay, 'ru');

if (!check) {
  console.log(`[api:i18n] строк в спецификации: ${total}`);
  console.log(`[api:i18n] переведено: ${translated}`);
  if (missing.length) {
    console.log(`\n[api:i18n] без перевода (${missing.length}):`);
    for (const m of missing.slice(0, 40)) console.log(`  ${m.pointer}\n      ${m.text.slice(0, 90)}`);
    if (missing.length > 40) console.log(`  …и ещё ${missing.length - 40}`);
  }
  if (stale.length) {
    console.log(`\n[api:i18n] устарели — английский изменился после перевода (${stale.length}):`);
    for (const s of stale) console.log(`  ${s.pointer}\n      было: ${s.was.slice(0, 80)}\n      стало: ${s.now.slice(0, 80)}`);
  }
  if (orphaned.length) {
    console.log(`\n[api:i18n] осиротели — в спецификации таких строк больше нет (${orphaned.length}):`);
    for (const p of orphaned) console.log(`  ${p}`);
  }
}

if (write) {
  const next = {...overlay};
  for (const {pointer, text} of missing) next[pointer] = {en: text, ru: ''};
  // У устаревших подтягиваем новый английский, перевод оставляем для правки.
  for (const {pointer, now} of stale) next[pointer] = {en: now, ru: overlay[pointer]?.ru ?? ''};
  for (const p of orphaned) delete next[p];
  // Порядок ключей — как в спецификации: осмысленные диффы при экспорте новой версии.
  const order = extractStrings(spec).map((s) => s.pointer);
  const sorted = Object.fromEntries(
    Object.keys(next).sort((a, b) => order.indexOf(a) - order.indexOf(b)).map((k) => [k, next[k]]),
  );
  writeFileSync(OVERLAY, JSON.stringify(sorted, null, 2) + '\n');
  console.log(`\n[api:i18n] оверлей обновлён: ${OVERLAY}`);
  console.log(`[api:i18n] заполните поля "ru" у записей с пустым значением`);
}

if (check && (missing.length || stale.length)) {
  console.error(
    `[api:i18n] русский перевод неполон: без перевода ${missing.length}, устарело ${stale.length}.\n` +
    `           Запустите: npm run api:i18n -- --write, заполните "ru", повторите.`,
  );
  process.exit(1);
}
