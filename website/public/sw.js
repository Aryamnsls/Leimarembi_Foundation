/* Leimarembi Foundation PWA service worker.
 * Deliberately conservative: public home only; never persist API or authenticated data.
 */
'use strict';

const VERSION = 'v1.1.0';
const SHELL_CACHE = `lf-pwa-shell-${VERSION}`;
const PAGE_CACHE = `lf-pwa-public-pages-${VERSION}`;
const STATIC_CACHE = `lf-pwa-next-static-${VERSION}`;
const SHELL_URLS = [
  '/offline.html',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-512.png',
  '/icons/apple-touch-icon.png'
];
const PUBLIC_DOCUMENT_PATHS = new Set(['/']);

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const shell = await caches.open(SHELL_CACHE);
    // Precache shell assets resiliently so a transient failure on one optional asset
    // does not prevent the service worker from completing installation.
    await Promise.all(
      SHELL_URLS.map(async (url) => {
        try {
          const res = await fetch(url, { cache: 'reload' });
          if (res.ok && (res.type === 'basic' || res.type === 'default')) {
            await shell.put(url, res);
          }
        } catch (err) {
          console.warn('[SW] Non-critical precache failure for:', url, err);
        }
      })
    );

    // The root landing page is explicitly public in the current route policy.
    // Cache it only after a clean same-origin 200 response (never a redirect/login page).
    try {
      const homeUrl = new URL('/', self.location.origin);
      const response = await fetch(homeUrl.href, { credentials: 'same-origin', cache: 'no-cache' });
      const finalUrl = new URL(response.url || homeUrl.href, self.location.origin);
      const cc = response.headers.get('cache-control') || '';
      if (
        response.ok &&
        response.type === 'basic' &&
        finalUrl.origin === self.location.origin &&
        finalUrl.pathname === '/' &&
        !cc.includes('no-store') &&
        !cc.includes('private')
      ) {
        const pages = await caches.open(PAGE_CACHE);
        await pages.put(homeUrl.href, response.clone());
      }
    } catch {
      // First install can occur offline; the offline shell is enough to install safely.
    }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keep = new Set([SHELL_CACHE, PAGE_CACHE, STATIC_CACHE]);
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith('lf-pwa-') && !keep.has(key)).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

// Support manual upgrade / activation message from client prompt
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || (request.mode === 'navigate' && request.redirect === 'error')) return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Do not read, intercept for caching, or store API/backend responses.
  if (url.pathname === '/api' || url.pathname.startsWith('/api/')) return;

  // Never intercept or cache robots.txt, sitemap.xml, or crawler manifests
  if (url.pathname === '/robots.txt' || url.pathname === '/sitemap.xml' || url.pathname.endsWith('.xml')) {
    return;
  }

  // Never intercept or cache Next.js RSC data, action, or internal streaming requests
  if (url.searchParams.has('_rsc') || request.headers.has('RSC') || request.headers.has('Next-Router-State-Tree')) {
    return;
  }

  // Next.js content-hashed static assets are immutable build artefacts.
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith((async () => {
      const cache = await caches.open(STATIC_CACHE);
      const cached = await cache.match(request);
      if (cached) return cached;
      const response = await fetch(request);
      if (response.ok && response.type === 'basic') {
        const cc = response.headers.get('cache-control') || '';
        if (!cc.includes('no-store') && !cc.includes('no-cache')) {
          await cache.put(request, response.clone());
        }
      }
      return response;
    })());
    return;
  }

  // Cache only known, non-sensitive PWA shell files.
  if (SHELL_URLS.includes(url.pathname)) {
    event.respondWith((async () => {
      const cache = await caches.open(SHELL_CACHE);
      const cached = await cache.match(request, { ignoreSearch: true });
      if (cached) return cached;
      const response = await fetch(request);
      if (response.ok && response.type === 'basic') {
        await cache.put(request, response.clone());
      }
      return response;
    })());
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      // Network-first for the one explicitly public HTML route.
      if (PUBLIC_DOCUMENT_PATHS.has(url.pathname)) {
        try {
          const response = await fetch(request);
          const finalUrl = new URL(response.url || request.url, self.location.origin);
          const cc = response.headers.get('cache-control') || '';
          if (
            url.search === '' &&
            response.ok &&
            response.type === 'basic' &&
            finalUrl.origin === self.location.origin &&
            finalUrl.pathname === '/' &&
            !cc.includes('no-store') &&
            !cc.includes('private')
          ) {
            const cache = await caches.open(PAGE_CACHE);
            await cache.put(new URL('/', self.location.origin).href, response.clone());
          }
          return response;
        } catch {
          const pages = await caches.open(PAGE_CACHE);
          return (await pages.match(new URL('/', self.location.origin).href)) || (await caches.match('/offline.html'));
        }
      }

      // Protected, account, document, and other routes never use cached HTML.
      try {
        return await fetch(request);
      } catch {
        return (await caches.match('/offline.html')) || new Response('You are offline. Please reconnect and try again.', {
          status: 503,
          headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' }
        });
      }
    })());
  }
});
