"use client";

import { useState } from 'react';
import { Download, File, Lock, Eye, X } from 'lucide-react';

export default function Documents() {
  const [activeReportModal, setActiveReportModal] = useState(false);

  return (
    <div className="animate-fade-in" style={{ padding: '2.5rem 0 4rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div className="glass-panel" style={{ padding: '0.4rem 1.25rem', borderRadius: '30px', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--secondary-color)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            Official Governance Archive
          </span>
        </div>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 900, marginBottom: '0.75rem' }}>Digital Library & Documents</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '720px', margin: '0 auto', lineHeight: 1.6 }}>
          Transparent, instant access to our foundation&apos;s official requirements, technical architecture plans, and governance documents.
        </p>
      </div>

      {/* Grid with Equal-Height Flex Cards & Perfectly Aligned Bottom Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '1.5rem', alignItems: 'stretch' }}>
        {/* Document 1 */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', borderTop: '4px solid var(--accent-color)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '1.25rem' }}>
              <div style={{ background: 'rgba(155, 44, 44, 0.12)', width: '48px', height: '48px', borderRadius: '12px', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <File size={26} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Foundation Requirements</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>PDF Document • 85 KB</span>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.55, marginBottom: '1.5rem' }}>
              Detailed specification requirements for the official foundation website, mobile application portal, and digital management software modules.
            </p>
          </div>
          <a href="/requirements.pdf" download className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: 'auto', minHeight: '44px' }}>
            <Download size={16} /> Download PDF
          </a>
        </div>

        {/* Document 2 */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', borderTop: '4px solid var(--primary-color)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '1.25rem' }}>
              <div style={{ background: 'rgba(10, 25, 47, 0.1)', width: '48px', height: '48px', borderRadius: '12px', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <File size={26} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Technical Architecture</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>PDF Document • 307 KB</span>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.55, marginBottom: '1.5rem' }}>
              Comprehensive technical architecture overview covering Next.js, Express REST API, Prisma ORM database schemas, and rollout roadmap.
            </p>
          </div>
          <a href="/architecture.pdf" download className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 'auto', minHeight: '44px' }}>
            <Download size={16} /> Download PDF
          </a>
        </div>

        {/* Document 3 */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', borderTop: '4px solid var(--success-color)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '1.25rem' }}>
              <div style={{ background: 'rgba(39, 174, 96, 0.12)', width: '48px', height: '48px', borderRadius: '12px', color: 'var(--success-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <File size={26} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Annual Reports</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>PDF Overview • FY 2025-26</span>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.55, marginBottom: '1.5rem' }}>
              Yearly financial statements, grant utilization certificates, health camp outcomes, and community impact metrics.
            </p>
          </div>
          <button 
            onClick={() => setActiveReportModal(true)}
            className="btn btn-outline" 
            style={{ width: '100%', justifyContent: 'center', marginTop: 'auto', minHeight: '44px' }}
          >
            <Eye size={16} /> View Summary Report
          </button>
        </div>

        {/* Document 4 */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', borderTop: '4px solid var(--border-color)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '1.25rem' }}>
              <div style={{ background: 'rgba(0, 0, 0, 0.05)', width: '48px', height: '48px', borderRadius: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Lock size={26} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Internal Governance</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Restricted Access</span>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.55, marginBottom: '1.5rem' }}>
              Trust Deeds, Bye-laws, Executive Resolutions, and Member Directories are protected for executive committee members.
            </p>
          </div>
          <a href="/login" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', marginTop: 'auto', minHeight: '44px', border: '1px solid var(--border-color)' }}>
            Requires Member Login
          </a>
        </div>
      </div>

      {/* Report Summary Modal */}
      {activeReportModal && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="report-modal-title"
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
          onClick={() => setActiveReportModal(false)}
        >
          <div 
            className="card animate-fade-in" 
            style={{ 
              maxWidth: '560px', 
              width: '100%', 
              borderRadius: '20px', 
              padding: '2rem', 
              position: 'relative',
              background: 'var(--surface-color-solid)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveReportModal(false)}
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
            >
              <X size={18} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--secondary-color)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Executive Summary
              </div>
              <h2 id="report-modal-title" style={{ fontSize: '1.75rem', fontWeight: 900, marginTop: '4px' }}>
                Annual Report FY 2025-26
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
              <div style={{ background: 'var(--bg-color)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <strong>Key Highlights:</strong>
                <ul style={{ margin: '0.5rem 0 0 1.25rem', padding: 0 }}>
                  <li>12 Medical Camps organized across Kamrup & Imphal</li>
                  <li>Over ₹15,00,00,000 INR mapped in PFMS government welfare grants</li>
                  <li>12 Executive Governing Body members audited & verified</li>
                </ul>
              </div>

              <p style={{ margin: 0 }}>
                Full audit statements and bank utilization certificates are registered with the Registrar of Public Trusts.
              </p>
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <button onClick={() => setActiveReportModal(false)} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Close Summary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
