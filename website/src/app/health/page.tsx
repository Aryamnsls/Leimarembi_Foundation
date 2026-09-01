import { HeartPulse, Calendar, Phone, Activity } from 'lucide-react';

export const metadata = {
  title: 'Health & Welfare | Leimarembi Foundation',
  description: 'Senior Citizen Medical Check-ups & Welfare Assistance.',
};

export default function Health() {
  return (
    <div className="animate-fade-in" style={{ padding: '2.5rem 0 4rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <div className="glass-panel" style={{ padding: '0.4rem 1.25rem', borderRadius: '30px', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--secondary-color)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            Module 6: Community Health & Senior Welfare
          </span>
        </div>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <HeartPulse size={36} color="var(--accent-color)" /> Health & Welfare Module
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', maxWidth: '700px', margin: '0.5rem auto 0' }}>
          Supporting senior citizens with medical camps, health check-up records, and welfare assistance tracking.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        <div className="card" style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', borderTop: '4px solid var(--accent-color)' }}>
          <div style={{ background: 'rgba(230, 57, 70, 0.12)', color: 'var(--accent-color)', padding: '1rem', borderRadius: '50%', flexShrink: 0 }}>
            <Calendar size={32} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Upcoming Medical Camp</h3>
            <p style={{ color: 'var(--text-secondary)', margin: '0.2rem 0 0', fontSize: '0.95rem' }}>August 25, 2026 • Imphal East</p>
          </div>
        </div>
        
        <div className="card" style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', borderTop: '4px solid var(--success-color)' }}>
          <div style={{ background: 'rgba(39, 174, 96, 0.12)', color: 'var(--success-color)', padding: '1rem', borderRadius: '50%', flexShrink: 0 }}>
            <Activity size={32} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Check-ups Completed</h3>
            <p style={{ color: 'var(--text-secondary)', margin: '0.2rem 0 0', fontSize: '0.95rem' }}>450 Senior Citizens (This Year)</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 800 }}>Emergency Contact Database</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>RIMS Ambulance Service</h4>
                <p style={{ color: 'var(--text-secondary)', margin: '0.2rem 0 0', fontSize: '0.85rem' }}>Regional Institute of Medical Sciences</p>
              </div>
              <a href="tel:102" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}>
                <Phone size={16} /> Call
              </a>
            </div>
            
            <div style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>JNIMS Hospital Emergency</h4>
                <p style={{ color: 'var(--text-secondary)', margin: '0.2rem 0 0', fontSize: '0.85rem' }}>Jawaharlal Nehru Institute of Medical Sciences</p>
              </div>
              <a href="tel:108" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}>
                <Phone size={16} /> Call
              </a>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 800 }}>Welfare Assistance Tracking</h2>
          <div className="table-responsive">
            <table>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.03)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '0.85rem' }}>Beneficiary Name</th>
                  <th style={{ padding: '0.85rem' }}>Assistance Type</th>
                  <th style={{ padding: '0.85rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.85rem', fontWeight: 700 }}>O. Ibomcha Singh</td>
                  <td style={{ padding: '0.85rem', color: 'var(--text-secondary)' }}>Monthly Pension</td>
                  <td style={{ padding: '0.85rem', color: 'var(--success-color)', fontWeight: 800 }}>Disbursed</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.85rem', fontWeight: 700 }}>S. Sanatombi Devi</td>
                  <td style={{ padding: '0.85rem', color: 'var(--text-secondary)' }}>Medical Coverage</td>
                  <td style={{ padding: '0.85rem', color: 'var(--secondary-color)', fontWeight: 800 }}>Processing</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.85rem', fontWeight: 700 }}>L. Kunjo</td>
                  <td style={{ padding: '0.85rem', color: 'var(--text-secondary)' }}>Food Rations</td>
                  <td style={{ padding: '0.85rem', color: 'var(--success-color)', fontWeight: 800 }}>Disbursed</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
