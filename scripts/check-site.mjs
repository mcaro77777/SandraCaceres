import { access, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const root = resolve(scriptDirectory, '..');
const required = [
  'index.html',
  'styles.css',
  'site.js',
  'Dockerfile',
  'nginx.conf',
  'assets/favicon.svg',
  'assets/card/card-front.svg',
  'assets/card/card-back.svg',
  'assets/card/qr-sandracaceres.svg',
];

await Promise.all(required.map((file) => access(resolve(root, file))));

const html = await readFile(resolve(root, 'index.html'), 'utf8');
const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
const internalLinks = [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
const missingTargets = internalLinks.filter((target) => !ids.has(target));

if (missingTargets.length) {
  throw new Error(`Enlaces internos sin destino: ${[...new Set(missingTargets)].join(', ')}`);
}

if (html.includes('wa.me') || html.includes('api.whatsapp.com')) {
  throw new Error('No debe publicarse un enlace de WhatsApp hasta verificar el teléfono.');
}

const cardBack = await readFile(resolve(root, 'assets/card/card-back.svg'), 'utf8');
if (cardBack.includes('{{QR_SVG}}')) {
  throw new Error('El reverso final aún contiene el marcador del QR.');
}

console.log(`Verificación correcta: ${required.length} archivos, ${internalLinks.length} enlaces internos.`);

