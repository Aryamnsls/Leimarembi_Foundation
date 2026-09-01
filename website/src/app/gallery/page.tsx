"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ImageIcon, Play, X, ZoomIn } from 'lucide-react';

interface MediaItem {
  id: string;
  title: string;
  category: 'Photos' | 'Videos' | 'Events';
  date: string;
  description: string;
  type: 'image' | 'video';
}

export default function GalleryPage() {
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Photos' | 'Videos' | 'Events'>('All');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  // Strict Body scroll locking when lightbox is active
  useEffect(() => {
    if (selectedMedia) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setSelectedMedia(null);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
  }, [selectedMedia]);

  const mediaItems: MediaItem[] = [
    {
      id: '1',
      title: 'Free Rural Health Camp 2026',
      category: 'Events',
      date: 'February 2026',
      description: 'Free medical check-ups, geriatric care, and essential medicines distribution for senior citizens and low-income families.',
      type: 'image'
    },
    {
      id: '2',
      title: 'Traditional Manipuri Cultural Performance',
      category: 'Videos',
      date: 'January 2026',
      description: 'Documentary performance highlighting classical Ras Lila and traditional Meitei folk songs.',
      type: 'video'
    },
    {
      id: '3',
      title: 'Meetei Mayek Script Literacy Workshop',
      category: 'Photos',
      date: 'December 2025',
      description: 'Educational session teaching the traditional Meetei Mayek script to local youth and community members.',
      type: 'image'
    },
    {
      id: '4',
      title: 'Executive Body Annual General Assembly',
      category: 'Events',
      date: 'November 2025',
      description: 'Annual gathering of office bearers, executive officers, and members discussing transparent digital governance.',
      type: 'image'
    },
    {
      id: '5',
      title: 'Clean Environment & Plantation Drive',
      category: 'Photos',
      date: 'October 2025',
      description: 'Community-led tree plantation and ecological conservation movement in local villages.',
      type: 'image'
    },
    {
      id: '6',
      title: 'Youth Sports & Kabaddi Championship',
      category: 'Videos',
      date: 'September 2025',
      description: 'Highlights from the regional Kabaddi tournament organised under the guidance of K. Ajit Singh.',
      type: 'video'
    }
  ];

  const filteredItems = mediaItems.filter((item) =>
    selectedFilter === 'All' ? true : item.category === selectedFilter
  );

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0 4rem 0' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div 
          className="glass-panel" 
          style={{ 
            display: 'inline-block', 
            padding: '0.4rem 1.25rem', 
            borderRadius: '30px', 
            marginBottom: '1rem',
            border: '1px solid var(--border-color)'
          }}
        >
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--secondary-color)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            Media & Event Archives
          </span>
        </div>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 900, margin: '0 0 1rem 0', color: 'var(--primary-color)' }}>
          Foundation Photo & Video Gallery
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '750px', margin: '0 auto', fontSize: '1.15rem', lineHeight: 1.6 }}>
          Explore visual documentations of our community development initiatives, health camps, cultural preservation events, and executive governance meetings.
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
        {(['All', 'Photos', 'Videos', 'Events'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={selectedFilter === filter ? 'btn btn-primary' : 'btn btn-outline'}
            style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Gallery Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.75rem' }}>
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="card"
            style={{
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onClick={() => setSelectedMedia(item)}
          >
            <div>
              {/* Media Thumbnail Container */}
              <div 
                style={{
                  width: '100%',
                  height: '180px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(27, 42, 87, 0.08), rgba(2, 132, 199, 0.12))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  color: 'var(--info-color)',
                  position: 'relative',
                  border: '1px solid var(--border-color)'
                }}
              >
                {item.type === 'video' ? <Play size={44} /> : <ImageIcon size={44} />}
                <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'var(--surface-color)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid var(--border-color)' }}>
                  <ZoomIn size={12} /> Inspect
                </div>
              </div>

              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--info-color)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {item.category} • {item.date}
              </span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginTop: '4px', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                {item.description}
              </p>
            </div>

            <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}>
              View Archive Detail
            </button>
          </div>
        ))}
      </div>

      {/* Lightbox Media Detail Modal Dialog using React Portal */}
      {selectedMedia && typeof document !== 'undefined' && createPortal(
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="gallery-modal-title"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100dvh',
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(12px)',
            zIndex: 100000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            boxSizing: 'border-box',
            animation: 'fadeIn 0.2s ease'
          }}
          onClick={() => setSelectedMedia(null)}
          onTouchMove={(e) => e.preventDefault()}
          onWheel={(e) => e.preventDefault()}
        >
          <div 
            className="card animate-fade-in"
            style={{
              width: 'min(560px, 94vw)',
              maxHeight: '88dvh',
              overflowY: 'auto',
              borderRadius: '24px',
              padding: '2rem',
              position: 'relative',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4)',
              background: 'var(--surface-color)',
              border: '1px solid var(--border-color)',
              margin: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedMedia(null)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: 'var(--bg-color)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10
              }}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <div style={{ width: '100%', height: '220px', background: 'linear-gradient(135deg, rgba(27, 42, 87, 0.08), rgba(2, 132, 199, 0.12))', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--info-color)', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
              {selectedMedia.type === 'video' ? <Play size={56} /> : <ImageIcon size={56} />}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--info-color)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {selectedMedia.category} • {selectedMedia.date}
              </span>
              <h2 id="gallery-modal-title" style={{ fontSize: '1.65rem', fontWeight: 900, marginTop: '4px', color: 'var(--primary-color)' }}>
                {selectedMedia.title}
              </h2>
            </div>

            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {selectedMedia.description}
            </p>

            <button onClick={() => setSelectedMedia(null)} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Close Media Viewer
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
