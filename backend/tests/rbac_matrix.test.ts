import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';
import { prisma } from '../src/utils/prisma.js';

describe('RBAC & Permission Matrix Security Suite', () => {
  let superToken: string;
  let adminToken: string;
  let memberToken: string;
  let regUserToken: string;
  let memberId: string;
  let targetUserId: string;

  beforeAll(async () => {
    // 1. SUPER_ADMIN login
    const superRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'super@leimarembifoundation.org', password: 'SuperAdmin@2026!' });
    superToken = superRes.body.data.token;

    // 2. ADMIN login
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@leimarembifoundation.org', password: 'Admin@123456' });
    adminToken = adminRes.body.data.token;

    // 3. MEMBER login
    const memberRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'member@leimarembifoundation.org', password: 'Member@123456' });
    memberToken = memberRes.body.data.token;
    memberId = memberRes.body.data.user.id;

    // 4. REGISTERED_USER login
    const regRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'reguser@leimarembifoundation.org', password: 'Member@123456' });
    regUserToken = regRes.body.data.token;
    targetUserId = regRes.body.data.user.id;
  });

  it('PRIVILEGE ESCALATION CHECK: ADMIN cannot assign SUPER_ADMIN role (requires SUPER_ADMIN)', async () => {
    const res = await request(app)
      .patch(`/api/members/${targetUserId}/role`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'SUPER_ADMIN' });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('PRIVILEGE ESCALATION CHECK: MEMBER cannot assign roles to self or others', async () => {
    const res = await request(app)
      .patch(`/api/members/${memberId}/role`)
      .set('Authorization', `Bearer ${memberToken}`)
      .send({ role: 'ADMIN' });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('SUPER_ADMIN can assign valid role to a user', async () => {
    const res = await request(app)
      .patch(`/api/members/${targetUserId}/role`)
      .set('Authorization', `Bearer ${superToken}`)
      .send({ role: 'REGISTERED_USER' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('MEMBER attempting to access system settings management should be rejected with 403', async () => {
    const res = await request(app)
      .put('/api/settings/contact.phone')
      .set('Authorization', `Bearer ${memberToken}`)
      .send({ value: '+91 0000000000' });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('REGISTERED_USER attempting to view member directory should be rejected with 403', async () => {
    const res = await request(app)
      .get('/api/members')
      .set('Authorization', `Bearer ${regUserToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('PERMISSION ENFORCEMENT CHECK: requirePermission fails if role lacks permission mapping', async () => {
    // Test requirePermission on a custom permission check
    const permission = await prisma.permission.findUnique({ where: { name: 'audit:read' } });
    expect(permission).toBeDefined();

    // REGISTERED_USER does not have audit:read permission
    const res = await request(app)
      .get('/api/audit')
      .set('Authorization', `Bearer ${regUserToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });
});
