import { Mail, Phone, MapPin } from 'lucide-react';

export const metadata = {
  title: 'Contact Us | Leimarembi Foundation',
  description: 'Get in touch with the Foundation.',
};

export default function Contact() {
  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="glass-panel" style={{ fontSize: '2.5rem', margin: 0, display: 'inline-block' }}>Contact Information</h1>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
             <div style={{ color: 'var(--primary-color)' }}><MapPin size={32} /></div>
             <div>
               <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Office Address</h3>
               <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Imphal, Manipur, India</p>
             </div>
          </div>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
             <div style={{ color: 'var(--primary-color)' }}><Phone size={32} /></div>
             <div>
               <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Phone Number</h3>
               <p style={{ margin: 0, color: 'var(--text-secondary)' }}>+91 9876543210</p>
             </div>
          </div>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
             <div style={{ color: 'var(--primary-color)' }}><Mail size={32} /></div>
             <div>
               <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Email Address</h3>
               <p style={{ margin: 0, color: 'var(--text-secondary)' }}>info@leimarembee.org</p>
             </div>
          </div>
        </div>

        <div className="card" style={{ flex: '2 1 400px' }}>
          <h2>Send us a Message</h2>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <input type="text" placeholder="Your Name" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} />
            <input type="email" placeholder="Your Email" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} />
            <textarea placeholder="Your Message" rows={5} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}></textarea>
            <button type="button" className="btn btn-secondary">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
}
