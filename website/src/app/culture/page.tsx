import { Book, Music, Image as ImageIcon, FileText } from 'lucide-react';

export default function Culture() {
  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <h1 className="glass-panel" style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
        <Book size={32} color="#D69E2E" /> Cultural Preservation Module
      </h1>
      
      <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '800px' }}>
        A digital archive dedicated to the rich heritage, traditions, and history of Manipur.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1rem', color: '#D69E2E' }}>
            <FileText size={28} />
            <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Manipuri Heritage Archive</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', flex: 1 }}>
            Digitized manuscripts, royal chronicles (Cheitharol Kumbaba), and historical records.
          </p>
          <button className="btn" style={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>Browse Archive</button>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1rem', color: '#E53E3E' }}>
            <ImageIcon size={28} />
            <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Traditional Recipes</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', flex: 1 }}>
            Authentic documentation of indigenous Manipuri cuisine, herbs, and preparation methods.
          </p>
          <button className="btn" style={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>View Recipes</button>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1rem', color: '#38A169' }}>
            <Music size={28} />
            <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Songs & Dance</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', flex: 1 }}>
            Audio/Video documentation of Nata Sankirtana, Ras Leela, and indigenous folk arts.
          </p>
          <button className="btn" style={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>Media Gallery</button>
        </div>
      </div>
    </div>
  );
}
