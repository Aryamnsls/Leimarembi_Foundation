import { Users, FileText, Search, CreditCard, Filter } from 'lucide-react';

export default function Management() {
  const members = [
    { id: 'LFA-001', name: 'N. Tomba Singh', type: 'Life Member', joinDate: '2023-01-15', status: 'Active' },
    { id: 'LFA-002', name: 'Th. Bembem Devi', type: 'Annual', joinDate: '2024-02-10', status: 'Pending Renewal' },
    { id: 'LFA-003', name: 'K. Rajendra', type: 'Life Member', joinDate: '2022-11-05', status: 'Active' },
    { id: 'LFA-004', name: 'S. Chaoba', type: 'Volunteer', joinDate: '2024-05-20', status: 'Active' },
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <h1 className="glass-panel" style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
        <Users size={32} color="var(--secondary-color)" /> Foundation Management
      </h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        <div className="card" style={{ background: 'var(--primary-color)', color: 'white' }}>
          <h3 style={{ color: 'var(--text-light)' }}>Total Members</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 700 }}>1,245</p>
          <p style={{ opacity: 0.8 }}>+12 this month</p>
        </div>
        <div className="card" style={{ background: 'var(--secondary-color)', color: 'var(--primary-color)' }}>
          <h3 style={{ color: 'var(--primary-color)' }}>Donations Received</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 700 }}>₹4.2L</p>
          <p style={{ opacity: 0.8 }}>YTD FY 2025-26</p>
        </div>
        <div className="card" style={{ background: 'var(--surface-color)' }}>
          <h3>Pending Receipts</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--accent-color)' }}>18</p>
          <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', marginTop: '0.5rem' }}>Generate All</button>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Member Database</h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-color)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <Search size={18} style={{ color: 'var(--text-secondary)', marginRight: '10px' }} />
              <input type="text" placeholder="Search members..." style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)' }} />
            </div>
            <button className="btn" style={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Filter size={18} /> Filter
            </button>
          </div>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--bg-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>ID</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Name</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Type</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Join Date</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{m.id}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>{m.name}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>{m.type}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>{m.joinDate}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ 
                      padding: '0.35rem 0.75rem', 
                      borderRadius: '50px', 
                      fontSize: '0.85rem',
                      background: m.status === 'Active' ? 'rgba(56, 161, 105, 0.1)' : 'rgba(214, 158, 46, 0.1)',
                      color: m.status === 'Active' ? '#38A169' : '#D69E2E',
                      fontWeight: 600
                    }}>
                      {m.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <button style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 600 }}>View Profile</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '1rem 1.5rem', background: 'var(--bg-color)', color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'right' }}>
          Showing 1 to 4 of 1,245 entries
        </div>
      </div>
    </div>
  );
}
