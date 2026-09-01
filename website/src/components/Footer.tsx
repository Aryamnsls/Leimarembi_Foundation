export default function Footer() {
  return (
    <footer style={{ 
      background: 'var(--surface-color)', 
      backdropFilter: 'blur(16px)', 
      WebkitBackdropFilter: 'blur(16px)', 
      borderTop: '1px solid var(--border-color)', 
      padding: '4rem 0 2rem', 
      marginTop: '4rem' 
    }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
        <div>
          <h3 style={{ color: 'var(--secondary-color)', marginBottom: '0.5rem' }}>LEIMAREMBEE FOUNDATION</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontStyle: 'italic' }}>Heritage - Innovation - Empowerment</p>
          <p style={{ marginTop: '1.5rem', color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: '1.8' }}>
            Building a better future through digital governance, cultural preservation, and community welfare.
          </p>
        </div>
        <div>
          <h4 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <li><a href="/about" style={{ color: 'var(--text-secondary)', transition: 'color 0.3s' }}>About Foundation</a></li>
            <li><a href="/activities" style={{ color: 'var(--text-secondary)', transition: 'color 0.3s' }}>Projects & Activities</a></li>
            <li><a href="/documents" style={{ color: 'var(--text-secondary)', transition: 'color 0.3s' }}>Official Documents</a></li>
            <li><a href="/news" style={{ color: 'var(--text-secondary)', transition: 'color 0.3s' }}>News & Events</a></li>
            <li><a href="/gallery" style={{ color: 'var(--text-secondary)', transition: 'color 0.3s' }}>Photo & Video Gallery</a></li>
          </ul>
        </div>
        <div>
          <h4 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Contact Us</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.8' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Email:</strong> info@leimarembee.org<br />
            <strong style={{ color: 'var(--text-primary)' }}>Phone:</strong> +91 9876543210<br />
            <strong style={{ color: 'var(--text-primary)' }}>Address:</strong> Imphal, Manipur, India<br />
            <a href="/contact" style={{ color: 'var(--primary-color)', fontWeight: 600, display: 'inline-block', marginTop: '0.5rem' }}>View Contact Page &rarr;</a>
          </p>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
        &copy; {new Date().getFullYear()} Leimarembee Foundation. All Rights Reserved.
      </div>
    </footer>
  );
}
