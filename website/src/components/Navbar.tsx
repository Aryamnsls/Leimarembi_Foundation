"use client";

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/i18n/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { 
  Moon, Sun, Menu, X, ArrowRight, Home, LayoutGrid, Info, Activity,
  BookOpen, LogIn, Heart, Users, Newspaper, 
  ImageIcon, FileText, Video, QrCode, ShieldCheck
} from 'lucide-react';
import Image from 'next/image';
import { isSuperAdmin, recordActivity, recordVisitorCheck } from '@/lib/superAdminAuth';
import { canSwitchRoleMode, isExecutiveOfficer } from '@/lib/executiveOfficers';

export default function Navbar() {
  const { t } = useTranslation();
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSuperAdminUser, setIsSuperAdminUser] = useState(false);
  const [canSwitch, setCanSwitch] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const lastScrollY = useRef(0);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const activeStyle = { color: 'var(--info-color)', fontWeight: 800 };

  // Mount effect to avoid SSR hydration mismatch
  // Website always defaults to light mode; user can toggle dark mode manually
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      if (localStorage.getItem('lf_token')) {
        setIsLoggedIn(true);
      }
      const userStr = localStorage.getItem('lf_user');
      if (userStr) {
        try {
          const u = JSON.parse(userStr);
          if (isSuperAdmin(u)) {
            setIsSuperAdminUser(true);
          }
          if (canSwitchRoleMode(u)) {
            setCanSwitch(true);
          }
          if (u.role === 'ADMIN' || isExecutiveOfficer(u)) {
            setIsAdminUser(true);
          }
        } catch {}
      }
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        // Respect user's explicit manual preference if they've toggled before
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
      } else {
        // Default to light mode always (ignore OS dark mode preference)
        setTheme('light');
        document.documentElement.setAttribute('data-theme', 'light');
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Handle scroll to hide/show navbar on scroll direction
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        if (isMenuOpen) {
          setShowNavbar(true);
          return;
        }
        if (window.scrollY > lastScrollY.current && window.scrollY > 120) {
          setShowNavbar(false);
        } else {
          setShowNavbar(true);
        }
        lastScrollY.current = window.scrollY;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMenuOpen]);

  // Lock HTML + Body scroll completely across all desktop & mobile touch devices when drawer is open
  useEffect(() => {
    if (isMenuOpen) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsMenuOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
  }, [isMenuOpen]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Record visitor check on route changes
  useEffect(() => {
    if (pathname && mounted) {
      recordVisitorCheck(pathname);
    }
  }, [pathname, mounted]);

  const handleLogout = () => {
    try {
      const userStr = localStorage.getItem('lf_user');
      if (userStr) {
        const u = JSON.parse(userStr);
        recordActivity({
          type: 'LOG_OUT',
          userName: u.name || 'Member',
          userEmail: u.email || 'N/A',
          userPhone: u.phone,
          membershipNo: u.membershipNo,
          bloodGroup: u.bloodGroup,
          isSeniorCitizen: u.isSeniorCitizen,
          provider: u.authProvider || 'LOCAL',
          details: `${u.name || 'Member'} officially logged out of the platform`,
          pageVisited: pathname,
          isRegistered: true,
          status: 'SUCCESS'
        });
      }
    } catch {}
    localStorage.removeItem('lf_token');
    localStorage.removeItem('lf_user');
    document.cookie = 'lf_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax';
    setIsLoggedIn(false);
    window.location.href = '/login';
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      {/* Top Header Bar (zIndex: 1000) */}
      <header 
        className="header animate-fade-in" 
        style={{ 
          transform: (showNavbar || isMenuOpen) ? 'translateY(0)' : 'translateY(-100%)', 
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          zIndex: 1000
        }}
      >
        <div className="header-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.3rem', width: '100%', maxWidth: '100%', padding: '0 0.75rem' }}>
          {/* Logo Identity */}
          <Link href="/" className="logo-container" onClick={closeMenu} style={{ marginRight: '0.4rem', flexShrink: 0 }}>
            <Image 
              src="/leimarembi_official_logo.png" 
              alt="Leimarembi Foundation Logo" 
              width={44} 
              height={44} 
              className="logo-img" 
              style={{ height: '44px', width: '44px', objectFit: 'contain', borderRadius: '8px' }} 
              priority 
            />
            <div className="logo-text" style={{ fontSize: '0.88rem' }}>
              LEIMAREMBI<br />
              <span style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--secondary-color)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                FOUNDATION
              </span>
            </div>
          </Link>
          
          {/* Desktop Navigation Links */}
          <nav aria-label="Main Navigation" className="desktop-nav" style={{ marginRight: 'auto', flexShrink: 1 }}>
            <ul className="nav-links" style={{ display: 'flex', gap: '1px', padding: 0, margin: 0 }}>
              <li><Link href="/" style={isActive('/') ? activeStyle : {}}>{t('nav.home')}</Link></li>
              <li><Link href="/portal" style={isActive('/portal') ? activeStyle : {}}>{t('nav.portal')}</Link></li>
              <li><Link href="/about" style={isActive('/about') ? activeStyle : {}}>{t('nav.about')}</Link></li>
              <li><Link href="/members" style={isActive('/members') ? activeStyle : {}}>{t('nav.members')}</Link></li>
              <li><Link href="/activities" style={isActive('/activities') ? activeStyle : {}}>{t('nav.activities')}</Link></li>
              <li><Link href="/news" style={isActive('/news') ? activeStyle : {}}>{t('nav.news')}</Link></li>
              <li><Link href="/gallery" style={isActive('/gallery') ? activeStyle : {}}>{t('nav.gallery')}</Link></li>
              <li><Link href="/culture" style={isActive('/culture') ? activeStyle : {}}>{t('nav.culture')}</Link></li>
              <li><Link href="/documents" style={isActive('/documents') ? activeStyle : {}}>{t('nav.documents')}</Link></li>
              <li><Link href="/meetings" style={isActive('/meetings') ? activeStyle : {}}>{t('nav.meetings')}</Link></li>
            </ul>
          </nav>
          
          {/* Action Bar */}
          <div className="desktop-action-bar" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0, marginLeft: 'auto' }}>
            {/* Native Language Switcher */}
            <div style={{ flexShrink: 0 }}>
              <LanguageSwitcher />
            </div>

            {/* Official QR Access Card Button */}
            <button 
              onClick={() => {
                sessionStorage.removeItem('welcomeShown');
                window.location.href = '/?qr=1';
              }}
              className="desktop-only-btn"
              style={{
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                color: '#000000',
                padding: '0.24rem 0.45rem',
                fontSize: '0.72rem',
                fontWeight: 900,
                minHeight: '30px',
                gap: '3px',
                borderRadius: '16px',
                border: 'none',
                boxShadow: '0 3px 10px rgba(245, 158, 11, 0.25)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
              title="Display & Share Executive QR Gateway Card"
            >
              <QrCode size={12} /> QR Card
            </button>

            {mounted && isLoggedIn ? (
              <button onClick={handleLogout} className="btn btn-outline desktop-only-btn" style={{ padding: '0.24rem 0.45rem', fontSize: '0.72rem', minHeight: '30px', gap: '3px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                <LogIn size={12} /> Sign Out
              </button>
            ) : (
              <Link href="/login" className="btn btn-outline desktop-only-btn" style={{ padding: '0.24rem 0.45rem', fontSize: '0.72rem', minHeight: '30px', gap: '3px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                <LogIn size={12} /> {t('nav.login')}
              </Link>
            )}

            {/* Role Switcher for Aryaman & Bina Babu Singha ONLY */}
            {mounted && canSwitch && (
              <div 
                className="desktop-only-btn" 
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  background: 'var(--surface-color)', 
                  borderRadius: '16px', 
                  border: '1.5px solid var(--secondary-color)', 
                  padding: '1px', 
                  gap: '1px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                  flexShrink: 0
                }}
              >
                <Link 
                  href="/superadmin" 
                  style={{ 
                    padding: '0.14rem 0.38rem', 
                    fontSize: '0.68rem', 
                    fontWeight: 800, 
                    borderRadius: '12px', 
                    textDecoration: 'none',
                    background: pathname.startsWith('/superadmin') ? 'var(--secondary-color)' : 'transparent',
                    color: pathname.startsWith('/superadmin') ? '#000000' : 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                    whiteSpace: 'nowrap'
                  }}
                  title="Super Admin Control Center"
                >
                  <ShieldCheck size={10} /> Super Admin
                </Link>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>⇄</span>
                <Link 
                  href="/management" 
                  style={{ 
                    padding: '0.14rem 0.38rem', 
                    fontSize: '0.68rem', 
                    fontWeight: 800, 
                    borderRadius: '12px', 
                    textDecoration: 'none',
                    background: pathname.startsWith('/management') ? 'var(--primary-color)' : 'transparent',
                    color: pathname.startsWith('/management') ? '#FFFFFF' : 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                    whiteSpace: 'nowrap'
                  }}
                  title="Admin Panel & Management Portal"
                >
                  Admin
                </Link>
              </div>
            )}

            {/* Standard Admin Panel Button for Other Executive Officers */}
            {mounted && !canSwitch && isAdminUser && (
              <Link 
                href="/management" 
                className="btn desktop-only-btn" 
                style={{ 
                  padding: '0.24rem 0.45rem', 
                  fontSize: '0.72rem', 
                  fontWeight: 800, 
                  minHeight: '30px', 
                  gap: '3px', 
                  whiteSpace: 'nowrap',
                  background: 'linear-gradient(135deg, rgba(27, 42, 87, 0.1) 0%, rgba(2, 132, 199, 0.15) 100%)',
                  border: '1.5px solid var(--info-color)',
                  color: 'var(--primary-color)',
                  flexShrink: 0
                }}
              >
                <ShieldCheck size={12} color="var(--info-color)" /> Admin Panel
              </Link>
            )}

            {/* Donate Button - ALWAYS VISIBLE */}
            <Link 
              href="/donate" 
              className="btn btn-primary desktop-only-btn" 
              style={{ 
                padding: '0.26rem 0.55rem', 
                fontSize: '0.74rem', 
                fontWeight: 800, 
                minHeight: '30px', 
                gap: '3px', 
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              {t('nav.donate')} <ArrowRight size={11} />
            </Link>
            
            {/* Dark/Light Mode Toggle - ALWAYS VISIBLE */}
            <button 
              onClick={toggleTheme} 
              style={{ 
                background: 'var(--surface-color)', 
                border: '1px solid var(--border-color)', 
                color: 'var(--text-primary)', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                width: '30px', 
                height: '30px', 
                borderRadius: '50%', 
                transition: 'all 0.2s ease', 
                flexShrink: 0 
              }}
              aria-label="Toggle Dark Mode"
              title="Toggle Light / Dark Mode"
            >
              {mounted && (theme === 'light' ? <Moon size={13} /> : <Sun size={13} />)}
            </button>

            {/* Mobile Hamburger Toggle Button */}
            <button 
              className="menu-toggle" 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              aria-label={isMenuOpen ? "Close menu" : "Open menu"} 
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Backdrop Overlay */}
      {isMenuOpen && (
        <div 
          onClick={closeMenu}
          onTouchMove={(e) => e.preventDefault()}
          onWheel={(e) => e.preventDefault()}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 10000,
            animation: 'fadeIn 0.2s ease'
          }}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer Panel */}
      <aside className={`mobile-drawer-panel ${isMenuOpen ? 'open' : ''}`} aria-label="Mobile Navigation Menu">
        {/* Drawer Header with Language Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.65rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Image src="/leimarembi_official_logo.png" alt="Logo" width={36} height={36} style={{ borderRadius: '6px', objectFit: 'contain' }} />
            <span style={{ fontWeight: 900, fontSize: '0.925rem', color: 'var(--primary-color)', letterSpacing: '0.5px' }}>
              Leimarembi Foundation
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              onClick={closeMenu} 
              style={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-primary)', flexShrink: 0 }}
              aria-label="Close Menu"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Primary Drawer Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <Link href="/" onClick={closeMenu} className="drawer-link" style={isActive('/') ? activeStyle : {}}>
            <Home size={16} /> {t('nav.home')}
          </Link>
          <Link href="/portal" onClick={closeMenu} className="drawer-link" style={isActive('/portal') ? activeStyle : {}}>
            <LayoutGrid size={16} /> {t('nav.portal')}
          </Link>
          <Link href="/about" onClick={closeMenu} className="drawer-link" style={isActive('/about') ? activeStyle : {}}>
            <Info size={16} /> {t('nav.about')}
          </Link>
          <Link href="/members" onClick={closeMenu} className="drawer-link" style={isActive('/members') ? activeStyle : {}}>
            <Users size={16} /> {t('nav.members')}
          </Link>
          <Link href="/activities" onClick={closeMenu} className="drawer-link" style={isActive('/activities') ? activeStyle : {}}>
            <Activity size={16} /> {t('nav.activities')}
          </Link>
          <Link href="/news" onClick={closeMenu} className="drawer-link" style={isActive('/news') ? activeStyle : {}}>
            <Newspaper size={16} /> {t('nav.news')}
          </Link>
          <Link href="/gallery" onClick={closeMenu} className="drawer-link" style={isActive('/gallery') ? activeStyle : {}}>
            <ImageIcon size={16} /> {t('nav.gallery')}
          </Link>
          <Link href="/culture" onClick={closeMenu} className="drawer-link" style={isActive('/culture') ? activeStyle : {}}>
            <BookOpen size={16} /> {t('nav.culture')}
          </Link>
          <Link href="/documents" onClick={closeMenu} className="drawer-link" style={isActive('/documents') ? activeStyle : {}}>
            <FileText size={16} /> {t('nav.documents')}
          </Link>
          <Link href="/meetings" onClick={closeMenu} className="drawer-link" style={isActive('/meetings') ? activeStyle : {}}>
            <Video size={16} /> {t('nav.meetings')}
          </Link>
        </div>
        
        {/* Drawer Action CTAs */}
        <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button 
            onClick={() => {
              sessionStorage.removeItem('welcomeShown');
              closeMenu();
              window.location.href = '/?qr=1';
            }}
            style={{
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: '#000000',
              padding: '0.65rem 1rem',
              borderRadius: '30px',
              fontWeight: 900,
              fontSize: '0.9rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)'
            }}
          >
            <QrCode size={18} /> Executive QR Access Card
          </button>

          {/* Role Switcher in Mobile Drawer for Aryaman & Bina Babu Singha ONLY */}
          {mounted && canSwitch && (
            <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
              <Link 
                href="/superadmin" 
                onClick={closeMenu}
                className="btn" 
                style={{ 
                  flex: 1,
                  padding: '0.65rem 0.5rem', 
                  fontSize: '0.8rem', 
                  fontWeight: 900, 
                  justifyContent: 'center', 
                  minHeight: '40px', 
                  gap: '6px',
                  background: pathname.startsWith('/superadmin') ? 'var(--secondary-color)' : 'rgba(212, 175, 55, 0.15)',
                  border: '1.5px solid var(--secondary-color)',
                  color: pathname.startsWith('/superadmin') ? '#000000' : 'var(--secondary-color)'
                }}
              >
                <ShieldCheck size={16} /> Super Admin
              </Link>
              <Link 
                href="/management" 
                onClick={closeMenu}
                className="btn" 
                style={{ 
                  flex: 1,
                  padding: '0.65rem 0.5rem', 
                  fontSize: '0.8rem', 
                  fontWeight: 900, 
                  justifyContent: 'center', 
                  minHeight: '40px', 
                  gap: '6px',
                  background: pathname.startsWith('/management') ? 'var(--primary-color)' : 'rgba(27, 42, 87, 0.15)',
                  border: '1.5px solid var(--info-color)',
                  color: pathname.startsWith('/management') ? '#FFFFFF' : 'var(--primary-color)'
                }}
              >
                Admin View
              </Link>
            </div>
          )}

          {/* Admin Panel Button for Other Executive Officers in Mobile Drawer */}
          {mounted && !canSwitch && isAdminUser && (
            <Link 
              href="/management" 
              onClick={closeMenu}
              className="btn" 
              style={{ 
                padding: '0.65rem 1rem', 
                fontSize: '0.875rem', 
                fontWeight: 900, 
                width: '100%', 
                justifyContent: 'center', 
                minHeight: '42px', 
                gap: '8px',
                background: 'linear-gradient(135deg, rgba(27, 42, 87, 0.1) 0%, rgba(2, 132, 199, 0.15) 100%)',
                border: '1.5px solid var(--info-color)',
                color: 'var(--primary-color)'
              }}
            >
              <ShieldCheck size={18} color="var(--info-color)" /> Executive Admin Panel
            </Link>
          )}

          {mounted && isLoggedIn ? (
            <button onClick={() => { handleLogout(); closeMenu(); }} className="btn btn-outline" style={{ padding: '0.55rem', fontSize: '0.875rem', width: '100%', justifyContent: 'center', minHeight: '42px', gap: '8px' }}>
              <LogIn size={16} /> Sign Out
            </button>
          ) : (
            <Link href="/login" className="btn btn-outline" style={{ padding: '0.55rem', fontSize: '0.875rem', width: '100%', justifyContent: 'center', minHeight: '42px', gap: '8px' }} onClick={closeMenu}>
              <LogIn size={16} /> {t('nav.login')}
            </Link>
          )}
          <Link href="/donate" className="btn btn-primary" style={{ padding: '0.65rem 1rem', fontSize: '0.9rem', width: '100%', justifyContent: 'center', minHeight: '44px', marginTop: '0.5rem', gap: '8px' }} onClick={closeMenu}>
            <Heart size={16} color="var(--secondary-color)" /> {t('nav.donate')} <ArrowRight size={16} />
          </Link>
        </div>
      </aside>

      <style jsx>{`
        @media (max-width: 1180px) {
          .desktop-nav {
            display: none !important;
          }
          .desktop-only-btn {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
