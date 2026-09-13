"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Globe, 
  Smartphone, 
  Users, 
  Landmark, 
  Library, 
  HeartPulse, 
  BookOpen, 
  BrainCircuit,
  LogOut,
  UserCircle,
  ShieldCheck,
  X,
  Clock,
  AlertCircle,
  CheckCircle2,
  QrCode,
  Bell,
  CreditCard
} from 'lucide-react';
import Link from 'next/link';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function Portal() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; role: string; membershipNo: string } | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showMobileModal, setShowMobileModal] = useState(false);

  useEffect(() => {
    async function verifyUserInDB() {
      const token = localStorage.getItem('lf_token');
      if (!token) {
        // Not logged in -> redirect to Sign In first
        router.push('/login?tab=login');
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => null);
        
        if (res && res.ok) {
          const data = await res.json().catch(() => null);
          if (data && data.data) {
            setUser(data.data);
            localStorage.setItem('lf_user', JSON.stringify(data.data));
            setCheckingAuth(false);
            return;
          }
        }
      } catch (e) {
        // Network failure / offline fallback if local storage exists
        const userStr = localStorage.getItem('lf_user');
        if (userStr) {
          try {
            setUser(JSON.parse(userStr));
            setCheckingAuth(false);
            return;
          } catch {}
        }
      }

      // Token invalid or user not found in DB -> clear & redirect to Sign In
      localStorage.removeItem('lf_token');
      localStorage.removeItem('lf_user');
      document.cookie = 'lf_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax';
      router.push('/login?tab=login');
    }

    verifyUserInDB();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('lf_token');
    localStorage.removeItem('lf_user');
    // Clear cookie
    document.cookie = 'lf_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax';
    router.push('/login?tab=login');
  };

  if (checkingAuth) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div className="card" style={{ padding: "2.5rem 3rem", textAlign: "center", borderRadius: "24px", maxWidth: "420px", width: "100%", boxShadow: "var(--shadow-lg)" }}>
          <div className="spin" style={{ width: "40px", height: "40px", border: "4px solid var(--border-color)", borderTopColor: "var(--primary-color)", borderRadius: "50%", margin: "0 auto 1.5rem" }} />
          <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--primary-color)", margin: "0 0 0.5rem" }}>
            Verifying Member Access...
          </h3>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", margin: 0 }}>
            Checking your session with the Leimarembi database.
          </p>
        </div>
      </div>
    );
  }

  const modules = [
    {
      title: "1. Official Website",
      desc: "Public-facing portal detailing vision, mission, activities, photo galleries, and news.",
      icon: <Globe size={40} />,
      color: "var(--primary-color)",
      link: "/"
    },
    {
      id: "mobile-app",
      title: "2. Mobile Application",
      desc: "Digital membership cards, event notifications, online fee collection, and fast access via QR code.",
      icon: <Smartphone size={40} />,
      color: "#DC2626", // Matching red outline from user screenshot
      link: "#",
      isComingSoon: true,
      buttonText: "Coming Soon"
    },
    {
      id: "management",
      title: "3. Management Software",
      desc: "Comprehensive tools for Member, Financial, Project, and Meeting Management.",
      icon: <Users size={40} />,
      color: "var(--secondary-color)",
      link: "/management"
    },
    {
      id: "grants",
      title: "4. Govt Grant Module",
      desc: "Tracking for Scheme Databases, Proposal Preparation, and PFMS Integration Records.",
      icon: <Landmark size={40} />,
      color: "#2B6CB0",
      link: "/grants"
    },
    {
      id: "culture",
      title: "5. Cultural Preservation",
      desc: "Manipuri Heritage Archive, Traditional Recipes, Oral History, and Song/Dance documentation.",
      icon: <Library size={40} />,
      color: "#D69E2E",
      link: "/culture"
    },
    {
      id: "health",
      title: "6. Health and Welfare",
      desc: "Medical Camp Management, Senior Citizen Records, and Emergency Contact Database.",
      icon: <HeartPulse size={40} />,
      color: "#E53E3E",
      link: "/health"
    },
    {
      id: "documents",
      title: "7. Digital Library",
      desc: "Secure access to Trust Deeds, Bye-laws, Circulars, and Government Notifications.",
      icon: <BookOpen size={40} />,
      color: "#38A169",
      link: "/documents"
    },
    {
      id: "ai",
      title: "8. Artificial Intelligence",
      desc: "Future Phase: AI Chat Assistant, Automatic Meeting Minutes, and Translation services.",
      icon: <BrainCircuit size={40} />,
      color: "#805AD5",
      link: "/ai"
    }
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '3rem 0' }}>
      
      {/* User Profile Banner */}
      {user && (
        <div style={{
          background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--info-color) 100%)',
          borderRadius: '16px',
          padding: '1.5rem 2rem',
          marginBottom: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: 'var(--shadow-lg)',
          color: '#fff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              width: '52px',
              height: '52px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <UserCircle size={32} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, opacity: 0.8, letterSpacing: '1px', textTransform: 'uppercase' }}>
                Signed in as
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800 }}>{user.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.8rem', opacity: 0.85 }}>{user.email}</span>
                {user.membershipNo && (
                  <span style={{
                    background: 'rgba(255,255,255,0.25)',
                    borderRadius: '20px',
                    padding: '1px 8px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <ShieldCheck size={11} /> {user.membershipNo}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255,255,255,0.18)',
              border: '1.5px solid rgba(255,255,255,0.5)',
              color: '#fff',
              borderRadius: '10px',
              padding: '0.55rem 1.25rem',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(4px)',
              flexShrink: 0
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.32)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.18)';
            }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      )}

      {/* Portal Header */}
      <div className="glass-panel" style={{ textAlign: 'center', marginBottom: '4rem', display: 'block', margin: '0 auto 4rem', maxWidth: '800px' }}>
        <span style={{ color: 'var(--secondary-color)', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase' }}>
          LFDGCDP Command Center
        </span>
        <h1 style={{ fontSize: '2.8rem', marginTop: '1rem', marginBottom: '1rem' }}>Services Portal</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', margin: '0 auto' }}>
          Welcome to the comprehensive Digital Governance Dashboard. Select a module below to access management tools, records, and services.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
        {modules.map((mod, i) => (
          <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column', borderTop: `4px solid ${mod.color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1.5rem', color: mod.color }}>
              <div style={{ background: 'var(--bg-color)', padding: '12px', borderRadius: '12px' }}>
                {mod.icon}
              </div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)' }}>{mod.title}</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', flex: 1, marginBottom: '1.5rem' }}>{mod.desc}</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              {mod.isComingSoon ? (
                <button
                  onClick={() => setShowMobileModal(true)}
                  className="btn"
                  style={{ 
                    background: 'rgba(220, 38, 38, 0.08)', 
                    border: `1.5px solid ${mod.color}`, 
                    color: mod.color, 
                    padding: '0.4rem 1.25rem', 
                    fontSize: '0.9rem', 
                    cursor: 'pointer',
                    fontWeight: 800,
                    borderRadius: '8px'
                  }}
                >
                  Coming Soon
                </button>
              ) : (
                <Link href={mod.link} className="btn" style={{ background: 'transparent', border: `1px solid ${mod.color}`, color: mod.color, padding: '0.4rem 1rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                  Access Module
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* OFFICIAL MOBILE APPLICATION STATUS MODAL */}
      {showMobileModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(6px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
          onClick={() => setShowMobileModal(false)}
        >
          <div 
            style={{
              background: 'var(--surface-color)',
              width: '100%',
              maxWidth: '560px',
              borderRadius: '28px',
              overflow: 'hidden',
              border: '1px solid var(--border-color)',
              boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
              animation: 'scaleUp 0.25s ease-out'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ padding: '1.5rem 2rem', background: 'linear-gradient(135deg, #1E293B, #0F172A)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Smartphone size={24} style={{ color: '#E11D48' }} />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF' }}>
                    2. Mobile Application
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                    Official Deployment Status Notification
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setShowMobileModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '2rem' }}>
              {/* Feature Highlights */}
              <div style={{ background: 'var(--bg-color)', padding: '1.25rem', borderRadius: '18px', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
                <p style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  Digital membership cards, event notifications, online fee collection, and fast access via QR code.
                </p>
              </div>

              {/* Official Government / Trust Status Banner */}
              <div style={{ background: 'rgba(220, 38, 38, 0.08)', border: '1px solid rgba(220, 38, 38, 0.25)', borderRadius: '18px', padding: '1.25rem', marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#DC2626', fontWeight: 900, fontSize: '0.9rem', marginBottom: '8px' }}>
                  <Clock size={18} /> Official Status: Phase II Active Development
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  <strong>Notice of Technical Deployment:</strong> This governance module is currently undergoing security compliance auditing, multi-platform synchronization, and database integration by the Technical Directorate.
                </p>
                <p style={{ margin: '8px 0 0 0', fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                  Full public release for iOS & Android mobile devices will be enabled in the upcoming Phase II launch.
                </p>
              </div>

              {/* Upcoming Mobile Capabilities List */}
              <div style={{ marginBottom: '1.75rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '0.75rem' }}>
                  Planned Mobile Capabilities:
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 700 }}>
                    <QrCode size={16} style={{ color: '#E11D48' }} /> Digital QR Cards
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 700 }}>
                    <Bell size={16} style={{ color: '#E11D48' }} /> Event Push Alerts
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 700 }}>
                    <CreditCard size={16} style={{ color: '#E11D48' }} /> Online Fee Gateway
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 700 }}>
                    <CheckCircle2 size={16} style={{ color: '#10B981' }} /> Fast Pass Scanner
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowMobileModal(false)}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', borderRadius: '50px', padding: '0.85rem', fontWeight: 800, fontSize: '0.95rem' }}
              >
                Acknowledge & Close Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
