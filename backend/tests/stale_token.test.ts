import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';
import { prisma } from '../src/utils/prisma.js';
import bcrypt from 'bcryptjs';

describe('Stale Token Privilege Revocation Test Suite', () => {
  const testUserEmail = 'stale_token_test@leimarembifoundation.org';
  const testPassword = 'StaleTokenPassword123!';
  let userId: string;

  beforeAll(async () => {
    const hashed = await bcrypt.hash(testPassword, 12);
    const user = await prisma.user.create({
      data: {
        email: testUserEmail,
        password: hashed,
        name: 'Stale Token Test User',
        role: 'ADMIN',
        status: 'ACTIVE',
      },
    });
    userId = user.id;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: testUserEmail },
    });
  });

  it('TEST A: Live Role Change in DB — demoting role in DB must instantly revoke privileges on original JWT', async () => {
    // 1. Login as ADMIN and receive JWT token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: testUserEmail, password: testPassword });

    expect(loginRes.status).toBe(200);
    const originalJwt = loginRes.body.data.token;

    // 2. Verify original JWT works for ADMIN endpoint (/api/members)
    const adminCheckRes = await request(app)
      .get('/api/members')
      .set('Authorization', `Bearer ${originalJwt}`);

    expect(adminCheckRes.status).toBe(200);

    // 3. Demote user role directly in Database to MEMBER
    await prisma.user.update({
      where: { id: userId },
      data: { role: 'MEMBER' },
    });

    // 4. REUSE the ORIGINAL JWT token on the ADMIN endpoint
    const postDemotionRes = await request(app)
      .get('/api/members')
      .set('Authorization', `Bearer ${originalJwt}`);

    // MUST BE REJECTED WITH 403 FORBIDDEN (Zero Stale Privilege Window)
    expect(postDemotionRes.status).toBe(403);
    expect(postDemotionRes.body.success).toBe(false);

    // Restore ADMIN role for next tests
    await prisma.user.update({
      where: { id: userId },
      data: { role: 'ADMIN' },
    });
  });

  it('TEST B: Account Suspension in DB — suspending account in DB must instantly block original JWT', async () => {
    // 1. Login to get fresh token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: testUserEmail, password: testPassword });

    const activeJwt = loginRes.body.data.token;

    // 2. Verify token works
    const check1 = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${activeJwt}`);
    expect(check1.status).toBe(200);

    // 3. Suspend user status directly in Database
    await prisma.user.update({
      where: { id: userId },
      data: { status: 'SUSPENDED' },
    });

    // 4. REUSE original JWT on protected endpoint
    const postSuspensionRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${activeJwt}`);

    // MUST BE REJECTED WITH 403 FORBIDDEN
    expect(postSuspensionRes.status).toBe(403);
    expect(postSuspensionRes.body.success).toBe(false);

    // Restore ACTIVE status for next test
    await prisma.user.update({
      where: { id: userId },
      data: { status: 'ACTIVE' },
    });
  });

  it('TEST C: Account Soft-Delete in DB — soft-deleting account must invalidate existing JWT token', async () => {
    // 1. Login to get token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: testUserEmail, password: testPassword });

    const tokenBeforeDelete = loginRes.body.data.token;

    // 2. Soft-delete user in Database (set deletedAt timestamp)
    await prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() },
    });

    // 3. REUSE token
    const postDeleteRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${tokenBeforeDelete}`);

    // MUST BE REJECTED WITH 401 UNAUTHORIZED
    expect(postDeleteRes.status).toBe(401);
    expect(postDeleteRes.body.success).toBe(false);
  });
});
