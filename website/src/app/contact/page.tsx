"use client";

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import FaqAccordion from '@/components/FaqAccordion';
import { api } from '../../lib/api';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const FOUNDATION_EMAIL = 'leimarembifoundation@gmail.com';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setLoading(true);
    setError('');
    try {
      await api.post('/contact', {
        name: formData.name,
        email: formData.email,
        message: formData.message,
      });
      setSubmitted(true);
    } catch (err: any) {
      // Fallback to mailto if server unreachable
      const subject = encodeURIComponent(`Message from ${formData.name} via Leimarembi Foundation Website`);
      const body = encodeURIComponent(
        `Name: ${formData.name}\nFrom Email: ${formData.email}\n\nMessage:\n${formData.message}`
      );
      window.open(`mailto:${FOUNDATION_EMAIL}?subject=${subject}&body=${body}`, '_blank');
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.7rem 0.9rem',
    borderRadius: '10px',
    border: '1px solid var(--border-color)',
    background: 'var(--bg-color)',
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    outline: 'none'
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2.5rem 0 4rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <div className="glass-panel" style={{ padding: '0.4rem 1.25rem', borderRadius: '30px', marginBottom: '1rem', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--secondary-color)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            Get In Touch
          </span>
        </div>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 900, margin: 0, color: 'var(--primary-color)' }}>Contact Information</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', maxWidth: '640px', margin: '0.5rem auto 0' }}>
          Have questions or want to participate in our community programs? Reach out to the Leimarembi Foundation team.
        </p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', maxWidth: '960px', margin: '0 auto 4rem' }}>
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card" style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
            <div style={{ color: 'var(--secondary-color)', background: 'rgba(2, 132, 199, 0.12)', padding: '12px', borderRadius: '12px', flexShrink: 0, marginTop: '2px' }}>
              <MapPin size={28} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-color)' }}>Office Location</h3>
              <a
                href="https://www.google.com/maps/search/Manipuri+Rajbari,+Guwahati-781007,+Assam,+India"
                target="_blank"
                rel="noopener noreferrer"
                style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem', textDecoration: 'none', display: 'block', lineHeight: '1.5' }}
              >
                Manipuri Rajbari, Guwahati-781007, Assam<br />
                Head Office : Guwahati &nbsp;::&nbsp; Estd. 2001
              </a>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
            <div style={{ color: 'var(--secondary-color)', background: 'rgba(2, 132, 199, 0.12)', padding: '12px', borderRadius: '12px', flexShrink: 0 }}>
              <Phone size={28} />
            </div>
            <div>
              <h3 style={{ margin: '0 0 0.35rem', fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-color)' }}>Phone Contact</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <a href="tel:+919707499079" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>97074-99079</a>
                <a href="tel:+918134997237" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>81349-97237</a>
                <a href="tel:+917637087931" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>76370-87931</a>
                <a href="tel:+919864801906" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>98648-01906</a>
              </div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
            <div style={{ color: 'var(--secondary-color)', background: 'rgba(2, 132, 199, 0.12)', padding: '12px', borderRadius: '12px', flexShrink: 0, marginTop: '2px' }}>
              <Mail size={28} />
            </div>
            <div>
              <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-color)' }}>Official Email</h3>
              <a href="mailto:leimarembifoundation@gmail.com" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none', wordBreak: 'break-all' }}>leimarembifoundation@gmail.com</a>
            </div>
          </div>
        </div>

        <div className="card" style={{ flex: '2 1 420px', padding: '2.25rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--primary-color)' }}>Send Us a Direct Message</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            Fill out the form below and an executive committee representative will respond to your query.
          </p>

          {submitted ? (
            <div style={{
              background: 'rgba(22, 163, 74, 0.12)',
              border: '1px solid rgba(22, 163, 74, 0.3)',
              color: '#16A34A',
              borderRadius: '12px',
              padding: '1.5rem',
              textAlign: 'center'
            }}>
              <CheckCircle2 size={36} style={{ marginBottom: '0.5rem' }} />
              <h3 style={{ color: '#16A34A', margin: '0 0 0.5rem' }}>Message Sent Successfully!</h3>
              <p style={{ margin: 0, fontSize: '0.95rem' }}>Thank you, {formData.name}. We have received your message and will get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label htmlFor="contact-name" style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>Full Name *</label>
                <input 
                  id="contact-name"
                  type="text" 
                  required
                  placeholder="Enter your name" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={inputStyle} 
                />
              </div>

              <div>
                <label htmlFor="contact-email" style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>Email Address *</label>
                <input 
                  id="contact-email"
                  type="email" 
                  required
                  placeholder="you@example.com" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={inputStyle} 
                />
              </div>

              <div>
                <label htmlFor="contact-message" style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>Message *</label>
                <textarea 
                  id="contact-message"
                  required
                  rows={4}
                  placeholder="Type your message or inquiry..." 
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{ ...inputStyle, resize: 'vertical' }} 
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', minHeight: '44px', gap: '8px' }}>
                <Send size={16} /> Send Direct Message
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Embedded Community FAQ Accordion */}
      <section style={{ marginTop: '3rem' }}>
        <FaqAccordion />
      </section>
    </div>
  );
}
