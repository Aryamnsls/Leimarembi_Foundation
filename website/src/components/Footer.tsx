"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/i18n/LanguageContext';
import { ShieldCheck, Mail, Phone, MapPin, ArrowUpRight, Heart } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();
  const pathname = usePathname();

  // Do not show public website footer on Admin CRM dashboard routes
  if (pathname?.startsWith('/management') || pathname?.startsWith('/superadmin')) {
    return null;
  }

  return (
    <footer className="app-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Column 1: Foundation Identity & Motto */}
          <div>
            <div className="footer-logo-row">
              <Image src="/leimarembi_official_logo.png" alt="Leimarembi Foundation Logo" width={48} height={48} className="footer-logo-img" />
              <div>
                <span className="footer-brand-title">
                  LEIMAREMBI
                </span>
                <span className="footer-brand-sub">
                  FOUNDATION
                </span>
              </div>
            </div>

            <p className="footer-motto-text">
              {t('footer.motto')}
            </p>

            <p className="footer-desc-text">
              {t('footer.desc')}
            </p>

            <div className="footer-badge">
              <ShieldCheck size={16} color="var(--success-color)" />
              <span className="footer-badge-text">
                {t('common.officialNgoTag')}
              </span>
            </div>
          </div>

          {/* Column 2: Governance & Core Programs */}
          <div>
            <h4 className="footer-col-title">
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
            <h4 className="footer-col-title">
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
            <h4 className="footer-col-title">
              {t('footer.col3Title')}
            </h4>
            <div className="footer-contact-list">
              <div className="footer-contact-item">
                <MapPin size={18} color="var(--info-color)" className="footer-contact-icon" />
                <a
                  href="https://www.google.com/maps/search/Manipuri+Rajbari,+Guwahati-781007,+Assam,+India"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-clickable-contact"
                >
                  Manipuri Rajbari, Guwahati-781007, Assam<br />
                  Head Office : Guwahati &nbsp;::&nbsp; Estd. 2001
                </a>
              </div>

              {/* Clickable Email Link */}
              <div className="footer-contact-item-center">
                <Mail size={18} color="var(--info-color)" className="footer-contact-icon-shrink" />
                <a href="mailto:leimarembifoundation@gmail.com" className="footer-clickable-contact">
                  leimarembifoundation@gmail.com
                </a>
              </div>

              {/* Clickable Phone Links */}
              <div className="footer-contact-item">
                <Phone size={18} color="var(--info-color)" className="footer-contact-icon" />
                <div className="footer-phone-col">
                  <a href="tel:+919707499079" className="footer-clickable-contact">97074-99079</a>
                  <a href="tel:+918134997237" className="footer-clickable-contact">81349-97237</a>
                  <a href="tel:+917637087931" className="footer-clickable-contact">76370-87931</a>
                  <a href="tel:+919864801906" className="footer-clickable-contact">98648-01906</a>
                </div>
              </div>

              {/* Support Our Foundation Button */}
              <div className="footer-cta-row">
                <Link href="/donate" className="btn btn-primary footer-cta-btn">
                  <Heart size={14} /> {t('footer.supportCta')}
                </Link>
                <Link href="/contact" className="btn btn-outline footer-cta-btn-outline">
                  {t('footer.contactCta')} <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="footer-bottom-bar">
          <div>
            © {new Date().getFullYear()} {t('footer.rights')}
          </div>
          <div className="footer-bottom-links">
            <Link href="/documents" className="footer-bottom-link">Privacy Policy</Link>
            <Link href="/documents" className="footer-bottom-link">Terms of Governance</Link>
            <Link href="/about" className="footer-bottom-link">Official Charter</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
