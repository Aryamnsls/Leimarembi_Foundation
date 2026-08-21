"use client";
import { useEffect, useState } from 'react';

export default function HeroBackground({ children }: { children: React.ReactNode }) {
  const [bgUrl, setBgUrl] = useState<string>('');

  useEffect(() => {
    async function fetchUnsplashImage() {
      try {
        const res = await fetch('/api/unsplash');
        if (res.ok) {
          const data = await res.json();
          if (data.url) setBgUrl(data.url);
        }
      } catch (err) {
        console.error('Failed loading hero background:', err);
      }
    }
    fetchUnsplashImage();
  }, []);

  return (
    <section style={{ 
      padding: '8rem 0', 
      textAlign: 'center',
      position: 'relative',
      color: 'white',
      borderRadius: '0 0 24px 24px',
      marginBottom: '4rem',
      boxShadow: 'var(--shadow-md)',
      overflow: 'hidden',
      minHeight: '600px',
      display: 'flex',
      alignItems: 'center'
    }}>
      {/* Background Image — only render once Unsplash URL is loaded */}
      {bgUrl && (
        <div 
          className="hero-bg-anim"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${bgUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'opacity 1.5s ease-in-out',
            filter: 'brightness(1.15) contrast(1.1) saturate(1.4)',
            zIndex: 0,
          }}
        />
      )}
      
      {/* Lighter overlay so image shines through */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(to bottom, rgba(5, 15, 30, 0.2), rgba(5, 15, 30, 0.65))',
        zIndex: 1
      }} />
      
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, width: '100%' }}>
        {children}
      </div>
    </section>
  );
}

