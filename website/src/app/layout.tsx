import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlobalBackground from "@/components/GlobalBackground";
import WelcomeOverlay from "@/components/WelcomeOverlay";

export const metadata: Metadata = {
  title: "𝗟𝗲𝗶𝗺𝗮𝗿𝗲𝗺𝗯𝗲𝗲 𝗙𝗼𝘂𝗻𝗱𝗮𝘁𝗶𝗼𝗻 | Digital Governance & Community Development",
  description: "Official Digital Governance & Community Development Platform for Leimarembee Foundation.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <GlobalBackground />
        <WelcomeOverlay />
        <Navbar />
        <main className="container" style={{ minHeight: 'calc(100vh - 160px)' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
