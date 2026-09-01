"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/i18n/LanguageContext';
import { ShieldCheck, Mail, Phone, MapPin, ArrowUpRight, Heart } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer 
      style={{ 
        background: 'var(--surface-color)', 
        borderTop: '1px solid var(--border-color)', 
        padding: '2.5rem 0 1.5rem', 
        marginTop: '2.5rem',
        position: 'relative',
        zIndex: 10
      }}
    >
      <div className="container">
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
            gap: '2.5rem',
            marginBottom: '2.5rem'
          }}
        >
          {/* Column 1: Foundation Identity & Motto */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.85rem' }}>
              <Image 
                src="/logo_salai_taret.jpg" 
                alt="Leimarembi Foundation Logo" 
                width={38} 
                height={38} 
                style={{ borderRadius: '8px' }} 
              />
              <div>
                <span style={{ fontWeight: 900, fontSize: '1.05rem', color: 'var(--primary-color)', display: 'block', lineHeight: 1.1 }}>
                  LEIMAREMBEE
                </span>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--secondary-color)', letterSpacing: '1.2px', textTransform: 'uppercase' }}>
                  FOUNDATION
                </span>
              </div>
            </div>

            <p style={{ color: 'var(--secondary-color)', fontSize: '0.825rem', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
              {t('footer.motto')}
            </p>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              {t('footer.desc')}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-color)', padding: '0.45rem 0.8rem', borderRadius: '10px', border: '1px solid var(--border-color)', width: 'fit-content' }}>
              <ShieldCheck size={16} color="var(--success-color)" />
              <span style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {t('common.officialNgoTag')}
              </span>
            </div>
          </div>

          {/* Column 2: Governance & Core Programs */}
          <div>
            <h4 style={{ color: 'var(--primary-color)', fontSize: '0.9rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>
              {t('footer.col1Title')}
            </h4>
            <ul className="footer-links-list">
              <li><Link href="/portal">{t('nav.portal')}</Link></li>
              <li><Link href="/members">{t('nav.members')}</Link></li>
              <li><Link href="/grants">{t('nav.grants', 'Grants & Welfare')}</Link></li>
              <li><Link href="/health">{t('nav.health', 'Rural Health Camps')}</Link></li>
              <li><Link href="/management">{t('nav.management')}</Link></li>
            </ul>
          </div>

          {/* Column 3: Culture & Media Archives */}
          <div>
            <h4 style={{ color: 'var(--primary-color)', fontSize: '0.9rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>
              {t('footer.col2Title')}
            </h4>
            <ul className="footer-links-list">
              <li><Link href="/culture">{t('nav.culture')}</Link></li>
              <li><Link href="/news">{t('nav.news')}</Link></li>
              <li><Link href="/gallery">{t('nav.gallery')}</Link></li>
              <li><Link href="/documents">{t('nav.documents')}</Link></li>
              <li><Link href="/about">{t('nav.about')}</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact & Community Support */}
          <div>
            <h4 style={{ color: 'var(--primary-color)', fontSize: '0.9rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>
              {t('footer.col3Title')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={18} color="var(--info-color)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>Leimarembi Foundation Headquarters, Imphal, Manipur, India</span>
              </div>

              {/* Clickable Email Link */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={18} color="var(--info-color)" style={{ flexShrink: 0 }} />
                <a href="mailto:info@leimarembee.org" className="footer-clickable-contact">
                  info@leimarembee.org
                </a>
              </div>

              {/* Clickable Phone Link */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={18} color="var(--info-color)" style={{ flexShrink: 0 }} />
                <a href="tel:+919876543210" className="footer-clickable-contact">
                  +91 98765 43210
                </a>
              </div>

              {/* Support Our Foundation Button */}
              <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Link href="/donate" className="btn btn-primary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.825rem', gap: '6px' }}>
                  <Heart size={14} /> {t('footer.supportCta')}
                </Link>
                <Link href="/contact" className="btn btn-outline" style={{ padding: '0.45rem 0.85rem', fontSize: '0.825rem', gap: '4px' }}>
                  {t('footer.contactCta')} <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div 
          style={{ 
            borderTop: '1px solid var(--border-color)', 
            paddingTop: '1.5rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            color: 'var(--text-muted)',
            fontSize: '0.825rem'
          }}
        >
          <div>
            © {new Date().getFullYear()} {t('footer.rights')}
          </div>
          <div style={{ display: 'flex', gap: '1.25rem', fontWeight: 600 }}>
            <Link href="/documents" className="footer-bottom-link">Privacy Policy</Link>
            <Link href="/documents" className="footer-bottom-link">Terms of Governance</Link>
            <Link href="/about" className="footer-bottom-link">Official Charter</Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer-links-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .footer-links-list a {
          color: var(--text-secondary);
          font-size: 0.875rem;
          font-weight: 600;
          transition: color 0.2s ease;
        }
        .footer-links-list a:hover {
          color: var(--info-color);
          text-decoration: underline;
        }
        .footer-clickable-contact {
          color: var(--text-primary);
          font-weight: 700;
          transition: color 0.2s ease;
        }
        .footer-clickable-contact:hover {
          color: var(--info-color);
          text-decoration: underline;
        }
        .footer-bottom-link {
          color: var(--text-secondary);
          transition: color 0.2s ease;
        }
        .footer-bottom-link:hover {
          color: var(--info-color);
        }
      `}</style>
    </footer>
  );
}
