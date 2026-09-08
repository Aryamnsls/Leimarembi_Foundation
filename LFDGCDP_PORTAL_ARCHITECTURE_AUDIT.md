# LFDGCDP — PORTAL ARCHITECTURE & SECURITY AUDIT

## 1. Executive Summary & Problem Resolution

### Problem Identified
Previously, the `/portal` route served double-duty:
- It was publicly accessible without authentication.
- It was used as the destination landing route when non-management members (`MEMBER`, `CORE_MEMBER`, `VOLUNTEER`, `REGISTERED_USER`) logged in.
- The page displayed an 8-card marketing catalog with an ambiguous `"ACTIVE SESSION: <NAME> (<ROLE>)"` banner when logged in, which mixed public marketing information with member session state.

### Implemented Architectural Solution
We strictly separated public platform information from authenticated member portals:

1. **Public Digital Services Directory (`/portal`)**:
   - **Purpose**: A public marketing, capability, and digital transformation overview detailing the Foundation's 8 core modules (Official Website, Digital Membership Pass, Executive ERP, PFMS Grant Tracker, Cultural Heritage Archive, Rural Health Camps, Digital Library, AI Assistant).
   - **Security**: Contains **zero** private member data, welfare claims, or financial records.
   - **User State**: For anonymous visitors, it displays clear `"Sign In / Access"` and `"Donate"` CTAs. For active sessions, it features a prominent `"Go to My Dashboard"` portal CTA without leaking private information.
   - **Breadcrumb**: `Home > Digital Services`.

2. **Authenticated Member Portal (`/portal/dashboard`)**:
   - **Purpose**: A private, role-aware dashboard for authenticated members (`MEMBER`, `CORE_MEMBER`, `VOLUNTEER`, `REGISTERED_USER`).
   - **Security & Guards**: Protected by client-side session checks and server-validated token verification (`GET /api/auth/me`). Unauthenticated access immediately redirects to `/login?redirect=/portal/dashboard`.
   - **Breadcrumb**: `Home > Member Portal`.
   - **Role-Aware Views**:
     - **`MEMBER` & `CORE_MEMBER`**: Verified profile card, live Digital ID Card pass, Welfare Assistance Claim Submission & Tracker, Member Bylaws & Circulars download, and Upcoming Community Activities.
     - **`VOLUNTEER`**: Volunteer Field Operations notice, Field Aid logs, Community Activities, and Document downloads.
     - **`REGISTERED_USER`**: Pending Verification Alert, Member Benefits Preview, Public Circulars, and Registration upgrade link.

3. **Executive Management Portal (`/management`)**:
   - **Purpose**: Administrative governance, audit logging, finance ledger, user management, and grant monitoring.
   - **Target Roles**: `SUPER_ADMIN`, `ADMIN`, `TRUSTEE`, `STAFF`.
   - **Security**: Strictly guarded against member/public access; returns `403 Forbidden` or redirects non-administrative roles.
   - **Breadcrumb**: `Home > Management`.

---

## 2. Role Landing & Navigation Routing Matrix

| Role | Default Landing Route | Visible Primary Navigation | Breadcrumb Path | Verification Classification |
| :--- | :--- | :--- | :--- | :--- |
| **Anonymous / Public** | `/` (Home) | **Digital Services** (`/portal`), About, Members, Activities, News, Gallery, Culture, Documents, Login, Donate | `Home > Digital Services` | **CODE & API VERIFIED** |
| **REGISTERED_USER** | `/portal/dashboard` | **Digital Services**, **My Portal** (`/portal/dashboard`), About, Members, Activities, News, Gallery, Culture, Documents, Profile Badge, Logout | `Home > Member Portal` | **CODE & API VERIFIED** |
| **VOLUNTEER** | `/portal/dashboard` | **Digital Services**, **My Portal** (`/portal/dashboard`), About, Members, Activities, News, Gallery, Culture, Documents, Profile Badge, Logout | `Home > Member Portal` | **CODE & API VERIFIED** |
| **MEMBER** | `/portal/dashboard` | **Digital Services**, **My Portal** (`/portal/dashboard`), About, Members, Activities, News, Gallery, Culture, Documents, Profile Badge, Logout | `Home > Member Portal` | **CODE & API VERIFIED** |
| **CORE_MEMBER** | `/portal/dashboard` | **Digital Services**, **My Portal** (`/portal/dashboard`), About, Members, Activities, News, Gallery, Culture, Documents, Profile Badge, Logout | `Home > Member Portal` | **CODE & API VERIFIED** |
| **STAFF** | `/management` | **Digital Services**, **Management** (`/management`), About, Members, Activities, News, Gallery, Culture, Documents, Profile Badge, Logout | `Home > Management` | **CODE & API VERIFIED** |
| **TRUSTEE** | `/management` | **Digital Services**, **Management** (`/management`), About, Members, Activities, News, Gallery, Culture, Documents, Profile Badge, Logout | `Home > Management` | **CODE & API VERIFIED** |
| **ADMIN** | `/management` | **Digital Services**, **Management** (`/management`), About, Members, Activities, News, Gallery, Culture, Documents, Profile Badge, Logout | `Home > Management` | **CODE & API VERIFIED** |
| **SUPER_ADMIN** | `/management` | **Digital Services**, **Management** (`/management`), About, Members, Activities, News, Gallery, Culture, Documents, Profile Badge, Logout | `Home > Management` | **CODE & API VERIFIED** |

---

## 3. Data Privacy & IDOR Prevention

1. **Welfare Claims (`GET /api/welfare/my-requests`)**:
   - Authenticated user query is scoped strictly to `where: { requesterId: req.user.id }`. Users can never view or manipulate claims belonging to other members.
2. **Digital Card Verification (`/verify/member/:token`)**:
   - The digital QR code points to a safe verification endpoint that reveals only validity, membership number, and approval status — omitting private phone numbers, home addresses, welfare history, and financial transactions.
3. **Session Revocation**:
   - The backend `verifyToken` middleware continuously checks live DB account status. If an account is suspended or soft-deleted, active JWTs are rejected immediately.
