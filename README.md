# WELCOME TO LEIMAREMBI FOUNDATION

Official Digital Governance & Community Development Platform for the Leimarembi Foundation.

## Overview

This project is a React-based frontend web application (using Next.js 16 App Router) developed to serve as the official digital governance platform for the Leimarembi Foundation. It includes a premium "government-portal" aesthetic, custom Vanilla CSS, dynamic client-side features, an AI Assistant powered by Leimarembi Foundation, strict role-based authorization for executive modules, and instant video conferencing capabilities.

### Key Features
1. **Dynamic Architecture**: Built with Next.js 16 (App Router) and TypeScript.
2. **Full Database Authentication System**: JWT-based Email/Password login, Google OAuth Sign-In, database token verification via `/api/auth/me`, automatic session persistence via cookies and localStorage, and auto-redirection to the **Register First** screen for unauthenticated users.
3. **RBAC Route Protection**: Next.js Middleware enforces that public routes remain accessible while securing member modules.
4. **Official Member Profiles & Executive Roster**: Dedicated `/members` page showcasing all **15 official office bearers & executive committee members** (including Angom Bidyut Singha, Sengam Bablu Singha, and Paunam Bidyamani Singha) with passport photos, search, role filters, and detailed profile modals.
5. **Leimarembi News Hub (`/news`)**: Real-time aggregated news across **Local News (Lakhipur & Cachar)**, **Manipuri News**, **Assamese News**, and **Bengali Region News** delivered in English with vertical cube card aspect ratios and interactive article reading modals.
6. **Restricted Internal Governance Vault (`/documents`)**: High-security governance archive protected for **6 Legal Authorised Executive Signatories** (Dr. Puritsabam Birmani, K. Ajit Singh, Y. Thambal Singha, M. Bina Babu Singha, Ng. Baldev Singha, Aryaman M Singha). Features hidden officer roster UI in production, 📥 **Softcopy Download**, and 👁️ **In-Browser PDF Viewer Modal** for `Pad Leimarembi Imp Document.pdf`.
7. **Meeting Management & Instant Video Suite (`/meetings`)**: Implements 5 core governance pillars (**Meeting Notices, Agenda Preparation, Attendance Records, Minutes of Meetings, Resolution Register**). View mode is open to the public; action capabilities (launching video calls, generating links, issuing circulars) are strictly protected by **6 Authorized Officer clearance modal rules**.
8. **AI Assistant (`POWERED BY Leimarembi Foundation`)**: Floating intelligent chat assistant integrated across all pages with a comprehensive knowledge base covering Foundation Do's & Don'ts, executive officer contacts, cultural heritage, and general QA.
9. **Services Portal (`/portal`)**: 8 governance modules including Mobile Application status notification ("Coming Soon" with Phase II technical deployment notice modal).

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
    - `/meetings` (Meeting Management Suite & Instant Video Portal with 6-Officer Rules)
    - `/documents` (Internal Governance Vault with 6 Signatories Clearance)
    - `/members` (15 Executive Office Bearers & Profile Roster)
    - `/about` (Foundation History & Mission)
    - `/activities` (Events & Foundation Work)
    - `/gallery` (Photo & Video Media Gallery with Multi-Step Upload)
    - `/culture` (Manipuri Cultural Heritage, Pena Songs, Classical Dance, Recipes, Folklore PDFs)
    - `/login` (Member Portal Register & Sign In with DB Verification)
  - `src/components/Navbar.tsx` - Sticky navbar with language switcher, theme toggle, and Meetings navigation.
  - `src/components/AIAssistant.tsx` - Intelligent assistant widget branded **POWERED BY Leimarembi Foundation**.
  - `src/app/globals.css` - Design system, styling variables, glassmorphism UI framework.
- `/backend` - Shared REST API service powering both web and mobile platforms.
  - `src/server.ts` - Express app entry point on port 5000.
  - `src/routes/auth.routes.ts` - Authentication routes (register, login, `/me`, Google OAuth).
  - `src/routes/` - REST API endpoints for all digital governance modules.
  - `prisma/schema.prisma` - Data schemas (Users, Members, Financials, Grants, Projects, Health, Culture, Documents).

---

## Recent Major Upgrades Summary

### 1. 🤖 AI Assistant (`POWERED BY Leimarembi Foundation`)
- Updated branding banner and avatar to **POWERED BY Leimarembi Foundation**.
- Built-in universal knowledge base handling Foundation rules, Do's & Don'ts, officer rosters, emergency blood registry contacts, and general question answering.

### 2. 👥 Executive Roster Expansion (`/members`)
- Added 3 new official Executive Members (Angom Bidyut Singha, Sengam Bablu Singha, Paunam Bidyamani Singha) with high-resolution profile imagery, bio details, and governance responsibilities. Total active members: **15**.

### 3. 🔒 Internal Governance Vault & 6 Authorized Officers (`/documents`)
- Restricted access enforced for **6 Legal Authorised Executive Signatories**:
  1. Dr. Puritsabam Birmani (`ichemma@yahoo.com` | `98640-44123`)
  2. K. Ajit Singh (`kajitsingh9@gmail.com` | `98648-01906`)
  3. Y. Thambal Singha (`thambal.singha@gmail.com` | `94350-87852`)
  4. M. Bina Babu Singha (`binababu.singha@yahoo.com` | `76370-87931`)
  5. Ng. Baldev Singha (`731baldevsingha@gmail.com` | `94351-94989`)
  6. Aryaman M Singha (`aryamansingha60@gmail.com` | `7099659804`)
- Hidden officer list on production UI for privacy.
- 👁️ **Eye Option (View Document)**: Interactive in-browser PDF reader modal for `Pad Leimarembi Imp Document.pdf`.
- 📥 **Download Softcopy Button**: Direct download link for `Pad_Leimarembi_Imp_Document.pdf`.

### 4. 🎥 Meeting Management Access Rules (`/meetings`)
- **Public View Open**: Notices, Agendas, Attendance Roll Call, Minutes (MoM), and Resolutions can be viewed by all users.
- **Officer Clearance Action Rules**: Clicking any action button (*Launch Embedded Video Room*, *Google Meet*, *Copy Link*, *Issue Notice*, *Join Session*) triggers the **Official Member Clearance Modal** requiring credentials matching one of the 6 Authorized Executive Officers.
- **Instant Video Suite**: Embedded HD Video Room + Google Meet Instant Launcher.
