# WELCOME TO LEIMAREMBI FOUNDATION

Official Digital Governance & Community Development Platform for the Leimarembi Foundation.

## Overview

This project is a React-based frontend web application (using Next.js) developed to serve as the official platform for the Foundation. It includes a premium "government-portal" aesthetic, completely custom Vanilla CSS, and dynamic client-side features like QR code document access.

### Key Features
1. **Dynamic Architecture**: Built with Next.js 16 (App Router) and TypeScript.
2. **Full Database Authentication System**: JWT-based Email/Password login, Google OAuth Sign-In, database token verification via `/api/auth/me`, automatic session persistence via cookies and localStorage, and auto-redirection to the **Register First** screen for unauthenticated users.
3. **RBAC Route Protection**: Next.js Middleware enforces that public routes remain accessible while securing member modules.
4. **Official Member Profiles & Executive Roster**: Dedicated `/members` page showcasing all 12 official office bearers & executive committee members with passport photos, search, role filters, and profile modals.
5. **Leimarembi News Hub (`/news`)**: Real-time aggregated news across **Local News (Lakhipur & Cachar)**, **Manipuri News**, **Assamese News**, and **Bengali Region News** delivered in English with vertical cube card aspect ratios and interactive article reading modals.
6. **Restricted Internal Governance Vault (`/documents`)**: High-security governance archive protected for **5 Legal Authorised Executive Signatories**. Features 📥 **Softcopy Download** and 👁️ **Eye Option (In-Browser PDF Viewer Modal)** for `Pad Leimarembi Imp Document.pdf`.
7. **Meeting Management & Instant Video Suite (`/meetings`)**: Accessible via the Navbar. Implements 5 core pillars (**Meeting Notices, Agenda Preparation, Attendance Records, Minutes of Meetings, Resolution Register**) plus an **Embedded Live HD Video Room** and 1-click **Google Meet Instant Launcher**.
8. **Services Portal (`/portal`)**: 8 governance modules including Mobile Application status notification ("Coming Soon" with Phase II technical deployment notice modal).

---

## Getting Started

### 1. Frontend (Next.js Website)

First, install the necessary dependencies if you haven't already:
```bash
cd website
npm install
```

Then, run the development server:
```bash
cd website
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 2. Backend (REST API)

```bash
cd backend

# Install dependencies
npm install

# Push database schema & generate Prisma Client
npx prisma db push

# Seed initial database records
npx prisma db seed

# Launch development server (Port 5000)
npm run dev
```

### 3. View the Live Database

To visually inspect all registered users, donations, and other records stored in the SQLite database:
```bash
cd backend
npx prisma studio
```
Open [http://localhost:5555](http://localhost:5555) to browse the live database tables.

---

## Project Structure
- `/website` - Next.js frontend web application.
  - `public/members/` - Passport photo assets for foundation members.
  - `public/Pad_Leimarembi_Imp_Document.pdf` - Downloadable official governance PDF document.
  - `src/middleware.ts` - **RBAC middleware** — enforces route-level authentication on the server side.
  - `src/app/` - Core page routes:
    - `/` (Home)
    - `/portal` (Services Dashboard & 8 Modules)
    - `/news` (Leimarembi News Hub with Local, Manipuri, Assamese, and Bengali tabs)
    - `/meetings` (Meeting Management Suite & Instant Video Portal)
    - `/documents` (Internal Governance Vault with Eye PDF Viewer & Softcopy Download)
    - `/members` (12 Executive Office Bearers & Profile Roster)
    - `/about` (Foundation History & Mission)
    - `/activities` (Events & Foundation Work)
    - `/gallery` (Photo & Video Media Gallery with Multi-Step Upload)
    - `/culture` (Manipuri Cultural Heritage, Pena Songs, Classical Dance, Recipes, Folklore PDFs)
    - `/login` (Member Portal Register & Sign In with DB Verification)
  - `src/components/Navbar.tsx` - Sticky navbar with language switcher, theme toggle, and Meetings navigation.
  - `src/app/globals.css` - Design system, styling variables, glassmorphism UI framework.
- `/backend` - Shared REST API service powering both web and mobile platforms.
  - `src/server.ts` - Express app entry point on port 5000.
  - `src/routes/auth.routes.ts` - Authentication routes (register, login, `/me`, Google OAuth).
  - `src/routes/` - REST API endpoints for all digital governance modules.
  - `prisma/schema.prisma` - Data schemas (Users, Members, Financials, Grants, Projects, Health, Culture, Documents).

---

## Recent Major Upgrades Summary

### 1. 📰 Leimarembi News Hub (`/news`)
- Category navigation bar for **🌟 All News**, **📍 Local News (Lakhipur & Cachar)**, **⛰️ Manipuri News**, **🌾 Assamese News**, and **🌊 Bengali Region News**.
- All news rendered in clear English with real-time RSS feeds.
- Cube size vertical cards (`1 / 1.15` aspect ratio) with hover animation.
- Interactive **News Reader Modal** opening full article summaries on card click.

### 2. 🔐 Database Authentication & Register First Flow (`/login` & `/portal`)
- Real-time token verification against backend database endpoint `/api/auth/me`.
- Automatic redirect to Portal for valid logged-in sessions.
- Default **Register First** screen for unauthenticated users.

### 3. 🔒 Internal Governance Vault (`/documents`)
- Restricted access enforced for **5 Legal Authorised Executive Signatories**:
  - Dr. N. Tombi Singh (President & Legal Trustee)
  - K. Ibomcha Meitei (General Secretary)
  - S. Pramodini Devi (Treasurer & Financial Auditor)
  - M. Ningthemba Sharma (Trustee Board Chairman)
  - Adv. Rajen Singh (Legal Standing Counsel)
- Unlocks high-security executive vault (`#0F172A`).
- 👁️ **Eye Option (View Document)**: Interactive in-browser PDF reader modal for `Pad Leimarembi Imp Document.pdf`.
- 📥 **Download Softcopy Button**: Direct download link for `Pad_Leimarembi_Imp_Document.pdf`.

### 4. 🎥 Meeting Management Suite & Instant Video Portal (`/meetings`)
- Added **Meetings** button to Navbar header and mobile drawer menu.
- **5 Meeting Management Pillars**:
  1. 📌 Meeting Notices
  2. 📝 Agenda Preparation
  3. 👥 Attendance Records
  4. 📄 Minutes of Meetings (MoM)
  5. 🏛️ Resolution Register
- **Instant Video Suite**:
  - 🎥 Embedded Live HD Video Call Room right inside the webpage.
  - 🟢 Direct Google Meet launcher button (`https://meet.google.com/new`).
  - 📋 1-Click Copy Meeting Invite Link.

### 5. 📱 Services Portal Mobile App Module (`/portal`)
- Updated Module 2 button to **"Coming Soon"** with red accent styling.
- Clicking module opens official government-style notification modal detailing Phase II technical deployment status and planned capabilities checklist (QR Cards, Push Alerts, Fee Gateway, Fast Pass Scanner).
