import { Calendar, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'News & Events | Leimarembi Foundation',
  description: 'Latest news and upcoming events from the Foundation.',
};

export default function NewsAndEvents() {
  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="glass-panel" style={{ fontSize: '2.5rem', margin: 0, display: 'inline-block' }}>News & Events</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary-color)', marginBottom: '1rem' }}>
            <Calendar size={20} />
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>October 15, 2026</span>
          </div>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Annual Health Camp</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Join us for our annual free health check-up camp for senior citizens at Kekranagar.
          </p>
          <a href="#" style={{ color: 'var(--secondary-color)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>Read More <ArrowRight size={16} /></a>
        </div>
        
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary-color)', marginBottom: '1rem' }}>
            <Calendar size={20} />
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>November 5, 2026</span>
          </div>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Cultural Heritage Festival</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            A day dedicated to showcasing traditional Manipuri dance, songs, and culinary arts.
          </p>
          <a href="#" style={{ color: 'var(--secondary-color)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>Read More <ArrowRight size={16} /></a>
        </div>
      </div>
    </div>
  );
}
