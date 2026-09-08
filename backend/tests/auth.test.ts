import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';
import { prisma } from '../src/utils/prisma.js';
import bcrypt from 'bcryptjs';

describe('Authentication Lifecycle & Security Suite', () => {
  const suspendedEmail = 'suspended_test@leimarembifoundation.org';
  const inactiveEmail = 'inactive_test@leimarembifoundation.org';
  const testPassword = 'TestPassword123!';

  beforeAll(async () => {
    const hashed = await bcrypt.hash(testPassword, 12);
    
    // Seed suspended user
    await prisma.user.upsert({
      where: { email: suspendedEmail },
      update: { status: 'SUSPENDED' },
      create: {
        email: suspendedEmail,
        password: hashed,
        name: 'Suspended Test User',
        role: 'MEMBER',
        status: 'SUSPENDED',
      },
    });

    // Seed inactive user
    await prisma.user.upsert({
      where: { email: inactiveEmail },
      update: { status: 'INACTIVE' },
      create: {
        email: inactiveEmail,
        password: hashed,
        name: 'Inactive Test User',
        role: 'MEMBER',
        status: 'INACTIVE',
      },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: { in: [suspendedEmail, inactiveEmail] } },
    });
  });

  it('GET /api/health-check should return 200 ONLINE', async () => {
    const res = await request(app).get('/api/health-check');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('ONLINE');
  });

  it('POST /api/auth/login with wrong password should fail with 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@leimarembifoundation.org', password: 'WrongPassword123!' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Invalid email or password/i);
  });

  it('POST /api/auth/login with unknown email should fail with 401 (constant-time response)', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'unknown_ghost@leimarembifoundation.org', password: 'AnyPassword123!' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Invalid email or password/i);
  });

  it('POST /api/auth/login with SUSPENDED account should return 403 Forbidden', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: suspendedEmail, password: testPassword });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/suspended/i);
  });

  it('POST /api/auth/login with INACTIVE account should return 403 Forbidden', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: inactiveEmail, password: testPassword });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/deactivated/i);
  });

  it('POST /api/auth/login with valid credentials should return JWT token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@leimarembifoundation.org', password: 'Admin@123456' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe('admin@leimarembifoundation.org');
  });

  it('GET /api/auth/me with malformed Bearer token should return 401', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer THIS_IS_AN_INVALID_MALFORMED_JWT_TOKEN');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
