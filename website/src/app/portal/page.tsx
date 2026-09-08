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
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';

export default function Portal() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; role: string; membershipNo: string } | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('lf_user');
    const token = localStorage.getItem('lf_token');
    if (!token) {
      router.push('/login');
      return;
    }
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {}
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('lf_token');
    localStorage.removeItem('lf_user');
    // Clear the cookie so middleware blocks re-entry
    document.cookie = 'lf_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax';
    router.push('/login');
  };

  const modules = [
    {
      title: "1. Official Website",
      desc: "Public-facing portal detailing vision, mission, activities, photo galleries, and news.",
      icon: <Globe size={40} />,
      color: "var(--primary-color)",
      link: "/"
    },
    {
      title: "2. Mobile Application",
      desc: "Digital membership cards, event notifications, online fee collection, and fast access via QR code.",
      icon: <Smartphone size={40} />,
      color: "var(--accent-color)",
      link: "/"
    },
    {
      title: "3. Management Software",
      desc: "Comprehensive tools for Member, Financial, Project, and Meeting Management.",
      icon: <Users size={40} />,
      color: "var(--secondary-color)",
      link: "/management"
    },
    {
      title: "4. Govt Grant Module",
      desc: "Tracking for Scheme Databases, Proposal Preparation, and PFMS Integration Records.",
      icon: <Landmark size={40} />,
      color: "#2B6CB0",
      link: "/grants"
    },
    {
      title: "5. Cultural Preservation",
      desc: "Manipuri Heritage Archive, Traditional Recipes, Oral History, and Song/Dance documentation.",
      icon: <Library size={40} />,
      color: "#D69E2E",
      link: "/culture"
    },
    {
      title: "6. Health and Welfare",
      desc: "Medical Camp Management, Senior Citizen Records, and Emergency Contact Database.",
      icon: <HeartPulse size={40} />,
      color: "#E53E3E",
      link: "/health"
    },
    {
      title: "7. Digital Library",
      desc: "Secure access to Trust Deeds, Bye-laws, Circulars, and Government Notifications.",
      icon: <BookOpen size={40} />,
      color: "#38A169",
      link: "/documents"
    },
    {
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
              <Link href={mod.link} className="btn" style={{ background: 'transparent', border: `1px solid ${mod.color}`, color: mod.color, padding: '0.4rem 1rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                Access Module
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
