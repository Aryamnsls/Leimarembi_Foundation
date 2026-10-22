"use client";

import { usePathname } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import FloatingAiChat from "@/components/FloatingAiChat";
import ScrollToTop from "@/components/ScrollToTop";
import ClientRouteGuard from "@/components/ClientRouteGuard";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCrmRoute = Boolean(pathname && (pathname.startsWith('/management') || pathname.startsWith('/superadmin')));

  // Pure CRM & Admin Workspace Mode: Zero website chrome, full width, no public header, no footer, no public widgets
  if (isCrmRoute) {
    return (
      <main style={{ minHeight: '100vh', width: '100%', maxWidth: '100%', margin: 0, padding: 0 }}>
        {children}
      </main>
    );
  }

  // Standard Public Website Mode
  return (
    <>
      <Navbar />
      <main className="container" style={{ minHeight: 'calc(100dvh - 160px)', paddingTop: '0.5rem' }}>
        <Breadcrumb />
        <ClientRouteGuard>
          {children}
        </ClientRouteGuard>
      </main>
      <ScrollToTop />
      <FloatingAiChat />
      <Footer />
    </>
  );
}
