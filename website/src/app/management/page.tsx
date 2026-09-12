"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { 
  Users, Search, Landmark, Heart, FileText, CheckCircle2, 
  Clock, XCircle, AlertCircle, X, Plus, Printer, Download, 
  Trash2, ShieldCheck, ShieldAlert, Sparkles, Phone, Mail, MapPin, Calendar,
  ArrowRight, Lock, LogIn, LogOut, Eye, Award, ExternalLink, Shield, Activity
} from 'lucide-react';
import Image from 'next/image';
import { 
  DonationRecord, 
  getDonations, 
  saveDonations, 
  recordNewDonation, 
  OFFICIAL_SEED_DONATIONS 
} from '@/lib/donationLedger';
import { isSuperAdmin, ActivityEvent, getActivityLogs } from '@/lib/superAdminAuth';
import { 
  canSwitchRoleMode, 
  EXECUTIVE_OFFICERS, 
  ExecutiveOfficer,
  isExecutiveOfficer, 
  findOfficer, 
  verifyOfficerPassword 
} from '@/lib/executiveOfficers';

interface RegisteredMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  type: string;
  membershipNo: string;
  bloodGroup?: string;
  isSeniorCitizen?: boolean;
  joinDate: string;
  status: string;
}

// Default Registered Members from Executive Officers Registry (5 Visible Officers)
const DEFAULT_REGISTERED_MEMBERS: RegisteredMember[] = EXECUTIVE_OFFICERS.map(o => ({
  id: o.id,
  name: o.name,
  email: o.email,
  phone: o.phone,
  role: 'ADMIN',
  type: o.designation,
  membershipNo: o.id,
  bloodGroup: o.bloodGroup,
  isSeniorCitizen: o.isSeniorCitizen,
  joinDate: '01 Sept 2026',
  status: 'Active'
}));

export default function Management() {
  const [activeTab, setActiveTab] = useState<'DONATIONS' | 'MEMBERS' | 'OFFICERS' | 'ACTIVITY'>('DONATIONS');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDonation, setSelectedDonation] = useState<DonationRecord | null>(null);
  const [printDonation, setPrintDonation] = useState<DonationRecord | null>(null);
  const [isSuperAdminUser, setIsSuperAdminUser] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthorizedAdmin, setIsAuthorizedAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Live state for activity and access logs
  const [activityLogs, setActivityLogs] = useState<ActivityEvent[]>([]);
  const [auditFilter, setAuditFilter] = useState<'ALL' | 'SIGN_IN' | 'LOG_OUT' | 'PAGE_ACCESS' | 'ACCESS_ATTEMPT'>('ALL');

  // Filter states for clickable overview cards
  const [memberCategoryFilter, setMemberCategoryFilter] = useState<'ALL' | 'ACTIVE' | 'SENIOR' | 'NON_SENIOR'>('ALL');
  const [donationStatusFilter, setDonationStatusFilter] = useState<'ALL' | 'SUCCESS' | 'PENDING'>('ALL');

  // Officer direct login modal state
  const [showOfficerLoginModal, setShowOfficerLoginModal] = useState(false);
  const [officerLoginForm, setOfficerLoginForm] = useState({ credential: '', password: '' });
  const [officerLoginError, setOfficerLoginError] = useState('');

  // Live state for donations
  const [donations, setDonations] = useState<DonationRecord[]>([]);

  // Live state for registered members
  const [members, setMembers] = useState<RegisteredMember[]>([]);

  // Add Donation Modal state
  const [showAddDonationModal, setShowAddDonationModal] = useState(false);
  const [newDonationForm, setNewDonationForm] = useState({
    donorName: '',
    location: '',
    amount: '',
    receiptNo: '',
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
    paymentMethod: 'UPI / Bank',
    purpose: 'General Community Development',
    status: 'SUCCESS' as 'SUCCESS' | 'PENDING',
    email: '',
    phone: ''
  });

  // Load User & Check Admin / Super Admin status
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('lf_user');
      if (userStr) {
        try {
          const u = JSON.parse(userStr);
          setCurrentUser(u);
          if (isSuperAdmin(u)) {
            setIsSuperAdminUser(true);
            setIsAuthorizedAdmin(true);
          } else if (u.role === 'ADMIN' || u.role === 'SUPER_ADMIN' || isExecutiveOfficer(u)) {
            setIsAuthorizedAdmin(true);
          }
        } catch {}
      }
      setCheckingAuth(false);
    }
  }, []);

  // Officer direct clearance login handler
  const handleOfficerDirectLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setOfficerLoginError('');
    const officer = findOfficer(officerLoginForm.credential);
    if (officer && verifyOfficerPassword(officer, officerLoginForm.password)) {
      const isSuper = officer.email === 'aryamansingha60@gmail.com' || officer.email === 'binababu.singha@yahoo.com';
      const officerUser = {
        id: officer.id,
        name: officer.name,
        email: officer.email,
        phone: officer.phone,
        role: isSuper ? 'SUPER_ADMIN' : 'ADMIN',
        designation: officer.designation,
        membershipNo: officer.id,
        bloodGroup: officer.bloodGroup,
        isSeniorCitizen: officer.isSeniorCitizen,
        authProvider: 'LOCAL'
      };
      localStorage.setItem('lf_token', `lf_tok_exec_${Date.now()}`);
      localStorage.setItem('lf_user', JSON.stringify(officerUser));
      setCurrentUser(officerUser);
      setIsAuthorizedAdmin(true);
      if (isSuper) setIsSuperAdminUser(true);
      setShowOfficerLoginModal(false);
    } else {
      setOfficerLoginError('Invalid credentials. Please enter your registered Email or Phone and Date of Birth (DOB).');
    }
  };

  // Synchronize Donations & Members from Storage
  const syncData = useCallback(() => {
    if (typeof window === 'undefined') return;

    // 1. Sync Donations
    const loadedDonations = getDonations();
    setDonations(loadedDonations);

    // 2. Sync Registered Members from Super Admin Registry + Local Registrations
    let combinedMembers: RegisteredMember[] = [...DEFAULT_REGISTERED_MEMBERS];

    try {
      const superAdminMembersRaw = localStorage.getItem('lf_superadmin_members');
      if (superAdminMembersRaw) {
        const parsed = JSON.parse(superAdminMembersRaw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          combinedMembers = parsed.map((m: any) => ({
            id: m.id || m.membershipNo || 'MEM-LF',
            name: m.name,
            email: m.email,
            phone: m.phone,
            role: m.role || 'MEMBER',
            type: m.designation || (m.role === 'ADMIN' ? 'Administrator' : 'Verified Member'),
            membershipNo: m.membershipNo || 'LF-MEMBER',
            bloodGroup: m.bloodGroup || 'N/A',
            isSeniorCitizen: Boolean(m.isSeniorCitizen),
            joinDate: m.registeredAt || 'September 2026',
            status: m.status || 'Active'
          }));
        }
      }

      // Add any newly registered users from /login
      const localUsersRaw = localStorage.getItem('lf_local_users');
      if (localUsersRaw) {
        const localParsed = JSON.parse(localUsersRaw);
        if (Array.isArray(localParsed)) {
          localParsed.forEach((lu: any) => {
            if (!combinedMembers.some(m => m.email.toLowerCase() === lu.email.toLowerCase())) {
              combinedMembers.push({
                id: lu.id || `MEM-${Math.floor(100 + Math.random() * 900)}`,
                name: lu.name,
                email: lu.email,
                phone: lu.phone,
                role: lu.role || 'MEMBER',
                type: 'Registered Member',
                membershipNo: lu.membershipNo || 'LF-2026-USER',
                bloodGroup: lu.bloodGroup || 'N/A',
                isSeniorCitizen: Boolean(lu.isSeniorCitizen),
                joinDate: 'September 2026',
                status: 'Active'
              });
            }
          });
        }
      }
    } catch {}

    // Strictly hide Aryaman Singha from the visible management member roster for the Inauguration
    const filteredVisible = combinedMembers.filter(m => 
      !m.email.toLowerCase().includes('aryaman') && 
      !(m.phone && m.phone.replace(/\D/g, '').endsWith('7099659804'))
    );

    setMembers(filteredVisible);

    // 3. Sync Live Access & Activity Telemetry Stream
    const logs = getActivityLogs();
    setActivityLogs(logs);
  }, []);

  // Initial load & real-time live event listeners
  useEffect(() => {
    syncData();

    const handleStorageChange = () => {
      syncData();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('lf_donation_updated', handleStorageChange as EventListener);
    window.addEventListener('lf_activity_updated', handleStorageChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('lf_donation_updated', handleStorageChange as EventListener);
      window.removeEventListener('lf_activity_updated', handleStorageChange as EventListener);
    };
  }, [syncData]);

  // Filtered 5 Executive Officers
  const filteredOfficers = useMemo(() => {
    return EXECUTIVE_OFFICERS.filter(o => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        o.name.toLowerCase().includes(q) ||
        o.designation.toLowerCase().includes(q) ||
        o.role.toLowerCase().includes(q) ||
        o.email.toLowerCase().includes(q) ||
        o.phone.includes(q) ||
        o.bloodGroup.toLowerCase().includes(q)
      );
    });
  }, [searchQuery]);

  // Filtered Activity & Access Audit Logs (Login, Logout, Page Access, Access Attempts)
  const filteredAuditLogs = useMemo(() => {
    return activityLogs.filter(l => {
      // Conceal Aryaman Singha from visible management logs
      if (
        l.userEmail.toLowerCase().includes('aryaman') ||
        (l.userPhone && l.userPhone.replace(/\D/g, '').endsWith('7099659804'))
      ) {
        return false;
      }

      const matchesSearch = !searchQuery ||
        l.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (l.userPhone && l.userPhone.includes(searchQuery)) ||
        (l.details && l.details.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (l.pageVisited && l.pageVisited.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesFilter = auditFilter === 'ALL' || l.type === auditFilter;

      return matchesSearch && matchesFilter;
    });
  }, [activityLogs, searchQuery, auditFilter]);

  // Filtered Donations (Search Query + Donation Status Filter)
  const filteredDonations = useMemo(() => {
    return donations.filter(d => {
      const matchesSearch = !searchQuery ||
        d.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.publicDonationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.receiptNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.email && d.email.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        donationStatusFilter === 'ALL' || d.status === donationStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [donations, searchQuery, donationStatusFilter]);

  // Filtered Members (Search Query + Category Filter)
  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      const matchesSearch = !searchQuery ||
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.membershipNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        memberCategoryFilter === 'ALL' ||
        (memberCategoryFilter === 'ACTIVE' && (m.status === 'Active' || m.status === 'ACTIVE')) ||
        (memberCategoryFilter === 'SENIOR' && m.isSeniorCitizen) ||
        (memberCategoryFilter === 'NON_SENIOR' && !m.isSeniorCitizen);

      return matchesSearch && matchesCategory;
    });
  }, [members, searchQuery, memberCategoryFilter]);

  // Metrics (Live Updated)
  const totalSuccessAmount = useMemo(() => {
    return donations
      .filter(d => d.status === 'SUCCESS')
      .reduce((sum, d) => sum + d.amount, 0);
  }, [donations]);

  const pendingCount = useMemo(() => {
    return donations.filter(d => d.status === 'PENDING').length;
  }, [donations]);

  const activeMembersCount = useMemo(() => {
    return members.filter(m => m.status === 'Active' || m.status === 'ACTIVE').length;
  }, [members]);

  const seniorMembersCount = useMemo(() => {
    return members.filter(m => m.isSeniorCitizen).length;
  }, [members]);

  const nonSeniorMembersCount = useMemo(() => {
    return members.filter(m => !m.isSeniorCitizen).length;
  }, [members]);

  // Handle Add Donation
  const handleCreateDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDonationForm.donorName || !newDonationForm.amount) {
      alert('Please provide Donor Name and Amount.');
      return;
    }

    const numAmount = Number(newDonationForm.amount.replace(/[^0-9]/g, ''));
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid donation amount.');
      return;
    }

    const receiptNo = newDonationForm.receiptNo.trim() || String(donations.length + 1).padStart(3, '0');

    recordNewDonation({
      receiptNo,
      donorName: newDonationForm.donorName.trim(),
      location: newDonationForm.location.trim() || 'Guwahati, Assam',
      email: newDonationForm.email.trim(),
      phone: newDonationForm.phone.trim(),
      amount: numAmount,
      currency: 'INR',
      date: newDonationForm.date.trim(),
      purpose: newDonationForm.purpose.trim() || 'General Community Development',
      status: newDonationForm.status,
      paymentMethod: newDonationForm.paymentMethod,
      verifiedBy: isSuperAdminUser ? (currentUser?.name || 'Super Administrator') : 'Official Authority'
    });

    setShowAddDonationModal(false);
    setNewDonationForm({
      donorName: '',
      location: '',
      amount: '',
      receiptNo: '',
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      paymentMethod: 'UPI / Bank',
      purpose: 'General Community Development',
      status: 'SUCCESS',
      email: '',
      phone: ''
    });
  };

  // Handle Delete Donation (Super Admin Only)
  const handleDeleteDonation = (publicDonationId: string, donorName: string) => {
    if (!isSuperAdminUser) return;
    if (confirm(`Are you sure you want to delete the donation record for "${donorName}"?`)) {
      const updated = donations.filter(d => d.publicDonationId !== publicDonationId);
      saveDonations(updated);
    }
  };

  // Handle Status Toggle (Super Admin Only)
  const handleToggleStatus = (publicDonationId: string) => {
    if (!isSuperAdminUser) return;
    const updated = donations.map(d => {
      if (d.publicDonationId === publicDonationId) {
        const nextStatus = d.status === 'SUCCESS' ? 'PENDING' : 'SUCCESS';
        return { ...d, status: nextStatus as 'SUCCESS' | 'PENDING' };
      }
      return d;
    });
    saveDonations(updated);
  };

  // Export Donations CSV
  const handleExportCSV = () => {
    const headers = ['Receipt No', 'Donor Name', 'Location', 'Amount (INR)', 'Date', 'Payment Method', 'Purpose', 'Status', 'Donation Ref ID'];
    const rows = donations.map(d => [
      `"${d.receiptNo}"`,
      `"${d.donorName}"`,
      `"${d.location}"`,
      d.amount,
      `"${d.date}"`,
      `"${d.paymentMethod}"`,
      `"${d.purpose}"`,
      `"${d.status}"`,
      `"${d.publicDonationId}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Leimarembi_Foundation_Donations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // LOADING STATE
  if (checkingAuth) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spin" style={{ width: '44px', height: '44px', border: '4px solid var(--border-color)', borderTopColor: 'var(--secondary-color)', borderRadius: '50%', margin: '0 auto 1.5rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Authenticating Executive Admin Clearance...</h3>
        </div>
      </div>
    );
  }

  // ACCESS RESTRICTED SCREEN FOR UNAUTHORIZED USERS
  if (!isAuthorizedAdmin) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="card" style={{ maxWidth: '540px', width: '100%', padding: '3rem 2.5rem', textAlign: 'center', borderRadius: '24px', boxShadow: 'var(--shadow-xl)', border: '1.5px solid var(--border-color)' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(2, 132, 199, 0.1)', color: 'var(--info-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Lock size={36} />
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--primary-color)', margin: '0 0 0.5rem' }}>
            Executive Admin Panel
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            This governance portal is authorized for <strong>Executive Officers, Trustees, and Platform Leadership</strong> with Read, Write & Execute access.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button 
              onClick={() => setShowOfficerLoginModal(true)} 
              className="btn btn-primary" 
              style={{ justifyContent: 'center', padding: '0.75rem', fontSize: '0.95rem' }}
            >
              <ShieldCheck size={18} /> Authenticate with Executive Officer Credentials
            </button>
            <Link href="/login?redirect=/management" className="btn btn-outline" style={{ justifyContent: 'center', padding: '0.75rem', fontSize: '0.95rem' }}>
              <LogIn size={18} /> Sign In via Member Account
            </Link>
            <Link href="/" style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
              ← Return to Public Home
            </Link>
          </div>
        </div>

        {/* Officer Clearance Modal */}
        {showOfficerLoginModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10005,
            padding: '1rem'
          }}>
            <div className="card" style={{ maxWidth: '460px', width: '100%', borderRadius: '20px', padding: '2rem', boxShadow: 'var(--shadow-xl)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={20} color="var(--info-color)" /> Officer Admin Clearance
                </h3>
                <button onClick={() => setShowOfficerLoginModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{
                background: 'rgba(2, 132, 199, 0.08)',
                border: '1px solid rgba(2, 132, 199, 0.25)',
                borderRadius: '10px',
                padding: '0.75rem 1rem',
                fontSize: '0.825rem',
                color: 'var(--info-color)',
                fontWeight: 700,
                marginBottom: '1.25rem'
              }}>
                💡 Officer Access Hint: Login with your registered Email or Phone. Your default password is your Date of Birth (DOB).
              </div>

              {officerLoginError && (
                <div style={{
                  background: 'rgba(220, 38, 38, 0.1)',
                  border: '1px solid rgba(220, 38, 38, 0.3)',
                  color: '#DC2626',
                  borderRadius: '8px',
                  padding: '0.65rem 0.85rem',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  marginBottom: '1rem'
                }}>
                  {officerLoginError}
                </div>
              )}

              <form onSubmit={handleOfficerDirectLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    Registered Email Address or Phone *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ichemma@yahoo.com or 98640-44123"
                    value={officerLoginForm.credential}
                    onChange={(e) => setOfficerLoginForm({ ...officerLoginForm, credential: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-color)',
                      color: 'var(--text-primary)',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    Password (Date of Birth / Passcode) *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter Date of Birth (DOB) or Passcode"
                    value={officerLoginForm.password}
                    onChange={(e) => setOfficerLoginForm({ ...officerLoginForm, password: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-color)',
                      color: 'var(--text-primary)',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ justifyContent: 'center', padding: '0.75rem', marginTop: '0.5rem', fontWeight: 800 }}
                >
                  Unlock Admin Dashboard
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // AUTHORIZED ADMIN DASHBOARD
  return (
    <div className="animate-fade-in" style={{ padding: '2.5rem 0 4rem' }}>
      {/* Header Banner */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div className="glass-panel" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0.4rem 1.25rem', borderRadius: '30px', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--secondary-color)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            Module 3: NGO Administration & Governance
          </span>
          {isSuperAdminUser ? (
            <span style={{ background: '#F59E0B', color: '#000', fontSize: '0.75rem', fontWeight: 900, padding: '2px 8px', borderRadius: '12px' }}>
              ⭐ SUPER ADMIN (OVERPOWER ACCESS ACTIVE)
            </span>
          ) : (
            <span style={{ background: 'rgba(2, 132, 199, 0.15)', color: 'var(--info-color)', fontSize: '0.75rem', fontWeight: 900, padding: '2px 8px', borderRadius: '12px' }}>
              🛡️ EXECUTIVE ADMIN (READ, WRITE, EXECUTE ACCESS)
            </span>
          )}
          {canSwitchRoleMode(currentUser) && (
            <Link
              href="/superadmin"
              style={{
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.25) 0%, rgba(212, 175, 55, 0.1) 100%)',
                border: '1.5px solid var(--secondary-color)',
                color: 'var(--secondary-color)',
                padding: '0.35rem 0.9rem',
                borderRadius: '20px',
                fontSize: '0.775rem',
                fontWeight: 900,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                marginLeft: '8px'
              }}
              title="Switch to Super Admin Control Center (/superadmin)"
            >
              👑 Switch to Super Admin View
            </Link>
          )}
        </div>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <Landmark size={36} color="var(--secondary-color)" /> Foundation Management Portal
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', maxWidth: '750px', margin: '0.5rem auto 0' }}>
          Official ledger for verified donations, receipts, registered member directories, and bank reconciliation.
        </p>
      </div>

      {/* Live Overview Cards — All 6 Cards are Fully Clickable with Visual Feedback */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {/* 1. Total Registered Members */}
        <div 
          onClick={() => { setActiveTab('MEMBERS'); setMemberCategoryFilter('ALL'); }}
          className="card" 
          style={{ 
            background: 'var(--primary-color)', 
            color: 'white', 
            borderTop: '4px solid var(--secondary-color)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: memberCategoryFilter === 'ALL' && activeTab === 'MEMBERS' ? '0 0 0 2px var(--secondary-color)' : undefined
          }}
          title="Click to view all registered members"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: '#FFFFFF', fontSize: '0.92rem', fontWeight: 700, margin: 0 }}>Total Members</h3>
            <Users size={18} color="var(--secondary-color)" />
          </div>
          <p style={{ fontSize: '2.2rem', fontWeight: 900, margin: '0.35rem 0' }}>
            {members.length}
          </p>
          <p style={{ opacity: 0.85, fontSize: '0.8rem', margin: 0 }}>
            ● Full Database Access
          </p>
        </div>

        {/* 2. Executive Directorate (5 Officers) */}
        <div 
          onClick={() => setActiveTab('OFFICERS')}
          className="card" 
          style={{ 
            borderTop: '4px solid var(--secondary-color)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: activeTab === 'OFFICERS' ? '0 0 0 2px var(--secondary-color)' : undefined,
            background: 'linear-gradient(180deg, var(--card-bg) 0%, rgba(212, 175, 55, 0.06) 100%)'
          }}
          title="Click to view the 5 Authorized Executive Officers"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>Executive Officers</h3>
            <Award size={18} color="var(--secondary-color)" />
          </div>
          <p style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--secondary-color)', margin: '0.35rem 0' }}>
            5 Officers
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0, fontWeight: 700 }}>
            ★ Read, Write & Execute Authority
          </p>
        </div>

        {/* 3. Live Access & Audit Stream */}
        <div 
          onClick={() => setActiveTab('ACTIVITY')}
          className="card" 
          style={{ 
            borderTop: '4px solid #3B82F6',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: activeTab === 'ACTIVITY' ? '0 0 0 2px #3B82F6' : undefined,
            background: 'linear-gradient(180deg, var(--card-bg) 0%, rgba(59, 130, 246, 0.06) 100%)'
          }}
          title="Click to view Live Access Stream (Logins, Logouts, Visits & Attempts)"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>Live Access Stream</h3>
            <Activity size={18} color="#3B82F6" />
          </div>
          <p style={{ fontSize: '2.2rem', fontWeight: 900, color: '#3B82F6', margin: '0.35rem 0' }}>
            {filteredAuditLogs.length} Events
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0, fontWeight: 600 }}>
            ● Logins, Logouts & Security Audit
          </p>
        </div>

        {/* 4. Senior Citizen Members */}
        <div 
          onClick={() => { setActiveTab('MEMBERS'); setMemberCategoryFilter('SENIOR'); }}
          className="card" 
          style={{ 
            borderTop: '4px solid #D97706',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: memberCategoryFilter === 'SENIOR' && activeTab === 'MEMBERS' ? '0 0 0 2px #D97706' : undefined
          }}
          title="Click to view Senior Citizens (Health Card Eligible)"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0 }}>Senior Citizens</h3>
            <ShieldCheck size={18} color="#D97706" />
          </div>
          <p style={{ fontSize: '2.2rem', fontWeight: 900, color: '#D97706', margin: '0.35rem 0' }}>
            {seniorMembersCount}
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0 }}>
            ★ Health Card Eligible (60+)
          </p>
        </div>

        {/* 5. Verified Donations Total */}
        <div 
          onClick={() => { setActiveTab('DONATIONS'); setDonationStatusFilter('ALL'); }}
          className="card" 
          style={{ 
            background: 'var(--secondary-color)', 
            color: '#111827',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: activeTab === 'DONATIONS' && donationStatusFilter === 'ALL' ? '0 0 0 2px #B45309' : undefined
          }}
          title="Click to view verified donations"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: '#111827', fontSize: '0.92rem', fontWeight: 800, margin: 0 }}>Donations Total</h3>
            <Heart size={18} color="#111827" />
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 900, margin: '0.35rem 0', color: '#111827' }}>
            ₹{totalSuccessAmount.toLocaleString('en-IN')}
          </p>
          <p style={{ opacity: 0.9, fontSize: '0.8rem', color: '#111827', fontWeight: 600, margin: 0 }}>
            {donations.filter(d => d.status === 'SUCCESS').length} Official Verified Receipts
          </p>
        </div>

        {/* 6. Pending Reconciliations */}
        <div 
          onClick={() => { setActiveTab('DONATIONS'); setDonationStatusFilter('PENDING'); }}
          className="card" 
          style={{ 
            borderTop: '4px solid var(--accent-color)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: activeTab === 'DONATIONS' && donationStatusFilter === 'PENDING' ? '0 0 0 2px var(--accent-color)' : undefined
          }}
          title="Click to filter Pending Reconciliations"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0 }}>Pending Queue</h3>
            <Clock size={18} color="var(--accent-color)" />
          </div>
          <p style={{ fontSize: '2.2rem', fontWeight: 900, color: pendingCount > 0 ? 'var(--accent-color)' : '#10B981', margin: '0.35rem 0' }}>
            {pendingCount}
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0 }}>
            {pendingCount > 0 ? 'Awaiting Bank Audit' : '✓ Fully Reconciled'}
          </p>
        </div>
      </div>

      {/* Executive Quick Action Hub (Read, Write & Execute Privileges) */}
      <div className="card" style={{ padding: '1.25rem 1.5rem', marginBottom: '2rem', borderRadius: '18px', background: 'var(--surface-color)', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={20} color="var(--info-color)" /> Executive Governance Suite (Read, Write & Execute Access)
            </h3>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Authorized management clearance across official foundation modules
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Link 
              href="/documents" 
              className="btn btn-outline" 
              style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem', gap: '6px', fontWeight: 700 }}
              title="Access & Download Foundation Legal Documents"
            >
              <FileText size={14} color="var(--info-color)" /> Documents Vault <ArrowRight size={12} />
            </Link>
            <Link 
              href="/meetings" 
              className="btn btn-outline" 
              style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem', gap: '6px', fontWeight: 700 }}
              title="Issue Circulars & Schedule Video Conferences"
            >
              <Users size={14} color="var(--secondary-color)" /> Meeting Suite <ArrowRight size={12} />
            </Link>
            <Link 
              href="/gallery" 
              className="btn btn-outline" 
              style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem', gap: '6px', fontWeight: 700 }}
              title="Upload Photos & Media Records"
            >
              <Sparkles size={14} color="#10B981" /> Media Gallery <ArrowRight size={12} />
            </Link>
            <button
              onClick={() => setShowAddDonationModal(true)}
              className="btn btn-secondary"
              style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem', gap: '6px', fontWeight: 800 }}
              title="Record New Official Donation Receipt"
            >
              <Plus size={14} /> Record Donation
            </button>
            <button
              onClick={handleExportCSV}
              className="btn btn-outline"
              style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem', gap: '6px', fontWeight: 700 }}
              title="Download Full Audited Ledger CSV"
            >
              <Download size={14} /> Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Main Panel with Tabs & Filters */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: '20px', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ 
          padding: '1.25rem 1.5rem', 
          borderBottom: '1px solid var(--border-color)', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '1rem', 
          background: 'rgba(0,0,0,0.02)' 
        }}>
          {/* Tab buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={() => setActiveTab('DONATIONS')}
              className={activeTab === 'DONATIONS' ? 'btn btn-primary' : 'btn btn-outline'}
              style={{ fontSize: '0.875rem', gap: '6px' }}
            >
              <Heart size={16} /> Donation Records & Receipts ({donations.length})
            </button>
            <button
              onClick={() => setActiveTab('MEMBERS')}
              className={activeTab === 'MEMBERS' ? 'btn btn-primary' : 'btn btn-outline'}
              style={{ fontSize: '0.875rem', gap: '6px' }}
            >
              <Users size={16} /> Member Directory ({members.length})
            </button>
            <button
              onClick={() => setActiveTab('OFFICERS')}
              className={activeTab === 'OFFICERS' ? 'btn btn-primary' : 'btn btn-outline'}
              style={{ fontSize: '0.875rem', gap: '6px' }}
            >
              <Award size={16} /> Executive Directorate (5 Officers)
            </button>
            <button
              onClick={() => setActiveTab('ACTIVITY')}
              className={activeTab === 'ACTIVITY' ? 'btn btn-primary' : 'btn btn-outline'}
              style={{ fontSize: '0.875rem', gap: '6px' }}
            >
              <Activity size={16} /> Live Access & Audit Stream ({filteredAuditLogs.length})
            </button>
          </div>

          {/* Filter Pills for Active Tab */}
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
            {activeTab === 'OFFICERS' && (
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--secondary-color)', background: 'rgba(212, 175, 55, 0.1)', padding: '0.25rem 0.75rem', borderRadius: '14px', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
                ⭐ 5 Authorized Executive Officers • Read, Write & Execute Authority
              </span>
            )}

            {activeTab === 'ACTIVITY' && (
              <>
                <button
                  onClick={() => setAuditFilter('ALL')}
                  style={{
                    padding: '0.25rem 0.55rem',
                    borderRadius: '14px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    border: '1px solid var(--border-color)',
                    background: auditFilter === 'ALL' ? 'var(--primary-color)' : 'transparent',
                    color: auditFilter === 'ALL' ? '#FFFFFF' : 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  All Stream ({activityLogs.length})
                </button>
                <button
                  onClick={() => setAuditFilter('SIGN_IN')}
                  style={{
                    padding: '0.25rem 0.55rem',
                    borderRadius: '14px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    border: '1px solid #3B82F6',
                    background: auditFilter === 'SIGN_IN' ? '#3B82F6' : 'transparent',
                    color: auditFilter === 'SIGN_IN' ? '#FFFFFF' : '#3B82F6',
                    cursor: 'pointer'
                  }}
                >
                  Logins ({activityLogs.filter(l => l.type === 'SIGN_IN').length})
                </button>
                <button
                  onClick={() => setAuditFilter('LOG_OUT')}
                  style={{
                    padding: '0.25rem 0.55rem',
                    borderRadius: '14px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    border: '1px solid #F97316',
                    background: auditFilter === 'LOG_OUT' ? '#F97316' : 'transparent',
                    color: auditFilter === 'LOG_OUT' ? '#FFFFFF' : '#F97316',
                    cursor: 'pointer'
                  }}
                >
                  Logouts ({activityLogs.filter(l => l.type === 'LOG_OUT').length})
                </button>
                <button
                  onClick={() => setAuditFilter('PAGE_ACCESS')}
                  style={{
                    padding: '0.25rem 0.55rem',
                    borderRadius: '14px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    border: '1px solid #10B981',
                    background: auditFilter === 'PAGE_ACCESS' ? '#10B981' : 'transparent',
                    color: auditFilter === 'PAGE_ACCESS' ? '#FFFFFF' : '#10B981',
                    cursor: 'pointer'
                  }}
                >
                  Website Access ({activityLogs.filter(l => l.type === 'PAGE_ACCESS').length})
                </button>
                <button
                  onClick={() => setAuditFilter('ACCESS_ATTEMPT')}
                  style={{
                    padding: '0.25rem 0.55rem',
                    borderRadius: '14px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    border: '1px solid #EF4444',
                    background: auditFilter === 'ACCESS_ATTEMPT' ? '#EF4444' : 'transparent',
                    color: auditFilter === 'ACCESS_ATTEMPT' ? '#FFFFFF' : '#EF4444',
                    cursor: 'pointer'
                  }}
                >
                  Access Attempts ({activityLogs.filter(l => l.type === 'ACCESS_ATTEMPT').length})
                </button>
              </>
            )}
            {activeTab === 'MEMBERS' && (
              <>
                <button
                  onClick={() => setMemberCategoryFilter('ALL')}
                  style={{
                    padding: '0.25rem 0.55rem',
                    borderRadius: '14px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    border: '1px solid var(--border-color)',
                    background: memberCategoryFilter === 'ALL' ? 'var(--primary-color)' : 'transparent',
                    color: memberCategoryFilter === 'ALL' ? '#FFFFFF' : 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  All ({members.length})
                </button>
                <button
                  onClick={() => setMemberCategoryFilter('ACTIVE')}
                  style={{
                    padding: '0.25rem 0.55rem',
                    borderRadius: '14px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    border: '1px solid #10B981',
                    background: memberCategoryFilter === 'ACTIVE' ? '#10B981' : 'transparent',
                    color: memberCategoryFilter === 'ACTIVE' ? '#FFFFFF' : '#10B981',
                    cursor: 'pointer'
                  }}
                >
                  Active ({activeMembersCount})
                </button>
                <button
                  onClick={() => setMemberCategoryFilter('SENIOR')}
                  style={{
                    padding: '0.25rem 0.55rem',
                    borderRadius: '14px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    border: '1px solid #D97706',
                    background: memberCategoryFilter === 'SENIOR' ? '#D97706' : 'transparent',
                    color: memberCategoryFilter === 'SENIOR' ? '#FFFFFF' : '#D97706',
                    cursor: 'pointer'
                  }}
                >
                  Senior ({seniorMembersCount})
                </button>
                <button
                  onClick={() => setMemberCategoryFilter('NON_SENIOR')}
                  style={{
                    padding: '0.25rem 0.55rem',
                    borderRadius: '14px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    border: '1px solid var(--info-color)',
                    background: memberCategoryFilter === 'NON_SENIOR' ? 'var(--info-color)' : 'transparent',
                    color: memberCategoryFilter === 'NON_SENIOR' ? '#FFFFFF' : 'var(--info-color)',
                    cursor: 'pointer'
                  }}
                >
                  Non-Senior ({nonSeniorMembersCount})
                </button>
              </>
            )}

            {activeTab === 'DONATIONS' && (
              <>
                <button
                  onClick={() => setDonationStatusFilter('ALL')}
                  style={{
                    padding: '0.25rem 0.55rem',
                    borderRadius: '14px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    border: '1px solid var(--border-color)',
                    background: donationStatusFilter === 'ALL' ? 'var(--primary-color)' : 'transparent',
                    color: donationStatusFilter === 'ALL' ? '#FFFFFF' : 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  All ({donations.length})
                </button>
                <button
                  onClick={() => setDonationStatusFilter('SUCCESS')}
                  style={{
                    padding: '0.25rem 0.55rem',
                    borderRadius: '14px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    border: '1px solid #10B981',
                    background: donationStatusFilter === 'SUCCESS' ? '#10B981' : 'transparent',
                    color: donationStatusFilter === 'SUCCESS' ? '#FFFFFF' : '#10B981',
                    cursor: 'pointer'
                  }}
                >
                  Verified ({donations.filter(d => d.status === 'SUCCESS').length})
                </button>
                <button
                  onClick={() => setDonationStatusFilter('PENDING')}
                  style={{
                    padding: '0.25rem 0.55rem',
                    borderRadius: '14px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    border: '1px solid var(--accent-color)',
                    background: donationStatusFilter === 'PENDING' ? 'var(--accent-color)' : 'transparent',
                    color: donationStatusFilter === 'PENDING' ? '#FFFFFF' : 'var(--accent-color)',
                    cursor: 'pointer'
                  }}
                >
                  Pending ({pendingCount})
                </button>
              </>
            )}
          </div>

          {/* Actions & Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Action Buttons */}
            {activeTab === 'DONATIONS' && (
              <>
                <button
                  onClick={() => setShowAddDonationModal(true)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.825rem', padding: '0.4rem 0.85rem', gap: '6px', fontWeight: 800 }}
                >
                  <Plus size={15} /> Record Donation
                </button>
                <button
                  onClick={handleExportCSV}
                  className="btn btn-outline"
                  style={{ fontSize: '0.825rem', padding: '0.4rem 0.85rem', gap: '6px' }}
                  title="Export Donations as CSV"
                >
                  <Download size={15} /> Export CSV
                </button>
              </>
            )}

            {/* Search bar */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              background: 'var(--surface-color-solid)', 
              padding: '0.4rem 0.85rem', 
              borderRadius: '8px', 
              border: '1px solid var(--border-color)' 
            }}>
              <Search size={15} style={{ color: 'var(--text-secondary)', marginRight: '6px' }} />
              <input
                type="text"
                placeholder={activeTab === 'DONATIONS' ? "Search donor, location, receipt..." : "Search member name, ID..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  outline: 'none', 
                  color: 'var(--text-primary)', 
                  fontSize: '0.85rem', 
                  width: '200px' 
                }}
              />
            </div>
          </div>
        </div>

        {/* DONATIONS TAB CONTENT (12 Official Donors + Live Additions) */}
        {activeTab === 'DONATIONS' && (
          <div className="table-responsive">
            <table>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.03)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '1rem 1.25rem' }}>Receipt No</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Donor Name</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Location</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Amount (₹)</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Date</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Payment Method</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Status</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDonations.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No donation records match your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredDonations.map((d) => (
                    <tr key={d.publicDonationId} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span style={{ 
                          background: 'rgba(245, 158, 11, 0.15)', 
                          color: '#B45309', 
                          fontWeight: 800, 
                          padding: '3px 8px', 
                          borderRadius: '6px',
                          fontSize: '0.825rem'
                        }}>
                          {d.receiptNo}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{d.donorName}</div>
                        {d.email && <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{d.email}</div>}
                      </td>
                      <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={13} style={{ color: 'var(--secondary-color)', flexShrink: 0 }} />
                          <span>{d.location}</span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem 1.25rem', fontWeight: 900, fontSize: '1rem', color: 'var(--primary-color)' }}>
                        ₹{d.amount.toLocaleString('en-IN')}/-
                      </td>
                      <td style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={13} />
                          <span>{d.date}</span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem 1.25rem', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                        {d.paymentMethod}
                      </td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <StatusBadge 
                          status={d.status} 
                          onClick={isSuperAdminUser ? () => handleToggleStatus(d.publicDonationId) : undefined}
                          isClickable={isSuperAdminUser}
                        />
                      </td>
                      <td style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                          <button
                            onClick={() => setSelectedDonation(d)}
                            className="btn btn-ghost"
                            style={{ padding: '0.3rem 0.55rem', fontSize: '0.8rem', color: 'var(--primary-color)' }}
                            title="View Full Donation Audit Details"
                          >
                            <FileText size={14} /> Audit
                          </button>
                          <button
                            onClick={() => setPrintDonation(d)}
                            className="btn btn-outline"
                            style={{ padding: '0.3rem 0.55rem', fontSize: '0.8rem', gap: '4px' }}
                            title="Print Official Foundation Receipt Voucher"
                          >
                            <Printer size={13} /> Receipt
                          </button>
                          {isSuperAdminUser && (
                            <button
                              onClick={() => handleDeleteDonation(d.publicDonationId, d.donorName)}
                              style={{ 
                                background: 'transparent', 
                                border: 'none', 
                                color: '#EF4444', 
                                cursor: 'pointer',
                                padding: '4px'
                              }}
                              title="Delete Donation Record (Super Admin)"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* MEMBERS TAB CONTENT (Real Registered Members from Super Admin Registry & DB) */}
        {activeTab === 'MEMBERS' && (
          <div className="table-responsive">
            <table>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.03)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 700 }}>Membership ID</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 700 }}>Full Name</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 700 }}>Role / Designation</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 700 }}>Blood Group</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 700 }}>Category</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 700 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No registered members found.
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((m, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <span style={{ 
                          background: 'rgba(14, 165, 233, 0.12)', 
                          color: '#0284C7', 
                          fontWeight: 800, 
                          padding: '3px 8px', 
                          borderRadius: '6px',
                          fontSize: '0.825rem'
                        }}>
                          {m.membershipNo}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{m.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{m.email}</div>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        {m.type}
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <span style={{ 
                          background: 'rgba(239, 68, 68, 0.12)', 
                          color: '#DC2626', 
                          fontWeight: 900, 
                          padding: '2px 8px', 
                          borderRadius: '12px',
                          fontSize: '0.78rem'
                        }}>
                          {m.bloodGroup || 'A+'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        {m.isSeniorCitizen ? (
                          <span style={{ 
                            background: 'rgba(245, 158, 11, 0.15)', 
                            color: '#D97706', 
                            fontWeight: 800, 
                            padding: '3px 8px', 
                            borderRadius: '12px',
                            fontSize: '0.75rem'
                          }}>
                            ★ Senior Citizen (60+)
                          </span>
                        ) : (
                          <span style={{ 
                            background: 'rgba(56, 189, 248, 0.12)', 
                            color: '#0284C7', 
                            fontWeight: 800, 
                            padding: '3px 8px', 
                            borderRadius: '12px',
                            fontSize: '0.75rem'
                          }}>
                            General Member
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <span style={{
                          padding: '0.3rem 0.65rem',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          background: 'rgba(39, 174, 96, 0.12)',
                          color: 'var(--success-color)',
                          fontWeight: 800
                        }}>
                          Active
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* OFFICERS TAB CONTENT (5 Authorized Executive Officers) */}
        {activeTab === 'OFFICERS' && (
          <div style={{ padding: '1.75rem' }}>
            {/* Executive Directorate Header */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(2, 132, 199, 0.08) 100%)',
              border: '1.5px solid var(--secondary-color)',
              borderRadius: '16px',
              padding: '1.25rem 1.5rem',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '0.35rem' }}>
                  <span style={{
                    background: 'var(--secondary-color)',
                    color: '#111827',
                    fontWeight: 900,
                    fontSize: '0.75rem',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    textTransform: 'uppercase'
                  }}>
                    Governing Council
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
                    5 Executive Officers Directorate
                  </span>
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, margin: 0, color: 'var(--text-primary)' }}>
                  Authorized Executive Directorate Roster
                </h2>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '700px' }}>
                  All 5 Executive Officers are granted full Read, Write & Execute authority across Foundation Management, Documents Vault, Meeting Suite, and Media Gallery. Authenticated via registered Email/Phone & DOB passcode.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Link
                  href="/documents"
                  className="btn btn-outline"
                  style={{ fontSize: '0.8rem', padding: '0.45rem 0.9rem', gap: '6px', fontWeight: 700 }}
                >
                  <FileText size={14} color="var(--info-color)" /> Documents Vault
                </Link>
                <Link
                  href="/meetings"
                  className="btn btn-outline"
                  style={{ fontSize: '0.8rem', padding: '0.45rem 0.9rem', gap: '6px', fontWeight: 700 }}
                >
                  <Users size={14} color="var(--secondary-color)" /> Meeting Suite
                </Link>
                <Link
                  href="/gallery"
                  className="btn btn-outline"
                  style={{ fontSize: '0.8rem', padding: '0.45rem 0.9rem', gap: '6px', fontWeight: 700 }}
                >
                  <Sparkles size={14} color="#10B981" /> Media Gallery
                </Link>
              </div>
            </div>

            {/* 5 Executive Officers Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem'
            }}>
              {filteredOfficers.map((officer) => (
                <div
                  key={officer.id}
                  className="card"
                  style={{
                    borderRadius: '18px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--surface-color)',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {/* Top Bar with Sl No and Role badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 900,
                      color: 'var(--text-secondary)',
                      background: 'rgba(0,0,0,0.05)',
                      padding: '2px 8px',
                      borderRadius: '6px'
                    }}>
                      SL NO. {officer.slNo} • {officer.id}
                    </span>
                    <span style={{
                      fontSize: '0.78rem',
                      fontWeight: 900,
                      background: officer.role === 'President' ? 'var(--secondary-color)' :
                                  officer.role === 'Vice-Chairman' ? 'rgba(2, 132, 199, 0.15)' :
                                  officer.role === 'Managing Director' ? 'rgba(16, 185, 129, 0.15)' :
                                  officer.role === 'Secretary' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: officer.role === 'President' ? '#111827' :
                             officer.role === 'Vice-Chairman' ? 'var(--info-color)' :
                             officer.role === 'Managing Director' ? '#10B981' :
                             officer.role === 'Secretary' ? '#A855F7' : '#D97706',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {officer.role}
                    </span>
                  </div>

                  {/* Officer Portrait & Identity */}
                  <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div style={{
                      position: 'relative',
                      width: '76px',
                      height: '76px',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      border: '2px solid var(--secondary-color)',
                      flexShrink: 0,
                      background: 'var(--bg-color)'
                    }}>
                      <Image
                        src={officer.photo}
                        alt={officer.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="76px"
                      />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 900, margin: 0, color: 'var(--text-primary)' }}>
                        {officer.name}
                      </h3>
                      <p style={{ margin: '0.2rem 0 0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                        {officer.designation}
                      </p>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: '0.725rem',
                          fontWeight: 900,
                          padding: '2px 8px',
                          borderRadius: '8px',
                          background: 'rgba(239, 68, 68, 0.12)',
                          color: '#DC2626'
                        }}>
                          {officer.bloodGroup}
                        </span>
                        <span style={{
                          fontSize: '0.725rem',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '8px',
                          background: 'rgba(245, 158, 11, 0.15)',
                          color: '#D97706'
                        }}>
                          ★ Senior Citizen (60+)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div style={{
                    background: 'rgba(0,0,0,0.02)',
                    borderRadius: '12px',
                    padding: '0.85rem 1rem',
                    marginBottom: '1rem',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.825rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.4rem' }}>
                      <Mail size={14} color="var(--info-color)" />
                      <a href={`mailto:${officer.email}`} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 600 }}>
                        {officer.email}
                      </a>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Phone size={14} color="#10B981" />
                      <a href={`tel:${officer.cleanPhone}`} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 600 }}>
                        +91 {officer.phone}
                      </a>
                    </div>
                  </div>

                  {/* Authority Badges & Clearance Status */}
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ShieldCheck size={16} color="#10B981" />
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#10B981' }}>
                        Admin Clearance Active
                      </span>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                      DOB Authenticated
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ACTIVITY TAB CONTENT (Live Access & Surveillance Stream) */}
        {activeTab === 'ACTIVITY' && (
          <div>
            <div style={{
              padding: '1.25rem 1.5rem',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.06) 0%, rgba(16, 185, 129, 0.04) 100%)',
              borderBottom: '1px solid var(--border-color)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity size={20} color="#3B82F6" /> Real-Time Access & Surveillance Audit Stream
                  </h3>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Monitors logins, logouts, website accesses, and unauthorized intrusion attempts for all 5 Executive Officers.
                  </p>
                </div>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10B981',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                  Live Surveillance Radar Active
                </span>
              </div>
            </div>

            {filteredAuditLogs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-secondary)' }}>
                <Activity size={44} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
                <h4 style={{ margin: '0 0 4px', fontWeight: 800 }}>No activity events found</h4>
                <p style={{ margin: 0, fontSize: '0.85rem' }}>Try clearing the search query or selecting another filter pill.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr style={{ background: 'rgba(0,0,0,0.03)', color: 'var(--text-secondary)' }}>
                      <th style={{ padding: '0.9rem 1.25rem', fontWeight: 700 }}>Event & Action</th>
                      <th style={{ padding: '0.9rem 1.25rem', fontWeight: 700 }}>Officer / Member</th>
                      <th style={{ padding: '0.9rem 1.25rem', fontWeight: 700 }}>Contact Credentials</th>
                      <th style={{ padding: '0.9rem 1.25rem', fontWeight: 700 }}>Target Section / Page</th>
                      <th style={{ padding: '0.9rem 1.25rem', fontWeight: 700 }}>Date & Exact Time</th>
                      <th style={{ padding: '0.9rem 1.25rem', fontWeight: 700 }}>Status</th>
                      <th style={{ padding: '0.9rem 1.25rem', fontWeight: 700 }}>Audit Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAuditLogs.map((log) => {
                      const isLogin = log.type === 'SIGN_IN';
                      const isLogout = log.type === 'LOG_OUT';
                      const isPage = log.type === 'PAGE_ACCESS';
                      const isAttempt = log.type === 'ACCESS_ATTEMPT';

                      return (
                        <tr key={log.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          {/* Event & Action Badge */}
                          <td style={{ padding: '0.9rem 1.25rem' }}>
                            <span style={{
                              padding: '4px 10px',
                              borderRadius: '12px',
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              background: isLogin ? 'rgba(59, 130, 246, 0.15)' :
                                          isLogout ? 'rgba(249, 115, 22, 0.15)' :
                                          isPage ? 'rgba(16, 185, 129, 0.15)' :
                                          isAttempt ? 'rgba(239, 68, 68, 0.15)' : 'rgba(0,0,0,0.06)',
                              color: isLogin ? '#3B82F6' :
                                     isLogout ? '#F97316' :
                                     isPage ? '#10B981' :
                                     isAttempt ? '#EF4444' : 'var(--text-primary)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}>
                              {isLogin && <LogIn size={12} />}
                              {isLogout && <LogOut size={12} />}
                              {isPage && <Eye size={12} />}
                              {isAttempt && <ShieldAlert size={12} />}
                              {isLogin ? 'Logged In' :
                               isLogout ? 'Logged Out' :
                               isPage ? 'Website Access' :
                               isAttempt ? 'Access Attempt' : log.type}
                            </span>
                          </td>

                          {/* Officer / Member */}
                          <td style={{ padding: '0.9rem 1.25rem' }}>
                            <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                              {log.userName}
                            </div>
                            <div style={{ display: 'flex', gap: '4px', marginTop: '2px', flexWrap: 'wrap' }}>
                              {log.bloodGroup && (
                                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#DC2626', background: 'rgba(239, 68, 68, 0.1)', padding: '1px 6px', borderRadius: '4px' }}>
                                  {log.bloodGroup}
                                </span>
                              )}
                              {log.isSeniorCitizen && (
                                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#D97706', background: 'rgba(245, 158, 11, 0.12)', padding: '1px 6px', borderRadius: '4px' }}>
                                  ★ Senior Citizen
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Contact Credentials */}
                          <td style={{ padding: '0.9rem 1.25rem', fontSize: '0.825rem' }}>
                            <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                              {log.userEmail}
                            </div>
                            {log.userPhone && (
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                📞 {log.userPhone}
                              </div>
                            )}
                          </td>

                          {/* Target Section / Page */}
                          <td style={{ padding: '0.9rem 1.25rem' }}>
                            <span style={{
                              fontSize: '0.775rem',
                              fontWeight: 800,
                              padding: '3px 8px',
                              borderRadius: '6px',
                              background: 'var(--bg-color)',
                              border: '1px solid var(--border-color)',
                              color: 'var(--primary-color)'
                            }}>
                              {log.pageVisited || '/'}
                            </span>
                          </td>

                          {/* Date & Exact Time */}
                          <td style={{ padding: '0.9rem 1.25rem', fontSize: '0.825rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <Clock size={13} color="var(--text-secondary)" />
                              <span>{log.timestamp}</span>
                            </div>
                          </td>

                          {/* Status */}
                          <td style={{ padding: '0.9rem 1.25rem' }}>
                            <span style={{
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              padding: '3px 8px',
                              borderRadius: '6px',
                              background: log.status === 'BLOCKED' ? 'rgba(239, 68, 68, 0.15)' :
                                          isLogout ? 'rgba(249, 115, 22, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                              color: log.status === 'BLOCKED' ? '#EF4444' :
                                     isLogout ? '#F97316' : '#10B981'
                            }}>
                              {log.status === 'BLOCKED' ? 'Blocked / Denied' :
                               isLogout ? 'Logged Out' : 'Clearance Granted'}
                            </span>
                          </td>

                          {/* Audit Details */}
                          <td style={{ padding: '0.9rem 1.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '280px' }}>
                            {log.details}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL 1: ADD NEW OFFICIAL DONATION */}
      {showAddDonationModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(10, 25, 47, 0.85)', backdropFilter: 'blur(10px)', padding: '1.5rem'
          }}
          onClick={() => setShowAddDonationModal(false)}
        >
          <div
            className="card animate-fade-in"
            style={{
              maxWidth: '560px', width: '100%', borderRadius: '24px', padding: '2rem', position: 'relative',
              background: 'var(--surface-color-solid)', border: '2px solid var(--secondary-color)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAddDonationModal(false)}
              style={{
                position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'var(--surface-color)', border: '1px solid var(--border-color)',
                width: '34px', height: '34px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <X size={16} />
            </button>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={22} color="var(--secondary-color)" /> Record Official Foundation Donation
            </h3>

            <form onSubmit={handleCreateDonation} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={formLabel}>Donor Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mr. Amarjit Singha"
                  value={newDonationForm.donorName}
                  onChange={(e) => setNewDonationForm({ ...newDonationForm, donorName: e.target.value })}
                  style={formInput}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={formLabel}>Location *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cachar, Silchar"
                    value={newDonationForm.location}
                    onChange={(e) => setNewDonationForm({ ...newDonationForm, location: e.target.value })}
                    style={formInput}
                  />
                </div>
                <div>
                  <label style={formLabel}>Amount (INR ₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 1000"
                    value={newDonationForm.amount}
                    onChange={(e) => setNewDonationForm({ ...newDonationForm, amount: e.target.value })}
                    style={formInput}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={formLabel}>Receipt No (e.g. 015)</label>
                  <input
                    type="text"
                    placeholder="Auto or e.g. 015"
                    value={newDonationForm.receiptNo}
                    onChange={(e) => setNewDonationForm({ ...newDonationForm, receiptNo: e.target.value })}
                    style={formInput}
                  />
                </div>
                <div>
                  <label style={formLabel}>Date of Receipt</label>
                  <input
                    type="text"
                    placeholder="e.g. 12 Sept. 2026"
                    value={newDonationForm.date}
                    onChange={(e) => setNewDonationForm({ ...newDonationForm, date: e.target.value })}
                    style={formInput}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={formLabel}>Payment Method</label>
                  <select
                    value={newDonationForm.paymentMethod}
                    onChange={(e) => setNewDonationForm({ ...newDonationForm, paymentMethod: e.target.value })}
                    style={formInput}
                  >
                    <option value="UPI / Bank">UPI / Bank</option>
                    <option value="Direct Bank Transfer">Direct Bank Transfer</option>
                    <option value="Cash / Cheque">Cash / Cheque</option>
                  </select>
                </div>
                <div>
                  <label style={formLabel}>Receipt Status</label>
                  <select
                    value={newDonationForm.status}
                    onChange={(e) => setNewDonationForm({ ...newDonationForm, status: e.target.value as any })}
                    style={formInput}
                  >
                    <option value="SUCCESS">Verified (SUCCESS)</option>
                    <option value="PENDING">Awaiting Bank Reconciliation (PENDING)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={formLabel}>Purpose / Project Fund</label>
                <input
                  type="text"
                  placeholder="e.g. Health Welfare / Cultural Heritage"
                  value={newDonationForm.purpose}
                  onChange={(e) => setNewDonationForm({ ...newDonationForm, purpose: e.target.value })}
                  style={formInput}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddDonationModal(false)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ fontWeight: 800 }}
                >
                  Confirm & Save Donation Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: DONATION AUDIT RECORD */}
      {selectedDonation && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(10, 25, 47, 0.85)', backdropFilter: 'blur(8px)', padding: '1.5rem'
          }}
          onClick={() => setSelectedDonation(null)}
        >
          <div
            className="card animate-fade-in"
            style={{
              maxWidth: '540px', width: '100%', borderRadius: '20px', padding: '2rem', position: 'relative',
              background: 'var(--surface-color-solid)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedDonation(null)}
              style={{
                position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'var(--surface-color)', border: '1px solid var(--border-color)',
                width: '34px', height: '34px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <X size={16} />
            </button>

            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={22} color="var(--primary-color)" /> Official Donation Audit Record
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.925rem' }}>
              <div style={detailRow}><span>Receipt Number:</span><strong>{selectedDonation.receiptNo}</strong></div>
              <div style={detailRow}><span>Donation Ref ID:</span><code>{selectedDonation.publicDonationId}</code></div>
              <div style={detailRow}><span>Donor Name:</span><strong>{selectedDonation.donorName}</strong></div>
              <div style={detailRow}><span>Location:</span><span>{selectedDonation.location}</span></div>
              <div style={detailRow}><span>Amount:</span><strong style={{ fontSize: '1.2rem', color: 'var(--primary-color)' }}>₹{selectedDonation.amount.toLocaleString('en-IN')} INR</strong></div>
              <div style={detailRow}><span>Date of Receipt:</span><span>{selectedDonation.date}</span></div>
              <div style={detailRow}><span>Payment Method:</span><span>{selectedDonation.paymentMethod}</span></div>
              <div style={detailRow}><span>Purpose:</span><span>{selectedDonation.purpose}</span></div>
              <div style={detailRow}><span>Verified By:</span><span>{selectedDonation.verifiedBy || 'Leimarembi Foundation Head Office'}</span></div>
              <div style={detailRow}><span>Verification Status:</span><StatusBadge status={selectedDonation.status} /></div>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button onClick={() => { setPrintDonation(selectedDonation); setSelectedDonation(null); }} className="btn btn-outline" style={{ gap: '6px' }}>
                <Printer size={15} /> Print Receipt
              </button>
              <button onClick={() => setSelectedDonation(null)} className="btn btn-primary">
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: PRINTABLE OFFICIAL DONATION RECEIPT VOUCHER */}
      {printDonation && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed', inset: 0, zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(10, 25, 47, 0.9)', backdropFilter: 'blur(10px)', padding: '1.5rem'
          }}
          onClick={() => setPrintDonation(null)}
        >
          <div
            className="card animate-fade-in"
            style={{
              maxWidth: '650px', width: '100%', borderRadius: '20px', padding: '2.5rem 2rem', position: 'relative',
              background: '#FFFFFF', color: '#0F172A', border: '3px solid #D4AF37', boxShadow: '0 25px 60px rgba(0,0,0,0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Action Bar (Not in print) */}
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#D97706' }}>
                📜 Official Printable Voucher
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => window.print()}
                  style={{
                    background: '#1B2A57', color: '#FFFFFF', padding: '0.4rem 1rem', borderRadius: '8px', border: 'none',
                    fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                  }}
                >
                  <Printer size={14} /> Print Voucher
                </button>
                <button
                  onClick={() => setPrintDonation(null)}
                  style={{ background: '#F1F5F9', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Close
                </button>
              </div>
            </div>

            {/* PRINTABLE RECEIPT CONTAINER */}
            <div id="printable-receipt" style={{ padding: '0.5rem', border: '2px solid #D4AF37', borderRadius: '16px', background: '#FFFFFF' }}>
              {/* Receipt Header */}
              <div style={{ textAlign: 'center', borderBottom: '2px solid #0F172A', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '6px' }}>
                  <Image src="/leimarembi_official_logo.png" alt="Logo" width={48} height={48} style={{ borderRadius: '8px' }} />
                  <div>
                    <h2 style={{ fontSize: '1.45rem', fontWeight: 900, margin: 0, color: '#1B2A57', letterSpacing: '1px' }}>
                      LEIMAREMBI FOUNDATION
                    </h2>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748B' }}>
                      Manipuri Rajbari, Guwahati - 781007 • Head Office: Guwahati
                    </span>
                  </div>
                </div>
                <div style={{ display: 'inline-block', background: '#F8FAFC', padding: '3px 14px', borderRadius: '14px', border: '1px solid #CBD5E1', marginTop: '6px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#1E293B', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                    DONATION RECEIPT VOUCHER
                  </span>
                </div>
              </div>

              {/* Receipt Metadata Table */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                <div><strong>Receipt No:</strong> <span style={{ color: '#D97706', fontWeight: 900 }}>{printDonation.receiptNo}</span></div>
                <div><strong>Date:</strong> <span>{printDonation.date}</span></div>
                <div><strong>Ref ID:</strong> <code style={{ fontSize: '0.8rem' }}>{printDonation.publicDonationId}</code></div>
                <div><strong>Payment Mode:</strong> <span>{printDonation.paymentMethod}</span></div>
              </div>

              {/* Donor Box */}
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '4px' }}>Received with heartfelt thanks from:</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1B2A57' }}>{printDonation.donorName}</div>
                <div style={{ fontSize: '0.9rem', color: '#475569', marginTop: '2px' }}>📍 {printDonation.location}</div>
                <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px dashed #CBD5E1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Amount Contributed:</span>
                  <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#047857' }}>₹{printDonation.amount.toLocaleString('en-IN')}/-</span>
                </div>
              </div>

              {/* Purpose */}
              <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                <strong>Purpose of Contribution:</strong> Towards <em>{printDonation.purpose}</em> in support of community welfare, rural health, and indigenous cultural preservation in Northeast India.
              </div>

              {/* Signature Lines */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '1.5rem', borderTop: '1px solid #E2E8F0' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '140px', borderBottom: '1px solid #94A3B8', marginBottom: '4px' }}></div>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Accountant / Cashier</span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '160px', borderBottom: '1px solid #0F172A', marginBottom: '4px' }}></div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0F172A' }}>Authorized Signatory</span>
                  <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Leimarembi Foundation</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status, onClick, isClickable }: { status: string; onClick?: () => void; isClickable?: boolean }) {
  const cursorStyle = isClickable ? { cursor: 'pointer' } : {};
  if (status === 'SUCCESS') {
    return (
      <span 
        onClick={onClick}
        title={isClickable ? "Click to toggle status (Super Admin)" : undefined}
        style={{ ...cursorStyle, padding: '0.25rem 0.65rem', borderRadius: '6px', fontSize: '0.8rem', background: 'rgba(39, 174, 96, 0.12)', color: 'var(--success-color)', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
      >
        <CheckCircle2 size={13} /> VERIFIED
      </span>
    );
  }
  if (status === 'PENDING') {
    return (
      <span 
        onClick={onClick}
        title={isClickable ? "Click to toggle status (Super Admin)" : undefined}
        style={{ ...cursorStyle, padding: '0.25rem 0.65rem', borderRadius: '6px', fontSize: '0.8rem', background: 'rgba(212, 175, 55, 0.15)', color: 'var(--secondary-color)', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
      >
        <Clock size={13} /> PENDING
      </span>
    );
  }
  return (
    <span 
      onClick={onClick}
      style={{ ...cursorStyle, padding: '0.25rem 0.65rem', borderRadius: '6px', fontSize: '0.8rem', background: 'rgba(0,0,0,0.06)', color: 'var(--text-secondary)', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
    >
      <AlertCircle size={13} /> {status}
    </span>
  );
}

const detailRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.35rem 0',
  borderBottom: '1px dashed var(--border-color)',
};

const formLabel: React.CSSProperties = {
  display: 'block',
  fontSize: '0.825rem',
  fontWeight: 700,
  color: 'var(--text-secondary)',
  marginBottom: '4px'
};

const formInput: React.CSSProperties = {
  width: '100%',
  padding: '0.65rem 0.85rem',
  borderRadius: '10px',
  border: '1px solid var(--border-color)',
  background: 'var(--bg-color)',
  color: 'var(--text-primary)',
  fontSize: '0.9rem',
  outline: 'none'
};
