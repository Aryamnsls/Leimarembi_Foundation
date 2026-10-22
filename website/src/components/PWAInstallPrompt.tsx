"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Download, Share2, X, Smartphone } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const DISMISS_STORAGE_KEY = "lf_pwa_prompt_dismissed_until";
const DISMISS_DURATION_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

export default function PWAInstallPrompt() {
  const pathname = usePathname();
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(true); // default true to avoid hydration mismatch
  const [showGuide, setShowGuide] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const ua = window.navigator.userAgent;
    const ios = /iPad|iPhone|iPod/i.test(ua) || (window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);
    const android = /Android/i.test(ua);
    const standalone = window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

    // Check dismissal persistence safely
    let dismissed = false;
    try {
      const stored = localStorage.getItem(DISMISS_STORAGE_KEY);
      if (stored && Date.now() < parseInt(stored, 10)) {
        dismissed = true;
      }
    } catch {
      // localStorage might be unavailable or restricted
    }

    setIsIOS(ios);
    setIsAndroid(android);
    setIsInstalled(standalone);
    setIsDismissed(dismissed);

    // Register service worker in production environments only, unregistering in development to prevent stale chunk hydration mismatches
    if ("serviceWorker" in navigator) {
      if (process.env.NODE_ENV === "development") {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const reg of registrations) {
            reg.unregister();
          }
        }).catch(() => undefined);
        if ("caches" in window) {
          caches.keys().then((keys) => {
            for (const key of keys) {
              if (key.startsWith("lf-pwa-")) {
                caches.delete(key);
              }
            }
          }).catch(() => undefined);
        }
      } else if (window.isSecureContext) {
        navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => undefined);
      }
    }

    const handleBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setIsInstalled(true);
      setShowGuide(false);
      setInstallEvent(null);
    };

    const mode = window.matchMedia("(display-mode: standalone)");
    const handleDisplayMode = () => setIsInstalled(mode.matches || (window.navigator as Navigator & { standalone?: boolean }).standalone === true);

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleInstalled);
    mode.addEventListener?.("change", handleDisplayMode);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleInstalled);
      mode.removeEventListener?.("change", handleDisplayMode);
    };
  }, []);

  useEffect(() => {
    if (!showGuide) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowGuide(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showGuide]);

  const handleInstall = async () => {
    if (installEvent) {
      try {
        await installEvent.prompt();
        const choice = await installEvent.userChoice;
        if (choice.outcome === "accepted") {
          setIsInstalled(true);
        } else {
          // User chose to dismiss prompt from the browser dialog
          handleDismiss();
        }
      } catch {
        setShowGuide(true);
      } finally {
        setInstallEvent(null);
      }
      return;
    }
    setShowGuide(true);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setShowGuide(false);
    try {
      localStorage.setItem(DISMISS_STORAGE_KEY, (Date.now() + DISMISS_DURATION_MS).toString());
    } catch {
      // ignore storage failure
    }
  };

  // Do not render before mount, if installed, if dismissed, or on unsupported platforms
  if (!mounted || isInstalled || isDismissed || !(installEvent || isIOS || isAndroid)) {
    return null;
  }

  // Hide floating install prompt on administrative / CRM management dashboards
  if (pathname.startsWith("/management") || pathname.startsWith("/superadmin")) {
    return null;
  }

  return (
    <>
      <div
        role="region"
        aria-label="App Installation"
        style={{
          position: "fixed",
          left: "max(16px, env(safe-area-inset-left))",
          bottom: "max(16px, env(safe-area-inset-bottom))",
          zIndex: 12000,
          display: "inline-flex",
          alignItems: "center",
          borderRadius: 999,
          background: "#1B2A57",
          boxShadow: "0 8px 26px rgba(27,42,87,.28), 0 0 0 1px rgba(255,255,255,.15)",
          overflow: "hidden"
        }}
      >
        <button
          type="button"
          onClick={handleInstall}
          aria-haspopup="dialog"
          aria-expanded={showGuide}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            minHeight: 44,
            padding: "0 14px 0 16px",
            border: "none",
            background: "transparent",
            color: "#FFFFFF",
            font: "600 13.5px/1 system-ui, -apple-system, sans-serif",
            cursor: "pointer",
            WebkitTapHighlightColor: "transparent"
          }}
          title="Install Leimarembi Foundation Application"
        >
          <Download size={16} aria-hidden="true" />
          <span>Install app</span>
        </button>

        <span style={{ width: "1px", height: "18px", background: "rgba(255,255,255,0.22)" }} aria-hidden="true" />

        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss app installation prompt for 14 days"
          title="Dismiss for 14 days"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 44,
            minWidth: 36,
            padding: "0 10px 0 8px",
            border: "none",
            background: "transparent",
            color: "rgba(255,255,255,0.75)",
            cursor: "pointer",
            transition: "color 0.15s"
          }}
        >
          <X size={15} />
        </button>
      </div>

      {showGuide && (
        <div
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowGuide(false);
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 12001,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            padding: "16px 12px max(16px, env(safe-area-inset-bottom))",
            background: "rgba(10,18,39,.58)",
            backdropFilter: "blur(5px)",
            WebkitBackdropFilter: "blur(5px)"
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="pwa-install-title"
            style={{
              width: "min(100%, 460px)",
              padding: "24px",
              borderRadius: 24,
              background: "var(--surface-color, #fff)",
              color: "var(--text-primary, #0f172a)",
              boxShadow: "0 24px 80px rgba(0,0,0,.26)",
              border: "1px solid var(--border-color, #e2e8f0)"
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 14,
                    background: "#eaf2ff",
                    color: "#1B2A57",
                    marginBottom: 14
                  }}
                >
                  <Smartphone size={23} aria-hidden="true" />
                </div>
                <h2
                  id="pwa-install-title"
                  style={{ margin: "0 0 8px", fontSize: 21, fontWeight: 800, lineHeight: 1.25, color: "inherit" }}
                >
                  Add Leimarembi to your home screen
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close install instructions"
                onClick={() => setShowGuide(false)}
                style={{
                  width: 36,
                  height: 36,
                  border: 0,
                  borderRadius: 10,
                  background: "transparent",
                  color: "inherit",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <X size={19} />
              </button>
            </div>

            {isIOS ? (
              <ol style={{ margin: "12px 0 20px", paddingLeft: 22, lineHeight: 1.8, color: "var(--text-secondary, #475569)", fontSize: "0.92rem" }}>
                <li>Open this website in <strong>Safari</strong> on your iPhone or iPad.</li>
                <li>Tap the <strong>Share</strong> icon <Share2 size={15} style={{ display: "inline", verticalAlign: "-2px" }} aria-label="Share" />.</li>
                <li>Choose <strong>Add to Home Screen</strong>, then tap <strong>Add</strong>.</li>
              </ol>
            ) : (
              <ol style={{ margin: "12px 0 20px", paddingLeft: 22, lineHeight: 1.8, color: "var(--text-secondary, #475569)", fontSize: "0.92rem" }}>
                <li>Open the website in <strong>Chrome</strong>.</li>
                <li>Tap the three-dot menu (⋮) in the browser.</li>
                <li>Choose <strong>Install app</strong> or <strong>Add to Home screen</strong>.</li>
              </ol>
            )}

            <p style={{ margin: "0 0 18px", fontSize: 13, lineHeight: 1.5, color: "var(--text-muted, #64748b)" }}>
              Installation adds a home-screen shortcut and fast standalone experience. It does not install an APK or IPA, and private member/officer workflows still require an active connection.
            </p>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                style={{
                  flex: 1,
                  minHeight: 46,
                  border: 0,
                  borderRadius: 12,
                  background: "#1B2A57",
                  color: "white",
                  fontWeight: 700,
                  fontSize: "14px",
                  cursor: "pointer"
                }}
              >
                Got it
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                style={{
                  minHeight: 46,
                  padding: "0 16px",
                  border: "1px solid var(--border-color, #cbd5e1)",
                  borderRadius: 12,
                  background: "transparent",
                  color: "var(--text-secondary, #475569)",
                  fontWeight: 600,
                  fontSize: "13px",
                  cursor: "pointer"
                }}
              >
                Don't show again
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
