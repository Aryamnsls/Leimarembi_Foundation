"use client";

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import FaqAccordion from '@/components/FaqAccordion';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
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
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ color: 'var(--secondary-color)', background: 'rgba(2, 132, 199, 0.12)', padding: '12px', borderRadius: '12px' }}>
              <MapPin size={28} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-color)' }}>Office Location</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Imphal, Manipur & Kamrup, Assam, India</p>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ color: 'var(--secondary-color)', background: 'rgba(2, 132, 199, 0.12)', padding: '12px', borderRadius: '12px' }}>
              <Phone size={28} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-color)' }}>Phone Contact</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>+91 98765 43210</p>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ color: 'var(--secondary-color)', background: 'rgba(2, 132, 199, 0.12)', padding: '12px', borderRadius: '12px' }}>
              <Mail size={28} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-color)' }}>Official Email</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>info@leimarembee.org</p>
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
