# Leimarembi Foundation — Website (Next.js)

Official Digital Governance & Community Development Platform for the Leimarembi Foundation.  
Built with **Next.js 16 (App Router)**, **TypeScript**, and **Vanilla CSS**.

---

## Overview

This is the frontend web application of the Leimarembi Foundation Digital Governance & Community Development Platform (LFDGCDP). It delivers a premium government-portal aesthetic with glassmorphism UI, role-based access control, an AI Assistant, and a full suite of digital governance modules.

---

## Getting Started

```bash
# Install dependencies
npm install

# Run development server (http://localhost:3000)
npm run dev

# Build for production
npm run build
```

---

## Project Structure

```
/website
├── public/
│   ├── members/                    → Passport photo assets
│   ├── Pad_Leimarembi_Imp_Document.pdf  → Official governance PDF
│   ├── Members_List.jpeg           → Verified members list image
│   ├── Donation_List_of_Members.docx   → Official donation ledger
│   └── New_Blood_Group_List.docx   → Blood group register
│
├── src/
│   ├── app/                        → Next.js App Router pages
│   │   ├── page.tsx                → / (Home)
│   │   ├── portal/                 → /portal (Services Dashboard)
│   │   ├── news/                   → /news (NE News Hub)
│   │   ├── meetings/               → /meetings (Meeting Suite)
│   │   ├── documents/              → /documents (Governance Vault)
│   │   ├── members/                → /members (Executive Roster)
│   │   ├── about/                  → /about
│   │   ├── activities/             → /activities
│   │   ├── gallery/                → /gallery
│   │   ├── culture/                → /culture
│   │   ├── login/                  → /login (Register & Sign In)
│   │   ├── management/             → /management (Admin Dashboard)
│   │   └── superadmin/             → /superadmin (Super Admin Center)
│   │
│   ├── components/
│   │   ├── Navbar.tsx              → Sticky navbar with theme/language toggle
│   │   ├── AIAssistant.tsx         → Floating AI Assistant widget
│   │   ├── ScrollToTop.tsx         → Centered Slide Down / Slide to Top pill
│   │   ├── ClientRouteGuard.tsx    → Client-side RBAC enforcement (production)
│   │   └── Footer.tsx
│   │
│   ├── lib/
│   │   ├── executiveOfficers.ts    → Officer registry & DOB verification
│   │   └── superAdminAuth.ts       → Super admin privilege detection
│   │
│   ├── middleware.ts               → Server-side RBAC route protection
│   └── app/globals.css             → Design system & glassmorphism framework
│
└── out/                            → Static export (production build)
```

---

## Core Modules

| Route | Module | Access |
|-------|--------|--------|
| `/` | Home & Welcome | Public |
| `/portal` | Services Dashboard (8 Modules) | Members |
| `/news` | Northeast News Hub | Members |
| `/meetings` | Meeting Management & Video Suite | Members / Officers |
| `/documents` | Internal Governance Vault | Executive Officers only |
| `/members` | Executive Roster (15 Members) | Members |
| `/about` | Foundation History & Mission | Public |
| `/activities` | Events & Foundation Work | Members |
| `/gallery` | Photo & Video Media Gallery | Members |
| `/culture` | Manipuri Cultural Heritage | Members |
| `/login` | Register & Sign In | Public |
| `/management` | Admin Dashboard | Executive Officers |
| `/superadmin` | Super Admin Command Center | Super Admins only |

---

## Digital Library & Documents (`/documents`)

### Built-in Documents (4)
| # | Document | Format | Category |
|---|----------|--------|----------|
| 1 | Pad Leimarembi Important Governance Document | PDF | Official Trust Deed |
| 2 | Members List – Leimarembi Foundation | JPEG Image | Member Registry |
| 3 | Donation List of Members | DOCX | Financial Records |
| 4 | Blood Group Register – All Members | DOCX | Health & Welfare |

### Upload Document Feature
- Drag & drop or click to select **any file type** (PDF, DOCX, XLS, JPG, PNG, etc.)
- Custom title, description, and category tag
- Persisted in localStorage across sessions
- Smart viewer: PDF → iframe, Image → preview, DOCX → Google Docs viewer, others → download prompt
- Delete button on each uploaded document

### Security
- Vault access requires Executive Officer authentication (Email/Phone + Date of Birth)
- **DOB hint is hidden from public** — only visible to Admin/Super-Admin users
- Public visitors see: *"Access restricted to authenticated Executive Committee Officers"*

---

## Authentication & RBAC

### Roles
| Role | Access |
|------|--------|
| Public | `/`, `/login`, `/about` |
| Member | All public pages + portal, news, gallery, culture, health |
| Executive Officer (Admin) | Admin Dashboard, Documents Vault, Meeting Actions, Gallery Upload |
| Super Admin | Everything + Super Admin Command Center, Member Registry, Live Security Radar |

### Executive Officers (6 Authorized Signatories)
| # | Name | Email | Phone |
|---|------|-------|-------|
| 1 | Dr. Puritsabam Birmani | ichemma@yahoo.com | 98640-44123 |
| 2 | K. Ajit Singh | kajitsingh9@gmail.com | 98648-01906 |
| 3 | Y. Thambal Singha | thambal.singha@gmail.com | 94350-87852 |
| 4 | M. Bina Babu Singha | binababu.singha@yahoo.com | 76370-87931 |
| 5 | Ng. Baldev Singha | 731baldevsingha@gmail.com | 94351-94989 |
| 6 | Aryaman Singha *(Stealth Super Admin)* | aryamansingha60@gmail.com | 7099659804 |

> **Password for all officers**: Date of Birth (DOB) in `DD/MM/YYYY`, `DD-MM-YYYY`, `DDMMYYYY`, or `YYYY-MM-DD` format.

### Super Admins (2 Whitelisted)
- **Aryaman Singha** — Platform Director & Lead Architect (Stealth — hidden from public rosters)
- **M. Bina Babu Singha** — Executive Vice President & Chief Overseer

---

## Recent Changes

### September 2026
- ✅ **Digital Library expanded**: Added Members List (JPEG), Donation List (DOCX), Blood Group Register (DOCX) as built-in documents.
- ✅ **Upload Document feature**: Supports all file types, drag & drop, category tags, localStorage persistence.
- ✅ **Secretive DOB hint**: `💡 DOB Hint` banner hidden from public — only visible to Admin/Super-Admin users.
- ✅ **News Hub fixes**: All Northeast Sister State feeds verified & active. Sentinel Assam 404 links replaced with *Barak Bulletin*.
- ✅ **Slide Down navigation**: Repositioned to horizontal center (`left: 50%`) — no AI Assistant overlap.
- ✅ **In-App Article Reader Modal**: Mounted via React portal — no 404 errors on article read.
- ✅ **Stats bar in Document Vault**: Shows Total Documents, Built-in Records, Uploaded Files, and Access Level.

---

## Maintenance

To update text content or add new pages, navigate to the respective `page.tsx` inside `src/app/`. All styles are in `src/app/globals.css`.

**Production Deployment:**
```bash
npm run build        # Generates static output in /out
git push origin master  # Triggers Hostinger auto-deploy
```

---

*Leimarembi Foundation — Manipuri Rajbari, Guwahati – 781007, Assam | Est. 2001*  
*Email: leimarembifoundation@gmail.com*
