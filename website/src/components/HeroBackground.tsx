"use client";
import { useEffect, useState } from 'react';

export default function HeroBackground({ children }: { children: React.ReactNode }) {
  const [bgIndex, setBgIndex] = useState(1);

  useEffect(() => {
    // Randomly pick an image between 1 and 3 on every refresh
    const random = Math.floor(Math.random() * 3) + 1;
    setBgIndex(random);
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
      {/* Background Image with slow pan animation to simulate a GIF */}
      <div 
        className="hero-bg-anim"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(/bg${bgIndex}.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
        }}
      />
      
      {/* Deep Navy Gradient Overlay for Text Readability */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(to bottom, rgba(10, 25, 47, 0.7), rgba(10, 25, 47, 0.9))',
        zIndex: 1
      }} />
      
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, width: '100%' }}>
        {children}
      </div>
    </section>
  );
}
