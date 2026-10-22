import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'PFMS Grant Tracker & Government Welfare Schemes',
  description: 'Monitor central government grants, NITI Aayog NGO DARPAN schemes, CSR community development funds, and tribal welfare opportunities for Northeast India.',
  path: '/grants',
});

export default function GrantsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
