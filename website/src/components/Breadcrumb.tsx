"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumb() {
  const pathname = usePathname();

  if (pathname === '/') return null; // Don't show breadcrumb on home page

  const pathSegments = pathname.split('/').filter(Boolean);

  const routeNameMap: Record<string, string> = {
    about: 'About Us',
    activities: 'Activities & Projects',
    ai: 'AI Heritage Assistant',
    contact: 'Contact Us',
    culture: 'Cultural Heritage Archive',
    documents: 'Digital Library & Documents',
    donate: 'Support & Donation Checkout',
    gallery: 'Media Archive',
    grants: 'PFMS Grant Tracker',
    health: 'Rural Healthcare Camps',
    login: 'Account Login',
    management: 'Admin Portal',
    members: 'Executive Committee',
    news: 'News & Announcements',
    portal: 'Services Portal',
    register: 'Member Registration'
  };

  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
      <ol style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.4rem', 
        listStyle: 'none', 
        padding: '0.35rem 0.85rem', 
        margin: 0, 
        background: 'var(--surface-color)', 
        borderRadius: '20px', 
        border: '1px solid var(--border-color)', 
        fontSize: '0.825rem',
        boxShadow: 'var(--shadow-sm)',
        flexWrap: 'wrap'
      }}>
        <li>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontWeight: 600 }}>
            <Home size={14} color="var(--info-color)" /> Home
          </Link>
        </li>

        {pathSegments.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
          const isLast = index === pathSegments.length - 1;
          const label = routeNameMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

          return (
            <li key={href} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <ChevronRight size={13} color="var(--text-muted)" />
              {isLast ? (
                <span style={{ color: 'var(--primary-color)', fontWeight: 800 }} aria-current="page">
                  {label}
                </span>
              ) : (
                <Link href={href} style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
