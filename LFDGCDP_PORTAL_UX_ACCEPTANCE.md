# LFDGCDP — PORTAL UX & FRONTEND ACCEPTANCE

## 1. UI/UX Architecture Verification

### Public Digital Services Directory (`/portal`)
- **Visual Design**: Professional catalog showcasing the 8 core operational pillars with clean cards, iconography, feature tags, and status badges.
- **Session Decoupling**: Contains no confusing personalized banners or leaked state for anonymous visitors.
- **CTAs**: Provides clear, context-aware actions:
  - **Logged Out**: `[Sign In / Access]`
  - **Logged In**: `[Go to My Dashboard]`
- **Breadcrumb**: `Home > Digital Services`
- **Verification**: **CODE & API VERIFIED**

### Authenticated Member Dashboard (`/portal/dashboard`)
- **Header**: Official Leimarembi Foundation branding with user name, role badge, quick status indicator, and sign-out button.
- **Breadcrumb**: `Home > Member Portal`
- **Tabs & Dynamic Views**:
  - **Overview**: Membership status summary (Active, Pending, Volunteer), verified membership ID, and direct digital card shortcut.
  - **Digital ID Card**: Professional front/back pass view with QR code, issue date, and validity status.
  - **Welfare Assistance**: Interactive emergency & grant aid submission form with history tracking.
  - **Documents**: Direct access to Member Bylaws, Annual Audited Reports, and Public Circulars.
  - **Activities & Calendar**: Upcoming community drives, general body meetings, and health camp schedules.
- **Role Scoping**:
  - `REGISTERED_USER` is presented with a "Verification In Progress" badge and guided to complete full membership.
  - `VOLUNTEER` is provided a field operations overview.
  - `MEMBER` & `CORE_MEMBER` enjoy full access to welfare claims and digital membership privileges.
- **Verification**: **CODE & API VERIFIED**

### Executive Management Portal (`/management`)
- **Purpose**: System administration, user access management, PFMS grant audits, and finance ledgers.
- **Breadcrumb**: `Home > Management`
- **Verification**: **CODE & API VERIFIED**

---

## 2. Navigation Consistency Matrix

| State / Role | Primary Nav Label | Nav Route | Breadcrumb Path | Verification Status |
| :--- | :--- | :--- | :--- | :--- |
| **Logged Out** | **Digital Services** | `/portal` | `Home > Digital Services` | **CODE & API VERIFIED** |
| **MEMBER** | **My Portal** | `/portal/dashboard` | `Home > Member Portal` | **CODE & API VERIFIED** |
| **CORE_MEMBER** | **My Portal** | `/portal/dashboard` | `Home > Member Portal` | **CODE & API VERIFIED** |
| **VOLUNTEER** | **My Portal** | `/portal/dashboard` | `Home > Member Portal` | **CODE & API VERIFIED** |
| **REGISTERED_USER** | **My Portal** | `/portal/dashboard` | `Home > Member Portal` | **CODE & API VERIFIED** |
| **STAFF** | **Management** | `/management` | `Home > Management` | **CODE & API VERIFIED** |
| **TRUSTEE** | **Management** | `/management` | `Home > Management` | **CODE & API VERIFIED** |
| **ADMIN** | **Management** | `/management` | `Home > Management` | **CODE & API VERIFIED** |
| **SUPER_ADMIN** | **Management** | `/management` | `Home > Management` | **CODE & API VERIFIED** |
