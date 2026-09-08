import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/i18n/LanguageContext";
import GlobalBackground from "@/components/GlobalBackground";
import WelcomeOverlay from "@/components/WelcomeOverlay";
import LayoutWrapper from "@/components/LayoutWrapper";

export const metadata: Metadata = {
  title: "Leimarembi Foundation | Digital Governance & Community Development",
  description: "Official Digital Governance & Community Development Platform for Leimarembi Foundation in Northeast India.",
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
        <LanguageProvider>
          <GlobalBackground />
          <WelcomeOverlay />
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </LanguageProvider>
      </body>
    </html>
  );
}
