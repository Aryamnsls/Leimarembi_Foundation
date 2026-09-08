# WELCOME TO LEIMAREMBI FOUNDATION

Official Digital Governance & Community Development Platform for the Leimarembi Foundation.

## Overview

This project is a React-based frontend web application (using Next.js) developed to serve as the official platform for the Foundation. It includes a premium "government-portal" aesthetic, completely custom Vanilla CSS, and dynamic client-side features like QR code document access.

### Key Features
1. **Dynamic Architecture**: Built with Next.js 16 (App Router) and TypeScript.
2. **Full Authentication System**: JWT-based Email/Password login, Google OAuth Sign-In, automatic session persistence via cookies and localStorage.
3. **RBAC Route Protection**: Next.js Middleware enforces that only `/` (Home) and `/login` are public. All other pages require a valid login session.
4. **Official Member Profiles & Executive Roster**: Dedicated `/members` page showcasing all 12 official office bearers & executive committee members with real passport photos, search, role filters, and profile modals.
5. **Custom Styling**: Fully styled using pure Vanilla CSS for maximum performance and design flexibility.
6. **Core Modules**: Showcases the foundation's initiatives including Health & Welfare, Cultural Preservation, and Project Management.
7. **Document Repository & QR**: Integrates `react-qr-code` to allow users to scan and seamlessly access official PDF documents (Trust Deeds, Requirements, etc.) directly from their mobile devices.

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
  - `public/` - Contains logos and official downloadable PDF documents.
  - `src/middleware.ts` - **RBAC middleware** — enforces route-level authentication on the server side.
  - `src/app/` - Core page routes (`/`, `/portal`, `/members`, `/about`, `/management`, `/grants`, `/health`, `/culture`, `/ai`, `/documents`, `/login`).
  - `src/data/membersData.ts` - Structured roster data for all 12 executive committee members with photo paths.
  - `src/components/Navbar.tsx` - Smart sticky navbar with dynamic Sign In / Sign Out button based on session state.
  - `src/app/globals.css` - Design system, styling variables, glassmorphism UI framework.
- `/backend` - Shared REST API service powering both web and mobile platforms.
  - `src/server.ts` - Express app entry point on port 5000.
  - `src/routes/auth.routes.ts` - Authentication routes (register, login, `/me`, Google OAuth).
  - `src/routes/` - REST API endpoints for all 8 digital governance modules.
  - `prisma/schema.prisma` - Data schemas (Users, Members, Financials, Grants, Projects, Health, Culture, Documents).
  - `prisma/seed.ts` - Database seeding script with demo foundation data.

---

## Authentication System

### How Authentication Works

The platform uses a **dual-storage JWT session** system to support both client-side navigation and server-side route protection:

1. **Registration**: User fills out the form at `/login` → backend creates a new `User` record in SQLite with a hashed password → assigns a unique Membership ID (e.g., `LF-2026-0001`) → returns a JWT token.
2. **Login**: User enters email/password → backend validates credentials → returns JWT token.
3. **Google Sign-In**: User clicks Google button → token verified by Google → backend creates or links account → returns JWT.
4. **Session Storage**: On successful login, the JWT is saved to **both**:
   - `localStorage` — for fast client-side checks
   - A browser **cookie** (`lf_token`) — for server-side middleware route protection
5. **Auto-Redirect**: If a logged-in user visits `/login`, they are automatically redirected to `/portal` or `/management`.
6. **Sign Out**: Clears both `localStorage` and the cookie, then redirects to `/login`.

### RBAC Rules

| Route | Access Level |
|:------|:-------------|
| `/` (Home page) | ✅ Public — QR Code scan lands here |
| `/login` | ✅ Public — Register or Sign In |
| `/portal` | 🔒 Authenticated users only |
| `/about` | 🔒 Authenticated users only |
| `/members` | 🔒 Authenticated users only |
| `/activities` | 🔒 Authenticated users only |
| `/news` | 🔒 Authenticated users only |
| `/gallery` | 🔒 Authenticated users only |
| `/culture` | 🔒 Authenticated users only |
| `/documents` | 🔒 Authenticated users only |
| `/health` | 🔒 Authenticated users only |
| `/grants` | 🔒 Authenticated users only |
| `/management` | 🔒 Admin / Trustee only |
| `/ai` | 🔒 Authenticated users only |
| `/donate` | 🔒 Authenticated users only |

**Redirect Flow**: Unauthenticated users who try to access a protected page are redirected to `/login?redirect=/original-page`. After logging in, they are sent directly to the page they originally tried to visit.

### Google OAuth Setup (Required for Google Sign-In)

The Google Sign-In button will show an error on `localhost` until the origin is whitelisted. To fix:

1. Go to [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials).
2. Open your OAuth 2.0 Web Client.
3. Under **Authorized JavaScript origins**, add:
   - `http://localhost:3000` (for local development)
   - `https://yourdomain.com` (for production on Hostinger)
4. Under **Authorized redirect URIs**, add the same URLs.
5. Click **Save** and wait 2–5 minutes.

> **Note**: The Email/Password login and registration work perfectly without this step. Google Sign-In is a bonus feature.

---

## Shared Backend REST API (`/backend`)

The backend is built as a single, unified RESTful API layer in **Node.js, Express, TypeScript, and Prisma ORM** to serve both the web frontend and mobile applications identically.

### Backend API Endpoint Reference (`http://localhost:5000/api`)

| Module | Endpoint | Method | Access / Auth | Function |
| :--- | :--- | :--- | :--- | :--- |
| **System** | `/api/health-check` | `GET` | Public | Returns service status and timestamp |
| **Auth** | `/api/auth/register` | `POST` | Public | Member registration & JWT token issue |
| **Auth** | `/api/auth/login` | `POST` | Public | User authentication |
| **Auth** | `/api/auth/me` | `GET` | Authenticated | Fetch current user profile |
| **Auth** | `/api/auth/google` | `POST` | Public | Google OAuth Sign-In / Register |
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

### Recent Updates (September 2026)
* **RBAC Route Protection Middleware**: Implemented `src/middleware.ts` using Next.js Edge Middleware. All pages except `/` and `/login` now require a valid JWT session. Unauthenticated access triggers a redirect to `/login?redirect=/intended-page` with automatic return after sign-in.
* **Dual-Storage JWT Session**: Login now saves the JWT token to both `localStorage` (for client-side checks) and a browser cookie (`lf_token`) so the server-side middleware can verify authentication without depending on JavaScript.
* **Google OAuth Fix**: Removed the `useGoogleOneTapLogin` background hook that was causing `[GSI_LOGGER]` console errors to appear on every page. The Google Sign-In button still works via explicit user click.
* **Portal Page Sign Out Button**: The `/portal` page now shows a blue gradient user profile banner with the logged-in user's name, email, and Membership ID, plus a prominent **Sign Out** button.
* **Navbar Dynamic Login/Sign Out**: The Navbar dynamically switches between showing "Login / Register" (when logged out) and "Sign Out" (when logged in) for both desktop and mobile views.
* **Google auth `bcrypt` Fix**: Fixed a TypeScript / runtime crash in `auth.routes.ts` where `bcrypt.compare()` was receiving a `null` password for Google-authenticated users. Now returns a helpful message: `"Invalid credentials. Please login with your Google account."`.
* **Member Photo Added**: Added real passport photo for **K. Braja Babu Singha** (Executive Member). Photo copied from `as/` directory to `public/members/K_Braja_Babu_Singha.jpg`.
* **Auto-Login Redirect**: If a user is already logged in (cookie + localStorage both present), visiting `/login` automatically redirects them to the appropriate page without showing the login form.

### Earlier Updates
* **Language Support & Localization**: Added full Bengali (বাংলা) language support across the entire platform and removed Mizo language support.
* **Official Branding Update**: Replaced all placeholder logos with the official Leimarembi Foundation logo across the Navbar, Mobile Drawer, Footer, and Favicon.
* **HQ Contact & Direct Messaging**: Updated the official headquarters address (Manipuri Rajbari, Guwahati), phone numbers, and email. The Contact Us form is now fully functional.
* **Official Member Profiles & Executive Committee Roster (`/members`)**: Implemented a dedicated interactive member profiles page detailing all 12 office bearers & executive committee members. Features instant search, role filter tabs, photo assets, fallback avatar, and detailed modal popups.
* **About Us Page Integration**: Updated `/about` to display live preview cards of executive officers with direct navigation to `/members`.
* **Backend REST API Implementation**: Built a production-ready Node.js + Express + Prisma ORM REST API in `backend/` serving all 8 Digital Governance modules with JWT authentication, RBAC (Admin, Trustee, Staff, Member), and full database seeding.
* **Premium Glassmorphism Redesign**: Overhauled the UI with a dynamic edge-to-edge panoramic background and frosted glass (`backdrop-filter`) components.
* **Khuramjari Welcome Overlay**: Implemented a full-screen welcome modal featuring a traditional Manipuri greeting, glowing animations, and smooth transition.
* **Smart Sticky Navbar**: Upgraded navigation bar to hide on scroll down and reappear on scroll up.
* **Salai Taret Flag Logo**: Integrated the 7 colors of the Manipuri Salai Taret flag into the official logo.
* **Dynamic Theme Toggle**: Light/Dark mode toggle in the navigation bar.
* **Responsive Mobile Navbar**: Added a hamburger menu for seamless mobile navigation.

---

### Digital Governance Modules Implementation
1. **Services Portal (`/portal`)**: Central command center linking to all modules. Shows logged-in user's profile and Sign Out button.
2. **Member Profiles (`/members`)**: Interactive roster & profiles of all 12 NGO executive committee members with real passport photos.
3. **Foundation Management (`/management`)**: Member Database and Financial tracking backend integration.
4. **Government Grants (`/grants`)**: Scheme Database & PFMS status tracker.
5. **Health & Welfare (`/health`)**: Medical Camps, Senior Citizen Welfare, Emergency Contacts.
6. **Cultural Preservation (`/culture`)**: Manipuri Heritage archive, recipes, song/dance documentation.
7. **Artificial Intelligence (`/ai`)**: AI Chat Assistant interface.
8. **Digital Library (`/documents`)**: Trust deeds, bye-laws, and technical architecture.
9. **Shared API Backend (`/backend`)**: Node.js REST API layer serving both web frontend and mobile clients.

---

## Production Deployment (Hostinger)

When deploying to Hostinger, complete these steps:

1. **Build the Next.js app**:
   ```bash
   cd website
   npm run build
   ```

2. **Set environment variables** on Hostinger:
   ```
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
   ```

3. **Google Cloud Console**: Add your production domain to **Authorized JavaScript origins** and **Authorized redirect URIs** (e.g., `https://leimarembi.org`).

4. **Backend**: Deploy the `/backend` folder to a Node.js host. Run `npx prisma db push` on the production server to create the database schema.
