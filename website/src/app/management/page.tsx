"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { 
  Users, Search, Landmark, Heart, Shield, FileText, CheckCircle2, 
  Clock, XCircle, AlertCircle, Settings, Activity, UserCheck, 
  ShieldAlert, RefreshCw, LogOut, Edit3, X, Eye, Upload, Filter,
  Phone, Mail, MapPin, Award, Calendar, Check, ArrowUpRight,
  Download, Copy, ChevronDown, ChevronUp, Droplet, User, Sparkles,
  DollarSign, TrendingUp, PieChart, ShieldCheck, QrCode,
  ChevronLeft, ChevronRight, Menu, LayoutDashboard, Database,
  HelpCircle, ExternalLink, ShieldQuestion, Sliders, Bell,
  ChevronsLeft, ChevronsRight, PanelLeft, PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
import { api, getAuthUser, logoutUser } from '../../lib/api';

type Tab = 'MEMBERS' | 'DONATIONS' | 'WELFARE' | 'AUDIT' | 'SETTINGS';

export default function ManagementPortal() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('MEMBERS');
  const [mounted, setMounted] = useState(false);

  // Collapsible Sidebar state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);


  // Data states
  const [donations, setDonations] = useState<any[]>([]);
  const [donationMetrics, setDonationMetrics] = useState<any>({});
  const [members, setMembers] = useState<any[]>([]);
  const [welfareRequests, setWelfareRequests] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [settings, setSettings] = useState<any[]>([]);

  // UI / Filter states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Pagination states
  const [membersPerPage, setMembersPerPage] = useState<number>(10);
  const [currentMemberPage, setCurrentMemberPage] = useState<number>(1);

  // Member Filters
  const [memberRoleFilter, setMemberRoleFilter] = useState('ALL');
  const [memberStatusFilter, setMemberStatusFilter] = useState('ALL');
  const [memberBloodFilter, setMemberBloodFilter] = useState('ALL');

  // Donation Filters
  const [donationStatusFilter, setDonationStatusFilter] = useState('ALL');
  const [donationMethodFilter, setDonationMethodFilter] = useState('ALL');

  // Welfare Filters
  const [welfareStatusFilter, setWelfareStatusFilter] = useState('ALL');

  // Expanded Rows for Audit & Welfare
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [expandedWelfareId, setExpandedWelfareId] = useState<string | null>(null);

  // Modals
  const [selectedDonation, setSelectedDonation] = useState<any>(null);
  const [newDonationStatus, setNewDonationStatus] = useState('');
  const [txnRefInput, setTxnRefInput] = useState('');

  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [quickViewMember, setQuickViewMember] = useState<any>(null);

  const [editMemberForm, setEditMemberForm] = useState<any>({
    name: '',
    phone: '',
    address: '',
    bloodGroup: 'O+',
    isSeniorCitizen: false,
    designation: '',
    profilePhoto: '',
    bio: '',
    role: 'MEMBER',
    status: 'ACTIVE',
  });

  const [selectedWelfare, setSelectedWelfare] = useState<any>(null);
  const [newWelfareStatus, setNewWelfareStatus] = useState('');
  const [welfareNotes, setWelfareNotes] = useState('');
  const [welfareAmount, setWelfareAmount] = useState('');

  const [editSettingKey, setEditSettingKey] = useState<string | null>(null);
  const [editSettingValue, setEditSettingValue] = useState('');

  // Add Member Modal State
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberData, setNewMemberData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    bloodGroup: 'O+',
    isSeniorCitizen: false,
    familyMembersCount: 1,
    designation: '',
    profilePhoto: '',
    bio: '',
    role: 'MEMBER',
    status: 'ACTIVE',
  });

  // Client hydration check, URL/localStorage tab persistence & responsive sidebar auto-collapse
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 1200) {
        setIsSidebarCollapsed(true);
      }
      // Check query param or localStorage for saved tab
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') as Tab;
      const savedTab = localStorage.getItem('admin_management_active_tab') as Tab;
      const validTabs: Tab[] = ['MEMBERS', 'DONATIONS', 'WELFARE', 'AUDIT', 'SETTINGS'];
      if (tabParam && validTabs.includes(tabParam)) {
        setActiveTab(tabParam);
      } else if (savedTab && validTabs.includes(savedTab)) {
        setActiveTab(savedTab);
      }
    }
  }, []);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setSearchQuery('');
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_management_active_tab', tab);
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.replaceState(null, '', url.toString());
    }
  };

  // Reset pagination when search query or filters change
  useEffect(() => {
    setCurrentMemberPage(1);
  }, [searchQuery, memberRoleFilter, memberStatusFilter, memberBloodFilter, membersPerPage]);

  // Modal Scroll-Locking & Escape listener
  const hasActiveModal = Boolean(selectedMember || showAddMemberModal || selectedDonation || selectedWelfare || quickViewMember);
  useEffect(() => {
    if (hasActiveModal) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setSelectedMember(null);
          setQuickViewMember(null);
          setShowAddMemberModal(false);
          setSelectedDonation(null);
          setSelectedWelfare(null);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
  }, [hasActiveModal]);

  // ─── AUTH & ROLE CHECK ────────────────────────────────────────────────────
  useEffect(() => {
    const user = getAuthUser();
    if (!user) {
      router.push('/login');
      return;
    }
    const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'TRUSTEE', 'STAFF'];
    if (!allowedRoles.includes(user.role)) {
      setError('Access Denied: Executive credentials required to access the Foundation Management Portal.');
      setLoadingUser(false);
      return;
    }
    setCurrentUser(user);
    setLoadingUser(false);
  }, [router]);

  // ─── DATA FETCHING PER TAB ────────────────────────────────────────────────
  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [donRes, memRes, welRes] = await Promise.all([
        api.get('/finance/donations/admin/all').catch(() => ({ data: { donations: [], metrics: {} } })),
        api.get('/members').catch(() => ({ data: { members: [] } })),
        api.get('/welfare').catch(() => ({ data: { requests: [] } }))
      ]);
      
      const allDons = donRes.data?.donations || [];
      setDonations(allDons);
      setDonationMetrics(donRes.data?.metrics || {});
      
      const allMems = memRes.data?.members || memRes.data || [];
      setMembers(allMems);
      
      const allWelfare = welRes.data?.requests || welRes.data || [];
      setWelfareRequests(allWelfare);

      if (activeTab === 'AUDIT') {
        const res = await api.get('/audit');
        setAuditLogs(res.data.logs || res.data || []);
      } else if (activeTab === 'SETTINGS') {
        const res = await api.get('/settings/admin/all');
        setSettings(res.data || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch management data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser, activeTab]);

  // ─── COPY TO CLIPBOARD HELPER ─────────────────────────────────────────────
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ─── EXPORT TO CSV HELPERS ────────────────────────────────────────────────
  const exportMembersCSV = () => {
    if (filteredMembers.length === 0) return;
    const headers = ['MembershipID', 'Name', 'Email', 'Phone', 'Role', 'Status', 'Designation', 'BloodGroup', 'Address', 'SeniorCitizen'];
    const rows = filteredMembers.map(m => [
      `"${m.membershipNo || ''}"`,
      `"${(m.name || '').replace(/"/g, '""')}"`,
      `"${m.email || ''}"`,
      `"${m.phone || ''}"`,
      `"${m.role || ''}"`,
      `"${m.status || ''}"`,
      `"${(m.designation || '').replace(/"/g, '""')}"`,
      `"${m.bloodGroup || ''}"`,
      `"${(m.address || '').replace(/"/g, '""')}"`,
      m.isSeniorCitizen ? 'Yes' : 'No'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Leimarembi_Members_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportDonationsCSV = () => {
    if (filteredDonations.length === 0) return;
    const headers = ['ReceiptNo', 'PublicID', 'DonorName', 'Email', 'Phone', 'Amount', 'Currency', 'PaymentMethod', 'Status', 'PaidAt', 'Notes'];
    const rows = filteredDonations.map(d => [
      `"${d.receiptNo || ''}"`,
      `"${d.publicDonationId || ''}"`,
      `"${(d.donorName || '').replace(/"/g, '""')}"`,
      `"${d.email || ''}"`,
      `"${d.phone || ''}"`,
      d.amount,
      `"${d.currency || 'INR'}"`,
      `"${d.paymentMethod || ''}"`,
      `"${d.status || ''}"`,
      `"${d.paidAt || d.createdAt || ''}"`,
      `"${(d.notes || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Leimarembi_Donations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ─── QUICK STATUS TOGGLE ────────────────────────────────────────────────
  const toggleMemberStatus = async (m: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = m.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await api.patch(`/members/${m.id}/status`, { status: newStatus });
      setSuccessMsg(`Member ${m.name} status switched to ${newStatus}`);
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to toggle status');
    }
  };

  // ─── ACTION HANDLERS ──────────────────────────────────────────────────────
  const handleUpdateDonationStatus = async () => {
    if (!selectedDonation || !newDonationStatus) return;
    try {
      await api.patch(`/finance/donations/admin/${selectedDonation.id}/status`, {
        status: newDonationStatus,
        transactionId: txnRefInput || undefined,
      });
      setSuccessMsg(`Donation ${selectedDonation.publicDonationId} status updated to ${newDonationStatus}`);
      setSelectedDonation(null);
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to update donation status');
    }
  };

  const handleOpenEditMember = (m: any) => {
    setSelectedMember(m);
    setEditMemberForm({
      name: m.name || '',
      phone: m.phone || '',
      address: m.address || '',
      bloodGroup: m.bloodGroup || 'O+',
      isSeniorCitizen: Boolean(m.isSeniorCitizen),
      designation: m.designation || '',
      profilePhoto: m.profilePhoto || '',
      bio: m.bio || '',
      role: m.role || 'MEMBER',
      status: m.status || 'ACTIVE',
    });
  };

  const handleUpdateMember = async () => {
    if (!selectedMember) return;
    try {
      await api.patch(`/members/${selectedMember.id}`, {
        name: editMemberForm.name,
        phone: editMemberForm.phone,
        address: editMemberForm.address,
        bloodGroup: editMemberForm.bloodGroup,
        isSeniorCitizen: editMemberForm.isSeniorCitizen,
        designation: editMemberForm.designation,
        profilePhoto: editMemberForm.profilePhoto,
        bio: editMemberForm.bio,
      });

      if (editMemberForm.status && editMemberForm.status !== selectedMember.status) {
        await api.patch(`/members/${selectedMember.id}/status`, { status: editMemberForm.status });
      }

      if (editMemberForm.role && editMemberForm.role !== selectedMember.role && currentUser?.role === 'SUPER_ADMIN') {
        await api.patch(`/members/${selectedMember.id}/role`, { role: editMemberForm.role });
      }

      setSuccessMsg(`Member ${editMemberForm.name || selectedMember.name} updated successfully.`);
      setSelectedMember(null);
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to update member');
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError('Photo file size exceeds 2MB limit. Please upload a smaller image.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      if (isEdit) {
        setEditMemberForm((prev: any) => ({ ...prev, profilePhoto: base64 }));
      } else {
        setNewMemberData((prev: any) => ({ ...prev, profilePhoto: base64 }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/members', newMemberData);
      setSuccessMsg(`Member ${newMemberData.name} created with ID ${res.data?.membershipNo || 'LF-2026'}.`);
      setShowAddMemberModal(false);
      setNewMemberData({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        bloodGroup: 'O+',
        isSeniorCitizen: false,
        familyMembersCount: 1,
        designation: '',
        profilePhoto: '',
        bio: '',
        role: 'MEMBER',
        status: 'ACTIVE',
      });
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to create member');
    }
  };

  const handleUpdateWelfare = async () => {
    if (!selectedWelfare || !newWelfareStatus) return;
    try {
      await api.patch(`/welfare/${selectedWelfare.id}/status`, {
        status: newWelfareStatus,
        adminNotes: welfareNotes,
        amountApproved: welfareAmount ? Number(welfareAmount) : undefined,
      });
      setSuccessMsg(`Welfare request updated.`);
      setSelectedWelfare(null);
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to update welfare request');
    }
  };

  const handleSaveSetting = async (key: string) => {
    try {
      await api.put(`/settings/${key}`, { value: editSettingValue });
      setSuccessMsg(`Setting '${key}' updated successfully.`);
      setEditSettingKey(null);
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to update setting');
    }
  };

  // ─── FILTERED DATA COMPUTATION ────────────────────────────────────────────
  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        m.name?.toLowerCase().includes(q) || 
        m.email?.toLowerCase().includes(q) ||
        m.membershipNo?.toLowerCase().includes(q) ||
        m.designation?.toLowerCase().includes(q) ||
        m.phone?.toLowerCase().includes(q) ||
        m.address?.toLowerCase().includes(q);

      const matchesRole = memberRoleFilter === 'ALL' || m.role === memberRoleFilter;
      const matchesStatus = memberStatusFilter === 'ALL' || m.status === memberStatusFilter;
      const matchesBlood = memberBloodFilter === 'ALL' || m.bloodGroup === memberBloodFilter;

      return matchesSearch && matchesRole && matchesStatus && matchesBlood;
    });
  }, [members, searchQuery, memberRoleFilter, memberStatusFilter, memberBloodFilter]);

  // Paginated Members slice
  const paginatedMembers = useMemo(() => {
    const start = (currentMemberPage - 1) * membersPerPage;
    return filteredMembers.slice(start, start + membersPerPage);
  }, [filteredMembers, currentMemberPage, membersPerPage]);

  const totalMemberPages = Math.max(1, Math.ceil(filteredMembers.length / membersPerPage));

  const filteredDonations = useMemo(() => {
    return donations.filter(d => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        d.donorName?.toLowerCase().includes(q) || 
        d.publicDonationId?.toLowerCase().includes(q) ||
        d.receiptNo?.toLowerCase().includes(q) ||
        d.notes?.toLowerCase().includes(q) ||
        d.email?.toLowerCase().includes(q) ||
        d.phone?.toLowerCase().includes(q);

      const matchesStatus = donationStatusFilter === 'ALL' || d.status === donationStatusFilter;
      const matchesMethod = donationMethodFilter === 'ALL' || d.paymentMethod === donationMethodFilter;

      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [donations, searchQuery, donationStatusFilter, donationMethodFilter]);

  const filteredWelfare = useMemo(() => {
    return welfareRequests.filter(w => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        w.member?.name?.toLowerCase().includes(q) ||
        w.member?.email?.toLowerCase().includes(q) ||
        w.requestType?.toLowerCase().includes(q) ||
        w.description?.toLowerCase().includes(q);

      const matchesStatus = welfareStatusFilter === 'ALL' || w.status === welfareStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [welfareRequests, searchQuery, welfareStatusFilter]);

  const memberRoleCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    members.forEach(m => {
      counts[m.role] = (counts[m.role] || 0) + 1;
    });
    return counts;
  }, [members]);

  const bloodGroupCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    members.forEach(m => {
      if (m.bloodGroup) {
        counts[m.bloodGroup] = (counts[m.bloodGroup] || 0) + 1;
      }
    });
    return counts;
  }, [members]);

  if (loadingUser) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
        <RefreshCw className="animate-spin" size={36} color="var(--secondary-color)" />
        <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Verifying Executive Credentials...</p>
      </div>
    );
  }

  if (error && !currentUser) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div style={{ maxWidth: '480px', width: '100%', textAlign: 'center', padding: '2.5rem' }} className="card">
          <ShieldAlert size={56} color="#EF4444" style={{ margin: '0 auto 1.25rem' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Access Restricted</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.75rem', lineHeight: 1.5 }}>{error}</p>
          <button onClick={() => router.push('/login')} className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
            Go to Executive Login
          </button>
        </div>
      </div>
    );
  }

  const navMenuItems = [
    { id: 'MEMBERS', label: 'Members Directory', icon: Users, count: members.length, badgeColor: 'rgba(59,130,246,0.15)', textColor: '#3B82F6' },
    { id: 'DONATIONS', label: 'Finance & Donations', icon: Heart, count: donations.length, badgeColor: 'rgba(16,185,129,0.15)', textColor: '#10B981' },
    { id: 'WELFARE', label: 'Welfare Claims', icon: Shield, count: welfareRequests.length, badgeColor: 'rgba(139,92,246,0.15)', textColor: '#8B5CF6' },
    ...(currentUser && ['SUPER_ADMIN', 'ADMIN'].includes(currentUser.role) ? [
      { id: 'AUDIT', label: 'Security & Audit', icon: Activity, count: auditLogs.length, badgeColor: 'rgba(245,158,11,0.15)', textColor: '#F59E0B' }
    ] : []),
    ...(currentUser?.role === 'SUPER_ADMIN' ? [
      { id: 'SETTINGS', label: 'Configuration', icon: Settings, count: settings.length, badgeColor: 'rgba(107,114,128,0.15)', textColor: '#6B7280' }
    ] : [])
  ];

  return (
    <div style={{ 
      height: '100vh', 
      width: '100vw', 
      overflow: 'hidden', 
      display: 'flex', 
      background: 'var(--bg-color)',
      position: 'relative'
    }}>
      {/* ═════════════════════════════════════════════════════════════════════
          1. SLEEK COLLAPSIBLE SIDEBAR (CLEAN, NO PUBLIC PORTAL LINK)
         ═════════════════════════════════════════════════════════════════════ */}
      <aside 
        style={{
          width: isSidebarCollapsed ? '72px' : '260px',
          height: '100vh',
          transition: 'width 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
          padding: isSidebarCollapsed ? '1rem 0.5rem' : '1.25rem 0.9rem',
          borderRight: '1px solid var(--border-color)',
          background: 'var(--surface-color-solid)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flexShrink: 0,
          zIndex: 40,
          overflowX: 'hidden',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        {/* Top of Sidebar: Official Brand Logo (Visible only when expanded) & ChatGPT-style Toggle */}
        <div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
            marginBottom: '1rem',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid var(--border-color)',
            gap: '8px'
          }}>
            {!isSidebarCollapsed && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', paddingLeft: '2px' }}>
                <img 
                  src="/leimarembi_official_logo.png" 
                  alt="Leimarembi Foundation Logo" 
                  style={{ 
                    height: '36px', 
                    width: '36px', 
                    objectFit: 'contain',
                    borderRadius: '6px',
                    flexShrink: 0
                  }} 
                />
                <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', lineHeight: 1.15 }}>
                  <div style={{ fontWeight: 900, fontSize: '0.875rem', color: 'var(--primary-color)', letterSpacing: '0.3px' }}>
                    LEIMAREMBI
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--secondary-color)', fontWeight: 800, letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                    FOUNDATION
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              style={{
                background: isSidebarCollapsed ? 'rgba(0,0,0,0.03)' : 'rgba(0,0,0,0.04)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                flexShrink: 0,
                transition: 'all 0.2s ease'
              }}
              title={isSidebarCollapsed ? "Expand Sidebar (ChatGPT style)" : "Collapse Sidebar (ChatGPT style)"}
            >
              {isSidebarCollapsed ? <PanelLeftOpen size={18} color="var(--primary-color)" /> : <PanelLeftClose size={18} color="var(--text-secondary)" />}
            </button>
          </div>

          {/* Navigation Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {navMenuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id as Tab)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
                    width: '100%',
                    padding: isSidebarCollapsed ? '0.65rem 0' : '0.6rem 0.8rem',
                    borderRadius: '10px',
                    border: isActive ? '1px solid var(--secondary-color)' : '1px solid transparent',
                    background: isActive ? 'linear-gradient(135deg, rgba(30, 58, 138, 0.08), rgba(217, 119, 6, 0.08))' : 'transparent',
                    color: isActive ? 'var(--primary-color)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontWeight: isActive ? 800 : 600,
                    fontSize: '0.825rem',
                    transition: 'all 0.15s ease',
                    position: 'relative'
                  }}
                  title={isSidebarCollapsed ? item.label : undefined}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '9px', overflow: 'hidden' }}>
                    <IconComponent 
                      size={18} 
                      color={isActive ? 'var(--secondary-color)' : 'currentColor'} 
                      style={{ flexShrink: 0 }}
                    />
                    {!isSidebarCollapsed && (
                      <span style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {item.label}
                      </span>
                    )}
                  </div>

                  {!isSidebarCollapsed && item.count !== undefined && (
                    <span style={{
                      padding: '0.1rem 0.5rem',
                      borderRadius: '16px',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      background: isActive ? item.badgeColor : 'rgba(0,0,0,0.05)',
                      color: isActive ? item.textColor : 'var(--text-secondary)',
                      flexShrink: 0
                    }}>
                      {item.count}
                    </span>
                  )}

                  {isSidebarCollapsed && isActive && (
                    <div style={{
                      position: 'absolute',
                      left: '2px',
                      top: '25%',
                      height: '50%',
                      width: '3px',
                      background: 'var(--secondary-color)',
                      borderRadius: '4px'
                    }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom of Sidebar: Live Data Sync */}
        <div style={{ paddingTop: '0.85rem', borderTop: '1px solid var(--border-color)' }}>
          <button
            onClick={fetchData}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
              gap: '7px',
              width: '100%',
              padding: isSidebarCollapsed ? '0.55rem 0' : '0.55rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              background: 'rgba(0,0,0,0.02)',
              color: 'var(--text-primary)',
              fontSize: '0.775rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
            title="Sync Live Data with Database"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} color="var(--secondary-color)" />
            {!isSidebarCollapsed && <span>Sync Live Data</span>}
          </button>
        </div>
      </aside>

      {/* ═════════════════════════════════════════════════════════════════════
          2. COMPACT SINGLE-PAGE WORKSPACE (NO VERTICAL PAGE OVERFLOW)
         ═════════════════════════════════════════════════════════════════════ */}
      <div style={{ 
        flex: 1, 
        minWidth: 0, 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        padding: '0.75rem 1.25rem',
        overflow: 'hidden'
      }}>
        
        {/* ─── TOP HEADER BAR WITH CONTEXT PROFILE MENU ─── */}
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'nowrap', 
          gap: '0.75rem',
          padding: '0.6rem 1.1rem',
          background: 'var(--surface-color-solid)',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
          flexShrink: 0,
          marginBottom: '0.65rem',
          position: 'relative'
        }}>
          {/* Breadcrumb / Active View Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(2, 132, 199, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--secondary-color)'
            }}>
              <LayoutDashboard size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 900, color: 'var(--primary-color)', lineHeight: 1.2 }}>
                {activeTab === 'MEMBERS' && 'Executive Members Directory'}
                {activeTab === 'DONATIONS' && 'Donations & Financial Ledger'}
                {activeTab === 'WELFARE' && 'Community Welfare & Aid Requests'}
                {activeTab === 'AUDIT' && 'Security & Operational Audit Log'}
                {activeTab === 'SETTINGS' && 'System Parameters & Configuration'}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                Authorized Administrative Portal
              </div>
            </div>
          </div>

          {/* Right: Interactive User Profile Context Trigger */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.35rem 0.65rem 0.35rem 0.45rem',
                borderRadius: '24px',
                border: showProfileMenu ? '1.5px solid var(--secondary-color)' : '1px solid var(--border-color)',
                background: showProfileMenu ? 'rgba(2, 132, 199, 0.08)' : 'var(--bg-color)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                maxWidth: '240px'
              }}
              title="Click to view profile & account actions"
            >
              {currentUser?.profilePhoto ? (
                <img
                  src={currentUser.profilePhoto}
                  alt={currentUser.name || 'User'}
                  style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--secondary-color)', flexShrink: 0 }}
                />
              ) : (
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  flexShrink: 0
                }}>
                  {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
                </div>
              )}

              <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', paddingRight: '2px', overflow: 'hidden' }}>
                <span style={{ 
                  fontSize: '0.78rem', 
                  fontWeight: 800, 
                  color: 'var(--text-primary)', 
                  lineHeight: 1.1,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '130px'
                }}>
                  {currentUser?.name || currentUser?.email?.split('@')[0] || 'Administrator'}
                </span>
                <span style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--secondary-color)', textTransform: 'uppercase' }}>
                  {currentUser?.role || 'EXECUTIVE'}
                </span>
              </div>

              <ChevronDown size={14} color="var(--text-secondary)" style={{ transform: showProfileMenu ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', flexShrink: 0 }} />
            </button>

            {/* Context Menu Dropdown */}
            {showProfileMenu && (
              <>
                <div 
                  onClick={() => setShowProfileMenu(false)}
                  style={{ position: 'fixed', inset: 0, zIndex: 100 }}
                />
                <div 
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '260px',
                    background: 'var(--surface-color-solid)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    boxShadow: 'var(--shadow-lg)',
                    padding: '0.6rem',
                    zIndex: 101,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem',
                    animation: 'fadeIn 0.15s ease forwards'
                  }}
                >
                  {/* Profile Header Details */}
                  <div style={{ padding: '0.5rem 0.6rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.2rem' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                      {currentUser?.name || 'Administrator'}
                    </div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', wordBreak: 'break-all' }}>
                      {currentUser?.email}
                    </div>
                    <div style={{ marginTop: '5px', display: 'inline-block', padding: '0.15rem 0.45rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 800, background: 'rgba(2, 132, 199, 0.12)', color: 'var(--secondary-color)' }}>
                      ROLE: {currentUser?.role}
                    </div>
                  </div>

                  {/* Context Links */}
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      handleTabChange('SETTINGS');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '0.45rem 0.6rem',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--text-primary)',
                      fontSize: '0.775rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                    className="drawer-link"
                  >
                    <Settings size={14} color="var(--secondary-color)" />
                    <span>System Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      fetchData();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '0.45rem 0.6rem',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--text-primary)',
                      fontSize: '0.775rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                    className="drawer-link"
                  >
                    <RefreshCw size={14} color="var(--secondary-color)" />
                    <span>Refresh Session Data</span>
                  </button>

                  <div style={{ height: '1px', background: 'var(--border-color)', margin: '0.2rem 0' }} />

                  {/* Sign Out Action */}
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logoutUser();
                      router.push('/login');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '0.5rem 0.6rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(239,68,68,0.2)',
                      background: 'rgba(239,68,68,0.06)',
                      color: '#EF4444',
                      fontSize: '0.775rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <LogOut size={14} color="#EF4444" />
                    <span>Sign Out of Dashboard</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        {/* ─── TOAST MESSAGES ─── */}
        {successMsg && (
          <div style={{ 
            background: 'rgba(16,185,129,0.12)', 
            border: '1px solid rgba(16,185,129,0.3)', 
            color: '#10B981', 
            padding: '0.5rem 0.85rem', 
            borderRadius: '8px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            fontWeight: 600,
            fontSize: '0.8rem',
            marginBottom: '0.5rem',
            flexShrink: 0
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} /> {successMsg}
            </span>
            <X size={15} style={{ cursor: 'pointer' }} onClick={() => setSuccessMsg('')} />
          </div>
        )}

        {error && (
          <div style={{ 
            background: 'rgba(239,68,68,0.12)', 
            border: '1px solid rgba(239,68,68,0.3)', 
            color: '#EF4444', 
            padding: '0.5rem 0.85rem', 
            borderRadius: '8px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            fontWeight: 600,
            fontSize: '0.8rem',
            marginBottom: '0.5rem',
            flexShrink: 0
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertCircle size={16} /> {error}
            </span>
            <X size={15} style={{ cursor: 'pointer' }} onClick={() => setError('')} />
          </div>
        )}

        {/* ─── COMPACT STATS KPI ROW (FITS COMPACTLY AT TOP) ─── */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '0.65rem', 
          marginBottom: '0.65rem',
          flexShrink: 0
        }}>
          {/* Metric 1 */}
          <div 
            onClick={() => {
              setActiveTab('MEMBERS');
              setMemberStatusFilter('ALL');
              setMemberRoleFilter('ALL');
            }}
            style={{ 
              background: activeTab === 'MEMBERS' ? 'linear-gradient(135deg, #1E3A8A, #172554)' : 'var(--surface-color-solid)', 
              color: activeTab === 'MEMBERS' ? '#FFFFFF' : 'var(--text-primary)', 
              padding: '0.65rem 0.9rem', 
              borderRadius: '10px',
              border: activeTab === 'MEMBERS' ? '1.5px solid var(--secondary-color)' : '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-xs)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <span style={{ color: activeTab === 'MEMBERS' ? 'rgba(255,255,255,0.85)' : 'var(--text-secondary)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>
                Directory Members
              </span>
              <div style={{ fontSize: '1.45rem', fontWeight: 900, color: activeTab === 'MEMBERS' ? '#FFFFFF' : 'var(--primary-color)', lineHeight: 1.1 }}>
                {members.length || '0'}
              </div>
            </div>
            <Users size={22} color={activeTab === 'MEMBERS' ? 'var(--secondary-color)' : '#3B82F6'} />
          </div>

          {/* Metric 2 */}
          <div 
            onClick={() => {
              setActiveTab('DONATIONS');
              setDonationStatusFilter('SUCCESS');
            }}
            style={{ 
              background: activeTab === 'DONATIONS' && donationStatusFilter === 'SUCCESS' ? 'linear-gradient(135deg, #D97706, #B45309)' : 'var(--surface-color-solid)', 
              color: activeTab === 'DONATIONS' && donationStatusFilter === 'SUCCESS' ? '#FFFFFF' : 'var(--text-primary)', 
              padding: '0.65rem 0.9rem', 
              borderRadius: '10px',
              border: activeTab === 'DONATIONS' && donationStatusFilter === 'SUCCESS' ? '1.5px solid #FFFFFF' : '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-xs)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <span style={{ color: activeTab === 'DONATIONS' && donationStatusFilter === 'SUCCESS' ? 'rgba(255,255,255,0.9)' : 'var(--text-secondary)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>
                Verified Funds
              </span>
              <div style={{ fontSize: '1.45rem', fontWeight: 900, color: activeTab === 'DONATIONS' && donationStatusFilter === 'SUCCESS' ? '#FFFFFF' : '#10B981', lineHeight: 1.1 }}>
                ₹{(donationMetrics.totalSuccessAmount || 0).toLocaleString('en-IN')}
              </div>
            </div>
            <Heart size={22} color={activeTab === 'DONATIONS' && donationStatusFilter === 'SUCCESS' ? '#FFFFFF' : '#10B981'} />
          </div>

          {/* Metric 3 */}
          <div 
            onClick={() => {
              setActiveTab('DONATIONS');
              setDonationStatusFilter('PENDING');
            }}
            style={{ 
              background: activeTab === 'DONATIONS' && donationStatusFilter === 'PENDING' ? 'linear-gradient(135deg, #F59E0B, #D97706)' : 'var(--surface-color-solid)', 
              color: activeTab === 'DONATIONS' && donationStatusFilter === 'PENDING' ? '#FFFFFF' : 'var(--text-primary)', 
              padding: '0.65rem 0.9rem', 
              borderRadius: '10px',
              border: activeTab === 'DONATIONS' && donationStatusFilter === 'PENDING' ? '1.5px solid #FFFFFF' : '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-xs)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <span style={{ color: activeTab === 'DONATIONS' && donationStatusFilter === 'PENDING' ? 'rgba(255,255,255,0.9)' : 'var(--text-secondary)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>
                Pending Verification
              </span>
              <div style={{ fontSize: '1.45rem', fontWeight: 900, color: activeTab === 'DONATIONS' && donationStatusFilter === 'PENDING' ? '#FFFFFF' : '#F59E0B', lineHeight: 1.1 }}>
                {donationMetrics.pendingCount || 0}
              </div>
            </div>
            <Clock size={22} color={activeTab === 'DONATIONS' && donationStatusFilter === 'PENDING' ? '#FFFFFF' : '#F59E0B'} />
          </div>

          {/* Metric 4 */}
          <div 
            onClick={() => {
              setActiveTab('WELFARE');
              setWelfareStatusFilter('ALL');
            }}
            style={{ 
              background: activeTab === 'WELFARE' ? 'linear-gradient(135deg, #4338CA, #312E81)' : 'var(--surface-color-solid)', 
              color: activeTab === 'WELFARE' ? '#FFFFFF' : 'var(--text-primary)', 
              padding: '0.65rem 0.9rem', 
              borderRadius: '10px',
              border: activeTab === 'WELFARE' ? '1.5px solid var(--secondary-color)' : '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-xs)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <span style={{ color: activeTab === 'WELFARE' ? 'rgba(255,255,255,0.85)' : 'var(--text-secondary)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>
                Welfare Claims
              </span>
              <div style={{ fontSize: '1.45rem', fontWeight: 900, color: activeTab === 'WELFARE' ? '#FFFFFF' : '#8B5CF6', lineHeight: 1.1 }}>
                {welfareRequests.filter(w => w.status === 'SUBMITTED' || w.status === 'UNDER_REVIEW').length}
              </div>
            </div>
            <Shield size={22} color={activeTab === 'WELFARE' ? 'var(--secondary-color)' : '#8B5CF6'} />
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            3. MAIN DATA TABLE CONTAINER WITH INNER SCROLL & FULL PAGINATION
           ═══════════════════════════════════════════════════════════════════ */}
        <main style={{ 
          flex: 1, 
          minHeight: 0, 
          background: 'var(--surface-color-solid)', 
          borderRadius: '14px', 
          border: '1px solid var(--border-color)', 
          boxShadow: 'var(--shadow-sm)',
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden'
        }}>
          
          {/* ─── TAB 1: MEMBERS DIRECTORY ─── */}
          {activeTab === 'MEMBERS' && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
              {/* Dedicated Member Toolbar with Search & Multi-Filters */}
              <div style={{ 
                padding: '0.55rem 0.9rem', 
                background: 'var(--surface-color)', 
                borderBottom: '1px solid var(--border-color)', 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.5rem',
                flexShrink: 0
              }}>
                {/* Search & Filter Controls */}
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  {/* Dedicated Member Search Bar */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    background: 'var(--bg-color)', 
                    padding: '0.28rem 0.65rem', 
                    borderRadius: '6px', 
                    border: '1px solid var(--border-color)',
                    minWidth: '220px'
                  }}>
                    <Search size={13} style={{ color: 'var(--text-secondary)', marginRight: '6px', flexShrink: 0 }} />
                    <input
                      type="text"
                      placeholder="Search name, ID, phone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.775rem', width: '100%' }}
                    />
                    {searchQuery && (
                      <X size={12} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} onClick={() => setSearchQuery('')} />
                    )}
                  </div>

                  {/* Role filter */}
                  <select
                    value={memberRoleFilter}
                    onChange={(e) => setMemberRoleFilter(e.target.value)}
                    style={{ padding: '0.3rem 0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '0.75rem', fontWeight: 600 }}
                  >
                    <option value="ALL">All Roles ({members.length})</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN ({memberRoleCounts['SUPER_ADMIN'] || 0})</option>
                    <option value="ADMIN">ADMIN ({memberRoleCounts['ADMIN'] || 0})</option>
                    <option value="TRUSTEE">TRUSTEE ({memberRoleCounts['TRUSTEE'] || 0})</option>
                    <option value="STAFF">STAFF ({memberRoleCounts['STAFF'] || 0})</option>
                    <option value="CORE_MEMBER">CORE_MEMBER ({memberRoleCounts['CORE_MEMBER'] || 0})</option>
                    <option value="MEMBER">MEMBER ({memberRoleCounts['MEMBER'] || 0})</option>
                  </select>

                  {/* Status filter */}
                  <select
                    value={memberStatusFilter}
                    onChange={(e) => setMemberStatusFilter(e.target.value)}
                    style={{ padding: '0.3rem 0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '0.75rem', fontWeight: 600 }}
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="PENDING">PENDING</option>
                  </select>

                  {/* Blood group filter */}
                  <select
                    value={memberBloodFilter}
                    onChange={(e) => setMemberBloodFilter(e.target.value)}
                    style={{ padding: '0.3rem 0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '0.75rem', fontWeight: 600 }}
                  >
                    <option value="ALL">All Blood Groups</option>
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(bg => (
                      <option key={bg} value={bg}>{bg} ({bloodGroupCounts[bg] || 0})</option>
                    ))}
                  </select>

                  {(memberRoleFilter !== 'ALL' || memberStatusFilter !== 'ALL' || memberBloodFilter !== 'ALL' || searchQuery) && (
                    <button
                      onClick={() => {
                        setMemberRoleFilter('ALL');
                        setMemberStatusFilter('ALL');
                        setMemberBloodFilter('ALL');
                        setSearchQuery('');
                      }}
                      style={{ background: 'transparent', border: 'none', color: 'var(--accent-color)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                    >
                      <X size={12} /> Reset
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button
                    onClick={exportMembersCSV}
                    className="btn btn-outline"
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', gap: '5px', borderRadius: '6px' }}
                    title="Export filtered roster to CSV"
                  >
                    <Download size={13} /> Export CSV
                  </button>

                  {['SUPER_ADMIN', 'ADMIN'].includes(currentUser?.role) && (
                    <button
                      onClick={() => setShowAddMemberModal(true)}
                      className="btn btn-primary"
                      style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem', gap: '5px', borderRadius: '6px' }}
                    >
                      <UserCheck size={13} /> + Add Member
                    </button>
                  )}
                </div>
              </div>

              {/* Responsive Scrollable Table Viewport with Sleek Scrollbars */}
              <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                  <thead style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--surface-color-solid)' }}>
                    <tr style={{ background: 'rgba(0,0,0,0.03)', color: 'var(--text-secondary)', fontSize: '0.75rem', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                      <th style={{ padding: '0.65rem 0.9rem', width: '160px', minWidth: '160px' }}>Photo & ID</th>
                      <th style={{ padding: '0.65rem 0.9rem', minWidth: '170px' }}>Name & Designation</th>
                      <th style={{ padding: '0.65rem 0.9rem', minWidth: '180px' }}>Contact</th>
                      <th style={{ padding: '0.65rem 0.75rem', width: '120px' }}>Role</th>
                      <th style={{ padding: '0.65rem 0.75rem', width: '70px' }}>Blood</th>
                      <th style={{ padding: '0.65rem 0.75rem', width: '90px' }}>Status</th>
                      <th style={{ padding: '0.65rem 0.9rem', width: '140px', minWidth: '140px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                  {paginatedMembers.map((m) => (
                    <tr 
                      key={m.id} 
                      style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.8rem' }}
                      className="table-row-hover"
                    >
                      <td style={{ padding: '0.55rem 0.9rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {m.profilePhoto ? (
                            <img
                              src={m.profilePhoto}
                              alt={m.name}
                              onClick={() => setQuickViewMember(m)}
                              style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--secondary-color)', cursor: 'pointer', flexShrink: 0 }}
                              title="Click to view digital card"
                            />
                          ) : (
                            <div 
                              onClick={() => setQuickViewMember(m)}
                              style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(30,58,138,0.12)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', flexShrink: 0 }}
                              title="Click to view digital card"
                            >
                              {m.name ? m.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase() : 'LF'}
                            </div>
                          )}
                          <code 
                            onClick={() => copyToClipboard(m.membershipNo || '', `id-${m.id}`)}
                            style={{ 
                              fontWeight: 800, 
                              color: 'var(--secondary-color)', 
                              fontSize: '0.78rem', 
                              cursor: 'pointer', 
                              whiteSpace: 'nowrap',
                              background: 'rgba(2, 132, 199, 0.08)',
                              padding: '0.15rem 0.4rem',
                              borderRadius: '4px'
                            }}
                            title="Click to copy ID"
                          >
                            {m.membershipNo || 'LF-2026'}
                          </code>
                        </div>
                      </td>

                      <td style={{ padding: '0.55rem 0.9rem' }}>
                        <div onClick={() => setQuickViewMember(m)} style={{ fontWeight: 800, color: 'var(--primary-color)', cursor: 'pointer', lineHeight: 1.25 }}>
                          {m.name}
                        </div>
                        {m.designation && (
                          <div style={{ fontSize: '0.7rem', color: 'var(--secondary-color)', fontWeight: 600, marginTop: '2px' }}>
                            {m.designation}
                          </div>
                        )}
                      </td>

                      <td style={{ padding: '0.55rem 0.9rem' }}>
                        <div onClick={() => copyToClipboard(m.email || '', `email-${m.id}`)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', wordBreak: 'break-all' }}>
                          <Mail size={12} style={{ opacity: 0.6, flexShrink: 0 }} /> <span>{m.email}</span>
                        </div>
                        {m.phone && (
                          <div onClick={() => copyToClipboard(m.phone || '', `phone-${m.id}`)} style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px', whiteSpace: 'nowrap' }}>
                            <Phone size={11} style={{ opacity: 0.6, flexShrink: 0 }} /> <span>{m.phone}</span>
                          </div>
                        )}
                      </td>

                      <td style={{ padding: '0.55rem 0.75rem' }}>
                        <span style={{ padding: '0.15rem 0.45rem', borderRadius: '6px', fontSize: '0.68rem', fontWeight: 800, background: 'rgba(59,130,246,0.12)', color: '#3B82F6', display: 'inline-block', whiteSpace: 'nowrap' }}>
                          {m.role}
                        </span>
                      </td>

                      <td style={{ padding: '0.55rem 0.75rem' }}>
                        <span style={{ fontWeight: 800, color: '#EF4444', fontSize: '0.75rem' }}>
                          {m.bloodGroup || '---'}
                        </span>
                      </td>

                      <td style={{ padding: '0.55rem 0.75rem' }}>
                        <button
                          onClick={(e) => toggleMemberStatus(m, e)}
                          style={{ padding: '0.15rem 0.55rem', borderRadius: '10px', fontSize: '0.68rem', fontWeight: 800, background: m.status === 'ACTIVE' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: m.status === 'ACTIVE' ? '#10B981' : '#EF4444', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}
                        >
                          {m.status}
                        </button>
                      </td>

                      <td style={{ padding: '0.55rem 0.9rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '5px', justifyContent: 'flex-end', alignItems: 'center' }}>
                          <button
                            onClick={() => setQuickViewMember(m)}
                            className="btn btn-outline"
                            style={{ 
                              padding: '0.22rem 0.5rem', 
                              fontSize: '0.7rem', 
                              borderRadius: '6px', 
                              minHeight: 'auto',
                              gap: '4px',
                              background: 'rgba(2, 132, 199, 0.05)',
                              borderColor: 'rgba(2, 132, 199, 0.3)',
                              color: 'var(--secondary-color)',
                              fontWeight: 700
                            }}
                            title="Open Digital Membership Pass"
                          >
                            <QrCode size={12} color="var(--secondary-color)" />
                            <span>ID</span>
                          </button>
                          <button
                            onClick={() => handleOpenEditMember(m)}
                            className="btn btn-outline"
                            style={{ padding: '0.22rem 0.55rem', fontSize: '0.7rem', borderRadius: '6px', gap: '4px', minHeight: 'auto', fontWeight: 700 }}
                          >
                            <Edit3 size={11} />
                            <span>Edit</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredMembers.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-secondary)' }}>
                        No members match the query filter.
                      </td>
                    </tr>
                  )}
                  </tbody>
                </table>
              </div>

              {/* ─── PROFESSIONAL MEMBER PAGINATION BAR ─── */}
              <div style={{
                padding: '0.55rem 1rem',
                borderTop: '1px solid var(--border-color)',
                background: 'var(--surface-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem',
                flexShrink: 0
              }}>
                {/* Left: Showing Range & Rows per page selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <span>
                    Showing <strong>{filteredMembers.length === 0 ? 0 : (currentMemberPage - 1) * membersPerPage + 1}</strong>–<strong>{Math.min(currentMemberPage * membersPerPage, filteredMembers.length)}</strong> of <strong>{filteredMembers.length}</strong>
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span>Rows per page:</span>
                    <div style={{ display: 'flex', gap: '3px' }}>
                      {[10, 20, 50].map((num) => (
                        <button
                          key={num}
                          onClick={() => setMembersPerPage(num)}
                          style={{
                            padding: '0.15rem 0.45rem',
                            borderRadius: '4px',
                            fontSize: '0.725rem',
                            fontWeight: 700,
                            border: '1px solid var(--border-color)',
                            background: membersPerPage === num ? 'var(--secondary-color)' : 'var(--bg-color)',
                            color: membersPerPage === num ? '#111' : 'var(--text-primary)',
                            cursor: 'pointer'
                          }}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Page Buttons ‹ 1 2 3 › */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <button
                    onClick={() => setCurrentMemberPage(1)}
                    disabled={currentMemberPage === 1}
                    style={{
                      padding: '0.2rem 0.4rem',
                      borderRadius: '4px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-color)',
                      color: 'var(--text-primary)',
                      cursor: currentMemberPage === 1 ? 'not-allowed' : 'pointer',
                      opacity: currentMemberPage === 1 ? 0.4 : 1,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title="First Page"
                  >
                    <ChevronsLeft size={13} />
                  </button>

                  <button
                    onClick={() => setCurrentMemberPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentMemberPage === 1}
                    style={{
                      padding: '0.2rem 0.4rem',
                      borderRadius: '4px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-color)',
                      color: 'var(--text-primary)',
                      cursor: currentMemberPage === 1 ? 'not-allowed' : 'pointer',
                      opacity: currentMemberPage === 1 ? 0.4 : 1,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title="Previous Page"
                  >
                    <ChevronLeft size={13} />
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: totalMemberPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentMemberPage(pageNum)}
                      style={{
                        minWidth: '24px',
                        height: '24px',
                        padding: '0 0.35rem',
                        borderRadius: '4px',
                        border: '1px solid var(--border-color)',
                        background: currentMemberPage === pageNum ? 'var(--secondary-color)' : 'var(--bg-color)',
                        color: currentMemberPage === pageNum ? '#111' : 'var(--text-primary)',
                        fontSize: '0.75rem',
                        fontWeight: currentMemberPage === pageNum ? 800 : 500,
                        cursor: 'pointer'
                      }}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentMemberPage(prev => Math.min(prev + 1, totalMemberPages))}
                    disabled={currentMemberPage === totalMemberPages}
                    style={{
                      padding: '0.2rem 0.4rem',
                      borderRadius: '4px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-color)',
                      color: 'var(--text-primary)',
                      cursor: currentMemberPage === totalMemberPages ? 'not-allowed' : 'pointer',
                      opacity: currentMemberPage === totalMemberPages ? 0.4 : 1,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title="Next Page"
                  >
                    <ChevronRight size={13} />
                  </button>

                  <button
                    onClick={() => setCurrentMemberPage(totalMemberPages)}
                    disabled={currentMemberPage === totalMemberPages}
                    style={{
                      padding: '0.2rem 0.4rem',
                      borderRadius: '4px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-color)',
                      color: 'var(--text-primary)',
                      cursor: currentMemberPage === totalMemberPages ? 'not-allowed' : 'pointer',
                      opacity: currentMemberPage === totalMemberPages ? 0.4 : 1,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title="Last Page"
                  >
                    <ChevronsRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB 2: DONATIONS MANAGEMENT ─── */}
          {activeTab === 'DONATIONS' && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
              <div style={{ 
                padding: '0.6rem 1rem', 
                background: 'var(--surface-color)', 
                borderBottom: '1px solid var(--border-color)', 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.5rem',
                flexShrink: 0
              }}>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  {/* Search in donations */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    background: 'var(--bg-color)', 
                    padding: '0.28rem 0.65rem', 
                    borderRadius: '6px', 
                    border: '1px solid var(--border-color)',
                    minWidth: '200px'
                  }}>
                    <Search size={13} style={{ color: 'var(--text-secondary)', marginRight: '6px' }} />
                    <input
                      type="text"
                      placeholder="Search donations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.775rem', width: '100%' }}
                    />
                  </div>

                  <span style={{ fontSize: '0.725rem', fontWeight: 800, color: 'var(--text-secondary)' }}>STATUS:</span>
                  {['ALL', 'SUCCESS', 'PENDING', 'FAILED', 'EXPIRED'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setDonationStatusFilter(s)}
                      style={{
                        padding: '0.25rem 0.6rem',
                        fontSize: '0.725rem',
                        borderRadius: '6px',
                        border: '1px solid var(--border-color)',
                        background: donationStatusFilter === s ? 'var(--secondary-color)' : 'transparent',
                        color: donationStatusFilter === s ? '#111' : 'var(--text-secondary)',
                        fontWeight: donationStatusFilter === s ? 800 : 600,
                        cursor: 'pointer'
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <button
                  onClick={exportDonationsCSV}
                  className="btn btn-outline"
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', gap: '5px', borderRadius: '6px' }}
                >
                  <Download size={13} /> Export CSV
                </button>
              </div>

              <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '760px' }}>
                  <thead style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--surface-color-solid)' }}>
                    <tr style={{ background: 'rgba(0,0,0,0.03)', color: 'var(--text-secondary)', fontSize: '0.75rem', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                      <th style={{ padding: '0.65rem 1rem' }}>Receipt No</th>
                      <th style={{ padding: '0.65rem 1rem' }}>Donor & Contact</th>
                      <th style={{ padding: '0.65rem 1rem' }}>Location</th>
                      <th style={{ padding: '0.65rem 1rem' }}>Amount</th>
                      <th style={{ padding: '0.65rem 1rem' }}>Date</th>
                      <th style={{ padding: '0.65rem 1rem' }}>Method</th>
                      <th style={{ padding: '0.65rem 1rem' }}>Status</th>
                      <th style={{ padding: '0.65rem 1rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDonations.map((d) => {
                      let locationStr = '---';
                      try {
                        if (d.metadata) {
                          const meta = JSON.parse(d.metadata);
                          if (meta.location) locationStr = meta.location;
                        }
                      } catch {}
                      if (locationStr === '---' && d.notes?.includes('Location:')) {
                        locationStr = d.notes.split('|')[0].replace('Location:', '').trim();
                      }

                      const dateStr = d.paidAt 
                        ? new Date(d.paidAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                        : new Date(d.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

                      return (
                        <tr key={d.id || d.publicDonationId} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.8rem' }} className="table-row-hover">
                          <td style={{ padding: '0.55rem 1rem' }}>
                            <code 
                              onClick={() => copyToClipboard(d.receiptNo || '', `rec-${d.id}`)}
                              style={{ fontWeight: 800, color: 'var(--secondary-color)', cursor: 'pointer' }}
                            >
                              {d.receiptNo}
                            </code>
                          </td>
                          <td style={{ padding: '0.55rem 1rem' }}>
                            <div style={{ fontWeight: 700 }}>{d.donorName}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{d.email}</div>
                          </td>
                          <td style={{ padding: '0.55rem 1rem', fontSize: '0.75rem' }}>{locationStr}</td>
                          <td style={{ padding: '0.55rem 1rem', fontWeight: 800, color: 'var(--text-primary)' }}>₹{d.amount.toLocaleString('en-IN')}</td>
                          <td style={{ padding: '0.55rem 1rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{dateStr}</td>
                          <td style={{ padding: '0.55rem 1rem', fontSize: '0.7rem' }}>{d.paymentMethod}</td>
                          <td style={{ padding: '0.55rem 1rem' }}>
                            <span style={{
                              padding: '0.15rem 0.45rem',
                              borderRadius: '8px',
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              background: d.status === 'SUCCESS' ? 'rgba(16,185,129,0.15)' : d.status === 'PENDING' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                              color: d.status === 'SUCCESS' ? '#10B981' : d.status === 'PENDING' ? '#F59E0B' : '#EF4444',
                            }}>
                              {d.status}
                            </span>
                          </td>
                          <td style={{ padding: '0.55rem 1rem', textAlign: 'right' }}>
                            <button
                              onClick={() => {
                                setSelectedDonation(d);
                                setNewDonationStatus(d.status);
                                setTxnRefInput(d.transactionId || '');
                              }}
                              className="btn btn-outline"
                              style={{ padding: '0.25rem 0.55rem', fontSize: '0.725rem', borderRadius: '6px' }}
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  {filteredDonations.length === 0 && (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-secondary)' }}>
                        No donation records found.
                      </td>
                    </tr>
                  )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── TAB 3: WELFARE CLAIMS ─── */}
          {activeTab === 'WELFARE' && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
              <div style={{ 
                padding: '0.6rem 1rem', 
                background: 'var(--surface-color)', 
                borderBottom: '1px solid var(--border-color)', 
                display: 'flex', 
                gap: '0.4rem', 
                alignItems: 'center', 
                flexWrap: 'wrap',
                flexShrink: 0
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  background: 'var(--bg-color)', 
                  padding: '0.28rem 0.65rem', 
                  borderRadius: '6px', 
                  border: '1px solid var(--border-color)',
                  minWidth: '200px'
                }}>
                  <Search size={13} style={{ color: 'var(--text-secondary)', marginRight: '6px' }} />
                  <input
                    type="text"
                    placeholder="Search claims..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.775rem', width: '100%' }}
                  />
                </div>

                <span style={{ fontSize: '0.725rem', fontWeight: 800, color: 'var(--text-secondary)' }}>STATUS:</span>
                {['ALL', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'DISBURSED', 'REJECTED'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setWelfareStatusFilter(s)}
                    style={{
                      padding: '0.25rem 0.6rem',
                      fontSize: '0.725rem',
                      borderRadius: '6px',
                      border: '1px solid var(--border-color)',
                      background: welfareStatusFilter === s ? 'var(--secondary-color)' : 'transparent',
                      color: welfareStatusFilter === s ? '#111' : 'var(--text-secondary)',
                      fontWeight: welfareStatusFilter === s ? 800 : 600,
                      cursor: 'pointer'
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                  <thead style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--surface-color-solid)' }}>
                    <tr style={{ background: 'rgba(0,0,0,0.03)', color: 'var(--text-secondary)', fontSize: '0.75rem', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                      <th style={{ padding: '0.65rem 1rem' }}>Ref</th>
                      <th style={{ padding: '0.65rem 1rem' }}>Applicant</th>
                      <th style={{ padding: '0.65rem 1rem' }}>Type</th>
                      <th style={{ padding: '0.65rem 1rem' }}>Requested</th>
                      <th style={{ padding: '0.65rem 1rem' }}>Priority</th>
                      <th style={{ padding: '0.65rem 1rem' }}>Status</th>
                      <th style={{ padding: '0.65rem 1rem', textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWelfare.map((w) => (
                      <React.Fragment key={w.id}>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.8rem' }} className="table-row-hover">
                          <td style={{ padding: '0.55rem 1rem' }}>
                            <button
                              onClick={() => setExpandedWelfareId(expandedWelfareId === w.id ? null : w.id)}
                              style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 700, color: 'var(--primary-color)' }}
                            >
                              {expandedWelfareId === w.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                              <code>{w.id.substring(0, 8)}</code>
                            </button>
                          </td>
                          <td style={{ padding: '0.55rem 1rem' }}>
                            <div style={{ fontWeight: 700 }}>{w.member?.name || 'Applicant'}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{w.member?.email}</div>
                          </td>
                          <td style={{ padding: '0.55rem 1rem', fontWeight: 600 }}>{w.requestType}</td>
                          <td style={{ padding: '0.55rem 1rem', fontWeight: 800 }}>₹{w.amountRequested?.toLocaleString()}</td>
                          <td style={{ padding: '0.55rem 1rem' }}>
                            <span style={{ padding: '0.15rem 0.45rem', borderRadius: '6px', fontSize: '0.68rem', fontWeight: 800, background: w.priority === 'URGENT' ? 'rgba(239,68,68,0.15)' : 'rgba(107,114,128,0.15)', color: w.priority === 'URGENT' ? '#EF4444' : '#6B7280' }}>
                              {w.priority}
                            </span>
                          </td>
                          <td style={{ padding: '0.55rem 1rem' }}>
                            <span style={{ padding: '0.15rem 0.5rem', borderRadius: '8px', fontSize: '0.68rem', fontWeight: 800, background: w.status === 'APPROVED' ? 'rgba(16,185,129,0.15)' : w.status === 'SUBMITTED' ? 'rgba(59,130,246,0.15)' : 'rgba(245,158,11,0.15)', color: w.status === 'APPROVED' ? '#10B981' : w.status === 'SUBMITTED' ? '#3B82F6' : '#F59E0B' }}>
                              {w.status}
                            </span>
                          </td>
                          <td style={{ padding: '0.55rem 1rem', textAlign: 'right' }}>
                            <button
                              onClick={() => {
                                setSelectedWelfare(w);
                                setNewWelfareStatus(w.status);
                                welfareNotes;
                                setWelfareNotes(w.adminNotes || '');
                                setWelfareAmount(w.amountApproved ? String(w.amountApproved) : String(w.amountRequested));
                              }}
                              className="btn btn-outline"
                              style={{ padding: '0.25rem 0.55rem', fontSize: '0.725rem', borderRadius: '6px' }}
                            >
                              Review
                            </button>
                          </td>
                        </tr>
                        {expandedWelfareId === w.id && (
                          <tr style={{ background: 'rgba(0,0,0,0.02)', borderBottom: '1px solid var(--border-color)' }}>
                            <td colSpan={7} style={{ padding: '0.75rem 1.25rem', fontSize: '0.775rem' }}>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                  <strong style={{ color: 'var(--primary-color)' }}>Description:</strong>
                                  <p style={{ margin: '2px 0 0', color: 'var(--text-secondary)' }}>{w.description || 'None'}</p>
                                </div>
                                <div>
                                  <strong style={{ color: 'var(--primary-color)' }}>Committee Notes:</strong>
                                  <p style={{ margin: '2px 0 0', color: 'var(--text-secondary)' }}>{w.adminNotes || 'None'}</p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                    {filteredWelfare.length === 0 && (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-secondary)' }}>
                          No welfare requests match the selected status.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── TAB 4: AUDIT LOGS ─── */}
          {activeTab === 'AUDIT' && (
            <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                <thead style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--surface-color-solid)' }}>
                  <tr style={{ background: 'rgba(0,0,0,0.03)', color: 'var(--text-secondary)', fontSize: '0.75rem', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '0.65rem 1rem' }}>Detail</th>
                    <th style={{ padding: '0.65rem 1rem' }}>Timestamp</th>
                    <th style={{ padding: '0.65rem 1rem' }}>Actor</th>
                    <th style={{ padding: '0.65rem 1rem' }}>Action Event</th>
                    <th style={{ padding: '0.65rem 1rem' }}>Resource</th>
                    <th style={{ padding: '0.65rem 1rem' }}>IP</th>
                    <th style={{ padding: '0.65rem 1rem', textAlign: 'right' }}>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <React.Fragment key={log.id}>
                      <tr style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.8rem' }} className="table-row-hover">
                        <td style={{ padding: '0.55rem 1rem' }}>
                          <button
                            onClick={() => setExpandedLogId(expandedLogId === log.id ? null : log.id)}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}
                          >
                            {expandedLogId === log.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                        </td>
                        <td style={{ padding: '0.55rem 1rem', opacity: 0.8, fontSize: '0.75rem' }}>{new Date(log.createdAt).toLocaleString()}</td>
                        <td style={{ padding: '0.55rem 1rem', fontWeight: 600 }}>{log.actor?.name || log.actorId || 'SYSTEM'}</td>
                        <td style={{ padding: '0.55rem 1rem' }}><code style={{ fontWeight: 700, color: 'var(--secondary-color)' }}>{log.action}</code></td>
                        <td style={{ padding: '0.55rem 1rem' }}>{log.resource}</td>
                        <td style={{ padding: '0.55rem 1rem', fontFamily: 'monospace', opacity: 0.7, fontSize: '0.725rem' }}>{log.ip || '---'}</td>
                        <td style={{ padding: '0.55rem 1rem', textAlign: 'right' }}>
                          <span style={{ padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 800, background: log.success ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: log.success ? '#10B981' : '#EF4444' }}>
                            {log.success ? 'SUCCESS' : 'FAILED'}
                          </span>
                        </td>
                      </tr>
                      {expandedLogId === log.id && (
                        <tr style={{ background: 'rgba(0,0,0,0.03)', borderBottom: '1px solid var(--border-color)' }}>
                          <td colSpan={7} style={{ padding: '0.75rem 1.25rem' }}>
                            <div className="custom-scrollbar" style={{ fontSize: '0.7rem', fontFamily: 'monospace', background: 'var(--bg-color)', padding: '0.65rem', borderRadius: '6px', maxHeight: '150px', overflowY: 'auto' }}>
                              {log.details ? (
                                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                                  {typeof log.details === 'string' ? log.details : JSON.stringify(log.details, null, 2)}
                                </pre>
                              ) : (
                                <span style={{ color: 'var(--text-secondary)' }}>No detailed payload.</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ─── TAB 5: SYSTEM CONFIG SETTINGS ─── */}
          {activeTab === 'SETTINGS' && (
            <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
              <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-color)' }}>
                    System Configuration Parameters
                  </h3>
                  <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Foundation contact details, payment handles, and public platform metadata.
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '0.65rem' }}>
                {settings.map((s) => {
                  const label = s.key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/\./g, ' › ')
                    .replace(/^./, (str: string) => str.toUpperCase());

                  return (
                    <div 
                      key={s.key} 
                      style={{ 
                        padding: '0.85rem 1rem', 
                        background: 'var(--surface-color)', 
                        borderRadius: '8px', 
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '0.75rem'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--secondary-color)' }}>{s.key}</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{label}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{s.value || '<Empty>'}</div>
                      </div>

                      <div style={{ flexShrink: 0 }}>
                        {editSettingKey === s.key ? (
                          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                            <input
                              type="text"
                              value={editSettingValue}
                              onChange={(e) => setEditSettingValue(e.target.value)}
                              style={{ padding: '0.35rem 0.6rem', borderRadius: '6px', border: '1px solid var(--secondary-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '0.8rem', minWidth: '180px' }}
                            />
                            <button onClick={() => handleSaveSetting(s.key)} className="btn btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
                              Save
                            </button>
                            <button onClick={() => setEditSettingKey(null)} className="btn btn-outline" style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}>
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditSettingKey(s.key);
                              setEditSettingValue(s.value);
                            }}
                            className="btn btn-outline"
                            style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', gap: '4px', borderRadius: '6px' }}
                          >
                            <Edit3 size={13} /> Edit
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════
          PORTAL MODALS — MOUNTED DIRECTLY ON DOCUMENT.BODY VIA CREATEPORTAL
         ═════════════════════════════════════════════════════════════════════ */}

      {/* ─── MODAL 0: EXECUTIVE DIGITAL MEMBER CARD / VIP PASS ─── */}
      {mounted && quickViewMember && createPortal(
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          background: 'rgba(15, 23, 42, 0.82)', 
          backdropFilter: 'blur(10px)', 
          WebkitBackdropFilter: 'blur(10px)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 99999, 
          padding: '1.25rem',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div 
            style={{ 
              width: '100%', 
              maxWidth: '430px', 
              background: 'var(--surface-color-solid)', 
              border: '1.5px solid rgba(2, 132, 199, 0.3)',
              borderRadius: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.1)',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            {/* VIP ID Header with Official Emblem */}
            <div style={{ 
              padding: '1.4rem 1.4rem 1.2rem',
              background: 'linear-gradient(135deg, #1B2A57 0%, #0F172A 100%)',
              color: '#FFFFFF',
              position: 'relative',
              borderBottom: '2.5px solid var(--secondary-color)'
            }}>
              {/* Close Button */}
              <button 
                onClick={() => setQuickViewMember(null)}
                style={{ 
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgba(255,255,255,0.12)', 
                  border: '1px solid rgba(255,255,255,0.2)', 
                  borderRadius: '50%', 
                  width: '28px', 
                  height: '28px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  cursor: 'pointer',
                  color: '#FFFFFF',
                  transition: 'background 0.2s ease'
                }}
              >
                <X size={15} />
              </button>

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

            {/* VIP Card Body with Watermark Texture */}
            <div style={{ padding: '1.25rem 1.4rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* Member Profile Main Banner */}
              <div style={{ 
                display: 'flex', 
                gap: '14px', 
                alignItems: 'center',
                padding: '0.85rem',
                background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.05), rgba(30, 58, 138, 0.03))',
                borderRadius: '16px',
                border: '1px solid var(--border-color)'
              }}>
                {quickViewMember.profilePhoto ? (
                  <img
                    src={quickViewMember.profilePhoto}
                    alt={quickViewMember.name}
                    style={{
                      width: '68px',
                      height: '68px',
                      borderRadius: '14px',
                      objectFit: 'cover',
                      border: '2px solid var(--secondary-color)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                      flexShrink: 0
                    }}
                  />
                ) : (
                  <div style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '1.5rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                    flexShrink: 0
                  }}>
                    {quickViewMember.name ? quickViewMember.name.slice(0, 2).toUpperCase() : 'LF'}
                  </div>
                )}

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--primary-color)', lineHeight: 1.2, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {quickViewMember.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--secondary-color)', fontWeight: 700, marginTop: '2px' }}>
                    {quickViewMember.designation || 'Registered Foundation Member'}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '5px', marginTop: '6px', flexWrap: 'wrap' }}>
                    <span style={{ 
                      padding: '0.15rem 0.5rem', 
                      borderRadius: '6px', 
                      fontSize: '0.65rem', 
                      fontWeight: 800, 
                      background: 'rgba(59,130,246,0.12)', 
                      color: '#3B82F6',
                      border: '1px solid rgba(59,130,246,0.2)'
                    }}>
                      {quickViewMember.role}
                    </span>
                    <span style={{ 
                      padding: '0.15rem 0.5rem', 
                      borderRadius: '6px', 
                      fontSize: '0.65rem', 
                      fontWeight: 800, 
                      background: quickViewMember.status === 'ACTIVE' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', 
                      color: quickViewMember.status === 'ACTIVE' ? '#10B981' : '#EF4444',
                      border: quickViewMember.status === 'ACTIVE' ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.3)'
                    }}>
                      {quickViewMember.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Membership Credentials Grid */}
              <div style={{ 
                background: 'var(--bg-color)', 
                padding: '0.9rem', 
                borderRadius: '14px', 
                border: '1px solid var(--border-color)', 
                display: 'grid', 
                gap: '8px', 
                fontSize: '0.78rem' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Landmark size={13} color="var(--secondary-color)" /> Membership ID:
                  </span>
                  <code style={{ 
                    fontSize: '0.85rem', 
                    fontWeight: 900, 
                    color: 'var(--secondary-color)', 
                    background: 'rgba(2, 132, 199, 0.08)',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '4px'
                  }}>
                    {quickViewMember.membershipNo || 'LF-2026'}
                  </code>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Mail size={13} color="var(--text-secondary)" /> Email:
                  </span>
                  <strong style={{ color: 'var(--text-primary)', wordBreak: 'break-all', textAlign: 'right' }}>
                    {quickViewMember.email}
                  </strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Phone size={13} color="var(--text-secondary)" /> Phone:
                  </span>
                  <strong style={{ color: 'var(--text-primary)' }}>
                    {quickViewMember.phone || '---'}
                  </strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Droplet size={13} color="#EF4444" /> Blood Group:
                  </span>
                  <strong style={{ color: '#EF4444', fontWeight: 900, fontSize: '0.85rem' }}>
                    {quickViewMember.bloodGroup || '---'}
                  </strong>
                </div>

                {quickViewMember.address && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingTop: '2px' }}>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <MapPin size={13} color="var(--text-secondary)" /> Address:
                    </span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600, textAlign: 'right', maxWidth: '200px', fontSize: '0.75rem' }}>
                      {quickViewMember.address}
                    </span>
                  </div>
                )}
              </div>

              {/* Digital Verification Authenticity Seal */}
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
                  <ShieldCheck size={16} />
                  <span>VERIFIED ACTIVE CREDENTIAL</span>
                </div>
                <span style={{ color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: '0.68rem' }}>
                  LF-SEC-2026
                </span>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div style={{ 
              display: 'flex', 
              gap: '0.6rem', 
              justifyContent: 'flex-end', 
              padding: '0.85rem 1.4rem', 
              borderTop: '1px solid var(--border-color)',
              background: 'var(--surface-color)'
            }}>
              <button 
                onClick={() => setQuickViewMember(null)} 
                className="btn btn-outline" 
                style={{ borderRadius: '10px', padding: '0.45rem 1rem', fontSize: '0.8rem' }}
              >
                Close
              </button>
              <button 
                onClick={() => {
                  const m = quickViewMember;
                  setQuickViewMember(null);
                  handleOpenEditMember(m);
                }} 
                className="btn btn-primary" 
                style={{ borderRadius: '10px', padding: '0.45rem 1.15rem', fontSize: '0.8rem', gap: '6px' }}
              >
                <Edit3 size={13} /> Edit Member
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ─── MODAL 1: EDIT / MANAGE MEMBER PROFILE ─── */}
      {mounted && selectedMember && createPortal(
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          background: 'rgba(15, 23, 42, 0.75)', 
          backdropFilter: 'blur(8px)', 
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 99999, 
          padding: '1.25rem',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div 
            className="card" 
            style={{ 
              width: '100%', 
              maxWidth: '640px', 
              maxHeight: '90vh', 
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--surface-color-solid)', 
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
              overflow: 'hidden',
              padding: 0
            }}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '1rem 1.5rem',
              borderBottom: '1px solid var(--border-color)',
              background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.05), rgba(217, 119, 6, 0.05))'
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <UserCheck size={18} color="var(--secondary-color)" /> Edit & Manage Member Profile
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Membership ID: <strong style={{ color: 'var(--secondary-color)' }}>{selectedMember.membershipNo || 'LF-2026'}</strong>
                </span>
              </div>
              <button 
                onClick={() => setSelectedMember(null)}
                style={{ 
                  background: 'rgba(0,0,0,0.05)', 
                  border: 'none', 
                  borderRadius: '50%', 
                  width: '30px', 
                  height: '30px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-primary)'
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(0,0,0,0.02)', padding: '0.85rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                {editMemberForm.profilePhoto ? (
                  <img src={editMemberForm.profilePhoto} alt="Preview" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--secondary-color)' }} />
                ) : (
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(30,58,138,0.12)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                    {editMemberForm.name ? editMemberForm.name.slice(0, 2).toUpperCase() : 'LF'}
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, marginBottom: '2px' }}>Profile Photo</label>
                  <input type="file" accept="image/*" onChange={(e) => handlePhotoUpload(e, true)} style={{ fontSize: '0.75rem', marginBottom: '4px' }} />
                  <input
                    type="text"
                    placeholder="Or enter image URL"
                    value={editMemberForm.profilePhoto}
                    onChange={(e) => setEditMemberForm({ ...editMemberForm, profilePhoto: e.target.value })}
                    style={{ width: '100%', padding: '0.4rem 0.65rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '0.75rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, marginBottom: '3px' }}>Full Name *</label>
                  <input type="text" value={editMemberForm.name} onChange={(e) => setEditMemberForm({ ...editMemberForm, name: e.target.value })} style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '0.85rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, marginBottom: '3px' }}>Phone Number</label>
                  <input type="text" value={editMemberForm.phone} onChange={(e) => setEditMemberForm({ ...editMemberForm, phone: e.target.value })} style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '0.85rem' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, marginBottom: '3px' }}>Official Designation</label>
                  <input type="text" value={editMemberForm.designation} onChange={(e) => setEditMemberForm({ ...editMemberForm, designation: e.target.value })} style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '0.85rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, marginBottom: '3px' }}>Blood Group</label>
                  <select value={editMemberForm.bloodGroup} onChange={(e) => setEditMemberForm({ ...editMemberForm, bloodGroup: e.target.value })} style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '0.85rem' }}>
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, marginBottom: '3px' }}>Address</label>
                <input type="text" value={editMemberForm.address} onChange={(e) => setEditMemberForm({ ...editMemberForm, address: e.target.value })} style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '0.85rem' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: currentUser?.role === 'SUPER_ADMIN' ? '1fr 1fr' : '1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, marginBottom: '3px' }}>Status</label>
                  <select value={editMemberForm.status} onChange={(e) => setEditMemberForm({ ...editMemberForm, status: e.target.value })} style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '0.85rem' }}>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
                {currentUser?.role === 'SUPER_ADMIN' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, marginBottom: '3px' }}>Role</label>
                    <select value={editMemberForm.role} onChange={(e) => setEditMemberForm({ ...editMemberForm, role: e.target.value })} style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '0.85rem' }}>
                      <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="TRUSTEE">TRUSTEE</option>
                      <option value="STAFF">STAFF</option>
                      <option value="CORE_MEMBER">CORE_MEMBER</option>
                      <option value="MEMBER">MEMBER</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', background: 'var(--surface-color)' }}>
              <button type="button" onClick={() => setSelectedMember(null)} className="btn btn-outline" style={{ borderRadius: '8px', padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Cancel</button>
              <button type="button" onClick={handleUpdateMember} className="btn btn-primary" style={{ borderRadius: '8px', padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}>Save Updates</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ─── MODAL 2: ADD NEW MEMBER MODAL ─── */}
      {mounted && showAddMemberModal && createPortal(
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          background: 'rgba(15, 23, 42, 0.75)', 
          backdropFilter: 'blur(8px)', 
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 99999, 
          padding: '1.25rem',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div 
            className="card" 
            style={{ 
              width: '100%', 
              maxWidth: '640px', 
              maxHeight: '90vh', 
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--surface-color-solid)', 
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
              overflow: 'hidden',
              padding: 0
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.05), rgba(217, 119, 6, 0.05))' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '7px' }}>
                <UserCheck size={18} color="var(--secondary-color)" /> Add New Foundation Member
              </h3>
              <button onClick={() => setShowAddMemberModal(false)} style={{ background: 'rgba(0,0,0,0.05)', border: 'none', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateMember} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
              <div style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, marginBottom: '3px' }}>Full Name *</label>
                    <input type="text" required placeholder="Full Name" value={newMemberData.name} onChange={(e) => setNewMemberData({ ...newMemberData, name: e.target.value })} style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '0.85rem' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, marginBottom: '3px' }}>Email Address *</label>
                    <input type="email" required placeholder="member@example.com" value={newMemberData.email} onChange={(e) => setNewMemberData({ ...newMemberData, email: e.target.value })} style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '0.85rem' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, marginBottom: '3px' }}>Phone Number</label>
                    <input type="text" placeholder="+91 98765 43210" value={newMemberData.phone} onChange={(e) => setNewMemberData({ ...newMemberData, phone: e.target.value })} style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '0.85rem' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, marginBottom: '3px' }}>Blood Group</label>
                    <select value={newMemberData.bloodGroup} onChange={(e) => setNewMemberData({ ...newMemberData, bloodGroup: e.target.value })} style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '0.85rem' }}>
                      {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, marginBottom: '3px' }}>Role</label>
                    <select value={newMemberData.role} onChange={(e) => setNewMemberData({ ...newMemberData, role: e.target.value })} style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '0.85rem' }}>
                      <option value="MEMBER">MEMBER</option>
                      <option value="CORE_MEMBER">CORE_MEMBER</option>
                      <option value="STAFF">STAFF</option>
                      <option value="TRUSTEE">TRUSTEE</option>
                      {currentUser?.role === 'SUPER_ADMIN' && <option value="ADMIN">ADMIN</option>}
                      {currentUser?.role === 'SUPER_ADMIN' && <option value="SUPER_ADMIN">SUPER_ADMIN</option>}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, marginBottom: '3px' }}>Official Designation</label>
                    <input type="text" placeholder="Designation" value={newMemberData.designation} onChange={(e) => setNewMemberData({ ...newMemberData, designation: e.target.value })} style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '0.85rem' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, marginBottom: '3px' }}>Address</label>
                  <input type="text" placeholder="Address" value={newMemberData.address} onChange={(e) => setNewMemberData({ ...newMemberData, address: e.target.value })} style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '0.85rem' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', background: 'var(--surface-color)' }}>
                <button type="button" onClick={() => setShowAddMemberModal(false)} className="btn btn-outline" style={{ borderRadius: '8px', padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ borderRadius: '8px', padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}>Create Member</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ─── MODAL 3: DONATION STATUS MANAGEMENT ─── */}
      {mounted && selectedDonation && createPortal(
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          background: 'rgba(15, 23, 42, 0.75)', 
          backdropFilter: 'blur(8px)', 
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 99999, 
          padding: '1.25rem',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '480px', background: 'var(--surface-color-solid)', border: '1px solid var(--border-color)', borderRadius: '16px', overflow: 'hidden', padding: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.05), rgba(217, 119, 6, 0.05))' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: 'var(--primary-color)' }}>Update Donation Status</h3>
              <button onClick={() => setSelectedDonation(null)} style={{ background: 'rgba(0,0,0,0.05)', border: 'none', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ background: 'rgba(0,0,0,0.02)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.8rem' }}>
                <p style={{ margin: '0 0 2px' }}><strong>Ref ID:</strong> <code style={{ color: 'var(--secondary-color)' }}>{selectedDonation.publicDonationId}</code></p>
                <p style={{ margin: '0 0 2px' }}><strong>Donor:</strong> {selectedDonation.donorName}</p>
                <p style={{ margin: 0 }}><strong>Amount:</strong> ₹{selectedDonation.amount} {selectedDonation.currency}</p>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, marginBottom: '3px' }}>Target Status</label>
                <select value={newDonationStatus} onChange={(e) => setNewDonationStatus(e.target.value)} style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '0.85rem' }}>
                  <option value="SUCCESS">SUCCESS (Verified Payment Received)</option>
                  <option value="PENDING">PENDING (Bank Reconciliation)</option>
                  <option value="FAILED">FAILED (Transaction Failed)</option>
                  <option value="CANCELLED">CANCELLED (Cancelled by Donor)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, marginBottom: '3px' }}>Bank Ref / Transaction ID</label>
                <input type="text" placeholder="e.g. UTR-9876543210" value={txnRefInput} onChange={(e) => setTxnRefInput(e.target.value)} style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '0.85rem' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', background: 'var(--surface-color)' }}>
              <button onClick={() => setSelectedDonation(null)} className="btn btn-outline" style={{ borderRadius: '8px', padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Cancel</button>
              <button onClick={handleUpdateDonationStatus} className="btn btn-primary" style={{ borderRadius: '8px', padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}>Save Verification</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ─── MODAL 4: WELFARE CLAIM REVIEW ─── */}
      {mounted && selectedWelfare && createPortal(
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          background: 'rgba(15, 23, 42, 0.75)', 
          backdropFilter: 'blur(8px)', 
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 99999, 
          padding: '1.25rem',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '520px', background: 'var(--surface-color-solid)', border: '1px solid var(--border-color)', borderRadius: '16px', overflow: 'hidden', padding: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.05), rgba(217, 119, 6, 0.05))' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: 'var(--primary-color)' }}>Review Welfare Claim</h3>
              <button onClick={() => setSelectedWelfare(null)} style={{ background: 'rgba(0,0,0,0.05)', border: 'none', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ background: 'rgba(0,0,0,0.02)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.8rem' }}>
                <p style={{ margin: '0 0 2px' }}><strong>Applicant:</strong> {selectedWelfare.member?.name || 'Applicant'}</p>
                <p style={{ margin: '0 0 2px' }}><strong>Type:</strong> {selectedWelfare.requestType}</p>
                <p style={{ margin: 0 }}><strong>Requested Amount:</strong> ₹{selectedWelfare.amountRequested}</p>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, marginBottom: '3px' }}>Claim Status</label>
                <select value={newWelfareStatus} onChange={(e) => setNewWelfareStatus(e.target.value)} style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '0.85rem' }}>
                  <option value="SUBMITTED">SUBMITTED</option>
                  <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="DISBURSED">DISBURSED</option>
                  <option value="REJECTED">REJECTED</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, marginBottom: '3px' }}>Approved Amount (INR)</label>
                <input type="number" value={welfareAmount} onChange={(e) => setWelfareAmount(e.target.value)} style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '0.85rem' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, marginBottom: '3px' }}>Notes</label>
                <textarea rows={2} value={welfareNotes} onChange={(e) => setWelfareNotes(e.target.value)} style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '0.85rem' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', background: 'var(--surface-color)' }}>
              <button onClick={() => setSelectedWelfare(null)} className="btn btn-outline" style={{ borderRadius: '8px', padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Cancel</button>
              <button onClick={handleUpdateWelfare} className="btn btn-primary" style={{ borderRadius: '8px', padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}>Save Decision</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
