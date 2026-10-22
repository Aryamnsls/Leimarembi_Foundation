"use client";

import { useEffect, useState, useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShieldAlert, ShieldCheck, Lock, UserPlus, ArrowRight } from 'lucide-react';
import { isSuperAdmin } from '@/lib/superAdminAuth';

import { isPublicPath, isPrivateRoute } from '@/lib/routePolicy';

function isPublicRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  return isPublicPath(pathname);
}

export default function ClientRouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [mounted, setMounted] = useState<boolean>(false);
  const [authorized, setAuthorized] = useState<boolean>(true);
  const [checking, setChecking] = useState<boolean>(false);

  // ───────────────────────────────────────────────────────────
  // 1. ROUTE GUARD: Check authorization on every pathname change
  // ───────────────────────────────────────────────────────────
  useEffect(() => {
    setMounted(true);
    if (typeof window === 'undefined') return;

    // Public pages & utility routes are always accessible
    if (isPublicPath(pathname)) {
      setAuthorized(true);
      setChecking(false);
      return;
    }

    const token = localStorage.getItem('lf_token');
    const userStr = localStorage.getItem('lf_user');

    if (!token || !userStr) {
      // Unauthenticated visitor attempting to access private route
      setAuthorized(false);
      setChecking(false);

      const target = encodeURIComponent(
        pathname + (window.location.search || '')
      );
      router.replace(`/login?tab=login&redirect=${target}`);
      return;
    }

    // User is logged in: Check Super Admin restriction for /superadmin
    if (pathname === '/superadmin' || pathname.startsWith('/superadmin/')) {
      try {
        const u = JSON.parse(userStr);
        if (!isSuperAdmin(u)) {
          setAuthorized(false);
          setChecking(false);
          router.replace('/portal');
          return;
        }
      } catch {
        setAuthorized(false);
        setChecking(false);
        router.replace('/login?tab=login');
        return;
      }
    }

    // Authenticated member accessing private foundation pages
    setAuthorized(true);
    setChecking(false);
  }, [pathname, router]);

  // ───────────────────────────────────────────────────────────
  // 2. LINK CLICK INTERCEPTOR FOR UNAUTHENTICATED USERS
  // Intercepts clicks on private routes and routes visitor to login
  // ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleDocumentClick = (e: MouseEvent) => {
      // If user is already logged in, let normal navigation occur
      const token = localStorage.getItem('lf_token');
      if (token) return;

      // Find closest anchor tag
      const anchor = (e.target as HTMLElement)?.closest('a');
      if (!anchor) return;

      const rawHref = anchor.getAttribute('href');
      if (!rawHref) return;

      // Skip non-internal links, external protocols, hashes, and public routes
      if (
        rawHref.startsWith('http://') ||
        rawHref.startsWith('https://') ||
        rawHref.startsWith('mailto:') ||
        rawHref.startsWith('tel:') ||
        rawHref.startsWith('#') ||
        rawHref.startsWith('javascript:')
      ) {
        return;
      }

      // If clicking an internal link that is public, allow it freely
      if (isPublicPath(rawHref)) {
        return;
      }

      // If clicking a private route (e.g. /portal, /meetings, /documents, /management, /superadmin)
      // Intercept and route to Sign In with redirect param
      if (isPrivateRoute(rawHref)) {
        e.preventDefault();
        e.stopPropagation();

        const redirectTarget = encodeURIComponent(rawHref);
        startTransition(() => {
          router.push(`/login?tab=login&redirect=${redirectTarget}`);
        });
      }
    };

    document.addEventListener('click', handleDocumentClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleDocumentClick, { capture: true });
    };
  }, [router]);

  // SSR and initial hydration pass: always render children to guarantee exact SSR match
  if (!mounted) {
    return <>{children}</>;
  }

  // If on a public route (Welcome Page / Login / CRM), render directly
  if (isPublicRoute(pathname)) {
    return <>{children}</>;
  }

  // If authorized (logged-in member or super admin), render content
  if (authorized && !checking) {
    return <>{children}</>;
  }

  // If not authorized, show official verification / redirect screen
  return (
    <div 
      style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        textAlign: 'center'
      }}
    >
      <div 
        className="card animate-fade-in"
        style={{
          maxWidth: '480px',
          width: '100%',
          padding: '2.5rem 2rem',
          borderRadius: '24px',
          background: 'linear-gradient(145deg, #0F172A 0%, #1E293B 100%)',
          border: '2px solid rgba(245, 158, 11, 0.5)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5), 0 0 30px rgba(245, 158, 11, 0.2)',
          color: '#FFFFFF'
        }}
      >
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.25rem' }}>
          <Image 
            src="/leimarembi_official_logo.png" 
            alt="Foundation Crest" 
            width={72} 
            height={72} 
            style={{ borderRadius: '14px', objectFit: 'contain' }}
            priority
          />
          <div 
            style={{
              position: 'absolute',
              bottom: '-6px',
              right: '-6px',
              background: '#F59E0B',
              color: '#000000',
              borderRadius: '50%',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
            }}
          >
            <Lock size={14} />
          </div>
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '20px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid #F59E0B', marginBottom: '0.75rem' }}>
          <ShieldAlert size={14} style={{ color: '#F59E0B' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#FCD34D', letterSpacing: '1px', textTransform: 'uppercase' }}>
            Official Clearance Required
          </span>
        </div>

        <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#FFFFFF', margin: '0 0 0.5rem 0' }}>
          Member Access Clearance Required
        </h2>

        <p style={{ fontSize: '0.875rem', color: '#94A3B8', lineHeight: 1.6, margin: '0 0 1.5rem 0' }}>
          To access Foundation Governance, Executive Portals, Health Welfare, and Official Meeting Suites, please sign in with your credentials or register a new membership.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button
            onClick={() => router.push(`/login?tab=login&redirect=${encodeURIComponent(pathname)}`)}
            style={{
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: '#000000',
              padding: '0.85rem 1.5rem',
              borderRadius: '50px',
              fontWeight: 900,
              fontSize: '0.95rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 8px 20px rgba(245, 158, 11, 0.35)'
            }}
          >
            <ShieldCheck size={18} /> Sign In to Member Account <ArrowRight size={16} />
          </button>

          <button
            onClick={() => router.push(`/login?tab=register&redirect=${encodeURIComponent(pathname)}`)}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#E2E8F0',
              padding: '0.7rem 1.25rem',
              borderRadius: '50px',
              fontWeight: 700,
              fontSize: '0.85rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <UserPlus size={16} /> Need an account? Register New Membership
          </button>
        </div>
      </div>
    </div>
  );
}
