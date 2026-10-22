#!/usr/bin/env node
/**
 * Comprehensive PWA Production Audit & Test Suite
 * Leimarembi Foundation
 */
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';

const websiteDir = path.resolve(process.cwd().endsWith('website') ? '.' : 'website');
const publicDir = path.join(websiteDir, 'public');
const srcDir = path.join(websiteDir, 'src');
const openNextAssetsDir = path.join(websiteDir, '.open-next', 'assets');

let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`  ✅ [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`  ❌ [FAIL] ${testName}${details ? ` -> ${details}` : ''}`);
    failedTests++;
  }
}

console.log('\n======================================================');
console.log('🏛️  LEIMAREMBI FOUNDATION PWA PRODUCTION AUDIT TEST SUITE');
console.log('======================================================\n');

// ─────────────────────────────────────────────────────────────
// 1. MANIFEST VALIDITY & SCHEMA AUDIT
// ─────────────────────────────────────────────────────────────
console.log('📋 1. Testing Web App Manifest (/public/manifest.webmanifest)...');
const manifestPath = path.join(publicDir, 'manifest.webmanifest');
assert(fs.existsSync(manifestPath), 'manifest.webmanifest exists');

let manifest = null;
try {
  manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  assert(true, 'manifest.webmanifest is valid JSON');
} catch (err) {
  assert(false, 'manifest.webmanifest is valid JSON', err.message);
}

if (manifest) {
  assert(manifest.name === 'Leimarembi Foundation', 'manifest.name is "Leimarembi Foundation"');
  assert(manifest.short_name === 'Leimarembi', 'manifest.short_name is "Leimarembi"');
  assert(manifest.start_url === '/', 'manifest.start_url is "/"');
  assert(manifest.scope === '/', 'manifest.scope is "/"');
  assert(manifest.display === 'standalone', 'manifest.display is "standalone"');
  assert(manifest.theme_color?.toUpperCase() === '#1B2A57', 'manifest.theme_color is #1B2A57');
  assert(manifest.background_color?.toUpperCase() === '#F8FAFC', 'manifest.background_color is #F8FAFC');
  assert(Array.isArray(manifest.icons) && manifest.icons.length >= 3, 'manifest has at least 3 icon entries');

  const has192 = manifest.icons.some(i => i.src === '/icons/icon-192.png' && i.sizes === '192x192' && i.purpose === 'any');
  const has512 = manifest.icons.some(i => i.src === '/icons/icon-512.png' && i.sizes === '512x512' && i.purpose === 'any');
  const hasMaskable = manifest.icons.some(i => i.src === '/icons/icon-maskable-512.png' && i.sizes === '512x512' && i.purpose === 'maskable');
  assert(has192, 'manifest contains 192x192 any-purpose icon');
  assert(has512, 'manifest contains 512x512 any-purpose icon');
  assert(hasMaskable, 'manifest contains 512x512 maskable icon');
}

// ─────────────────────────────────────────────────────────────
// 2. ICON FILES & BINARY INTEGRITY AUDIT
// ─────────────────────────────────────────────────────────────
console.log('\n🖼️  2. Testing Icon Files & Binary Signatures...');
const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

function verifyPng(relPath, expectedW, expectedH) {
  const fullPath = path.join(publicDir, relPath);
  if (!fs.existsSync(fullPath)) {
    assert(false, `${relPath} exists`);
    return;
  }
  const buf = fs.readFileSync(fullPath);
  const isPng = buf.subarray(0, 8).equals(pngSignature);
  assert(isPng, `${relPath} has valid PNG signature`);
  if (isPng && buf.length >= 24) {
    const w = buf.readUInt32BE(16);
    const h = buf.readUInt32BE(20);
    assert(w === expectedW && h === expectedH, `${relPath} dimensions are ${expectedW}x${expectedH} (actual: ${w}x${h})`);
  }
}

verifyPng('icons/icon-192.png', 192, 192);
verifyPng('icons/icon-512.png', 512, 512);
verifyPng('icons/icon-maskable-512.png', 512, 512);
verifyPng('icons/apple-touch-icon.png', 180, 180);

// ─────────────────────────────────────────────────────────────
// 3. OFFLINE FALLBACK PAGE AUDIT
// ─────────────────────────────────────────────────────────────
console.log('\n🔌 3. Testing Offline Fallback Page (/public/offline.html)...');
const offlinePath = path.join(publicDir, 'offline.html');
assert(fs.existsSync(offlinePath), 'offline.html exists');

const offlineHtml = fs.readFileSync(offlinePath, 'utf8');
assert(offlineHtml.includes('<!doctype html>') || offlineHtml.includes('<!DOCTYPE html>'), 'offline.html has HTML5 doctype');
assert(offlineHtml.includes('viewport-fit=cover'), 'offline.html supports viewport-fit=cover');
assert(!offlineHtml.includes('http://') && !offlineHtml.includes('https://cdn.') && !offlineHtml.includes('unpkg.com'), 'offline.html does not depend on external CDN resources');
assert(offlineHtml.includes('Official Digital Governance'), 'offline.html displays official identity branding');
assert(!offlineHtml.includes('currentUser') && !offlineHtml.includes('token') && !offlineHtml.includes('lf_user'), 'offline.html does not expose private session data');

// ─────────────────────────────────────────────────────────────
// 4. SERVICE WORKER CACHE & SECURITY POLICY AUDIT
// ─────────────────────────────────────────────────────────────
console.log('\n🛡️  4. Testing Service Worker Security Policy (/public/sw.js)...');
const swPath = path.join(publicDir, 'sw.js');
assert(fs.existsSync(swPath), 'sw.js exists');

const swContent = fs.readFileSync(swPath, 'utf8');
assert(swContent.includes("url.pathname === '/api' || url.pathname.startsWith('/api/')"), 'sw.js strictly excludes all API routes');
assert(!swContent.includes("'/about'"), 'sw.js does not cache /about under protected route policy');
assert(!swContent.includes("'/management'") && !swContent.includes("'/superadmin'") && !swContent.includes("'/portal'"), 'sw.js never lists private routes in precache');
assert(swContent.includes("new URL('/', self.location.origin)"), 'sw.js defines same-origin public home cache key');
assert(swContent.includes("url.searchParams.has('_rsc')") || swContent.includes("request.headers.has('RSC')"), 'sw.js excludes Next.js RSC requests from interception');
assert(swContent.includes("cc.includes('no-store')"), 'sw.js respects Cache-Control: no-store');
assert(swContent.includes("skipWaiting"), 'sw.js supports safe lifecycle activation');

// ─────────────────────────────────────────────────────────────
// 5. NEXT.JS CONFIG & METADATA AUDIT
// ─────────────────────────────────────────────────────────────
console.log('\n⚙️  5. Testing Next.js Configuration & Root Layout Metadata...');
const nextConfigPath = path.join(websiteDir, 'next.config.ts');
const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');
assert(nextConfigContent.includes('/sw.js') && nextConfigContent.includes('no-cache, no-store, must-revalidate'), 'next.config.ts configures no-store headers for /sw.js');
assert(nextConfigContent.includes('/manifest.webmanifest') && nextConfigContent.includes('application/manifest+json'), 'next.config.ts configures manifest headers');

const layoutPath = path.join(srcDir, 'app', 'layout.tsx');
const layoutContent = fs.readFileSync(layoutPath, 'utf8');
assert(layoutContent.includes('metadataBase: new URL('), 'layout.tsx defines metadataBase to eliminate build warnings');
assert(layoutContent.includes('manifest: "/manifest.webmanifest"'), 'layout.tsx links to /manifest.webmanifest');
assert(layoutContent.includes('appleWebApp: { capable: true'), 'layout.tsx specifies appleWebApp metadata');

// ─────────────────────────────────────────────────────────────
// 6. OPENNEXT CLOUDFLARE ASSET PARITY AUDIT
// ─────────────────────────────────────────────────────────────
console.log('\n☁️  6. Testing OpenNext Cloudflare Asset Parity (.open-next/assets)...');
if (fs.existsSync(openNextAssetsDir)) {
  assert(fs.existsSync(path.join(openNextAssetsDir, 'manifest.webmanifest')), '.open-next/assets contains manifest.webmanifest');
  assert(fs.existsSync(path.join(openNextAssetsDir, 'sw.js')), '.open-next/assets contains sw.js');
  assert(fs.existsSync(path.join(openNextAssetsDir, 'offline.html')), '.open-next/assets contains offline.html');
  assert(fs.existsSync(path.join(openNextAssetsDir, 'icons', 'icon-192.png')), '.open-next/assets contains icons/icon-192.png');
  assert(fs.existsSync(path.join(openNextAssetsDir, 'icons', 'icon-512.png')), '.open-next/assets contains icons/icon-512.png');
  assert(fs.existsSync(path.join(openNextAssetsDir, 'icons', 'icon-maskable-512.png')), '.open-next/assets contains icons/icon-maskable-512.png');
  assert(fs.existsSync(path.join(openNextAssetsDir, 'icons', 'apple-touch-icon.png')), '.open-next/assets contains icons/apple-touch-icon.png');
} else {
  console.log('  ⚠️  .open-next/assets directory not found; run `npm run cf:build` to generate.');
}

// ─────────────────────────────────────────────────────────────
// 7. LIVE HTTP MIDDLEWARE ROUTE GUARD AUDIT (if server is up)
// ─────────────────────────────────────────────────────────────
console.log('\n🌐 7. Testing Live Server Middleware Route Guarding (http://localhost:3000)...');

function checkHttp(urlPath) {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: urlPath,
      method: 'GET'
    }, (res) => {
      resolve({ statusCode: res.statusCode, headers: res.headers });
    });
    req.on('error', (err) => resolve({ error: err }));
    req.end();
  });
}

(async () => {
  const manifestRes = await checkHttp('/manifest.webmanifest');
  if (manifestRes.error) {
    console.log('  ℹ️  Local server not responding on port 3000; skipping live HTTP checks.');
  } else {
    assert(manifestRes.statusCode === 200, 'GET /manifest.webmanifest returns HTTP 200 (not 307 redirect)');

    const offlineRes = await checkHttp('/offline.html');
    assert(offlineRes.statusCode === 200, 'GET /offline.html returns HTTP 200 (not 307 redirect)');

    const iconRes = await checkHttp('/icons/icon-192.png');
    assert(iconRes.statusCode === 200, 'GET /icons/icon-192.png returns HTTP 200');

    const protectedRes = await checkHttp('/management');
    assert(protectedRes.statusCode === 307, 'GET /management unauthenticated returns HTTP 307 redirect');
    assert(protectedRes.headers.location?.includes('/login'), 'GET /management redirects to /login');
  }

  console.log('\n======================================================');
  console.log(`📊 TEST SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED`);
  console.log('======================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
})();
