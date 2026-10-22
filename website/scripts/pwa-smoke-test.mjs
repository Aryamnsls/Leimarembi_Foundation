#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] || 'public');
const fail = (message) => { console.error(`FAIL: ${message}`); process.exitCode = 1; };
const read = (relative) => fs.readFileSync(path.join(root, relative));
const exists = (relative) => fs.existsSync(path.join(root, relative));

for (const file of ['manifest.webmanifest', 'sw.js', 'offline.html', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/apple-touch-icon.png']) {
  if (!exists(file)) fail(`missing ${path.join(root, file)}`);
}
if (process.exitCode) process.exit();

let manifest;
try { manifest = JSON.parse(read('manifest.webmanifest').toString('utf8')); }
catch (error) { fail(`manifest is not valid JSON: ${error.message}`); process.exit(); }

for (const expected of [
  { src: '/icons/icon-192.png', width: 192, height: 192 },
  { src: '/icons/icon-512.png', width: 512, height: 512 },
  { src: '/icons/icon-maskable-512.png', width: 512, height: 512 },
]) {
  if (!manifest.icons?.some((item) => item.src === expected.src && item.sizes === `${expected.width}x${expected.height}`)) {
    fail(`manifest is missing the ${expected.width}x${expected.height} icon entry ${expected.src}`);
  }
  const png = read(expected.src.slice(1));
  const signature = Buffer.from([137,80,78,71,13,10,26,10]);
  if (!png.subarray(0,8).equals(signature)) { fail(`${expected.src} is not a PNG`); continue; }
  const width = png.readUInt32BE(16), height = png.readUInt32BE(20);
  if (width !== expected.width || height !== expected.height) fail(`${expected.src} dimensions are ${width}x${height}, expected ${expected.width}x${expected.height}`);
}
const apple = read('icons/apple-touch-icon.png');
if (!apple.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])) || apple.readUInt32BE(16) !== 180 || apple.readUInt32BE(20) !== 180) fail('Apple touch icon must be a 180x180 PNG');

const sw = read('sw.js').toString('utf8');
if (!sw.includes("url.pathname === '/api' || url.pathname.startsWith('/api/')")) fail('service worker must explicitly exclude API routes');
if (sw.includes("'/about'")) fail('service worker must not cache /about under the current protected route policy');
if (!sw.includes("new URL('/', self.location.origin)")) fail('service worker must define a same-origin public home cache key');

if (!process.exitCode) console.log(`PASS: PWA source assets are valid in ${root}. This is not a Next.js build or production deployment test.`);
