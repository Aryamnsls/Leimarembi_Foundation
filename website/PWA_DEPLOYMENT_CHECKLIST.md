# LEIMAREMBI FOUNDATION — PWA DEPLOYMENT & GO-LIVE CHECKLIST

**Target Domain:** `https://leimarembifoundation.org`
**Hosting Target:** Cloudflare Pages / Workers (via OpenNext Cloudflare)
**Security Requirement:** Full SSL/TLS (HTTPS) strictly enforced
**Version:** 1.1.0 (Release Candidate)

---

## 1. Pre-Deployment Configuration Verification

- [x] **Canonical Production URL Configured:**
  - `website/src/app/layout.tsx` metadataBase set to `https://leimarembifoundation.org`.
  - OpenGraph and Twitter images resolve to canonical HTTPS endpoints.
- [x] **Cloudflare OpenNext Build Verified:**
  - `npm run cf:build` executed and generated `.open-next/worker.js` and `.open-next/assets/`.
  - `wrangler.toml` targets `pages_build_output_dir = ".open-next/assets"`.
  - `compatibility_flags = ["nodejs_compat"]` enabled.
- [x] **Static Asset Integrity:**
  - `manifest.webmanifest` present in both `public/` and `.open-next/assets/`.
  - `offline.html` present in both `public/` and `.open-next/assets/`.
  - `sw.js` present in both `public/` and `.open-next/assets/`.
  - All icons (192, 512, maskable 512, apple 180) verified with exact pixel dimensions.
- [x] **Middleware Unauthenticated Access Allowed:**
  - Unauthenticated access to `/manifest.webmanifest`, `/offline.html`, `/sw.js`, and `/icons/*` passes through without 307 redirect to login.
  - Protected routes (`/management`, `/superadmin`, `/portal`) strictly enforce login redirect.

---

## 2. Staging & Production Deployment Process

1. **Verify Git Branch:**
   ```bash
   git branch --show-current
   # Expected: feat/pwa-android-ios
   ```
2. **Execute Complete Automated Verification Suite:**
   ```bash
   cd website
   npm run test:pwa
   # Must return: 114 PASSED, 0 FAILED (52 PWA spec + 62 SW behavioral)
   npm run test:responsive
   # Must return: 99 PASSED, 0 FAILED (13 viewports + safe areas + dark mode)
   node scripts/test-app-e2e.mjs
   # Must return: 107 PASSED, 0 FAILED (Full application & RBAC integration)
   npx tsc --noEmit
   # Must return 0 errors
   ```
3. **Build OpenNext Cloudflare Bundle:**
   ```bash
   cd website
   npm run cf:build
   ```
4. **Local Workerd Emulation Preview (NOT Remote Staging):**
   ```bash
   npm run cf:preview
   # NOTE: This runs local Cloudflare workerd emulation on localhost for runtime testing.
   # It does NOT deploy to the internet and does NOT prove live SSL, CDN, or production headers.
   ```
5. **Deploy Staging / Production via OpenNext Cloudflare:**
   ```bash
   npm run cf:deploy
   # IMPORTANT: Always use opennextjs-cloudflare deploy (npm run cf:deploy).
   # DO NOT deploy only .open-next/assets! Deploying only assets will miss the Cloudflare
   # Worker needed for server-side route handling, middleware, and dynamic rendering.
   ```
6. **Security & Credential Rotation:**
   - [ ] Rotate all development test passwords and passcodes in the production database prior to public user onboarding.
   - [ ] Verify production environment secrets (`JWT_SECRET`, database connection URI) in Cloudflare dashboard / secrets manager.

---

## 3. Post-Deployment Smoke Tests (Live HTTPS)

Run these checks immediately following live deployment:

### 3.1 Network & Header Validation
- [ ] `curl -I https://leimarembifoundation.org/manifest.webmanifest`
  - Status must be `200 OK`.
  - `Content-Type` must be `application/manifest+json; charset=utf-8`.
  - Must not redirect to login.
- [ ] `curl -I https://leimarembifoundation.org/sw.js`
  - Status must be `200 OK`.
  - `Cache-Control` must include `no-cache, no-store, must-revalidate`.
  - `Service-Worker-Allowed` must be `/`.
- [ ] `curl -I https://leimarembifoundation.org/offline.html`
  - Status must be `200 OK`.
  - `Cache-Control` must include `no-cache, must-revalidate`.
- [ ] `curl -I https://leimarembifoundation.org/management`
  - Unauthenticated request must return `307 Temporary Redirect` to `/login?tab=login&redirect=%2Fmanagement`.

### 3.2 Real Device Testing
- [ ] **Android Device (Chrome):**
  - Visit `https://leimarembifoundation.org`.
  - Verify the floating **Install app** pill appears at the bottom-left.
  - Tap **Install app** → browser shows native install confirmation dialog.
  - Verify app installs to home screen with high-resolution foundation seal icon.
  - Launch from home screen → opens in full standalone window (no browser address bar).
- [ ] **iOS Device (Safari 16.4+):**
  - Visit `https://leimarembifoundation.org`.
  - Tap **Install app** → guide modal opens with clear iOS Share Sheet instructions.
  - Tap Share (⎋) → **Add to Home Screen** → verify 180×180 gold/navy icon and "Leimarembi" title.
  - Launch from home screen → opens in standalone mode without Safari chrome.
- [ ] **Desktop Browser (Chrome / Edge):**
  - Verify install icon appears in address bar.
  - Test dismissal: click the "X" button on the floating pill → pill disappears and stays hidden on page refresh for 14 days.
- [ ] **Offline Resilience Test:**
  - In DevTools (or airplane mode on device), switch Network to **Offline**.
  - Navigate to `/` → home page serves cleanly from service worker cache.
  - Navigate to `/management` or `/login` → safely displays `/offline.html` fallback with "You're currently offline" message.
  - No private data or authenticated documents are leaked.

---

## 4. Rollback Plan

If an urgent rollback is required:
1. Re-deploy the previous Cloudflare deployment via Cloudflare Dashboard → Workers & Pages → Deployments → **Rollback to this deployment**.
2. If service worker cache needs immediate purging across all user devices, bump `VERSION = 'v1.2.0'` in `website/public/sw.js`. The activation step automatically deletes all previous `lf-pwa-*` cache stores.
