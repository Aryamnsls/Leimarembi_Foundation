"use client";

import QRCode from "react-qr-code";
import { useState, useEffect } from "react";

export default function QRCodeDisplay({ url }: { url: string }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div style={{ height: 200, width: 200, background: '#f4f4f4', borderRadius: '8px' }} />;

  return (
    <div style={{ 
      background: 'white', 
      padding: '1.5rem', 
      borderRadius: '16px', 
      display: 'inline-block', 
      boxShadow: 'var(--shadow-lg)', 
      border: '3px solid var(--secondary-color)' 
    }}>
      <QRCode value={url} size={200} fgColor="var(--primary-color)" />
    </div>
  );
}
