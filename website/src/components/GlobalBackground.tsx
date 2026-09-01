"use client";

export default function GlobalBackground() {
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: 'var(--bg-color)'
      }}
    >
      {/* Soft Multi-Tonal Atmospheric Orbs (Subtle in light, muted in dark) */}
      <div 
        style={{
          position: 'absolute',
          top: '-15%',
          right: '-5%',
          width: '55vw',
          height: '55vw',
          maxHeight: '650px',
          maxWidth: '650px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.04) 0%, transparent 70%)',
          filter: 'blur(50px)'
        }} 
      />

      <div 
        style={{
          position: 'absolute',
          top: '20%',
          left: '-10%',
          width: '50vw',
          height: '50vw',
          maxHeight: '600px',
          maxWidth: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(22, 163, 74, 0.03) 0%, transparent 70%)',
          filter: 'blur(50px)'
        }} 
      />

      {/* Micro-Dot Mesh */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.15,
          backgroundImage: `radial-gradient(var(--text-muted) 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }} 
      />
    </div>
  );
}
