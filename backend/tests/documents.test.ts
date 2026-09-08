import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';
import { prisma } from '../src/utils/prisma.js';

describe('Document AccessLevel Clearance & Security Suite', () => {
  let publicDocId: string;
  let memberDocId: string;
  let regUserToken: string;
  let memberToken: string;

  beforeAll(async () => {
    // 1. Get tokens
    const regRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'reguser@leimarembifoundation.org', password: 'Member@123456' });
    regUserToken = regRes.body.data.token;

    const memberRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'member@leimarembifoundation.org', password: 'Member@123456' });
    memberToken = memberRes.body.data.token;

    // 2. Fetch seed document IDs
    const publicDoc = await prisma.document.findFirst({ where: { accessLevel: 'PUBLIC', deletedAt: null } });
    publicDocId = publicDoc!.id;

    const memberDoc = await prisma.document.findFirst({ where: { accessLevel: 'MEMBER', deletedAt: null } });
    memberDocId = memberDoc!.id;
  });

  it('PUBLIC document serve without Bearer token should succeed with 200', async () => {
    const res = await request(app).get(`/api/documents/${publicDocId}/serve`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.fileUrl).toBeDefined();
  });

  it('MEMBER document serve without Bearer token should return 401 Unauthorized', async () => {
    const res = await request(app).get(`/api/documents/${memberDocId}/serve`);
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('MEMBER document serve with REGISTERED_USER token (insufficient clearance) should return 403 Forbidden', async () => {
    const res = await request(app)
      .get(`/api/documents/${memberDocId}/serve`)
      .set('Authorization', `Bearer ${regUserToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/requires MEMBER clearance/i);
  });

  it('MEMBER document serve with MEMBER token (sufficient clearance) should succeed with 200', async () => {
    const res = await request(app)
      .get(`/api/documents/${memberDocId}/serve`)
      .set('Authorization', `Bearer ${memberToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.fileUrl).toBeDefined();
  });

  it('Nonexistent document ID should return 404 Not Found', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000000';
    const res = await request(app).get(`/api/documents/${fakeId}/serve`);
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
