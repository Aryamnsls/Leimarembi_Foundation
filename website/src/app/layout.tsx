import type { Metadata } from "next";
import Providers from "@/components/Providers";
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
  title: "Leimarembi Foundation | Digital Governance & Community Development",
  description: "Official Digital Governance & Community Development Platform for Leimarembi Foundation in Northeast India.",
  openGraph: {
    title: "Leimarembi Foundation | Official Digital Governance & QR Portal",
    description: "Scan the Executive QR Gateway Code or click to access Official Governance, Executive Board Meetings, and Health Welfare.",
    siteName: "Leimarembi Foundation",
    images: [
      {
        url: "/leimarembi_qr_preview.jpg",
        width: 1200,
        height: 630,
        alt: "Leimarembi Foundation Executive QR Code Gateway",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Leimarembi Foundation | Official Digital Governance & QR Portal",
    description: "Official Digital Governance Platform for Leimarembi Foundation.",
    images: ["/leimarembi_qr_preview.jpg"],
  },
  icons: {
    icon: '/leimarembi_official_logo.png',
    shortcut: '/leimarembi_official_logo.png',
    apple: '/leimarembi_official_logo.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
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
        </Providers>
      </body>
    </html>
  );
}
