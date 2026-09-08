# LFDGCDP — PORTAL RBAC & AUTHORIZATION ACCEPTANCE

## 1. Role-Based Access Control Verification Matrix

Every role was verified across authentication lifecycle, landing redirection, accessible modules, API authorization, and route protection.

| Role | Landing Route | Module Access | API Security Status | Verification Status |
| :--- | :--- | :--- | :--- | :--- |
| **SUPER_ADMIN** | `/management` | Full platform access (Users, Audit Logs, Settings, Grants, Welfare, Finance) | Authorized on all `/api/v1/*` admin endpoints | **CODE & API VERIFIED** |
| **ADMIN** | `/management` | Operational management (Members, Activities, News, Documents, Grants) | Denied on SuperAdmin-only system configs (403) | **CODE & API VERIFIED** |
| **TRUSTEE** | `/management` | Governance, Financial Ledger, Audit Oversight | Denied on operational member alteration (403) | **CODE & API VERIFIED** |
| **STAFF** | `/management` | Assigned operational workflows | Denied on financial and system configuration (403) | **CODE & API VERIFIED** |
| **CORE_MEMBER**| `/portal/dashboard` | Digital ID Card, Member Welfare Claims, Documents, Activity Schedule | Denied on `/api/v1/admin/*` and management routes | **CODE & API VERIFIED** |
| **MEMBER** | `/portal/dashboard` | Digital ID Card, Member Welfare Claims, Documents, Activity Schedule | Denied on `/api/v1/admin/*` and management routes | **CODE & API VERIFIED** |
| **VOLUNTEER** | `/portal/dashboard` | Volunteer Profile, Field Aid Logs, Activity Tasks, Public Documents | Scoped to volunteer activities; Denied on Admin APIs | **CODE & API VERIFIED** |
| **REGISTERED_USER** | `/portal/dashboard` | Pending Verification Notice, Registration Details, Public Docs, Membership CTA | Denied on Member Welfare Claims & Admin APIs | **CODE & API VERIFIED** |

---

## 2. API Authorization & IDOR Tests

1. **`GET /api/welfare/my-requests`**:
   - Returns strictly requests authored by the authenticated `req.user.id`.
   - Returns `401 Unauthorized` for anonymous requests.
2. **`POST /api/auth/login`**:
   - Constant-time hashing checks prevent timing-based email enumeration.
   - Suspended and Inactive accounts receive immediate `403 Forbidden`.
3. **Stale Token Invalidation**:
   - `verifyToken` middleware dynamically validates account status in SQLite database; account deactivation instantly invalidates active JWTs.
