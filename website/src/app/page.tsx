import Link from "next/link";
import { ArrowRight, FileText, Activity, Heart, BookOpen } from "lucide-react";
import QRCodeDisplay from "@/components/QRCodeDisplay";

export default function Home() {
  // Using the local network IP address so you can scan it with your phone!
  const documentsUrl = "http://192.168.1.40:3000/?qr=1";

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="card" style={{ 
        padding: '6rem 2rem', 
        textAlign: 'center',
        margin: '4rem auto',
        maxWidth: '900px'
      }}>
        <div className="container">
          <span style={{ color: 'var(--secondary-color)', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem', display: 'block' }}>
            Welcome to the Official Portal
          </span>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', lineHeight: 1.2 }}>
            Leimarembi Foundation
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: '800px', margin: '0 auto 2.5rem' }}>
            Digital Governance & Community Development Platform
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/about" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.8rem 2rem' }}>
              Discover Our Vision <ArrowRight size={18} />
            </Link>
            <Link href="/documents" className="btn" style={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', padding: '0.8rem 2rem' }}>
              View Documents <FileText size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Links / Modules Preview */}
      <section className="container" style={{ marginBottom: '5rem', textAlign: 'center' }}>
        <h2 className="glass-panel" style={{ marginBottom: '3rem', fontSize: '2rem' }}>Our Core Modules</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', textAlign: 'left' }}>
          
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ height: '60px', width: '60px', background: 'var(--bg-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary-color)' }}>
              <Heart size={30} />
            </div>
            <h3 style={{ fontSize: '1.25rem' }}>Health & Welfare</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Supporting senior citizens with medical camps, insurance information, and welfare assistance.</p>
            <Link href="/activities" style={{ color: 'var(--primary-color)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>Read More <ArrowRight size={16} /></Link>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ height: '60px', width: '60px', background: 'var(--bg-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary-color)' }}>
              <BookOpen size={30} />
            </div>
            <h3 style={{ fontSize: '1.25rem' }}>Cultural Preservation</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Archiving Manipuri heritage, traditional recipes, oral history, and traditional arts.</p>
            <Link href="/activities" style={{ color: 'var(--primary-color)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>Read More <ArrowRight size={16} /></Link>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ height: '60px', width: '60px', background: 'var(--bg-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary-color)' }}>
              <Activity size={30} />
            </div>
            <h3 style={{ fontSize: '1.25rem' }}>Community Development</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Executing projects, monitoring activities, and tracking beneficiary records efficiently.</p>
            <Link href="/activities" style={{ color: 'var(--primary-color)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>Read More <ArrowRight size={16} /></Link>
          </div>
          
        </div>
      </section>

      {/* QR Code Highlight */}
      <section style={{ background: 'var(--surface-color)', padding: '5rem 0', borderTop: '1px solid var(--border-color)', borderRadius: '24px', boxShadow: 'var(--shadow-sm)', marginBottom: '2rem' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 500px' }}>
            <span style={{ color: 'var(--secondary-color)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '1px' }}>Mobile Portal Access</span>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', marginTop: '0.5rem' }}>The Comprehensive Services Portal</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.8 }}>
              As part of our Digital Governance initiative, the Leimarembi Foundation platform houses 8 distinct modules, including Foundation Management, Grant Tracking, Cultural Preservation, and Health & Welfare. Scan the QR code to instantly access the command center on your mobile device.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                <div style={{ color: 'var(--secondary-color)', background: 'rgba(212, 175, 55, 0.1)', padding: '8px', borderRadius: '50%', display: 'flex' }}><FileText size={20} /></div> 
                8 Complete Modules
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                <div style={{ color: 'var(--secondary-color)', background: 'rgba(212, 175, 55, 0.1)', padding: '8px', borderRadius: '50%', display: 'flex' }}><FileText size={20} /></div> 
                Instantly accessible anywhere
              </li>
            </ul>
            <Link href="/portal" className="btn btn-primary">Go to Services Portal</Link>
          </div>
          <div style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontWeight: 600, marginBottom: '1.5rem', color: 'var(--primary-color)' }}>Scan to view documents on mobile</p>
              <QRCodeDisplay url={documentsUrl} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
