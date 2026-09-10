import { HeartPulse, Calendar, Phone, Activity, Clock } from 'lucide-react';

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
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center', justifyContent: 'flex-start', textAlign: 'center', borderTop: '4px solid var(--accent-color)' }}>
          <div style={{ background: 'rgba(230, 57, 70, 0.12)', color: 'var(--accent-color)', padding: '1rem', borderRadius: '50%', flexShrink: 0 }}>
            <Calendar size={32} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Upcoming Medical Camp</h3>
            {/* @ts-ignore */}
            <marquee scrollamount="4" style={{ display: 'block', margin: '0.2rem auto 0', color: 'var(--text-secondary)', fontSize: '0.95rem', width: '100%', maxWidth: '200px' }}>To be notified soon</marquee>
            <a
              href="https://www.google.com/maps/search/Manipuri+Rajbari,+Guwahati-781007,+Assam,+India"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--secondary-color)', display: 'inline-block', marginTop: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}
            >
              Manipuri Rajbari, Guwahati-781007, Assam
            </a>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center', justifyContent: 'flex-start', textAlign: 'center', borderTop: '4px solid var(--success-color)' }}>
          <div className="animate-pulse-icon" style={{ background: 'rgba(39, 174, 96, 0.12)', color: 'var(--success-color)', padding: '1rem', borderRadius: '50%', flexShrink: 0 }}>
            <Activity size={32} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Check-ups Completed</h3>
            {/* @ts-ignore */}
            <marquee scrollamount="4" style={{ display: 'block', margin: '0.2rem auto 0', color: 'var(--text-secondary)', fontSize: '0.95rem', width: '100%', maxWidth: '200px' }}>To be notified soon</marquee>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 800 }}>Emergency Contact Database</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>GNRC Hospital Ambulance</h4>
                <p style={{ color: 'var(--text-secondary)', margin: '0.2rem 0 0', fontSize: '0.85rem' }}>GNRC Hospital Sixmile, Guwahati</p>
              </div>
              <a href="tel:18003450011" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}>
                <Phone size={16} /> Call
              </a>
            </div>

            <div style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>Down Town Hospital Emergency</h4>
                <p style={{ color: 'var(--text-secondary)', margin: '0.2rem 0 0', fontSize: '0.85rem' }}>Down Town Hospital Emergency Contact Number</p>
              </div>
              <a href="tel:09864101111" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}>
                <Phone size={16} /> Call
              </a>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 800 }}>Welfare Assistance Tracking</h2>
          <div style={{
            background: 'var(--bg-color)',
            border: '1px dashed var(--border-color)',
            borderRadius: '12px',
            padding: '2.5rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '12px'
          }}>
            <div style={{ background: 'rgba(0,0,0,0.04)', padding: '12px', borderRadius: '50%', color: 'var(--text-secondary)' }}>
              <Clock size={28} />
            </div>
            <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Live Data Pending</h4>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem', maxWidth: '300px' }}>
              Real-time welfare tracking data will be updated here soon once we go into full production.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}