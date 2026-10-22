import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'AI Heritage Assistant - Digital Cultural & Governance Guide',
  description: 'Interactive AI Assistant for Leimarembi Foundation. Ask questions about Section 80G tax benefits, rural healthcare schedules, indigenous Manipuri traditions, and community grants.',
  path: '/ai',
});

export default function AiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
