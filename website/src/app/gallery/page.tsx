import { Image as ImageIcon, Video } from 'lucide-react';

export const metadata = {
  title: 'Gallery | Leimarembi Foundation',
  description: 'Photo and video gallery of our community initiatives.',
};

export default function Gallery() {
  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="glass-panel" style={{ fontSize: '2.5rem', margin: 0, display: 'inline-block' }}>Photo & Video Gallery</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: '100%', height: '200px', background: 'var(--bg-color)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
               <ImageIcon size={48} />
            </div>
            <h3 style={{ fontSize: '1.1rem', margin: '0.5rem 0' }}>Community Event {item}</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Photos from our recent initiatives.</p>
          </div>
        ))}
      </div>
    </div>
  );
}
