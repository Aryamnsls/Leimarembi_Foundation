"use client";

import { useEffect, useState } from 'react';
import { 
  Globe, 
  Smartphone, 
  Users, 
  Landmark, 
  Library, 
  HeartPulse, 
  BookOpen, 
  BrainCircuit,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  LogIn,
  UserCheck
} from 'lucide-react';
import Link from 'next/link';
import { getAuthUser } from '@/lib/api';

export default function ServicesPortal() {
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const user = getAuthUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const modules = [
    {
      title: "1. Official Website",
      desc: "Public-facing portal detailing vision, mission, activities, photo galleries, and news.",
      icon: <Globe size={32} />,
      color: "var(--primary-color)",
      link: "/",
      cta: "Explore Website"
    },
    {
      title: "2. Digital Membership Card",
      desc: "Instant digital membership credential, official ID, status verification, and member privileges.",
      icon: <CreditCard size={32} />,
      color: "var(--accent-color)",
      link: currentUser ? "/portal/dashboard" : "/login?tab=register",
      cta: currentUser ? "View My Card" : "Register as Member"
    },
    {
      title: "3. Management Software",
      desc: "Comprehensive executive administrative software for Member, Financial, Welfare, and Security Audit.",
      icon: <Users size={32} />,
      color: "var(--secondary-color)",
      link: "/management",
      cta: "Executive Portal"
    },
    {
      title: "4. Govt Grant Module",
      desc: "Proposal tracking for Scheme Databases, Proposal Preparation, and PFMS Integration Records.",
      icon: <Landmark size={32} />,
      color: "#2B6CB0",
      link: "/grants",
      cta: "View Grant Tracker"
    },
    {
      title: "5. Cultural Preservation",
      desc: "Manipuri Heritage Archive, Traditional Recipes, Oral History, and Song/Dance documentation.",
      icon: <Library size={32} />,
      color: "#D69E2E",
      link: "/culture",
      cta: "Explore Archive"
    },
    {
      title: "6. Health and Welfare",
      desc: "Medical Camp Management, Senior Citizen Records, and Community Emergency Assistance.",
      icon: <HeartPulse size={32} />,
      color: "#E53E3E",
      link: "/health",
      cta: "Health Initiatives"
    },
    {
      title: "7. Digital Library",
      desc: "Secure tiered access to Trust Deeds, Bye-laws, Circulars, and Government Notifications.",
      icon: <BookOpen size={32} />,
      color: "#38A169",
      link: "/documents",
      cta: "Access Documents"
    },
    {
      title: "8. Artificial Intelligence",
      desc: "Foundation AI Chat Assistant, Multilingual Queries, and Document Intelligence.",
      icon: <BrainCircuit size={32} />,
      color: "#805AD5",
      link: "/ai",
      cta: "Launch AI Hub"
    }
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0 4rem' }}>
      {/* Header Banner */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div 
          className="glass-panel" 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '0.4rem 1.25rem', 
            borderRadius: '30px', 
            marginBottom: '1rem',
            border: '1px solid var(--border-color)'
          }}
        >
          <ShieldCheck size={16} color="var(--secondary-color)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--secondary-color)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            Foundation Platform Architecture
          </span>
        </div>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 900, margin: '0 0 0.75rem', color: 'var(--primary-color)' }}>
          Digital Services & Platform Modules
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', maxWidth: '740px', margin: '0 auto', lineHeight: 1.6 }}>
          Explore the 8 integrated modules comprising the Leimarembi Foundation Digital Governance & Community Development Platform.
        </p>

        {/* Dynamic CTA for Logged-in vs Anonymous Visitors */}
        <div style={{ marginTop: '1.75rem', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {currentUser ? (
            <Link 
              href={['SUPER_ADMIN', 'ADMIN', 'TRUSTEE', 'STAFF'].includes(currentUser.role) ? '/management' : '/portal/dashboard'} 
              className="btn btn-primary" 
              style={{ padding: '0.75rem 1.75rem', fontSize: '0.95rem', gap: '8px' }}
            >
              <UserCheck size={18} />
              <span>Go to My Dashboard ({currentUser.name || currentUser.email})</span>
              <ArrowRight size={16} />
            </Link>
          ) : (
            <>
              <Link href="/login" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem', gap: '8px' }}>
                <LogIn size={18} />
                <span>Member Portal Login</span>
              </Link>
              <Link href="/login?tab=register" className="btn btn-outline" style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}>
                Register as Member
              </Link>
            </>
          )}
        </div>
      </div>

      {/* 8 Public Modules Directory Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {modules.map((mod, i) => (
          <div 
            key={i} 
            className="card" 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              borderTop: `4px solid ${mod.color}`,
              padding: '1.75rem'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '1.25rem' }}>
                <div style={{ background: 'var(--bg-color)', padding: '10px', borderRadius: '12px', color: mod.color, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)' }}>
                  {mod.icon}
                </div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-color)' }}>{mod.title}</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                {mod.desc}
              </p>
            </div>
            
            <Link 
              href={mod.link}
              className="btn btn-outline"
              style={{
                width: '100%',
                justifyContent: 'center',
                gap: '6px',
                fontSize: '0.85rem',
                fontWeight: 700
              }}
            >
              <span>{mod.cta}</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
