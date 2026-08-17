# Leimarembi Foundation Platform

Official Digital Governance & Community Development Platform for the Leimarembi Foundation.

## Overview

This project is a React-based frontend web application (using Next.js) developed to serve as the official platform for the Foundation. It includes a premium "government-portal" aesthetic, completely custom Vanilla CSS, and dynamic client-side features like QR code document access.

### Key Features
1. **Dynamic Architecture**: Built with Next.js 14 (App Router) and TypeScript.
2. **Custom Styling**: Fully styled using pure Vanilla CSS for maximum performance and design flexibility.
3. **Core Modules**: Showcases the foundation's initiatives including Health & Welfare, Cultural Preservation, and Project Management.
4. **Document Repository & QR**: Integrates `react-qr-code` to allow users to scan and seamlessly access official PDF documents (Trust Deeds, Requirements, etc.) directly from their mobile devices.

## Getting Started

First, install the necessary dependencies if you haven't already:
```bash
npm install
```

Then, run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure
- `/website` - Next.js 14 frontend web application.
  - `public/` - Contains logos and official downloadable PDF documents.
  - `src/app/` - Core page routes (`/`, `/portal`, `/management`, `/grants`, `/health`, `/culture`, `/ai`, `/documents`).
  - `src/app/globals.css` - Design system, styling variables, glassmorphism UI framework.
- `/backend` - Shared REST API service powering both web and mobile platforms.
  - `src/server.ts` - Express app entry point on port 5000.
  - `src/routes/` - REST API endpoints for all 8 digital governance modules.
  - `prisma/schema.prisma` - Data schemas (Users, Members, Financials, Grants, Projects, Health, Culture, Documents).
  - `prisma/seed.ts` - Database seeding script with demo foundation data.

---

## Shared Backend REST API (`/backend`)

The backend is built as a single, unified RESTful API layer in **Node.js, Express, TypeScript, and Prisma ORM** to serve both the web frontend and mobile applications identically.

### Running the Backend Server

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

# Or build & start production server
npm run build
npm run start
```

### Backend API Endpoint Reference (`http://localhost:5000/api`)

| Module | Endpoint | Method | Access / Auth | Function |
| :--- | :--- | :--- | :--- | :--- |
| **System** | `/api/health-check` | `GET` | Public | Returns service status and timestamp |
| **Auth** | `/api/auth/register` | `POST` | Public | Member registration & JWT token issue |
| **Auth** | `/api/auth/login` | `POST` | Public | User authentication |
| **Auth** | `/api/auth/me` | `GET` | Authenticated | Fetch current user profile |
| **Members** | `/api/members` | `GET` | Staff / Admin | List/Search foundation members |
| **Members** | `/api/members/:id/card` | `GET` | Authenticated | Digital membership card metadata & QR payload |
| **Finance** | `/api/finance/donations` | `POST` | Public | Process donation & generate receipt (`LFR-2026-xxxxx`) |
| **Finance** | `/api/finance/donations` | `GET` | Staff / Admin | List all donation records |
| **Finance** | `/api/finance/summary` | `GET` | Staff / Admin | Summary metrics & funds raised calculation |
| **Projects**| `/api/projects` | `GET` | Public | Retrieve projects & community activities |
| **Meetings**| `/api/meetings` | `GET` | Staff / Admin | Access meeting notices, agendas & resolutions |
| **Grants** | `/api/grants` | `GET` | Staff / Admin | Government schemes & PFMS tracking |
| **Culture** | `/api/culture` | `GET` | Public | Browse Manipuri cultural preservation archive |
| **Health** | `/api/health` | `GET` | Public | Health camps, emergency contacts & senior welfare |
| **Library** | `/api/documents` | `GET` | Public | Trust deeds, bye-laws & digital governance library |

---

## Maintenance & Updates

### Recent Updates
* **Backend REST API Implementation**: Built a production-ready Node.js + Express + Prisma ORM REST API in `backend/` serving all 8 Digital Governance modules with JWT authentication, RBAC (Admin, Trustee, Staff, Member), and full database seeding.
* **Premium Glassmorphism Redesign**: Overhauled the UI with a dynamic edge-to-edge panoramic background (featuring 7 Sisters / Manipuri landscapes) and frosted glass (`backdrop-filter`) components.
* **Khuramjari Welcome Overlay**: Implemented a full-screen welcome modal featuring a traditional Manipuri greeting, glowing animations, and smooth transition.
* **Smart Sticky Navbar**: Upgraded navigation bar to hide on scroll down and reappear on scroll up.
* **Salai Taret Flag Logo**: Integrated the 7 colors of the Manipuri Salai Taret flag into the official logo.
* **Dynamic Theme Toggle**: Light/Dark mode toggle in the navigation bar.
* **Responsive Mobile Navbar**: Added a hamburger menu for seamless mobile navigation.

### Digital Governance Modules Implementation
1. **Services Portal (`/portal`)**: Central command center linking to all modules.
2. **Foundation Management (`/management`)**: Member Database and Financial tracking backend integration.
3. **Government Grants (`/grants`)**: Scheme Database & PFMS status tracker.
4. **Health & Welfare (`/health`)**: Medical Camps, Senior Citizen Welfare, Emergency Contacts.
5. **Cultural Preservation (`/culture`)**: Manipuri Heritage archive, recipes, song/dance documentation.
6. **Artificial Intelligence (`/ai`)**: AI Chat Assistant interface.
7. **Digital Library (`/documents`)**: Trust deeds, bye-laws, and technical architecture.
8. **Shared API Backend (`/backend`)**: Node.js REST API layer serving both web frontend and mobile clients.


