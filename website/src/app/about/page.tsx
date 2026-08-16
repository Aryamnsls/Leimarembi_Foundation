import { Info, Target, Eye } from 'lucide-react';

export const metadata = {
  title: 'About Us | Leimarembi Foundation',
  description: 'Learn about our vision, mission, and objectives.',
};

export default function About() {
  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="glass-panel" style={{ fontSize: '2.5rem', margin: 0, display: 'inline-block' }}>About The Foundation</h1>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
        <div className="card" style={{ borderTop: '4px solid var(--primary-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', color: 'var(--primary-color)' }}>
            <Eye size={28} />
            <h2 style={{ margin: 0 }}>Our Vision</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>
            To establish a comprehensive Digital Governance and Community Development platform that preserves heritage, drives innovation, and empowers communities through structured health, welfare, and cultural initiatives.
          </p>
        </div>

        <div className="card" style={{ borderTop: '4px solid var(--secondary-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', color: 'var(--secondary-color)' }}>
            <Target size={28} />
            <h2 style={{ margin: 0 }}>Our Mission</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>
            To implement scalable, robust systems for Foundation Management, grant tracking, and community support, ensuring transparency and efficiency in all operations while staying true to our Manipuri roots.
          </p>
        </div>

        <div className="card" style={{ borderTop: '4px solid var(--accent-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', color: 'var(--accent-color)' }}>
            <Info size={28} />
            <h2 style={{ margin: 0 }}>Objectives</h2>
          </div>
          <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem', margin: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>Digital member registration and tracking.</li>
            <li style={{ marginBottom: '0.5rem' }}>Efficient financial management and transparency.</li>
            <li style={{ marginBottom: '0.5rem' }}>Cultural preservation and documentation.</li>
            <li style={{ marginBottom: '0.5rem' }}>Senior citizen welfare and health tracking.</li>
          </ul>
        </div>
      </div>
      
      <section className="card" style={{ padding: '3rem' }}>
        <h2>Executive Committee and Trustees</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Our foundation is led by a dedicated team committed to transparency and community welfare. The Executive Committee oversees the implementation of our digital governance platform and ensures all charitable objectives are met.
        </p>
        <div style={{ background: 'var(--bg-color)', padding: '2rem', borderRadius: '8px', border: '1px dashed var(--border-color)', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Committee member details will be populated via the Admin Dashboard.
        </div>
      </section>
    </div>
  );
}
