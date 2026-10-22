import type { Metadata, Viewport } from "next";
import Providers from "@/components/Providers";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import "./globals.css";
import { LanguageProvider } from "@/i18n/LanguageContext";
import GlobalBackground from "@/components/GlobalBackground";
import WelcomeOverlay from "@/components/WelcomeOverlay";
import AppShell from "@/components/AppShell";
import { CANONICAL_ORIGIN, getOrganizationJsonLd, getWebSiteJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(CANONICAL_ORIGIN),
  applicationName: "Leimarembi Foundation",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Leimarembi" },
  formatDetection: { telephone: false },
  title: {
    default: "Leimarembi Foundation | Indigenous Culture & Rural Welfare",
    template: "%s | Leimarembi Foundation",
  },
  description: "Official public charitable trust dedicated to indigenous cultural preservation, rural healthcare welfare camps, Section 80G tax-exempt donations, and community development across Northeast India.",
  alternates: {
    canonical: CANONICAL_ORIGIN,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Leimarembi Foundation | Indigenous Culture & Rural Welfare",
    description: "Official public charitable trust dedicated to indigenous cultural preservation, rural healthcare welfare camps, Section 80G tax-exempt donations, and community development across Northeast India.",
    siteName: "Leimarembi Foundation",
    url: CANONICAL_ORIGIN,
    images: [
      {
        url: "/leimarembi_qr_preview.jpg",
        width: 1200,
        height: 630,
        alt: "Leimarembi Foundation Executive QR Code Gateway",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Leimarembi Foundation | Indigenous Culture & Rural Welfare",
    description: "Official public charitable trust dedicated to indigenous cultural preservation, rural healthcare welfare camps, and Section 80G tax-exempt donations.",
    images: ["/leimarembi_qr_preview.jpg"],
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/icons/icon-192.png",
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1B2A57",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgJsonLd = JSON.stringify(getOrganizationJsonLd()).replace(/</g, '\\u003c');
  const webSiteJsonLd = JSON.stringify(getWebSiteJsonLd()).replace(/</g, '\\u003c');

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: orgJsonLd }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: webSiteJsonLd }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var theme = saved ? saved : (prefersDark ? 'dark' : 'light');
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          <LanguageProvider>
            <GlobalBackground />
            <WelcomeOverlay />
            <AppShell>
              {children}
            </AppShell>
            <PWAInstallPrompt />
          </LanguageProvider>
        </Providers>
      </body>
    </html>
  );
}

