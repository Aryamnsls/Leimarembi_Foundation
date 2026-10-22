#!/usr/bin/env node
/**
 * Automated Verification Suite for Leimarembi Foundation Technical SEO,
 * Structured Data, Canonical Strategy, Sitemaps, Robots, and Security Boundaries.
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const websiteDir = path.resolve(__dirname, '..');

let passedTests = 0;
let failedTests = 0;

function assert(condition, message, details = '') {
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ [FAIL] ${message}${details ? ` -> ${details}` : ''}`);
    failedTests++;
  }
}

function request(urlStr, options = {}) {
  return new Promise((resolve) => {
    const url = new URL(urlStr);
    const req = http.request({
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: options.headers || {},
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });
    req.on('error', (err) => resolve({ error: err }));
    req.end();
  });
}

console.log('\n======================================================');
console.log('🔍 LEIMAREMBI FOUNDATION TECHNICAL SEO & SCHEMA TEST SUITE');
console.log('======================================================\n');

(async () => {
  const CANONICAL_ORIGIN = 'https://leimarembifoundation.org';

  // ─────────────────────────────────────────────────────────────
  // 1. ROBOTS.TXT VERIFICATION
  // ─────────────────────────────────────────────────────────────
  console.log('🤖 1. Testing /robots.txt Endpoint & Crawler Policies...');
  const robotsRes = await request('http://localhost:3000/robots.txt');
  assert(robotsRes.statusCode === 200, 'Route /robots.txt returns HTTP 200 OK');
  assert(robotsRes.headers['content-type']?.includes('text/plain'), '/robots.txt served as text/plain');
  assert(robotsRes.body.includes(`Sitemap: ${CANONICAL_ORIGIN}/sitemap.xml`), '/robots.txt specifies canonical sitemap URL');
  assert(robotsRes.body.includes('Disallow: /management/'), '/robots.txt disallows /management/');
  assert(robotsRes.body.includes('Disallow: /superadmin/'), '/robots.txt disallows /superadmin/');
  assert(robotsRes.body.includes('Disallow: /portal/'), '/robots.txt disallows /portal/');
  assert(robotsRes.body.includes('Disallow: /meetings/'), '/robots.txt disallows /meetings/');
  assert(robotsRes.body.includes('Disallow: /documents/'), '/robots.txt disallows /documents/');
  assert(robotsRes.body.includes('Disallow: /api/'), '/robots.txt disallows /api/');
  assert(robotsRes.body.includes('User-Agent: GPTBot'), '/robots.txt contains policy for AI crawler GPTBot');
  assert(robotsRes.body.includes('User-Agent: ClaudeBot'), '/robots.txt contains policy for AI crawler ClaudeBot');
  assert(robotsRes.body.includes('User-Agent: PerplexityBot'), '/robots.txt contains policy for AI crawler PerplexityBot');

  // ─────────────────────────────────────────────────────────────
  // 2. SITEMAP.XML VERIFICATION
  // ─────────────────────────────────────────────────────────────
  console.log('\n🗺️  2. Testing /sitemap.xml XML Structure & Route Indexing...');
  const sitemapRes = await request('http://localhost:3000/sitemap.xml');
  assert(sitemapRes.statusCode === 200, 'Route /sitemap.xml returns HTTP 200 OK');
  assert(
    sitemapRes.headers['content-type']?.includes('xml'),
    'Content-Type is XML compliant'
  );
  assert(sitemapRes.body.includes('<urlset'), 'Sitemap body contains standard <urlset> root');
  assert(sitemapRes.body.includes('http://www.sitemaps.org/schemas/sitemap/0.9'), 'Sitemap conforms to standard sitemaps.org schema');

  // Extract all <loc> entries
  const locMatches = [...sitemapRes.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  assert(locMatches.length >= 10, `Sitemap contains at least 10 public URLs (found: ${locMatches.length})`);

  // Ensure all URLs start with CANONICAL_ORIGIN
  const allCanonical = locMatches.every(url => url.startsWith(CANONICAL_ORIGIN));
  assert(allCanonical, 'All sitemap URLs start with verified production origin https://leimarembifoundation.org');

  // Ensure no duplicate URLs
  const uniqueUrls = new Set(locMatches);
  assert(uniqueUrls.size === locMatches.length, 'Sitemap contains zero duplicate URLs');

  // Ensure strictly private routes are NOT in sitemap
  const forbiddenPatterns = ['/management', '/superadmin', '/portal', '/meetings', '/documents', '/api/', '/login', '/register'];
  for (const forbidden of forbiddenPatterns) {
    const leaked = locMatches.some(url => url.includes(forbidden));
    assert(!leaked, `Sitemap strictly excludes private/auth route ${forbidden}`);
  }

  // Ensure public canonical pages are present
  const requiredPublicPaths = ['', '/about', '/health', '/donate', '/activities', '/culture', '/grants', '/news', '/gallery', '/members', '/contact', '/ai'];
  for (const p of requiredPublicPaths) {
    const expectedUrl = `${CANONICAL_ORIGIN}${p}`;
    assert(locMatches.includes(expectedUrl), `Sitemap includes public canonical page: ${expectedUrl}`);
  }

  // ─────────────────────────────────────────────────────────────
  // 3. PUBLIC PAGE METADATA & CANONICAL TAGS
  // ─────────────────────────────────────────────────────────────
  console.log('\n🏷️  3. Testing Public Route Server-Rendered Titles, Descriptions & Canonical Tags...');
  const publicPagesToTest = [
    { path: '/', titlePart: 'Leimarembi Foundation', canonical: CANONICAL_ORIGIN },
    { path: '/about', titlePart: 'About Us', canonical: `${CANONICAL_ORIGIN}/about` },
    { path: '/activities', titlePart: 'Activities & Projects', canonical: `${CANONICAL_ORIGIN}/activities` },
    { path: '/ai', titlePart: 'AI Heritage Assistant', canonical: `${CANONICAL_ORIGIN}/ai` },
    { path: '/contact', titlePart: 'Contact Us', canonical: `${CANONICAL_ORIGIN}/contact` },
    { path: '/culture', titlePart: 'Cultural Heritage Archive', canonical: `${CANONICAL_ORIGIN}/culture` },
    { path: '/donate', titlePart: 'Support & Donate', canonical: `${CANONICAL_ORIGIN}/donate` },
    { path: '/gallery', titlePart: 'Media Archive', canonical: `${CANONICAL_ORIGIN}/gallery` },
    { path: '/grants', titlePart: 'PFMS Grant Tracker', canonical: `${CANONICAL_ORIGIN}/grants` },
    { path: '/health', titlePart: 'Rural Healthcare', canonical: `${CANONICAL_ORIGIN}/health` },
    { path: '/members', titlePart: 'Executive Committee', canonical: `${CANONICAL_ORIGIN}/members` },
    { path: '/news', titlePart: 'News & Announcements', canonical: `${CANONICAL_ORIGIN}/news` },
  ];

  for (const p of publicPagesToTest) {
    const res = await request(`http://localhost:3000${p.path}`);
    assert(res.statusCode === 200, `Route ${p.path} responds with HTTP 200`);

    const titleMatch = res.body.match(/<title>([^<]+)<\/title>/);
    const decodedTitle = titleMatch ? titleMatch[1].replace(/&amp;/g, '&') : '';
    assert(Boolean(titleMatch && decodedTitle.includes(p.titlePart)), `Route ${p.path} has descriptive title containing "${p.titlePart}"`);

    const canonMatch = res.body.match(/<link rel="canonical" href="([^"]+)"/);
    assert(Boolean(canonMatch && canonMatch[1] === p.canonical), `Route ${p.path} has canonical link matching ${p.canonical}`);

    const descMatch = res.body.match(/<meta name="description" content="([^"]+)"/);
    assert(Boolean(descMatch && descMatch[1].length > 20), `Route ${p.path} has non-empty meta description`);

    const ogLocaleMatch = res.body.match(/<meta property="og:locale" content="en_IN"/);
    assert(Boolean(ogLocaleMatch), `Route ${p.path} has og:locale en_IN`);
  }

  // ─────────────────────────────────────────────────────────────
  // 4. SCHEMA.ORG JSON-LD STRUCTURED DATA
  // ─────────────────────────────────────────────────────────────
  console.log('\n📐 4. Testing Schema.org JSON-LD Structured Data Parsing & Entity Integrity...');
  const homeRes = await request('http://localhost:3000/');
  const jsonLdScripts = [...homeRes.body.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => m[1]);
  assert(jsonLdScripts.length >= 2, `Home page renders at least 2 Schema.org JSON-LD scripts (found: ${jsonLdScripts.length})`);

  let parsedEntities = [];
  for (const raw of jsonLdScripts) {
    try {
      const parsed = JSON.parse(raw);
      parsedEntities.push(parsed);
    } catch (err) {
      assert(false, 'JSON-LD script parses cleanly without syntax errors', err.message);
    }
  }

  const ngoEntity = parsedEntities.find(e => e['@type'] === 'NGO');
  assert(Boolean(ngoEntity), 'Root layout emits Schema.org NGO entity');
  if (ngoEntity) {
    assert(ngoEntity.name === 'Leimarembi Foundation', 'NGO entity name matches Leimarembi Foundation');
    assert(ngoEntity.foundingDate === '2001', 'NGO entity specifies verified foundingDate 2001');
    assert(ngoEntity.taxID === 'AAATL4938EE20234', 'NGO entity specifies Section 80G taxID AAATL4938EE20234');
    assert(ngoEntity.address?.postalCode === '781007', 'NGO entity specifies verified postalCode 781007 (Guwahati, Assam)');
  }

  const websiteEntity = parsedEntities.find(e => e['@type'] === 'WebSite');
  assert(Boolean(websiteEntity), 'Root layout emits Schema.org WebSite entity');
  if (websiteEntity) {
    assert(websiteEntity.url === CANONICAL_ORIGIN, `WebSite entity url matches ${CANONICAL_ORIGIN}`);
  }

  // Test /health for MedicalClinic schema
  const healthRes = await request('http://localhost:3000/health');
  const healthLd = [...healthRes.body.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => m[1]);
  const healthEntities = healthLd.map(s => JSON.parse(s));
  const clinicEntity = healthEntities.find(e => e['@type'] === 'MedicalClinic');
  assert(Boolean(clinicEntity), '/health renders Schema.org MedicalClinic entity');
  if (clinicEntity) {
    assert(clinicEntity.name?.includes('Rural Health'), 'MedicalClinic specifies Rural Health Camps');
  }

  // Test /contact for ContactPage schema
  const contactRes = await request('http://localhost:3000/contact');
  const contactLd = [...contactRes.body.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => m[1]);
  const contactEntities = contactLd.map(s => JSON.parse(s));
  const contactPageEntity = contactEntities.find(e => e['@type'] === 'ContactPage');
  assert(Boolean(contactPageEntity), '/contact renders Schema.org ContactPage entity');

  // Test BreadcrumbList schema on /about
  const aboutRes = await request('http://localhost:3000/about');
  const aboutLd = [...aboutRes.body.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => m[1]);
  const aboutEntities = aboutLd.map(s => JSON.parse(s));
  const breadcrumbEntity = aboutEntities.find(e => e['@type'] === 'BreadcrumbList');
  assert(Boolean(breadcrumbEntity), '/about renders Schema.org BreadcrumbList entity');
  if (breadcrumbEntity) {
    assert(breadcrumbEntity.itemListElement?.length === 2, 'BreadcrumbList contains Home and About items');
    assert(breadcrumbEntity.itemListElement?.[0]?.item === CANONICAL_ORIGIN, 'BreadcrumbList first item points to canonical home');
    assert(breadcrumbEntity.itemListElement?.[1]?.item === `${CANONICAL_ORIGIN}/about`, 'BreadcrumbList second item points to canonical /about');
  }

  // ─────────────────────────────────────────────────────────────
  // 5. SECURITY & ASSET PROTECTION
  // ─────────────────────────────────────────────────────────────
  console.log('\n🛡️  5. Testing Sensitive Assets Removal & Unauthenticated Route Protection...');

  // Confirmed sensitive asset removal & unauthorized access denial
  const sensitiveFiles = ['/Members_List.jpeg', '/Donation_List_of_Members.docx', '/New_Blood_Group_List.docx'];
  for (const sf of sensitiveFiles) {
    const res = await request(`http://localhost:3000${sf}`);
    const isBlocked = (res.statusCode === 404 || res.statusCode === 307) && !res.body.includes('PK');
    assert(isBlocked, `Sensitive file ${sf} is strictly inaccessible to public unauthenticated requests (HTTP ${res.statusCode})`);
  }

  // Private routes redirect unauthenticated visitors
  const privateRoutes = ['/portal', '/meetings', '/documents', '/management', '/superadmin'];
  for (const pr of privateRoutes) {
    const res = await request(`http://localhost:3000${pr}`);
    assert(res.statusCode === 307, `Unauthenticated direct access to ${pr} returns HTTP 307 redirect`);
    assert(res.headers.location?.includes('/login'), `Redirect destination for ${pr} points to /login`);
  }

  // ─────────────────────────────────────────────────────────────
  // 6. SERVICE WORKER BYPASS FOR CRAWLERS
  // ─────────────────────────────────────────────────────────────
  console.log('\n⚙️  6. Verifying Service Worker Exclusion for Crawlers & Static Asset Protection...');
  const swContent = fs.readFileSync(path.join(websiteDir, 'public', 'sw.js'), 'utf-8');
  assert(swContent.includes("url.pathname === '/robots.txt'"), 'sw.js explicitly excludes /robots.txt from caching');
  assert(swContent.includes("url.pathname === '/sitemap.xml'"), 'sw.js explicitly excludes /sitemap.xml from caching');

  // Summary
  console.log('\n======================================================');
  console.log(`📊 TECHNICAL SEO SUITE SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED out of ${passedTests + failedTests} ASSERTIONS`);
  console.log('======================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
})();
