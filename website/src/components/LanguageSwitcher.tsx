"use client";

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from '@/i18n/LanguageContext';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, Language } from '@/i18n';
import { Globe, ChevronDown, Check } from 'lucide-react';

export default function LanguageSwitcher() {
  const { language, setLanguage, mounted } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeCode = mounted ? language : DEFAULT_LANGUAGE;
  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === activeCode) || SUPPORTED_LANGUAGES[0];

  // Close dropdown on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelect = (langCode: Language) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block', flexShrink: 0 }}>
      {/* Sleek Compact Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select language"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          padding: '0.35rem 0.6rem',
          borderRadius: '8px',
          border: '1px solid var(--border-color)',
          background: 'var(--surface-color)',
          color: 'var(--text-primary)',
          fontSize: '0.8rem',
          fontWeight: 800,
          cursor: 'pointer',
          height: '34px',
          transition: 'all 0.2s ease',
          boxShadow: 'var(--shadow-sm)',
          whiteSpace: 'nowrap'
        }}
      >
        <Globe size={14} color="var(--info-color)" />
        <span>{currentLang.shortLabel}</span>
        <ChevronDown 
          size={13} 
          style={{ 
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
            transition: 'transform 0.2s ease',
            color: 'var(--text-muted)'
          }} 
        />
      </button>

      {/* Accessible Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Available Languages"
          className="animate-fade-in"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            zIndex: 10005,
            minWidth: '190px',
            background: 'var(--surface-color)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
            padding: '0.35rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px'
          }}
        >
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = lang.code === activeCode;
            return (
              <button
                key={lang.code}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(lang.code)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0.65rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: isSelected ? 'rgba(2, 132, 199, 0.12)' : 'transparent',
                  color: isSelected ? 'var(--info-color)' : 'var(--text-primary)',
                  fontWeight: isSelected ? 800 : 600,
                  fontSize: '0.825rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 900, fontSize: '0.725rem', textTransform: 'uppercase', color: 'var(--info-color)', background: 'rgba(2, 132, 199, 0.1)', padding: '2px 5px', borderRadius: '4px' }}>
                    {lang.shortLabel}
                  </span>
                  <span>{lang.nativeName}</span>
                </div>
                {isSelected && <Check size={14} color="var(--info-color)" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
