import { Heart } from 'lucide-react';

export const metadata = {
  title: 'Donate | Leimarembi Foundation',
  description: 'Support the Foundation through donations.',
};

export default function Donate() {
  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="glass-panel" style={{ fontSize: '2.5rem', margin: 0, display: 'inline-block' }}>Make a Donation</h1>
      </div>

      <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--accent-color)', marginBottom: '1rem' }}>
          <Heart size={48} />
        </div>
        <h2>Support Our Cause</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Your contributions help us sustain our health, cultural, and welfare programs for the community.
        </p>
        
        <div style={{ background: 'var(--bg-color)', padding: '1.5rem', borderRadius: '12px', textAlign: 'left', marginBottom: '2rem' }}>
          <h3 style={{ marginTop: 0, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Bank Details</h3>
          <p style={{ margin: '0.5rem 0' }}><strong>Account Name:</strong> Leimarembee Foundation</p>
          <p style={{ margin: '0.5rem 0' }}><strong>Account Number:</strong> 123456789012</p>
          <p style={{ margin: '0.5rem 0' }}><strong>IFSC Code:</strong> SBIN0001234</p>
          <p style={{ margin: '0.5rem 0' }}><strong>Branch:</strong> Imphal Main Branch</p>
        </div>
        
        <button className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>Proceed to Payment Gateway</button>
      </div>
    </div>
  );
}
