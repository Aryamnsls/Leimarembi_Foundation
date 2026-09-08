import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';

describe('RBAC & IDOR Authorization Suite', () => {
  let memberToken: string;
  let memberId: string;
  let adminToken: string;

  beforeAll(async () => {
    // Obtain member token
    const memberRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'member@leimarembifoundation.org', password: 'Member@123456' });
    memberToken = memberRes.body.data.token;
    memberId = memberRes.body.data.user.id;

    // Obtain super admin token
    const superRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'super@leimarembifoundation.org', password: 'SuperAdmin@2026!' });
    adminToken = superRes.body.data.token;
  });

  it('MEMBER attempting to view system audit logs should be rejected with 403 Forbidden', async () => {
    const res = await request(app)
      .get('/api/audit')
      .set('Authorization', `Bearer ${memberToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('SUPER_ADMIN viewing system audit logs should succeed with 200', async () => {
    const res = await request(app)
      .get('/api/audit')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.logs).toBeDefined();
  });

  it('IDOR Check: MEMBER attempting to view another member card should be rejected with 403', async () => {
    const fakeOtherUserId = '00000000-0000-0000-0000-000000000000';
    const res = await request(app)
      .get(`/api/members/${fakeOtherUserId}/card`)
      .set('Authorization', `Bearer ${memberToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/only view your own membership card/i);
  });

  it('IDOR Check: MEMBER viewing their own membership card should succeed', async () => {
    const res = await request(app)
      .get(`/api/members/${memberId}/card`)
      .set('Authorization', `Bearer ${memberToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.issuedBy).toBeDefined();
  });
});
