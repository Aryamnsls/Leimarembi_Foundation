"use client";

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/i18n/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { 
  Moon, Sun, Menu, X, ArrowRight, Home, LayoutGrid, Info, Activity,
  BookOpen, LogIn, Heart, Users, Newspaper, 
  ImageIcon, FileText 
} from 'lucide-react';
import Image from 'next/image';

export default function Navbar() {
  const { t } = useTranslation();
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const activeStyle = { color: 'var(--info-color)', fontWeight: 800 };

  // Mount effect to avoid SSR hydration mismatch
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
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
        <div className="container header-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          {/* Logo Identity */}
          <Link href="/" className="logo-container" onClick={closeMenu} style={{ marginRight: '0.5rem' }}>
            <Image 
              src="/logo_salai_taret.jpg" 
              alt="Leimarembi Foundation Logo" 
              width={36} 
              height={36} 
              className="logo-img" 
              style={{ height: '36px', width: 'auto' }} 
              priority 
            />
            <div className="logo-text" style={{ fontSize: '0.95rem' }}>
              LEIMAREMBEE<br />
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--secondary-color)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                FOUNDATION
              </span>
            </div>
          </Link>
          
          {/* Desktop Navigation Links */}
          <nav aria-label="Main Navigation" className="desktop-nav" style={{ marginRight: 'auto' }}>
            <ul className="nav-links" style={{ display: 'flex', gap: '0.25rem', padding: 0, margin: 0 }}>
              <li><Link href="/" style={isActive('/') ? activeStyle : {}}>{t('nav.home')}</Link></li>
              <li><Link href="/portal" style={isActive('/portal') ? activeStyle : {}}>{t('nav.portal')}</Link></li>
              <li><Link href="/about" style={isActive('/about') ? activeStyle : {}}>{t('nav.about')}</Link></li>
              <li><Link href="/members" style={isActive('/members') ? activeStyle : {}}>{t('nav.members')}</Link></li>
              <li><Link href="/activities" style={isActive('/activities') ? activeStyle : {}}>{t('nav.activities')}</Link></li>
              <li><Link href="/news" style={isActive('/news') ? activeStyle : {}}>{t('nav.news')}</Link></li>
              <li><Link href="/gallery" style={isActive('/gallery') ? activeStyle : {}}>{t('nav.gallery')}</Link></li>
              <li><Link href="/culture" style={isActive('/culture') ? activeStyle : {}}>{t('nav.culture')}</Link></li>
              <li><Link href="/documents" style={isActive('/documents') ? activeStyle : {}}>{t('nav.documents')}</Link></li>
            </ul>
          </nav>
          
          {/* Action Bar */}
          <div className="desktop-action-bar" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexShrink: 0, marginLeft: 'auto' }}>
            {/* Native Language Switcher */}
            <LanguageSwitcher />

            <Link href="/login" className="btn btn-outline desktop-only-btn" style={{ padding: '0.3rem 0.55rem', fontSize: '0.775rem', minHeight: '32px', gap: '4px', whiteSpace: 'nowrap' }}>
              <LogIn size={13} /> {t('nav.login')}
            </Link>
            <Link href="/donate" className="btn btn-primary desktop-only-btn" style={{ padding: '0.3rem 0.65rem', fontSize: '0.775rem', fontWeight: 800, minHeight: '32px', gap: '3px', whiteSpace: 'nowrap' }}>
              {t('nav.donate')} <ArrowRight size={12} />
            </Link>
            
            {/* Dark/Light Mode Toggle */}
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
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
              aria-label="Toggle Dark Mode"
              title="Toggle Light / Dark Mode"
            >
              {mounted && (theme === 'light' ? <Moon size={14} /> : <Sun size={14} />)}
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
            <Image src="/logo_salai_taret.jpg" alt="Logo" width={28} height={28} style={{ borderRadius: '6px' }} />
            <span style={{ fontWeight: 900, fontSize: '0.925rem', color: 'var(--primary-color)', letterSpacing: '0.5px' }}>
              Leimarembee Foundation
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
        </div>
        
        {/* Drawer Action CTAs */}
        <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
          <Link href="/login" className="btn btn-outline" style={{ padding: '0.55rem', fontSize: '0.875rem', width: '100%', justifyContent: 'center', minHeight: '42px', gap: '8px' }} onClick={closeMenu}>
            <LogIn size={16} /> {t('nav.login')}
          </Link>
          <Link href="/donate" className="btn btn-primary" style={{ padding: '0.65rem 1rem', fontSize: '0.9rem', width: '100%', justifyContent: 'center', minHeight: '44px', marginTop: '0.5rem', gap: '8px' }} onClick={closeMenu}>
            <Heart size={16} color="var(--secondary-color)" /> {t('nav.donate')} <ArrowRight size={16} />
          </Link>
        </div>
      </aside>

      <style jsx>{`
        @media (max-width: 1240px) {
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
