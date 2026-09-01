import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/i18n/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlobalBackground from "@/components/GlobalBackground";
import WelcomeOverlay from "@/components/WelcomeOverlay";
import Breadcrumb from "@/components/Breadcrumb";
import FloatingAiChat from "@/components/FloatingAiChat";
import ScrollToTop from "@/components/ScrollToTop";

export const metadata: Metadata = {
  title: "Leimarembee Foundation | Digital Governance & Community Development",
  description: "Official Digital Governance & Community Development Platform for Leimarembee Foundation in Northeast India.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <GlobalBackground />
          <WelcomeOverlay />
          <Navbar />
          <main className="container" style={{ minHeight: 'calc(100dvh - 160px)', paddingTop: '0.5rem' }}>
            <Breadcrumb />
            {children}
          </main>
          <ScrollToTop />
          <FloatingAiChat />
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
