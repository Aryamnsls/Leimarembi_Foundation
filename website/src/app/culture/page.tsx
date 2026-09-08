"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Utensils, BookOpen, Music, X, ChevronRight, PlayCircle } from 'lucide-react';

interface Recipe {
  id: string;
  name: string;
  category: string;
  description: string;
  origin: string;
  ingredients: string[];
  significance: string;
  photoUrl?: string;
  youtubeUrl?: string;
}

export default function CulturePage() {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Strict Body scroll locking when recipe modal is active
  useEffect(() => {
    if (selectedRecipe) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setSelectedRecipe(null);
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
  }, [selectedRecipe]);

  const recipes: Recipe[] = [
    {
      id: 'eromba',
      name: 'Eromba (Traditional Fermented Delicacy)',
      category: 'Main Dish',
      description: 'A classic Manipuri dish prepared by mashing boiled vegetables with fermented fish (Ngari) and fiery local king chillies (U-Morok). Served with fresh fragrant herbs.',
      origin: 'Meitei Heritage Kitchens',
      ingredients: ['Ngari (Fermented Fish)', 'U-Morok (King Chilli)', 'Tree Bean (Yongchak) / Potato', 'Fresh Maroi (Chives)'],
      significance: 'Central to community feasts and daily family nutrition in Manipur.',
      photoUrl: '/culture/eromba.jpg',
      youtubeUrl: 'https://www.youtube.com/watch?v=V21-6Z_SJS4'
    },
    {
      id: 'singju',
      name: 'Singju (Herbal Indigenous Salad)',
      category: 'Salad / Appetizer',
      description: 'A raw, nutritious salad made from finely shredded seasonal vegetables, roasted pea powder, perilla seeds (Thoiding), and seasoned with Ngari or salt.',
      origin: 'Manipuri Traditional Wellness',
      ingredients: ['Lotus Root (Thambou)', 'Cabbage / Banana Floret', 'Roasted Thoiding Seeds', 'Chilli Powder & Pea Powder'],
      significance: 'Rich in dietary fiber and medicinal indigenous herbs.',
      photoUrl: '/culture/singju.jpg',
      youtubeUrl: 'https://www.youtube.com/watch?v=GKG0GuC8CJ0'
    },
    {
      id: 'chakhao',
      name: 'Chak-hao Kheer (Black Rice Sweet Pudding)',
      category: 'Dessert',
      description: 'A rich, aromatic dessert crafted from organic Manipuri black rice (Chak-hao), simmered in full-cream milk, cardamom, and garnished with dry fruits.',
      origin: 'Royal Manipuri Cuisine',
      ingredients: ['Chak-hao (Black Glutinous Rice)', 'Full-Cream Milk', 'Cardamom & Bay Leaf', 'Cashews, Almonds & Raisins'],
      significance: 'Traditionally served during ceremonies and festive occasions as a mark of prosperity.',
      photoUrl: '/culture/chakhao_kheer.jpg',
      youtubeUrl: 'https://www.youtube.com/watch?v=R2m-_R9M6D8'
    }
  ];

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
            Indigenous Cultural Preservation
          </span>
        </div>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 900, margin: '0 0 1rem 0', color: 'var(--primary-color)' }}>
          Manipuri Cultural Heritage & Media
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '750px', margin: '0 auto', fontSize: '1.15rem', lineHeight: 1.6 }}>
          Preserving and promoting the rich cultural traditions, performing arts, folklore, and indigenous culinary heritage of the Manipuri diaspora across Northeast India.
        </p>
      </div>

      {/* Grid of Cultural Pillars */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.75rem', marginBottom: '3.5rem' }}>
        <div className="card" style={{ padding: '2rem', borderTop: '4px solid var(--secondary-color)' }}>
          <div style={{ background: 'rgba(2, 132, 199, 0.1)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary-color)', marginBottom: '1.25rem' }}>
            <Music size={24} />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '0.5rem', color: 'var(--primary-color)' }}>
            Traditional Music & Dance
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Documentation of classical Ras Lila dances, Lai Haraoba ritual art forms, Pena folk music traditions, and community cultural performances.
          </p>
        </div>

        <div className="card" style={{ padding: '2rem', borderTop: '4px solid var(--success-color)' }}>
          <div style={{ background: 'rgba(22, 163, 74, 0.1)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success-color)', marginBottom: '1.25rem' }}>
            <Utensils size={24} />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '0.5rem', color: 'var(--primary-color)' }}>
            Indigenous Culinary Heritage
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Archiving ancestral recipes, fermented food science (Ngari, Hawaijar), medicinal culinary plants, and traditional cooking methods.
          </p>
        </div>

        <div className="card" style={{ padding: '2rem', borderTop: '4px solid var(--info-color)' }}>
          <div style={{ background: 'rgba(56, 189, 248, 0.1)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--info-color)', marginBottom: '1.25rem' }}>
            <BookOpen size={24} />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '0.5rem', color: 'var(--primary-color)' }}>
            Folklore & Literature Archive
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Preserving Meetei Mayek script learning resources, oral history recordings, mythological epics, and literary works of Manipuri scholars.
          </p>
        </div>
      </div>

      {/* Indigenous Recipe Archive Section */}
      <div style={{ marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--primary-color)', margin: 0 }}>
              Indigenous Culinary Archive
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: '4px 0 0 0' }}>
              Explore traditional recipes passed down through generations.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {recipes.map((recipe) => (
            <div key={recipe.id} className="card" style={{ padding: '1.65rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--secondary-color)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {recipe.category}
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginTop: '4px', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>
                  {recipe.name}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  {recipe.description}
                </p>
              </div>

              <button
                onClick={() => setSelectedRecipe(recipe)}
                className="btn btn-outline"
                style={{ width: '100%', justifyContent: 'center', fontSize: '0.875rem', gap: '6px' }}
              >
                <span>View Full Recipe Details</span>
                <ChevronRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recipe Modal Dialog using React Portal */}
      {selectedRecipe && typeof document !== 'undefined' && createPortal(
        <div
          onClick={() => setSelectedRecipe(null)}
          onTouchMove={(e) => e.preventDefault()}
          onWheel={(e) => e.preventDefault()}
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
        >
          <div
            className="animate-fade-in"
            style={{
              width: 'min(540px, 94vw)',
              maxHeight: '88dvh',
              overflowY: 'auto',
              borderRadius: '24px',
              position: 'relative',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4)',
              background: 'var(--surface-color)',
              border: '1px solid var(--border-color)',
              margin: 'auto',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button — always on top */}
            <button
              onClick={() => setSelectedRecipe(null)}
              style={{
                position: 'absolute',
                top: '14px',
                right: '14px',
                background: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(8px)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 20
              }}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {/* Dish Photo with YouTube overlay */}
            {selectedRecipe.photoUrl && (
              <div style={{ width: '100%', height: '220px', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                <img
                  src={selectedRecipe.photoUrl}
                  alt={selectedRecipe.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                {/* Dark gradient overlay at bottom */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px', background: 'linear-gradient(transparent, rgba(0,0,0,0.55))' }} />
              </div>
            )}

            {/* YouTube button — always visible right below photo */}
            {selectedRecipe.youtubeUrl && (
              <a
                href={selectedRecipe.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  background: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
                  color: 'white',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  padding: '0.9rem 1.5rem',
                  textDecoration: 'none',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  letterSpacing: '0.01em'
                }}
              >
                <PlayCircle size={22} />
                🎬 Watch Traditional Recipe on YouTube
              </a>
            )}

            {/* Content */}
            <div style={{ padding: '1.75rem' }}>
              <div style={{ marginBottom: '1rem', paddingRight: '2rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--secondary-color)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {selectedRecipe.category} • {selectedRecipe.origin}
                </span>
                <h2 style={{ fontSize: '1.55rem', fontWeight: 900, marginTop: '4px', color: 'var(--primary-color)' }}>
                  {selectedRecipe.name}
                </h2>
              </div>

              <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {selectedRecipe.description}
              </p>

              <div style={{ background: 'var(--bg-color)', padding: '1.15rem', borderRadius: '14px', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
                <strong style={{ color: 'var(--primary-color)', fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>
                  Key Ingredients & Ethnobotanicals:
                </strong>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-primary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  {selectedRecipe.ingredients.map((ing, idx) => (
                    <li key={idx}>{ing}</li>
                  ))}
                </ul>
              </div>

              <p style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--text-muted)', margin: '0 0 1.25rem 0' }}>
                📌 Cultural Significance: {selectedRecipe.significance}
              </p>

              <button onClick={() => setSelectedRecipe(null)} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Close Recipe View
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
