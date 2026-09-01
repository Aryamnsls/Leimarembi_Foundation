"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect /register to unified Member Portal with Register tab active
    router.replace('/login?tab=register');
  }, [router]);

  return (
    <div style={{ minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ padding: '2.5rem', textAlign: 'center', maxWidth: '400px' }}>
        <p style={{ color: 'var(--text-secondary)', fontWeight: 600, margin: 0 }}>
          Redirecting to Member Registration Portal...
        </p>
      </div>
    </div>
  );
}
