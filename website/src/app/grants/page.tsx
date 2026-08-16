import { Landmark, ArrowRight, CheckCircle, Clock } from 'lucide-react';

export default function Grants() {
  const schemes = [
    { name: 'Senior Citizen Welfare Fund', department: 'Social Welfare', amount: '₹10,00,000', status: 'Approved', date: 'Aug 10, 2025' },
    { name: 'Cultural Heritage Preservation Grant', department: 'Ministry of Culture', amount: '₹5,00,000', status: 'Under Review', date: 'Jul 22, 2025' },
    { name: 'Community Health Infrastructure', department: 'Health Services', amount: '₹15,00,000', status: 'Draft', date: 'Aug 16, 2025' }
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <h1 className="glass-panel" style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
        <Landmark size={32} color="#2B6CB0" /> Government Grant Management
      </h1>
      
      <div className="card" style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Application Pipeline</h2>
        <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
          <div style={{ flex: '1 1 200px', padding: '1.5rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
            <h4 style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>1. Proposal Preparation</h4>
            <div style={{ background: 'var(--surface-color)', padding: '1rem', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
              <strong>Health Infrastructure</strong>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Completion: 80%</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}><ArrowRight size={24} /></div>
          
          <div style={{ flex: '1 1 200px', padding: '1.5rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
            <h4 style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>2. Under Review</h4>
            <div style={{ background: 'var(--surface-color)', padding: '1rem', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
              <strong>Cultural Heritage Grant</strong>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Clock size={14} /> Pending PFMS
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}><ArrowRight size={24} /></div>

          <div style={{ flex: '1 1 200px', padding: '1.5rem', background: 'rgba(56, 161, 105, 0.05)', border: '1px solid rgba(56, 161, 105, 0.2)', borderRadius: '8px' }}>
            <h4 style={{ color: '#38A169', marginBottom: '1rem' }}>3. Approved & Funded</h4>
            <div style={{ background: 'var(--surface-color)', padding: '1rem', borderRadius: '8px', boxShadow: 'var(--shadow-sm)', borderLeft: '4px solid #38A169' }}>
              <strong>Senior Welfare Fund</strong>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <CheckCircle size={14} color="#38A169" /> Funds Disbursed
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>Scheme Database & Applications</h2>
          <button className="btn btn-primary">+ New Application</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--bg-color)', color: 'var(--text-secondary)' }}>
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
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{s.name}</td>
                  <td style={{ padding: '1rem' }}>{s.department}</td>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>{s.amount}</td>
                  <td style={{ padding: '1rem' }}>{s.date}</td>
                  <td style={{ padding: '1rem' }}>
                     <span style={{ 
                        padding: '0.3rem 0.6rem', 
                        borderRadius: '4px', 
                        fontSize: '0.8rem',
                        background: s.status === 'Approved' ? 'rgba(56, 161, 105, 0.1)' : s.status === 'Under Review' ? 'rgba(214, 158, 46, 0.1)' : 'var(--bg-color)',
                        color: s.status === 'Approved' ? '#38A169' : s.status === 'Under Review' ? '#D69E2E' : 'var(--text-secondary)',
                        fontWeight: 600
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
