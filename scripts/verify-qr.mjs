import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const root = resolve(scriptDirectory, '..');
const svg = await readFile(resolve(root, 'assets/card/qr-sandracaceres.svg'), 'utf8');
const expected = 'https://sandracaceres.eu/?utm_source=tarjeta&utm_medium=qr&utm_campaign=contacto';

const moduleSize = 22;
const matrixSize = 45;
const quietZone = 4;
const pixelScale = 8;
const imageModules = matrixSize + quietZone * 2;
const width = imageModules * pixelScale;
const data = new Uint8ClampedArray(width * width * 4);

for (let i = 0; i < data.length; i += 4) {
  data[i] = 255;
  data[i + 1] = 255;
  data[i + 2] = 255;
  data[i + 3] = 255;
}

const modules = [...svg.matchAll(/M\s+(\d+),(\d+)\s+l\s+22,0\s+0,22\s+-22,0\s+z/g)];
if (!modules.length) throw new Error('No se encontraron módulos en el SVG del QR.');

for (const match of modules) {
  const moduleX = Number(match[1]) / moduleSize + quietZone;
  const moduleY = Number(match[2]) / moduleSize + quietZone;
  for (let y = 0; y < pixelScale; y += 1) {
    for (let x = 0; x < pixelScale; x += 1) {
      const pixelX = moduleX * pixelScale + x;
      const pixelY = moduleY * pixelScale + y;
      const offset = (pixelY * width + pixelX) * 4;
      data[offset] = 0;
      data[offset + 1] = 0;
      data[offset + 2] = 0;
    }
  }
}

const libraryResponse = await fetch('https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js');
if (!libraryResponse.ok) throw new Error(`No se pudo cargar jsQR: HTTP ${libraryResponse.status}`);
const librarySource = await libraryResponse.text();
const moduleShim = { exports: {} };
new Function('module', 'exports', librarySource)(moduleShim, moduleShim.exports);
const jsQR = moduleShim.exports;
const result = jsQR(data, width, width, { inversionAttempts: 'dontInvert' });

if (!result || result.data !== expected) {
  throw new Error(`El QR no coincide. Esperado: ${expected}. Leído: ${result?.data ?? 'sin lectura'}`);
}

console.log(`QR verificado: ${result.data}`);

