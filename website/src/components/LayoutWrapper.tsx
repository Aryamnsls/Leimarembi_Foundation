"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import FloatingAiChat from "@/components/FloatingAiChat";
import ScrollToTop from "@/components/ScrollToTop";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide website navbar, footer, breadcrumb and floating assistant on admin, login, and authenticated member portal pages
  const isDedicatedApp = pathname.startsWith('/management') || pathname.startsWith('/login') || pathname.startsWith('/portal/dashboard');

  if (isDedicatedApp) {
    return (
      <main style={{ minHeight: '100dvh', width: '100%' }}>
        {children}
      </main>
    );
  }

  return (
    <>
      <Navbar />
      <main className="container" style={{ minHeight: 'calc(100dvh - 160px)', paddingTop: '0.5rem' }}>
        <Breadcrumb />
        {children}
      </main>
      <ScrollToTop />
      <FloatingAiChat />
      <Footer />
    </>
  );
}
