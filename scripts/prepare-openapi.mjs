// Normalizes the backend-exported OpenAPI spec for doc rendering without
// mutating the pristine source (so re-exports from the API stay drop-in):
//   - replaces the dev `servers` entry with the production base URL
//   - merges request/response examples from openapi/examples.json (keyed by
//     operationId) so code samples get real payloads and responses render
// Reads:  openapi/verificahub-api-v1.json   (source of truth, as exported)
//         openapi/examples.json             (curated examples overlay)
// Writes: openapi/normalized.json           (build artifact, fed to the plugin)
//         static/openapi/verificahub-api-v1.json  (served for the Download button)
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname, resolve} from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = resolve(root, 'openapi/verificahub-api-v1.json');
const EXAMPLES = resolve(root, 'openapi/examples.json');
const OUT = resolve(root, 'openapi/normalized.json');
const STATIC_OUT = resolve(root, 'static/openapi/verificahub-api-v1.json');

const PROD_SERVER = {
  url: 'https://api.verificahub.ru',
  description: 'Production',
};

const spec = JSON.parse(readFileSync(SRC, 'utf8'));
spec.servers = [PROD_SERVER];

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

const serialized = JSON.stringify(spec, null, 2);
writeFileSync(OUT, serialized);
mkdirSync(dirname(STATIC_OUT), {recursive: true});
writeFileSync(STATIC_OUT, serialized);
console.log(`[prepare-openapi] ${SRC} -> ${OUT} + ${STATIC_OUT} (server: ${PROD_SERVER.url}, examples merged: ${merged})`);
