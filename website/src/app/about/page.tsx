import Link from 'next/link';
import { Info, Target, Eye, ArrowRight, ShieldCheck } from 'lucide-react';
import { MEMBERS_DATA } from '@/data/membersData';

export const metadata = {
  title: 'About Us | Leimarembi Foundation',
  description: 'Learn about our vision, mission, and objectives.',
};

export default function About() {
  const leadershipMembers = MEMBERS_DATA.filter((m) => m.category === 'Leadership');

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem' }}>Executive Committee and Trustees</h2>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
              Our foundation is led by a dedicated 12-member team committed to transparency, cultural heritage, and community welfare.
            </p>
          </div>
          <Link href="/members" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}>
            <span>View All 12 Member Profiles</span>
            <ArrowRight size={18} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          {leadershipMembers.map((member) => (
            <div 
              key={member.id} 
              style={{ 
                background: 'var(--bg-color)', 
                padding: '1.25rem', 
                borderRadius: '10px', 
                border: '1px solid var(--border-color)',
                display: 'flex',
                gap: '1rem',
                alignItems: 'center'
              }}
            >
              <div 
                style={{ 
                  width: '56px', 
                  height: '68px', 
                  borderRadius: '6px', 
                  overflow: 'hidden', 
                  flexShrink: 0,
                  border: '1px solid var(--border-color)'
                }}
              >
                {member.photo ? (
                  <img src={member.photo} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: 'var(--primary-color)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {member.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </div>
                )}
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--secondary-color)', textTransform: 'uppercase' }}>
                  {member.role}
                </span>
                <h4 style={{ margin: '0.2rem 0', fontSize: '1.05rem' }}>{member.name}</h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {member.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', paddingTop: '1rem', borderTop: '1px dashed var(--border-color)' }}>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Includes President, Vice-Chairman, Managing Director, Secretary, Treasurer, and Executive Members.
          </p>
          <Link href="/members" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={18} />
            Explore Full Interactive Roster & Responsibilities
          </Link>
        </div>
      </section>
    </div>
  );
}
