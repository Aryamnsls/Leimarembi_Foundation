"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "@/i18n/LanguageContext";
import { ArrowRight, FileText, Activity, Heart, BookOpen, ShieldCheck } from "lucide-react";
import QRCodeDisplay from "@/components/QRCodeDisplay";
import FaqAccordion from "@/components/FaqAccordion";

export default function Home() {
  const { t } = useTranslation();
  const [qrUrl, setQrUrl] = useState<string>("https://leimarembi.org/?qr=1");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const timer = setTimeout(() => {
        setQrUrl(`${window.location.origin}/?qr=1`);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="animate-fade-in" style={{ padding: "0.5rem 0 2rem" }}>
      {/* Hero Section */}
      <section className="card" style={{ 
        padding: '3.5rem 2rem', 
        textAlign: 'center',
        margin: '0.5rem auto 2.5rem',
        maxWidth: '960px',
        borderTop: '4px solid var(--secondary-color)'
      }}>
        <div className="container" style={{ padding: 0 }}>
          <span style={{ 
            color: 'var(--secondary-color)', 
            fontWeight: 800, 
            letterSpacing: '2px', 
            textTransform: 'uppercase', 
            marginBottom: '1rem', 
            display: 'inline-block',
            fontSize: '0.875rem'
          }}>
            {t('hero.tag')}
          </span>
          <h1 style={{ fontSize: '3.25rem', marginBottom: '1.25rem', lineHeight: 1.15, fontWeight: 900, color: 'var(--primary-color)' }}>
            {t('hero.title')}
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            color: 'var(--text-secondary)', 
            marginBottom: '2.5rem', 
            maxWidth: '750px', 
            margin: '0 auto 2.5rem',
            lineHeight: 1.6 
          }}>
            {t('hero.subtitle')}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/about" className="btn btn-secondary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
              {t('hero.discoverVision')} <ArrowRight size={18} />
            </Link>
            <Link href="/documents" className="btn btn-outline" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
              {t('hero.viewDocuments')} <FileText size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Core Modules Grid */}
      <section style={{ marginBottom: '5rem', textAlign: 'center' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <div className="glass-panel" style={{ padding: '0.5rem 1.5rem', borderRadius: '30px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--secondary-color)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              {t('hero.pillarsSubtitle')}
            </span>
          </div>
          <h2 style={{ fontSize: '2.25rem', marginTop: '1rem', fontWeight: 800, color: 'var(--primary-color)' }}>
            {t('hero.pillarsTitle')}
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', textAlign: 'left' }}>
          
          <div className="card" style={{ borderTop: '4px solid var(--accent-color)' }}>
            <div style={{ 
              width: '56px', height: '56px', 
              background: 'rgba(230, 57, 70, 0.1)', 
              borderRadius: '12px', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              marginBottom: '1.25rem', color: 'var(--accent-color)' 
            }}>
              <Heart size={28} />
            </div>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-color)' }}>{t('pillars.healthTitle')}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              {t('pillars.healthDesc')}
            </p>
            <Link href="/health" style={{ color: 'var(--primary-color)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
              {t('common.learnMore')} <ArrowRight size={16} />
            </Link>
          </div>

          <div className="card" style={{ borderTop: '4px solid var(--secondary-color)' }}>
            <div style={{ 
              width: '56px', height: '56px', 
              background: 'rgba(212, 175, 55, 0.1)', 
              borderRadius: '12px', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              marginBottom: '1.25rem', color: 'var(--secondary-color)' 
            }}>
              <BookOpen size={28} />
            </div>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-color)' }}>{t('pillars.cultureTitle')}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              {t('pillars.cultureDesc')}
            </p>
            <Link href="/culture" style={{ color: 'var(--primary-color)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
              {t('common.learnMore')} <ArrowRight size={16} />
            </Link>
          </div>

          <div className="card" style={{ borderTop: '4px solid var(--info-color)' }}>
            <div style={{ 
              width: '56px', height: '56px', 
              background: 'rgba(43, 108, 176, 0.1)', 
              borderRadius: '12px', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              marginBottom: '1.25rem', color: 'var(--info-color)' 
            }}>
              <Activity size={28} />
            </div>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-color)' }}>{t('pillars.communityTitle')}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              {t('pillars.communityDesc')}
            </p>
            <Link href="/activities" style={{ color: 'var(--primary-color)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
              {t('common.learnMore')} <ArrowRight size={16} />
            </Link>
          </div>

        </div>
      </section>

      {/* QR Code Highlight & Portal Section */}
      <section className="card" style={{ padding: '4rem 2.5rem', borderRadius: '24px', marginBottom: '5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '3rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 480px' }}>
            <span style={{ color: 'var(--secondary-color)', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1.5px' }}>
              {t('portalHighlight.tag')}
            </span>
            <h2 style={{ fontSize: '2.4rem', marginBottom: '1rem', marginTop: '0.5rem', fontWeight: 800, color: 'var(--primary-color)' }}>
              {t('portalHighlight.title')}
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.7 }}>
              {t('portalHighlight.desc')}
            </p>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2.25rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.85rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>
                <div style={{ color: 'var(--secondary-color)', background: 'rgba(2, 132, 199, 0.12)', padding: '6px', borderRadius: '50%', display: 'flex' }}>
                  <ShieldCheck size={18} />
                </div> 
                {t('portalHighlight.feature1')}
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.85rem', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>
                <div style={{ color: 'var(--secondary-color)', background: 'rgba(2, 132, 199, 0.12)', padding: '6px', borderRadius: '50%', display: 'flex' }}>
                  <ShieldCheck size={18} />
                </div> 
                {t('portalHighlight.feature2')}
              </li>
            </ul>
            <Link href="/portal" className="btn btn-primary" style={{ padding: '0.85rem 2rem' }}>
              {t('portalHighlight.cta')}
            </Link>
          </div>

          <div style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontWeight: 700, marginBottom: '1.25rem', color: 'var(--primary-color)', fontSize: '0.95rem' }}>
                {t('portalHighlight.scanNotice')}
              </p>
              <QRCodeDisplay url={qrUrl} />
            </div>
          </div>
        </div>
      </section>

      {/* Community FAQ Accordion Section */}
      <section style={{ marginBottom: '4rem' }}>
        <FaqAccordion />
      </section>
    </div>
  );
}
