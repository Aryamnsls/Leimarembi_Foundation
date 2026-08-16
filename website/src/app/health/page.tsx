import { HeartPulse, Calendar, Phone, Activity } from 'lucide-react';

export default function Health() {
  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <h1 className="glass-panel" style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
        <HeartPulse size={32} color="#E53E3E" /> Health & Welfare Module
      </h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ background: 'rgba(229, 62, 62, 0.1)', color: '#E53E3E', padding: '1rem', borderRadius: '50%' }}>
            <Calendar size={32} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Upcoming Medical Camp</h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>August 25, 2025 • Imphal East</p>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ background: 'rgba(56, 161, 105, 0.1)', color: '#38A169', padding: '1rem', borderRadius: '50%' }}>
            <Activity size={32} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Check-ups Completed</h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>450 Senior Citizens (This Year)</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem' }}>Emergency Contact Database</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: 0 }}>RIMS Ambulance Service</h4>
                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>Regional Institute of Medical Sciences</p>
              </div>
              <button className="btn" style={{ background: 'rgba(10, 25, 47, 0.05)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '5px', padding: '0.5rem 1rem' }}>
                <Phone size={16} /> Call
              </button>
            </div>
            <div style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: 0 }}>JNIMS Hospital Emergency</h4>
                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>Jawaharlal Nehru Institute of Medical Sciences</p>
              </div>
              <button className="btn" style={{ background: 'rgba(10, 25, 47, 0.05)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '5px', padding: '0.5rem 1rem' }}>
                <Phone size={16} /> Call
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 style={{ marginBottom: '1.5rem' }}>Welfare Assistance Tracking</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--bg-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '0.8rem' }}>Beneficiary Name</th>
                <th style={{ padding: '0.8rem' }}>Assistance Type</th>
                <th style={{ padding: '0.8rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.8rem' }}>O. Ibomcha Singh</td>
                <td style={{ padding: '0.8rem' }}>Monthly Pension</td>
                <td style={{ padding: '0.8rem', color: '#38A169', fontWeight: 500 }}>Disbursed</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.8rem' }}>S. Sanatombi Devi</td>
                <td style={{ padding: '0.8rem' }}>Medical Coverage</td>
                <td style={{ padding: '0.8rem', color: '#D69E2E', fontWeight: 500 }}>Processing</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.8rem' }}>L. Kunjo</td>
                <td style={{ padding: '0.8rem' }}>Food Rations</td>
                <td style={{ padding: '0.8rem', color: '#38A169', fontWeight: 500 }}>Disbursed</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
