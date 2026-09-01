"use client";

import { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MEMBERS_DATA, Member } from '@/data/membersData';
import { Search, Shield, Briefcase, Award, X, ChevronRight, Users, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

export default function MembersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Leadership' | 'Executive'>('All');
  const [activeModalMember, setActiveModalMember] = useState<Member | null>(null);

  // Strict Body scroll locking when profile modal is active
  useEffect(() => {
    if (activeModalMember) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setActiveModalMember(null);
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
  }, [activeModalMember]);

  const filteredMembers = useMemo(() => {
    return MEMBERS_DATA.filter((member) => {
      const matchesCategory =
        selectedCategory === 'All' || member.category === selectedCategory;

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        member.name.toLowerCase().includes(query) ||
        member.role.toLowerCase().includes(query) ||
        member.subtitle.toLowerCase().includes(query) ||
        member.shortProfile.toLowerCase().includes(query) ||
        member.areaOfResponsibility.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0 4rem 0' }}>
      {/* Header Banner */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
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
            Official Digital Governance & Leadership
          </span>
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: '0 0 0.75rem 0', color: 'var(--primary-color)' }}>
          Executive Committee & Member Profiles
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '750px', margin: '0 auto', fontSize: '1.1rem', lineHeight: 1.6 }}>
          Meet the dedicated office bearers and executive committee members driving community development, cultural preservation, and social governance for the Leimarembi Foundation.
        </p>
      </div>

      {/* Filter and Search Toolbar */}
      <div 
        className="card" 
        style={{ 
          marginBottom: '2.5rem', 
          padding: '1.25rem 1.5rem', 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '1rem', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          background: 'var(--surface-color)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedCategory('All')}
            className={selectedCategory === 'All' ? 'btn btn-primary' : 'btn btn-outline'}
            style={{ padding: '0.5rem 1.1rem', fontSize: '0.875rem', gap: '6px' }}
          >
            <Users size={16} /> All Members ({MEMBERS_DATA.length})
          </button>
          <button
            onClick={() => setSelectedCategory('Leadership')}
            className={selectedCategory === 'Leadership' ? 'btn btn-primary' : 'btn btn-outline'}
            style={{ padding: '0.5rem 1.1rem', fontSize: '0.875rem', gap: '6px' }}
          >
            <Shield size={16} /> Executive Officers (5)
          </button>
          <button
            onClick={() => setSelectedCategory('Executive')}
            className={selectedCategory === 'Executive' ? 'btn btn-primary' : 'btn btn-outline'}
            style={{ padding: '0.5rem 1.1rem', fontSize: '0.875rem', gap: '6px' }}
          >
            <Briefcase size={16} /> Executive Members (7)
          </button>
        </div>

        {/* Search Input Box */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '360px', flexShrink: 0 }}>
          <Search 
            size={18} 
            style={{ 
              position: 'absolute', 
              left: '14px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: 'var(--text-muted)' 
            }} 
          />
          <input
            type="text"
            placeholder="Search member name or designation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 2.4rem 0.65rem 2.5rem',
              borderRadius: '10px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-color)',
              color: 'var(--text-primary)',
              outline: 'none',
              fontSize: '0.9rem'
            }}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px'
              }}
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Member Cards Grid - Pinterest Gallery Layout (minmax 320px) */}
      {filteredMembers.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-secondary)' }}>
          <Users size={48} style={{ marginBottom: '1rem', opacity: 0.5, color: 'var(--secondary-color)' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>No members found</h3>
          <p>No results match your query &quot;{searchQuery}&quot;. Try searching with another keyword.</p>
        </div>
      ) : (
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '1.75rem',
            alignItems: 'stretch'
          }}
        >
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="card animate-fade-in"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.65rem',
                borderRadius: '16px',
                border: '1px solid var(--border-color)',
                borderTop: member.category === 'Leadership' ? '4px solid var(--secondary-color)' : '4px solid var(--info-color)',
                boxShadow: 'var(--shadow-sm)',
                background: 'var(--surface-color)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                {/* Header Profile Section */}
                <div style={{ display: 'flex', gap: '1.1rem', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  {/* Photo Avatar */}
                  <div 
                    style={{ 
                      width: '76px', 
                      height: '92px', 
                      borderRadius: '12px', 
                      overflow: 'hidden', 
                      flexShrink: 0,
                      border: '2px solid var(--border-color)',
                      boxShadow: 'var(--shadow-sm)',
                      background: 'var(--bg-color)',
                      position: 'relative'
                    }}
                  >
                    {member.photo ? (
                      <Image 
                        src={member.photo} 
                        alt={member.name} 
                        fill
                        sizes="76px"
                        style={{ objectFit: 'cover', objectPosition: 'top center' }} 
                      />
                    ) : (
                      <div 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          background: 'linear-gradient(135deg, var(--primary-color), var(--info-color))',
                          color: '#FFF',
                          fontWeight: 900,
                          fontSize: '1.2rem'
                        }}
                      >
                        {member.name.split(' ').map(n => n[0]).join('').substring(0, 3)}
                      </div>
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    {/* Role Badge */}
                    <span 
                      style={{ 
                        display: 'inline-block', 
                        padding: '0.2rem 0.6rem', 
                        borderRadius: '6px', 
                        fontSize: '0.725rem', 
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        background: member.category === 'Leadership' ? 'rgba(2, 132, 199, 0.12)' : 'rgba(22, 163, 74, 0.12)',
                        color: member.category === 'Leadership' ? 'var(--secondary-color)' : 'var(--success-color)',
                        marginBottom: '0.35rem',
                        border: `1px solid ${member.category === 'Leadership' ? 'rgba(2, 132, 199, 0.3)' : 'rgba(22, 163, 74, 0.3)'}`
                      }}
                    >
                      {member.role}
                    </span>
                    <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.15rem', fontWeight: 900, color: 'var(--primary-color)', lineHeight: 1.2 }}>
                      {member.name}
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {member.subtitle}
                    </p>
                  </div>
                </div>

                {/* Profile & Background Snippet */}
                <div style={{ marginBottom: '1.1rem' }}>
                  <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--secondary-color)', letterSpacing: '0.5px', marginBottom: '0.3rem', fontWeight: 800 }}>
                    PROFILE & BACKGROUND
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {member.shortProfile}
                  </p>
                </div>

                {/* Area of Responsibility Box */}
                <div style={{ marginTop: 'auto', marginBottom: '1.25rem', padding: '0.85rem', background: 'var(--bg-color)', borderRadius: '10px', borderLeft: '3px solid var(--info-color)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.25rem', fontSize: '0.775rem', fontWeight: 800, color: 'var(--primary-color)' }}>
                    <Award size={14} style={{ color: 'var(--info-color)' }} />
                    Responsibility Area
                  </div>
                  <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {member.areaOfResponsibility}
                  </p>
                </div>
              </div>

              {/* View Full Profile Action Button */}
              <button
                onClick={() => setActiveModalMember(member)}
                className="btn btn-secondary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  padding: '0.65rem 1rem',
                  borderRadius: '10px',
                  marginTop: '0.5rem',
                  fontWeight: 700
                }}
              >
                <span>View Full Member Profile</span>
                <ChevronRight size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Member Details Modal Overlay using React Portal for 100% Edge-to-Edge Backdrop */}
      {activeModalMember && typeof document !== 'undefined' && createPortal(
        <div
          onClick={() => setActiveModalMember(null)}
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
            onClick={(e) => e.stopPropagation()}
            className="card animate-fade-in"
            style={{
              width: 'min(580px, 94vw)',
              maxHeight: '88dvh',
              overflowY: 'auto',
              borderRadius: '24px',
              padding: '2.25rem',
              position: 'relative',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4)',
              background: 'var(--surface-color)',
              border: '1px solid var(--border-color)',
              margin: 'auto'
            }}
          >
            {/* Close Modal Button */}
            <button
              onClick={() => setActiveModalMember(null)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: 'var(--bg-color)',
                border: '1px solid var(--border-color)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                transition: 'transform 0.2s ease',
                zIndex: 10
              }}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {/* Modal Content */}
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <div 
                style={{ 
                  width: '90px', 
                  height: '110px', 
                  borderRadius: '14px', 
                  overflow: 'hidden', 
                  flexShrink: 0,
                  border: '2px solid var(--border-color)',
                  position: 'relative',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                {activeModalMember.photo ? (
                  <Image 
                    src={activeModalMember.photo} 
                    alt={activeModalMember.name} 
                    fill 
                    style={{ objectFit: 'cover', objectPosition: 'top center' }} 
                  />
                ) : (
                  <div 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, var(--primary-color), var(--info-color))',
                      color: '#FFF',
                      fontWeight: 900,
                      fontSize: '1.4rem'
                    }}
                  >
                    {activeModalMember.name.split(' ').map(n => n[0]).join('').substring(0, 3)}
                  </div>
                )}
              </div>

              <div style={{ flex: 1, minWidth: '220px' }}>
                <span 
                  style={{ 
                    display: 'inline-block', 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '6px', 
                    fontSize: '0.775rem', 
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    background: 'rgba(2, 132, 199, 0.12)',
                    color: 'var(--secondary-color)',
                    marginBottom: '0.5rem',
                    border: '1px solid rgba(2, 132, 199, 0.3)'
                  }}
                >
                  {activeModalMember.role}
                </span>
                <h2 style={{ margin: '0 0 0.3rem 0', fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary-color)', lineHeight: 1.2 }}>
                  {activeModalMember.name}
                </h2>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {activeModalMember.subtitle}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--secondary-color)', letterSpacing: '1px', marginBottom: '0.4rem', fontWeight: 800 }}>
                  Detailed Bio & Background
                </h4>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.65, margin: 0 }}>
                  {activeModalMember.shortProfile}
                </p>
              </div>

              <div style={{ padding: '1.1rem', background: 'var(--bg-color)', borderRadius: '14px', borderLeft: '4px solid var(--info-color)', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--primary-color)', marginBottom: '0.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Award size={16} color="var(--info-color)" /> Primary Responsibility & Governance Area
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  {activeModalMember.areaOfResponsibility}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success-color)', fontSize: '0.85rem', fontWeight: 700, paddingTop: '0.25rem' }}>
                <CheckCircle2 size={16} /> Certified Executive Member of Leimarembi Foundation
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
