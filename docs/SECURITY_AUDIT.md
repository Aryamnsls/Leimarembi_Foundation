# LFDGCDP — Comprehensive Security Audit & Hardening Report

**Document Version**: 2.0.0  
**Audit Scope**: Authentication, Authorization, Encryption, Rate Limiting, Headers, IDOR, Input Validation

---

## 1. Authentication Security

### Credentials & Hashing
- **Algorithm**: `bcryptjs` with salt round `12`.
- **Password Constraints**: Enforced minimum length of 8 characters.
- **Timing Attack Mitigation**: Login handler executes constant-time hash computation when email lookup fails (`await bcrypt.hash('dummy_constant_time_hash', 12)`). This prevents email enumeration through request duration analysis.

### Account Lifecycle & Status Enforcement
- Account status (`ACTIVE`, `INACTIVE`, `SUSPENDED`, `PENDING`) is checked:
  1. During login authentication (`/api/auth/login`).
  2. On every request via `authenticateToken` live database lookup.
- If an administrator marks an account `SUSPENDED` or `INACTIVE` in the database, ongoing sessions are immediately terminated on their next HTTP call.

---

## 2. Token Security & JWT Stale Role Invalidation

### Problem Identified
Standard JWT token architectures store the user's role inside the payload. If an admin changes a user's role from `SUPER_ADMIN` to `MEMBER`, the user could continue making privileged calls until token expiration (7 days).

### Production Solution Implemented
`authenticateToken` middleware verifies the cryptographic signature using `JWT_SECRET`, but derives the user's `role` and `status` **live from the database**:
```typescript
const user = await prisma.user.findUnique({
  where: { id: decoded.id },
  select: { id: true, email: true, role: true, status: true, deletedAt: true },
});
req.user = { id: user.id, email: user.email, role: user.role, status: user.status };
```
This guarantees zero stale privilege window after database role demotions.

---

## 3. IDOR & Access Control Defense

### Member Card Ownership (`/api/members/:id/card`)
- Regular members are restricted to viewing only their own membership card.
- Rejection logic:
  ```typescript
  if (!isPrivileged && requestedId !== requestingUserId) {
    await logAudit({ action: 'IDOR_ATTEMPT_MEMBER_CARD', success: false });
    return sendError(res, 'Access denied. You can only view your own membership card.', 403);
  }
  ```

### Document Serving (`/api/documents/:id/serve`)
- Documents enforce an `accessLevel` hierarchy:
  `PUBLIC` (0) < `REGISTERED_USER` (1) < `MEMBER` (2) < `CORE_MEMBER` (3) < `STAFF` (4) < `TRUSTEE` (5) < `ADMIN` (6) < `SUPER_ADMIN` (7).
- Server rejects unauthorized file serving requests with HTTP 401/403.

---

## 4. HTTP Headers & Transport Security

- **Helmet**: Configured via `app.use(helmet())`.
  - Sets `X-Content-Type-Options: nosniff`.
  - Sets `X-Frame-Options: SAMEORIGIN` (Clickjacking defense).
  - Removes `X-Powered-By: Express`.
  - Enforces `Strict-Transport-Security` (HSTS) in production.

- **CORS Allowlist**: Dynamic origin checking using environment variables:
  ```typescript
  const allowedOrigins = env.CORS_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean);
  ```

---

## 5. Rate Limiting

- **Global API Limiter**: 100 requests per 15 minutes per IP address.
- **Authentication Limiter**: 5 failed login/register attempts per 15 minutes per IP address. Successful requests do not deplete the counter (`skipSuccessfulRequests: true`). Returns HTTP 429 (`Too Many Requests`).
