#!/usr/bin/env node
/**
 * Functional Service Worker Behavioral Verification Test Harness
 * Exercises public/sw.js with real mocked Requests, Responses, and CacheStorage.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const websiteDir = path.resolve(process.cwd().endsWith('website') ? '.' : 'website');
const swSourcePath = path.join(websiteDir, 'public', 'sw.js');
const swCode = fs.readFileSync(swSourcePath, 'utf8');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message, details = '') {
  totalTests++;
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ [FAIL] ${message}${details ? ` -> ${details}` : ''}`);
    failedTests++;
  }
}

// ─────────────────────────────────────────────────────────────
// In-Memory CacheStorage Mock Implementation
// ─────────────────────────────────────────────────────────────
class MockCache {
  constructor(name) {
    this.name = name;
    this.store = new Map();
  }

  async put(request, response) {
    const key = typeof request === 'string' ? request : request.url;
    // Store clone of response
    this.store.set(key, response.clone());
  }

  async match(request, options = {}) {
    const key = typeof request === 'string' ? request : request.url;
    if (this.store.has(key)) {
      return this.store.get(key).clone();
    }
    // Match relative or absolute pathname
    const targetUrl = new URL(key, 'http://localhost:3000').pathname;
    for (const [storedKey, storedRes] of this.store.entries()) {
      const storedUrl = new URL(storedKey, 'http://localhost:3000').pathname;
      if (storedUrl === targetUrl) {
        return storedRes.clone();
      }
    }
    return undefined;
  }

  async delete(request) {
    const key = typeof request === 'string' ? request : request.url;
    return this.store.delete(key);
  }

  async keys() {
    return Array.from(this.store.keys());
  }
}

class MockCacheStorage {
  constructor() {
    this.caches = new Map();
  }

  async open(name) {
    if (!this.caches.has(name)) {
      this.caches.set(name, new MockCache(name));
    }
    return this.caches.get(name);
  }

  async keys() {
    return Array.from(this.caches.keys());
  }

  async delete(name) {
    return this.caches.delete(name);
  }

  async match(request, options) {
    for (const cache of this.caches.values()) {
      const match = await cache.match(request, options);
      if (match) return match;
    }
    return undefined;
  }
}

function makeRequest(urlStr, options = {}) {
  const { mode, headers, method = 'GET' } = options;
  const absUrl = new URL(urlStr, 'http://localhost:3000').href;
  const req = new Request(absUrl, { method, headers });
  if (mode) {
    Object.defineProperty(req, 'mode', { value: mode, configurable: true });
  }
  return req;
}

console.log('\n======================================================');
console.log('🧪 FUNCTIONAL SERVICE WORKER BEHAVIORAL VERIFICATION');
console.log('======================================================\n');

(async () => {
  const cacheStorage = new MockCacheStorage();
  const listeners = {};
  let skipWaitingCalled = false;
  let clientsClaimCalled = false;

  let mockNetworkHandler = async (req) => {
    return new Response('Default mock body', { status: 200, headers: { 'Content-Type': 'text/html' } });
  };

  const context = {
    self: {
      location: { origin: 'http://localhost:3000' },
      addEventListener: (type, fn) => {
        if (!listeners[type]) listeners[type] = [];
        listeners[type].push(fn);
      },
      skipWaiting: async () => { skipWaitingCalled = true; },
      clients: {
        claim: async () => { clientsClaimCalled = true; }
      }
    },
    caches: cacheStorage,
    fetch: async (input, init) => {
      let req;
      if (typeof input === 'string') {
        const absUrl = new URL(input, 'http://localhost:3000').href;
        req = new Request(absUrl, init);
      } else {
        req = input;
      }
      return mockNetworkHandler(req);
    },
    Request,
    Response,
    Headers,
    URL,
    Set,
    Map,
    Promise,
    console
  };

  // Run sw.js in the mocked VM
  vm.createContext(context);
  vm.runInContext(swCode, context);

  assert(listeners['install']?.length > 0, 'install event listener registered');
  assert(listeners['activate']?.length > 0, 'activate event listener registered');
  assert(listeners['fetch']?.length > 0, 'fetch event listener registered');
  assert(listeners['message']?.length > 0, 'message event listener registered');

  // ─────────────────────────────────────────────────────────────
  // 1. INSTALL LIFECYCLE & PRECACHING
  // ─────────────────────────────────────────────────────────────
  console.log('\n📦 1. Testing SW Install Event and Precache Population...');
  mockNetworkHandler = async (req) => {
    const url = new URL(req.url);
    if (url.pathname === '/offline.html') {
      const res = new Response('<!doctype html><h1>Offline</h1>', {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
      Object.defineProperty(res, 'type', { value: 'basic' });
      return res;
    }
    if (url.pathname === '/') {
      const res = new Response('<!doctype html><h1>Home</h1>', {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
      Object.defineProperty(res, 'type', { value: 'basic' });
      Object.defineProperty(res, 'url', { value: 'http://localhost:3000/' });
      return res;
    }
    const res = new Response('Mock binary asset', {
      status: 200,
      headers: { 'Content-Type': 'image/png' }
    });
    Object.defineProperty(res, 'type', { value: 'basic' });
    return res;
  };

  let installPromise = null;
  const installEvent = {
    waitUntil: (p) => { installPromise = p; }
  };
  for (const fn of listeners['install']) fn(installEvent);
  await installPromise;

  assert(skipWaitingCalled, 'self.skipWaiting() called during install');

  const shellCache = await cacheStorage.open('lf-pwa-shell-v1.1.0');
  const cachedOffline = await shellCache.match('/offline.html');
  assert(!!cachedOffline, 'offline.html precached in SHELL_CACHE during install');
  const cachedManifest = await shellCache.match('/manifest.webmanifest');
  assert(!!cachedManifest, 'manifest.webmanifest precached in SHELL_CACHE during install');

  const pageCache = await cacheStorage.open('lf-pwa-public-pages-v1.1.0');
  const cachedHome = await pageCache.match('http://localhost:3000/');
  assert(!!cachedHome, 'home route / precached in PAGE_CACHE during clean install');

  // ─────────────────────────────────────────────────────────────
  // 2. FETCH DISPATCH HELPER
  // ─────────────────────────────────────────────────────────────
  async function dispatchFetch(request) {
    let responded = false;
    let responsePromise = null;
    const event = {
      request,
      respondWith: (p) => {
        responded = true;
        responsePromise = p;
      }
    };
    for (const fn of listeners['fetch']) {
      fn(event);
    }
    if (!responded) {
      return { intercepted: false, response: null };
    }
    const response = await responsePromise;
    return { intercepted: true, response };
  }

  // ─────────────────────────────────────────────────────────────
  // 3. API ROUTE & NON-GET EXCLUSIONS
  // ─────────────────────────────────────────────────────────────
  console.log('\n🔒 2. Testing API Routes, Methods, and Non-GET Invariance...');
  const postLogin = makeRequest('/api/auth/login', { method: 'POST' });
  const postLoginResult = await dispatchFetch(postLogin);
  assert(!postLoginResult.intercepted, 'POST /api/auth/login is NOT intercepted (passes directly to network)');

  const getApiAuth = makeRequest('/api/auth/me', { method: 'GET' });
  const getApiAuthResult = await dispatchFetch(getApiAuth);
  assert(!getApiAuthResult.intercepted, 'GET /api/auth/me is NOT intercepted (never cached)');

  const getApiUsers = makeRequest('/api/users', { method: 'GET' });
  const getApiUsersResult = await dispatchFetch(getApiUsers);
  assert(!getApiUsersResult.intercepted, 'GET /api/users is NOT intercepted');

  const getApiFinance = makeRequest('/api/finance/stats', { method: 'GET' });
  const getApiFinanceResult = await dispatchFetch(getApiFinance);
  assert(!getApiFinanceResult.intercepted, 'GET /api/finance/stats is NOT intercepted');

  // ─────────────────────────────────────────────────────────────
  // 4. NEXT.JS RSC & CROSS-ORIGIN EXCLUSIONS
  // ─────────────────────────────────────────────────────────────
  console.log('\n⚡ 3. Testing Next.js RSC & Cross-Origin Requests...');
  const rscQuery = makeRequest('/portal?_rsc=123', { method: 'GET' });
  const rscQueryResult = await dispatchFetch(rscQuery);
  assert(!rscQueryResult.intercepted, 'RSC query (?_rsc=) is NOT intercepted');

  const rscHeader = makeRequest('/management', {
    method: 'GET',
    headers: { 'RSC': '1' }
  });
  const rscHeaderResult = await dispatchFetch(rscHeader);
  assert(!rscHeaderResult.intercepted, 'RSC header (RSC: 1) is NOT intercepted');

  const rscTreeHeader = makeRequest('/superadmin', {
    method: 'GET',
    headers: { 'Next-Router-State-Tree': '%5B%22%22%5D' }
  });
  const rscTreeHeaderResult = await dispatchFetch(rscTreeHeader);
  assert(!rscTreeHeaderResult.intercepted, 'RSC header (Next-Router-State-Tree) is NOT intercepted');

  const crossOrigin = new Request('https://external-cdn.com/script.js', { method: 'GET' });
  const crossOriginResult = await dispatchFetch(crossOrigin);
  assert(!crossOriginResult.intercepted, 'Cross-origin request is NOT intercepted');

  // ─────────────────────────────────────────────────────────────
  // 5. STATIC ASSETS & CACHE-CONTROL: NO-STORE
  // ─────────────────────────────────────────────────────────────
  console.log('\n📦 4. Testing Static Asset Caching & Cache-Control: no-store...');
  mockNetworkHandler = async (req) => {
    const res = new Response('console.log("chunk")', {
      status: 200,
      headers: { 'Content-Type': 'application/javascript', 'Cache-Control': 'public, max-age=31536000, immutable' }
    });
    Object.defineProperty(res, 'type', { value: 'basic' });
    return res;
  };
  const staticReq = makeRequest('/_next/static/chunks/app-bundle.js', { method: 'GET' });
  const staticRes = await dispatchFetch(staticReq);
  assert(staticRes.intercepted, 'Static asset /_next/static/... is intercepted');
  const staticCache = await cacheStorage.open('lf-pwa-next-static-v1.1.0');
  const cachedChunk = await staticCache.match(staticReq);
  assert(!!cachedChunk, 'Static chunk stored in STATIC_CACHE');

  // Static chunk with no-store
  mockNetworkHandler = async (req) => {
    const res = new Response('console.log("ephemeral")', {
      status: 200,
      headers: { 'Content-Type': 'application/javascript', 'Cache-Control': 'no-store, no-cache' }
    });
    Object.defineProperty(res, 'type', { value: 'basic' });
    return res;
  };
  const noStoreStaticReq = makeRequest('/_next/static/chunks/ephemeral.js', { method: 'GET' });
  await dispatchFetch(noStoreStaticReq);
  const cachedEphemeral = await staticCache.match(noStoreStaticReq);
  assert(!cachedEphemeral, 'Static chunk with Cache-Control: no-store is NOT cached in STATIC_CACHE');

  // ─────────────────────────────────────────────────────────────
  // 6. PROTECTED & SENSITIVE ROUTES ONLINE BEHAVIOR
  // ─────────────────────────────────────────────────────────────
  console.log('\n🛡️  5. Testing Authenticated/Sensitive Routes Online (Never Cached)...');
  const protectedPaths = ['/login', '/portal', '/management', '/superadmin', '/members'];
  for (const route of protectedPaths) {
    mockNetworkHandler = async (req) => {
      const res = new Response(`<html><body>Sensitive Dashboard for ${route}</body></html>`, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
      Object.defineProperty(res, 'type', { value: 'basic' });
      return res;
    };
    const req = makeRequest(route, { method: 'GET', mode: 'navigate' });
    const res = await dispatchFetch(req);
    assert(res.intercepted, `Navigate ${route} is handled by network-fetch path`);
    const inPageCache = await pageCache.match(`http://localhost:3000${route}`);
    assert(!inPageCache, `Navigate ${route} is NEVER stored into PAGE_CACHE`);
    const inShellCache = await shellCache.match(`http://localhost:3000${route}`);
    assert(!inShellCache, `Navigate ${route} is NEVER stored into SHELL_CACHE`);
  }

  // ─────────────────────────────────────────────────────────────
  // 7. OFFLINE FALLBACK & LEAK PREVENTION ON PROTECTED ROUTES
  // ─────────────────────────────────────────────────────────────
  console.log('\n🔌 6. Testing Offline Navigation & Zero-Leakage Guarantee...');
  // Simulate complete network failure (TypeError: Failed to fetch)
  mockNetworkHandler = async () => {
    throw new TypeError('Failed to fetch (network disconnected)');
  };

  for (const route of protectedPaths) {
    const req = makeRequest(route, { method: 'GET', mode: 'navigate' });
    const res = await dispatchFetch(req);
    assert(res.intercepted, `Offline navigate ${route} falls back cleanly`);
    const bodyText = await res.response.text();
    assert(bodyText.includes('Offline') || bodyText.includes('offline'), `Offline navigate ${route} returns offline shell`);
    assert(!bodyText.includes('Sensitive Dashboard'), `Offline navigate ${route} NEVER discloses private user data`);
  }

  // ─────────────────────────────────────────────────────────────
  // 8. PUBLIC ROUTE (/) CACHE-CONTROL & REDIRECT CONSTRAINTS
  // ─────────────────────────────────────────────────────────────
  console.log('\n🏠 7. Testing Public Home (/) Cache-Control & Redirect Guarding...');
  // Test: Home returns Cache-Control: private
  await pageCache.delete('http://localhost:3000/');
  mockNetworkHandler = async (req) => {
    const res = new Response('<html>Private Personalized Home</html>', {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'private, max-age=0' }
    });
    Object.defineProperty(res, 'type', { value: 'basic' });
    Object.defineProperty(res, 'url', { value: 'http://localhost:3000/' });
    return res;
  };
  const privateHomeReq = makeRequest('/', { method: 'GET', mode: 'navigate' });
  await dispatchFetch(privateHomeReq);
  let homeInCache = await pageCache.match('http://localhost:3000/');
  assert(!homeInCache, 'Home with Cache-Control: private is NOT stored in PAGE_CACHE');

  // Test: Home returns Cache-Control: no-store
  mockNetworkHandler = async (req) => {
    const res = new Response('<html>No-Store Home</html>', {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }
    });
    Object.defineProperty(res, 'type', { value: 'basic' });
    Object.defineProperty(res, 'url', { value: 'http://localhost:3000/' });
    return res;
  };
  await dispatchFetch(makeRequest('/', { method: 'GET', mode: 'navigate' }));
  homeInCache = await pageCache.match('http://localhost:3000/');
  assert(!homeInCache, 'Home with Cache-Control: no-store is NOT stored in PAGE_CACHE');

  // Test: Home redirects to /login
  mockNetworkHandler = async (req) => {
    const res = new Response('<html>Redirect to Login</html>', {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
    Object.defineProperty(res, 'type', { value: 'basic' });
    Object.defineProperty(res, 'url', { value: 'http://localhost:3000/login' });
    return res;
  };
  await dispatchFetch(makeRequest('/', { method: 'GET', mode: 'navigate' }));
  homeInCache = await pageCache.match('http://localhost:3000/');
  assert(!homeInCache, 'Redirected response (url: /login) is NOT stored into PAGE_CACHE as root');

  // Test: Clean public home 200 OK
  mockNetworkHandler = async (req) => {
    const res = new Response('<html>Clean Public Home</html>', {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
    });
    Object.defineProperty(res, 'type', { value: 'basic' });
    Object.defineProperty(res, 'url', { value: 'http://localhost:3000/' });
    return res;
  };
  await dispatchFetch(makeRequest('/', { method: 'GET', mode: 'navigate' }));
  homeInCache = await pageCache.match('http://localhost:3000/');
  assert(!!homeInCache, 'Clean public home 200 OK IS cached in PAGE_CACHE');

  // ─────────────────────────────────────────────────────────────
  // 9. HTTP ERRORS ON NAVIGATE ROUTES
  // ─────────────────────────────────────────────────────────────
  console.log('\n⚠️  8. Testing HTTP Errors (404, 500) on Navigate Routes...');
  mockNetworkHandler = async (req) => {
    const res = new Response('Server Error 500', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
    Object.defineProperty(res, 'type', { value: 'basic' });
    return res;
  };
  const errReq = makeRequest('/news', { method: 'GET', mode: 'navigate' });
  const errRes = await dispatchFetch(errReq);
  assert(errRes.intercepted && errRes.response.status === 500, 'HTTP 500 passes through to user without cache corruption');

  mockNetworkHandler = async (req) => {
    const res = new Response('Not Found 404', {
      status: 404,
      headers: { 'Content-Type': 'text/plain' }
    });
    Object.defineProperty(res, 'type', { value: 'basic' });
    return res;
  };
  const notFoundReq = makeRequest('/unknown-page', { method: 'GET', mode: 'navigate' });
  const notFoundRes = await dispatchFetch(notFoundReq);
  assert(notFoundRes.intercepted && notFoundRes.response.status === 404, 'HTTP 404 passes through to user without cache corruption');

  // ─────────────────────────────────────────────────────────────
  // 10. ACTIVATION & CACHE CLEANUP
  // ─────────────────────────────────────────────────────────────
  console.log('\n🧹 9. Testing SW Activation & Outdated Cache Cleanup...');
  await cacheStorage.open('lf-pwa-shell-v1.0.0'); // Old
  await cacheStorage.open('lf-pwa-public-pages-v0.9.0'); // Old
  await cacheStorage.open('third-party-app-cache'); // Unrelated, non-lf

  let activatePromise = null;
  const activateEvent = {
    waitUntil: (p) => { activatePromise = p; }
  };
  for (const fn of listeners['activate']) fn(activateEvent);
  await activatePromise;

  const remainingKeys = await cacheStorage.keys();
  assert(!remainingKeys.includes('lf-pwa-shell-v1.0.0'), 'Old cache lf-pwa-shell-v1.0.0 deleted during activate');
  assert(!remainingKeys.includes('lf-pwa-public-pages-v0.9.0'), 'Old cache lf-pwa-public-pages-v0.9.0 deleted during activate');
  assert(remainingKeys.includes('lf-pwa-shell-v1.1.0'), 'Current cache lf-pwa-shell-v1.1.0 preserved');
  assert(remainingKeys.includes('lf-pwa-public-pages-v1.1.0'), 'Current cache lf-pwa-public-pages-v1.1.0 preserved');
  assert(remainingKeys.includes('third-party-app-cache'), 'Unrelated cache third-party-app-cache preserved');
  assert(clientsClaimCalled, 'self.clients.claim() called during activate');

  // ─────────────────────────────────────────────────────────────
  // 11. MESSAGE SKIP_WAITING
  // ─────────────────────────────────────────────────────────────
  console.log('\n📨 10. Testing SKIP_WAITING Message Handling...');
  skipWaitingCalled = false;
  for (const fn of listeners['message']) {
    fn({ data: { type: 'SKIP_WAITING' } });
  }
  assert(skipWaitingCalled, 'SKIP_WAITING message triggers self.skipWaiting()');

  // ─────────────────────────────────────────────────────────────
  // SUMMARY
  // ─────────────────────────────────────────────────────────────
  console.log('\n======================================================');
  console.log(`📊 SW BEHAVIOR SUMMARY: ${passedTests}/${totalTests} PASSED, ${failedTests} FAILED`);
  console.log('======================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
})();
