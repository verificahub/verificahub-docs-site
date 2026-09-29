// Перевод OpenAPI-спецификации без её редактирования.
//
// Спецификация экспортируется бэкендом на английском и является источником истины —
// править её руками нельзя, следующий экспорт затрёт правки. Поэтому переводы живут
// отдельным оверлеем (`openapi/ru-overlay.json`) и накладываются на сборке.
//
// Ключ записи — JSON Pointer (RFC 6901) до переводимой строки. Вместе с переводом
// хранится английский оригинал на момент перевода: если в спецификации он изменился,
// перевод считается устаревшим, и сборка об этом сообщает. Без этой сверки переводы
// тихо расходятся с оригиналом — это основная причина, по которой переводы документации
// протухают.
//
//   { "/paths/~1v1~1verify/post/summary": { "en": "Initiate…", "ru": "Инициировать…" } }

/** Ключи, значение которых показывается пользователю и подлежит переводу. */
const TRANSLATABLE = new Set(['summary', 'description', 'title']);

const escape = (token) => token.replace(/~/g, '~0').replace(/\//g, '~1');

/** Все переводимые строки спецификации: [{pointer, text}], в порядке обхода. */
export function extractStrings(spec) {
  const out = [];
  const walk = (node, pointer) => {
    if (Array.isArray(node)) {
      node.forEach((item, i) => walk(item, `${pointer}/${i}`));
      return;
    }
    if (node === null || typeof node !== 'object') return;
    for (const [key, value] of Object.entries(node)) {
      const child = `${pointer}/${escape(key)}`;
      if (TRANSLATABLE.has(key) && typeof value === 'string' && value.trim()) {
        out.push({pointer: child, text: value});
      } else {
        walk(value, child);
      }
    }
  };
  walk(spec, '');
  return out;
}

/** Записывает значение по JSON Pointer. Возвращает false, если путь не существует. */
function setByPointer(spec, pointer, value) {
  const tokens = pointer
    .split('/')
    .slice(1)
    .map((t) => t.replace(/~1/g, '/').replace(/~0/g, '~'));
  let node = spec;
  for (const token of tokens.slice(0, -1)) {
    if (node === undefined || node === null) return false;
    node = Array.isArray(node) ? node[Number(token)] : node[token];
  }
  if (node === undefined || node === null) return false;
  const last = tokens.at(-1);
  if (Array.isArray(node)) node[Number(last)] = value;
  else node[last] = value;
  return true;
}

/**
 * Накладывает оверлей на копию спецификации.
 * Возвращает {spec, translated, missing, stale, orphaned} — вызывающий решает,
 * считать ли расхождения ошибкой.
 */
export function applyOverlay(spec, overlay, locale = 'ru') {
  const target = structuredClone(spec);
  const strings = extractStrings(spec);
  const seen = new Set();
  const missing = [];
  const stale = [];
  let translated = 0;

  for (const {pointer, text} of strings) {
    const entry = overlay[pointer];
    seen.add(pointer);
    if (!entry || !entry[locale]) {
      missing.push({pointer, text});
      continue;
    }
    if (entry.en !== text) {
      // Английский изменился после перевода — показываем оригинал, а не устаревший перевод.
      stale.push({pointer, was: entry.en, now: text});
      continue;
    }
    if (setByPointer(target, pointer, entry[locale])) translated++;
  }

  // Записи оверлея, которым в спецификации уже ничего не соответствует.
  const orphaned = Object.keys(overlay).filter((p) => !seen.has(p));
  return {spec: target, translated, missing, stale, orphaned};
}
