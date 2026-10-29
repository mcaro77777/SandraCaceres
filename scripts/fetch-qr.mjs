import { writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const root = resolve(scriptDirectory, '..');
const targetUrl = 'https://sandracaceres.eu/?utm_source=tarjeta&utm_medium=qr&utm_campaign=contacto';
const endpoint = new URL('https://api.qrserver.com/v1/create-qr-code/');

endpoint.searchParams.set('size', '1000x1000');
endpoint.searchParams.set('format', 'svg');
endpoint.searchParams.set('ecc', 'Q');
endpoint.searchParams.set('data', targetUrl);

const response = await fetch(endpoint);
if (!response.ok) throw new Error(`No se pudo generar el QR: HTTP ${response.status}`);

const svg = await response.text();
if (!svg.includes('<svg') || !svg.includes('sandracaceres.eu')) {
  throw new Error('La respuesta recibida no contiene el QR esperado.');
}

await writeFile(resolve(root, 'assets/card/qr-sandracaceres.svg'), svg, 'utf8');
console.log(`QR generado para: ${targetUrl}`);

