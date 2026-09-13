"use client";

import { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

export default function ScrollToTop() {
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      if (window.scrollY > 250) {
        setIsScrolledDown(true);
      } else {
        setIsScrolledDown(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSlideAction = () => {
    if (isScrolledDown) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      window.scrollBy({
        top: window.innerHeight * 0.75,
        behavior: 'smooth'
      });
    }
  };

  if (!mounted) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9990,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none' // outer container doesn't block clicks
      }}
    >
      <button
        onClick={handleSlideAction}
        className="animate-fade-in"
        style={{
          pointerEvents: 'auto',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 18px',
          borderRadius: '50px',
          background: 'rgba(15, 23, 42, 0.88)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.22)',
          color: '#FFFFFF',
          fontSize: '0.82rem',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          whiteSpace: 'nowrap'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.06)';
          e.currentTarget.style.background = 'rgba(2, 132, 199, 0.95)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.background = 'rgba(15, 23, 42, 0.88)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.22)';
        }}
        aria-label={isScrolledDown ? "Slide back to top" : "Slide down"}
        title={isScrolledDown ? "Slide to top" : "Slide down page"}
      >
        {isScrolledDown ? (
          <>
            <ArrowUp size={15} style={{ animation: 'bounceTop 1.8s infinite' }} />
            <span>Slide to Top</span>
          </>
        ) : (
          <>
            <ArrowDown size={15} style={{ animation: 'bounceDown 1.8s infinite' }} />
            <span>Slide Down</span>
          </>
        )}
      </button>
    </div>
  );
}

