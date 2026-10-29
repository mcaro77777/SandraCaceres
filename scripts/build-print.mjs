import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const root = resolve(scriptDirectory, '..');
const qrPath = resolve(root, 'assets/card/qr-sandracaceres.svg');
const templatePath = resolve(root, 'assets/card/card-back.template.svg');
const outputPath = resolve(root, 'assets/card/card-back.svg');

const [qrSource, template] = await Promise.all([
  readFile(qrPath, 'utf8'),
  readFile(templatePath, 'utf8'),
]);

const qrInner = qrSource
  .replace(/^<\?xml[^>]*>\s*/i, '')
  .replace(/^<svg[^>]*>/i, '')
  .replace(/<\/svg>\s*$/i, '')
  .replace(/<title>.*?<\/title>/is, '')
  .replace(/<desc>.*?<\/desc>/is, '');

const embeddedQr = `<svg x="0" y="0" width="220" height="220" viewBox="0 0 990 990" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${qrInner}</svg>`;
const output = template.replace('{{QR_SVG}}', embeddedQr);

if (output.includes('{{QR_SVG}}')) {
  throw new Error('No se pudo incrustar el QR en el reverso de la tarjeta.');
}

await writeFile(outputPath, output, 'utf8');
console.log(`Tarjeta generada: ${outputPath}`);

