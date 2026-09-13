# WELCOME TO LEIMAREMBI FOUNDATION

Official Digital Governance & Community Development Platform for the Leimarembi Foundation.

## Overview

This project is a React-based frontend web application (using Next.js 16 App Router) developed to serve as the official digital governance platform for the Leimarembi Foundation. It includes a premium "government-portal" aesthetic, custom Vanilla CSS, dynamic client-side features, an AI Assistant powered by Leimarembi Foundation, strict role-based authorization for executive modules, and instant video conferencing capabilities.

---

## Key Features

1. **Dynamic Architecture**: Built with Next.js 16 (App Router) and TypeScript.
2. **Full Database Authentication System**: JWT-based Email/Password login, Google OAuth Sign-In, database token verification via `/api/auth/me`, automatic session persistence via cookies and localStorage, and auto-redirection to the **Register First** screen for unauthenticated users.
3. **RBAC Route Protection**: Next.js Middleware enforces that public routes remain accessible while securing member modules.
4. **Official Member Profiles & Executive Roster**: Dedicated `/members` page showcasing all **15 official office bearers & executive committee members** with passport photos, search, role filters, and detailed profile modals.
5. **Leimarembi News Hub (`/news`)**: Real-time aggregated news across **Local News (Lakhipur & Cachar)**, **Manipuri News**, **Assamese News**, and **Bengali Region News** delivered in English with vertical cube card aspect ratios and interactive article reading modals.
6. **Restricted Internal Governance Vault (`/documents`)**: High-security governance archive protected for **6 Legal Authorised Executive Signatories**. Features **4 built-in documents**, hidden officer roster UI in production, 📥 Softcopy Download, 👁️ In-Browser PDF/Image/DOCX Viewer Modal, and a full **Upload Document** feature supporting any file type.
7. **Meeting Management & Instant Video Suite (`/meetings`)**: Implements 5 core governance pillars (Meeting Notices, Agenda Preparation, Attendance Records, Minutes of Meetings, Resolution Register). View mode is open to the public; action capabilities are strictly protected by **6 Authorized Officer clearance modal rules**.
8. **AI Assistant (`POWERED BY Leimarembi Foundation`)**: Floating intelligent chat assistant integrated across all pages with a comprehensive knowledge base.
9. **Services Portal (`/portal`)**: 8 governance modules including Mobile Application status notification.
10. **Executive QR Code Gateway & WhatsApp Preview**: Interactive holographic QR Code gatekeeper with embedded Foundation logo seal, scanner beam animation, instant WhatsApp share button, and OpenGraph link sharing cards.
11. **Super Admin & Executive Officer Dual-View Switcher**: Seamless switching between Super Admin Control Center (`/superadmin`) and Management Portal (`/management`) available exclusively to Aryaman Singha and M. Bina Babu Singha.
12. **Strict Public Sign In Privacy & Registration Password Verification**: Standard, clean member sign-in fields with validation against member registration passwords. Executive officer DOB authentication hint banners are strictly isolated inside `/documents` and `/meetings` only — **invisible to the public**.
13. **Optimized Desktop Navbar & Fluid Layout**: 100% visible "Donate Now" button and Dark/Light Mode toggle across all standard desktop resolutions (1280px–1920px) with zero horizontal clipping.
14. **Executive Directorate (5 Officers) in Admin Dashboard (`/management`)**: Dedicated tab and overview card showcasing the 5 authorized Executive Officers with full Read, Write & Execute authority.
15. **Admin Access Surveillance Stream (`/management`)**: Executive officers monitor real-time surveillance of who logged in, logged out, accessed modules, or attempted unauthorized access.
16. **Super Admin Live Security & Location Intelligence Radar (`/superadmin`)**: Advanced telemetry radar exclusively for Aryaman Singha & M. Bina Babu Singha displaying exact Geographic Location, Date & Time, IP Address & ISP, Device/OS, and Visited/Attempted Route for unregistered public visitors, unauthorized intrusion attempts, and member sign-ins/logouts.
17. **Stealth Administration Secrecy**: Aryaman Singha possesses supreme platform superpowers and Super Admin access, while remaining completely concealed from visible officer rosters on the Admin Dashboard.
18. **Leimarembi Northeast News Hub & Live Newspaper Covers (`/news`)**:
    - 100% verified, active live feeds across all Northeast Sister States (Assam, Manipur, Meghalaya, Tripura, Nagaland, Mizoram) and local Cachar / Barak Valley.
    - **Live Daily Newspaper Covers & e-Paper Editions Hub**: Live front-page editions for *The Sangai Express*, *Northeast Now / Tom TV*, *Barak Bulletin*, and *The Assam Tribune*.
    - **In-App Full Article Reader Modal**: Built-in narrative view mounted via React portal preventing 404 errors.
19. **Centered Floating Slide Down & Slide to Top Navigation**:
    - Repositioned floating navigation pill to exact horizontal center (`left: 50%, transform: translateX(-50%), bottom: 24px`) ensuring zero overlap with the bottom-right AI Assistant on desktop, mobile, and app viewports.
    - Smart dual-mode: displays "Slide Down" when at top, transitions to "Slide to Top" when scrolled.
20. **Secretive DOB Password Hint System**:
    - The `💡 Officer Access Hint: Your login password is your Date of Birth (DOB)` banner and all DOB-related labels are **completely hidden from public view**.
    - The hint is only revealed to authenticated Admin and Super-Admin users inside the `/documents` vault login card and modal.
    - Public visitors see only a generic "Access restricted to authenticated Executive Committee Officers" message — with **zero mention of DOB or password clues**.

---

## Getting Started

### 1. Frontend (Next.js Website)

```bash
cd website
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 2. Backend (REST API)

```bash
cd backend
npm install
npx prisma db push
npx prisma db seed
npm run dev
```

### 3. View the Live Database

```bash
cd backend
npx prisma studio
```

Open [http://localhost:5555](http://localhost:5555) to browse the live database tables.

---

## Project Structure

- `/website` — Next.js frontend web application.
  - `public/members/` — Passport photo assets for foundation members.
  - `public/Pad_Leimarembi_Imp_Document.pdf` — Official governance PDF document.
  - `public/Members_List.jpeg` — Verified members list image.
  - `public/Donation_List_of_Members.docx` — Official donation ledger (DOCX).
  - `public/New_Blood_Group_List.docx` — Blood group register for all members (DOCX).
  - `src/middleware.ts` — **RBAC middleware** — enforces route-level authentication.
  - `src/app/` — Core page routes:
    - `/` (Home)
    - `/portal` (Services Dashboard & 8 Modules)
    - `/news` (Leimarembi News Hub with Local, Manipuri, Assamese, NE Sister State tabs)
    - `/meetings` (Meeting Management Suite & Instant Video Portal)
    - `/documents` (Internal Governance Vault with 4 built-in docs + Upload feature)
    - `/members` (15 Executive Office Bearers & Profile Roster)
    - `/about` (Foundation History & Mission)
    - `/activities` (Events & Foundation Work)
    - `/gallery` (Photo & Video Media Gallery with Multi-Step Upload)
    - `/culture` (Manipuri Cultural Heritage, Pena Songs, Classical Dance, Recipes, Folklore PDFs)
    - `/login` (Member Portal Register & Sign In with DB Verification)
    - `/superadmin` (Super Admin Command Center with 2-Admin Whitelist, Live Activity Stream)
  - `src/lib/executiveOfficers.ts` — Officer registry with DOB verification logic.
  - `src/lib/superAdminAuth.ts` — Super admin privilege detection.
  - `src/components/Navbar.tsx` — Sticky navbar with language switcher, theme toggle.
  - `src/components/AIAssistant.tsx` — Intelligent assistant widget.
  - `src/app/globals.css` — Design system, styling variables, glassmorphism UI framework.
- `/backend` — Shared REST API service powering both web and mobile platforms.
  - `src/server.ts` — Express app entry point on port 5000.
  - `src/routes/auth.routes.ts` — Authentication routes.
  - `prisma/schema.prisma` — Data schemas.

---

## Recent Major Upgrades Summary

### 1. 📚 Digital Library Expanded — 4 Built-in Documents + Upload Feature (`/documents`)

**New Built-in Documents Added to the Vault:**

| # | Document | Type | Category |
|---|----------|------|----------|
| 1 | Pad Leimarembi Important Governance Document | PDF | Official Trust Deed |
| 2 | **Members List – Leimarembi Foundation** | IMAGE (JPEG) | Member Registry |
| 3 | **Donation List of Members** | DOCX | Financial Records |
| 4 | **Blood Group Register – All Members** | DOCX | Health & Welfare |

**New Upload Document Feature:**
- Click **"Upload Document"** in the vault header or the **dashed "+" card** at the bottom.
- **Drag & drop** or click to select any file.
- Supports: **PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, and ALL file types**.
- Add custom title, description, and document category tag.
- Files **persisted across sessions** via localStorage.
- Each uploaded doc can be **deleted** with the trash icon.
- Smart viewer:
  - **PDF** → inline browser viewer (iframe).
  - **Image** → full preview.
  - **DOCX/XLSX** (built-in) → Google Docs embedded viewer.
  - **Uploaded non-previewable files** → clean download prompt.
- Stats bar shows: Total Documents, Built-in Records, Uploaded Files, and Access Level.

---

### 2. 🔐 Secretive DOB Hint — Hidden from Public View

- The `💡 Officer Access Hint: Your login password is your Date of Birth (DOB)` banner is **completely invisible to the public**.
- It is shown **only** to authenticated Admin and Super-Admin users.
- Public visitors see a generic "Access restricted to authenticated Executive Committee Officers" message with no password clues.
- This applies to both the vault lock card and the officer login modal inside `/documents` and `/meetings`.

---

### 3. 🗞️ Northeast News Hub & Live Newspaper Covers (`/news`)

- **All-Northeast live news feeds** for Assam, Manipur, Meghalaya, Tripura, Nagaland, and Mizoram.
- Fixed all 404 Sentinel Assam links; replaced with verified active sources for **Barak Valley / Cachar** local news (*Barak Bulletin*).
- **Live Newspaper Covers showcase** for 4 major NE publications.
- **In-App Article Reader Modal** using `createPortal` — no 404 errors.
- **Centered Slide Down / Slide to Top** button repositioned to `left: 50%` center, preventing AI Assistant overlap.

---

### 4. 🛡️ Executive Officers & Admin Clearance System

**5 Official Executive Officers Granted Admin Clearance:**
1. **Dr. Phuritsabam Birmani** (President & Legal Trustee | `ichemma@yahoo.com` | `98640-44123`)
2. **K. Ajit Singh** (Vice-Chairman & Executive Officer | `kajitsingh9@gmail.com` | `98648-01906`)
3. **Y. Thambal Singha** (Managing Director | `thambal.singha@gmail.com` | `94350-87852`)
4. **M. Bina Babu Singha** (Secretary & Super Administrator | `binababu.singha@yahoo.com` | `76370-87931`)
5. **Ng. Baldev Singha** (Treasurer & Financial Auditor | `731baldevsingha@gmail.com` | `94351-94989`)

**Super Admin (Overpower) Access:**
- **Aryaman Singha** (`aryamansingha60@gmail.com` / `7099659804` / Blood Group: `A+`)
- **M. Bina Babu Singha** (`binababu.singha@yahoo.com` / `76370-87931` / Blood Group: `AB+`)

**Date of Birth (DOB) as Security Password:**
- Officers authenticate using their registered Email/Phone + Date of Birth.
- Flexible pattern matching: `DD/MM/YYYY`, `DD-MM-YYYY`, `DDMMYYYY`, `YYYY-MM-DD`, or 5-digit passcode.
- DOB hint is shown **only** to privileged (Admin/Super-Admin) users — hidden from public.

---

### 5. 📊 Super Admin Dashboard (`/superadmin`)

- **Live Security Radar**: Geographic Location, Exact Date & Time, IP, ISP, Device/OS, and Route for:
  - Unregistered public visitors (`VISITOR_CHECK`)
  - Unauthorized intrusion attempts (`ACCESS_ATTEMPT`)
  - Member sign-ins & logouts (`SIGN_IN` / `LOG_OUT`)
- **Member Registry**: Read • Write • Execute clearance for Super Admins only.
- **Live Cross-Tab Sync**: Integrated with `storage` event hooks for real-time updates.

---

### 6. 💰 Management Portal Live Ledger (`/management`)

- **12 Official Foundation Donors** seeded from verified Foundation Ledger (*Manipuri Rajbari, Guwahati – 781007*). Verified Total: **₹16,101**.
- **Super Admin Full Access**: Record donations, print official receipt vouchers, export CSV, delete/toggle status.
- **Cross-Platform Live Sync**: Connected via `storage` and `lf_donation_updated` event hooks.
- **Executive Officers**: Read, Write & Execute access to Documents, Meetings, Gallery, and Management.

---

### 7. 🔎 Public Member Access vs. Internal Executive Vault Matrix

| Feature | Public Member Sign In (`/login`) | Internal Governance Vault (`/documents`) |
|---|---|---|
| **Target Audience** | General public, foundation members, donors | 6 Authorised Legal Executive Signatories |
| **Visible Fields** | `Email Address *` & `Password *` | Registered Email/Phone & Security Password |
| **Password Validation** | Validates registered member password | Validates officer Date of Birth (DOB) |
| **Hints & Guidance** | Standard member login hints; **NO DOB mentions** | `💡 Hint` shown **only to Admin/Super-Admin** |
| **Authorized Destination** | Member Portal (`/portal`) | PDF/Doc Eye Reader & Softcopy Download |
| **Role Elevation** | Standard Member standing | Executive Signatory clearance with badge |

---

## Production Deployment Guide

### Static Build & Export

```bash
cd website
npm run build
```

All static HTML, JS bundles, CSS stylesheets, images, and fonts are located in `website/out/`.

### Push to GitHub (triggers live deployment)

```bash
git add -A
git commit -m "Your commit message"
git push origin master
```

### Hostinger Deployment

- If **Hostinger Git Auto-Deployment** is configured, `https://leimarembifoundation.org` automatically updates within minutes of pushing to `master`.
- To manually update via **Hostinger File Manager / FTP**: Upload the files inside `website/out/` directly into your Hostinger `public_html/` root directory.

---

## Authorized Executive Signatories (6 Officers)

| # | Name | Role | Email | Phone | DOB Password |
|---|------|------|-------|-------|-------------|
| 1 | Dr. Puritsabam Birmani | President & Legal Trustee | ichemma@yahoo.com | 98640-44123 | Date of Birth |
| 2 | K. Ajit Singh | Vice-Chairman & Executive Officer | kajitsingh9@gmail.com | 98648-01906 | Date of Birth |
| 3 | Y. Thambal Singha | Managing Director | thambal.singha@gmail.com | 94350-87852 | Date of Birth |
| 4 | M. Bina Babu Singha | Secretary & Super Admin | binababu.singha@yahoo.com | 76370-87931 | Date of Birth |
| 5 | Ng. Baldev Singha | Treasurer & Financial Auditor | 731baldevsingha@gmail.com | 94351-94989 | Date of Birth |
| 6 | Aryaman Singha *(Stealth)* | Platform Director & Lead Architect | aryamansingha60@gmail.com | 7099659804 | Date of Birth |

> **Note**: Aryaman Singha is a stealth Super Admin — completely hidden from visible officer rosters on the public UI and Admin Dashboard. Only visible in the Super Admin Command Center.

---

*Last updated: September 2026 — Leimarembi Foundation, Manipuri Rajbari, Guwahati – 781007, Assam.*
