import { HeartPulse, Library, Briefcase } from 'lucide-react';

export const metadata = {
  title: 'Activities & Projects | Leimarembi Foundation',
  description: 'Explore our latest activities, health modules, and cultural preservation projects.',
};

export default function Activities() {
  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="glass-panel" style={{ fontSize: '2.5rem', margin: 0, display: 'inline-block' }}>Activities and Projects</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        {/* Cultural Preservation Module */}
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'stretch', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px', background: 'linear-gradient(135deg, #1A365D 0%, #3182CE 100%)', color: 'white', padding: '3rem 2rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <Library size={48} style={{ color: '#F6E05E', marginBottom: '1rem' }} />
            <h2 style={{ color: 'white' }}>Cultural Preservation</h2>
            <p style={{ opacity: 0.9, color: 'white' }}>Safeguarding our heritage for future generations.</p>
          </div>
          <div style={{ flex: '2 1 400px' }} className="card">
            <h3>Key Initiatives</h3>
            <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li><strong>Manipuri Heritage Archive:</strong> Digitizing historical texts and artifacts.</li>
              <li><strong>Traditional Recipes:</strong> Documenting authentic culinary practices.</li>
              <li><strong>Oral History Recordings:</strong> Capturing stories from our elders.</li>
              <li><strong>Songs and Dance:</strong> Video and audio documentation of traditional performing arts.</li>
            </ul>
          </div>
        </div>

        {/* Health and Welfare Module */}
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'stretch', flexWrap: 'wrap', flexDirection: 'row-reverse' }}>
          <div style={{ flex: '1 1 300px', background: 'linear-gradient(135deg, #DD6B20 0%, #ECC94B 100%)', color: 'white', padding: '3rem 2rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <HeartPulse size={48} style={{ color: 'white', marginBottom: '1rem' }} />
            <h2 style={{ color: 'white' }}>Health & Welfare</h2>
            <p style={{ opacity: 0.9, color: 'white' }}>Supporting the vulnerable and our senior citizens.</p>
          </div>
          <div style={{ flex: '2 1 400px' }} className="card">
            <h3>Key Initiatives</h3>
            <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li><strong>Health Check-up Records:</strong> Maintaining medical histories for seniors.</li>
              <li><strong>Medical Camp Management:</strong> Organizing and tracking regular health camps.</li>
              <li><strong>Welfare Assistance Tracking:</strong> Ensuring aid reaches those in need efficiently.</li>
              <li><strong>Emergency Contact Database:</strong> Quick access to critical information during crises.</li>
            </ul>
          </div>
        </div>

        {/* Project Management */}
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'stretch', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px', background: 'linear-gradient(135deg, #276749 0%, #48BB78 100%)', color: 'white', padding: '3rem 2rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <Briefcase size={48} style={{ color: 'white', marginBottom: '1rem' }} />
            <h2 style={{ color: 'white', margin: 0, paddingBottom: '0.5rem' }}>Project Management</h2>
            <p style={{ opacity: 0.9, color: 'white', margin: 0 }}>Executing our vision with precision.</p>
          </div>
          <div style={{ flex: '2 1 400px' }} className="card">
            <h3>Key Initiatives</h3>
            <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li><strong>Project Planning:</strong> Structured approach to community development.</li>
              <li><strong>Activity Monitoring:</strong> Real-time tracking of project milestones.</li>
              <li><strong>Beneficiary Records:</strong> Transparent logging of community impact.</li>
              <li><strong>Government Grants:</strong> Proposal preparation and PFMS integration records.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
