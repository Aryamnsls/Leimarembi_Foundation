"use client";
import { useEffect, useState } from 'react';

export default function GlobalBackground() {
  const [bgUrl, setBgUrl] = useState<string>('');
  const [photographerInfo, setPhotographerInfo] = useState<{ name?: string; url?: string }>({});

  useEffect(() => {
    async function fetchUnsplashImage() {
      try {
        const res = await fetch('/api/unsplash');
        if (res.ok) {
          const data = await res.json();
          if (data.url) {
            setBgUrl(data.url);
            if (data.photographer) {
              setPhotographerInfo({ name: data.photographer, url: data.photographerUrl });
            }
          }
        }
      } catch (err) {
        console.error('Failed loading background image:', err);
      }
    }
    fetchUnsplashImage();
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: -1, // Sits behind all content
      overflow: 'hidden'
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
      
      {/* Subtle tint — lighter so image shines through */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(to bottom, rgba(5, 15, 30, 0.15), rgba(5, 15, 30, 0.55))',
        zIndex: 1
      }} />

      {/* Unsplash Attribution badge (if loaded from Unsplash) */}
      {photographerInfo.name && (
        <div style={{
          position: 'absolute',
          bottom: '12px',
          right: '16px',
          zIndex: 2,
          fontSize: '0.75rem',
          color: 'rgba(255, 255, 255, 0.7)',
          background: 'rgba(0, 0, 0, 0.4)',
          padding: '4px 8px',
          borderRadius: '4px',
          backdropFilter: 'blur(4px)'
        }}>
          Photo by{' '}
          <a
            href={`${photographerInfo.url}?utm_source=leimarembi_foundation&utm_medium=referral`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#fff', textDecoration: 'underline' }}
          >
            {photographerInfo.name}
          </a>{' '}
          on{' '}
          <a
            href="https://unsplash.com/?utm_source=leimarembi_foundation&utm_medium=referral"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#fff', textDecoration: 'underline' }}
          >
            Unsplash
          </a>
        </div>
      )}
    </div>
  );
}

