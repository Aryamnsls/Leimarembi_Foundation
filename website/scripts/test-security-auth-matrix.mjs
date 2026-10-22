#!/usr/bin/env node
/**
 * Security & Authorization Matrix Verification Script for Leimarembi Foundation
 * Tests server-side route guards, backend API RBAC, JWT validation, IDOR immunity,
 * and zero-leakage cache policies.
 */

import http from 'node:http';

let passed = 0;
let failed = 0;

function assert(condition, message, details = '') {
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${message}${details ? ` -> ${details}` : ''}`);
    failed++;
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
      res.on('data', c => data += c);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(data); } catch {}
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
          json
        });
      });
    });
    req.on('error', (err) => resolve({ error: err }));
    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

console.log('\n======================================================');
console.log('🛡️  LEIMAREMBI FOUNDATION SECURITY & AUTH MATRIX AUDIT');
console.log('======================================================\n');

(async () => {
  // 1. FRONTEND SERVER-SIDE ROUTE BOUNDARIES (PORT 3000)
  console.log('🔒 1. Auditing Server-Side Protected Route Boundaries (Port 3000)...');
  const privateFrontendRoutes = [
    '/portal',
    '/meetings',
    '/documents',
    '/management',
    '/superadmin'
  ];

  for (const path of privateFrontendRoutes) {
    const res = await request(`http://localhost:3000${path}`);
    assert(res.statusCode === 307, `Unauthenticated direct access to ${path} blocked with HTTP 307 Temporary Redirect`);
    assert(res.headers.location?.includes('/login'), `Redirect for ${path} points strictly to /login`);
    const cc = res.headers['cache-control'] || '';
    assert(!cc.includes('public'), `Private route redirect ${path} does NOT include public cache-control`);
  }

  // 2. BACKEND API AUTHENTICATION & TOKEN ENFORCEMENT (PORT 5000)
  console.log('\n🔐 2. Auditing Backend API Server Authorization & Token Gating (Port 5000)...');

  // Test unauthenticated access to protected API endpoints
  const protectedApis = [
    { method: 'GET', path: '/api/auth/me' },
    { method: 'GET', path: '/api/members' },
    { method: 'POST', path: '/api/documents', body: { title: 'Test' } },
    { method: 'POST', path: '/api/meetings', body: { title: 'Test' } },
    { method: 'GET', path: '/api/finance/donations/admin/all' }
  ];

  for (const api of protectedApis) {
    const res = await request(`http://localhost:5000${api.path}`, {
      method: api.method,
      headers: { 'Content-Type': 'application/json' },
      body: api.body
    });
    assert(res.statusCode === 401, `Unauthenticated ${api.method} ${api.path} rejected with HTTP 401 Unauthorized`);
  }

  // Test malformed / invalid JWT token
  const badTokenRes = await request('http://localhost:5000/api/auth/me', {
    headers: { 'Authorization': 'Bearer malformed.invalid.jwt.token' }
  });
  assert(badTokenRes.statusCode === 403, 'Malformed JWT token rejected with HTTP 403 Forbidden');

  // 3. ROLE-BASED ACCESS CONTROL (RBAC) SEPARATION
  console.log('\n👥 3. Auditing Role-Based Access Control (RBAC) Separation...');

  const testAdminPassword = process.env.TEST_ADMIN_PASSWORD || 'Admin@123456';
  const testMemberPassword = process.env.TEST_MEMBER_PASSWORD || 'Member@123456';

  // Login as MEMBER
  const memberLogin = await request('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { email: 'member@leimarembifoundation.org', password: testMemberPassword }
  });
  assert(memberLogin.statusCode === 200, 'Member authentication succeeds');
  const memberToken = memberLogin.json?.data?.token;

  // Verify MEMBER is strictly forbidden from administrative APIs
  const memberAdminCheck = await request('http://localhost:5000/api/members', {
    headers: { 'Authorization': `Bearer ${memberToken}` }
  });
  assert(memberAdminCheck.statusCode === 403, 'MEMBER role blocked from accessing admin /api/members (HTTP 403 Forbidden)');

  const memberFinanceCheck = await request('http://localhost:5000/api/finance/donations/admin/all', {
    headers: { 'Authorization': `Bearer ${memberToken}` }
  });
  assert(memberFinanceCheck.statusCode === 403, 'MEMBER role blocked from accessing admin /api/finance/donations/admin/all (HTTP 403 Forbidden)');

  // Login as ADMIN
  const adminLogin = await request('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { email: 'admin@leimarembifoundation.org', password: testAdminPassword }
  });
  assert(adminLogin.statusCode === 200, 'Admin authentication succeeds');
  const adminToken = adminLogin.json?.data?.token;

  // Verify ADMIN is authorized to access administrative APIs
  const adminMembersCheck = await request('http://localhost:5000/api/members', {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  assert(adminMembersCheck.statusCode === 200, 'ADMIN role permitted to access /api/members (HTTP 200 OK)');

  const adminFinanceCheck = await request('http://localhost:5000/api/finance/donations/admin/all', {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  assert(adminFinanceCheck.statusCode === 200, 'ADMIN role permitted to access /api/finance/donations/admin/all (HTTP 200 OK)');

  // 4. INSECURE DIRECT FILE ACCESS & PATH TRAVERSAL (IDOR IMMUNITY)
  console.log('\n🚫 4. Auditing Path Traversal & Insecure Direct File Access...');
  const traversalTests = [
    'http://localhost:5000/storage/vault/Members_List.jpeg',
    'http://localhost:5000/backend/storage/vault/Donation_List_of_Members.docx',
    'http://localhost:5000/api/../storage/vault/New_Blood_Group_List.docx',
    'http://localhost:3000/../backend/storage/vault/Members_List.jpeg',
    'http://localhost:3000/out/Members_List.jpeg',
    'http://localhost:3000/website/out/Members_List.jpeg'
  ];

  for (const url of traversalTests) {
    const res = await request(url);
    const isSafe = res.statusCode === 404 || res.statusCode === 307 || res.statusCode === 400;
    assert(isSafe, `Insecure file access to ${url} blocked (Status: ${res.statusCode})`);
  }

  // 5. SECURITY HEADERS & HELMET PROTECTION
  console.log('\n🛡️  5. Auditing Security Headers & Protection Directives...');
  const healthRes = await request('http://localhost:5000/api/health-check');
  assert(healthRes.headers['x-content-type-options'] === 'nosniff', 'X-Content-Type-Options: nosniff enforced by Helmet');
  assert(healthRes.headers['x-frame-options'] === 'SAMEORIGIN', 'X-Frame-Options: SAMEORIGIN enforced against clickjacking');
  assert(Boolean(healthRes.headers['content-security-policy']), 'Content-Security-Policy header present on backend responses');

  console.log('\n======================================================');
  console.log(`📊 SECURITY MATRIX SUMMARY: ${passed} PASSED, ${failed} FAILED out of ${passed + failed} ASSERTIONS`);
  console.log('======================================================\n');

  if (failed > 0) process.exit(1);
})();
