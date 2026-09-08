# LFDGCDP — Comprehensive API Endpoint Audit

**Document Version**: 2.0.0  
**Backend Port**: 5000  
**API Base URL**: `/api`

---

## Endpoint Catalog & Security Attributes

### 1. Authentication & Identity (`/api/auth`)

| Endpoint | Method | Auth | Role Required | Zod / Input Validation | Rate Limit | Audit Logged | Description |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Public | None | Email, min 8 char pass, name | 5 req / 15m | Yes (`USER_REGISTERED`) | Registers new user account |
| `/api/auth/login` | `POST` | Public | None | Email, password required | 5 req / 15m | Yes (`LOGIN_SUCCESS` / `LOGIN_FAILED`) | Validates credentials & status, returns JWT |
| `/api/auth/me` | `GET` | Bearer | Authenticated | Token check | 100 req / 15m | No | Returns current authenticated profile |

---

### 2. Members & Directory (`/api/members`)

| Endpoint | Method | Auth | Role Required | Input Validation | Rate Limit | Audit Logged | Description |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/members` | `GET` | Bearer | `SUPER_ADMIN`, `ADMIN`, `TRUSTEE`, `CORE_MEMBER`, `STAFF` | `page`, `limit`, `status`, `search` | 100 req / 15m | No | Paginated member directory |
| `/api/members/:id/card` | `GET` | Bearer | Authenticated | Ownership / IDOR check | 100 req / 15m | On IDOR fail | Digital membership card generator |
| `/api/members/:id/status` | `PATCH` | Bearer | `SUPER_ADMIN`, `ADMIN` | `status` enum check | 100 req / 15m | Yes (`USER_STATUS_CHANGED`) | Update account status |
| `/api/members/:id/role` | `PATCH` | Bearer | `SUPER_ADMIN` | `role` enum check | 100 req / 15m | Yes (`USER_ROLE_CHANGED`) | Assign user role |

---

### 3. Financial & Donations (`/api/finance`)

| Endpoint | Method | Auth | Role Required | Input Validation | Rate Limit | Audit Logged | Description |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/finance/donations/initiate` | `POST` | Public | None | `amount`, `donorName`, `email` | 100 req / 15m | No | Creates checkout donation session |
| `/api/finance/donations/status/:publicDonationId` | `GET` | Public | None | Valid donation ref ID | 100 req / 15m | No | Verified server-side donation status check |
| `/api/finance/donations/check-manual-payment` | `POST` | Public | None | `publicDonationId` | 100 req / 15m | No | Submits manual UPI/Bank transfer reference |
| `/api/finance/payments/webhook` | `POST` | Public | None | HMAC Signature Check | 100 req / 15m | Yes | Provider webhook handler |
| `/api/finance/donations/admin/all` | `GET` | Bearer | `ADMIN`, `TRUSTEE`, `STAFF` | `status`, `search` | 100 req / 15m | No | Admin financial records & metrics |
| `/api/finance/donations/admin/:id/status` | `PATCH` | Bearer | `ADMIN`, `TRUSTEE` | `status` enum | 100 req / 15m | Yes | Manual verification of bank deposits |

---

### 4. Welfare Assistance (`/api/welfare`)

| Endpoint | Method | Auth | Role Required | Input Validation | Rate Limit | Audit Logged | Description |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/welfare` | `POST` | Public | None | `requesterName`, `type`, `description` | 100 req / 15m | No | Public welfare relief request submission |
| `/api/welfare/admin/all` | `GET` | Bearer | `SUPER_ADMIN`, `ADMIN`, `TRUSTEE` | `page`, `limit`, `status` | 100 req / 15m | No | Paginated welfare requests for review |
| `/api/welfare/:id/status` | `PATCH` | Bearer | `SUPER_ADMIN`, `ADMIN`, `TRUSTEE` | `status` enum, `amountApproved` | 100 req / 15m | Yes (`WELFARE_REQUEST_STATUS_CHANGED`) | Welfare claim decision |

---

### 5. Digital Documents Library (`/api/documents`)

| Endpoint | Method | Auth | Role Required | Input Validation | Rate Limit | Audit Logged | Description |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/documents` | `GET` | Public | None | `category`, `type` | 100 req / 15m | No | List public digital library documents |
| `/api/documents/:id/serve` | `GET` | Level-based | Role vs `accessLevel` | Valid UUID | 100 req / 15m | Yes (`DOCUMENT_ACCESSED`) | Serve/download file with clearance check |
| `/api/documents` | `POST` | Bearer | `SUPER_ADMIN`, `ADMIN`, `TRUSTEE`, `STAFF` | `title`, `fileUrl`, `description` | 100 req / 15m | Yes (`DOCUMENT_UPLOADED`) | Upload digital document record |

---

### 6. System Settings (`/api/settings`)

| Endpoint | Method | Auth | Role Required | Input Validation | Rate Limit | Audit Logged | Description |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/settings` | `GET` | Public | None | Excludes sensitive keys | 100 req / 15m | No | Public website settings map |
| `/api/settings/admin/all` | `GET` | Bearer | `SUPER_ADMIN`, `ADMIN` | None | 100 req / 15m | No | Full foundation configuration list |
| `/api/settings/:key` | `PUT` | Bearer | `SUPER_ADMIN` | `value` required | 100 req / 15m | Yes (`SETTING_UPDATED`) | Update system configuration key |

---

### 7. Audit Trail (`/api/audit`)

| Endpoint | Method | Auth | Role Required | Input Validation | Rate Limit | Audit Logged | Description |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/audit` | `GET` | Bearer | `SUPER_ADMIN` | `actorId`, `action`, `page`, `limit` | 100 req / 15m | No | Immutable audit trail query |
| `/api/audit/user/:userId` | `GET` | Bearer | `SUPER_ADMIN`, `ADMIN` | Valid user ID | 100 req / 15m | No | User-specific audit log trail |
