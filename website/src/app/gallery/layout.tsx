import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Media Archive - Photos & Videos of Foundation Initiatives',
  description: 'View photos and video archives of Leimarembi Foundation free health camps, cultural festivals, senior citizen check-ups, and community empowerment events in Assam.',
  path: '/gallery',
});

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
