import { Landmark, ArrowRight, CheckCircle, Clock } from 'lucide-react';

export const metadata = {
  title: 'Government Grants | Leimarembi Foundation',
  description: 'Track Government Grant Proposals and PFMS status.',
};

export default function Grants() {
  const schemes = [
    { name: 'Senior Citizen Welfare Fund', department: 'Social Welfare', amount: '₹10,00,000', status: 'Approved', date: 'Aug 10, 2025' },
    { name: 'Cultural Heritage Preservation Grant', department: 'Ministry of Culture', amount: '₹5,00,000', status: 'Under Review', date: 'Jul 22, 2025' },
    { name: 'Community Health Infrastructure', department: 'Health Services', amount: '₹15,00,000', status: 'Draft', date: 'Aug 16, 2025' }
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '2.5rem 0 4rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <div className="glass-panel" style={{ padding: '0.4rem 1.25rem', borderRadius: '30px', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--secondary-color)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            Module 4: Grant Tracking & PFMS Records
          </span>
        </div>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <Landmark size={36} color="var(--info-color)" /> Government Grant Management
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', maxWidth: '700px', margin: '0.5rem auto 0' }}>
          Proposal preparation, scheme database management, and Public Financial Management System (PFMS) tracking.
        </p>
      </div>

      <div className="card" style={{ marginBottom: '3rem', padding: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', fontWeight: 800 }}>Application Pipeline</h2>
        <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          <div style={{ flex: '1 1 220px', padding: '1.25rem', background: 'rgba(0,0,0,0.02)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
            <h4 style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase', fontWeight: 700 }}>1. Proposal Preparation</h4>
            <div style={{ background: 'var(--surface-color-solid)', padding: '1rem', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
              <strong style={{ display: 'block', fontSize: '0.95rem' }}>Health Infrastructure</strong>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Completion: 80%</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}><ArrowRight size={20} /></div>
          
          <div style={{ flex: '1 1 220px', padding: '1.25rem', background: 'rgba(0,0,0,0.02)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
            <h4 style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase', fontWeight: 700 }}>2. Under Review</h4>
            <div style={{ background: 'var(--surface-color-solid)', padding: '1rem', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
              <strong style={{ display: 'block', fontSize: '0.95rem' }}>Cultural Heritage Grant</strong>
              <div style={{ fontSize: '0.85rem', color: 'var(--secondary-color)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600 }}>
                <Clock size={14} /> Pending PFMS
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}><ArrowRight size={20} /></div>

          <div style={{ flex: '1 1 220px', padding: '1.25rem', background: 'rgba(39, 174, 96, 0.05)', border: '1px solid rgba(39, 174, 96, 0.25)', borderRadius: '12px' }}>
            <h4 style={{ color: 'var(--success-color)', marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase', fontWeight: 700 }}>3. Approved & Funded</h4>
            <div style={{ background: 'var(--surface-color-solid)', padding: '1rem', borderRadius: '8px', boxShadow: 'var(--shadow-sm)', borderLeft: '4px solid var(--success-color)' }}>
              <strong style={{ display: 'block', fontSize: '0.95rem' }}>Senior Welfare Fund</strong>
              <div style={{ fontSize: '0.85rem', color: 'var(--success-color)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600 }}>
                <CheckCircle size={14} /> Funds Disbursed
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Scheme Database & Applications</h2>
          <Link href="/ai" className="btn btn-primary" style={{ fontSize: '0.875rem' }}>
            ✨ Search Schemes with AI
          </Link>
        </div>
        <div className="table-responsive">
          <table>
            <thead>
              <tr style={{ background: 'rgba(0,0,0,0.03)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '1rem' }}>Scheme Name</th>
                <th style={{ padding: '1rem' }}>Department</th>
                <th style={{ padding: '1rem' }}>Target Amount</th>
                <th style={{ padding: '1rem' }}>Last Updated</th>
                <th style={{ padding: '1rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {schemes.map((s, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', fontWeight: 700 }}>{s.name}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{s.department}</td>
                  <td style={{ padding: '1rem', fontWeight: 700 }}>{s.amount}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{s.date}</td>
                  <td style={{ padding: '1rem' }}>
                     <span style={{ 
                        padding: '0.3rem 0.65rem', 
                        borderRadius: '6px', 
                        fontSize: '0.8rem',
                        background: s.status === 'Approved' ? 'rgba(39, 174, 96, 0.12)' : s.status === 'Under Review' ? 'rgba(212, 175, 55, 0.15)' : 'rgba(0,0,0,0.06)',
                        color: s.status === 'Approved' ? 'var(--success-color)' : s.status === 'Under Review' ? 'var(--secondary-color)' : 'var(--text-secondary)',
                        fontWeight: 800
                      }}>
                        {s.status}
                      </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Add Link import for Next.js
import Link from 'next/link';
