import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Support & Donate - 50% Tax Exemption Under Section 80G',
  description: 'Contribute to rural health camps, senior citizen welfare, and indigenous cultural preservation. All donations eligible for 50% tax deduction under Section 80G of the Income Tax Act.',
  path: '/donate',
});

export default function DonateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
