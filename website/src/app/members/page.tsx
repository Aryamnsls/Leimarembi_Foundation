"use client";

import { useState, useMemo } from 'react';
import { MEMBERS_DATA, Member } from '@/data/membersData';
import { Search, UserCheck, Shield, Briefcase, Award, X, ChevronRight, Users } from 'lucide-react';

export default function MembersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Leadership' | 'Executive'>('All');
  const [activeModalMember, setActiveModalMember] = useState<Member | null>(null);

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
        member.areaOfResponsibility.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="animate-fade-in" style={{ padding: '2.5rem 0 4rem 0' }}>
      {/* Header Banner */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div 
          className="glass-panel" 
          style={{ 
            display: 'inline-block', 
            padding: '0.5rem 1.5rem', 
            borderRadius: '30px', 
            marginBottom: '1rem',
            border: '1px solid var(--border-color)'
          }}
        >
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--secondary-color)', letterSpacing: '1px', textTransform: 'uppercase' }}>
            Official Leadership & Executive Body
          </span>
        </div>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 800, margin: '0 0 1rem 0' }}>
          Members Profiles & Executive Committee
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '750px', margin: '0 auto', fontSize: '1.1rem' }}>
          Meet the dedicated office bearers and executive members driving the vision, community development, cultural preservation, and social governance of the Leimarembi Foundation.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div 
        className="card" 
        style={{ 
          marginBottom: '2.5rem', 
          padding: '1.5rem', 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '1rem', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          background: 'var(--surface-color)',
          backdropFilter: 'blur(10px)'
        }}
      >
        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {(['All', 'Leadership', 'Executive'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.6rem 1.25rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: selectedCategory === cat ? 'var(--primary-color)' : 'transparent',
                color: selectedCategory === cat ? 'var(--btn-primary-text)' : 'var(--text-primary)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {cat === 'All' && <Users size={16} />}
              {cat === 'Leadership' && <Shield size={16} />}
              {cat === 'Executive' && <Briefcase size={16} />}
              {cat === 'All' ? 'All Members (12)' : cat === 'Leadership' ? 'Executive Officers (5)' : 'Executive Members (7)'}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', minWidth: '280px', flexGrow: 1, maxWidth: '400px' }}>
          <Search 
            size={18} 
            style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: 'var(--text-secondary)' 
            }} 
          />
          <input
            type="text"
            placeholder="Search by name, designation, background..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 1rem 0.6rem 2.4rem',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-color)',
              color: 'var(--text-primary)',
              outline: 'none',
              fontSize: '0.95rem'
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
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Member Card Grid */}
      {filteredMembers.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-secondary)' }}>
          <Users size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <h3>No members found</h3>
          <p>No results match your query "{searchQuery}". Try searching with a different keyword.</p>
        </div>
      ) : (
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', 
            gap: '1.75rem' 
          }}
        >
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.75rem',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                borderTop: member.category === 'Leadership' ? '4px solid var(--secondary-color)' : '4px solid var(--primary-color)'
              }}
            >
              <div>
                {/* Member Header Info */}
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  {/* Member Photo or Fallback Avatar */}
                  <div 
                    style={{ 
                      width: '80px', 
                      height: '95px', 
                      borderRadius: '8px', 
                      overflow: 'hidden', 
                      flexShrink: 0,
                      border: '2px solid var(--border-color)',
                      boxShadow: 'var(--shadow-sm)',
                      background: 'var(--bg-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {member.photo ? (
                      <img 
                        src={member.photo} 
                        alt={member.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    ) : (
                      <div 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                          color: '#FFF',
                          fontWeight: 800,
                          fontSize: '1.4rem'
                        }}
                      >
                        {member.name.split(' ').map(n => n[0]).join('').substring(0, 3)}
                      </div>
                    )}
                  </div>

                  <div>
                    {/* Badge */}
                    <span 
                      style={{ 
                        display: 'inline-block', 
                        padding: '0.2rem 0.6rem', 
                        borderRadius: '4px', 
                        fontSize: '0.75rem', 
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        background: member.category === 'Leadership' ? 'rgba(212, 175, 55, 0.15)' : 'rgba(10, 25, 47, 0.08)',
                        color: member.category === 'Leadership' ? 'var(--secondary-color)' : 'var(--primary-color)',
                        marginBottom: '0.4rem',
                        border: `1px solid ${member.category === 'Leadership' ? 'rgba(212, 175, 55, 0.3)' : 'var(--border-color)'}`
                      }}
                    >
                      {member.role}
                    </span>
                    <h3 style={{ margin: '0 0 0.3rem 0', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {member.name}
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                      {member.subtitle}
                    </p>
                  </div>
                </div>

                {/* Short Profile Snippet */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--secondary-color)', letterSpacing: '0.5px', marginBottom: '0.3rem' }}>
                    Profile & Experience
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {member.shortProfile}
                  </p>
                </div>

                {/* Area of Responsibility Snippet */}
                <div style={{ marginBottom: '1.5rem', padding: '0.85rem', background: 'rgba(0,0,0,0.03)', borderRadius: '6px', borderLeft: '3px solid var(--secondary-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.25rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    <Award size={14} style={{ color: 'var(--secondary-color)' }} />
                    Responsibility Area
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {member.areaOfResponsibility}
                  </p>
                </div>
              </div>

              {/* View Full Profile Action */}
              <button
                onClick={() => setActiveModalMember(member)}
                className="btn btn-secondary"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontSize: '0.9rem',
                  padding: '0.6rem 1rem',
                  fontWeight: 600
                }}
              >
                <span>View Full Member Profile</span>
                <ChevronRight size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Member Details Modal */}
      {activeModalMember && (
        <div 
          style={{ 
            position: 'fixed', 
            inset: 0, 
            zIndex: 1000, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            background: 'rgba(0, 0, 0, 0.65)', 
            backdropFilter: 'blur(6px)',
            padding: '1.5rem'
          }}
          onClick={() => setActiveModalMember(null)}
        >
          <div 
            className="glass-panel animate-fade-in" 
            style={{ 
              maxWidth: '650px', 
              width: '100%', 
              maxHeight: '90vh', 
              overflowY: 'auto', 
              borderRadius: '16px', 
              padding: '2rem', 
              position: 'relative',
              background: 'var(--surface-color)',
              boxShadow: 'var(--shadow-lg)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveModalMember(null)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'var(--bg-color)',
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
            >
              <X size={20} />
            </button>

            {/* Modal Header */}
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
              <div 
                style={{ 
                  width: '110px', 
                  height: '135px', 
                  borderRadius: '12px', 
                  overflow: 'hidden', 
                  flexShrink: 0,
                  border: '3px solid var(--secondary-color)',
                  boxShadow: 'var(--shadow-md)',
                  background: 'var(--bg-color)'
                }}
              >
                {activeModalMember.photo ? (
                  <img 
                    src={activeModalMember.photo} 
                    alt={activeModalMember.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                ) : (
                  <div 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                      color: '#FFF',
                      fontWeight: 800,
                      fontSize: '1.8rem'
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
                    fontSize: '0.8rem', 
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    background: 'var(--secondary-color)',
                    color: '#1A202C',
                    marginBottom: '0.5rem'
                  }}
                >
                  {activeModalMember.role}
                </span>
                <h2 style={{ margin: '0 0 0.4rem 0', fontSize: '1.75rem', color: 'var(--text-primary)' }}>
                  {activeModalMember.name}
                </h2>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500, lineHeight: '1.4' }}>
                  {activeModalMember.subtitle}
                </p>
              </div>
            </div>

            {/* Profile Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div 
                style={{ 
                  background: 'var(--bg-color)', 
                  padding: '1.25rem', 
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)' 
                }}
              >
                <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 0.75rem 0', color: 'var(--primary-color)' }}>
                  <UserCheck size={18} />
                  Short Profile & Background
                </h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                  {activeModalMember.shortProfile}
                </p>
              </div>

              <div 
                style={{ 
                  background: 'var(--bg-color)', 
                  padding: '1.25rem', 
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)' 
                }}
              >
                <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 0.75rem 0', color: 'var(--secondary-color)' }}>
                  <Briefcase size={18} />
                  Area of Responsibility in Foundation
                </h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                  {activeModalMember.areaOfResponsibility}
                </p>
              </div>

              <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                <button
                  onClick={() => setActiveModalMember(null)}
                  className="btn btn-primary"
                  style={{ padding: '0.6rem 1.5rem' }}
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
