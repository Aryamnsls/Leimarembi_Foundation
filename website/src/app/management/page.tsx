"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { 
  Users, Search, Landmark, Heart, FileText, CheckCircle2, 
  Clock, XCircle, AlertCircle, X, Plus, Printer, Download, 
  Trash2, ShieldCheck, ShieldAlert, Sparkles, Phone, Mail, MapPin, Calendar
} from 'lucide-react';
import Image from 'next/image';
import { 
  DonationRecord, 
  getDonations, 
  saveDonations, 
  recordNewDonation, 
  OFFICIAL_SEED_DONATIONS 
} from '@/lib/donationLedger';
import { isSuperAdmin } from '@/lib/superAdminAuth';
import { canSwitchRoleMode, EXECUTIVE_OFFICERS } from '@/lib/executiveOfficers';

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
  const [activeTab, setActiveTab] = useState<'DONATIONS' | 'MEMBERS'>('DONATIONS');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDonation, setSelectedDonation] = useState<DonationRecord | null>(null);
  const [printDonation, setPrintDonation] = useState<DonationRecord | null>(null);
  const [isSuperAdminUser, setIsSuperAdminUser] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

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

  // Load User & Check Super Admin status
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('lf_user');
      if (userStr) {
        try {
          const u = JSON.parse(userStr);
          setCurrentUser(u);
          if (isSuperAdmin(u)) {
            setIsSuperAdminUser(true);
          }
        } catch {}
      }
    }
  }, []);

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
  }, []);

  // Initial load & real-time live event listeners
  useEffect(() => {
    syncData();

    const handleStorageChange = () => {
      syncData();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('lf_donation_updated', handleStorageChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('lf_donation_updated', handleStorageChange as EventListener);
    };
  }, [syncData]);

  // Filtered Donations
  const filteredDonations = useMemo(() => {
    return donations.filter(d =>
      !searchQuery ||
      d.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.publicDonationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.receiptNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.email && d.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [donations, searchQuery]);

  // Filtered Members
  const filteredMembers = useMemo(() => {
    return members.filter(m =>
      !searchQuery ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.membershipNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [members, searchQuery]);

  // Metrics (Live Updated)
  const totalSuccessAmount = useMemo(() => {
    return donations
      .filter(d => d.status === 'SUCCESS')
      .reduce((sum, d) => sum + d.amount, 0);
  }, [donations]);

  const pendingCount = useMemo(() => {
    return donations.filter(d => d.status === 'PENDING').length;
  }, [donations]);

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

  return (
    <div className="animate-fade-in" style={{ padding: '2.5rem 0 4rem' }}>
      {/* Header Banner */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div className="glass-panel" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0.4rem 1.25rem', borderRadius: '30px', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--secondary-color)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            Module 3: NGO Administration & Governance
          </span>
          {isSuperAdminUser && (
            <span style={{ background: '#F59E0B', color: '#000', fontSize: '0.75rem', fontWeight: 900, padding: '2px 8px', borderRadius: '12px' }}>
              ⭐ SUPER ADMIN ACCESS
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

      {/* Live Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {/* Total Registered Members (Live dynamically computed from Super Admin registry & Database) */}
        <div 
          onClick={() => setActiveTab('MEMBERS')}
          className="card" 
          style={{ 
            background: 'var(--primary-color)', 
            color: 'white', 
            borderTop: '4px solid var(--secondary-color)',
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
          }}
          title="Click to view registered members"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: '#FFFFFF', fontSize: '1rem', fontWeight: 700, margin: 0 }}>Total Registered Members</h3>
            <Users size={20} color="var(--secondary-color)" />
          </div>
          <p style={{ fontSize: '2.5rem', fontWeight: 900, margin: '0.4rem 0' }}>
            {members.length}
          </p>
          <p style={{ opacity: 0.85, fontSize: '0.85rem', margin: 0 }}>
            Active Community Roster (Live Synced)
          </p>
        </div>

        {/* Verified Donations Total (Live from Official Receipts Ledger) */}
        <div 
          onClick={() => setActiveTab('DONATIONS')}
          className="card" 
          style={{ 
            background: 'var(--secondary-color)', 
            color: '#111827',
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
          }}
          title="Click to view verified donations"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: '#111827', fontSize: '1rem', fontWeight: 800, margin: 0 }}>Verified Donations Total</h3>
            <Heart size={20} color="#111827" />
          </div>
          <p style={{ fontSize: '2.5rem', fontWeight: 900, margin: '0.4rem 0', color: '#111827' }}>
            ₹{totalSuccessAmount.toLocaleString('en-IN')}
          </p>
          <p style={{ opacity: 0.9, fontSize: '0.85rem', color: '#111827', fontWeight: 600, margin: 0 }}>
            {donations.filter(d => d.status === 'SUCCESS').length} Official Verified Receipts
          </p>
        </div>

        {/* Pending Reconciliations (Live Dynamic Count) */}
        <div 
          onClick={() => setActiveTab('DONATIONS')}
          className="card" 
          style={{ 
            borderTop: '4px solid var(--accent-color)',
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Pending Reconciliations</h3>
            <Clock size={20} color="var(--accent-color)" />
          </div>
          <p style={{ fontSize: '2.5rem', fontWeight: 900, color: pendingCount > 0 ? 'var(--accent-color)' : '#10B981', margin: '0.4rem 0' }}>
            {pendingCount}
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
            {pendingCount > 0 ? 'Awaiting Bank Reconciliation' : '✓ All Receipts Fully Reconciled'}
          </p>
        </div>
      </div>

      {/* Main Panel with Tabs & Super Admin Actions */}
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
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
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
          </div>

          {/* Actions & Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Super Admin Action Buttons */}
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
