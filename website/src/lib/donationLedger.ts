// Official Donation Ledger for Leimarembi Foundation
// Contains the 12 verified donors from the official Foundation record (Head Office: Guwahati)
// Provides live persistence and cross-tab real-time synchronization

export interface DonationRecord {
  publicDonationId: string;
  receiptNo: string;
  donorName: string;
  location: string;
  email?: string;
  phone?: string;
  amount: number;
  currency: string;
  date: string;
  createdAt: string;
  purpose: string;
  status: 'SUCCESS' | 'PENDING' | 'EXPIRED' | 'CANCELLED';
  paymentMethod: string;
  verifiedBy?: string;
}

// 12 Official Donors from the verified Foundation List (Manipuri Rajbari, Guwahati - 781007)
export const OFFICIAL_SEED_DONATIONS: DonationRecord[] = [
  {
    publicDonationId: 'DON-20260826-001',
    receiptNo: '001',
    donorName: 'Mr. Dhrubajyoti Saikia',
    location: 'Mangoldai, Assam',
    amount: 1000,
    currency: 'INR',
    date: '26 August 2026',
    createdAt: '2026-08-26 10:30 AM',
    purpose: 'Community Welfare & Rural Development',
    status: 'SUCCESS',
    paymentMethod: 'UPI / Bank',
    verifiedBy: 'Leimarembi Head Office Guwahati'
  },
  {
    publicDonationId: 'DON-20260829-004',
    receiptNo: '004',
    donorName: 'Mr. Amarjit Singha',
    location: 'Survey, Guwahati, Assam',
    amount: 1000,
    currency: 'INR',
    date: '29 August 2026',
    createdAt: '2026-08-29 11:15 AM',
    purpose: 'General Charitable Corpus',
    status: 'SUCCESS',
    paymentMethod: 'UPI / Bank',
    verifiedBy: 'Leimarembi Head Office Guwahati'
  },
  {
    publicDonationId: 'DON-20260830-005',
    receiptNo: '005',
    donorName: 'S. Nilkumar Singha',
    location: 'Chandpur, Cachar, Assam',
    amount: 500,
    currency: 'INR',
    date: '30 August 2026',
    createdAt: '2026-08-30 02:40 PM',
    purpose: 'Rural Health & Senior Citizen Support',
    status: 'SUCCESS',
    paymentMethod: 'UPI / Bank',
    verifiedBy: 'Leimarembi Head Office Guwahati'
  },
  {
    publicDonationId: 'DON-20260830-003',
    receiptNo: '003',
    donorName: 'J. A. Choudhury',
    location: 'Sribhumi, Assam',
    amount: 1000,
    currency: 'INR',
    date: '30 August 2026',
    createdAt: '2026-08-30 04:20 PM',
    purpose: 'Education & Cultural Heritage',
    status: 'SUCCESS',
    paymentMethod: 'Direct Bank Transfer',
    verifiedBy: 'Leimarembi Head Office Guwahati'
  },
  {
    publicDonationId: 'DON-20260905-006',
    receiptNo: '006',
    donorName: 'Mr. Ajoy Barman',
    location: 'Mangoldai',
    amount: 500,
    currency: 'INR',
    date: '5 Sept. 2026',
    createdAt: '2026-09-05 09:50 AM',
    purpose: 'General Community Development',
    status: 'SUCCESS',
    paymentMethod: 'UPI / Bank',
    verifiedBy: 'Leimarembi Head Office Guwahati'
  },
  {
    publicDonationId: 'DON-20260908-008',
    receiptNo: '008',
    donorName: 'Yendrembam Raju Singha.',
    location: 'Haflong',
    amount: 301,
    currency: 'INR',
    date: '8 Sept. 2026',
    createdAt: '2026-09-08 10:10 AM',
    purpose: 'Foundation Welfare Contribution',
    status: 'SUCCESS',
    paymentMethod: 'UPI / Bank',
    verifiedBy: 'Leimarembi Head Office Guwahati'
  },
  {
    publicDonationId: 'DON-20260908-009',
    receiptNo: '009',
    donorName: 'Loitangbam Biswajit Singha.',
    location: 'Cachar, Silchar',
    amount: 2000,
    currency: 'INR',
    date: '8 Sept. 2026',
    createdAt: '2026-09-08 11:35 AM',
    purpose: 'Senior Citizen Medical Aid & Diagnostic Support',
    status: 'SUCCESS',
    paymentMethod: 'UPI / Bank',
    verifiedBy: 'Leimarembi Head Office Guwahati'
  },
  {
    publicDonationId: 'DON-20260908-010',
    receiptNo: '010',
    donorName: 'Khaidem Surjya Kumar Singha.',
    location: 'Kolasib, Mizoram',
    amount: 1000,
    currency: 'INR',
    date: '8 Sept. 2026',
    createdAt: '2026-09-08 12:45 PM',
    purpose: 'Education & Tribal Welfare',
    status: 'SUCCESS',
    paymentMethod: 'Direct Bank Transfer',
    verifiedBy: 'Leimarembi Head Office Guwahati'
  },
  {
    publicDonationId: 'DON-20260908-011',
    receiptNo: '011',
    donorName: 'Sahab Uddin Ahmed , Former MLA Jaleswar LAC.',
    location: 'Goalpara , Jaleswar',
    amount: 500,
    currency: 'INR',
    date: '8 Sept. 2026',
    createdAt: '2026-09-08 02:20 PM',
    purpose: 'Community Outreach & Welfare Program',
    status: 'SUCCESS',
    paymentMethod: 'Direct Bank Transfer',
    verifiedBy: 'Leimarembi Head Office Guwahati'
  },
  {
    publicDonationId: 'DON-20260909-012',
    receiptNo: '012',
    donorName: 'Mutum Nilchandra Singha.',
    location: 'Hojai',
    amount: 300,
    currency: 'INR',
    date: '9 Sept. 2026',
    createdAt: '2026-09-09 03:15 PM',
    purpose: 'General Foundation Support',
    status: 'SUCCESS',
    paymentMethod: 'UPI / Bank',
    verifiedBy: 'Leimarembi Head Office Guwahati'
  },
  {
    publicDonationId: 'DON-20260910-013',
    receiptNo: '013',
    donorName: 'Laisram Pankaj Singha .',
    location: 'Cachar , Silchar',
    amount: 1000,
    currency: 'INR',
    date: '10 Sept. 2026',
    createdAt: '2026-09-10 11:00 AM',
    purpose: 'Rural Development Fund',
    status: 'SUCCESS',
    paymentMethod: 'UPI / Bank',
    verifiedBy: 'Leimarembi Head Office Guwahati'
  },
  {
    publicDonationId: 'DON-20260910-014',
    receiptNo: '014',
    donorName: 'K M Gopal Sana Raj Kumar.',
    location: 'Cachar , Silchar',
    amount: 7000,
    currency: 'INR',
    date: '10 Sept. 2026',
    createdAt: '2026-09-10 01:30 PM',
    purpose: 'Heritage Preservation & Main Corpus',
    status: 'SUCCESS',
    paymentMethod: 'Direct Bank Transfer',
    verifiedBy: 'Leimarembi Head Office Guwahati'
  }
];

const STORAGE_KEY = 'lf_donations';

export function getDonations(): DonationRecord[] {
  if (typeof window === 'undefined') return OFFICIAL_SEED_DONATIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  // Initialize storage with official 12 seed records
  saveDonations(OFFICIAL_SEED_DONATIONS);
  return OFFICIAL_SEED_DONATIONS;
}

export function saveDonations(donations: DonationRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(donations));
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('lf_donation_updated', { detail: donations }));
  } catch {}
}

export function recordNewDonation(entry: Omit<DonationRecord, 'publicDonationId' | 'createdAt'>): DonationRecord {
  const current = getDonations();
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const seq = Math.floor(1000 + Math.random() * 9000);
  const newDonation: DonationRecord = {
    ...entry,
    publicDonationId: `DON-${dateStr}-${seq}`,
    createdAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
  };
  const updated = [newDonation, ...current];
  saveDonations(updated);
  return newDonation;
}
