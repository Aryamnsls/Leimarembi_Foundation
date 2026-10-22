# Leimarembi Foundation — Android & iOS PWA upgrade

This patch layers installable Progressive Web App support onto the existing Next.js site without replacing its current features or introducing React Native. It includes a web manifest, brand-matched PNG icons (192 px, 512 px, maskable 512 px and Apple 180 px), Apple standalone metadata, a responsive install/help prompt, conservative service-worker caching, an offline page, an Apache MIME/cache configuration add-on, a smoke test, and deployment guidance.

## Apply safely

1. From your local repository root, create a feature branch: `git switch -c feat/pwa-android-ios`.
2. Extract this ZIP into the repository root, allowing files under `website/` to merge. Do not extract it elsewhere.
3. Run `bash apply-pwa.sh` from the repository root. The script validates expected files, makes timestamped backups of the layout, existing Next.js app icon, and public `.htaccess` under `.git/pwa-backups/`, then patches those files idempotently and replaces the legacy non-square app icon with the square 512 px PWA icon.
4. Run the asset smoke test from the repo root: `node website/scripts/pwa-smoke-test.mjs website/public`.
5. Resolve the existing deployment configuration conflict before release (see below), then run the correct build pipeline and test the generated output.

The patch does **not** choose or silently change your production hosting model, remove middleware, claim all pages work offline, or enable fake push subscriptions.

## Install on Android

Serve the site over HTTPS and open it in Chrome. Use the in-page **Install app** button when Chrome offers the native prompt. If the native prompt is not available yet, use Chrome's three-dot menu → **Install app** or **Add to Home screen**.

## Install on iPhone / iPad

Open the HTTPS website in Safari → **Share** → **Add to Home Screen** → **Add**. iOS installs this as a web app shortcut; this workflow does not create an APK or IPA.

## Offline and security scope

- The public `/` homepage may be cached for an offline fallback.
- Next.js hashed assets in `/_next/static/`, the manifest, offline page and PWA icon files use conservative cache rules.
- `/about` is not cached because the current `website/src/middleware.ts` does not declare it public. Other account/member/management routes are never cached as HTML.
- `/api` and `/api/*` requests are intentionally excluded from service-worker caching.
- Offline access to authenticated user records, member lists, documents, meetings, donations or management functions is not provided.
- Service workers require HTTPS in production; `localhost` is allowed during development.

## Existing release blocker: deployment configuration

The repository currently sets `output: 'export'` in `website/next.config.ts` while also keeping `website/src/middleware.ts`, `website/open-next.config.ts`, and `website/wrangler.toml` for Cloudflare OpenNext. Static export and request-time middleware are different deployment models. The PWA patch does not make them interchangeable.

Choose and verify one production path before release:

- **Cloudflare OpenNext:** use the OpenNext-supported server deployment pipeline for middleware/RBAC; review the `output: 'export'` setting with the deployment owner before changing it.
- **Static Hostinger/Apache export:** do not rely on Next.js middleware for authorization. Sensitive data must be protected by the actual server/backend; client-only route guards are not a substitute for authorization.

Do not remove middleware just to make a build pass without reviewing access control. Also note that the current `website/` listing does not show its own `package-lock.json`, so `npm ci` will fail there until a matching lockfile is committed; confirm the intended package manager/lockfile before validating the build.

## Smoke test after deployment

Check these URLs on the production host:

- `/manifest.webmanifest` returns valid JSON with the correct `application/manifest+json` MIME type.
- `/sw.js` returns JavaScript, not the site HTML fallback.
- `/offline.html` loads as a standalone page.
- `/icons/icon-192.png`, `/icons/icon-512.png`, `/icons/icon-maskable-512.png`, and `/icons/apple-touch-icon.png` return PNGs with the expected dimensions.
- Chrome DevTools → Application shows the manifest and service worker without errors.
- Test offline in DevTools → Network → Offline. The public homepage may load from cache; protected routes must show the safe offline page/unavailable response, never private cached HTML.

Lighthouse installability and mobile accessibility checks should be run against the deployed build. A source-asset smoke test is not a production build or security sign-off.
