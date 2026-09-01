"use client";

import { useState } from 'react';
import { Calendar, ArrowRight, X } from 'lucide-react';

interface NewsItem {
  id: number;
  title: string;
  date: string;
  category: string;
  snippet: string;
  content: string;
}

export default function NewsAndEvents() {
  const [activeArticle, setActiveArticle] = useState<NewsItem | null>(null);

  const articles: NewsItem[] = [
    {
      id: 1,
      title: "Annual Health Camp for Senior Citizens",
      date: "October 15, 2026",
      category: "Health & Welfare",
      snippet: "Join us for our annual free health check-up camp for senior citizens at Kekranagar.",
      content: "The Leimarembi Foundation is organizing its annual Free Health Check-up Camp dedicated to senior citizens at Sri Sri Radha Gobindo Mandir premises, Kekranagar. Specialized doctors in cardiology, general medicine, and ophthalmology will provide free consultations, blood pressure screening, diabetes tests, and free medication distribution."
    },
    {
      id: 2,
      title: "Manipuri Cultural Heritage & Literary Festival",
      date: "November 5, 2026",
      category: "Cultural Preservation",
      snippet: "A day dedicated to showcasing traditional Manipuri dance, songs, and culinary arts.",
      content: "Hosted by Dr. Phuritsabam Birmani and executive committee members, this festival will bring together artists, writers, and community leaders for a full day of traditional Nata Sankirtana performances, Meitei Mayek workshops, and an indigenous Manipuri culinary fair."
    }
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '2.5rem 0 4rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <div className="glass-panel" style={{ padding: '0.4rem 1.25rem', borderRadius: '30px', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--secondary-color)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            Official Updates & Announcements
          </span>
        </div>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 900, margin: 0 }}>News & Events</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', maxWidth: '640px', margin: '0.5rem auto 0' }}>
          Stay informed about upcoming community health camps, cultural festivals, and foundation announcements.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {articles.map((art) => (
          <div key={art.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ 
                  fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', 
                  color: 'var(--secondary-color)', background: 'rgba(212, 175, 55, 0.15)',
                  padding: '0.2rem 0.6rem', borderRadius: '4px' 
                }}>
                  {art.category}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  <Calendar size={16} />
                  <span>{art.date}</span>
                </div>
              </div>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '0.75rem', fontWeight: 800 }}>{art.title}</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6, fontSize: '0.95rem' }}>
                {art.snippet}
              </p>
            </div>
            <button 
              onClick={() => setActiveArticle(art)}
              className="btn btn-outline" 
              style={{ justifyContent: 'center', width: '100%' }}
            >
              <span>Read Announcement</span>
              <ArrowRight size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Article Detail Modal */}
      {activeArticle && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="news-modal-title"
          style={{ 
            position: 'fixed', 
            inset: 0, 
            zIndex: 10000, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            background: 'rgba(10, 25, 47, 0.75)', 
            backdropFilter: 'blur(8px)',
            padding: '1.5rem'
          }}
          onClick={() => setActiveArticle(null)}
        >
          <div 
            className="card animate-fade-in" 
            style={{ 
              maxWidth: '600px', 
              width: '100%', 
              borderRadius: '20px', 
              padding: '2rem', 
              position: 'relative',
              background: 'var(--surface-color-solid)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveArticle(null)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'var(--surface-color)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Close article"
            >
              <X size={18} />
            </button>

            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--secondary-color)', textTransform: 'uppercase' }}>
              {activeArticle.category} • {activeArticle.date}
            </span>
            <h2 id="news-modal-title" style={{ fontSize: '1.65rem', fontWeight: 800, margin: '0.5rem 0 1rem' }}>
              {activeArticle.title}
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1rem' }}>
              {activeArticle.content}
            </p>
            <div style={{ textAlign: 'right', marginTop: '1.5rem' }}>
              <button onClick={() => setActiveArticle(null)} className="btn btn-primary">
                Close Announcement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
