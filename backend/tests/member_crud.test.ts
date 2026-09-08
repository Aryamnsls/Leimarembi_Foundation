import { describe, it, expect, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';

describe('Member Management & CRUD Test Suite', () => {
  let superAdminToken: string;
  let adminToken: string;
  let memberToken: string;
  let createdMemberId: string;
  const testEmail = `test.member.${Date.now()}@leimarembifoundation.org`;

  it('Authenticate test roles', async () => {
    const superRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'super@leimarembifoundation.org', password: 'SuperAdmin@2026!' });
    expect(superRes.status).toBe(200);
    superAdminToken = superRes.body.data.token;

    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@leimarembifoundation.org', password: 'Admin@123456' });
    expect(adminRes.status).toBe(200);
    adminToken = adminRes.body.data.token;

    const memberRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'member@leimarembifoundation.org', password: 'Member@123456' });
    expect(memberRes.status).toBe(200);
    memberToken = memberRes.body.data.token;
  });

  it('SUPER_ADMIN: Access management metrics without 403', async () => {
    const res = await request(app)
      .get('/api/finance/donations/admin/all')
      .set('Authorization', `Bearer ${superAdminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('MEMBER: Creating new member must be denied with 403', async () => {
    const res = await request(app)
      .post('/api/members')
      .set('Authorization', `Bearer ${memberToken}`)
      .send({
        fullName: 'Unauthorized Creation',
        email: `unauth.${Date.now()}@example.com`,
        membershipCategory: 'GENERAL'
      });
    expect(res.status).toBe(403);
  });

  it('ADMIN / SUPER_ADMIN: Create a new Member successfully', async () => {
    const res = await request(app)
      .post('/api/members')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({
        name: 'Test Candidate',
        email: testEmail,
        phone: '+919876543210',
        address: 'Imphal West, Manipur',
        role: 'MEMBER',
        status: 'ACTIVE'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(testEmail);
    expect(res.body.data.membershipNo).toBeDefined();
    createdMemberId = res.body.data.id;
  });

  it('Duplicate Member Email creation must be rejected with 409', async () => {
    const res = await request(app)
      .post('/api/members')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({
        name: 'Duplicate Candidate',
        email: testEmail
      });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('SUPER_ADMIN: Retrieve member list and verify new member is present', async () => {
    const res = await request(app)
      .get('/api/members')
      .set('Authorization', `Bearer ${superAdminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const found = res.body.data.members.find((m: any) => m.email === testEmail);
    expect(found).toBeDefined();
    expect(found.id).toBe(createdMemberId);
  });

  it('SUPER_ADMIN: Update member details', async () => {
    const res = await request(app)
      .patch(`/api/members/${createdMemberId}`)
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({
        phone: '+919999988888',
        address: 'Bishnupur, Manipur'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.phone).toBe('+919999988888');
    expect(res.body.data.address).toBe('Bishnupur, Manipur');
  });

  it('SUPER_ADMIN: Deactivate (soft-suspend) member', async () => {
    const res = await request(app)
      .patch(`/api/members/${createdMemberId}/status`)
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({
        status: 'SUSPENDED'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('SUSPENDED');
  });

  afterAll(async () => {
    if (createdMemberId) {
      const { prisma } = await import('../src/utils/prisma.js');
      await prisma.auditLog.deleteMany({ where: { OR: [{ actorId: createdMemberId }, { resourceId: createdMemberId }] } });
      await prisma.user.deleteMany({ where: { id: createdMemberId } });
    }
  });
});

