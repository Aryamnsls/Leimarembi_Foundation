"use client";

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Moon, Sun, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [theme, setTheme] = useState('light');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const activeStyle = { color: 'var(--secondary-color)', fontWeight: 700 };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY.current && window.scrollY > 100) {
          // Scrolling down & past 100px
          setShowNavbar(false);
        } else {
          // Scrolling up or at the top
          setShowNavbar(true);
        }
        lastScrollY.current = window.scrollY;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header 
      className="header animate-fade-in" 
      style={{ 
        top: showNavbar ? '0' : '-100px', 
        transition: 'top 0.3s ease-in-out' 
      }}
    >
      <div className="container header-content">
        <Link href="/" className="logo-container" onClick={() => setIsMenuOpen(false)}>
          <img src="/logo_salai_taret.jpg" alt="Leimarembi Foundation Logo" className="logo-img" style={{ borderRadius: '8px', border: '1px solid var(--border-color)' }} />
          <div className="logo-text" style={{ fontWeight: 900 }}>
            LEIMAREMBEE<br />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '2px', textTransform: 'uppercase' }}>
              FOUNDATION
            </span>
          </div>
        </Link>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: 'auto' }}>
          <nav>
            <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`} style={{ alignItems: 'center' }}>
              <li><Link href="/" onClick={() => setIsMenuOpen(false)} style={isActive('/') ? activeStyle : {}}>Home</Link></li>
              <li><Link href="/portal" onClick={() => setIsMenuOpen(false)} style={isActive('/portal') ? activeStyle : {}}>Services Portal</Link></li>
              <li><Link href="/about" onClick={() => setIsMenuOpen(false)} style={isActive('/about') ? activeStyle : {}}>About Us</Link></li>
              <li><Link href="/members" onClick={() => setIsMenuOpen(false)} style={isActive('/members') ? activeStyle : {}}>Members</Link></li>
              <li><Link href="/activities" onClick={() => setIsMenuOpen(false)} style={isActive('/activities') ? activeStyle : {}}>Activities</Link></li>
              <li><Link href="/documents" onClick={() => setIsMenuOpen(false)} style={isActive('/documents') ? activeStyle : {}}>Documents</Link></li>
              <li><Link href="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem', color: '#1A202C !important', fontWeight: 700 }} onClick={() => setIsMenuOpen(false)}>Login</Link></li>
              <li><a href="#" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }} onClick={() => setIsMenuOpen(false)}>Donate</a></li>
            </ul>
          </nav>
          
          <button 
            onClick={toggleTheme} 
            style={{ 
              background: 'var(--bg-color)', 
              border: '1px solid var(--border-color)', 
              color: 'var(--text-primary)', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              padding: '0.5rem',
              borderRadius: '50%',
              transition: 'all 0.3s',
              zIndex: 100
            }}
            aria-label="Toggle Dark Mode"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle Menu" style={{ zIndex: 100 }}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>
    </header>
  );
}
