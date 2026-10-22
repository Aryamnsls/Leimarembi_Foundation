"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShieldCheck,
  ShieldAlert,
  Landmark,
  Users,
  Heart,
  Activity,
  FileText,
  Video,
  Award,
  LogOut,
  ExternalLink,
  Globe,
  Moon,
  Sun,
  Key,
  ChevronDown,
  Sparkles,
  Search,
  Lock,
  Layers,
  Database
} from 'lucide-react';
import { canSwitchRoleMode, isExecutiveOfficer } from '@/lib/executiveOfficers';
import { isSuperAdmin, recordActivity } from '@/lib/superAdminAuth';
import SessionManagementModal from './SessionManagementModal';

interface CrmTopNavProps {
  currentUser: any;
  activeTab?: 'DONATIONS' | 'MEMBERS' | 'OFFICERS' | 'ACTIVITY';
  onTabChange?: (tab: 'DONATIONS' | 'MEMBERS' | 'OFFICERS' | 'ACTIVITY') => void;
  counts?: {
    donations?: number;
    members?: number;
    officers?: number;
    activity?: number;
  };
  onSwitchAccount?: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export default function CrmTopNav({
  currentUser,
  activeTab = 'DONATIONS',
  onTabChange,
  counts,
  onSwitchAccount,
  searchQuery,
  onSearchChange
}: CrmTopNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [theme, setTheme] = useState('light');
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const officerBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const active = document.documentElement.getAttribute('data-theme') || localStorage.getItem('theme') || 'light';
    setTheme(active);
    document.documentElement.setAttribute('data-theme', active);

    const handleThemeChange = () => {
      const current = document.documentElement.getAttribute('data-theme') || localStorage.getItem('theme') || 'light';
      setTheme(current);
    };

    window.addEventListener('storage', handleThemeChange);
    window.addEventListener('theme-change', handleThemeChange);
    return () => {
      window.removeEventListener('storage', handleThemeChange);
      window.removeEventListener('theme-change', handleThemeChange);
    };
  }, []);

  const toggleTheme = () => {
    const current = document.documentElement.getAttribute('data-theme') || theme;
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.setAttribute('data-theme', next);
    window.dispatchEvent(new Event('theme-change'));
  };

  const handleLogout = () => {
    try {
      if (currentUser) {
        recordActivity({
          type: "LOG_OUT",
          userName: currentUser.name || "Administrator",
          userEmail: currentUser.email || "admin@leimarembifoundation.org",
          userPhone: currentUser.phone || "",
          membershipNo: currentUser.membershipNo || "",
          bloodGroup: currentUser.bloodGroup || "",
          isSeniorCitizen: Boolean(currentUser.isSeniorCitizen),
          provider: "LOCAL",
          details: "Officer Signed Out of Management CRM Suite",
        });
      }
    } catch {}

    localStorage.removeItem('lf_token');
    localStorage.removeItem('lf_user');
    localStorage.removeItem('admin_auth');
    document.cookie = "lf_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = '/login?tab=login';
  };

  const isSuper = isSuperAdmin(currentUser);
  const isOfficer = isExecutiveOfficer(currentUser);

  // Officer initials
  const initials = (currentUser?.name || 'AD')
    .split(' ')
    .filter(Boolean)
    .map((p: string) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 9999,
          background: 'var(--surface-color)',
          borderBottom: '1.5px solid var(--border-color)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          paddingTop: 'env(safe-area-inset-top)',
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)'
        }}
      >
        {/* Top Utility Ribbon */}
        <div className="crm-top-ribbon" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.65rem 1.25rem',
          gap: '1rem',
          flexWrap: 'nowrap'
        }}>
          {/* Left: Organization & CRM Identity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <Link
              href="/management"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
              title="Foundation Governance CRM"
            >
              <Image
                src="/leimarembi_official_logo.png"
                alt="Foundation Crest"
                width={36}
                height={36}
                className="crm-logo-img"
                style={{ borderRadius: '10px', objectFit: 'contain', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', flexShrink: 0 }}
                priority
              />
              <div style={{ flexShrink: 0 }}>
                <span className="crm-brand-title" style={{ fontWeight: 900, fontSize: '0.96rem', color: 'var(--primary-color)', letterSpacing: '0.5px', lineHeight: 1.1, display: 'block' }}>
                  LEIMAREMBI <span className="crm-brand-suffix">FOUNDATION</span>
                </span>
                <div className="crm-org-subtext" style={{ marginTop: '2px' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--secondary-color)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                    Digital Governance Portal
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Center: Quick Governance Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }} className="crm-nav-center">
            <Link
              href="/documents"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '0.35rem 0.65rem',
                borderRadius: '12px',
                background: 'var(--bg-color)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '0.74rem',
                fontWeight: 700,
                textDecoration: 'none'
              }}
              title="Restricted Internal Governance Vault"
            >
              <FileText size={13} color="var(--info-color)" /> Documents Vault
            </Link>

            <Link
              href="/meetings"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '0.35rem 0.65rem',
                borderRadius: '12px',
                background: 'var(--bg-color)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '0.74rem',
                fontWeight: 700,
                textDecoration: 'none'
              }}
              title="Meeting Management Suite & Video Portal"
            >
              <Video size={13} color="#10B981" /> Meeting Suite
            </Link>

            <Link
              href="/grants"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '0.35rem 0.65rem',
                borderRadius: '12px',
                background: 'var(--bg-color)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '0.74rem',
                fontWeight: 700,
                textDecoration: 'none'
              }}
              title="Government Scheme Pipeline & PFMS Tracker"
            >
              <Landmark size={13} color="var(--secondary-color)" /> Grants Tracker
            </Link>
          </nav>

          {/* Right: Actions, Officer Profile & Session */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, marginLeft: 'auto' }}>
            {/* Super Admin Switcher */}
            {canSwitchRoleMode(currentUser) && (
              <Link
                href={pathname.startsWith('/superadmin') ? '/management' : '/superadmin'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '16px',
                  fontSize: '0.74rem',
                  fontWeight: 900,
                  textDecoration: 'none',
                  background: pathname.startsWith('/superadmin')
                    ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.2) 0%, rgba(2, 132, 199, 0.1) 100%)'
                    : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                  color: pathname.startsWith('/superadmin') ? 'var(--info-color)' : '#000000',
                  border: pathname.startsWith('/superadmin') ? '1px solid var(--info-color)' : 'none',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
                title={pathname.startsWith('/superadmin') ? 'Switch to Management Portal' : 'Switch to Super Admin Radar'}
              >
                {pathname.startsWith('/superadmin') ? '🏛️ Admin Portal' : '👑 Super Admin View'}
              </Link>
            )}

            {/* Quick Vault / Meetings Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowQuickMenu(!showQuickMenu)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '0.35rem 0.55rem',
                  borderRadius: '14px',
                  background: 'var(--bg-color)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
                title="Quick Governance Launchers"
              >
                <Layers size={14} color="var(--secondary-color)" /> <span className="crm-btn-text">Modules</span> <ChevronDown size={12} className="crm-btn-text" />
              </button>

              {showQuickMenu && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 6px)',
                    background: 'var(--surface-color)',
                    border: '1.5px solid var(--border-color)',
                    borderRadius: '16px',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
                    padding: '0.5rem',
                    minWidth: '220px',
                    zIndex: 10020,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <Link
                    href="/documents"
                    onClick={() => setShowQuickMenu(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '10px',
                      color: 'var(--text-primary)',
                      textDecoration: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 700
                    }}
                  >
                    <FileText size={15} color="var(--info-color)" /> Documents Vault
                  </Link>

                  <Link
                    href="/meetings"
                    onClick={() => setShowQuickMenu(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '10px',
                      color: 'var(--text-primary)',
                      textDecoration: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 700
                    }}
                  >
                    <Video size={15} color="#10B981" /> Meeting Management Suite
                  </Link>

                  <Link
                    href="/grants"
                    onClick={() => setShowQuickMenu(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '10px',
                      color: 'var(--text-primary)',
                      textDecoration: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 700
                    }}
                  >
                    <Landmark size={15} color="var(--secondary-color)" /> PFMS Grants Tracker
                  </Link>

                  <div style={{ height: '1px', background: 'var(--border-color)', margin: '4px 0' }} />

                  <Link
                    href="/"
                    onClick={() => setShowQuickMenu(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '10px',
                      color: 'var(--text-secondary)',
                      textDecoration: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}
                  >
                    <Globe size={15} /> View Public Website
                  </Link>
                </div>
              )}
            </div>

            {/* Public Website Button */}
            <Link
              href="/"
              className="crm-public-site-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '0.35rem 0.65rem',
                borderRadius: '14px',
                background: 'var(--bg-color)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-secondary)',
                fontSize: '0.74rem',
                fontWeight: 700,
                textDecoration: 'none'
              }}
              title="Open Public Website Homepage"
            >
              <Globe size={13} /> Public Site
            </Link>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              style={{
                background: 'var(--bg-color)',
                border: '1px solid var(--border-color)',
                borderRadius: '14px',
                padding: '0.35rem 0.55rem',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Toggle Dark/Light Mode"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={14} color="#F59E0B" /> : <Moon size={14} color="#64748B" />}
            </button>

            {/* Officer Profile & Session Pill */}
            <button
              ref={officerBtnRef}
              onClick={() => setShowSessionModal((prev) => !prev)}
              aria-expanded={showSessionModal}
              aria-haspopup="dialog"
              className="crm-officer-capsule"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '2px 8px 2px 3px',
                borderRadius: '20px',
                minHeight: '30px',
                maxHeight: '32px',
                background: isSuper
                  ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.05) 100%)'
                  : 'linear-gradient(135deg, rgba(2, 132, 199, 0.12) 0%, rgba(2, 132, 199, 0.04) 100%)',
                border: isSuper ? '1.5px solid #F59E0B' : '1.5px solid var(--info-color)',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                transition: 'all 0.18s ease'
              }}
              title={`Active Officer: ${currentUser?.name || 'Administrator'} (${isSuper ? 'SUPER ADMIN' : isOfficer ? (currentUser?.designation || 'OFFICER') : 'ADMIN'})`}
            >
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: isSuper ? '#F59E0B' : 'var(--info-color)',
                color: isSuper ? '#000000' : '#FFFFFF',
                fontSize: '0.64rem',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {initials}
              </div>

              <div className="crm-officer-info" style={{ textAlign: 'left', lineHeight: 1.05 }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUser?.name || 'Administrator'}
                </div>
                <div style={{ fontSize: '0.55rem', color: isSuper ? '#D97706' : 'var(--info-color)', fontWeight: 800, letterSpacing: '0.2px' }}>
                  {isSuper ? 'SUPER ADMIN' : isOfficer ? (currentUser?.designation || 'OFFICER') : 'ADMIN'}
                </div>
              </div>

              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10B981', display: 'inline-block', flexShrink: 0 }} />
            </button>

            {/* Prominent Direct Logout Button */}
            <button
              onClick={() => {
                if (confirm(`Sign out and end management session for ${currentUser?.name || 'Administrator'}?`)) {
                  handleLogout();
                }
              }}
              className="crm-logout-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '0.35rem 0.75rem',
                borderRadius: '14px',
                background: 'rgba(220, 38, 38, 0.1)',
                border: '1.5px solid rgba(220, 38, 38, 0.4)',
                color: '#DC2626',
                fontSize: '0.74rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
              title="Sign Out of Session"
            >
              <LogOut size={13} /> <span className="crm-btn-text">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Scoped Responsive Styles */}
      <style jsx>{`
        @media (max-width: 1080px) {
          :global(.crm-nav-center) {
            display: none !important;
          }
        }
        @media (max-width: 860px) {
          :global(.crm-officer-capsule .crm-officer-info > div:first-child) {
            max-width: 72px !important;
          }
        }
        @media (max-width: 768px) {
          :global(.crm-top-ribbon) {
            padding: 0.45rem 0.65rem !important;
            gap: 0.35rem !important;
          }
          :global(.crm-org-subtext) {
            display: none !important;
          }
          :global(.crm-public-site-btn) {
            display: none !important;
          }
          :global(.crm-officer-info) {
            display: none !important;
          }
          :global(.crm-officer-capsule) {
            padding: 2px 4px 2px 3px !important;
          }
        }
        @media (max-width: 580px) {
          :global(.crm-btn-text) {
            display: none !important;
          }
          :global(.crm-brand-suffix) {
            display: none !important;
          }
          :global(.crm-brand-title) {
            font-size: 0.88rem !important;
          }
          :global(.crm-logo-img) {
            width: 28px !important;
            height: 28px !important;
          }
          :global(.crm-logout-btn) {
            padding: 0.3rem 0.5rem !important;
          }
        }
      `}</style>

      {/* Interactive Session Management Context Popover */}
      <SessionManagementModal
        isOpen={showSessionModal}
        onClose={() => setShowSessionModal(false)}
        currentUser={currentUser}
        onLogout={handleLogout}
        onSwitchAccount={onSwitchAccount}
        anchorRef={officerBtnRef}
      />
    </>
  );
}
