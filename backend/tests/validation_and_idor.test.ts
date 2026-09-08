import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';

describe('Input Validation & IDOR Defense Test Suite', () => {
  let memberToken: string;
  let memberId: string;

  beforeAll(async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'member@leimarembifoundation.org', password: 'Member@123456' });
    memberToken = loginRes.body.data.token;
    memberId = loginRes.body.data.user.id;
  });

  it('Registration with invalid email format should fail with 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'invalid_email_format_no_at_sign',
        password: 'Password123!',
        name: 'Test Name',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/valid email/i);
  });

  it('Registration with password under 8 characters should fail with 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'short_pass@example.com',
        password: 'short',
        name: 'Test Name',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/at least 8 characters/i);
  });

  it('Updating member status with invalid enum should fail with 400', async () => {
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@leimarembifoundation.org', password: 'Admin@123456' });

    const res = await request(app)
      .patch(`/api/members/${memberId}/status`)
      .set('Authorization', `Bearer ${adminRes.body.data.token}`)
      .send({ status: 'INVALID_UNKNOWN_STATUS' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Invalid status/i);
  });

  it('IDOR Check: Member attempting to access another member card returns 403', async () => {
    const otherUserId = '00000000-0000-0000-0000-000000000000';
    const res = await request(app)
      .get(`/api/members/${otherUserId}/card`)
      .set('Authorization', `Bearer ${memberToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('Pagination cap check: limit=999999 is capped to 100 max', async () => {
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'super@leimarembifoundation.org', password: 'SuperAdmin@2026!' });

    const res = await request(app)
      .get('/api/members?limit=999999')
      .set('Authorization', `Bearer ${adminRes.body.data.token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.pagination.limit).toBe(100);
  });
});
