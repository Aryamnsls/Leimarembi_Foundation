"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  User, Shield, CreditCard, Heart, FileText, Calendar, 
  Clock, CheckCircle2, AlertCircle, LogOut, ChevronRight,
  Droplets, Phone, Mail, MapPin, RefreshCw, Send, HelpCircle,
  Activity, Users, Award, BookOpen, ExternalLink, Sparkles
} from "lucide-react";
import { api, getAuthUser, logoutUser } from "@/lib/api";

import Image from "next/image";

export default function MemberDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'CARD' | 'WELFARE' | 'DOCS' | 'ACTIVITIES'>('OVERVIEW');

  // Member-specific data
  const [cardData, setCardData] = useState<any>(null);
  const [welfareRequests, setWelfareRequests] = useState<any[]>([]);
  const [newWelfareType, setNewWelfareType] = useState('MEDICAL');
  const [newWelfareAmount, setNewWelfareAmount] = useState('');
  const [newWelfareDesc, setNewWelfareDesc] = useState('');
  const [submittingWelfare, setSubmittingWelfare] = useState(false);
  const [welfareSuccess, setWelfareSuccess] = useState('');
  const [welfareError, setWelfareError] = useState('');

  useEffect(() => {
    const user = getAuthUser();
    if (!user) {
      router.push("/login?redirect=/portal/dashboard");
      return;
    }
    // If administrative role enters /portal/dashboard, allow them to view or navigate to management
    setCurrentUser(user);
    fetchDashboardData(user);
  }, [router]);

  const fetchDashboardData = async (user: any) => {
    setLoading(true);
    try {
      // 1. Fetch live user profile
      const meRes = await api.get('/auth/me').catch(() => null);
      if (meRes?.data) {
        setCurrentUser(meRes.data);
      }

      // 2. Fetch Digital ID card if member/core_member/trustee
      if (user.status === 'ACTIVE' && user.role !== 'REGISTERED_USER') {
        const cardRes = await api.get(`/members/${user.id}/card`).catch(() => null);
        if (cardRes?.data) {
          setCardData(cardRes.data);
        }
      }

      // 3. Fetch personal welfare claims
      const welRes = await api.get('/welfare/my-requests').catch(() => null);
      if (welRes?.data?.requests) {
        setWelfareRequests(welRes.data.requests);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWelfare = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingWelfare(true);
    setWelfareError('');
    setWelfareSuccess('');
    try {
      const res = await api.post('/welfare', {
        type: newWelfareType,
        amountRequested: newWelfareAmount ? Number(newWelfareAmount) : undefined,
        description: newWelfareDesc,
        requesterName: currentUser?.name || 'Member',
        requesterPhone: currentUser?.phone || undefined,
        requesterEmail: currentUser?.email || undefined
      });
      setWelfareSuccess('Your welfare assistance request has been submitted to the Executive Committee for review.');
      setNewWelfareDesc('');
      setNewWelfareAmount('');
      // Refresh my requests
      const welRes = await api.get('/welfare/my-requests').catch(() => null);
      if (welRes?.data?.requests) {
        setWelfareRequests(welRes.data.requests);
      }
    } catch (err: any) {
      setWelfareError(err.message || 'Failed to submit welfare request');
    } finally {
      setSubmittingWelfare(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    router.push('/login');
  };

  if (loading && !currentUser) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', background: 'var(--bg-color)' }}>
        <RefreshCw className="animate-spin" size={36} color="var(--secondary-color)" />
        <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Loading your authenticated dashboard...</p>
      </div>
    );
  }

  const isRegisteredUser = currentUser?.role === 'REGISTERED_USER';
  const isVolunteer = currentUser?.role === 'VOLUNTEER';
  const isCoreMember = currentUser?.role === 'CORE_MEMBER';
  const isExecutive = ['SUPER_ADMIN', 'ADMIN', 'TRUSTEE', 'STAFF'].includes(currentUser?.role);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-color)', display: 'flex', flexDirection: 'column' }}>
      
      {/* ─── DEDICATED TOP APP BAR (STANDALONE PORTAL) ─── */}
      <header style={{
        background: 'var(--surface-color)',
        borderBottom: '1px solid var(--border-color)',
        padding: '0.75rem 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
              <Image 
                src="/leimarembi_official_logo.png" 
                alt="Logo" 
                width={36} 
                height={36} 
                style={{ borderRadius: '8px', objectFit: 'contain' }} 
              />
              <div style={{ lineHeight: 1.1 }}>
                <span style={{ fontWeight: 900, fontSize: '0.95rem', color: 'var(--primary-color)', letterSpacing: '0.5px' }}>
                  LEIMAREMBI
                </span>
                <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: 'var(--secondary-color)', letterSpacing: '1px' }}>
                  MEMBER PORTAL
                </span>
              </div>
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link 
              href="/"
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--text-secondary)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '0.4rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                textDecoration: 'none'
              }}
            >
              ← Back to Main Website
            </Link>

            {isExecutive && (
              <Link 
                href="/management" 
                className="btn btn-primary"
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', gap: '6px' }}
              >
                <Shield size={13} /> Management
              </Link>
            )}

            <button 
              onClick={handleLogout}
              className="btn btn-outline"
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', gap: '6px', color: '#EF4444', borderColor: 'rgba(239,68,68,0.3)' }}
            >
              <LogOut size={13} /> Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* ─── MAIN PORTAL BODY CONTAINER ─── */}
      <main style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '1.5rem 1.5rem 4rem', flex: 1 }}>
        <div className="animate-fade-in">
      
      {/* ─── 1. AUTHENTICATED DASHBOARD HEADER ─── */}
      <div 
        className="card" 
        style={{ 
          padding: '1.5rem 2rem', 
          borderRadius: '20px', 
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, var(--surface-color-solid) 0%, rgba(2, 132, 199, 0.05) 100%)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: '1.4rem',
            boxShadow: 'var(--shadow-sm)',
            flexShrink: 0
          }}>
            {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'LF'}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--primary-color)', margin: 0 }}>
                Welcome, {currentUser?.name}
              </h1>
              <span style={{
                padding: '0.2rem 0.65rem',
                borderRadius: '999px',
                fontSize: '0.725rem',
                fontWeight: 800,
                background: isExecutive ? 'rgba(217, 119, 6, 0.12)' : isCoreMember ? 'rgba(139, 92, 246, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                color: isExecutive ? '#D97706' : isCoreMember ? '#8B5CF6' : '#10B981',
                border: '1px solid currentColor'
              }}>
                {currentUser?.role}
              </span>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: '4px 0 0' }}>
              Membership No: <strong style={{ color: 'var(--secondary-color)', fontFamily: 'monospace' }}>{currentUser?.membershipNo || 'LF-PENDING'}</strong> • Status: <strong style={{ color: currentUser?.status === 'ACTIVE' ? '#10B981' : '#EF4444' }}>{currentUser?.status}</strong>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {isExecutive && (
            <Link 
              href="/management" 
              className="btn btn-primary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.825rem', gap: '6px' }}
            >
              <Shield size={14} /> Open Management Console
            </Link>
          )}
        </div>
      </div>

      {/* ─── 2. ROLE-SPECIFIC NOTICES ─── */}
      {isRegisteredUser && (
        <div style={{
          padding: '1.25rem 1.5rem',
          borderRadius: '16px',
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h3 style={{ color: '#D97706', margin: '0 0 0.25rem', fontSize: '1.05rem', fontWeight: 800 }}>
              Membership Verification in Progress
            </h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.875rem' }}>
              Your account is currently registered. The executive committee is reviewing your details to issue your full Lifetime Digital Membership Credential.
            </p>
          </div>
          <Link href="/contact" className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem' }}>
            Contact Foundation
          </Link>
        </div>
      )}

      {/* ─── 3. TAB NAVIGATION ─── */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '2rem',
        overflowX: 'auto',
        paddingBottom: '4px'
      }}>
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          style={{
            padding: '0.6rem 1.1rem',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            borderBottom: activeTab === 'OVERVIEW' ? '3px solid var(--secondary-color)' : '3px solid transparent',
            background: activeTab === 'OVERVIEW' ? 'rgba(2, 132, 199, 0.08)' : 'transparent',
            color: activeTab === 'OVERVIEW' ? 'var(--primary-color)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'OVERVIEW' ? 800 : 600,
            fontSize: '0.875rem',
            cursor: 'pointer'
          }}
        >
          Overview & Profile
        </button>

        {!isRegisteredUser && (
          <button
            onClick={() => setActiveTab('CARD')}
            style={{
              padding: '0.6rem 1.1rem',
              borderRadius: '8px 8px 0 0',
              border: 'none',
              borderBottom: activeTab === 'CARD' ? '3px solid var(--secondary-color)' : '3px solid transparent',
              background: activeTab === 'CARD' ? 'rgba(2, 132, 199, 0.08)' : 'transparent',
              color: activeTab === 'CARD' ? 'var(--primary-color)' : 'var(--text-secondary)',
              fontWeight: activeTab === 'CARD' ? 800 : 600,
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
          >
            Digital ID Pass
          </button>
        )}

        <button
          onClick={() => setActiveTab('WELFARE')}
          style={{
            padding: '0.6rem 1.1rem',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            borderBottom: activeTab === 'WELFARE' ? '3px solid var(--secondary-color)' : '3px solid transparent',
            background: activeTab === 'WELFARE' ? 'rgba(2, 132, 199, 0.08)' : 'transparent',
            color: activeTab === 'WELFARE' ? 'var(--primary-color)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'WELFARE' ? 800 : 600,
            fontSize: '0.875rem',
            cursor: 'pointer'
          }}
        >
          {isVolunteer ? 'Assigned Field Aid' : 'Welfare Assistance'}
        </button>

        <button
          onClick={() => setActiveTab('DOCS')}
          style={{
            padding: '0.6rem 1.1rem',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            borderBottom: activeTab === 'DOCS' ? '3px solid var(--secondary-color)' : '3px solid transparent',
            background: activeTab === 'DOCS' ? 'rgba(2, 132, 199, 0.08)' : 'transparent',
            color: activeTab === 'DOCS' ? 'var(--primary-color)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'DOCS' ? 800 : 600,
            fontSize: '0.875rem',
            cursor: 'pointer'
          }}
        >
          Member Documents
        </button>

        <button
          onClick={() => setActiveTab('ACTIVITIES')}
          style={{
            padding: '0.6rem 1.1rem',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            borderBottom: activeTab === 'ACTIVITIES' ? '3px solid var(--secondary-color)' : '3px solid transparent',
            background: activeTab === 'ACTIVITIES' ? 'rgba(2, 132, 199, 0.08)' : 'transparent',
            color: activeTab === 'ACTIVITIES' ? 'var(--primary-color)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'ACTIVITIES' ? 800 : 600,
            fontSize: '0.875rem',
            cursor: 'pointer'
          }}
        >
          Community Activities
        </button>
      </div>

      {/* ─── TAB 1: OVERVIEW & PROFILE ─── */}
      {activeTab === 'OVERVIEW' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Member Details */}
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={20} color="var(--secondary-color)" /> Personal Profile
            </h3>

            <div style={{ display: 'grid', gap: '1rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.6rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Full Legal Name:</span>
                <strong>{currentUser?.name}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.6rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Email Address:</span>
                <strong>{currentUser?.email}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.6rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Phone:</span>
                <strong>{currentUser?.phone || 'Not Specified'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.6rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Blood Group:</span>
                <strong style={{ color: '#EF4444' }}>{currentUser?.bloodGroup || 'Not Specified'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.6rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Senior Citizen:</span>
                <strong>{currentUser?.isSeniorCitizen ? 'Yes (Senior Citizen Benefits)' : 'No'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.6rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Jurisdiction / Address:</span>
                <span style={{ textAlign: 'right', maxWidth: '200px' }}>{currentUser?.address || 'Northeast India'}</span>
              </div>
            </div>
          </div>

          {/* Quick Access Tiles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--secondary-color)' }}>
              <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-color)' }}>
                ✨ AI Heritage Assistant
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: '0 0 1rem' }}>
                Explore Manipuri cultural history, traditional recipes, and scheme queries with the Foundation AI Assistant.
              </p>
              <Link href="/ai" className="btn btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.825rem' }}>
                Open AI Hub <ChevronRight size={14} />
              </Link>
            </div>

            <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #10B981' }}>
              <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-color)' }}>
                🏥 Health Camps & Welfare
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: '0 0 1rem' }}>
                Check upcoming medical camps, emergency ambulance contacts, and request community welfare support.
              </p>
              <Link href="/health" className="btn btn-outline" style={{ padding: '0.45rem 1rem', fontSize: '0.825rem' }}>
                View Health Schedule <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: DIGITAL ID PASS ─── */}
      {activeTab === 'CARD' && !isRegisteredUser && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem 0' }}>
          <div 
            style={{ 
              width: '100%', 
              maxWidth: '430px', 
              background: 'var(--surface-color-solid)', 
              border: '1.5px solid rgba(2, 132, 199, 0.3)',
              borderRadius: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
              overflow: 'hidden'
            }}
          >
            {/* VIP ID Header */}
            <div style={{ 
              padding: '1.4rem',
              background: 'linear-gradient(135deg, #1B2A57 0%, #0F172A 100%)',
              color: '#FFFFFF',
              borderBottom: '2.5px solid var(--secondary-color)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img 
                  src="/leimarembi_official_logo.png" 
                  alt="Emblem" 
                  style={{ width: '38px', height: '38px', objectFit: 'contain', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', padding: '3px' }} 
                />
                <div>
                  <div style={{ fontSize: '0.825rem', fontWeight: 900, letterSpacing: '0.6px', color: '#FFFFFF' }}>
                    LEIMAREMBI FOUNDATION
                  </div>
                  <div style={{ fontSize: '0.625rem', color: 'var(--secondary-color)', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>
                    OFFICIAL DIGITAL CREDENTIAL
                  </div>
                </div>
              </div>
            </div>

            {/* VIP Card Body */}
            <div style={{ padding: '1.25rem 1.4rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ 
                display: 'flex', 
                gap: '14px', 
                alignItems: 'center',
                padding: '0.85rem',
                background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.05), rgba(30, 58, 138, 0.03))',
                borderRadius: '16px',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '1.4rem',
                  flexShrink: 0
                }}>
                  {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'LF'}
                </div>

                <div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--primary-color)' }}>
                    {currentUser?.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--secondary-color)', fontWeight: 700, marginTop: '2px' }}>
                    {currentUser?.designation || 'Registered Foundation Member'}
                  </div>
                  <span style={{ 
                    display: 'inline-block',
                    marginTop: '4px',
                    padding: '0.15rem 0.5rem', 
                    borderRadius: '6px', 
                    fontSize: '0.65rem', 
                    fontWeight: 800, 
                    background: 'rgba(16,185,129,0.15)', 
                    color: '#10B981' 
                  }}>
                    {currentUser?.status}
                  </span>
                </div>
              </div>

              {/* Data Table */}
              <div style={{ background: 'var(--bg-color)', padding: '0.9rem', borderRadius: '14px', border: '1px solid var(--border-color)', display: 'grid', gap: '8px', fontSize: '0.78rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Membership ID:</span>
                  <code style={{ color: 'var(--secondary-color)', fontWeight: 900 }}>{currentUser?.membershipNo}</code>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Email:</span>
                  <strong>{currentUser?.email}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Blood Group:</span>
                  <strong style={{ color: '#EF4444' }}>{currentUser?.bloodGroup || 'N/A'}</strong>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.6rem 0.8rem',
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                fontSize: '0.72rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10B981', fontWeight: 800 }}>
                  <CheckCircle2 size={16} />
                  <span>VERIFIED ACTIVE CREDENTIAL</span>
                </div>
                <span style={{ color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: '0.68rem' }}>
                  LF-SEC-2026
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3: WELFARE ASSISTANCE ─── */}
      {activeTab === 'WELFARE' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Submit New Request */}
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
              Request Welfare Support
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Submit an assistance claim for medical relief, senior citizen aid, education, or emergency assistance.
            </p>

            {welfareSuccess && (
              <div style={{ padding: '0.75rem 1rem', borderRadius: '10px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {welfareSuccess}
              </div>
            )}

            {welfareError && (
              <div style={{ padding: '0.75rem 1rem', borderRadius: '10px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {welfareError}
              </div>
            )}

            <form onSubmit={handleCreateWelfare} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Assistance Category *
                </label>
                <select
                  value={newWelfareType}
                  onChange={(e) => setNewWelfareType(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '0.875rem' }}
                >
                  <option value="MEDICAL">Medical & Emergency Healthcare</option>
                  <option value="FINANCIAL">Senior Citizen Financial Relief</option>
                  <option value="EDUCATION">Education & Study Grant</option>
                  <option value="FOOD">Community Food & Nutrition Aid</option>
                  <option value="EMERGENCY">Urgent Family Crisis Aid</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Amount Requested (₹ Optional)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  value={newWelfareAmount}
                  onChange={(e) => setNewWelfareAmount(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '0.875rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Details & Circumstances *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your situation and what assistance is needed..."
                  value={newWelfareDesc}
                  onChange={(e) => setNewWelfareDesc(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '0.875rem', resize: 'vertical' }}
                />
              </div>

              <button
                type="submit"
                disabled={submittingWelfare}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', gap: '6px', fontWeight: 700 }}
              >
                <Send size={15} /> {submittingWelfare ? 'Submitting...' : 'Submit Assistance Request'}
              </button>
            </form>
          </div>

          {/* Past Claims History */}
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '1.25rem' }}>
              My Submitted Claims ({welfareRequests.length})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {welfareRequests.map((req) => (
                <div 
                  key={req.id} 
                  style={{ 
                    padding: '1rem', 
                    borderRadius: '12px', 
                    background: 'var(--bg-color)', 
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--primary-color)' }}>
                      {req.type}
                    </span>
                    <span style={{
                      padding: '0.15rem 0.5rem',
                      borderRadius: '6px',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      background: req.status === 'APPROVED' ? 'rgba(16,185,129,0.15)' : req.status === 'SUBMITTED' ? 'rgba(59,130,246,0.15)' : 'rgba(245,158,11,0.15)',
                      color: req.status === 'APPROVED' ? '#10B981' : req.status === 'SUBMITTED' ? '#3B82F6' : '#F59E0B'
                    }}>
                      {req.status}
                    </span>
                  </div>

                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {req.description}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    <span>Amount: <strong>₹{req.amountRequested?.toLocaleString() || 'N/A'}</strong></span>
                    <span>Date: {new Date(req.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}

              {welfareRequests.length === 0 && (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', padding: '2rem 0' }}>
                  No past welfare requests on record.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 4: MEMBER DOCUMENTS ─── */}
      {activeTab === 'DOCS' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.5rem', borderTop: '4px solid var(--primary-color)' }}>
            <h4 style={{ margin: '0 0 0.5rem', fontWeight: 800, color: 'var(--primary-color)' }}>
              Foundation Trust Deed & Bylaws
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              Official registered constitution, governance bylaws, and charitable mandate.
            </p>
            <a href="/requirements.pdf" download className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem' }}>
              <FileText size={14} /> Download Bylaws
            </a>
          </div>

          <div className="card" style={{ padding: '1.5rem', borderTop: '4px solid var(--secondary-color)' }}>
            <h4 style={{ margin: '0 0 0.5rem', fontWeight: 800, color: 'var(--primary-color)' }}>
              Annual Report & Community Metrics
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              Audited statement of community development projects, health camps, and grant utilization.
            </p>
            <a href="/architecture.pdf" download className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem' }}>
              <FileText size={14} /> View Annual Report
            </a>
          </div>
        </div>
      )}

      {/* ─── TAB 5: ACTIVITIES ─── */}
      {activeTab === 'ACTIVITIES' && (
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-color)', marginBottom: '1rem' }}>
            Foundation Community Calendar
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginBottom: '1.5rem' }}>
            Upcoming medical camps, cultural symposiums, and community outreach drives.
          </p>

          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ padding: '1rem', borderRadius: '12px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>Annual Senior Citizen Health Camp</h4>
                <p style={{ margin: '2px 0 0', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>Imphal East • Free Geriatric Checkup & Blood Screening</p>
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--secondary-color)' }}>Aug 25, 2026</span>
            </div>

            <div style={{ padding: '1rem', borderRadius: '12px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>Manipuri Cultural Heritage & Literary Assembly</h4>
                <p style={{ margin: '2px 0 0', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>Kekranagar • Traditional Music, Dance & Cuisine Festival</p>
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--secondary-color)' }}>Oct 15, 2026</span>
            </div>
          </div>
        </div>
      )}
        </div>
      </main>
    </div>
  );
}
