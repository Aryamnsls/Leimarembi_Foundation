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
- `/public` - Contains the foundation logo and official downloadable PDF documents.
- `/src/app/` - Contains the core page routes (`/`, `/about`, `/activities`, `/documents`).
- `/src/app/globals.css` - The primary design system, styling variables, and premium UI framework.
- `/src/components/` - Reusable React components including the Navbar, Footer, and QRCodeDisplay.

## Maintenance
The codebase is structured to be easily maintainable by any developer. To update text content or add new pages, simply navigate to the respective `page.tsx` file inside `src/app`.


### Recent Updates
* **Salai Taret Flag Logo**: Integrated the 7 colors of the Manipuri Salai Taret flag into the official logo to represent the entire community.
* **Dynamic Theme Toggle**: Added a fully functioning Light/Dark mode toggle to the navigation bar.
* **Responsive Mobile Navbar**: Added a hamburger menu (3 strips) that beautifully handles navigation on smaller mobile screens.


### Digital Governance Modules Implementation (Completed Phase)
The platform has been expanded into a comprehensive Digital Governance Platform (LFDGCDP) fulfilling the government client's 8 module requirement. The frontend now includes functional, high-fidelity interfaces for all modules:

1. **Services Portal (\/portal\)**: The central command center linking to all modules, directly accessible via the mobile QR code.
2. **Foundation Management (\/management\)**: Includes an interactive Member Database and Financial tracking cards.
3. **Government Grants (\/grants\)**: Features an Application Pipeline UI and a Scheme Database tracker.
4. **Health & Welfare (\/health\)**: Dashboard for tracking Medical Camps, Senior Citizen Welfare, and Emergency Contacts.
5. **Cultural Preservation (\/culture\)**: Digital archive interface for Manipuri Heritage, traditional recipes, and song/dance.
6. **Artificial Intelligence (\/ai\)**: A functional AI Chat Assistant mockup demonstrating future-phase natural language capabilities.
7. **Digital Library (\/documents\)**: Repository for trust deeds, bye-laws, and technical architecture.
8. **Mobile Application Bridge**: The entire platform is highly responsive and acts as a web-app, bypassing the immediate need for native app development while delivering the same value.

