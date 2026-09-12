"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldAlert, ShieldCheck, Users, Search, Plus, Trash2, Edit,
  Download, Activity, CheckCircle2, XCircle, LogIn, UserPlus,
  RefreshCw, Lock, AlertTriangle, ArrowRight, Eye, Phone, Mail, Award
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
    bloodGroup: 'O+',
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
  },
  {
    id: 'MEM-003',
    name: 'Dr. Phuritsabam Birmani',
    email: 'birmani@leimarembifoundation.org',
    phone: '9436012345',
    role: 'TRUSTEE',
    status: 'ACTIVE',
    membershipNo: 'LF-2026-0003',
    bloodGroup: 'B+',
    isSeniorCitizen: true,
    registeredAt: '2026-09-02 02:20 PM',
    lastSignIn: '2026-09-11 04:10 PM',
    authProvider: 'LOCAL'
  },
  {
    id: 'MEM-004',
    name: 'K. Ajit Singh',
    email: 'ajit.singh@leimarembifoundation.org',
    phone: '9862054321',
    role: 'TRUSTEE',
    status: 'ACTIVE',
    membershipNo: 'LF-2026-0004',
    bloodGroup: 'A+',
    isSeniorCitizen: false,
    registeredAt: '2026-09-03 09:40 AM',
    lastSignIn: '2026-09-10 03:00 PM',
    authProvider: 'LOCAL'
  },
  {
    id: 'MEM-005',
    name: 'Ng. Baldev Singha',
    email: 'baldev.singha@leimarembifoundation.org',
    phone: '9435098765',
    role: 'TRUSTEE',
    status: 'ACTIVE',
    membershipNo: 'LF-2026-0005',
    bloodGroup: 'O+',
    isSeniorCitizen: true,
    registeredAt: '2026-09-04 11:00 AM',
    lastSignIn: '2026-09-09 06:15 PM',
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

  // Member records state
  const [members, setMembers] = useState<MemberRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('lf_superadmin_members');
      if (stored) {
        try { return JSON.parse(stored); } catch {}
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

  // Check Super Admin Authorization
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

    setActivityLogs(getActivityLogs());
    setCheckingAuth(false);
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
            <Link href="/login" className="btn btn-primary" style={{ justifyContent: 'center', padding: '0.75rem' }}>
              <LogIn size={18} /> Sign In with Authorized Super Admin Account
            </Link>
            <Link href="/" className="btn btn-outline" style={{ justifyContent: 'center', padding: '0.75rem' }}>
              Return to Public Home
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

        {/* Both Admins Badge */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.06)',
          padding: '1rem 1.25rem',
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
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--secondary-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 700 }}>Total Registered Members</span>
            <Users size={20} color="var(--secondary-color)" />
          </div>
          <p style={{ fontSize: '2.25rem', fontWeight: 900, margin: '0.5rem 0 0', color: 'var(--primary-color)' }}>
            {members.length}
          </p>
          <span style={{ fontSize: '0.75rem', color: '#16A34A', fontWeight: 700 }}>● Full Database Access</span>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #3B82F6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 700 }}>Logged Activity Events</span>
            <Activity size={20} color="#3B82F6" />
          </div>
          <p style={{ fontSize: '2.25rem', fontWeight: 900, margin: '0.5rem 0 0', color: '#3B82F6' }}>
            {activityLogs.length}
          </p>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Sign-Ins & Registrations</span>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #10B981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 700 }}>Active Members</span>
            <CheckCircle2 size={20} color="#10B981" />
          </div>
          <p style={{ fontSize: '2.25rem', fontWeight: 900, margin: '0.5rem 0 0', color: '#10B981' }}>
            {members.filter(m => m.status === 'ACTIVE').length}
          </p>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Verified Credentials</span>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #F59E0B' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 700 }}>Senior Citizen Members</span>
            <Award size={20} color="#F59E0B" />
          </div>
          <p style={{ fontSize: '2.25rem', fontWeight: 900, margin: '0.5rem 0 0', color: '#F59E0B' }}>
            {members.filter(m => m.isSeniorCitizen).length}
          </p>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Health Card Eligible</span>
        </div>
      </div>

      {/* Main Controls & Tabs */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
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

        {/* ── TAB 1: LIVE REGISTRATION & SIGN-IN ACTIVITY ── */}
        {activeTab === 'ACTIVITY' && (
          <div style={{ padding: '1.5rem' }}>
            <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: '1.15rem', fontWeight: 800 }}>Real-Time Authentication Stream</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Both Super Admins can monitor live user registrations and sign-ins across the platform.
                </p>
              </div>
            </div>

            {activityLogs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
                <Activity size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                <p style={{ margin: 0, fontWeight: 700 }}>No live sign-ins logged in this session yet.</p>
                <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>When anyone registers or logs in via Google or form, the timestamped event will stream here immediately.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr style={{ background: 'rgba(0,0,0,0.03)', color: 'var(--text-secondary)' }}>
                      <th style={{ padding: '0.85rem 1.25rem' }}>Event Type</th>
                      <th style={{ padding: '0.85rem 1.25rem' }}>User Name</th>
                      <th style={{ padding: '0.85rem 1.25rem' }}>Email / Phone</th>
                      <th style={{ padding: '0.85rem 1.25rem' }}>Auth Method</th>
                      <th style={{ padding: '0.85rem 1.25rem' }}>Timestamp</th>
                      <th style={{ padding: '0.85rem 1.25rem' }}>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activityLogs.map((log) => (
                      <tr key={log.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '0.85rem 1.25rem' }}>
                          <span style={{
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            background: log.type === 'REGISTER' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                            color: log.type === 'REGISTER' ? '#10B981' : '#3B82F6',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            {log.type === 'REGISTER' ? <UserPlus size={12} /> : <LogIn size={12} />}
                            {log.type}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700 }}>{log.userName}</td>
                        <td style={{ padding: '0.85rem 1.25rem' }}>
                          <div>{log.userEmail}</div>
                          {log.userPhone && <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{log.userPhone}</span>}
                        </td>
                        <td style={{ padding: '0.85rem 1.25rem' }}>
                          <span style={{
                            fontSize: '0.75rem',
                            padding: '2px 8px',
                            borderRadius: '8px',
                            background: log.provider === 'GOOGLE' ? 'rgba(234, 67, 53, 0.1)' : 'rgba(0,0,0,0.05)',
                            color: log.provider === 'GOOGLE' ? '#EA4335' : 'var(--text-primary)',
                            fontWeight: 700
                          }}>
                            {log.provider === 'GOOGLE' ? 'Google OAuth' : 'Standard Auth'}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          {log.timestamp}
                        </td>
                        <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.8rem' }}>
                          {log.details}
                        </td>
                      </tr>
                    ))}
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
    </div>
  );
}
