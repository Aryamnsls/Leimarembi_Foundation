"use client";

import { useState, useEffect, useCallback } from 'react';
import { ChevronRight, QrCode, Share2, Copy, Check, ShieldCheck, Sparkles, X, Smartphone } from 'lucide-react';
import Image from 'next/image';
import QRCode from 'react-qr-code';

import { EMBLEM_LOGO_BASE64 } from '@/data/emblemLogoBase64';

export default function WelcomeOverlay() {
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [step, setStep] = useState<'qr' | 'welcome'>('qr');
  const [copiedLink, setCopiedLink] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string>('https://leimarembi.org');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      setCurrentUrl(`${origin}?qr=1`);

      const searchParams = new URLSearchParams(window.location.search);
      const isQrScan = searchParams.has('qr');
      const hasSeenWelcome = sessionStorage.getItem('welcomeShown');

      if (isQrScan || !hasSeenWelcome) {
        const timer = setTimeout(() => {
          setIsVisible(true);
          setStep('qr');
          document.documentElement.style.overflow = 'hidden';
          document.body.style.overflow = 'hidden';
          document.body.style.touchAction = 'none';
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleProceedToWelcome = () => {
    setStep('welcome');
  };

  const handleEnterPlatform = useCallback(() => {
    setIsFadingOut(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('welcomeShown', 'true');
      if (window.history.replaceState) {
        const url = new URL(window.location.href);
        url.searchParams.delete('qr');
        window.history.replaceState(null, '', url.toString());
      }
    }

    setTimeout(() => {
      setIsVisible(false);
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }, 500);
  }, []);

  const handleCopyUrl = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(currentUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleWhatsAppShare = () => {
    if (typeof window !== 'undefined') {
      const text = encodeURIComponent(
        `🏛️ *LEIMAREMBI FOUNDATION - OFFICIAL DIGITAL GOVERNANCE PORTAL*\n\n` +
        `Scan the official QR Code or tap the link below to access Executive Board Meetings, News Hub, Member Roster & Governance Archives:\n\n` +
        `🔗 ${currentUrl}`
      );
      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    }
  };

  const handleDownloadKeyringQR = () => {
    if (typeof window !== 'undefined') {
      const svg = document.getElementById('foundation-qr-code-svg');
      if (!svg) return;
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = document.createElement('img');
      img.onload = () => {
        canvas.width = 1000;
        canvas.height = 1000;
        if (ctx) {
          // 1. Draw rounded white card background
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.roundRect(0, 0, 1000, 1000, 80);
          ctx.fill();
          
          // 2. Draw gold rounded border matching user screenshot
          ctx.strokeStyle = '#F59E0B';
          ctx.lineWidth = 24;
          ctx.beginPath();
          ctx.roundRect(12, 12, 976, 976, 75);
          ctx.stroke();
          
          // 3. Draw QR Code matrix
          ctx.drawImage(img, 120, 120, 760, 760);

          // 4. Draw Central White Circle Badge
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(500, 500, 110, 0, 2 * Math.PI);
          ctx.fill();

          // 5. Draw Official Production Emblem Logo Badge
          const logoImg = document.createElement('img');
          let downloaded = false;
          const triggerDownload = () => {
            if (downloaded) return;
            downloaded = true;
            try {
              ctx.drawImage(logoImg, 390, 390, 220, 220);
            } catch (e) {
              console.error('Logo draw error:', e);
            }
            const pngUrl = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.href = pngUrl;
            downloadLink.download = 'Leimarembi_Foundation_Keyring_QR_300DPI.png';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
          };

          logoImg.onload = triggerDownload;
          logoImg.src = EMBLEM_LOGO_BASE64;
          if (logoImg.complete) {
            triggerDownload();
          }
        }
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    }
  };

  // Handle Escape key
  useEffect(() => {
    if (isVisible) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleEnterPlatform();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isVisible, handleEnterPlatform]);

  if (!isVisible) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(16px)',
        padding: '1.5rem',
        opacity: isFadingOut ? 0 : 1,
        transition: 'opacity 0.5s ease-in-out'
      }}
      onTouchMove={(e) => e.preventDefault()}
      onWheel={(e) => e.preventDefault()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
    >
      {/* STEP 1: EXECUTIVE QR CODE GATEWAY SCREEN */}
      {step === 'qr' && (
        <div 
          className="card animate-fade-in"
          style={{
            maxWidth: '480px',
            width: '100%',
            textAlign: 'center',
            padding: '2.25rem 2rem',
            borderRadius: '28px',
            background: 'linear-gradient(145deg, #0F172A 0%, #1E293B 100%)',
            border: '2px solid rgba(245, 158, 11, 0.4)',
            boxShadow: '0 30px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(245, 158, 11, 0.2)',
            position: 'relative',
            color: '#FFFFFF'
          }}
        >
          {/* Top Metallic Security Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '1.25rem' }}>
            <ShieldCheck size={18} style={{ color: '#F59E0B' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#F59E0B', letterSpacing: '2px', textTransform: 'uppercase' }}>
              OFFICIAL EXECUTIVE QR GATEWAY
            </span>
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, margin: '0 0 0.5rem 0', color: '#FFFFFF' }}>
            Leimarembi Foundation
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#94A3B8', margin: '0 0 1.5rem 0' }}>
            Scan QR Code or Tap to Enter Digital Governance Suite
          </p>

          {/* DYNAMIC QR CODE DISPLAY BOX WITH EMBEDDED LOGO BADGE */}
          <div 
            onClick={handleProceedToWelcome}
            style={{
              position: 'relative',
              background: '#FFFFFF',
              padding: '1.5rem',
              borderRadius: '24px',
              display: 'inline-block',
              margin: '0 auto 1.5rem',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4)',
              cursor: 'pointer',
              border: '4px solid #F59E0B',
              transition: 'transform 0.3s ease, boxShadow 0.3s ease'
            }}
            title="Click or Scan QR Code to Unlock Platform"
          >
            {/* Holographic Laser Scan Line */}
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, transparent, #06B6D4, #F59E0B, transparent)',
                boxShadow: '0 0 12px #06B6D4',
                animation: 'scanBeam 2.5s infinite ease-in-out'
              }}
            />

            <QRCode 
              id="foundation-qr-code-svg"
              value={currentUrl} 
              size={200}
              level="H"
              fgColor="#0F172A"
              bgColor="#FFFFFF"
            />

            {/* Central Foundation Logo Badge overlay in center of QR */}
            <div 
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: '#FFFFFF',
                borderRadius: '50%',
                padding: '5px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px'
              }}
            >
              <Image 
                src="/leimarembi_official_logo.png" 
                alt="Foundation Seal" 
                width={36} 
                height={36} 
                style={{ borderRadius: '50%', objectFit: 'contain' }}
              />
            </div>
          </div>

          <div style={{ fontSize: '0.78rem', color: '#CBD5E1', marginBottom: '1.5rem', fontWeight: 700 }}>
            🔒 Verified Digital Gateway • Click QR Code or Button to Unlock
          </div>

          {/* ACTION BUTTONS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <button 
              onClick={handleProceedToWelcome}
              style={{
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                color: '#000000',
                padding: '0.85rem 1.5rem',
                borderRadius: '50px',
                fontWeight: 900,
                fontSize: '1rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 10px 25px rgba(245, 158, 11, 0.4)'
              }}
            >
              <QrCode size={20} /> Scan & Enter Official Platform <ChevronRight size={18} />
            </button>

            <button
              onClick={handleDownloadKeyringQR}
              style={{
                background: 'rgba(14, 165, 233, 0.15)',
                border: '1px solid rgba(14, 165, 233, 0.4)',
                color: '#38BDF8',
                padding: '0.7rem 1.25rem',
                borderRadius: '30px',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Smartphone size={16} /> 🖨️ Download Printable Keyring QR (300 DPI)
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button 
                onClick={handleWhatsAppShare}
                style={{
                  background: 'rgba(37, 211, 102, 0.15)',
                  border: '1px solid rgba(37, 211, 102, 0.4)',
                  color: '#25D366',
                  padding: '0.65rem 1rem',
                  borderRadius: '30px',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Share2 size={16} /> Share WhatsApp
              </button>

              <button 
                onClick={handleCopyUrl}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  padding: '0.65rem 1rem',
                  borderRadius: '30px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                {copiedLink ? <Check size={16} style={{ color: '#10B981' }} /> : <Copy size={16} />}
                {copiedLink ? "Link Copied!" : "Copy Portal Link"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: WELCOME MESSAGE SCREEN */}
      {step === 'welcome' && (
        <div 
          className="card animate-fade-in"
          style={{
            maxWidth: '520px',
            width: '100%',
            textAlign: 'center',
            padding: '2.5rem 2rem',
            borderRadius: '24px',
            background: 'var(--surface-color)',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <div style={{ marginBottom: '1.25rem' }}>
            <Image 
              src="/leimarembi_logo_new.jpeg" 
              alt="Leimarembi Foundation Logo" 
              width={110} 
              height={110} 
              style={{ margin: '0 auto', borderRadius: '12px', objectFit: 'contain' }}
              priority
            />
          </div>

          <span className="golden-label" style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px' }}>
            Official Foundation Portal
          </span>

          <h2 id="welcome-title" style={{ fontSize: '1.65rem', fontWeight: 900, marginTop: '0.35rem', marginBottom: '0.15rem', color: '#1B2A57', lineHeight: 1.3, letterSpacing: '0.08em', wordSpacing: '0.1em' }}>
            WELCOME TO LEIMAREMBI<br />FOUNDATION
          </h2>

          <h3 style={{ fontSize: '1.4rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '0.75rem', marginTop: '0.25rem', letterSpacing: '0.5px' }}>
            ꯂꯩꯃꯔꯦꯝꯕꯤ ꯐꯥꯎꯟꯗꯦꯁꯟ
          </h3>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem', marginInline: 'auto' }}>
            Empowering communities through digital governance, rural health welfare, indigenous culture preservation, and transparent grant tracking in Northeast India.
          </p>

          <button 
            onClick={handleEnterPlatform}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', minHeight: '48px', fontSize: '1rem', gap: '8px' }}
          >
            Enter Official Platform <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Laser Scan Keyframe Animation */}
      <style jsx global>{`
        @keyframes scanBeam {
          0% { top: 5%; opacity: 0.3; }
          50% { top: 90%; opacity: 1; }
          100% { top: 5%; opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
