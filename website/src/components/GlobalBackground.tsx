"use client";
import { useEffect, useState } from 'react';

export default function GlobalBackground() {
  const [bgIndex, setBgIndex] = useState(4); // Default to 4 (7 Sisters)

  useEffect(() => {
    // Randomly pick an image between 1 and 4 on every refresh
    const random = Math.floor(Math.random() * 4) + 1;
    setBgIndex(random);
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
      {/* Background Image with slow pan animation */}
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
      
      {/* Dark tint to ensure text readability */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(to bottom, rgba(10, 25, 47, 0.4), rgba(10, 25, 47, 0.8))', // Subtle gradient tint
        zIndex: 1
      }} />
    </div>
  );
}
