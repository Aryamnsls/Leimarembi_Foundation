# LFDGCDP — Complete Manual QA Execution Checklist & Runbook

**Platform:** Leimarembi Foundation Digital Governance & Community Development Platform  
**Target Environment:** Local Full-Stack (`http://localhost:3000` & `http://localhost:5000`)  
**Date:** September 8, 2026  

---

## 🔑 Quick Reference: Test Credentials

| Role | Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **SUPER_ADMIN** | `super@leimarembifoundation.org` | `SuperAdmin@2026!` | All modules, role assignments, system settings |
| **ADMIN** | `admin@leimarembifoundation.org` | `Admin@123456` | Operations, members, finance, welfare, content |
| **MEMBER** | `member@leimarembifoundation.org` | `Member@123456` | Member portal, own digital card, welfare submission |
| **REGISTERED_USER** | `reguser@leimarembifoundation.org` | `Member@123456` | Introductory portal, public documents |

---

## 📋 Role-by-Role Manual Execution Checklist

### Phase 1: Public Website & Unauthenticated Boundaries (Browser C - Incognito)
- [ ] **Homepage (`/`):** Hero section, vision, statistics counters, and quick CTA buttons load cleanly.
- [ ] **Executive Directory (`/members`):** Clean summary cards render; clicking **"View Full Member Profile"** opens the detailed popup dialog.
- [ ] **Portal (`/portal`):** Displays available foundation services and sign-in shortcuts.
- [ ] **Cultural Archive (`/culture`):** PUYA documents and heritage items display without login.
- [ ] **Digital Library (`/documents`):** Public documents (`TRUST_DEED`, `BYE_LAWS`) are visible; restricted documents show clearance tags.
- [ ] **Unauthenticated Access Block:** Navigating to [`http://localhost:3000/management`](http://localhost:3000/management) redirects to `/login` or denies access.
- [ ] **API Protection Check:** Calling `GET http://localhost:5000/api/members` returns `401 Unauthorized`.

---

### Phase 2: SUPER_ADMIN Full Management Flow (Browser A)
1. **Login:** Log in with `super@leimarembifoundation.org` at [`/login`](http://localhost:3000/login).
2. **Management Dashboard (`/management`):**
   - [ ] Verify summary metrics (Members, Donations, Welfare, Grants, Documents).
   - [ ] **Members Module:** Search member by name, filter by status, update a member profile, and verify persistence after browser refresh.
   - [ ] **Role Management:** Test assigning `STAFF` or `TRUSTEE` to a test user. Verify role updates immediately.
   - [ ] **Donations / Finance:** View transactions, search by receipt number (`LFR-2026-00001`), approve pending UPI payments.
   - [ ] **Welfare Assistance:** Review emergency claims, update priority (`URGENT`), approve claim amount.
   - [ ] **Digital Library:** Upload new document with clearance level (`MEMBER` / `ADMIN`), verify download.
   - [ ] **Grants & Schemes:** Create new scheme with PFMS reference; update sanctioned amount.
   - [ ] **Meetings & Cultural Archive:** Add new executive meeting notice and archive new heritage item.
   - [ ] **Foundation Settings:** Update test phone number or tagline; refresh to verify database persistence.
   - [ ] **Audit Trail (`/management` → Audit):** Verify that every login, role update, and approval is logged with timestamp, actor, and IP.

---

### Phase 3: ADMIN & Delegated Operations (Browser B)
1. **Login:** Log in with `admin@leimarembifoundation.org`.
2. **Operations Verification:**
   - [ ] Access members, finance, welfare, grants, meetings, and documents.
   - [ ] **Privilege Escalation Test (Negative):** Attempt to promote a user or self to `SUPER_ADMIN`. Expected: **`403 Forbidden` / Action Disabled**.
   - [ ] **System Settings (Negative):** Attempt to edit system CMS settings. Expected: **`403 Forbidden` / Read-only**.

---

### Phase 4: Member & IDOR Security Test (Browser B / Incognito)
1. **Login:** Log in with `member@leimarembifoundation.org`.
2. **Personal Assets:**
   - [ ] View own digital membership card.
   - [ ] Submit a new welfare assistance request.
3. **IDOR Cross-Tenant Attack Test:**
   - [ ] Attempt to view another user's membership card by changing the ID in the URL/API request: `GET /api/members/<OTHER_ID>/card`.
   - [ ] Expected: **`403 Forbidden`** (Logged in audit trail as `IDOR_ATTEMPT_MEMBER_CARD`).
4. **Restricted Admin Areas:**
   - [ ] Attempt to access `/management`. Expected: **Redirect / 403 Access Denied**.

---

### Phase 5: Stale-Token & Live Invalidation Test
1. While logged in as `member@leimarembifoundation.org` in Browser B, switch to Browser A (Super Admin).
2. Change the member's status to **`SUSPENDED`** in the Members module.
3. Switch back to Browser B and refresh/call any endpoint.
4. **Expected:** Session is immediately blocked with **`403 Forbidden`** without waiting for JWT expiration.
