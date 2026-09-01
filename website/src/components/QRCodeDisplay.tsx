"use client";

import QRCode from "react-qr-code";
import { useState, useEffect } from "react";

export default function QRCodeDisplay({ url }: { url: string }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return <div style={{ height: 180, width: 180, background: '#FFFFFF', borderRadius: '16px', border: '3px solid var(--secondary-color)' }} />;

  return (
    <div style={{ 
      background: '#FFFFFF', 
      padding: '1.25rem', 
      borderRadius: '16px', 
      display: 'inline-block', 
      boxShadow: 'var(--shadow-lg)', 
      border: '3px solid var(--secondary-color)' 
    }}>
      <QRCode value={url} size={180} fgColor="#000000" bgColor="#FFFFFF" />
    </div>
  );
}
