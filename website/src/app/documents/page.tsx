import { Download, File, Lock } from 'lucide-react';

export const metadata = {
  title: 'Document Repository | Leimarembi Foundation',
  description: 'Access official Foundation documents and architectural reports.',
};

export default function Documents() {
  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <div className="glass-panel" style={{ textAlign: 'center', marginBottom: '4rem', maxWidth: '700px', margin: '0 auto 4rem', display: 'block' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Digital Library & Documents</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Transparent access to our official foundation structure, bylaws, and digital architecture plans.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* Document 1 */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(230, 57, 70, 0.1)', padding: '15px', borderRadius: '12px', color: 'var(--accent-color)' }}>
              <File size={32} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Foundation Requirements</h3>
              <span style={{ fontSize: '0.85rem', color: '#888' }}>PDF Document • 85 KB</span>
            </div>
          </div>
          <p style={{ color: 'var(--text-secondary)', flex: 1, marginBottom: '2rem' }}>
            Detailed requirements for the official foundation website, mobile application, and management software modules.
          </p>
          <a href="/requirements.pdf" download className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}>
            <Download size={18} /> Download PDF
          </a>
        </div>

        {/* Document 2 */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(10, 25, 47, 0.1)', padding: '15px', borderRadius: '12px', color: 'var(--primary-color)' }}>
              <File size={32} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Technical Architecture</h3>
              <span style={{ fontSize: '0.85rem', color: '#888' }}>PDF Document • 307 KB</span>
            </div>
          </div>
          <p style={{ color: 'var(--text-secondary)', flex: 1, marginBottom: '2rem' }}>
            Overview of the digital governance platform architecture, technology stack (Next.js, Node.js), and rollout plan.
          </p>
          <a href="/architecture.pdf" download className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}>
            <Download size={18} /> Download PDF
          </a>
        </div>

        {/* Annual Reports */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(46, 204, 113, 0.1)', padding: '15px', borderRadius: '12px', color: '#2ecc71' }}>
              <File size={32} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Annual Reports</h3>
              <span style={{ fontSize: '0.85rem', color: '#888' }}>PDF Documents</span>
            </div>
          </div>
          <p style={{ color: 'var(--text-secondary)', flex: 1, marginBottom: '2rem' }}>
            Comprehensive yearly overviews of our financial statements, project impacts, and foundation growth.
          </p>
          <a href="#" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}>
            <Download size={18} /> View Reports
          </a>
        </div>

        {/* Locked Section */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', background: '#f8f9fa', border: '1px dashed #ccc', boxShadow: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1.5rem' }}>
            <div style={{ background: '#e0e0e0', padding: '15px', borderRadius: '12px', color: '#666' }}>
              <Lock size={32} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#555' }}>Internal Documents</h3>
              <span style={{ fontSize: '0.85rem', color: '#888' }}>Restricted Access</span>
            </div>
          </div>
          <p style={{ color: '#777', flex: 1, marginBottom: '2rem' }}>
            Trust Deed, Bye-laws, Financial Statements, and Member Directory are restricted to authorized personnel.
          </p>
          <button disabled className="btn" style={{ background: '#ddd', color: '#888', cursor: 'not-allowed', width: '100%', border: 'none' }}>
            Requires Login
          </button>
        </div>
      </div>
    </div>
  );
}
