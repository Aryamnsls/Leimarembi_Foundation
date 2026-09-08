# LFDGCDP — Automated Testing Strategy & Execution

**Test Framework**: Vitest v5  
**HTTP Assertion Library**: Supertest v7  
**Test Suite Directory**: `backend/tests/`

---

## 1. Test Suite Architecture

```
backend/tests/
├── auth.test.ts     # Login, registration, password validation, health check
└── rbac.test.ts     # Role boundaries, audit log access, IDOR membership card checks
```

---

## 2. Command Execution

To run tests locally:
```bash
cd backend
npm test
```

To run tests in CI/CD pipeline:
```bash
npm run test -- --reporter=verbose
```

---

## 3. Verified Test Assertions

1. `POST /api/auth/login` (Wrong Password) -> Returns `401 Unauthorized`.
2. `POST /api/auth/login` (Valid Credentials) -> Returns `200 OK` with JWT token.
3. `GET /api/auth/me` (No Token) -> Returns `401 Unauthorized`.
4. `GET /api/audit` (MEMBER Token) -> Returns `403 Forbidden`.
5. `GET /api/audit` (SUPER_ADMIN Token) -> Returns `200 OK` with audit logs.
6. `GET /api/members/:id/card` (MEMBER accessing another user's ID) -> Returns `403 Forbidden` (IDOR Defense).
7. `GET /api/members/:id/card` (MEMBER accessing own ID) -> Returns `200 OK`.
8. `GET /api/health-check` -> Returns `200 OK`.
