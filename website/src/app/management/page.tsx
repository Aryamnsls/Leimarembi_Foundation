"use client";

import { useState } from 'react';
import { Users, Search, Landmark, Heart, FileText, CheckCircle2, Clock, XCircle, AlertCircle, X } from 'lucide-react';

interface DonationRecord {
  publicDonationId: string;
  donorName: string;
  email: string;
  phone?: string;
  amount: number;
  currency: string;
  receiptNo: string;
  purpose: string;
  status: 'SUCCESS' | 'PENDING' | 'CREATED' | 'FAILED' | 'EXPIRED' | 'CANCELLED';
  paymentMethod: string;
  createdAt: string;
}

export default function Management() {
  const [activeTab, setActiveTab] = useState<'MEMBERS' | 'DONATIONS'>('DONATIONS');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDonation, setSelectedDonation] = useState<DonationRecord | null>(null);

  const members = [
    { id: 'LFA-001', name: 'N. Tomba Singh', type: 'Life Member', joinDate: '2023-01-15', status: 'Active' },
    { id: 'LFA-002', name: 'Th. Bembem Devi', type: 'Annual Member', joinDate: '2024-02-10', status: 'Pending Renewal' },
    { id: 'LFA-003', name: 'K. Rajendra', type: 'Life Member', joinDate: '2022-11-05', status: 'Active' },
    { id: 'LFA-004', name: 'S. Chaoba', type: 'Volunteer', joinDate: '2024-05-20', status: 'Active' },
  ];

  const donations: DonationRecord[] = [
    {
      publicDonationId: 'DON-20260901-SEED0001',
      donorName: 'Dr. Th. Ningthemba Singh',
      email: 'admin@leimarembifoundation.org',
      phone: '9876543210',
      amount: 25000,
      currency: 'INR',
      receiptNo: 'LFR-2026-00001',
      purpose: 'Cultural Preservation Corpus Fund',
      status: 'SUCCESS',
      paymentMethod: 'UPI_QR',
      createdAt: '2026-09-01 10:15 AM',
    },
    {
      publicDonationId: 'DON-20260901-SEED0002',
      donorName: 'K. Tomba Meitei',
      email: 'tomba@example.com',
      phone: '9123456789',
      amount: 10000,
      currency: 'INR',
      receiptNo: 'LFR-2026-00002',
      purpose: 'Free Medical Camp Drive',
      status: 'SUCCESS',
      paymentMethod: 'BANK_TRANSFER',
      createdAt: '2026-09-01 11:30 AM',
    },
    {
      publicDonationId: 'DON-20260901-8A9F3C21',
      donorName: 'M. Ibomcha Sharma',
      email: 'ibomcha@example.com',
      phone: '9871234567',
      amount: 5000,
      currency: 'INR',
      receiptNo: 'LFR-2026-00003',
      purpose: 'Senior Citizen Welfare Fund',
      status: 'PENDING',
      paymentMethod: 'UPI_QR',
      createdAt: '2026-09-01 02:45 PM',
    },
    {
      publicDonationId: 'DON-20260901-7B2E1D99',
      donorName: 'S. Sanatombi Devi',
      email: 'sanatombi@example.com',
      phone: '9436012345',
      amount: 2500,
      currency: 'INR',
      receiptNo: 'LFR-2026-00004',
      purpose: 'Digital Archive Infrastructure',
      status: 'EXPIRED',
      paymentMethod: 'UPI_INTENT',
      createdAt: '2026-09-01 03:10 PM',
    },
  ];

  const filteredMembers = members.filter(m =>
    !searchQuery ||
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDonations = donations.filter(d =>
    !searchQuery ||
    d.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.publicDonationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.receiptNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSuccessAmount = donations
    .filter(d => d.status === 'SUCCESS')
    .reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="animate-fade-in" style={{ padding: '2.5rem 0 4rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <div className="glass-panel" style={{ padding: '0.4rem 1.25rem', borderRadius: '30px', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--secondary-color)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            Module 3: NGO Administration & Governance
          </span>
        </div>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <Landmark size={36} color="var(--secondary-color)" /> Foundation Management Portal
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', maxWidth: '700px', margin: '0.5rem auto 0' }}>
          Internal executive panel for tracking real donation records, member directories, and verifiable financial receipts.
        </p>
      </div>

      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ background: 'var(--primary-color)', color: 'white', borderTop: '4px solid var(--secondary-color)' }}>
          <h3 style={{ color: '#FFFFFF', fontSize: '1rem', fontWeight: 700 }}>Total Registered Members</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 900, margin: '0.2rem 0' }}>1,245</p>
          <p style={{ opacity: 0.85, fontSize: '0.85rem' }}>Active Community Roster</p>
        </div>

        <div className="card" style={{ background: 'var(--secondary-color)', color: '#111827' }}>
          <h3 style={{ color: '#111827', fontSize: '1rem', fontWeight: 800 }}>Verified Donations Total</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 900, margin: '0.2rem 0', color: '#111827' }}>
            ₹{totalSuccessAmount.toLocaleString()}
          </p>
          <p style={{ opacity: 0.9, fontSize: '0.85rem', color: '#111827', fontWeight: 600 }}>Verified Server Receipts</p>
        </div>

        <div className="card" style={{ borderTop: '4px solid var(--accent-color)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Pending Reconciliations</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent-color)', margin: '0.2rem 0' }}>
            {donations.filter(d => d.status === 'PENDING').length}
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Awaiting Bank Reconciliation</p>
        </div>
      </div>

      {/* Main Panel with Tabs */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', background: 'rgba(0,0,0,0.02)' }}>
          {/* Tab buttons */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setActiveTab('DONATIONS')}
              className={activeTab === 'DONATIONS' ? 'btn btn-primary' : 'btn btn-outline'}
              style={{ fontSize: '0.875rem', gap: '6px' }}
            >
              <Heart size={16} /> Donation Records & Receipts
            </button>
            <button
              onClick={() => setActiveTab('MEMBERS')}
              className={activeTab === 'MEMBERS' ? 'btn btn-primary' : 'btn btn-outline'}
              style={{ fontSize: '0.875rem', gap: '6px' }}
            >
              <Users size={16} /> Member Directory
            </button>
          </div>

          {/* Search bar */}
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface-color-solid)', padding: '0.4rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <Search size={16} style={{ color: 'var(--text-secondary)', marginRight: '8px' }} />
            <input
              type="text"
              placeholder={activeTab === 'DONATIONS' ? "Search donation ID, donor, receipt..." : "Search member..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.875rem', width: '220px' }}
            />
          </div>
        </div>

        {/* DONATIONS TAB CONTENT */}
        {activeTab === 'DONATIONS' && (
          <div className="table-responsive">
            <table>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.03)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '1rem 1.25rem' }}>Donation Ref ID</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Receipt No</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Donor Name</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Amount</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Method</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Status</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDonations.map((d) => (
                  <tr key={d.publicDonationId} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 1.25rem' }}><code style={{ fontWeight: 700 }}>{d.publicDonationId}</code></td>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>{d.receiptNo}</td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ fontWeight: 700 }}>{d.donorName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{d.email}</div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 800 }}>₹{d.amount.toLocaleString()}</td>
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{d.paymentMethod}</td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <StatusBadge status={d.status} />
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <button
                        onClick={() => setSelectedDonation(d)}
                        className="btn btn-ghost"
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.825rem', color: 'var(--primary-color)' }}
                      >
                        View Record
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* MEMBERS TAB CONTENT */}
        {activeTab === 'MEMBERS' && (
          <div className="table-responsive">
            <table>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.03)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 700 }}>ID</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 700 }}>Name</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 700 }}>Type</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 700 }}>Join Date</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 700 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((m, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 700 }}>{m.id}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>{m.name}</td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{m.type}</td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{m.joinDate}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{
                        padding: '0.3rem 0.65rem',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        background: m.status === 'Active' ? 'rgba(39, 174, 96, 0.12)' : 'rgba(212, 175, 55, 0.15)',
                        color: m.status === 'Active' ? 'var(--success-color)' : 'var(--secondary-color)',
                        fontWeight: 800
                      }}>
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DONATION DETAIL MODAL */}
      {selectedDonation && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-donation-title"
          style={{
            position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(10, 25, 47, 0.8)', backdropFilter: 'blur(8px)', padding: '1.5rem'
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
                width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-primary)'
              }}
            >
              <X size={18} />
            </button>

            <h3 id="modal-donation-title" style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={22} color="var(--primary-color)" /> Donation Audit Record
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.95rem' }}>
              <div style={detailRow}><span>Public Donation ID:</span><code>{selectedDonation.publicDonationId}</code></div>
              <div style={detailRow}><span>Receipt Number:</span><strong>{selectedDonation.receiptNo}</strong></div>
              <div style={detailRow}><span>Donor Name:</span><strong>{selectedDonation.donorName}</strong></div>
              <div style={detailRow}><span>Donor Email:</span><span>{selectedDonation.email}</span></div>
              <div style={detailRow}><span>Phone:</span><span>{selectedDonation.phone || 'N/A'}</span></div>
              <div style={detailRow}><span>Amount:</span><strong style={{ fontSize: '1.15rem', color: 'var(--primary-color)' }}>₹{selectedDonation.amount.toLocaleString()} INR</strong></div>
              <div style={detailRow}><span>Payment Method:</span><span>{selectedDonation.paymentMethod}</span></div>
              <div style={detailRow}><span>Purpose:</span><span>{selectedDonation.purpose}</span></div>
              <div style={detailRow}><span>Status:</span><StatusBadge status={selectedDonation.status} /></div>
              <div style={detailRow}><span>Created Time:</span><span>{selectedDonation.createdAt}</span></div>
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
              <button onClick={() => setSelectedDonation(null)} className="btn btn-primary">
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'SUCCESS') {
    return (
      <span style={{ padding: '0.25rem 0.65rem', borderRadius: '6px', fontSize: '0.8rem', background: 'rgba(39, 174, 96, 0.12)', color: 'var(--success-color)', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        <CheckCircle2 size={13} /> SUCCESS
      </span>
    );
  }
  if (status === 'PENDING') {
    return (
      <span style={{ padding: '0.25rem 0.65rem', borderRadius: '6px', fontSize: '0.8rem', background: 'rgba(212, 175, 55, 0.15)', color: 'var(--secondary-color)', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        <Clock size={13} /> PENDING
      </span>
    );
  }
  if (status === 'EXPIRED') {
    return (
      <span style={{ padding: '0.25rem 0.65rem', borderRadius: '6px', fontSize: '0.8rem', background: 'rgba(230, 57, 70, 0.12)', color: '#c0392b', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        <XCircle size={13} /> EXPIRED
      </span>
    );
  }
  return (
    <span style={{ padding: '0.25rem 0.65rem', borderRadius: '6px', fontSize: '0.8rem', background: 'rgba(0,0,0,0.06)', color: 'var(--text-secondary)', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
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
