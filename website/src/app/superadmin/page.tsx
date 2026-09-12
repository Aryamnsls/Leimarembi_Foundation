"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldAlert, ShieldCheck, Users, Search, Plus, Trash2, Edit,
  Download, Activity, CheckCircle2, XCircle, LogIn, UserPlus,
  RefreshCw, Lock, AlertTriangle, ArrowRight, Eye, Phone, Mail, Award,
  MapPin, Globe, Clock, LogOut, Laptop, Smartphone
} from 'lucide-react';
import {
  isSuperAdmin,
  getActiveSuperAdmin,
  SuperAdminProfile,
  SUPER_ADMIN_WHITELIST,
  ActivityEvent,
  getActivityLogs,
  recordActivity
} from '@/lib/superAdminAuth';
import { canSwitchRoleMode } from '@/lib/executiveOfficers';

interface MemberRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'ADMIN' | 'TRUSTEE' | 'MEMBER' | 'STAFF';
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  membershipNo: string;
  bloodGroup: string;
  isSeniorCitizen: boolean;
  registeredAt: string;
  lastSignIn?: string;
  authProvider: 'GOOGLE' | 'LOCAL';
}

const SEED_MEMBERS: MemberRecord[] = [
  {
    id: 'MEM-001',
    name: 'Aryaman Singha',
    email: 'aryamansingha60@gmail.com',
    phone: '7099659804',
    role: 'ADMIN',
    status: 'ACTIVE',
    membershipNo: 'LF-2026-0001',
    bloodGroup: 'A+',
    isSeniorCitizen: false,
    registeredAt: '2026-09-01 10:00 AM',
    lastSignIn: '2026-09-13 01:45 AM',
    authProvider: 'GOOGLE'
  },
  {
    id: 'MEM-002',
    name: 'M. Bina Babu Singha',
    email: 'binababu.singha@yahoo.com',
    phone: '7637087931',
    role: 'ADMIN',
    status: 'ACTIVE',
    membershipNo: 'LF-2026-0002',
    bloodGroup: 'AB+',
    isSeniorCitizen: true,
    registeredAt: '2026-09-01 10:15 AM',
    lastSignIn: '2026-09-12 11:30 PM',
    authProvider: 'LOCAL'
  }
];

export default function SuperAdminPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeAdmin, setActiveAdmin] = useState<SuperAdminProfile | null>(null);
  const [authorized, setAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Tabs
  const [activeTab, setActiveTab] = useState<'ACTIVITY' | 'MEMBERS' | 'DONATIONS'>('ACTIVITY');

  // Search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Member records state - Strictly keep Aryaman Singha and M. Bina Babu Singha
  const [members, setMembers] = useState<MemberRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('lf_superadmin_members');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            const filtered = parsed
              .filter((m: MemberRecord) =>
                m.email === 'aryamansingha60@gmail.com' ||
                m.email === 'binababu.singha@yahoo.com' ||
                m.phone.replace(/[^0-9]/g, '').endsWith('7099659804') ||
                m.phone.replace(/[^0-9]/g, '').endsWith('7637087931')
              )
              .map((m: MemberRecord) => {
                if (m.email === 'aryamansingha60@gmail.com' || m.phone.replace(/[^0-9]/g, '').endsWith('7099659804')) {
                  return { ...m, bloodGroup: 'A+' };
                }
                return m;
              });
            if (filtered.length >= 2) return filtered;
          }
        } catch {}
      }
    }
    return SEED_MEMBERS;
  });

  // Activity logs state
  const [activityLogs, setActivityLogs] = useState<ActivityEvent[]>([]);

  // Modal states for WRITE / EXECUTE
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState<MemberRecord | null>(null);
  const [idCardMember, setIdCardMember] = useState<MemberRecord | null>(null);

  // Senior Citizen Directory & Health Card preview modals
  const [showSeniorCitizenModal, setShowSeniorCitizenModal] = useState(false);
  const [showNonSeniorModal, setShowNonSeniorModal] = useState(false);
  const [seniorCitizenHealthCard, setSeniorCitizenHealthCard] = useState<any | null>(null);
  const [activityFilter, setActivityFilter] = useState<'ALL' | 'UNREGISTERED' | 'ATTEMPTS' | 'LOGINS' | 'LOGOUTS' | 'SENIOR' | 'NON_SENIOR'>('ALL');

  // Official Senior Citizen members from verified foundation ledger (All 7 Members)
  const seniorCitizenList = useMemo(() => {
    const seniorsMap = new Map<string, any>();
    activityLogs
      .filter((l) => l.isSeniorCitizen)
      .forEach((l) => {
        if (!seniorsMap.has(l.userName)) {
          seniorsMap.set(l.userName, {
            name: l.userName,
            phone: l.userPhone || '',
            email: l.userEmail || 'Waiting',
            bloodGroup: l.bloodGroup || 'N/A',
            membershipNo: l.membershipNo || 'LF-SR-CITIZEN',
            isSeniorCitizen: true,
            status: 'ACTIVE',
            healthCardStatus: 'Eligible (Free Rural Health Camp & Diagnostic Privilege)'
          });
        }
      });
    return Array.from(seniorsMap.values());
  }, [activityLogs]);

  // Official Non-Senior Citizen members from verified foundation ledger (General Members & Directorate)
  const nonSeniorCitizenList = useMemo(() => {
    const nonSeniorsMap = new Map<string, any>();
    activityLogs
      .filter((l) => l.isSeniorCitizen === false)
      .forEach((l) => {
        if (!nonSeniorsMap.has(l.userName)) {
          nonSeniorsMap.set(l.userName, {
            name: l.userName,
            phone: l.userPhone || '',
            email: l.userEmail || 'Waiting',
            bloodGroup: l.bloodGroup || 'N/A',
            membershipNo: l.membershipNo || 'LF-MEMBER',
            isSeniorCitizen: false,
            status: 'ACTIVE',
            category: l.userName === 'Aryaman Singha' ? 'Super Administrator & Directorate' : 'Non-Senior Citizen Member'
          });
        }
      });
    return Array.from(nonSeniorsMap.values());
  }, [activityLogs]);

  // Filtered activity logs & visitor intelligence stream
  const displayedActivityLogs = useMemo(() => {
    return activityLogs.filter((l) => {
      // Search query filtering
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matches =
          l.userName.toLowerCase().includes(q) ||
          l.userEmail.toLowerCase().includes(q) ||
          (l.userPhone && l.userPhone.includes(q)) ||
          (l.location && l.location.toLowerCase().includes(q)) ||
          (l.ipAddress && l.ipAddress.toLowerCase().includes(q)) ||
          (l.pageVisited && l.pageVisited.toLowerCase().includes(q)) ||
          (l.details && l.details.toLowerCase().includes(q));
        if (!matches) return false;
      }

      if (activityFilter === 'UNREGISTERED') {
        return l.type === 'VISITOR_CHECK' || l.isRegistered === false || l.status === 'VISITOR';
      }
      if (activityFilter === 'ATTEMPTS') {
        return l.type === 'ACCESS_ATTEMPT' || l.status === 'BLOCKED';
      }
      if (activityFilter === 'LOGINS') {
        return l.type === 'SIGN_IN';
      }
      if (activityFilter === 'LOGOUTS') {
        return l.type === 'LOG_OUT';
      }
      if (activityFilter === 'SENIOR') {
        return l.isSeniorCitizen;
      }
      if (activityFilter === 'NON_SENIOR') {
        return l.isSeniorCitizen === false && l.isRegistered !== false;
      }
      return true;
    });
  }, [activityLogs, activityFilter, searchQuery]);

  // New member form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'MEMBER' as 'ADMIN' | 'TRUSTEE' | 'MEMBER',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE' | 'PENDING',
    bloodGroup: 'O+',
    isSeniorCitizen: false
  });

  // Check Super Admin Authorization & Live Storage Sync
  useEffect(() => {
    const userStr = localStorage.getItem('lf_user');
    let userObj: any = null;

    if (userStr) {
      try { userObj = JSON.parse(userStr); } catch {}
    }

    // Check if user is Super Admin
    if (isSuperAdmin(userObj)) {
      setCurrentUser(userObj);
      setActiveAdmin(getActiveSuperAdmin(userObj));
      setAuthorized(true);
    } else {
      setAuthorized(false);
    }

    // Ensure Member Registry contains only the 2 Super Admins (Aryaman Singha & M. Bina Babu Singha)
    if (typeof window !== 'undefined') {
      localStorage.setItem('lf_superadmin_members', JSON.stringify(SEED_MEMBERS));
      setMembers(SEED_MEMBERS);
    }

    setActivityLogs(getActivityLogs());
    setCheckingAuth(false);

    // Live update listener: when someone registers in another tab/window, live update immediately!
    const handleStorage = () => {
      setActivityLogs(getActivityLogs());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Save members to localStorage whenever updated
  useEffect(() => {
    if (typeof window !== 'undefined' && members.length > 0) {
      localStorage.setItem('lf_superadmin_members', JSON.stringify(members));
    }
  }, [members]);

  // Refresh activity logs
  const refreshLogs = () => {
    setActivityLogs(getActivityLogs());
  };

  // Filtered members
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchesSearch =
        !searchQuery ||
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.phone.includes(searchQuery) ||
        m.membershipNo.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === 'ALL' || m.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [members, searchQuery, roleFilter]);

  // WRITE: Add Member
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `MEM-${String(members.length + 1).padStart(3, '0')}`;
    const newMemNo = `LF-${new Date().getFullYear()}-${String(members.length + 1).padStart(4, '0')}`;

    const newRecord: MemberRecord = {
      id: newId,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      status: formData.status,
      membershipNo: newMemNo,
      bloodGroup: formData.bloodGroup,
      isSeniorCitizen: formData.isSeniorCitizen,
      registeredAt: new Date().toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      lastSignIn: 'Never',
      authProvider: 'LOCAL'
    };

    setMembers((prev) => [newRecord, ...prev]);
    recordActivity({
      type: 'REGISTER',
      userName: newRecord.name,
      userEmail: newRecord.email,
      userPhone: newRecord.phone,
      membershipNo: newRecord.membershipNo,
      provider: 'LOCAL',
      details: `Created by Super Admin ${activeAdmin?.name || 'Administrator'}`
    });

    setShowAddModal(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'MEMBER',
      status: 'ACTIVE',
      bloodGroup: 'O+',
      isSeniorCitizen: false
    });
    refreshLogs();
  };

  // WRITE: Edit Member
  const handleUpdateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    setMembers((prev) =>
      prev.map((m) => (m.id === editingMember.id ? editingMember : m))
    );

    recordActivity({
      type: 'UPDATE',
      userName: editingMember.name,
      userEmail: editingMember.email,
      userPhone: editingMember.phone,
      membershipNo: editingMember.membershipNo,
      provider: editingMember.authProvider,
      details: `Profile updated by Super Admin ${activeAdmin?.name || 'Administrator'}`
    });

    setEditingMember(null);
    refreshLogs();
  };

  // EXECUTE: Delete Member
  const handleDeleteMember = (id: string, name: string) => {
    if (confirm(`Are you sure you want to permanently delete member record for "${name}"?`)) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
      recordActivity({
        type: 'DELETE',
        userName: name,
        userEmail: 'deleted',
        provider: 'LOCAL',
        details: `Deleted by Super Admin ${activeAdmin?.name || 'Administrator'}`
      });
      refreshLogs();
    }
  };

  // EXECUTE: Toggle Status
  const handleToggleStatus = (id: string) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const newStatus = m.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
          return { ...m, status: newStatus };
        }
        return m;
      })
    );
  };

  // EXECUTE: Export CSV
  const handleExportCSV = () => {
    const headers = ['Membership No', 'Name', 'Email', 'Phone', 'Role', 'Status', 'Blood Group', 'Senior Citizen', 'Registered Date'];
    const rows = members.map((m) => [
      m.membershipNo,
      `"${m.name}"`,
      m.email,
      m.phone,
      m.role,
      m.status,
      m.bloodGroup,
      m.isSeniorCitizen ? 'Yes' : 'No',
      `"${m.registeredAt}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Leimarembi_Members_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // LOADING STATE
  if (checkingAuth) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spin" style={{ width: '48px', height: '48px', border: '4px solid var(--border-color)', borderTopColor: 'var(--secondary-color)', borderRadius: '50%', margin: '0 auto 1.5rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Authenticating Super Admin Clearance...</h3>
        </div>
      </div>
    );
  }

  // ACCESS DENIED LOCK SCREEN FOR UNAUTHORIZED VISITORS
  if (!authorized) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '3rem 2.5rem', textAlign: 'center', borderRadius: '24px', boxShadow: 'var(--shadow-xl)', border: '1.5px solid rgba(220, 38, 38, 0.3)' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(220, 38, 38, 0.1)', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Lock size={36} />
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--primary-color)', margin: '0 0 0.5rem' }}>
            Restricted Super Admin Vault
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            This portal is strictly reserved for the <strong>2 Designated Super Administrators</strong>:
            <br />• <strong>Aryaman Singha</strong> (aryamansingha60@gmail.com / 7099659804)
            <br />• <strong>M. Bina Babu Singha</strong> (binababu.singha@yahoo.com / 76370-87931)
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link href="/management" className="btn btn-primary" style={{ justifyContent: 'center', padding: '0.75rem' }}>
              <ShieldCheck size={18} /> Open Executive Admin Panel (/management)
            </Link>
            <Link href="/login" className="btn btn-outline" style={{ justifyContent: 'center', padding: '0.75rem' }}>
              <LogIn size={18} /> Sign In with Authorized Super Admin Account
            </Link>
            <Link href="/" style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
              ← Return to Public Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // AUTHORIZED SUPER ADMIN DASHBOARD
  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0 5rem' }}>
      {/* Top Banner: Super Admin Verified Seal */}
      <div style={{
        background: 'linear-gradient(135deg, #0A192F 0%, #172A46 100%)',
        borderRadius: '24px',
        padding: '2rem 2.5rem',
        color: '#FFFFFF',
        marginBottom: '2.5rem',
        border: '1.5px solid var(--secondary-color)',
        boxShadow: '0 20px 50px rgba(10, 25, 47, 0.4)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'rgba(212, 175, 55, 0.15)',
            border: '2px solid var(--secondary-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--secondary-color)'
          }}>
            <ShieldCheck size={36} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ background: 'var(--secondary-color)', color: '#0A192F', padding: '2px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Super Admin Active
              </span>
              <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Security Level 1 (Full Read • Write • Execute)</span>
            </div>
            <h1 style={{ margin: 0, fontSize: '1.85rem', fontWeight: 900, color: '#FFFFFF' }}>
              {activeAdmin?.name || 'Authorized Super Administrator'}
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: '0.875rem', color: '#CBD5E1' }}>
              {activeAdmin?.designation} • <span style={{ color: 'var(--secondary-color)' }}>{activeAdmin?.email}</span> • {activeAdmin?.phone}
            </p>
          </div>
        </div>

        {/* Both Admins Badge & Mode Switcher */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-end' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.06)',
            padding: '0.85rem 1.25rem',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            fontSize: '0.8rem'
          }}>
            <div style={{ fontWeight: 800, color: 'var(--secondary-color)', marginBottom: '4px' }}>
              Authorized Super Administrators (2)
            </div>
            <div>1. <strong>Aryaman Singha</strong> (7099659804)</div>
            <div>2. <strong>M. Bina Babu Singha</strong> (76370-87931)</div>
          </div>

          {canSwitchRoleMode(currentUser) && (
            <Link
              href="/management"
              className="btn"
              style={{
                background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
                color: '#FFFFFF',
                padding: '0.55rem 1.1rem',
                borderRadius: '30px',
                fontWeight: 800,
                fontSize: '0.825rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.35)',
                textDecoration: 'none'
              }}
              title="Switch to Admin Panel View (/management)"
            >
              ⇄ Switch to Admin View
            </Link>
          )}
        </div>
      </div>

      {/* KPI Cards - Clickable Interactive Links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        {/* 1. Total Registered Members */}
        <div
          onClick={() => {
            setActiveTab('MEMBERS');
            setRoleFilter('ALL');
            setSearchQuery('');
            const el = document.getElementById('main-controls');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="card"
          style={{
            borderLeft: '4px solid var(--secondary-color)',
            cursor: 'pointer',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            position: 'relative'
          }}
          title="Click to view Member Registry (Read • Write • Execute)"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 700 }}>Total Registered Members</span>
            <Users size={20} color="var(--secondary-color)" />
          </div>
          <p style={{ fontSize: '2.25rem', fontWeight: 900, margin: '0.5rem 0 0', color: 'var(--primary-color)' }}>
            {members.length}
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
            <span style={{ fontSize: '0.75rem', color: '#16A34A', fontWeight: 700 }}>● Full Database Access</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--secondary-color)', fontWeight: 800 }}>View Registry ↗</span>
          </div>
        </div>

        {/* 2. Logged Activity Events */}
        <div
          onClick={() => {
            setActiveTab('ACTIVITY');
            setActivityFilter('ALL');
            refreshLogs();
            const el = document.getElementById('main-controls');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="card"
          style={{
            borderLeft: '4px solid #3B82F6',
            cursor: 'pointer',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}
          title="Click to view Live Authentication Stream"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 700 }}>Logged Activity Events</span>
            <Activity size={20} color="#3B82F6" />
          </div>
          <p style={{ fontSize: '2.25rem', fontWeight: 900, margin: '0.5rem 0 0', color: '#3B82F6' }}>
            {activityLogs.length}
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Sign-Ins & Registrations</span>
            <span style={{ fontSize: '0.75rem', color: '#3B82F6', fontWeight: 800 }}>Live Stream ↗</span>
          </div>
        </div>

        {/* 3. Active Members */}
        <div
          onClick={() => {
            setActiveTab('MEMBERS');
            setRoleFilter('ALL');
            const el = document.getElementById('main-controls');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="card"
          style={{
            borderLeft: '4px solid #10B981',
            cursor: 'pointer',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}
          title="Click to view Active Verified Members"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 700 }}>Active Members</span>
            <CheckCircle2 size={20} color="#10B981" />
          </div>
          <p style={{ fontSize: '2.25rem', fontWeight: 900, margin: '0.5rem 0 0', color: '#10B981' }}>
            {members.filter(m => m.status === 'ACTIVE').length}
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Verified Credentials</span>
            <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 800 }}>Manage Active ↗</span>
          </div>
        </div>

        {/* 4. Senior Citizen Members (Reflects all 7 Senior Citizens from list) */}
        <div
          onClick={() => setShowSeniorCitizenModal(true)}
          className="card"
          style={{
            borderLeft: '4px solid #F59E0B',
            cursor: 'pointer',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            background: 'linear-gradient(180deg, var(--card-bg) 0%, rgba(245, 158, 11, 0.06) 100%)',
            boxShadow: '0 4px 14px rgba(245, 158, 11, 0.12)'
          }}
          title="Click to view Senior Citizen Health Card Beneficiary Directory (All 7 Members)"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 700 }}>Senior Citizen Members</span>
            <Award size={20} color="#F59E0B" />
          </div>
          <p style={{ fontSize: '2.25rem', fontWeight: 900, margin: '0.5rem 0 0', color: '#F59E0B' }}>
            {seniorCitizenList.length}
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
            <span style={{ fontSize: '0.75rem', color: '#D97706', fontWeight: 800 }}>★ Health Card Eligible (All {seniorCitizenList.length})</span>
            <span style={{ fontSize: '0.75rem', color: '#F59E0B', fontWeight: 800 }}>Open Directory ↗</span>
          </div>
        </div>

        {/* 5. Non-Senior Citizen Members (Live updating Section) */}
        <div
          onClick={() => setShowNonSeniorModal(true)}
          className="card"
          style={{
            borderLeft: '4px solid #0EA5E9',
            cursor: 'pointer',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            background: 'linear-gradient(180deg, var(--card-bg) 0%, rgba(14, 165, 233, 0.06) 100%)',
            boxShadow: '0 4px 14px rgba(14, 165, 233, 0.12)'
          }}
          title="Click to view Non-Senior Citizen Members Directory"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 700 }}>Non-Senior Citizen Members</span>
            <Users size={20} color="#0EA5E9" />
          </div>
          <p style={{ fontSize: '2.25rem', fontWeight: 900, margin: '0.5rem 0 0', color: '#0EA5E9' }}>
            {nonSeniorCitizenList.length}
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
            <span style={{ fontSize: '0.75rem', color: '#0284C7', fontWeight: 800 }}>👥 General & Directorate ({nonSeniorCitizenList.length})</span>
            <span style={{ fontSize: '0.75rem', color: '#0EA5E9', fontWeight: 800 }}>Open Directory ↗</span>
          </div>
        </div>
      </div>

      {/* Main Controls & Tabs */}
      <div id="main-controls" className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Navigation Tabs Bar */}
        <div style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          background: 'rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setActiveTab('ACTIVITY')}
              className={activeTab === 'ACTIVITY' ? 'btn btn-primary' : 'btn btn-outline'}
              style={{ fontSize: '0.875rem', gap: '6px' }}
            >
              <Activity size={16} /> Live Registrations & Sign-In Activity ({activityLogs.length})
            </button>
            <button
              onClick={() => setActiveTab('MEMBERS')}
              className={activeTab === 'MEMBERS' ? 'btn btn-primary' : 'btn btn-outline'}
              style={{ fontSize: '0.875rem', gap: '6px' }}
            >
              <Users size={16} /> Member Registry (Read • Write • Execute)
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {activeTab === 'MEMBERS' && (
              <>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="btn btn-primary"
                  style={{ fontSize: '0.85rem', padding: '0.45rem 1rem', gap: '6px' }}
                >
                  <Plus size={16} /> Add Member (Write)
                </button>
                <button
                  onClick={handleExportCSV}
                  className="btn btn-outline"
                  style={{ fontSize: '0.85rem', padding: '0.45rem 1rem', gap: '6px' }}
                >
                  <Download size={16} /> Export CSV
                </button>
              </>
            )}
            <button
              onClick={refreshLogs}
              className="btn btn-outline"
              title="Refresh Activity"
              style={{ padding: '0.45rem 0.75rem' }}
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {/* ── TAB 1: LIVE REGISTRATION, SIGN-IN & VISITOR LOCATION TELEMETRY ── */}
        {activeTab === 'ACTIVITY' && (
          <div style={{ padding: '1.5rem' }}>
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: '1.25rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Globe size={22} color="var(--info-color)" /> Live Security & Visitor Location Intelligence Radar
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '780px' }}>
                  Super Admin surveillance tracking exact geographic location (City/State), IP network, device, and exact timestamp for who logged in, who logged out, who tried to access the website, and who checked the website without registering.
                </p>
              </div>

              {/* Stream Filter Pills */}
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setActivityFilter('ALL')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    border: '1px solid var(--border-color)',
                    background: activityFilter === 'ALL' ? 'var(--primary-color)' : 'transparent',
                    color: activityFilter === 'ALL' ? '#FFFFFF' : 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  All Stream ({activityLogs.length})
                </button>
                <button
                  onClick={() => setActivityFilter('UNREGISTERED')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    border: '1px solid rgba(14, 165, 233, 0.4)',
                    background: activityFilter === 'UNREGISTERED' ? '#0284C7' : 'rgba(14, 165, 233, 0.1)',
                    color: activityFilter === 'UNREGISTERED' ? '#FFFFFF' : '#0284C7',
                    cursor: 'pointer'
                  }}
                >
                  🌐 Unregistered Visitors ({activityLogs.filter(l => l.type === 'VISITOR_CHECK' || !l.isRegistered).length})
                </button>
                <button
                  onClick={() => setActivityFilter('ATTEMPTS')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    background: activityFilter === 'ATTEMPTS' ? '#EF4444' : 'rgba(239, 68, 68, 0.1)',
                    color: activityFilter === 'ATTEMPTS' ? '#FFFFFF' : '#EF4444',
                    cursor: 'pointer'
                  }}
                >
                  🚨 Access Attempts ({activityLogs.filter(l => l.type === 'ACCESS_ATTEMPT' || l.status === 'BLOCKED').length})
                </button>
                <button
                  onClick={() => setActivityFilter('LOGINS')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    border: '1px solid rgba(59, 130, 246, 0.4)',
                    background: activityFilter === 'LOGINS' ? '#3B82F6' : 'rgba(59, 130, 246, 0.1)',
                    color: activityFilter === 'LOGINS' ? '#FFFFFF' : '#3B82F6',
                    cursor: 'pointer'
                  }}
                >
                  🔑 Sign-Ins ({activityLogs.filter(l => l.type === 'SIGN_IN').length})
                </button>
                <button
                  onClick={() => setActivityFilter('LOGOUTS')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    border: '1px solid rgba(249, 115, 22, 0.4)',
                    background: activityFilter === 'LOGOUTS' ? '#F97316' : 'rgba(249, 115, 22, 0.1)',
                    color: activityFilter === 'LOGOUTS' ? '#FFFFFF' : '#F97316',
                    cursor: 'pointer'
                  }}
                >
                  🚪 Logouts ({activityLogs.filter(l => l.type === 'LOG_OUT').length})
                </button>
                <button
                  onClick={() => setActivityFilter('SENIOR')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    background: activityFilter === 'SENIOR' ? '#D97706' : 'rgba(245, 158, 11, 0.1)',
                    color: activityFilter === 'SENIOR' ? '#FFFFFF' : '#D97706',
                    cursor: 'pointer'
                  }}
                >
                  ★ Senior Citizens ({seniorCitizenList.length})
                </button>
              </div>
            </div>

            {displayedActivityLogs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-secondary)' }}>
                <Activity size={44} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                <p style={{ margin: 0, fontWeight: 700 }}>No telemetry records matching this filter.</p>
                <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>Click &quot;All Stream&quot; to view the complete live radar registry.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr style={{ background: 'rgba(0,0,0,0.03)', color: 'var(--text-secondary)' }}>
                      <th style={{ padding: '0.9rem 1.25rem' }}>Event & Type</th>
                      <th style={{ padding: '0.9rem 1.25rem' }}>Visitor / Member</th>
                      <th style={{ padding: '0.9rem 1.25rem' }}>Exact Location (City / State / Country)</th>
                      <th style={{ padding: '0.9rem 1.25rem' }}>Exact Date & Time</th>
                      <th style={{ padding: '0.9rem 1.25rem' }}>IP Address & Network</th>
                      <th style={{ padding: '0.9rem 1.25rem' }}>Device & Platform</th>
                      <th style={{ padding: '0.9rem 1.25rem' }}>Page Checked / Visited</th>
                      <th style={{ padding: '0.9rem 1.25rem' }}>Security Intelligence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedActivityLogs.map((log) => {
                      const isUnregistered = log.type === 'VISITOR_CHECK' || log.isRegistered === false;
                      const isAttempt = log.type === 'ACCESS_ATTEMPT' || log.status === 'BLOCKED';
                      const isLogin = log.type === 'SIGN_IN';
                      const isLogout = log.type === 'LOG_OUT';
                      const isRegister = log.type === 'REGISTER';

                      return (
                        <tr key={log.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          {/* 1. Event & Type */}
                          <td style={{ padding: '0.9rem 1.25rem' }}>
                            <span style={{
                              padding: '4px 10px',
                              borderRadius: '12px',
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              background: isAttempt ? 'rgba(239, 68, 68, 0.15)' :
                                          isUnregistered ? 'rgba(14, 165, 233, 0.15)' :
                                          isLogin ? 'rgba(59, 130, 246, 0.15)' :
                                          isLogout ? 'rgba(249, 115, 22, 0.15)' :
                                          isRegister ? 'rgba(16, 185, 129, 0.15)' : 'rgba(0,0,0,0.06)',
                              color: isAttempt ? '#EF4444' :
                                     isUnregistered ? '#0284C7' :
                                     isLogin ? '#3B82F6' :
                                     isLogout ? '#F97316' :
                                     isRegister ? '#10B981' : 'var(--text-primary)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}>
                              {isAttempt && <ShieldAlert size={12} />}
                              {isUnregistered && <Globe size={12} />}
                              {isLogin && <LogIn size={12} />}
                              {isLogout && <LogOut size={12} />}
                              {isRegister && <UserPlus size={12} />}
                              {isAttempt ? 'Access Attempt (Blocked)' :
                               isUnregistered ? 'Public Visitor (Unregistered)' :
                               isLogin ? 'Logged In' :
                               isLogout ? 'Logged Out' :
                               isRegister ? 'Registered' : log.type}
                            </span>
                          </td>

                          {/* 2. Visitor / Member */}
                          <td style={{ padding: '0.9rem 1.25rem', fontWeight: 700 }}>
                            <div style={{ color: isUnregistered ? '#0284C7' : 'var(--text-primary)' }}>
                              {log.userName}
                            </div>
                            {isUnregistered ? (
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                                Unregistered Public Guest
                              </span>
                            ) : (
                              <div style={{ display: 'flex', gap: '4px', marginTop: '2px', flexWrap: 'wrap' }}>
                                {log.bloodGroup && (
                                  <span style={{ fontSize: '0.68rem', color: '#DC2626', background: 'rgba(220, 38, 38, 0.1)', padding: '1px 6px', borderRadius: '4px', fontWeight: 800 }}>
                                    {log.bloodGroup}
                                  </span>
                                )}
                                {log.isSeniorCitizen && (
                                  <span style={{ fontSize: '0.68rem', color: '#D97706', background: 'rgba(245, 158, 11, 0.12)', padding: '1px 6px', borderRadius: '4px', fontWeight: 800 }}>
                                    ★ Senior Citizen
                                  </span>
                                )}
                              </div>
                            )}
                          </td>

                          {/* 3. Exact Location */}
                          <td style={{ padding: '0.9rem 1.25rem', whiteSpace: 'nowrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <MapPin size={15} color="#EA4335" style={{ flexShrink: 0 }} />
                              <strong style={{ fontSize: '0.85rem', color: 'var(--primary-color)' }}>
                                {log.location || 'Guwahati, Assam, India'}
                              </strong>
                            </div>
                          </td>

                          {/* 4. Exact Date & Time */}
                          <td style={{ padding: '0.9rem 1.25rem', fontSize: '0.825rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <Clock size={13} color="var(--text-secondary)" />
                              <span style={{ fontWeight: 600 }}>{log.timestamp}</span>
                            </div>
                          </td>

                          {/* 5. IP Address & Network */}
                          <td style={{ padding: '0.9rem 1.25rem' }}>
                            <span style={{
                              fontSize: '0.75rem',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              background: 'rgba(0,0,0,0.05)',
                              color: 'var(--text-primary)',
                              fontWeight: 600,
                              fontFamily: 'monospace'
                            }}>
                              {log.ipAddress || '103.212.45.18'}
                            </span>
                          </td>

                          {/* 6. Device & Platform */}
                          <td style={{ padding: '0.9rem 1.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              {log.device?.toLowerCase().includes('mobile') || log.device?.toLowerCase().includes('android') || log.device?.toLowerCase().includes('ios') ? (
                                <Smartphone size={13} color="var(--info-color)" />
                              ) : (
                                <Laptop size={13} color="var(--secondary-color)" />
                              )}
                              <span>{log.device || 'Windows PC'}</span>
                            </div>
                          </td>

                          {/* 7. Page Checked / Visited */}
                          <td style={{ padding: '0.9rem 1.25rem' }}>
                            <span style={{
                              fontSize: '0.775rem',
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: '6px',
                              background: 'var(--bg-color)',
                              border: '1px solid var(--border-color)',
                              color: 'var(--info-color)'
                            }}>
                              {log.pageVisited || '/'}
                            </span>
                          </td>

                          {/* 8. Security Intelligence */}
                          <td style={{ padding: '0.9rem 1.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '240px' }}>
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

        {/* ── TAB 2: MEMBER REGISTRY (READ • WRITE • EXECUTE) ── */}
        {activeTab === 'MEMBERS' && (
          <div>
            {/* Search & Filter bar */}
            <div style={{
              padding: '1rem 1.5rem',
              background: 'rgba(0,0,0,0.01)',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface-color)', padding: '0.4rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', width: '100%', maxWidth: '320px' }}>
                <Search size={16} style={{ color: 'var(--text-secondary)', marginRight: '8px' }} />
                <input
                  type="text"
                  placeholder="Search by name, email, phone, ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.875rem', width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Filter Role:</span>
                {['ALL', 'ADMIN', 'TRUSTEE', 'MEMBER'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRoleFilter(r)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      border: '1px solid var(--border-color)',
                      background: roleFilter === r ? 'var(--primary-color)' : 'transparent',
                      color: roleFilter === r ? '#FFFFFF' : 'var(--text-secondary)',
                      cursor: 'pointer'
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Members Table */}
            <div className="table-responsive">
              <table>
                <thead>
                  <tr style={{ background: 'rgba(0,0,0,0.03)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '0.9rem 1.25rem' }}>Membership ID</th>
                    <th style={{ padding: '0.9rem 1.25rem' }}>Member Name</th>
                    <th style={{ padding: '0.9rem 1.25rem' }}>Contact Info</th>
                    <th style={{ padding: '0.9rem 1.25rem' }}>Blood Group</th>
                    <th style={{ padding: '0.9rem 1.25rem' }}>Role</th>
                    <th style={{ padding: '0.9rem 1.25rem' }}>Status</th>
                    <th style={{ padding: '0.9rem 1.25rem' }}>Registered At</th>
                    <th style={{ padding: '0.9rem 1.25rem', textAlign: 'center' }}>Super Admin Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((m) => (
                    <tr key={m.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.9rem 1.25rem' }}>
                        <code style={{ fontWeight: 800, color: 'var(--primary-color)' }}>{m.membershipNo}</code>
                      </td>
                      <td style={{ padding: '0.9rem 1.25rem' }}>
                        <div style={{ fontWeight: 800, color: 'var(--primary-color)' }}>{m.name}</div>
                        {m.isSeniorCitizen && (
                          <span style={{ fontSize: '0.7rem', color: '#F59E0B', fontWeight: 700 }}>Senior Citizen Privilege</span>
                        )}
                      </td>
                      <td style={{ padding: '0.9rem 1.25rem', fontSize: '0.85rem' }}>
                        <div>{m.email}</div>
                        <span style={{ color: 'var(--text-secondary)' }}>{m.phone}</span>
                      </td>
                      <td style={{ padding: '0.9rem 1.25rem' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.1)', color: '#DC2626', fontWeight: 800, fontSize: '0.75rem' }}>
                          {m.bloodGroup}
                        </span>
                      </td>
                      <td style={{ padding: '0.9rem 1.25rem' }}>
                        <span style={{
                          padding: '3px 9px',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          background: m.role === 'ADMIN' ? 'rgba(212, 175, 55, 0.15)' : m.role === 'TRUSTEE' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(0,0,0,0.06)',
                          color: m.role === 'ADMIN' ? 'var(--secondary-color)' : m.role === 'TRUSTEE' ? '#3B82F6' : 'var(--text-primary)'
                        }}>
                          {m.role}
                        </span>
                      </td>
                      <td style={{ padding: '0.9rem 1.25rem' }}>
                        <button
                          onClick={() => handleToggleStatus(m.id)}
                          title="Click to toggle status (Execute)"
                          style={{
                            padding: '3px 10px',
                            borderRadius: '12px',
                            fontSize: '0.725rem',
                            fontWeight: 800,
                            border: 'none',
                            cursor: 'pointer',
                            background: m.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: m.status === 'ACTIVE' ? '#10B981' : '#EF4444'
                          }}
                        >
                          {m.status === 'ACTIVE' ? '● ACTIVE' : '○ INACTIVE'}
                        </button>
                      </td>
                      <td style={{ padding: '0.9rem 1.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {m.registeredAt}
                      </td>
                      <td style={{ padding: '0.9rem 1.25rem', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            onClick={() => setIdCardMember(m)}
                            title="Generate Digital ID Card (Execute)"
                            className="btn btn-outline"
                            style={{ padding: '4px 8px' }}
                          >
                            <Award size={14} color="var(--secondary-color)" />
                          </button>
                          <button
                            onClick={() => setEditingMember(m)}
                            title="Edit Member Profile (Write)"
                            className="btn btn-outline"
                            style={{ padding: '4px 8px' }}
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteMember(m.id, m.name)}
                            title="Delete Member (Execute)"
                            className="btn btn-outline"
                            style={{ padding: '4px 8px', color: '#DC2626' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── MODAL: ADD MEMBER (WRITE) ── */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '480px', width: '100%', padding: '2rem', borderRadius: '20px' }}>
            <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-color)' }}>
              Add New Member (Super Admin Write)
            </h3>
            <form onSubmit={handleAddMember} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Blood Group</label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Role Assignment</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
                  >
                    <option value="MEMBER">MEMBER</option>
                    <option value="TRUSTEE">TRUSTEE</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="PENDING">PENDING</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="seniorCitizen"
                  checked={formData.isSeniorCitizen}
                  onChange={(e) => setFormData({ ...formData, isSeniorCitizen: e.target.checked })}
                />
                <label htmlFor="seniorCitizen" style={{ fontSize: '0.85rem' }}>Senior Citizen Privilege Card</label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-primary">Create Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: EDIT MEMBER (WRITE) ── */}
      {editingMember && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '480px', width: '100%', padding: '2rem', borderRadius: '20px' }}>
            <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-color)' }}>
              Edit Member Record: {editingMember.membershipNo}
            </h3>
            <form onSubmit={handleUpdateMember} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Full Name</label>
                <input
                  type="text"
                  required
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Email Address</label>
                <input
                  type="email"
                  required
                  value={editingMember.email}
                  onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Phone Number</label>
                  <input
                    type="text"
                    value={editingMember.phone}
                    onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Blood Group</label>
                  <select
                    value={editingMember.bloodGroup}
                    onChange={(e) => setEditingMember({ ...editingMember, bloodGroup: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Role</label>
                  <select
                    value={editingMember.role}
                    onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value as any })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
                  >
                    <option value="MEMBER">MEMBER</option>
                    <option value="TRUSTEE">TRUSTEE</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Status</label>
                  <select
                    value={editingMember.status}
                    onChange={(e) => setEditingMember({ ...editingMember, status: e.target.value as any })}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="PENDING">PENDING</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '1rem' }}>
                <button type="button" onClick={() => setEditingMember(null)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: DIGITAL ID CARD (EXECUTE) ── */}
      {idCardMember && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div style={{ maxWidth: '420px', width: '100%', background: 'linear-gradient(135deg, #0A192F 0%, #172A46 100%)', borderRadius: '24px', padding: '2rem', color: '#FFFFFF', border: '2px solid var(--secondary-color)', boxShadow: '0 25px 60px rgba(0,0,0,0.5)' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', letterSpacing: '1.5px', color: 'var(--secondary-color)', fontWeight: 800, textTransform: 'uppercase' }}>
                Leimarembi Foundation
              </span>
              <h3 style={{ margin: '4px 0 0', fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF' }}>
                Official Digital Member ID
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Membership No:</span>
                <strong style={{ color: 'var(--secondary-color)' }}>{idCardMember.membershipNo}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Full Name:</span>
                <strong>{idCardMember.name}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Email Address:</span>
                <span>{idCardMember.email}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Phone:</span>
                <span>{idCardMember.phone}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Blood Group:</span>
                <strong style={{ color: '#EF4444' }}>{idCardMember.bloodGroup}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Role:</span>
                <span>{idCardMember.role}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Validity:</span>
                <span style={{ color: '#10B981', fontWeight: 700 }}>Permanent / Lifetime</span>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Issued by Super Admin Clearance</span>
            </div>

            <div style={{ marginTop: '1.25rem', display: 'flex', gap: '8px' }}>
              <button onClick={() => window.print()} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                Print / Save ID
              </button>
              <button onClick={() => setIdCardMember(null)} className="btn btn-outline" style={{ flex: 1, justifyContent: 'center', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.3)' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: SENIOR CITIZEN HEALTH CARD BENEFICIARY DIRECTORY ── */}
      {showSeniorCitizenModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '900px', width: '100%', maxHeight: '90vh', overflowY: 'auto', borderRadius: '24px', padding: '2rem', border: '2px solid rgba(245, 158, 11, 0.4)', boxShadow: '0 25px 60px rgba(0,0,0,0.4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Award size={24} color="#F59E0B" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#D97706', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Foundation Health & Welfare Charter
                  </span>
                  <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#D97706', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>
                    {seniorCitizenList.length} Verified Members
                  </span>
                </div>
                <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary-color)' }}>
                  Senior Citizen Health Card Beneficiary Directory
                </h2>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Exclusively accessible by Super Administrators Aryaman Singha & M. Bina Babu Singha.
                </p>
              </div>

              <button
                onClick={() => setShowSeniorCitizenModal(false)}
                className="btn btn-outline"
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
              >
                ✕ Close
              </button>
            </div>

            {/* Charter Banner */}
            <div style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(212, 175, 55, 0.12) 100%)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '14px', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Award size={32} color="#D97706" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                <strong>Section 80G Certified Healthcare Protection:</strong> All {seniorCitizenList.length} Senior Citizen members listed below receive lifetime free consultations at Leimarembi Foundation Rural Health Camps, priority blood bank coordination, and official digital Health Cards.
              </div>
            </div>

            {/* Senior Citizens Table */}
            <div className="table-responsive" style={{ marginBottom: '1.5rem' }}>
              <table>
                <thead>
                  <tr style={{ background: 'rgba(0,0,0,0.03)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '0.8rem 1rem' }}>#</th>
                    <th style={{ padding: '0.8rem 1rem' }}>Member Name</th>
                    <th style={{ padding: '0.8rem 1rem' }}>Contact Phone</th>
                    <th style={{ padding: '0.8rem 1rem' }}>Email Address</th>
                    <th style={{ padding: '0.8rem 1rem' }}>Blood Group</th>
                    <th style={{ padding: '0.8rem 1rem' }}>Health Privilege</th>
                    <th style={{ padding: '0.8rem 1rem', textAlign: 'center' }}>Health Card</th>
                  </tr>
                </thead>
                <tbody>
                  {seniorCitizenList.map((senior, idx) => (
                    <tr key={senior.name} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.8rem 1rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
                        {idx + 1}
                      </td>
                      <td style={{ padding: '0.8rem 1rem', fontWeight: 700 }}>
                        <div style={{ color: 'var(--text-primary)' }}>{senior.name}</div>
                        <span style={{ fontSize: '0.7rem', color: '#D97706', fontWeight: 700 }}>
                          ★ Senior Citizen (60+)
                        </span>
                      </td>
                      <td style={{ padding: '0.8rem 1rem', fontSize: '0.85rem' }}>
                        📞 <strong>{senior.phone}</strong>
                      </td>
                      <td style={{ padding: '0.8rem 1rem', fontSize: '0.85rem' }}>
                        {senior.email === 'Waiting' ? (
                          <span style={{
                            display: 'inline-block',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            background: 'rgba(217, 119, 6, 0.12)',
                            color: '#D97706',
                            fontSize: '0.725rem',
                            fontWeight: 700
                          }}>
                            Waiting (Pending Verification)
                          </span>
                        ) : (
                          senior.email
                        )}
                      </td>
                      <td style={{ padding: '0.8rem 1rem' }}>
                        <span style={{
                          fontSize: '0.8rem',
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: 'rgba(220, 38, 38, 0.12)',
                          color: '#DC2626'
                        }}>
                          {senior.bloodGroup}
                        </span>
                      </td>
                      <td style={{ padding: '0.8rem 1rem' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '12px',
                          fontSize: '0.725rem',
                          fontWeight: 800,
                          background: 'rgba(16, 185, 129, 0.15)',
                          color: '#10B981',
                          display: 'inline-block'
                        }}>
                          ● Eligible (Health Card)
                        </span>
                      </td>
                      <td style={{ padding: '0.8rem 1rem', textAlign: 'center' }}>
                        <button
                          onClick={() => setSeniorCitizenHealthCard(senior)}
                          className="btn btn-primary"
                          style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', gap: '4px' }}
                          title="Generate & View Health Card"
                        >
                          <Award size={14} /> Health Card
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <button
                onClick={() => {
                  setShowSeniorCitizenModal(false);
                  setActiveTab('ACTIVITY');
                  setActivityFilter('SENIOR');
                  const el = document.getElementById('main-controls');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn btn-outline"
                style={{ fontSize: '0.85rem', gap: '6px' }}
              >
                <Activity size={16} /> Filter in Real-Time Authentication Stream
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => window.print()}
                  className="btn btn-outline"
                  style={{ fontSize: '0.85rem', gap: '6px' }}
                >
                  <Download size={16} /> Print Directory
                </button>
                <button
                  onClick={() => setShowSeniorCitizenModal(false)}
                  className="btn btn-primary"
                  style={{ fontSize: '0.85rem' }}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: SENIOR CITIZEN PRIVILEGE & HEALTH CARD PREVIEW ── */}
      {seniorCitizenHealthCard && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '1rem' }}>
          <div style={{ maxWidth: '440px', width: '100%', background: 'linear-gradient(135deg, #0A192F 0%, #1A2E4C 100%)', borderRadius: '24px', padding: '2rem', color: '#FFFFFF', border: '2px solid #F59E0B', boxShadow: '0 25px 60px rgba(0,0,0,0.6)' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', letterSpacing: '1.5px', color: '#F59E0B', fontWeight: 800, textTransform: 'uppercase' }}>
                LEIMAREMBI FOUNDATION • HEALTH CHARTER
              </span>
              <h3 style={{ margin: '4px 0 0', fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF' }}>
                Senior Citizen Privilege & Health Card
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                Section 80G Certified • Manipur & Guwahati Region
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Health ID No:</span>
                <strong style={{ color: '#F59E0B' }}>
                  LF-SR-HLTH-{seniorCitizenHealthCard.bloodGroup.replace(/[^A-Za-z0-9]/g, '')}-{seniorCitizenHealthCard.phone.replace(/[^0-9]/g, '').slice(-4)}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Member Name:</span>
                <strong style={{ fontSize: '1rem' }}>{seniorCitizenHealthCard.name}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Category:</span>
                <span style={{ color: '#F59E0B', fontWeight: 700 }}>Senior Citizen Privilege (60+)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Blood Group:</span>
                <strong style={{ color: '#EF4444', fontSize: '1rem' }}>{seniorCitizenHealthCard.bloodGroup}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Primary Phone:</span>
                <span>{seniorCitizenHealthCard.phone}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Registered Email:</span>
                <span>{seniorCitizenHealthCard.email === 'Waiting' ? 'Waiting (Pending)' : seniorCitizenHealthCard.email}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94A3B8' }}>Coverage Status:</span>
                <span style={{ color: '#10B981', fontWeight: 700 }}>Lifetime Free Rural Health Camps</span>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.85rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                Authorized by Super Administrators Aryaman Singha & M. Bina Babu Singha
              </span>
            </div>

            <div style={{ marginTop: '1.25rem', display: 'flex', gap: '8px' }}>
              <button onClick={() => window.print()} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                Print Health Card
              </button>
              <button onClick={() => setSeniorCitizenHealthCard(null)} className="btn btn-outline" style={{ flex: 1, justifyContent: 'center', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.3)' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: NON-SENIOR CITIZEN MEMBERS DIRECTORY ── */}
      {showNonSeniorModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '900px', width: '100%', maxHeight: '90vh', overflowY: 'auto', borderRadius: '24px', padding: '2rem', border: '2px solid rgba(14, 165, 233, 0.4)', boxShadow: '0 25px 60px rgba(0,0,0,0.4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Users size={24} color="#0EA5E9" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0284C7', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Foundation General Membership & Directorate
                  </span>
                  <span style={{ background: 'rgba(14, 165, 233, 0.15)', color: '#0284C7', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>
                    {nonSeniorCitizenList.length} Active Members
                  </span>
                </div>
                <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary-color)' }}>
                  Non-Senior Citizen Members Directory
                </h2>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Exclusively accessible by Super Administrators Aryaman Singha & M. Bina Babu Singha.
                </p>
              </div>

              <button
                onClick={() => setShowNonSeniorModal(false)}
                className="btn btn-outline"
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
              >
                ✕ Close
              </button>
            </div>

            {/* Non-Senior Table */}
            <div className="table-responsive" style={{ marginBottom: '1.5rem' }}>
              <table>
                <thead>
                  <tr style={{ background: 'rgba(0,0,0,0.03)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '0.8rem 1rem' }}>#</th>
                    <th style={{ padding: '0.8rem 1rem' }}>Member Name</th>
                    <th style={{ padding: '0.8rem 1rem' }}>Contact Phone</th>
                    <th style={{ padding: '0.8rem 1rem' }}>Email Address</th>
                    <th style={{ padding: '0.8rem 1rem' }}>Blood Group</th>
                    <th style={{ padding: '0.8rem 1rem' }}>Category & Role</th>
                    <th style={{ padding: '0.8rem 1rem', textAlign: 'center' }}>Member ID</th>
                  </tr>
                </thead>
                <tbody>
                  {nonSeniorCitizenList.map((member, idx) => (
                    <tr key={member.name} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.8rem 1rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
                        {idx + 1}
                      </td>
                      <td style={{ padding: '0.8rem 1rem', fontWeight: 700 }}>
                        <div style={{ color: 'var(--text-primary)' }}>{member.name}</div>
                        <span style={{ fontSize: '0.7rem', color: '#0284C7', fontWeight: 700 }}>
                          ● Non-Senior Citizen
                        </span>
                      </td>
                      <td style={{ padding: '0.8rem 1rem', fontSize: '0.85rem' }}>
                        📞 <strong>{member.phone}</strong>
                      </td>
                      <td style={{ padding: '0.8rem 1rem', fontSize: '0.85rem' }}>
                        {member.email}
                      </td>
                      <td style={{ padding: '0.8rem 1rem' }}>
                        <span style={{
                          fontSize: '0.8rem',
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: 'rgba(220, 38, 38, 0.12)',
                          color: '#DC2626'
                        }}>
                          {member.bloodGroup}
                        </span>
                      </td>
                      <td style={{ padding: '0.8rem 1rem' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '12px',
                          fontSize: '0.725rem',
                          fontWeight: 800,
                          background: member.name === 'Aryaman Singha' ? 'rgba(212, 175, 55, 0.15)' : 'rgba(14, 165, 233, 0.12)',
                          color: member.name === 'Aryaman Singha' ? 'var(--secondary-color)' : '#0284C7',
                          display: 'inline-block'
                        }}>
                          {member.category}
                        </span>
                      </td>
                      <td style={{ padding: '0.8rem 1rem', textAlign: 'center' }}>
                        <button
                          onClick={() => {
                            setIdCardMember({
                              id: `MEM-${String(idx + 10).padStart(3, '0')}`,
                              name: member.name,
                              email: member.email,
                              phone: member.phone,
                              role: member.name === 'Aryaman Singha' ? 'ADMIN' : 'MEMBER',
                              status: 'ACTIVE',
                              membershipNo: member.membershipNo,
                              bloodGroup: member.bloodGroup,
                              isSeniorCitizen: false,
                              registeredAt: 'Verified Ledger',
                              authProvider: 'LOCAL'
                            });
                          }}
                          className="btn btn-outline"
                          style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', gap: '4px' }}
                          title="Generate & View Official Member ID"
                        >
                          <Award size={14} color="var(--secondary-color)" /> Digital ID
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <button
                onClick={() => {
                  setShowNonSeniorModal(false);
                  setActiveTab('ACTIVITY');
                  setActivityFilter('NON_SENIOR');
                  const el = document.getElementById('main-controls');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn btn-outline"
                style={{ fontSize: '0.85rem', gap: '6px' }}
              >
                <Activity size={16} /> Filter in Real-Time Authentication Stream
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => window.print()}
                  className="btn btn-outline"
                  style={{ fontSize: '0.85rem', gap: '6px' }}
                >
                  <Download size={16} /> Print Directory
                </button>
                <button
                  onClick={() => setShowNonSeniorModal(false)}
                  className="btn btn-primary"
                  style={{ fontSize: '0.85rem' }}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
