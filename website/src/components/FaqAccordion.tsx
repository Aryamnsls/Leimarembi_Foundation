"use client";

import { useState } from 'react';
import { useTranslation } from '@/i18n/LanguageContext';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

export default function FaqAccordion() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: t('faq.q1'),
      answer: t('faq.a1')
    },
    {
      question: t('faq.q2'),
      answer: t('faq.a2')
    },
    {
      question: t('faq.q3'),
      answer: t('faq.a3')
    },
    {
      question: t('faq.q4'),
      answer: t('faq.a4')
    },
    {
      question: t('faq.q5'),
      answer: t('faq.a5')
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div 
          className="glass-panel" 
          style={{ 
            display: 'inline-block', 
            padding: '0.4rem 1.25rem', 
            borderRadius: '30px', 
            marginBottom: '0.75rem',
            border: '1px solid var(--border-color)'
          }}
        >
          <span style={{ fontSize: '0.825rem', fontWeight: 800, color: 'var(--secondary-color)', letterSpacing: '1.5px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <HelpCircle size={15} /> {t('faq.tag')}
          </span>
        </div>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--primary-color)', margin: 0 }}>
          {t('faq.title')}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '0.5rem' }}>
          {t('faq.subtitle')}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="card"
              style={{
                padding: '0',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid var(--border-color)',
                background: 'var(--surface-color)',
                transition: 'all 0.2s ease'
              }}
            >
              <button
                onClick={() => toggleFaq(idx)}
                style={{
                  width: '100%',
                  padding: '1.25rem 1.5rem',
                  border: 'none',
                  background: 'none',
                  color: 'var(--text-primary)',
                  textAlign: 'left',
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}
                aria-expanded={isOpen}
              >
                <span>{faq.question}</span>
                <div 
                  style={{ 
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
                    transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    color: isOpen ? 'var(--info-color)' : 'var(--text-muted)',
                    flexShrink: 0
                  }}
                >
                  <ChevronDown size={20} />
                </div>
              </button>

              {isOpen && (
                <div 
                  className="animate-fade-in"
                  style={{
                    padding: '0 1.5rem 1.25rem 1.5rem',
                    color: 'var(--text-secondary)',
                    fontSize: '0.95rem',
                    lineHeight: 1.65,
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: '1rem'
                  }}
                >
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
