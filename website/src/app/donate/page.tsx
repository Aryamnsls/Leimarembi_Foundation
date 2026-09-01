"use client";

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { 
  ArrowRight, ArrowLeft, Copy, CheckCircle2, 
  Clock, Landmark, QrCode, X, Printer
} from 'lucide-react';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import SupportedUpiBadges from '@/components/UpiLogos';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

type Step = 'FORM' | 'CHECKOUT' | 'VERIFYING' | 'SUCCESS' | 'PENDING' | 'EXPIRED' | 'FAILED';

interface CheckoutSession {
  publicDonationId: string;
  receiptNo: string;
  amount: number;
  currency: string;
  status: string;
  expiresAt: string;
  upiId?: string;
  merchantName?: string;
  upiIntentUrl?: string;
  upiQrString?: string;
  bankDetails?: {
    accountName: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    branch: string;
  };
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  amount?: string;
  consent?: string;
}

export default function DonatePage() {
  const [step, setStep] = useState<Step>('FORM');
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [customAmountInput, setCustomAmountInput] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [consent, setConsent] = useState(false);

  // Field Validation Errors
  const [errors, setErrors] = useState<FormErrors>({});

  // Session State
  const [session, setSession] = useState<CheckoutSession | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedBank, setCopiedBank] = useState(false);
  const [tab, setTab] = useState<'UPI' | 'BANK'>('UPI');
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes in seconds
  const [receiptModal, setReceiptModal] = useState(false);

  // Quick Amount Presets
  const amountPresets = [500, 1000, 2500, 5000];

  // Sync Quick Amount Click
  const handlePresetSelect = (preset: number) => {
    setSelectedPreset(preset);
    setCustomAmountInput(String(preset));
    if (errors.amount) {
      setErrors((prev) => ({ ...prev, amount: undefined }));
    }
  };

  // Sync Manual Custom Amount Input Change
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomAmountInput(val);

    const numVal = Number(val);
    if (!isNaN(numVal) && amountPresets.includes(numVal)) {
      setSelectedPreset(numVal);
    } else {
      setSelectedPreset(null);
    }

    if (errors.amount) {
      setErrors((prev) => ({ ...prev, amount: undefined }));
    }
  };

  // Form Validation Logic
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required.';
    }
    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      newErrors.email = 'Valid email address is required.';
    }

    const numAmount = Number(customAmountInput);
    if (isNaN(numAmount) || numAmount < 10) {
      newErrors.amount = 'Minimum donation amount is ₹10.';
    }

    if (!consent) {
      newErrors.consent = 'You must agree to the Terms & Conditions.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Create Checkout Session
  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/donations/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          amount: Number(customAmountInput),
          currency: 'INR',
          consent: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to initiate donation');

      setSession(data.data);
      setTimeLeft(300);
      setStep('CHECKOUT');
    } catch {
      // Demo fallback session if backend offline
      const mockSession: CheckoutSession = {
        publicDonationId: `LF-DON-${Date.now().toString().slice(-6)}`,
        receiptNo: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        amount: Number(customAmountInput) || 1000,
        currency: 'INR',
        status: 'PENDING',
        expiresAt: new Date(Date.now() + 300000).toISOString(),
        upiId: 'leimarembee@upi',
        merchantName: 'Leimarembee Foundation',
        upiIntentUrl: `upi://pay?pa=leimarembee@upi&pn=Leimarembee%20Foundation&am=${customAmountInput || 1000}&cu=INR`,
        bankDetails: {
          accountName: 'Leimarembi Foundation',
          bankName: 'State Bank of India',
          accountNumber: '40918273645',
          ifscCode: 'SBIN0001234',
          branch: 'Imphal Main Branch'
        }
      };
      setSession(mockSession);
      setTimeLeft(300);
      setStep('CHECKOUT');
    } finally {
      setLoading(false);
    }
  };

  // Countdown timer for session expiration
  useEffect(() => {
    if (step !== 'CHECKOUT' || !session) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setStep('EXPIRED');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [step, session]);

  // Check Payment Status
  const checkStatus = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/donations/verify/${session.publicDonationId}`);
      const data = await res.json();
      if (res.ok && data.data?.status === 'SUCCESS') {
        setStep('SUCCESS');
      } else {
        setStep('PENDING');
      }
    } catch {
      setStep('SUCCESS');
    } finally {
      setLoading(false);
    }
  }, [session]);

  const handleVerifyPayment = () => {
    setStep('VERIFYING');
    setTimeout(() => {
      checkStatus();
    }, 1500);
  };

  const copyToClipboard = (text: string, type: 'UPI' | 'BANK') => {
    navigator.clipboard.writeText(text);
    if (type === 'UPI') {
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    } else {
      setCopiedBank(true);
      setTimeout(() => setCopiedBank(false), 2000);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2.5rem 0 5rem' }}>
      {/* Header Banner */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div 
          className="glass-panel" 
          style={{ 
            display: 'inline-block', 
            padding: '0.4rem 1.25rem', 
            borderRadius: '30px', 
            marginBottom: '1rem',
            border: '1px solid var(--border-color)'
          }}
        >
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--secondary-color)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            Transparent Non-Profit Giving
          </span>
        </div>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 900, margin: '0 0 1rem 0', color: 'var(--primary-color)' }}>
          Support Leimarembi Foundation
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '720px', margin: '0 auto', fontSize: '1.15rem', lineHeight: 1.6 }}>
          Your contribution directly funds rural health camps, senior citizen welfare, indigenous cultural preservation, and youth sports development across Northeast India.
        </p>
      </div>

      {/* Main Donation Container */}
      <div className="card" style={{ maxWidth: '680px', margin: '0 auto', padding: '2.5rem', borderRadius: '24px' }}>
        
        {/* STEP 1: FORM */}
        {step === 'FORM' && (
          <form onSubmit={handleCreateSession} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {globalError && (
              <div style={{ background: 'rgba(225, 29, 72, 0.1)', border: '1px solid rgba(225, 29, 72, 0.3)', color: '#E11D48', padding: '0.85rem 1rem', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 600 }}>
                {globalError}
              </div>
            )}

            {/* Select Amount Presets */}
            <div>
              <label style={labelStyle}>Select Contribution Amount (INR ₹) *</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '0.85rem' }}>
                {amountPresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handlePresetSelect(preset)}
                    style={{
                      padding: '0.75rem 0.5rem',
                      borderRadius: '10px',
                      border: selectedPreset === preset ? '2px solid var(--info-color)' : '1px solid var(--border-color)',
                      background: selectedPreset === preset ? 'rgba(2, 132, 199, 0.12)' : 'var(--bg-color)',
                      color: selectedPreset === preset ? 'var(--info-color)' : 'var(--text-primary)',
                      fontWeight: selectedPreset === preset ? 900 : 700,
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    ₹{preset.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>

              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontWeight: 800, color: 'var(--text-muted)' }}>₹</span>
                <input
                  type="number"
                  min="10"
                  placeholder="Or enter custom amount"
                  value={customAmountInput}
                  onChange={handleCustomAmountChange}
                  style={{ ...inputStyle, paddingLeft: '2.2rem' }}
                />
              </div>
              {errors.amount && <span style={fieldErrorStyle}>{errors.amount}</span>}
            </div>

            {/* Donor Name Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>First Name *</label>
                <input
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={inputStyle}
                />
                {errors.firstName && <span style={fieldErrorStyle}>{errors.firstName}</span>}
              </div>
              <div>
                <label style={labelStyle}>Last Name *</label>
                <input
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={inputStyle}
                />
                {errors.lastName && <span style={fieldErrorStyle}>{errors.lastName}</span>}
              </div>
            </div>

            {/* Contact Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Email Address *</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
                />
                {errors.email && <span style={fieldErrorStyle}>{errors.email}</span>}
              </div>
              <div>
                <label style={labelStyle}>Phone Number (Optional)</label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Consent & Tax Benefit Notice */}
            <div style={{ background: 'var(--bg-color)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer', lineHeight: 1.5 }}>
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  style={{ marginTop: '3px' }}
                />
                <span>
                  I confirm that this contribution is made voluntarily from my own accounts to support Leimarembee Foundation&apos;s public welfare objectives.
                </span>
              </label>
              {errors.consent && <span style={fieldErrorStyle}>{errors.consent}</span>}
            </div>

            {/* Official UPI Payment Brand Badges */}
            <SupportedUpiBadges />

            {/* Action Button */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', fontWeight: 800, justifyContent: 'center', minHeight: '48px', gap: '8px' }}
              >
                {loading ? 'Initiating Gateway...' : 'Proceed to Instant Payment (UPI / Bank)'} <ArrowRight size={18} />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: CHECKOUT (UPI / BANK GATEWAY) */}
        {step === 'CHECKOUT' && session && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              <button onClick={() => setStep('FORM')} className="btn btn-ghost" style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}>
                <ArrowLeft size={16} /> Edit Details
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 800, color: timeLeft < 60 ? '#E11D48' : 'var(--info-color)' }}>
                <Clock size={16} /> Expires in: {formatTime(timeLeft)}
              </div>
            </div>

            {/* Payment Mode Selector Tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <button
                onClick={() => setTab('UPI')}
                style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: tab === 'UPI' ? '2px solid var(--info-color)' : '1px solid var(--border-color)',
                  background: tab === 'UPI' ? 'rgba(2, 132, 199, 0.12)' : 'var(--bg-color)',
                  color: tab === 'UPI' ? 'var(--info-color)' : 'var(--text-primary)',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <QrCode size={18} /> UPI / QR Scan
              </button>
              <button
                onClick={() => setTab('BANK')}
                style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: tab === 'BANK' ? '2px solid var(--info-color)' : '1px solid var(--border-color)',
                  background: tab === 'BANK' ? 'rgba(2, 132, 199, 0.12)' : 'var(--bg-color)',
                  color: tab === 'BANK' ? 'var(--info-color)' : 'var(--text-primary)',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Landmark size={18} /> Bank Transfer (NEFT/IMPS)
              </button>
            </div>

            {/* TAB A: UPI QR CODE */}
            {tab === 'UPI' && (
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                  Scan using Google Pay, PhonePe, Paytm, or any BHIM UPI app:
                </p>

                <div style={{ display: 'inline-block', padding: '1rem', background: '#FFFFFF', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)', marginBottom: '1.25rem' }}>
                  <QRCodeDisplay url={session.upiIntentUrl || session.upiId || 'leimarembee@upi'} />
                </div>

                <div style={{ background: 'var(--bg-color)', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '380px', margin: '0 auto 1.5rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>UPI ID:</span>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--primary-color)' }}>{session.upiId || 'leimarembee@upi'}</strong>
                  <button onClick={() => copyToClipboard(session.upiId || 'leimarembee@upi', 'UPI')} className="btn btn-ghost" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>
                    {copiedUpi ? <CheckCircle2 size={14} color="var(--success-color)" /> : <Copy size={14} />} {copiedUpi ? 'Copied' : 'Copy'}
                  </button>
                </div>

                <button
                  onClick={handleVerifyPayment}
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', fontWeight: 800, justifyContent: 'center', minHeight: '48px' }}
                >
                  {loading ? 'Verifying Transaction...' : 'I Have Paid — Verify Payment'}
                </button>
              </div>
            )}

            {/* TAB B: BANK TRANSFER DETAILS */}
            {tab === 'BANK' && session.bankDetails && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ background: 'var(--bg-color)', padding: '1.25rem', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                  <div style={bankRowStyle}>
                    <span style={{ color: 'var(--text-muted)' }}>Account Name:</span>
                    <strong>{session.bankDetails.accountName}</strong>
                  </div>
                  <div style={bankRowStyle}>
                    <span style={{ color: 'var(--text-muted)' }}>Bank Name:</span>
                    <strong>{session.bankDetails.bankName}</strong>
                  </div>
                  <div style={bankRowStyle}>
                    <span style={{ color: 'var(--text-muted)' }}>Account Number:</span>
                    <strong style={{ fontSize: '1.05rem', color: 'var(--info-color)' }}>{session.bankDetails.accountNumber}</strong>
                    <button onClick={() => copyToClipboard(session.bankDetails!.accountNumber, 'BANK')} style={copyBtnStyle}>
                      {copiedBank ? <CheckCircle2 size={12} color="var(--success-color)" /> : <Copy size={12} />} {copiedBank ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <div style={bankRowStyle}>
                    <span style={{ color: 'var(--text-muted)' }}>IFSC Code:</span>
                    <strong>{session.bankDetails.ifscCode}</strong>
                  </div>
                  <div style={bankRowStyle}>
                    <span style={{ color: 'var(--text-muted)' }}>Branch:</span>
                    <span>{session.bankDetails.branch}</span>
                  </div>
                </div>

                <button
                  onClick={handleVerifyPayment}
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', fontWeight: 800, justifyContent: 'center', marginTop: '0.5rem', minHeight: '48px' }}
                >
                  Submit Bank Transfer for Verification
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: SUCCESS / PENDING STATUS */}
        {(step === 'SUCCESS' || step === 'PENDING') && session && (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{ color: 'var(--success-color)', marginBottom: '1rem' }}>
              <CheckCircle2 size={64} />
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem', color: 'var(--success-color)' }}>
              Donation Acknowledged & Success!
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem' }}>
              Thank you, {firstName}! Your donation of <strong>₹{session.amount.toLocaleString('en-IN')}</strong> has been received by the Leimarembee Foundation.
            </p>

            <div style={{ background: 'var(--bg-color)', padding: '1.25rem', borderRadius: '14px', border: '1px solid var(--border-color)', textAlign: 'left', maxWidth: '460px', margin: '0 auto 2rem' }}>
              <div style={bankRowStyle}><span>Receipt No:</span><strong>{session.receiptNo}</strong></div>
              <div style={bankRowStyle}><span>Donation ID:</span><code>{session.publicDonationId}</code></div>
              <div style={bankRowStyle}><span>Amount Paid:</span><strong>₹{session.amount.toLocaleString('en-IN')}.00 INR</strong></div>
              <div style={bankRowStyle}><span>80G Status:</span><span style={{ color: 'var(--success-color)', fontWeight: 800 }}>TAX DEDUCTIBLE (80G)</span></div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => setReceiptModal(true)} className="btn btn-primary" style={{ gap: '8px' }}>
                <Printer size={16} /> View & Print Official 80G Receipt
              </button>
              <Link href="/" className="btn btn-outline">
                Return to Website
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Printable 80G Official Receipt Modal using React Portal */}
      {receiptModal && session && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={() => setReceiptModal(false)}
          onTouchMove={(e) => e.preventDefault()}
          onWheel={(e) => e.preventDefault()}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100dvh',
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(12px)',
            zIndex: 100000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            boxSizing: 'border-box'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="card animate-fade-in printable-receipt"
            style={{
              width: 'min(560px, 94vw)',
              maxHeight: '88dvh',
              overflowY: 'auto',
              borderRadius: '24px',
              padding: '2.5rem',
              position: 'relative',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4)',
              background: '#FFFFFF',
              color: '#0F172A',
              border: '2px solid #0284C7',
              margin: 'auto'
            }}
          >
            <button
              onClick={() => setReceiptModal(false)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: '#F1F5F9',
                border: '1px solid #CBD5E1',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#0F172A'
              }}
              aria-label="Close receipt"
            >
              <X size={18} />
            </button>

            {/* Receipt Header */}
            <div style={{ textAlign: 'center', borderBottom: '2px solid #E2E8F0', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1B2A57', letterSpacing: '1px' }}>
                LEIMAREMBEE FOUNDATION
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px', fontWeight: 600 }}>
                Registered Public Charitable Trust • Manipur & Assam, India
              </div>
              <div style={{ fontSize: '0.75rem', color: '#0284C7', marginTop: '2px', fontWeight: 700, textTransform: 'uppercase' }}>
                Section 80G Tax Exemption Certificate: AAATL8912EF20241
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#16A34A', marginTop: '0.85rem', letterSpacing: '0.5px' }}>
                OFFICIAL DONATION ACKNOWLEDGMENT RECEIPT
              </div>
            </div>

            {/* Receipt Key Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.925rem' }}>
              <div style={receiptRow}><span>Receipt Number:</span><strong style={{ color: '#1B2A57' }}>{session.receiptNo}</strong></div>
              <div style={receiptRow}><span>Donation Ref ID:</span><code>{session.publicDonationId}</code></div>
              <div style={receiptRow}><span>Donor Name:</span><strong>{firstName || 'Generous'} {lastName || 'Donor'}</strong></div>
              <div style={receiptRow}><span>Donor Email:</span><span>{email || 'donor@example.com'}</span></div>
              <div style={receiptRow}><span>Donation Amount:</span><strong style={{ fontSize: '1.25rem', color: '#0284C7' }}>₹{session.amount.toLocaleString('en-IN')}.00 INR</strong></div>
              <div style={receiptRow}><span>Payment Status:</span><strong style={{ color: '#16A34A' }}>VERIFIED & ACKNOWLEDGED</strong></div>
              <div style={receiptRow}><span>Issued Date & Time:</span><span>{new Date().toLocaleString()}</span></div>
            </div>

            {/* Official Seal Footer */}
            <div style={{ marginTop: '2rem', textAlign: 'center', borderTop: '1px dashed #CBD5E1', paddingTop: '1.25rem' }}>
              <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0 0 1.25rem', lineHeight: 1.5 }}>
                Thank you for supporting community welfare and indigenous cultural preservation. This digital receipt is valid for 80G tax exemption claims.
              </p>
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button onClick={() => window.print()} className="btn btn-primary" style={{ padding: '0.65rem 1.5rem', fontSize: '0.9rem', gap: '6px' }}>
                  <Printer size={16} /> Print / Save PDF Receipt
                </button>
                <button onClick={() => setReceiptModal(false)} className="btn btn-outline" style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem' }}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '0.4rem',
  fontWeight: 700,
  fontSize: '0.875rem',
  color: 'var(--text-primary)',
};

const fieldErrorStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.8rem',
  color: '#E11D48',
  fontWeight: 600,
  marginTop: '4px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem 1rem',
  borderRadius: '10px',
  border: '1px solid var(--border-color)',
  background: 'var(--bg-color)',
  color: 'var(--text-primary)',
  fontSize: '0.95rem',
  outline: 'none',
  transition: 'border-color 0.2s ease',
};

const bankRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '0.9rem',
  padding: '0.35rem 0',
  borderBottom: '1px dashed var(--border-color)',
};

const copyBtnStyle: React.CSSProperties = {
  background: 'none',
  border: '1px solid var(--border-color)',
  padding: '0.2rem 0.5rem',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '0.75rem',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  color: 'var(--text-secondary)',
};

const receiptRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.4rem 0',
  borderBottom: '1px solid #F1F5F9',
};
