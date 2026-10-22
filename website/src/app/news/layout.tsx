import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'News & Announcements - Community Bulletins',
  description: 'Read the latest press releases, health camp schedules, meeting outcomes, and developmental notices from Leimarembi Foundation.',
  path: '/news',
});

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
