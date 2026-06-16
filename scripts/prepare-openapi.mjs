// Normalizes the backend-exported OpenAPI spec for doc rendering without
// mutating the pristine source (so re-exports from the API stay drop-in):
//   - replaces the dev `servers` entry with the production base URL
// Reads:  openapi/verificahub-api-v1.json   (source of truth, as exported)
// Writes: openapi/normalized.json           (build artifact, fed to the plugin)
//         static/openapi/verificahub-api-v1.json  (served for the Download button)
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname, resolve} from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = resolve(root, 'openapi/verificahub-api-v1.json');
const OUT = resolve(root, 'openapi/normalized.json');
const STATIC_OUT = resolve(root, 'static/openapi/verificahub-api-v1.json');

const PROD_SERVER = {
  url: 'https://api.verificahub.ru',
  description: 'Production',
};

const spec = JSON.parse(readFileSync(SRC, 'utf8'));
spec.servers = [PROD_SERVER];

const serialized = JSON.stringify(spec, null, 2);
writeFileSync(OUT, serialized);
mkdirSync(dirname(STATIC_OUT), {recursive: true});
writeFileSync(STATIC_OUT, serialized);
console.log(`[prepare-openapi] ${SRC} -> ${OUT} + ${STATIC_OUT} (server: ${PROD_SERVER.url})`);
