import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';

describe('All 8 Roles & IDOR/Permission Acceptance Verification Suite', () => {
  let superAdminToken: string;
  let adminToken: string;
  let trusteeToken: string;
  let staffToken: string;
  let coreMemberToken: string;
  let volunteerToken: string;
  let memberToken: string;
  let regUserToken: string;

  let memberUserId: string;
  let staffUserId: string;

  beforeAll(async () => {
    // 1. SUPER_ADMIN
    const res1 = await request(app).post('/api/auth/login').send({ email: 'super@leimarembifoundation.org', password: 'SuperAdmin@2026!' });
    expect(res1.status).toBe(200);
    superAdminToken = res1.body.data.token;

    // 2. ADMIN
    const res2 = await request(app).post('/api/auth/login').send({ email: 'admin@leimarembifoundation.org', password: 'Admin@123456' });
    expect(res2.status).toBe(200);
    adminToken = res2.body.data.token;

    // 3. TRUSTEE
    const res3 = await request(app).post('/api/auth/login').send({ email: 'trustee@leimarembifoundation.org', password: 'Member@123456' });
    expect(res3.status).toBe(200);
    trusteeToken = res3.body.data.token;

    // 4. STAFF
    const res4 = await request(app).post('/api/auth/login').send({ email: 'staff@leimarembifoundation.org', password: 'Member@123456' });
    expect(res4.status).toBe(200);
    staffToken = res4.body.data.token;
    staffUserId = res4.body.data.user.id;

    // 5. CORE_MEMBER
    const res5 = await request(app).post('/api/auth/login').send({ email: 'coremember@leimarembifoundation.org', password: 'Member@123456' });
    expect(res5.status).toBe(200);
    coreMemberToken = res5.body.data.token;

    // 6. VOLUNTEER
    const res6 = await request(app).post('/api/auth/login').send({ email: 'volunteer@leimarembifoundation.org', password: 'Member@123456' });
    expect(res6.status).toBe(200);
    volunteerToken = res6.body.data.token;

    // 7. MEMBER
    const res7 = await request(app).post('/api/auth/login').send({ email: 'member@leimarembifoundation.org', password: 'Member@123456' });
    expect(res7.status).toBe(200);
    memberToken = res7.body.data.token;
    memberUserId = res7.body.data.user.id;

    // 8. REGISTERED_USER
    const res8 = await request(app).post('/api/auth/login').send({ email: 'reguser@leimarembifoundation.org', password: 'Member@123456' });
    expect(res8.status).toBe(200);
    regUserToken = res8.body.data.token;
  });

  describe('1. SUPER_ADMIN Privileges', () => {
    it('Full access to finance stats without 403', async () => {
      const res = await request(app).get('/api/finance/donations/admin/all').set('Authorization', `Bearer ${superAdminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('Full access to audit logs', async () => {
      const res = await request(app).get('/api/audit').set('Authorization', `Bearer ${superAdminToken}`);
      expect(res.status).toBe(200);
    });

    it('Full access to system settings', async () => {
      const res = await request(app).get('/api/settings/admin/all').set('Authorization', `Bearer ${superAdminToken}`);
      expect(res.status).toBe(200);
    });
  });

  describe('2. ADMIN Constraints', () => {
    it('Can view finance records', async () => {
      const res = await request(app).get('/api/finance/donations/admin/all').set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
    });

    it('Cannot promote user to SUPER_ADMIN', async () => {
      const res = await request(app)
        .patch(`/api/members/${memberUserId}/role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'SUPER_ADMIN' });
      expect(res.status).toBe(403);
    });
  });

  describe('3. TRUSTEE Permissions', () => {
    it('Can access donation stats', async () => {
      const res = await request(app).get('/api/finance/donations/admin/all').set('Authorization', `Bearer ${trusteeToken}`);
      expect(res.status).toBe(200);
    });

    it('Cannot edit system settings', async () => {
      const res = await request(app)
        .put('/api/settings/site.name')
        .set('Authorization', `Bearer ${trusteeToken}`)
        .send({ value: 'Unauthorized Change' });
      expect(res.status).toBe(403);
    });
  });

  describe('4. STAFF Permissions', () => {
    it('Can view member directory', async () => {
      const res = await request(app).get('/api/members').set('Authorization', `Bearer ${staffToken}`);
      expect(res.status).toBe(200);
    });

    it('Cannot manage roles', async () => {
      const res = await request(app)
        .patch(`/api/members/${memberUserId}/role`)
        .set('Authorization', `Bearer ${staffToken}`)
        .send({ role: 'STAFF' });
      expect(res.status).toBe(403);
    });
  });

  describe('5. CORE_MEMBER Permissions', () => {
    it('Can view member list', async () => {
      const res = await request(app).get('/api/members').set('Authorization', `Bearer ${coreMemberToken}`);
      expect(res.status).toBe(200);
    });

    it('Cannot access audit logs', async () => {
      const res = await request(app).get('/api/audit').set('Authorization', `Bearer ${coreMemberToken}`);
      expect(res.status).toBe(403);
    });
  });

  describe('6. VOLUNTEER Permissions', () => {
    it('Cannot view unrestricted member directory', async () => {
      const res = await request(app).get('/api/members').set('Authorization', `Bearer ${volunteerToken}`);
      expect(res.status).toBe(403);
    });

    it('Cannot access financial administration', async () => {
      const res = await request(app).get('/api/finance/donations/admin/all').set('Authorization', `Bearer ${volunteerToken}`);
      expect(res.status).toBe(403);
    });
  });

  describe('7. MEMBER Permissions & IDOR Defense', () => {
    it('Can view own digital card', async () => {
      const res = await request(app).get(`/api/members/${memberUserId}/card`).set('Authorization', `Bearer ${memberToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(memberUserId);
    });

    it('IDOR Defense: Cannot view another user card', async () => {
      const res = await request(app).get(`/api/members/${staffUserId}/card`).set('Authorization', `Bearer ${memberToken}`);
      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('Cannot access management endpoints', async () => {
      const res = await request(app).get('/api/members').set('Authorization', `Bearer ${memberToken}`);
      expect(res.status).toBe(403);
    });
  });

  describe('8. REGISTERED_USER Permissions', () => {
    it('Cannot access member-only documents', async () => {
      const { prisma } = await import('../src/utils/prisma.js');
      const memberDoc = await prisma.document.findFirst({ where: { accessLevel: 'MEMBER', deletedAt: null } });
      const res = await request(app).get(`/api/documents/${memberDoc?.id}/serve`).set('Authorization', `Bearer ${regUserToken}`);
      expect(res.status).toBe(403);
    });

    it('Can access public documents', async () => {
      const { prisma } = await import('../src/utils/prisma.js');
      const publicDoc = await prisma.document.findFirst({ where: { accessLevel: 'PUBLIC', deletedAt: null } });
      const res = await request(app).get(`/api/documents/${publicDoc?.id}/serve`).set('Authorization', `Bearer ${regUserToken}`);
      expect(res.status).toBe(200);
    });
  });

  describe('9. PUBLIC / Unauthenticated Access', () => {
    it('Cannot access member cards without token', async () => {
      const res = await request(app).get(`/api/members/${memberUserId}/card`);
      expect(res.status).toBe(401);
    });

    it('Can access public health camps/news', async () => {
      const res = await request(app).get('/api/news');
      expect(res.status).toBe(200);
    });
  });
});
