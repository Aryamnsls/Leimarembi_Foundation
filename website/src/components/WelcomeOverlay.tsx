"use client";
import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

export default function WelcomeOverlay() {
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Check if we should show the overlay
    const searchParams = new URLSearchParams(window.location.search);
    const isQrScan = searchParams.has('qr');
    const hasSeenWelcome = sessionStorage.getItem('welcomeShown');

    // Show if they scanned the QR code OR if it's their first time this session
    if (isQrScan || !hasSeenWelcome) {
      setIsVisible(true);
      // Lock body scroll while overlay is active
      document.body.style.overflow = 'hidden';
    }
  }, []);

  const handleEnter = () => {
    setIsFadingOut(true);
    sessionStorage.setItem('welcomeShown', 'true');
    
    // Remove query param if it exists so it doesn't trigger on refresh
    if (window.history.replaceState) {
      const url = new URL(window.location.href);
      url.searchParams.delete('qr');
      window.history.replaceState(null, '', url.toString());
    }

    setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = 'auto'; // Restore scroll
    }, 800); // Wait for fade out animation
  };

  if (!isVisible) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(10, 25, 47, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isFadingOut ? 0 : 1,
        transition: 'opacity 0.8s ease-in-out',
        padding: '2rem',
        textAlign: 'center'
      }}
    >
      <div 
        className="welcome-content animate-fade-in-up"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2rem',
          maxWidth: '500px',
          transform: isFadingOut ? 'translateY(-20px)' : 'translateY(0)',
          transition: 'transform 0.8s ease-in-out'
        }}
      >
        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute',
            top: '-10px', left: '-10px', right: '-10px', bottom: '-10px',
            background: 'linear-gradient(135deg, #ECC94B, #FC8181)',
            borderRadius: '50%',
            filter: 'blur(20px)',
            opacity: 0.6,
            zIndex: 0,
            animation: 'pulse 3s infinite alternate'
          }} />
          <img 
            src="/welcome-girl.png" 
            alt="Khuramjari" 
            style={{ 
              width: '240px', 
              height: '240px', 
              objectFit: 'cover', 
              borderRadius: '50%',
              border: '4px solid #ECC94B',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              position: 'relative',
              zIndex: 1
            }} 
          />
        </div>

        <div>
          <h1 style={{ 
            color: '#ECC94B', 
            fontSize: '3rem', 
            fontWeight: 800, 
            marginBottom: '0.5rem',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)',
            lineHeight: 1.1
          }}>
            Khuramjari Mayamda
          </h1>
          <p style={{ color: 'white', fontSize: '1.25rem', opacity: 0.9 }}>
            Welcome to the Leimarembee Foundation.<br/>
            Access our resources, documents, and community services.
          </p>
        </div>

        <button 
          onClick={handleEnter}
          className="btn"
          style={{
            background: 'linear-gradient(135deg, #D69E2E, #DD6B20)',
            color: 'white',
            border: 'none',
            padding: '1rem 2.5rem',
            fontSize: '1.1rem',
            fontWeight: 700,
            borderRadius: '50px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 15px rgba(221, 107, 32, 0.4)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          Enter Website <ChevronRight size={20} />
        </button>
      </div>
      
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.1); opacity: 0.8; }
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
