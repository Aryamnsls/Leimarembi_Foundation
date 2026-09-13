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
10. **Executive QR Code Gateway & WhatsApp Preview**: Interactive holographic QR Code gatekeeper with embedded Foundation logo seal, scanner beam animation, instant WhatsApp share button, and OpenGraph link sharing cards (`og:image`).
11. **Super Admin & Executive Officer Dual-View Switcher**: Seamless switching between Super Admin Control Center (`/superadmin`) and Management Portal (`/management`) available exclusively to Aryaman Singha and M. Bina Babu Singha via top banner and compact navbar dual-pill.
12. **Strict Public Sign In Privacy & Registration Password Verification**: Standard, clean member sign-in fields (`Email Address *` and `Password *`) with validation against member registration passwords. Executive officer Date of Birth (DOB) authentication and visible hint banners are strictly isolated inside `/documents` only.
13. **Optimized Desktop Navbar & Fluid Layout**: 100% visible "Donate Now" button and Dark/Light Mode toggle across all standard desktop resolutions (1280px–1920px) with zero horizontal clipping.
14. **Executive Directorate (5 Officers) in Admin Dashboard (`/management`)**: Dedicated tab and overview card showcasing the 5 authorized Executive Officers (Dr. Phuritsabam Birmani, K. Ajit Singh, Y. Thambal Singha, M. Bina Babu Singha, Ng. Baldev Singha) with full Read, Write & Execute authority across Documents, Meetings, Gallery, and Management.
15. **Admin Access Surveillance Stream (`/management`)**: Executive officers can monitor real-time surveillance of who logged in (`SIGN_IN`), who logged out (`LOG_OUT`), who accessed website modules (`PAGE_ACCESS`), and who attempted unauthorized access (`ACCESS_ATTEMPT`).
16. **Super Admin Live Security & Location Intelligence Radar (`/superadmin`)**: Advanced telemetry radar exclusively for Aryaman Singha & M. Bina Babu Singha displaying exact **Geographic Location (City, State, Country)**, **Exact Date & Time**, **IP Address & ISP Network**, **Device / OS**, and **Visited / Attempted Route** for:
   - **Unregistered Public Visitors** checking the website without registering (`VISITOR_CHECK`)
   - **Unauthorized Intrusion Attempts** blocked at secure vaults (`ACCESS_ATTEMPT`)
   - **Member & Officer Sign-Ins & Logouts** (`SIGN_IN` / `LOG_OUT`)
17. **Stealth Administration Secrecy**: Aryaman Singha possesses supreme platform superpowers and Super Admin access, while remaining completely concealed from visible officer rosters on the Admin Dashboard (`/management`).
18. **Leimarembi Northeast News Hub & Live Newspaper Covers (`/news`)**: 
    - 100% verified, active live feeds across all Northeast Sister States (Assam, Manipur, Meghalaya, Tripura, Nagaland, Mizoram) and local Cachar / Barak Valley (*Barak Bulletin*).
    - **Live Daily Newspaper Covers & e-Paper Editions Hub**: Live front-page editions and direct e-Paper reading portals for *The Sangai Express* (Manipur), *Northeast Now / Tom TV* (Manipur & NE), *Barak Bulletin* (Cachar & Silchar), and *The Assam Tribune* (Assam).
    - **In-App Full Article Reader Modal**: Built-in narrative view mounted via React portal preventing 404 errors and linking directly to verified official publisher sources.
19. **Centered Floating Slide Down & Slide to Top Navigation**:
    - Repositioned floating navigation pill to the exact horizontal center (`left: 50%, transform: translateX(-50%), bottom: 24px`) ensuring zero overlap with the bottom-right AI Assistant on desktop, mobile, and app viewports.
    - Smart dual-mode: displays "Slide Down" (with smooth partial scroll) when at the top of the page, automatically transitioning to "Slide to Top" when scrolled down.

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
    - `/superadmin` (Super Admin Command Center with 2-Admin Whitelist, Live Activity Stream, and Member Registry)
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

### 5. 🛡️ Super Admin Command Center (`/superadmin`)
- **Hidden & Secure Access**: Hidden from public menus; exclusively accessible to **2 Whitelisted Super Administrators**:
  1. **Aryaman Singha** — Platform Director & Lead Architect (`aryamansingha60@gmail.com` | `7099659804` | Blood Group: `A+`)
  2. **M. Bina Babu Singha** — Executive Vice President & Chief Overseer (`binababu.singha@yahoo.com` | `76370-87931` | Blood Group: `AB+` | Senior Citizen)
- **Member Registry (Read • Write • Execute Clearance)**: Restricted strictly to the 2 Super Administrators for maximum operational control. Includes actions to add records, edit, remove, export roster data (CSV), and generate printable Foundation Member Digital Identity Cards.
- **Live Cross-Tab Sync**: Integrated with browser `storage` event hooks to update dashboard counters and activity records instantly whenever a new registration occurs across any open tab or session.

### 6. 📊 Interactive KPI Analytics & Directory Drill-Down Modals
- **5 Clickable Live Metric Cards**:
  - **Total Registered Members (2)**: Instant anchor jump to Member Registry table.
  - **Logged Activity Events**: Jump to the live sign-in & registration audit trail.
  - **Active Members (2)**: Direct filter on active administrators in the Member Registry.
  - **Senior Citizen Members (7)**: Interactive modal opening the **Senior Citizen Health Card Beneficiary Directory** with emergency contacts, blood groups, and printable Digital Health Cards.
  - **Non-Senior Citizen Members (6)**: Interactive modal opening the **Non-Senior Citizen Active Directory** with member credentials and Digital Foundation ID Cards.
- **Live Activity Audit Feed**:
  - Seeded with verified records from `Documents/Memebers List.jpeg` (12 Foundation Members + Super Admins).
  - Members marked as "Waiting" (K. Braja Babu Singha & Moni Mohan Singha) have their email field safely omitted from DB records and displayed as `Waiting (No Email Registered)`.
  - **Stream Filter Pills**: 1-click toggles between `All Stream`, `★ Senior Citizens`, and `👥 Non-Senior Citizens`.

### 7. 🩸 Mandatory Blood Group & Age Category Registration Engine (`/login`)
- **Mandatory Health Parameters**: Registration form strictly enforces selection of:
  - **Blood Group**: `A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`.
  - **Age Category**: `Non-Senior Citizen (< 60 Years)` vs `Senior Citizen (60+ Years)`.
- Client-side validation blocks submission until all health parameters are provided.

### 8. 🌐 Google OAuth Mandatory Details Pop-Out Modal
- **Seamless Desktop & Mobile Interceptor**: When a user registers or logs in via Google OAuth without Blood Group or Age Category saved in their profile:
  - An interactive, responsive pop-out modal appears immediately on both desktop and mobile viewports.
  - Prevents platform navigation until the member selects their Blood Group, confirms their Senior/Non-Senior status, and provides their phone number.
  - Data is synchronized via the `PUT /api/auth/update-profile` endpoint and reflected in real time across the Super Admin Dashboard.

### 9. 🔒 Production RBAC Rule Enforcement & Universal Link Interceptor
- **Static Export Architecture Support**: In production, Next.js runs as a static export (`output: 'export'`), meaning server-side `middleware.ts` is not executed by static web hosts (Hostinger/Apache). The system implements [`ClientRouteGuard.tsx`](file:///d:/Leimarembi_Foundation/website/src/components/ClientRouteGuard.tsx) mounted globally in [`RootLayout`](file:///d:/Leimarembi_Foundation/website/src/app/layout.tsx) to enforce strict RBAC across all production environments.
- **Public Welcome Access**: The Welcome Page (`/`) and Login/Register Page (`/login`) remain accessible to everyone.
- **Universal Capture-Phase Link Interceptor**:
  - When an unauthenticated visitor clicks **ANY** link on the homepage, navbar, footer, core module cards, or action buttons (*Explore Governance*, *About*, *Executive Members*, *Activities*, *News Hub*, *Media Gallery*, *Culture*, *Documents*, *Meetings*, *Donate*, etc.):
  - The navigation is immediately intercepted before page load and redirected to:
    ```
    /login?tab=register&redirect=<target>
    ```
  - Displays the prominent security notice banner:
    > `🔒 Member Access Rule: Please Register or Sign In to access this section.`
- **Direct URL Subroute Shield**: Typing or navigating directly to any protected URL without an active authenticated session (`lf_token`) prevents any flash of protected content and immediately redirects to registration.
- **Register ➔ Sign In ➔ Platform Enjoyment Flow**:
  - Unauthenticated visitors land directly on the **Register (Create Account)** tab.
  - After submitting their registration (with mandatory Blood Group and Senior/Non-Senior category selection), the system confirms their new Membership ID and transitions them to the **Sign In** tab with their email pre-filled.
  - Upon signing in, the member is seamlessly routed to their requested destination (or `/portal`) to explore and enjoy the full platform.
- **Super Admin Clearance**: Aryaman Singha and M. Bina Babu Singha retain full administrative clearance across all routes, including the hidden `/superadmin` Command Center.
- **Production Sync**: Changes are pre-rendered into `/out/` and pushed to GitHub `master` branch for automated deployment on `https://leimarembifoundation.org/`.

### 10. 💰 Management Portal Live Ledger & Official Donors Directory (`/management`)
- **Super Admin Full Access Mode**:
  - Super Administrators (**Aryaman Singha** and **M. Bina Babu Singha**) receive executive clearance with **Read • Write • Add • Print • Delete** capabilities.
  - Action buttons:
    - **+ Record Official Donation**: Interactive modal to register new contributions (Donor Name, Location, Amount, Date, Receipt No, Payment Method, Purpose, and Status).
    - **Print Official Receipt Voucher**: Generates high-resolution, printable Foundation Donation Vouchers featuring the Foundation seal, receipt number, donor details, and authorized signatory blocks.
    - **Export CSV**: Instant export of all official ledger records.
- **Replacement of Hardcoded ₹35,000 with Real 12 Official Foundation Donors**:
  - Seeded strictly from the verified Foundation Ledger document (*Manipuri Rajbari, Guwahati - 781007*):
    1. **Mr. Dhrubajyoti Saikia** (Mangoldai, Assam) — ₹1,000 (Receipt: 001)
    2. **Mr. Amarjit Singha** (Survey, Guwahati, Assam) — ₹1,000 (Receipt: 004)
    3. **S. Nilkumar Singha** (Chandpur, Cachar, Assam) — ₹500 (Receipt: 005)
    4. **J. A. Choudhury** (Sribhumi, Assam) — ₹1,000 (Receipt: 003)
    5. **Mr. Ajoy Barman** (Mangoldai) — ₹500 (Receipt: 006)
    6. **Yendrembam Raju Singha.** (Haflong) — ₹301 (Receipt: 008)
    7. **Loitangbam Biswajit Singha.** (Cachar, Silchar) — ₹2,000 (Receipt: 009)
    8. **Khaidem Surjya Kumar Singha.** (Kolasib, Mizoram) — ₹1,000 (Receipt: 010)
    9. **Sahab Uddin Ahmed , Former MLA Jaleswar LAC.** (Goalpara , Jaleswar) — ₹500 (Receipt: 011)
    10. **Mutum Nilchandra Singha.** (Hojai) — ₹300 (Receipt: 012)
    11. **Laisram Pankaj Singha .** (Cachar , Silchar) — ₹1,000 (Receipt: 013)
    12. **K M Gopal Sana Raj Kumar.** (Cachar , Silchar) — ₹7,000 (Receipt: 014)
  - **Verified Total**: **₹16,101** (Live dynamically computed from verified receipts).
  - **Pending Reconciliations**: Live dynamic counter (0 when all verified receipts are reconciled).
- **Dynamic Registered Members (No Hardcoded 1,245)**:
  - Replaced the hardcoded count of 1,245.
  - Dynamically calculates the actual count of registered members from the Super Admin registry and database.
  - Member Directory tab displays real registered members with their Membership ID, Name, Role, Blood Group, Senior Citizen Status, and Active Standing.
- **Cross-Platform Live Synchronization**:
  - Connected via `storage` and `lf_donation_updated` event hooks.
  - When a donation is made via `/donate` or recorded by an administrator, the Management Portal updates live without page reload.

### 11. 🛡️ Executive Officers Admin Access, DOB Authentication & Stealth Role Switcher
- **5 Official Executive Officers Granted Admin Clearance**:
  1. **Dr. Phuritsabam Birmani** (President & Legal Trustee | `ichemma@yahoo.com` | `98640-44123`)
  2. **K. Ajit Singh** (Vice-Chairman & Executive Officer | `kajitsingh9@gmail.com` | `98648-01906`)
  3. **Y. Thambal Singha** (Managing Director | `thambal.singha@gmail.com` | `94350-87852`)
  4. **M. Bina Babu Singha** (Secretary & Super Administrator | `binababu.singha@yahoo.com` | `76370-87931`)
  5. **Ng. Baldev Singha** (Treasurer & Financial Auditor | `731baldevsingha@gmail.com` | `94351-94989`)
- **Full Read & Write Access Across Modules**:
  - All 5 Executive Officers plus Aryaman Singha receive authorized Admin privileges across:
    - 📄 **Documents Archive (`/documents`)**: Unlocks the official governance vault, PDF eye-reader viewer modal, and softcopy download for `Pad Leimarembi Imp Document.pdf`.
    - 📹 **Meeting Governance Suite (`/meetings`)**: Authorization to issue meeting circulars, manage agendas, capture attendance, publish minutes, and launch instant Google Meet video rooms.
    - 🖼️ **Media Gallery (`/gallery`)**: Full access to upload photographs, videos, event highlights, and manage multimedia archives.
    - 🏛️ **Management Portal (`/management`)**: Record donations, view donor vouchers, manage receipts, and inspect member rosters.
- **Date of Birth (DOB) as Security Password**:
  - When opening `/documents` or triggering executive actions in `/meetings`, officers authenticate using their registered Email/Phone and their **Date of Birth (DOB)**.
  - Prominent hints are visibly displayed on the vault card and login modals:
    > `💡 Officer Hint: Enter your registered Email or Phone. Your security password is your Date of Birth (DOB).`
  - Flexible regex pattern matching accommodates standard DOB formats (`DD/MM/YYYY`, `DD-MM-YYYY`, `DDMMYYYY`, `YYYY-MM-DD`, or 5-digit security passcodes).
- **Exclusive Super Admin ⇄ Admin View Switcher**:
  - **Aryaman Singha** and **M. Bina Babu Singha ONLY** receive an interactive mode switcher (`canSwitchRoleMode`):
    - On the **Super Admin Control Center (`/superadmin`)**, a button provides instant transition:
      `[⇄ Switch to Admin View]` ➔ `/management`.
    - On the **Management Portal (`/management`)**, a button provides instant transition:
      `[👑 Switch to Super Admin View]` ➔ `/superadmin`.
    - In the **Navbar (Desktop & Mobile Drawer)**, a dual-toggle pill switch allows switching between Super Admin and Admin views with one click.
    - Other executive officers only see the standard `[🛡️ Admin Panel]` button without the Super Admin toggle.
- **Stealth Administrator Protection for Aryaman Singha**:
  - As requested for tomorrow's official Foundation Inauguration, **Aryaman Singha is completely hidden from public and visible officer rosters**:
    - The visible governance directory on `/documents` displays strictly the 5 visible Executive Officers.
    - Public member profiles on `/members` show the official executive officers and committee members.
    - The Management Portal (`/management`) filters out Aryaman from the visible active member roster.
    - Aryaman Singha retains complete stealth Super Admin & Developer privileges across all backend endpoints and private vaults without exposing his credentials or card to other members.

### 12. 🚀 Production Deployment & Verification Guide (`https://leimarembifoundation.org`)

#### A. Checking the Digital Library & Documents (`/documents`)
1. Open [https://leimarembifoundation.org/documents](https://leimarembifoundation.org/documents).
2. Notice the visible **Restricted Vault** lock screen with the hint banner:
   > `💡 Officer Access Hint: Your login password is your Date of Birth (DOB).`
3. Click **"Authorised Officer Login Required"**.
4. In the authentication modal, notice the security guidance:
   > `💡 Officer Hint: Enter your registered Email or Phone. Your security password is your Date of Birth (DOB).`
5. Enter any authorized Executive Officer credentials:
   - **Email/Phone**: `ichemma@yahoo.com` or `98640-44123`
   - **Password**: Date of Birth (e.g. `15/08/1960` or `98640`)
6. Click **"Authenticate Officer Clearance"**:
   - The vault unlocks instantly, displaying the authenticated signatory badge (`Dr. Phuritsabam Birmani`).
   - Click **"View Document (Eye Reader)"** to inspect the PDF directly in the in-browser reader modal.
   - Click **"Download Softcopy"** to download `Pad Leimarembi Imp Document.pdf`.

#### B. Checking the Super Admin ⇄ Admin View Switcher
1. Sign in using **Aryaman Singha** (`aryamansingha60@gmail.com` / `7099659804`) or **M. Bina Babu Singha** (`binababu.singha@yahoo.com` / `76370-87931`).
2. **On Super Admin (`/superadmin`)**:
   - Observe the top banner displaying `[⇄ Switch to Admin View]`. Click it to transition smoothly to `/management`.
3. **On Management Portal (`/management`)**:
   - Observe the header banner displaying `[👑 Switch to Super Admin View]`. Click it to return to `/superadmin`.
4. **On Desktop Navbar & Mobile Drawer**:
   - Notice the interactive dual-pill toggle:
     `[🛡️ Super Admin] ⇄ [Admin]`
   - This toggle is visible **strictly to Aryaman Singha and M. Bina Babu Singha**. Other executive officers only see the single `[🛡️ Admin Panel]` button.

#### C. Checking Stealth Administrator Secrecy (Aryaman Hidden)
1. Open `/members`, `/documents`, and `/management` without logging in as Aryaman.
2. Confirm that **Aryaman Singha is completely hidden from visible public rosters and cards**:
   - Only the 5 official Executive Officers are displayed in governance and directory lists.
   - Aryaman's identity remains completely confidential for tomorrow's official Foundation Inauguration.

#### D. Hostinger Production Synchronization
1. **Static Build**: Pre-rendered using Next.js 16 static HTML export (`npm run build`).
2. **Output Bundle**: All static HTML files, JavaScript bundles, CSS stylesheets, images, and fonts are located in [`d:/Leimarembi_Foundation/out`](file:///d:/Leimarembi_Foundation/out).
3. **Git Master Branch**: All commits are synchronized with the remote repository:
   ```bash
   git push origin master
   ```
4. **Hostinger Hosting**:
   - If Hostinger Git Auto-Deployment is configured, your live website at `https://leimarembifoundation.org` automatically updates within minutes of pushing to `master`.
   - To update manually via Hostinger File Manager / FTP: Simply upload the files inside the `out/` folder directly into your Hostinger `public_html/` root directory.

#### E. Desktop Navbar Spacing & Sign In Privacy Hardening
1. **Desktop Navbar Layout Optimization**:
   - Spacing, padding, and font metrics refined across `.nav-links` and action bar buttons (`LanguageSwitcher`, `QR Card`, `Sign Out`, `Super Admin ⇄ Admin`, `Donate Now`, `Dark/Light Mode`).
   - Standard laptop resolutions (1280x720, 1366x768, 1440x900, 1920x1080) maintain 100% visibility for both the **"Donate Now"** button and the **"Dark/Light Mode"** circular toggle with zero horizontal clipping.
   - Fluid `header-content` width prevents right-side elements from falling off the screen.
   - Clean responsive breakpoint synchronized at `1180px` between desktop bar and mobile drawer.
2. **Sign In Page (`/login`) Privacy Restoration**:
   - Public Sign In form restored strictly to standard member credentials (`Email Address *` and `Password *`).
   - The `💡 Executive Officers DOB` hint banner and officer DOB links have been **completely removed** from public view on `/login`.
   - Officer DOB guidance is kept **strictly and exclusively** inside the internal [`/documents`](file:///documents) vault.
   - Password entered on Sign In strictly validates the chosen password established during registration.

#### F. Public Member Access vs. Internal Executive Vault Matrix

| Feature | Public Member Sign In (`/login`) | Internal Governance Vault (`/documents`) |
|---|---|---|
| **Target Audience** | General public, foundation members, and donors | 6 Authorised Legal Executive Signatories |
| **Visible Fields** | `Email Address *` & `Password *` | Registered Email/Phone & Security Password (DOB) |
| **Password Validation** | Validates registered user password created in registration | Validates officer Date of Birth (`DD/MM/YYYY`, `DD-MM-YYYY`, `YYYY-MM-DD`, passcodes) |
| **Hints & Guidance** | Standard member login hints; **NO DOB mentions** | Prominent `💡 Officer Access Hint: Your login password is your Date of Birth (DOB)` |
| **Authorized Destination** | Member Portal (`/portal`) or requested protected page | In-Browser PDF Eye Reader & Softcopy Download |
| **Role Elevation** | Standard Member standing | Executive Signatory clearance with authenticated badge |

#### G. Executive Admin Dashboard (`/management`) & Super Admin Overpower Architecture

1. **Leadership Admin Clearance**:
   - **Aryaman Singha** (`aryamansingha60@gmail.com` / `7099659804` / Blood Group: `A+`): Full Super Admin + Admin privileges.
   - **M. Bina Babu Singha** (`binababu.singha@yahoo.com` / `76370-87931` / Blood Group: `AB+`): Full Super Admin + Admin privileges.
   - **The 5 Executive Officers**:
     1. Dr. Phuritsabam Birmani (`ichemma@yahoo.com`)
     2. K. Ajit Singh (`kajitsingh9@gmail.com`)
     3. Y. Thambal Singha (`thambal.singha@gmail.com`)
     4. M. Bina Babu Singha (`binababu.singha@yahoo.com`)
     5. Ng. Baldev Singha (`731baldevsingha@gmail.com`)
     - Granted authorized **Admin Dashboard Access (`/management`)** with **Read, Write & Execute** privileges.
     - **Restricted from Super Admin Dashboard (`/superadmin`)**: Unauthorized attempts are blocked and routed cleanly to `/management`.
2. **6 Interactive Clickable Overview Cards**:
   - **Total Members**: Click to view full member directory.
   - **Active Members**: Click to filter directory to active verified standing.
   - **Senior Citizens**: Click to filter directory to Senior Citizens (Health Card & diagnostic camp eligible).
   - **Non-Senior Members**: Click to filter directory to Non-Senior general members & directorate.
   - **Donations Total**: Click to view verified donations ledger.
   - **Pending Queue**: Click to view pending bank audit transactions.
3. **Executive Governance Suite (Read, Write, Execute)**:
   - Direct toolbar links:
     - 📄 **Documents Vault (`/documents`)**: Inspect and download governance PDF softcopies.
     - 📹 **Meeting Suite (`/meetings`)**: Issue circulars, record attendance, and launch instant Google Meet video conferences.
     - 🖼️ **Media Gallery (`/gallery`)**: Upload and manage foundation multimedia archives.
     - ➕ **Record Donation Receipt**: Write new official donation voucher.
     - 📥 **Export Audited CSV**: Execute complete ledger download.
4. **Super Admin Overpower Privileges**:
   - Aryaman Singha and M. Bina Babu Singha retain ultimate overpower authority:
     - Permanent deletion/purging of invalid donation entries (`handleDeleteDonation`).
     - Real-time status toggling between `SUCCESS` and `PENDING` (`handleToggleStatus`).
     - One-click dual switch between Super Admin (`/superadmin`) and Admin (`/management`).
5. **Stealth Administration Secrecy**:
   - When other Executive Officers access the Admin Dashboard (`/management`), Aryaman Singha is **completely omitted** from visible member directories and officer cards.
   - Preserves complete operational confidentiality ahead of tomorrow's official Foundation Inauguration.
