import Link from 'next/link';
import { Home, ShieldAlert, HelpCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '65vh',
      textAlign: 'center',
      padding: '2rem 1rem',
      position: 'relative'
    }}>
      <div style={{
        maxWidth: '560px',
        width: '100%',
        padding: '3rem 2rem',
        borderRadius: '24px',
        background: 'var(--surface-color-solid)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Top Glow Accent */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, var(--primary-color), var(--secondary-color))'
        }} />

        {/* 404 Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '0.4rem 1rem',
          borderRadius: '999px',
          background: 'rgba(217, 119, 6, 0.1)',
          border: '1px solid rgba(217, 119, 6, 0.25)',
          color: 'var(--secondary-color)',
          fontSize: '0.875rem',
          fontWeight: 800,
          marginBottom: '1.5rem'
        }}>
          <ShieldAlert size={18} />
          <span>PAGE NOT FOUND</span>
        </div>

        {/* 404 Large Heading */}
        <h1 style={{
          fontSize: '4.5rem',
          fontWeight: 900,
          lineHeight: 1,
          margin: 0,
          background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-2px'
        }}>
          404
        </h1>

        <h2 style={{
          fontSize: '1.35rem',
          fontWeight: 800,
          color: 'var(--text-primary)',
          marginTop: '1rem',
          marginBottom: '0.75rem'
        }}>
          Oops! The requested page doesn&apos;t exist.
        </h2>

        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '0.925rem',
          lineHeight: 1.6,
          marginBottom: '2rem',
          maxWidth: '420px',
          marginInline: 'auto'
        }}>
          The URL you entered may be misspelled, restricted to authorized executives, or the page may have been relocated.
        </p>

        {/* Navigation Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.75rem',
          flexWrap: 'wrap'
        }}>
          <Link
            href="/"
            className="btn btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0.65rem 1.4rem',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '0.875rem'
            }}
          >
            <Home size={16} /> Return to Home
          </Link>

          <Link
            href="/login"
            className="btn btn-outline"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0.65rem 1.3rem',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '0.875rem'
            }}
          >
            <HelpCircle size={16} /> Executive Login
          </Link>
        </div>
      </div>
    </div>
  );
}
