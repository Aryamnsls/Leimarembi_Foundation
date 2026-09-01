"use client";
import { useState, useEffect, useCallback } from 'react';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function WelcomeOverlay() {
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Check if we should show the overlay
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const isQrScan = searchParams.has('qr');
      const hasSeenWelcome = sessionStorage.getItem('welcomeShown');

      if (isQrScan || !hasSeenWelcome) {
        const timer = setTimeout(() => {
          setIsVisible(true);
          document.documentElement.style.overflow = 'hidden';
          document.body.style.overflow = 'hidden';
          document.body.style.touchAction = 'none';
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleEnter = useCallback(() => {
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

  // Handle Escape key
  useEffect(() => {
    if (isVisible) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleEnter();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isVisible, handleEnter]);

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
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(12px)',
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
            src="/logo_salai_taret.jpg" 
            alt="Leimarembee Foundation Logo" 
            width={72} 
            height={72} 
            style={{ margin: '0 auto', borderRadius: '12px' }}
            priority
          />
        </div>

        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--secondary-color)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
          Official Foundation Portal
        </span>

        <h2 id="welcome-title" style={{ fontSize: '1.85rem', fontWeight: 900, marginTop: '0.35rem', marginBottom: '0.75rem', color: 'var(--primary-color)' }}>
          Welcome to Leimarembee Foundation
        </h2>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem', marginInline: 'auto' }}>
          Empowering communities through digital governance, rural health welfare, indigenous culture preservation, and transparent grant tracking in Northeast India.
        </p>

        <button 
          onClick={handleEnter}
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', minHeight: '48px', fontSize: '1rem', gap: '8px' }}
        >
          Enter Official Platform <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
