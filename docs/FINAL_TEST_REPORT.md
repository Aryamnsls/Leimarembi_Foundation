# LFDGCDP — Final Automated Test Execution Report

**Framework**: Vitest v5.0.0  
**HTTP Driver**: Supertest v7.0.0  
**Test Suite Directory**: `backend/tests/`  
**Total Test Files**: 6  
**Total Executed Tests**: 30  
**Passing Assertions**: 30 (100%)  
**Failing Assertions**: 0

---

## 1. Test Suite Summary Table

| Test File Name | Category | Assertions | Status | Execution Time |
| :--- | :--- | :--- | :--- | :--- |
| `tests/auth.test.ts` | Authentication Lifecycle & Security | 7 | **PASS** | 3595 ms |
| `tests/stale_token.test.ts` | Stale Token Revocation | 3 | **PASS** | 2713 ms |
| `tests/rbac_matrix.test.ts` | Role & Permission Boundaries | 6 | **PASS** | 2726 ms |
| `tests/documents.test.ts` | Document AccessLevel Clearance | 5 | **PASS** | 1692 ms |
| `tests/validation_and_idor.test.ts` | Input Validation & IDOR Defense | 5 | **PASS** | 2179 ms |
| `tests/rbac.test.ts` | RBAC Basic Boundaries | 4 | **PASS** | 1598 ms |

---

## 2. Key Verified Security Scenarios

1. **Stale Token Role Revocation (Test A)**: Logged in as `ADMIN`, saved JWT, demoted role to `MEMBER` in DB, reused original JWT -> Rejection verified (**403 Forbidden**).
2. **Stale Token Account Suspension (Test B)**: Logged in as `ADMIN`, saved JWT, suspended status in DB, reused JWT -> Rejection verified (**403 Forbidden**).
3. **Soft-Delete Token Invalidation (Test C)**: Logged in, soft-deleted user in DB, reused JWT -> Rejection verified (**401 Unauthorized**).
4. **Privilege Escalation Prevention**: `ADMIN` attempting to assign `SUPER_ADMIN` role -> Rejection verified (**403 Forbidden**).
5. **Member Card IDOR Defense**: Regular `MEMBER` requesting another member's card -> Rejection verified (**403 Forbidden**).
6. **Document AccessLevel Clearance**: `REGISTERED_USER` requesting `MEMBER` document -> Rejection verified (**403 Forbidden**).
7. **Pagination Cap Protection**: Requesting `limit=999999` -> Automatically capped to `100`.
